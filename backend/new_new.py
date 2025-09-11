"""
meal_planner.py
Interactive pipeline:
- Loads foods.csv
- Trains a dessert classifier in a separate directory
- Asks user for profile inputs in terminal
- Generates weekly meal plan (1 breakfast, 1 lunch, 1 dinner per day)
- Saves plan to CSV
"""

import os
import random
import json
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset, DatasetDict
import pulp
import joblib

# -------------------------
# 1) Ayurvedic rules & nutrient requirements
# -------------------------
def ayurvedic_rules(age, gender, prakriti, vikriti, season, tod):
    adjustments = {"Vata": 0, "Pitta": 0, "Kapha": 0}
    if age < 30:
        adjustments["Kapha"] += 1
    elif age < 60:
        adjustments["Pitta"] += 1
    else:
        adjustments["Vata"] += 1
    if 6 <= tod < 10 or 18 <= tod < 22:
        adjustments["Kapha"] += 1
    elif 10 <= tod < 14 or 22 <= tod < 2:
        adjustments["Pitta"] += 1
    else:
        adjustments["Vata"] += 1
    if season == "summer":
        adjustments["Pitta"] += 1
    elif season == "winter":
        adjustments["Kapha"] += 1
    elif season in ["autumn", "late_summer"]:
        adjustments["Vata"] += 1
    return adjustments

def nutrient_requirements(age, weight, height, gender, activity, goal):
    if gender.lower() == "male":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    activity_factor = {"sedentary": 1.2, "light": 1.375, "moderate": 1.55,
                       "active": 1.725, "athlete": 1.9}
    tdee = bmr * activity_factor.get(activity, 1.2)
    if goal == "loss":
        target_cal = tdee - 500
    elif goal == "gain":
        target_cal = tdee + 300
    else:
        target_cal = tdee
    if goal == "loss":
        protein = 2.0 * weight
    elif goal == "gain":
        protein = 2.2 * weight
    else:
        protein = 1.5 * weight
    fat = 0.25 * target_cal / 9
    carbs = (target_cal - (protein * 4 + fat * 9)) / 4
    return target_cal, protein, fat, carbs

# -------------------------
# 2) Dosha sign mapping
# -------------------------
def sign_to_effect(sign):
    if pd.isna(sign):
        return 0
    s = str(sign).strip()
    if s == '+':
        return 1
    if s == '-':
        return -1
    return 0

# -------------------------
# 3) Enhanced dessert detection labeling
# -------------------------
DESSERT_KEYWORDS = [
    'gulab jamun', 'rasgulla', 'mysore pak', 'jalebi', 'kheer', 'halwa', 
    'barfi', 'laddu', 'rasmalai', 'sandesh', 'shrikhand', 'kulfi', 
    'payasam', 'modak', 'peda', 'rabri', 'gajar halwa', 'sohan papdi',
    'malpua', 'shahi tukda', 'double ka meetha', 'basundi', 'gulab jamun',
    'mithai', 'sweet', 'dessert', 'mithai', 'mitha', 'meetha'
]

BREAKFAST_KEYWORDS = [
    'dosa', 'idli', 'pancake', 'pancakes', 'upma', 'poha', 'porridge', 
    'toast', 'omelette', 'masala', 'masala dosa', 'paratha', 'pesarattu',
    'pongal', 'appam', 'uttapam', 'vada', 'sambar', 'chutney'
]

def enhanced_dessert_label(row):
    """Enhanced labeling function specifically for dessert detection"""
    name = str(row['name_common']).lower()
    
    # First check for dessert keywords
    for keyword in DESSERT_KEYWORDS:
        if keyword in name:
            return "dessert"
    
    # Check for breakfast keywords (non-dessert)
    for keyword in BREAKFAST_KEYWORDS:
        if keyword in name:
            return "non_dessert"
    
    # Check nutritional properties
    cals = float(row.get('calories_kcal', 0) or 0)
    sugar = float(row.get('sugar_g', 0) or 0)
    carbs = float(row.get('carbs_g', 0) or 0)
    protein = float(row.get('protein_g', 0) or 0)
    
    # High sugar/carb, low protein often indicates dessert
    if (sugar > 15 or carbs > 40) and protein < 8:
        return "dessert"
    
    # Low protein, moderate carbs might be dessert
    if protein < 5 and carbs > 25:
        return "dessert"
    
    return "non_dessert"

