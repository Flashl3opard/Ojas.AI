import pandas as pd
import pulp
import numpy as np
from transformers import pipeline
from datetime import datetime
import re
from typing import Dict, List, Tuple, Set
import warnings
warnings.filterwarnings('ignore')

class AdvancedAyurvedicMealPlanner:
    def __init__(self, food_data_path: str = "food.csv"):
        """
        Initialize the meal planner with food data and Ayurvedic knowledge
        """
        self.food_df = pd.read_csv(food_data_path)
        self.allergy_classifier = None
        self.setup_allergy_classifier()
        
        # Standard portion size in grams (max 350g per meal)
        self.standard_portion = 250  # grams
        self.max_portion = 350  # grams
        
        # Track used foods to avoid repetition
        self.used_foods = set()
        
        # Taste to dosha mappings
        self.taste_effects = {
            'sweet': {'Vata': '-', 'Pitta': '-', 'Kapha': '+'},
            'sour': {'Vata': '-', 'Pitta': '+', 'Kapha': '+'},
            'salty': {'Vata': '-', 'Pitta': '+', 'Kapha': '+'},
            'pungent': {'Vata': '+', 'Pitta': '+', 'Kapha': '-'},
            'bitter': {'Vata': '+', 'Pitta': '-', 'Kapha': '-'},
            'astringent': {'Vata': '+', 'Pitta': '-', 'Kapha': '-'}
        }
        
        # Map food tastes (simplified for common Indian foods)
        self.food_tastes = {
            'rice': ['sweet'],
            'wheat': ['sweet'],
            'dal': ['sweet', 'astringent'],
            'spinach': ['sweet', 'astringent', 'bitter'],
            'potato': ['sweet'],
            'cauliflower': ['sweet', 'bitter'],
            'eggplant': ['sweet'],
            'chicken': ['sweet'],
            'fish': ['sweet'],
            'milk': ['sweet'],
            'yogurt': ['sour', 'sweet'],
            'ghee': ['sweet'],
            'onion': ['pungent'],
            'garlic': ['pungent'],
            'ginger': ['pungent'],
            'turmeric': ['bitter', 'pungent'],
            'cumin': ['pungent', 'bitter'],
            'coriander': ['sweet', 'bitter'],
            'mustard': ['pungent'],
            'chili': ['pungent'],
            'lemon': ['sour'],
            'mango': ['sweet', 'sour'],
            'banana': ['sweet'],
            'apple': ['sweet', 'astringent']
        }
        
        # Allergy substitution mappings
        self.allergy_substitutions = {
            'dairy': {
                'warning': "Dairy allergy alert: ",
                'substitutions': [
                    "Use plant-based milk (almond, soy, oat) instead of dairy milk",
                    "Use coconut oil or vegetable oil instead of ghee or butter",
                    "Use tofu or plant-based yogurt instead of paneer or yogurt",
                    "Avoid cheese, cream, and butter in preparation"
                ]
            },
            'nuts': {
                'warning': "Nut allergy alert: ",
                'substitutions': [
                    "Avoid almonds, cashews, walnuts, and other nuts",
                    "Use seeds (sunflower, pumpkin) as alternatives where needed",
                    "Check for hidden nuts in gravies and sauces"
                ]
            },
            'gluten': {
                'warning': "Gluten allergy alert: ",
                'substitutions': [
                    "Use gluten-free grains like rice, quinoa, or millet",
                    "Avoid wheat, barley, and rye products",
                    "Use chickpea flour or rice flour instead of wheat flour"
                ]
            },
            'seafood': {
                'warning': "Seafood allergy alert: ",
                'substitutions': [
                    "Avoid fish, shrimp, prawns, and other seafood",
                    "Use plant-based protein sources or poultry as alternatives"
                ]
            },
            'eggs': {
                'warning': "Egg allergy alert: ",
                'substitutions': [
                    "Use flaxseed or chia seed gel as egg substitute in recipes",
                    "Avoid dishes containing eggs as ingredients"
                ]
            }
        }
        
    def setup_allergy_classifier(self):
        """
        Set up the Hugging Face model for allergy classification
        """
        try:
            # Using a zero-shot classification model to check if food contains allergens
            self.allergy_classifier = pipeline(
                "zero-shot-classification",
                model="facebook/bart-large-mnli"
            )
        except Exception as e:
            print(f"Error loading Hugging Face model: {e}")
            print("Using fallback keyword-based allergy detection")
            self.allergy_classifier = None
    
    def determine_age_dosha(self, age: int) -> Dict[str, float]:
        """
        Determine dosha predominance based on age
        """
        if age < 30:
            return {'Vata': 0.8, 'Pitta': 1.0, 'Kapha': 1.5}  # Kapha dominant
        elif age < 60:
            return {'Vata': 1.0, 'Pitta': 1.5, 'Kapha': 0.8}  # Pitta dominant
        else:
            return {'Vata': 1.5, 'Pitta': 1.0, 'Kapha': 0.8}  # Vata dominant
    
    def determine_seasonal_dosha(self, season: str) -> Dict[str, float]:
        """
        Determine dosha accumulation based on season
        """
        seasonal_impact = {
            'spring': {'Vata': 1.0, 'Pitta': 1.0, 'Kapha': 1.5},  # Kapha aggravated
            'summer': {'Vata': 1.0, 'Pitta': 1.5, 'Kapha': 1.0},  # Pitta accumulated
            'monsoon': {'Vata': 1.2, 'Pitta': 1.0, 'Kapha': 1.3},  # Vata and Kapha
            'autumn': {'Vata': 1.5, 'Pitta': 1.0, 'Kapha': 1.0},  # Vata accumulated
            'winter': {'Vata': 1.2, 'Pitta': 1.0, 'Kapha': 1.3}   # Kapha accumulated
        }
        
        season = season.lower()
        return seasonal_impact.get(season, {'Vata': 1.0, 'Pitta': 1.0, 'Kapha': 1.0})
    
    def determine_time_dosha(self, meal_time: str) -> Dict[str, float]:
        """
        Determine dosha influence based on time of day
        """
        time_impact = {
            'breakfast': {'Vata': 1.0, 'Pitta': 1.0, 'Kapha': 1.3},  # Kapha time (6-10am)
            'lunch': {'Vata': 1.0, 'Pitta': 1.5, 'Kapha': 1.0},      # Pitta time (10am-2pm)
            'dinner': {'Vata': 1.2, 'Pitta': 1.0, 'Kapha': 1.3}      # Kapha time (6-10pm)
        }
        
        return time_impact.get(meal_time.lower(), {'Vata': 1.0, 'Pitta': 1.0, 'Kapha': 1.0})
    
    def estimate_food_tastes(self, food_name: str) -> List[str]:
        """
        Estimate the tastes of a food based on its ingredients
        """
        tastes = set()
        food_lower = food_name.lower()
        
        for ingredient, ingredient_tastes in self.food_tastes.items():
            if ingredient in food_lower:
                tastes.update(ingredient_tastes)
        
        # Default to sweet if no tastes identified
        return list(tastes) if tastes else ['sweet']
    
    def calculate_taste_impact(self, tastes: List[str]) -> Dict[str, float]:
        """
        Calculate the dosha impact of a combination of tastes
        """
        impact = {'Vata': 0, 'Pitta': 0, 'Kapha': 0}
        
        for taste in tastes:
            for dosha, effect in self.taste_effects[taste].items():
                if effect == '+':
                    impact[dosha] += 1
                elif effect == '-':
                    impact[dosha] -= 1
        
        # Normalize the impact
        total = sum(abs(val) for val in impact.values()) or 1
        for dosha in impact:
            impact[dosha] = impact[dosha] / total
            
        return impact
    
    def check_allergy(self, food_name: str, allergies: List[str]) -> bool:
        """
        Check if a food contains any allergens using LLM or fallback to keyword matching
        """
        if not allergies:
            return False
            
        if self.allergy_classifier:
            try:
                # Use the model to classify if the food contains allergens
                result = self.allergy_classifier(
                    food_name,
                    candidate_labels=allergies,
                    multi_label=True
                )
                # If any allergy has a score above threshold, consider it allergic
                for label, score in zip(result['labels'], result['scores']):
                    if score > 0.7:  # Confidence threshold
                        return True
                return False
            except Exception as e:
                print(f"Error using allergy classifier: {e}. Falling back to keyword matching")
        
        # Fallback: simple keyword matching
        food_lower = food_name.lower()
        for allergy in allergies:
            if allergy.lower() in food_lower:
                return True
                
            # Common ingredient mappings
            allergy_mappings = {
                'nuts': ['almond', 'cashew', 'walnut', 'pistachio', 'nut'],
                'dairy': ['milk', 'cheese', 'yogurt', 'butter', 'paneer', 'ghee', 'cream'],
                'gluten': ['wheat', 'gluten', 'atta', 'maida'],
                'seafood': ['fish', 'prawn', 'shrimp', 'seafood'],
                'eggs': ['egg', 'andaa']
            }
            
            if allergy.lower() in allergy_mappings:
                for keyword in allergy_mappings[allergy.lower()]:
                    if keyword in food_lower:
                        return True
        
        return False
    
    def generate_allergy_warnings(self, food_name: str, allergies: List[str]) -> List[str]:
        """
        Generate specific warnings and substitutions for foods that might contain allergens
        """
        warnings = []
        food_lower = food_name.lower()
        
        for allergy in allergies:
            allergy_lower = allergy.lower()
            
            # Check if this food might contain or be prepared with the allergen
            if allergy_lower in self.allergy_substitutions:
                # Check for potential allergen ingredients in this food
                allergy_keywords = {
                    'dairy': ['paneer', 'ghee', 'butter', 'milk', 'yogurt', 'cheese', 'cream'],
                    'nuts': ['almond', 'cashew', 'walnut', 'pistachio', 'nut'],
                    'gluten': ['wheat', 'atta', 'maida', 'gluten'],
                    'seafood': ['fish', 'prawn', 'shrimp'],
                    'eggs': ['egg', 'anda']
                }
                
                # Check if this food typically contains the allergen
                contains_allergen = any(keyword in food_lower for keyword in allergy_keywords.get(allergy_lower, []))
                
                # Check if this food is often prepared with the allergen
                prepared_with_allergen = False
                if allergy_lower == 'dairy':
                    # Many Indian dishes are prepared with ghee or butter
                    prepared_with_allergen = any(keyword in food_lower for keyword in ['curry', 'sabzi', 'pulao', 'biryani', 'paratha'])
                
                if contains_allergen or prepared_with_allergen:
                    warning = self.allergy_substitutions[allergy_lower]['warning']
                    substitutions = self.allergy_substitutions[allergy_lower]['substitutions']
                    
                    warnings.append(f"{warning}For '{food_name}', consider: {', '.join(substitutions)}")
        
        return warnings
    
    def filter_foods(self, dietary_pref: str, allergies: List[str]) -> pd.DataFrame:
        """
        Filter foods based on dietary preferences and allergies
        """
        df = self.food_df.copy()
        
        # Filter by dietary preference
        if dietary_pref.lower() == 'vegetarian' or dietary_pref.lower() == 'veg':
            non_veg_keywords = ['chicken', 'mutton', 'fish', 'prawn', 'shrimp', 'egg', 'meat', 'keema']
            mask = ~df['Food Name'].str.lower().str.contains('|'.join(non_veg_keywords))
            df = df[mask]
        elif dietary_pref.lower() == 'vegan':
            non_vegan_keywords = ['chicken', 'mutton', 'fish', 'prawn', 'shrimp', 'egg', 'meat', 'keema', 
                                 'paneer', 'ghee', 'butter', 'milk', 'yogurt', 'cheese', 'cream']
            mask = ~df['Food Name'].str.lower().str.contains('|'.join(non_vegan_keywords))
            df = df[mask]
        
        # Filter by allergies
        if allergies:
            allergic_foods = []
            for _, row in df.iterrows():
                if self.check_allergy(row['Food Name'], allergies):
                    allergic_foods.append(row['Food Name'])
            
            df = df[~df['Food Name'].isin(allergic_foods)]
        
        return df
    
    def calculate_caloric_needs(self, age: int, height: float, weight: float, 
                               gender: str, activity_level: str) -> Tuple[float, float]:
        """
        Calculate daily caloric needs using Mifflin-St Jeor Equation
        Returns: (daily_calories, calories_per_meal)
        """
        # Basal Metabolic Rate (BMR)
        if gender.lower() == 'male':
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:  # female
            bmr = 10 * weight + 6.25 * height - 5 * age - 161
        
        # Activity multiplier
        activity_multipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very active': 1.9
        }
        
        activity = activity_level.lower()
        if activity not in activity_multipliers:
            activity = 'moderate'  # default
        
        daily_calories = bmr * activity_multipliers[activity]
        
        # Calculate calories per meal (3 main meals)
        calories_per_meal = daily_calories / 3
        
        return daily_calories, calories_per_meal
    
    def calculate_portion_size(self, food_calories: float, meal_calories: float) -> float:
        """
        Calculate portion size in grams based on calorie content
        """
        # Calculate how many grams needed to reach meal calorie target
        portion = (meal_calories / food_calories) * self.standard_portion
        
        # Apply maximum portion limit
        portion = min(portion, self.max_portion)
        
        return round(portion, 1)
    
    def optimize_meals(self, filtered_foods: pd.DataFrame, prakriti: str, vikriti: str, 
                      calories_per_meal: float, season: str, meal_type: str, age: int, 
                      weekly_used_foods: Set[str], day_idx: int) -> List[Dict]:
        """
        Use linear programming to optimize meal selection based on advanced dosha balance
        """
        # First, try to find foods that haven't been used yet
        available_foods = filtered_foods[~filtered_foods['Food Name'].isin(weekly_used_foods)]
        meal_type_foods = available_foods[available_foods['Meal Type'].str.lower() == meal_type.lower()]
        
        # If no unused foods available for this meal type, use all foods for this meal type
        if meal_type_foods.empty:
            meal_type_foods = filtered_foods[filtered_foods['Meal Type'].str.lower() == meal_type.lower()]
        
        # If still no foods available, return empty
        if meal_type_foods.empty:
            return [], 0
        
        # Create the problem
        prob = pulp.LpProblem("AyurvedicMealPlanning", pulp.LpMaximize)
        
        # Decision variables: whether to include each food (binary)
        food_vars = pulp.LpVariable.dicts("Food", meal_type_foods.index, cat="Binary")
        
        # Calculate dosha weights based on multiple factors
        age_dosha = self.determine_age_dosha(age)
        seasonal_dosha = self.determine_seasonal_dosha(season)
        time_dosha = self.determine_time_dosha(meal_type)
        
        # Base weights (prioritize balancing vikriti)
        dosha_weights = {
            'Vata': 1.0,
            'Pitta': 1.0,
            'Kapha': 1.0
        }
        
        # Increase weight for imbalanced doshas (vikriti)
        if vikriti:
            for dosha in vikriti.split(','):
                dosha = dosha.strip()
                if dosha in dosha_weights:
                    dosha_weights[dosha] = 2.0  # Higher priority to balance vikriti
        
        # Apply age, season, and time influences
        for dosha in dosha_weights:
            dosha_weights[dosha] *= age_dosha[dosha] * seasonal_dosha[dosha] * time_dosha[dosha]
        
        # Objective function: maximize dosha balancing with penalty for used foods
        objective_terms = []
        for idx, food in meal_type_foods.iterrows():
            # Calculate taste-based dosha impact
            tastes = self.estimate_food_tastes(food['Food Name'])
            taste_impact = self.calculate_taste_impact(tastes)
            
            # Combined score (symbolic effect + taste impact)
            dosha_score = 0
            for dosha in ['Vata', 'Pitta', 'Kapha']:
                effect = food[dosha]
                taste_effect = taste_impact[dosha]
                
                # Symbolic effect
                if effect == '-':  # Food decreases this dosha
                    symbol_score = dosha_weights[dosha]
                elif effect == '+':  # Food increases this dosha (bad for imbalance)
                    symbol_score = -dosha_weights[dosha]
                else:  # Neutral
                    symbol_score = 0
                
                # Taste effect (positive means we want to reduce this dosha)
                taste_score = -taste_effect * dosha_weights[dosha]
                
                # Combine scores
                dosha_score += symbol_score + taste_score
            
            # Apply penalty for foods that have been used in the week
            penalty = 0
            if food['Food Name'] in weekly_used_foods:
                # High penalty for foods already used this week
                penalty = -10.0  # Very high penalty to prevent selection
            
            objective_terms.append(food_vars[idx] * (dosha_score + penalty))
        
        prob += pulp.lpSum(objective_terms), "Total_Dosha_Balancing_Score"
        
        # Constraints
        # 1. Calorie constraint for the meal
        calorie_terms = []
        for idx, food in meal_type_foods.iterrows():
            portion = self.calculate_portion_size(food['Calories'], calories_per_meal)
            calorie_contribution = (food['Calories'] / self.standard_portion) * portion
            calorie_terms.append(food_vars[idx] * calorie_contribution)
        
        # Allow 15% flexibility in calorie target
        prob += pulp.lpSum(calorie_terms) >= calories_per_meal * 0.85, "MinCalories"
        prob += pulp.lpSum(calorie_terms) <= calories_per_meal * 1.15, "MaxCalories"
        
        # 2. Select exactly 1 food per meal
        prob += pulp.lpSum(food_vars.values()) == 1, "ExactlyOneFood"
        
        # Solve the problem
        prob.solve()
        
        # Check if solution was found
        if prob.status != pulp.LpStatusOptimal:
            # Fallback: select the first available food
            if not meal_type_foods.empty:
                food = meal_type_foods.iloc[0]
                portion = self.calculate_portion_size(food['Calories'], calories_per_meal)
                food_calories = (food['Calories'] / self.standard_portion) * portion
                tastes = self.estimate_food_tastes(food['Food Name'])
                
                selected_foods = [{
                    'name': food['Food Name'],
                    'portion': portion,
                    'calories': round(food_calories, 1),
                    'protein': round((food['Protein (g)'] / self.standard_portion) * portion, 1),
                    'carbs': round((food['Carbs (g)'] / self.standard_portion) * portion, 1),
                    'fats': round((food['Fats (g)'] / self.standard_portion) * portion, 1),
                    'vata_effect': food['Vata'],
                    'pitta_effect': food['Pitta'],
                    'kapha_effect': food['Kapha'],
                    'tastes': ', '.join(tastes)
                }]
                return selected_foods, round(food_calories, 1)
            else:
                return [], 0
        
        # Extract the solution
        selected_foods = []
        total_calories = 0
        
        for idx, food in meal_type_foods.iterrows():
            if pulp.value(food_vars[idx]) == 1:
                portion = self.calculate_portion_size(food['Calories'], calories_per_meal)
                food_calories = (food['Calories'] / self.standard_portion) * portion
                total_calories += food_calories
                
                # Estimate tastes for this food
                tastes = self.estimate_food_tastes(food['Food Name'])
                
                selected_foods.append({
                    'name': food['Food Name'],
                    'portion': portion,
                    'calories': round(food_calories, 1),
                    'protein': round((food['Protein (g)'] / self.standard_portion) * portion, 1),
                    'carbs': round((food['Carbs (g)'] / self.standard_portion) * portion, 1),
                    'fats': round((food['Fats (g)'] / self.standard_portion) * portion, 1),
                    'vata_effect': food['Vata'],
                    'pitta_effect': food['Pitta'],
                    'kapha_effect': food['Kapha'],
                    'tastes': ', '.join(tastes)
                })
        
        return selected_foods, round(total_calories, 1)
    
    def generate_weekly_plan(self, age: int, height: float, weight: float, gender: str,
                            prakriti: str, vikriti: str, activity_level: str, 
                            season: str, dietary_pref: str, allergies: List[str]) -> Dict:
        """
        Generate a weekly meal plan based on user parameters
        """
        # Reset used foods
        self.used_foods = set()
        
        # Calculate nutritional needs
        daily_calories, calories_per_meal = self.calculate_caloric_needs(
            age, height, weight, gender, activity_level
        )
        
        # Filter foods based on preferences and allergies
        filtered_foods = self.filter_foods(dietary_pref, allergies)
        
        if filtered_foods.empty:
            return {"error": "No foods available after applying filters"}
        
        # Generate meal plan for each day of the week
        weekly_plan = {}
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        meal_types = ['breakfast', 'lunch', 'dinner']
        
        # Track all used foods across the week to ensure no repetition
        weekly_used_foods = set()
        
        # Track allergy warnings for the entire week
        weekly_allergy_warnings = {}
        
        for day_idx, day in enumerate(days):
            daily_meals = {}
            total_daily_calories = 0
            daily_allergy_warnings = []
            
            for meal_type in meal_types:
                selected_foods, meal_calories = self.optimize_meals(
                    filtered_foods, prakriti, vikriti, calories_per_meal, season, meal_type, age, 
                    weekly_used_foods, day_idx
                )
                
                # Add selected food to weekly used foods to prevent repetition
                if selected_foods:
                    weekly_used_foods.add(selected_foods[0]['name'])
                    
                    # Generate allergy warnings for this food
                    if allergies:
                        warnings = self.generate_allergy_warnings(selected_foods[0]['name'], allergies)
                        if warnings:
                            daily_allergy_warnings.extend(warnings)
                
                daily_meals[meal_type] = {
                    'foods': selected_foods,
                    'total_calories': meal_calories
                }
                total_daily_calories += meal_calories
            
            weekly_plan[day] = {
                'meals': daily_meals,
                'total_calories': round(total_daily_calories, 1),
                'allergy_warnings': daily_allergy_warnings
            }
            
            # Store warnings for the day
            if daily_allergy_warnings:
                weekly_allergy_warnings[day] = daily_allergy_warnings
        
        # Add summary information
        result = {
            'weekly_plan': weekly_plan,
            'weekly_allergy_warnings': weekly_allergy_warnings,
            'nutrition_summary': {
                'daily_calorie_target': round(daily_calories, 1),
                'calories_per_meal_target': round(calories_per_meal, 1),
                'prakriti': prakriti,
                'vikriti': vikriti,
                'dietary_preference': dietary_pref,
                'allergies': allergies,
                'age_dosha_impact': self.determine_age_dosha(age),
                'seasonal_dosha_impact': self.determine_seasonal_dosha(season)
            }
        }
        
        return result
    
    def export_to_csv(self, meal_plan: Dict, filename: str = "ayurvedic_meal_plan.csv"):
        """
        Export the meal plan to a CSV file
        """
        if 'error' in meal_plan:
            print(f"Cannot export: {meal_plan['error']}")
            return False
        
        # Prepare data for CSV
        rows = []
        
        # Add header
        rows.append([
            'Day', 'Meal Type', 'Food Name', 'Portion (g)', 'Calories', 
            'Protein (g)', 'Carbs (g)', 'Fats (g)', 'Vata Effect', 
            'Pitta Effect', 'Kapha Effect', 'Tastes', 'Allergy Warnings'
        ])
        
        # Add meal data
        for day, day_plan in meal_plan['weekly_plan'].items():
            for meal_type, meal in day_plan['meals'].items():
                for food in meal['foods']:
                    # Get allergy warnings for this food
                    warnings = ""
                    if day in meal_plan['weekly_allergy_warnings']:
                        food_warnings = [w for w in meal_plan['weekly_allergy_warnings'][day] if food['name'] in w]
                        if food_warnings:
                            warnings = " | ".join(food_warnings)
                    
                    rows.append([
                        day,
                        meal_type.capitalize(),
                        food['name'],
                        food['portion'],
                        food['calories'],
                        food['protein'],
                        food['carbs'],
                        food['fats'],
                        food['vata_effect'],
                        food['pitta_effect'],
                        food['kapha_effect'],
                        food['tastes'],
                        warnings
                    ])
        
        # Create DataFrame and export to CSV
        df = pd.DataFrame(rows[1:], columns=rows[0])
        df.to_csv(filename, index=False)
        print(f"Meal plan exported to {filename}")
        
        # Also export a summary CSV
        self.export_summary_csv(meal_plan, "ayurvedic_meal_plan_summary.csv")
        
        return True
    
    def export_summary_csv(self, meal_plan: Dict, filename: str = "ayurvedic_meal_plan_summary.csv"):
        """
        Export a summary of the meal plan to a CSV file
        """
        # Prepare summary data
        summary_rows = []
        
        # Add user profile
        summary = meal_plan['nutrition_summary']
        summary_rows.append(['User Profile', ''])
        summary_rows.append(['Age', '35'])  # Hardcoded for now, should be parameterized
        summary_rows.append(['Height (cm)', '170'])
        summary_rows.append(['Weight (kg)', '70'])
        summary_rows.append(['Gender', 'male'])
        summary_rows.append(['Prakriti', summary['prakriti']])
        summary_rows.append(['Vikriti', summary['vikriti']])
        summary_rows.append(['Dietary Preference', summary['dietary_preference']])
        summary_rows.append(['Allergies', ', '.join(summary['allergies'])])
        summary_rows.append(['Daily Calorie Target', summary['daily_calorie_target']])
        summary_rows.append(['Calories per Meal Target', summary['calories_per_meal_target']])
        summary_rows.append(['', ''])
        
        # Add daily totals
        summary_rows.append(['Daily Nutrition Summary', ''])
        summary_rows.append(['Day', 'Total Calories', 'Breakfast Calories', 'Lunch Calories', 'Dinner Calories'])
        
        for day, day_plan in meal_plan['weekly_plan'].items():
            breakfast_cals = day_plan['meals']['breakfast']['total_calories']
            lunch_cals = day_plan['meals']['lunch']['total_calories']
            dinner_cals = day_plan['meals']['dinner']['total_calories']
            total_cals = day_plan['total_calories']
            
            summary_rows.append([day, total_cals, breakfast_cals, lunch_cals, dinner_cals])
        
        # Add allergy warnings section
        summary_rows.append(['', ''])
        summary_rows.append(['Allergy Warnings', ''])
        
        if meal_plan['weekly_allergy_warnings']:
            for day, warnings in meal_plan['weekly_allergy_warnings'].items():
                for warning in warnings:
                    summary_rows.append([day, warning])
        else:
            summary_rows.append(['No allergy warnings', ''])
        
        # Create DataFrame and export to CSV
        df = pd.DataFrame(summary_rows)
        df.to_csv(filename, index=False, header=False)
        print(f"Meal plan summary exported to {filename}")

