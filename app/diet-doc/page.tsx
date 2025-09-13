"use client";

import React, { useState, useEffect } from "react";
import { X, Printer } from "lucide-react";

// -------------------- Types --------------------
type FoodItem = {
  id: string;
  name: string;
  calories: number;
  ayurvedicProperties: string;
};

type Meal = {
  time: string;
  name: string;
  foodItems: FoodItem[];
};

type DayPlan = {
  day: string;
  meals: Meal[];
};

type PatientDetails = {
  name: string;
  age: number;
  weight: number;
  dosha: string;
  waterIntake: string;
  summary: string;
};

// -------------------- Mock DB --------------------
const doshaFoods = {
  Vata: {
    Breakfast: [
      {
        id: "v1",
        name: "Warm Oats",
        calories: 280,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v2",
        name: "Dates",
        calories: 60,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v3",
        name: "Moong Dal Khichdi",
        calories: 250,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v4",
        name: "Ghee with Roti",
        calories: 200,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v5",
        name: "Almond Milk",
        calories: 100,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v6",
        name: "Rice Porridge",
        calories: 220,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v7",
        name: "Banana",
        calories: 90,
        ayurvedicProperties: "Vata-Pacifying",
      },
    ],
    Lunch: [
      {
        id: "v8",
        name: "Vegetable Khichdi",
        calories: 350,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v9",
        name: "Rice",
        calories: 130,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v10",
        name: "Steamed Greens",
        calories: 80,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v11",
        name: "Paneer Curry",
        calories: 250,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v12",
        name: "Pumpkin Sabji",
        calories: 150,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v13",
        name: "Cumin Rice",
        calories: 180,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v14",
        name: "Lentil Dal",
        calories: 200,
        ayurvedicProperties: "Vata-Pacifying",
      },
    ],
    Dinner: [
      {
        id: "v15",
        name: "Vegetable Soup",
        calories: 200,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v16",
        name: "Sweet Potato",
        calories: 150,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v17",
        name: "Ghee Rice",
        calories: 180,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v18",
        name: "Carrot Soup",
        calories: 120,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v19",
        name: "Spinach Curry",
        calories: 160,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v20",
        name: "Daliya",
        calories: 140,
        ayurvedicProperties: "Vata-Pacifying",
      },
      {
        id: "v21",
        name: "Beetroot Curry",
        calories: 170,
        ayurvedicProperties: "Vata-Pacifying",
      },
    ],
  },
  Pitta: {
    Breakfast: [
      {
        id: "p1",
        name: "Sweet Potatoes",
        calories: 180,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p2",
        name: "Coconut Water",
        calories: 45,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p3",
        name: "Dates",
        calories: 60,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p4",
        name: "Fruit Salad",
        calories: 200,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p5",
        name: "Rice Porridge",
        calories: 220,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p6",
        name: "Cucumber Juice",
        calories: 40,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p7",
        name: "Melon",
        calories: 70,
        ayurvedicProperties: "Pitta-Pacifying",
      },
    ],
    Lunch: [
      {
        id: "p8",
        name: "Leafy Veggies",
        calories: 50,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p9",
        name: "Rice",
        calories: 130,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p10",
        name: "Curd",
        calories: 100,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p11",
        name: "Quinoa Bowl",
        calories: 250,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p12",
        name: "Bottle Gourd Curry",
        calories: 180,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p13",
        name: "Mint Rice",
        calories: 200,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p14",
        name: "Lassi",
        calories: 90,
        ayurvedicProperties: "Pitta-Pacifying",
      },
    ],
    Dinner: [
      {
        id: "p15",
        name: "Mushrooms",
        calories: 60,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p16",
        name: "Moong Dal",
        calories: 150,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p17",
        name: "Peas",
        calories: 75,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p18",
        name: "Lauki Curry",
        calories: 120,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p19",
        name: "Pumpkin Soup",
        calories: 130,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p20",
        name: "Steamed Beans",
        calories: 100,
        ayurvedicProperties: "Pitta-Pacifying",
      },
      {
        id: "p21",
        name: "Apple Smoothie",
        calories: 140,
        ayurvedicProperties: "Pitta-Pacifying",
      },
    ],
  },
};