# -------------------------
# 4) Train dessert classifier
# -------------------------
def train_dessert_classifier(df, out_dir, model_name="distilbert-base-uncased", epochs=3, batch_size=16):
    """Train a specialized classifier for dessert detection"""
    print("Training new dessert classifier...")
    
    df = df.copy()
    df['label'] = df.apply(enhanced_dessert_label, axis=1)
    
    label_encoder = LabelEncoder()
    df['label_id'] = label_encoder.fit_transform(df['label'])
    
    # Create text features for classification
    df['text'] = (
        df['name_common'].astype(str) + " | " + 
        df['country'].astype(str) + " | " +
        "Calories: " + df['calories_kcal'].astype(str) + " | " +
        "Protein: " + df['protein_g'].astype(str) + " | " +
        "Carbs: " + df['carbs_g'].astype(str)
    )
    
    # Split data
    train_df, val_df = train_test_split(df, test_size=0.15, random_state=42, stratify=df['label_id'])
    
    def to_hf(ds):
        return Dataset.from_pandas(ds[['text','label_id']].rename(columns={'label_id':'label'}))
    
    ds = DatasetDict({
        'train': to_hf(train_df.reset_index(drop=True)),
        'validation': to_hf(val_df.reset_index(drop=True))
    })
    
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    def tokenize_fn(ex):
        return tokenizer(ex['text'], truncation=True, padding='max_length', max_length=128)
    
    ds = ds.map(tokenize_fn, batched=True)
    ds = ds.rename_column("label", "labels")
    ds.set_format(type='torch', columns=['input_ids','attention_mask','labels'])
    
    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=len(label_encoder.classes_))
    
    training_args = TrainingArguments(
        output_dir=out_dir,
        eval_strategy="steps",
        eval_steps=200,
        save_steps=200,
        logging_steps=50,
        per_device_train_batch_size=batch_size,
        per_device_eval_batch_size=batch_size,
        num_train_epochs=epochs,
        weight_decay=0.01,
        load_best_model_at_end=True,
        metric_for_best_model="accuracy",
        greater_is_better=True,
    )
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=ds['train'],
        eval_dataset=ds['validation'],
        tokenizer=tokenizer,
    )
    
    trainer.train()
    trainer.save_model()
    tokenizer.save_pretrained(out_dir)
    joblib.dump(label_encoder, os.path.join(out_dir, "label_encoder.joblib"))
    
    meta = {
        "label_classes": list(label_encoder.classes_),
        "label_map": {c: int(i) for i, c in enumerate(label_encoder.classes_)},
        "model_type": "dessert_classifier"
    }
    
    with open(os.path.join(out_dir, "meta.json"), "w") as f:
        json.dump(meta, f, indent=2)
    
    print(f"Dessert classifier trained and saved to {out_dir}")
    print(f"Class distribution: {dict(df['label'].value_counts())}")
    
    return out_dir

# -------------------------
# 5) Load dessert classifier
# -------------------------
def load_dessert_classifier(model_dir):
    """Load the specialized dessert classifier"""
    tokenizer = AutoTokenizer.from_pretrained(model_dir)
    model = AutoModelForSequenceClassification.from_pretrained(model_dir)
    label_encoder = joblib.load(os.path.join(model_dir, "label_encoder.joblib"))
    
    meta_path = os.path.join(model_dir, "meta.json")
    meta = {}
    if os.path.exists(meta_path):
        meta = json.load(open(meta_path))
    
    return tokenizer, model, label_encoder, meta

def predict_dessert(text, tokenizer, model, label_encoder, device=None):
    """Predict if a food is dessert or not"""
    device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)
    
    enc = tokenizer(text, truncation=True, padding='max_length', max_length=128, return_tensors='pt')
    for k, v in enc.items():
        enc[k] = v.to(device)
    
    model.eval()
    with torch.no_grad():
        out = model(**enc)
        pred = torch.argmax(out.logits, dim=-1).cpu().item()
    
    return label_encoder.inverse_transform([pred])[0]

