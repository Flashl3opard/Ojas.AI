import streamlit as st
import pandas as pd
import os
import sys
from io import StringIO
import contextlib

# Import all functions from model.py
from new_new import (
    ayurvedic_rules, nutrient_requirements, sign_to_effect,
    enhanced_dessert_label, train_dessert_classifier, load_dessert_classifier,
    predict_dessert, food_dosha_penalty, calculate_portion_sizes,
    plan_weekly_meals, DESSERT_KEYWORDS, BREAKFAST_KEYWORDS
)

# Set page config
st.set_page_config(
    page_title="Ayurvedic Meal Planner",
    page_icon="🍽️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #2E86AB;
        text-align: center;
        margin-bottom: 2rem;
    }
    .sub-header {
        font-size: 1.8rem;
        color: #A23B72;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
    .meal-card {
        background-color: #F8F9FA;
        border-radius: 10px;
        padding: 15px;
        margin: 10px 0;
        border-left: 5px solid #2E86AB;
            color: black;
    }
    .dessert-card {
        background-color: #FFF0F5;
        border-left: 5px solid #A23B72;
            color: black;
    }
    .nutrient-box {
        background-color: #E8F4F8;
        border-radius: 5px;
        padding: 10px;
        margin: 5px 0;
            color: black;
    }
    .stButton>button {
        background-color: #2E86AB;
        color: white;
    }
    .portion-info {
        background-color: #E8F4F8;
        border-radius: 5px;
        padding: 10px;
        margin: 5px 0;
        font-size: 0.9rem;
        color: black;
    }
</style>
""", unsafe_allow_html=True)

# App title
st.markdown('<h1 class="main-header">🍽️ Ayurvedic Meal Planner</h1>', unsafe_allow_html=True)
st.markdown("### Personalized weekly meal plans based on Ayurvedic principles")

# Initialize session state
if 'dessert_components' not in st.session_state:
    st.session_state.dessert_components = None
if 'meal_plan' not in st.session_state:
    st.session_state.meal_plan = None
if 'totals' not in st.session_state:
    st.session_state.totals = None
if 'portion_sizes' not in st.session_state:
    st.session_state.portion_sizes = None
if 'model_loaded' not in st.session_state:
    st.session_state.model_loaded = False

# Function to calculate portion sizes in grams
def calculate_portion_grams(food, target_nutrients, meal_type):
    """
    Calculate portion size in grams based on nutritional content
    """
    # Base portion size (grams)
    base_portion = 100
    
    # Get food nutrients per 100g
    calories_per_100g = food.get('calories_kcal', 0) or 0
    protein_per_100g = food.get('protein_g', 0) or 0
    carbs_per_100g = food.get('carbs_g', 0) or 0
    fat_per_100g = food.get('fat_g', 0) or 0
    
    # If we have no nutritional data, return base portion
    if calories_per_100g == 0:
        return base_portion
    
    # Calculate how many grams needed to meet calorie target
    calories_needed = target_nutrients['calories']
    portion_grams = (calories_needed / calories_per_100g) * 100
    
    # Apply some constraints
    min_portion = 80  # Minimum portion size in grams
    max_portion = 300  # Maximum portion size in grams
    
    # Adjust for meal type
    if meal_type == 'breakfast':
        max_portion = 250
    elif meal_type == 'lunch':
        max_portion = 350
    elif meal_type == 'dinner':
        max_portion = 300
    
    # Ensure portion is within reasonable limits
    portion_grams = max(min_portion, min(max_portion, portion_grams))
    
    # Round to nearest 25g for practicality
    portion_grams = round(portion_grams / 25) * 25
    
    return int(portion_grams)

# Load the pre-trained dessert classifier
def load_dessert_model():
    try:
        model_dir = "dessert_model_dir"
        if os.path.exists(model_dir):
            # Check if the directory contains model files
            model_files = os.listdir(model_dir)
            if not any(f.endswith('.json') for f in model_files):
                st.error("Model directory exists but doesn't contain model files.")
                return None, None, None
                
            dessert_tokenizer, dessert_model, dessert_label_encoder, dessert_meta = load_dessert_classifier(model_dir)
            st.success("Dessert classifier loaded successfully!")
            return dessert_tokenizer, dessert_model, dessert_label_encoder
        else:
            st.error("Pre-trained model directory 'dessert_model_dir' not found.")
            return None, None, None
    except Exception as e:
        st.error(f"Error loading model: {str(e)}")
        return None, None, None

# Load model on app start
if not st.session_state.model_loaded:
    with st.spinner("Loading pre-trained dessert classifier..."):
        dessert_tokenizer, dessert_model, dessert_label_encoder = load_dessert_model()
        if dessert_tokenizer is not None:
            st.session_state.dessert_components = (dessert_tokenizer, dessert_model, dessert_label_encoder)
            st.session_state.model_loaded = True

# Sidebar for user inputs
with st.sidebar:
    st.header("User Profile")
    
    # File upload
    st.subheader("Upload Foods Data")
    uploaded_file = st.file_uploader("Choose foods.csv", type="csv")
    
    if uploaded_file is not None:
        df_foods = pd.read_csv(uploaded_file)
        st.success(f"Loaded {len(df_foods)} food items")
        
        # Show a preview of the data
        with st.expander("Preview food data"):
            st.dataframe(df_foods.head(5))
    else:
        st.info("Please upload a foods.csv file to continue")
        st.stop()
    
    # User inputs
    st.subheader("Personal Information")
    age = st.slider("Age", 18, 100, 30)
    gender = st.radio("Gender", ["male", "female"], index=0)
    weight = st.slider("Weight (kg)", 40, 150, 70)
    height = st.slider("Height (cm)", 140, 210, 170)
    
    st.subheader("Lifestyle & Goals")
    activity = st.selectbox(
        "Activity Level",
        ["sedentary", "light", "moderate", "active", "athlete"],
        index=2
    )
    goal = st.radio("Goal", ["maintain", "loss", "gain"], index=0)
    
    st.subheader("Ayurvedic Profile")
    prakriti = st.selectbox("Prakriti", ["Vata", "Pitta", "Kapha"], index=0)
    vikriti = st.selectbox("Vikriti", ["Vata", "Pitta", "Kapha", "None"], index=3)
    if vikriti == "None":
        vikriti = None
    
    season = st.selectbox(
        "Season",
        ["summer", "winter", "autumn", "late_summer", "spring"],
        index=2
    )
    tod = st.slider("Time of day (hour)", 0, 23, 8)
    
    # Create profile dictionary
    profile = {
        "age": age, "gender": gender, "weight": weight, "height": height,
        "activity": activity, "goal": goal, "prakriti": prakriti, 
        "vikriti": vikriti, "season": season, "tod": tod
    }
    
    # Calculate nutrient requirements
    target_cal, protein, fat, carbs = nutrient_requirements(
        age, weight, height, gender, activity, goal
    )
    
    # Display nutrient info
    st.subheader("Daily Nutrient Targets")
    st.metric("Calories", f"{target_cal:.0f} kcal")
    st.metric("Protein", f"{protein:.1f} g")
    st.metric("Fat", f"{fat:.1f} g")
    st.metric("Carbs", f"{carbs:.1f} g")
    
    # Generate plan button
    if st.button("🚀 Generate Meal Plan", type="primary"):
        if st.session_state.dessert_components is None:
            st.error("Dessert classifier not loaded. Please check if 'dessert_model_dir' exists with the correct model files.")
        else:
            dessert_tokenizer, dessert_model, dessert_label_encoder = st.session_state.dessert_components
            
            with st.spinner("Generating your personalized meal plan..."):
                try:
                    plan_df, totals_df, portion_sizes = plan_weekly_meals(
                        df_foods,
                        dessert_tokenizer=dessert_tokenizer,
                        dessert_model=dessert_model,
                        dessert_label_encoder=dessert_label_encoder,
                        person_profile=profile
                    )
                    
                    # Add portion sizes in grams to the meal plan
                    if not plan_df.empty:
                        # Create a copy to avoid modifying the original
                        plan_df_with_portions = plan_df.copy()
                        
                        # Add portion sizes in grams
                        portion_grams_list = []
                        for _, row in plan_df.iterrows():
                            meal_type = row['meal']
                            if meal_type in portion_sizes:
                                portion_grams = calculate_portion_grams(
                                    row, portion_sizes[meal_type], meal_type
                                )
                                portion_grams_list.append(portion_grams)
                            else:
                                portion_grams_list.append(100)  # Default portion size
                        
                        plan_df_with_portions['portion_grams'] = portion_grams_list
                        
                        # Store results in session state
                        st.session_state.meal_plan = plan_df_with_portions
                        st.session_state.totals = totals_df
                        st.session_state.portion_sizes = portion_sizes
                    
                    st.success("Meal plan generated successfully!")
                    
                except Exception as e:
                    st.error(f"Error generating meal plan: {str(e)}")
                    st.error("This might be due to missing meals in the dataset. Try uploading a more comprehensive foods.csv file.")

# Main content area
if st.session_state.meal_plan is not None:
    plan_df = st.session_state.meal_plan
    totals_df = st.session_state.totals
    portion_sizes = st.session_state.portion_sizes
    
    # Display portion sizes
    st.markdown('<h2 class="sub-header">Recommended Portion Sizes</h2>', unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown("**Breakfast**")
        st.markdown(f"""
        <div class="nutrient-box">
            Calories: {portion_sizes['breakfast']['calories']:.0f} kcal<br>
            Protein: {portion_sizes['breakfast']['protein']:.1f} g<br>
            Fat: {portion_sizes['breakfast']['fat']:.1f} g<br>
            Carbs: {portion_sizes['breakfast']['carbs']:.1f} g<br>
            <div class="portion-info">Recommended portion: ~250g</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("**Lunch**")
        st.markdown(f"""
        <div class="nutrient-box">
            Calories: {portion_sizes['lunch']['calories']:.0f} kcal<br>
            Protein: {portion_sizes['lunch']['protein']:.1f} g<br>
            Fat: {portion_sizes['lunch']['fat']:.1f} g<br>
            Carbs: {portion_sizes['lunch']['carbs']:.1f} g<br>
            <div class="portion-info">Recommended portion: ~350g</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("**Dinner**")
        st.markdown(f"""
        <div class="nutrient-box">
            Calories: {portion_sizes['dinner']['calories']:.0f} kcal<br>
            Protein: {portion_sizes['dinner']['protein']:.1f} g<br>
            Fat: {portion_sizes['dinner']['fat']:.1f} g<br>
            Carbs: {portion_sizes['dinner']['carbs']:.1f} g<br>
            <div class="portion-info">Recommended portion: ~300g</div>
        </div>
        """, unsafe_allow_html=True)
    
    # Display weekly meal plan
    st.markdown('<h2 class="sub-header">Weekly Meal Plan</h2>', unsafe_allow_html=True)
    
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    
    for day in range(7):
        st.markdown(f"### {days[day]}")
        
        day_meals = plan_df[plan_df['day'] == day]
        
        # Check if we have all meals
        meals_found = day_meals['meal'].unique()
        
        # Breakfast
        breakfast = day_meals[day_meals['meal'] == 'breakfast']
        if not breakfast.empty:
            meal = breakfast.iloc[0]
            st.markdown(f"""
            <div class="meal-card">
                <b>Breakfast:</b> {meal['name_common']}<br>
                Portion: {meal['portion_grams']}g<br>
                Calories: {meal['calories_kcal']:.0f} kcal | Protein: {meal['protein_g']:.1f}g
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="meal-card">
                <b>Breakfast:</b> No suitable breakfast found in dataset
            </div>
            """, unsafe_allow_html=True)
        
        # Lunch
        lunch = day_meals[day_meals['meal'] == 'lunch']
        if not lunch.empty:
            meal = lunch.iloc[0]
            st.markdown(f"""
            <div class="meal-card">
                <b>Lunch:</b> {meal['name_common']}<br>
                Portion: {meal['portion_grams']}g<br>
                Calories: {meal['calories_kcal']:.0f} kcal | Protein: {meal['protein_g']:.1f}g
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="meal-card">
                <b>Lunch:</b> No suitable lunch found in dataset
            </div>
            """, unsafe_allow_html=True)
        
        # Dinner
        dinner = day_meals[day_meals['meal'] == 'dinner']
        if not dinner.empty:
            meal = dinner.iloc[0]
            st.markdown(f"""
            <div class="meal-card">
                <b>Dinner:</b> {meal['name_common']}<br>
                Portion: {meal['portion_grams']}g<br>
                Calories: {meal['calories_kcal']:.0f} kcal | Protein: {meal['protein_g']:.1f}g
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="meal-card">
                <b>Dinner:</b> No suitable dinner found in dataset
            </div>
            """, unsafe_allow_html=True)
        
        # Dessert
        dessert = day_meals[day_meals['meal'] == 'dessert']
        if not dessert.empty:
            meal = dessert.iloc[0]
            st.markdown(f"""
            <div class="meal-card dessert-card">
                <b>Dessert:</b> {meal['name_common']}<br>
                Portion: {meal['portion_grams']}g<br>
                Calories: {meal['calories_kcal']:.0f} kcal
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown("---")
    
    # Display daily totals
    st.markdown('<h2 class="sub-header">Daily Nutrition Totals</h2>', unsafe_allow_html=True)
    st.dataframe(totals_df.style.format({
        'calories': '{:.0f}',
        'protein': '{:.1f}',
        'fat': '{:.1f}',
        'carbs': '{:.1f}'
    }))
    
    # Download buttons
    col1, col2 = st.columns(2)
    with col1:
        csv_plan = plan_df.to_csv(index=False)
        st.download_button(
            label="Download Meal Plan CSV",
            data=csv_plan,
            file_name="weekly_meal_plan.csv",
            mime="text/csv"
        )
    
    with col2:
        csv_totals = totals_df.to_csv(index=False)
        st.download_button(
            label="Download Nutrition Totals CSV",
            data=csv_totals,
            file_name="weekly_nutrition_totals.csv",
            mime="text/csv"
        )

else:
    # Welcome message
    if st.session_state.model_loaded:
        st.info("""
        👈 Please upload your foods.csv file and fill out your profile information in the sidebar.
        Then click the "Generate Meal Plan" button to create your personalized Ayurvedic meal plan.
        
        This app will use the pre-trained dessert classifier to:
        1. Generate a weekly meal plan tailored to your Ayurvedic profile
        2. Provide detailed nutrition information with portion sizes in grams
        3. Allow you to download your meal plan
        """)
    else:
        st.error("""
        Pre-trained dessert classifier not loaded. 
        Please ensure the 'dessert_model_dir' directory exists with the trained model files.
        """)
        
        if st.button("Try to reload model"):
            with st.spinner("Reloading model..."):
                dessert_tokenizer, dessert_model, dessert_label_encoder = load_dessert_model()
                if dessert_tokenizer is not None:
                    st.session_state.dessert_components = (dessert_tokenizer, dessert_model, dessert_label_encoder)
                    st.session_state.model_loaded = True
                    st.rerun()
    
    # Placeholder for food data preview
    if uploaded_file is not None:
        st.subheader("Food Data Preview")
        st.dataframe(df_foods.head(10))