// -------------------- Main App --------------------
export default function App() {
  const [view, setView] = useState<"creator" | "viewer">("creator");
  const [dietPlan, setDietPlan] = useState<DayPlan[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(
    null
  );

  const patient: PatientDetails = {
    name: "Yash Sheorey",
    age: 22,
    weight: 78,
    dosha: "Vata",
    waterIntake: "Low",
    summary: "10/19/2023: Detox Cleanse\n10/20/2023: Digestive Boost",
  };

  const doctorName =
    "Dr. Armaan Gupta (Gold medalist, PHD(BMMS), Ayurveda Specialist)";
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const mealsOfDay = [
    { name: "Breakfast", time: "7:00 AM" },
    { name: "Lunch", time: "1:00 PM" },
    { name: "Dinner", time: "8:00 PM" },
  ];

  useEffect(() => {
    const initialPlan = daysOfWeek.map((day) => ({
      day,
      meals: mealsOfDay.map((meal) => ({ ...meal, foodItems: [] })),
    }));
    setDietPlan(initialPlan);
  }, []);

  const handleAddFood = (mealIndex: number, foodItem: FoodItem) => {
    const updatedPlan = [...dietPlan];
    updatedPlan[currentDayIndex].meals[mealIndex].foodItems.push(foodItem);
    setDietPlan(updatedPlan);
    setSelectedMealIndex(null);
  };

  const handleRemoveFood = (mealIndex: number, foodId: string) => {
    const updatedPlan = [...dietPlan];
    updatedPlan[currentDayIndex].meals[mealIndex].foodItems = updatedPlan[
      currentDayIndex
    ].meals[mealIndex].foodItems.filter((f) => f.id !== foodId);
    setDietPlan(updatedPlan);
  };

  // -------------------- Creator --------------------
  if (view === "creator") {
    return (
      <div className="flex bg-gray-50 min-h-screen text-slate-800 antialiased p-6 md:p-10">
        <div className="max-w-7xl mx-auto w-full">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Create Diet Plan
            </h1>
            <button
              onClick={() => setView("viewer")}
              className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-700 transition"
            >
              View Final Plan
            </button>
          </header>

          <section className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Patient: {patient.name} ({patient.dosha})
            </h2>
            <div className="flex gap-2 mb-6">
              {daysOfWeek.map((day, idx) => (
                <button
                  key={day}
                  onClick={() => setCurrentDayIndex(idx)}
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    currentDayIndex === idx
                      ? "bg-green-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dietPlan[currentDayIndex]?.meals.map((meal, mealIndex) => (
                <div
                  key={mealIndex}
                  className="bg-gray-50 p-6 rounded-xl shadow-inner border"
                >
                  <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-lg text-green-700">
                      {meal.name}
                    </h3>
                    <span className="text-sm text-gray-500">{meal.time}</span>
                  </div>

                  <ul className="space-y-2 mb-3">
                    {meal.foodItems.length > 0 ? (
                      meal.foodItems.map((food) => (
                        <li
                          key={food.id}
                          className="flex justify-between items-center bg-white p-2 rounded-md border"
                        >
                          <span>{food.name}</span>
                          <button
                            onClick={() => handleRemoveFood(mealIndex, food.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={14} />
                          </button>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No food items
                      </p>
                    )}
                  </ul>

                  <button
                    onClick={() =>
                      setSelectedMealIndex(
                        selectedMealIndex === mealIndex ? null : mealIndex
                      )
                    }
                    className="w-full border border-green-600 text-green-600 rounded-md py-2 text-sm hover:bg-green-50"
                  >
                    Add Food
                  </button>

                  {selectedMealIndex === mealIndex && (
                    <div className="mt-2 max-h-40 overflow-y-auto border rounded-md bg-white shadow-inner">
                      {doshaFoods[patient.dosha as keyof typeof doshaFoods][
                        meal.name as keyof typeof doshaFoods.Vata
                      ].map((food) => (
                        <button
                          key={food.id}
                          onClick={() => handleAddFood(mealIndex, food)}
                          className="w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
                        >
                          {food.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // -------------------- Viewer --------------------
  return (
    <div className="flex bg-gray-50 min-h-screen text-slate-800 p-6 md:p-10">
      <div className="max-w-6xl mx-auto w-full bg-white rounded-3xl shadow-lg p-8">
        {/* Header */}
        <header className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-700">
              Ayurvedic Diet Plan Report
            </h1>
            <p className="text-gray-500 text-sm">Prepared by {doctorName}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg shadow hover:bg-gray-300 flex items-center gap-2"
          >
            <Printer size={18} />
            Print
          </button>
        </header>

        {/* Patient Info */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Patient Information
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <p>
              <span className="font-medium">Name:</span> {patient.name}
            </p>
            <p>
              <span className="font-medium">Age:</span> {patient.age}
            </p>
            <p>
              <span className="font-medium">Weight:</span> {patient.weight} kg
            </p>
            <p>
              <span className="font-medium">Dosha:</span> {patient.dosha}
            </p>
            <p>
              <span className="font-medium">Water Intake:</span>{" "}
              {patient.waterIntake}
            </p>
            <p className="col-span-2">
              <span className="font-medium">Summary:</span> {patient.summary}
            </p>
          </div>
        </section>

        {/* Weekly Table */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Weekly Diet Timetable
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white rounded-lg overflow-hidden shadow">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 text-left">Day</th>
                  {mealsOfDay.map((meal) => (
                    <th key={meal.name} className="p-3 text-left">
                      {meal.name} ({meal.time})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dietPlan.map((dayPlan, dayIdx) => (
                  <tr key={dayIdx} className="border-t">
                    <td className="p-3 font-semibold text-gray-700">
                      {dayPlan.day}
                    </td>
                    {dayPlan.meals.map((meal, mealIdx) => (
                      <td key={mealIdx} className="p-3 align-top">
                        {meal.foodItems.length > 0 ? (
                          <ul className="space-y-1">
                            {meal.foodItems.map((food) => (
                              <li
                                key={food.id}
                                className="text-sm text-gray-700"
                              >
                                {food.name}{" "}
                                <span className="text-xs text-gray-500">
                                  ({food.calories} kcal)
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            No items
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