# -------------------------
# 6) Dosha penalty
# -------------------------
def food_dosha_penalty(food_row, person_vikriti, person_prakriti):
    vikriti = person_vikriti
    prakriti = person_prakriti
    penalty = 0
    for d in ['Vata','Pitta','Kapha']:
        sign = sign_to_effect(food_row.get(d, 0))
        if vikriti and d.lower() == str(vikriti).lower():
            if sign == 1:
                penalty += 3
            elif sign == -1:
                penalty -= 1
        if prakriti and d.lower() == str(prakriti).lower():
            if sign == -1:
                penalty -= 0.5
    return penalty

# -------------------------
# 7) Calculate portion sizes
# -------------------------
def calculate_portion_sizes(target_cal, target_protein, target_fat, target_carbs):
    """Calculate portion sizes for breakfast, lunch, and dinner"""
    # Distribution: breakfast 25%, lunch 35%, dinner 40%
    breakfast_cal = target_cal * 0.25
    lunch_cal = target_cal * 0.35
    dinner_cal = target_cal * 0.40
    
    breakfast_protein = target_protein * 0.25
    lunch_protein = target_protein * 0.35
    dinner_protein = target_protein * 0.40
    
    breakfast_fat = target_fat * 0.25
    lunch_fat = target_fat * 0.35
    dinner_fat = target_fat * 0.40
    
    breakfast_carbs = target_carbs * 0.25
    lunch_carbs = target_carbs * 0.35
    dinner_carbs = target_carbs * 0.40
    
    return {
        'breakfast': {'calories': breakfast_cal, 'protein': breakfast_protein, 'fat': breakfast_fat, 'carbs': breakfast_carbs},
        'lunch': {'calories': lunch_cal, 'protein': lunch_protein, 'fat': lunch_fat, 'carbs': lunch_carbs},
        'dinner': {'calories': dinner_cal, 'protein': dinner_protein, 'fat': dinner_fat, 'carbs': dinner_carbs}
    }

