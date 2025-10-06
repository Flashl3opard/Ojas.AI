// app/data/Food.ts

// -------------------- Types --------------------
export type Macronutrient = "Low" | "Medium" | "High";

export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  ayurvedicProperties: string;
  macronutrients: {
    protein: Macronutrient;
    carbs: Macronutrient;
    fats: Macronutrient;
    fiber: Macronutrient;
  };
};

export type Meal = {
  time: string;
  name: string;
  foodItems: FoodItem[];
};

export type DayPlan = {
  day: string;
  meals: Meal[];
};

export type DoshaType = "Vata" | "Pitta" | "Kapha";
export type MealNameType = "Breakfast" | "Lunch" | "Dinner";

export type PatientDetails = {
  name: string;
  age: number;
  weight: number;
  dosha: DoshaType;
  waterIntake: string;
  summary: string;
};

// -------------------- Constants --------------------
export const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const mealsOfDay: { name: MealNameType; time: string }[] = [
  { name: "Breakfast", time: "7:00 AM" },
  { name: "Lunch", time: "1:00 PM" },
  { name: "Dinner", time: "8:00 PM" },
];

export const patient: PatientDetails = {
  name: "Yash Sheorey",
  age: 22,
  weight: 78,
  // Changing to Kapha to show data diversity in the example
  dosha: "Kapha",
  waterIntake: "Low",
  summary: "10/19/2023: Detox Cleanse\n10/20/2023: Digestive Boost",
};

export const doctorName =
  "Dr. Armaan Gupta (Gold medalist, PHD(BMMS), Ayurveda Specialist)";