def main():
    """
    Main function to demonstrate the meal planner
    """
    # Initialize the meal planner
    planner = AdvancedAyurvedicMealPlanner("new_foods.csv")
    
    # Example user input
    user_profile = {
        'age': 35,
        'height': 170,  # in cm
        'weight': 70,   # in kg
        'gender': 'male',
        'prakriti': 'Vata-Pitta',  # Constitution
        'vikriti': 'Vata',         # Imbalance
        'activity_level': 'moderate',
        'season': 'winter',
        'dietary_pref': 'vegetarian',
        'allergies': ['dairy', 'nuts']
    }
    
    # Generate meal plan
    meal_plan = planner.generate_weekly_plan(**user_profile)
    
    # Print results
    if 'error' in meal_plan:
        print(f"Error: {meal_plan['error']}")
        return
    
    print("=" * 70)
    print("ADVANCED AYURVEDIC MEAL PLANNER WITH DOSHA BALANCE")
    print("=" * 70)
    
    # Print user summary
    summary = meal_plan['nutrition_summary']
    print(f"\nUSER PROFILE:")
    print(f"Age: {user_profile['age']}, Height: {user_profile['height']}cm, Weight: {user_profile['weight']}kg")
    print(f"Prakriti: {summary['prakriti']}, Vikriti: {summary['vikriti']}")
    print(f"Dietary Preference: {summary['dietary_preference']}, Allergies: {summary['allergies']}")
    print(f"Daily Calorie Target: {summary['daily_calorie_target']} kcal")
    print(f"Target Calories per Meal: {summary['calories_per_meal_target']} kcal")
    
    # Print dosha influences
    print(f"\nDOSHA INFLUENCES:")
    print(f"Age-based: Vata={summary['age_dosha_impact']['Vata']}, "
          f"Pitta={summary['age_dosha_impact']['Pitta']}, "
          f"Kapha={summary['age_dosha_impact']['Kapha']}")
    print(f"Seasonal: Vata={summary['seasonal_dosha_impact']['Vata']}, "
          f"Pitta={summary['seasonal_dosha_impact']['Pitta']}, "
          f"Kapha={summary['seasonal_dosha_impact']['Kapha']}")
    
    # Print weekly plan
    for day, day_plan in meal_plan['weekly_plan'].items():
        print(f"\n{day.upper()}:")
        print(f"Total Calories: {day_plan['total_calories']} kcal")
        
        # Print allergy warnings for the day if any
        if day_plan['allergy_warnings']:
            print(f"  ALLERGY WARNINGS:")
            for warning in day_plan['allergy_warnings']:
                print(f"  ⚠️  {warning}")
        
        for meal_type, meal in day_plan['meals'].items():
            print(f"\n  {meal_type.upper()}: {meal['total_calories']} kcal")
            for food in meal['foods']:
                print(f"    - {food['name']}: {food['portion']}g "
                      f"({food['calories']} kcal, "
                      f"P: {food['protein']}g, C: {food['carbs']}g, F: {food['fats']}g)")
                print(f"      Vata: {food['vata_effect']}, "
                      f"Pitta: {food['pitta_effect']}, "
                      f"Kapha: {food['kapha_effect']}")
                print(f"      Tastes: {food['tastes']}")
    
    # Export to CSV
    planner.export_to_csv(meal_plan, "ayurvedic_meal_plan.csv")

if __name__ == "__main__":
    main()