# -------------------------
# 8) Weekly planner with dessert detection
# -------------------------
def plan_weekly_meals(df_foods, dessert_tokenizer=None, dessert_model=None, dessert_label_encoder=None,
                      person_profile=None, days=7):
    age = person_profile['age']
    weight = person_profile['weight']
    height = person_profile['height']
    gender = person_profile['gender']
    activity = person_profile.get('activity','sedentary')
    goal = person_profile.get('goal','maintain')
    target_cal, target_protein, target_fat, target_carbs = nutrient_requirements(age, weight, height, gender, activity, goal)

    # Calculate portion sizes
    portion_sizes = calculate_portion_sizes(target_cal, target_protein, target_fat, target_carbs)

    # --- Filter only Indian foods ---
    foods = df_foods[df_foods['country'].str.lower() == 'indian'].copy().reset_index(drop=True)
    if foods.empty:
        raise ValueError("No Indian foods available in the dataset!")

    vikriti = person_profile.get('vikriti', None)
    prakriti = person_profile.get('prakriti', None)
    
    # Calculate dosha scores for each food
    dosha_scores = [food_dosha_penalty(foods.loc[i], vikriti, prakriti) for i in range(len(foods))]
    foods['dosha_score'] = dosha_scores
    
    # Predict dessert/non-dessert using the specialized classifier
    print("Classifying foods as dessert or non-dessert...")
    dessert_predictions = []
    for i in range(len(foods)):
        text = (
            f"{foods.at[i, 'name_common']} | {foods.at[i, 'country']} | "
            f"Calories: {foods.at[i, 'calories_kcal']} | "
            f"Protein: {foods.at[i, 'protein_g']} | "
            f"Carbs: {foods.at[i, 'carbs_g']}"
        )
        try:
            prediction = predict_dessert(text, dessert_tokenizer, dessert_model, dessert_label_encoder)
            dessert_predictions.append(prediction)
        except Exception as e:
            print(f"Error predicting for {foods.at[i, 'name_common']}: {e}")
            dessert_predictions.append("non_dessert")
    
    foods['is_dessert'] = dessert_predictions
    
    # Separate foods
    dessert_foods = foods[foods['is_dessert'] == 'dessert'].copy()
    non_dessert_foods = foods[foods['is_dessert'] == 'non_dessert'].copy()
    
    # Further categorize non-dessert foods using simple heuristics
    breakfast_foods = []
    lunch_foods = []
    dinner_foods = []
    
    for _, food in non_dessert_foods.iterrows():
        name = str(food['name_common']).lower()
        cals = float(food.get('calories_kcal', 0) or 0)
        protein = float(food.get('protein_g', 0) or 0)
        
        # Simple categorization
        if any(keyword in name for keyword in BREAKFAST_KEYWORDS) or cals <= 250:
            breakfast_foods.append(food)
        elif protein >= 15 or cals >= 300:
            dinner_foods.append(food)
        else:
            lunch_foods.append(food)
    
    # Convert back to DataFrames
    breakfast_foods = pd.DataFrame(breakfast_foods) if breakfast_foods else non_dessert_foods.copy()
    lunch_foods = pd.DataFrame(lunch_foods) if lunch_foods else non_dessert_foods.copy()
    dinner_foods = pd.DataFrame(dinner_foods) if dinner_foods else non_dessert_foods.copy()
    dessert_foods = dessert_foods if not dessert_foods.empty else pd.DataFrame()
    
    # Shuffle foods to ensure variety
    breakfast_foods = breakfast_foods.sample(frac=1).reset_index(drop=True)
    lunch_foods = lunch_foods.sample(frac=1).reset_index(drop=True)
    dinner_foods = dinner_foods.sample(frac=1).reset_index(drop=True)
    if not dessert_foods.empty:
        dessert_foods = dessert_foods.sample(frac=1).reset_index(drop=True)
    
    # Create meal plan
    rows = []
    used_food_ids = set()
    
    for day in range(days):
        # Breakfast (non-dessert)
        breakfast_candidate = None
        for _, food in breakfast_foods.iterrows():
            if food['food_id'] not in used_food_ids:
                breakfast_candidate = food
                used_food_ids.add(food['food_id'])
                break
        
        # Lunch (non-dessert)
        lunch_candidate = None
        for _, food in lunch_foods.iterrows():
            if food['food_id'] not in used_food_ids:
                lunch_candidate = food
                used_food_ids.add(food['food_id'])
                break
        
        # Dinner (non-dessert)
        dinner_candidate = None
        for _, food in dinner_foods.iterrows():
            if food['food_id'] not in used_food_ids:
                dinner_candidate = food
                used_food_ids.add(food['food_id'])
                break
        
        # Dessert (only for dinner, max 1 per day)
        dessert_candidate = None
        if not dessert_foods.empty:
            for _, food in dessert_foods.iterrows():
                if food['food_id'] not in used_food_ids:
                    dessert_candidate = food
                    used_food_ids.add(food['food_id'])
                    break
        
        # Add to plan
        for meal, food in [
            ('breakfast', breakfast_candidate),
            ('lunch', lunch_candidate),
            ('dinner', dinner_candidate),
            ('dessert', dessert_candidate)
        ]:
            if food is not None:
                rows.append({
                    "day": day,
                    "meal": meal,
                    "food_id": food.get('food_id'),
                    "name_common": food.get('name_common'),
                    "calories_kcal": float(food.get('calories_kcal') or 0),
                    "protein_g": float(food.get('protein_g') or 0),
                    "fat_g": float(food.get('fat_g') or 0),
                    "carbs_g": float(food.get('carbs_g') or 0),
                    "country": food.get('country'),
                    "portion": 1,
                    "is_dessert": food.get('is_dessert', 'non_dessert') if meal == 'dessert' else 'non_dessert'
                })

    plan_df = pd.DataFrame(rows)
    
    # Calculate daily totals
    totals = []
    for day in range(days):
        tmp = plan_df[plan_df['day'] == day]
        totals.append({
            "day": day,
            "calories": tmp['calories_kcal'].sum(),
            "protein": tmp['protein_g'].sum(),
            "fat": tmp['fat_g'].sum(),
            "carbs": tmp['carbs_g'].sum(),
        })
    totals_df = pd.DataFrame(totals)
    
    return plan_df, totals_df, portion_sizes