// -------------------- Mock DB with Macronutrients --------------------
// Macronutrient values are categorized as:
// P: Protein, C: Carbs, F: Fats, Fi: Fiber
export const doshaFoods: Record<DoshaType, Record<MealNameType, FoodItem[]>> = {
  Vata: {
    Breakfast: [
      {
        id: "v1",
        name: "Warm Oats",
        calories: 280,
        ayurvedicProperties: "Vata-Pacifying (Warming, Moist)",
        macronutrients: {
          protein: "Medium",
          carbs: "High",
          fats: "Low",
          fiber: "High",
        },
      },
      {
        id: "v2",
        name: "Dates",
        calories: 60,
        ayurvedicProperties: "Vata-Pacifying (Sweet, Grounding)",
        macronutrients: {
          protein: "Low",
          carbs: "High",
          fats: "Low",
          fiber: "Medium",
        },
      },
      {
        id: "v3",
        name: "Moong Dal Khichdi",
        calories: 250,
        ayurvedicProperties: "Vata-Pacifying (Easy to Digest)",
        macronutrients: {
          protein: "Medium",
          carbs: "High",
          fats: "Medium",
          fiber: "High",
        },
      },
    ],
    Lunch: [
      {
        id: "v8",
        name: "Vegetable Khichdi",
        calories: 350,
        ayurvedicProperties: "Vata-Pacifying (Nourishing)",
        macronutrients: {
          protein: "Medium",
          carbs: "High",
          fats: "Medium",
          fiber: "High",
        },
      },
      {
        id: "v11",
        name: "Paneer Curry",
        calories: 250,
        ayurvedicProperties: "Vata-Pacifying (Heavy, Moist)",
        macronutrients: {
          protein: "High",
          carbs: "Low",
          fats: "High",
          fiber: "Low",
        },
      },
      {
        id: "v14",
        name: "Lentil Dal",
        calories: 200,
        ayurvedicProperties: "Vata-Pacifying (Warming)",
        macronutrients: {
          protein: "High",
          carbs: "Medium",
          fats: "Low",
          fiber: "High",
        },
      },
    ],
    Dinner: [
      {
        id: "v15",
        name: "Vegetable Soup",
        calories: 200,
        ayurvedicProperties: "Vata-Pacifying (Warm, Light)",
        macronutrients: {
          protein: "Low",
          carbs: "Medium",
          fats: "Low",
          fiber: "High",
        },
      },
      {
        id: "v16",
        name: "Sweet Potato",
        calories: 150,
        ayurvedicProperties: "Vata-Pacifying (Grounding, Sweet)",
        macronutrients: {
          protein: "Low",
          carbs: "High",
          fats: "Low",
          fiber: "High",
        },
      },
      {
        id: "v20",
        name: "Daliya",
        calories: 140,
        ayurvedicProperties: "Vata-Pacifying (Easy to Digest)",
        macronutrients: {
          protein: "Medium",
          carbs: "High",
          fats: "Low",
          fiber: "High",
        },
      },
    ],
  },
  Pitta: {
    Breakfast: [
      {
        id: "p2",
        name: "Coconut Water",
        calories: 45,
        ayurvedicProperties: "Pitta-Pacifying (Cooling)",
        macronutrients: {
          protein: "Low",
          carbs: "Medium",
          fats: "Low",
          fiber: "Low",
        },
      },
      {
        id: "p4",
        name: "Fruit Salad (Sweet)",
        calories: 200,
        ayurvedicProperties: "Pitta-Pacifying (Sweet, Cooling)",
        macronutrients: {
          protein: "Low",
          carbs: "High",
          fats: "Low",
          fiber: "High",
        },
      },
      {
        id: "p6",
        name: "Cucumber Juice",
        calories: 40,
        ayurvedicProperties: "Pitta-Pacifying (Very Cooling)",
        macronutrients: {
          protein: "Low",
          carbs: "Low",
          fats: "Low",
          fiber: "Low",
        },
      },
    ],
    Lunch: [
      {
        id: "p8",
        name: "Leafy Veggies",
        calories: 50,
        ayurvedicProperties: "Pitta-Pacifying (Bitter, Cooling)",
        macronutrients: {
          protein: "Low",
          carbs: "Low",
          fats: "Low",
          fiber: "High",
        },
      },
      {
        id: "p11",
        name: "Quinoa Bowl",
        calories: 250,
        ayurvedicProperties: "Pitta-Pacifying (Neutral, High Fiber)",
        macronutrients: {
          protein: "Medium",
          carbs: "High",
          fats: "Medium",
          fiber: "High",
        },
      },
      {
        id: "p10",
        name: "Curd/Yogurt",
        calories: 100,
        ayurvedicProperties: "Pitta-Pacifying (Sweet, Cooling)",
        macronutrients: {
          protein: "High",
          carbs: "Medium",
          fats: "Medium",
          fiber: "Low",
        },
      },
    ],
    Dinner: [
      {
        id: "p16",
        name: "Moong Dal",
        calories: 150,
        ayurvedicProperties: "Pitta-Pacifying (Light, Cooling)",
        macronutrients: {
          protein: "High",
          carbs: "High",
          fats: "Low",
          fiber: "High",
        },
      },
      {
        id: "p18",
        name: "Lauki Curry",
        calories: 120,
        ayurvedicProperties: "Pitta-Pacifying (Cooling, Light)",
        macronutrients: {
          protein: "Low",
          carbs: "Medium",
          fats: "Low",
          fiber: "High",
        },
      },
      {
        id: "p21",
        name: "Apple Smoothie",
        calories: 140,
        ayurvedicProperties: "Pitta-Pacifying (Sweet, Neutral)",
        macronutrients: {
          protein: "Low",
          carbs: "High",
          fats: "Low",
          fiber: "High",
        },
      },
    ],
  },
  Kapha: {
    Breakfast: [
      {
        id: "k1",
        name: "Dry Toast",
        calories: 120,
        ayurvedicProperties: "Kapha-Pacifying (Dry, Warming)",
        macronutrients: {
          protein: "Low",
          carbs: "High",
          fats: "Low",
          fiber: "Medium",
        },
      },
      {
        id: "k2",
        name: "Hot Ginger Tea",
        calories: 5,
        ayurvedicProperties: "Kapha-Pacifying (Pungent, Hot)",
        macronutrients: {
          protein: "Low",
          carbs: "Low",
          fats: "Low",
          fiber: "Low",
        },
      },
      {
        id: "k4",
        name: "Millet Porridge (Dry)",
        calories: 200,
        ayurvedicProperties: "Kapha-Pacifying (Light, Drying)",
        macronutrients: {
          protein: "Medium",
          carbs: "High",
          fats: "Low",
          fiber: "High",
        },
      },
    ],
    Lunch: [
      {
        id: "k8",
        name: "Lentil Soup (Spicy)",
        calories: 250,
        ayurvedicProperties: "Kapha-Pacifying (Warming, Drying)",
        macronutrients: {
          protein: "High",
          carbs: "Medium",
          fats: "Low",
          fiber: "High",
        },
      },
      {
        id: "k9",
        name: "Steamed Broccoli",
        calories: 60,
        ayurvedicProperties: "Kapha-Pacifying (Pungent, Light)",
        macronutrients: {
          protein: "Medium",
          carbs: "Medium",
          fats: "Low",
          fiber: "High",
        },
      },
      {
        id: "k12",
        name: "Grilled Chicken/Fish",
        calories: 200,
        ayurvedicProperties: "Kapha-Pacifying (Warming, Light Protein)",
        macronutrients: {
          protein: "High",
          carbs: "Low",
          fats: "Medium",
          fiber: "Low",
        },
      },
    ],
    Dinner: [
      {
        id: "k15",
        name: "Vegetable Stir-fry",
        calories: 180,
        ayurvedicProperties: "Kapha-Pacifying (Light, Dry)",
        macronutrients: {
          protein: "Low",
          carbs: "Medium",
          fats: "Low",
          fiber: "High",
        },
      },
      {
        id: "k17",
        name: "Barley",
        calories: 170,
        ayurvedicProperties: "Kapha-Pacifying (Light, Drying Grain)",
        macronutrients: {
          protein: "Medium",
          carbs: "High",
          fats: "Low",
          fiber: "High",
        },
      },
      {
        id: "k21",
        name: "Lentil Salad",
        calories: 200,
        ayurvedicProperties: "Kapha-Pacifying (Protein-rich, Dry)",
        macronutrients: {
          protein: "High",
          carbs: "Medium",
          fats: "Low",
          fiber: "High",
        },
      },
    ],
  },
};

// --- Utility Function ---
/**
 * Automatically creates a 7-day diet plan based on the specified dosha
 * by randomly selecting 2-3 suitable food items for each meal.
 * @param dosha The patient's dominant dosha type.
 * @returns A fully populated DayPlan array.
 */
export const autoCreatePlan = (dosha: DoshaType): DayPlan[] => {
  const newPlan: DayPlan[] = daysOfWeek.map((day) => ({
    day,
    meals: mealsOfDay.map((meal) => {
      const availableFoods = doshaFoods[dosha][meal.name as MealNameType];
      // Get a random selection of 2-3 foods for the meal
      const selectedFoods = availableFoods
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 2) + 2);
      return {
        ...meal,
        foodItems: selectedFoods,
      };
    }),
  }));
  return newPlan;
};