# -------------------------
# 9) Interactive main
# -------------------------
def main():
    import sys
    
    # Create directory for dessert model
    dessert_model_dir = "dessert_model_dir"
    os.makedirs(dessert_model_dir, exist_ok=True)
    
    # Always train a new dessert classifier
    print("Training new dessert classifier...")
    if not os.path.exists("foods.csv"):
        print("Error: foods.csv not found. Exiting.")
        sys.exit(1)
    
    df_foods = pd.read_csv("foods.csv")
    train_dessert_classifier(df_foods, out_dir=dessert_model_dir)
    
    # Load the newly trained dessert classifier
    dessert_tokenizer, dessert_model, dessert_label_encoder, dessert_meta = load_dessert_classifier(dessert_model_dir)
    
    # User input
    print("\nPlease enter your profile information:")

    def input_int(prompt, default=None):
        while True:
            val = input(f"{prompt} [{default}]: ").strip()
            if val == "" and default is not None:
                return default
            try: return int(val)
            except ValueError: print("Invalid input. Enter an integer.")

    def input_float(prompt, default=None):
        while True:
            val = input(f"{prompt} [{default}]: ").strip()
            if val == "" and default is not None:
                return default
            try: return float(val)
            except ValueError: print("Invalid input. Enter a number.")

    def input_str(prompt, default=None, options=None):
        while True:
            val = input(f"{prompt} [{default}]: ").strip()
            if val == "" and default is not None:
                return default
            if options and val.lower() not in [o.lower() for o in options]:
                print(f"Invalid input. Choose from: {options}")
            else: return val

    age = input_int("Age (years)", 30)
    gender = input_str("Gender (male/female)", "male", ["male","female"])
    weight = input_float("Weight (kg)", 70)
    height = input_float("Height (cm)", 170)
    activity = input_str("Activity level (sedentary/light/moderate/active/athlete)", "moderate",
                         ["sedentary","light","moderate","active","athlete"])
    goal = input_str("Goal (maintain/loss/gain)", "maintain", ["maintain","loss","gain"])
    prakriti = input_str("Prakriti (Vata/Pitta/Kapha)", None, ["Vata","Pitta","Kapha"])
    vikriti = input_str("Vikriti (Vata/Pitta/Kapha)", None, ["Vata","Pitta","Kapha"])
    season = input_str("Season (summer/winter/autumn/late_summer/spring)", "autumn",
                       ["summer","winter","autumn","late_summer","spring"])
    tod = input_int("Time of day (0-23)", 8)

    profile = {"age": age, "gender": gender, "weight": weight, "height": height,
               "activity": activity, "goal": goal, "prakriti": prakriti, "vikriti": vikriti,
               "season": season, "tod": tod}

    # Generate meal plan using dessert classifier
    plan_df, totals_df, portion_sizes = plan_weekly_meals(
        df_foods,
        dessert_tokenizer=dessert_tokenizer,
        dessert_model=dessert_model,
        dessert_label_encoder=dessert_label_encoder,
        person_profile=profile
    )

    plan_df.to_csv("weekly_plan.csv", index=False)
    totals_df.to_csv("weekly_totals.csv", index=False)

    print("\nWeekly meal plan saved to weekly_plan.csv")
    print("Daily totals saved to weekly_totals.csv")
    print("\nRecommended portion sizes:")
    for meal, nutrients in portion_sizes.items():
        print(f"{meal.capitalize()}: {nutrients['calories']:.0f} calories, "
              f"{nutrients['protein']:.1f}g protein, {nutrients['fat']:.1f}g fat, "
              f"{nutrients['carbs']:.1f}g carbs")
    
    print("\nSample plan preview:")
    print(plan_df.head(12))
    
    # Show dessert statistics
    dessert_count = len(plan_df[plan_df['meal'] == 'dessert'])
    print(f"\nDesserts included in plan: {dessert_count}")
    if dessert_count > 0:
        print("Desserts in plan:")
        for _, row in plan_df[plan_df['meal'] == 'dessert'].iterrows():
            print(f"  Day {row['day']}: {row['name_common']}")

if __name__ == "__main__":
    main()