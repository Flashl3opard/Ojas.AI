"use client";

import React, { useState, useEffect } from "react";
import { X, Printer } from "lucide-react";
import {
  FoodItem,
  DayPlan,
  DoshaType,
  MealNameType,
  daysOfWeek,
  mealsOfDay,
  doshaFoods,
  patient,
  doctorName,
  autoCreatePlan,
} from "../data/Food";

// -------------------- Main App --------------------
export default function App() {
  const [view, setView] = useState<"creator" | "viewer">("creator");
  const [dietPlan, setDietPlan] = useState<DayPlan[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(
    null
  );
  const [message, setMessage] = useState<string>("");

  // Initialize the diet plan
  useEffect(() => {
    const initialPlan: DayPlan[] = daysOfWeek.map((day) => ({
      day,
      meals: mealsOfDay.map((meal) => ({
        time: meal.time,
        name: meal.name,
        foodItems: [],
      })),
    }));
    setDietPlan(initialPlan);
  }, []);

  const handleAddFood = (mealIndex: number, foodItem: FoodItem) => {
    const updatedPlan = [...dietPlan];
    updatedPlan[currentDayIndex].meals[mealIndex].foodItems.push(foodItem);
    setDietPlan(updatedPlan);
    setSelectedMealIndex(null);
    setMessage("");
  };

  const handleRemoveFood = (mealIndex: number, foodId: string) => {
    const updatedPlan = [...dietPlan];
    updatedPlan[currentDayIndex].meals[mealIndex].foodItems = updatedPlan[
      currentDayIndex
    ].meals[mealIndex].foodItems.filter((f) => f.id !== foodId);
    setDietPlan(updatedPlan);
    setMessage("");
  };

  const handleAutoCreate = () => {
    const newPlan = autoCreatePlan(patient.dosha as DoshaType);
    setDietPlan(newPlan);
    setMessage(
      `✨ A 7-day diet plan has been auto-generated for ${patient.dosha} dosha!`
    );
    setCurrentDayIndex(0);
  };

  const getMacroColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-red-600 font-semibold";
      case "Medium":
        return "text-amber-600 font-medium";
      case "Low":
        return "text-green-700 font-medium";
      default:
        return "text-gray-500";
    }
  };

  // -------------------- CREATOR VIEW --------------------
  if (view === "creator") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f9faf9] to-[#f3f7f3] text-gray-800 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h1 className="text-4xl font-bold text-green-700">
              Ayurvedic Diet Planner
            </h1>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={handleAutoCreate}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition font-semibold"
              >
                Auto-Create for {patient.dosha}
              </button>
              <button
                onClick={() => setView("viewer")}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition font-semibold"
              >
                View Final Plan
              </button>
            </div>
          </header>

          {message && (
            <div className="text-center mb-6 text-green-700 bg-green-100 border border-green-300 py-3 rounded-xl shadow-sm font-medium">
              {message}
            </div>
          )}

          {/* Patient Info */}
          <section className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Patient:{" "}
              <span className="text-green-700 font-medium">{patient.name}</span>{" "}
              ({patient.dosha})
            </h2>
            <p className="text-sm text-gray-600 italic">
              Personalized Ayurvedic plan designed for optimal balance and
              well-being.
            </p>
          </section>

          {/* Day Selector */}
          <div className="flex gap-3 overflow-x-auto mb-8 pb-2">
            {daysOfWeek.map((day, idx) => (
              <button
                key={day}
                onClick={() => setCurrentDayIndex(idx)}
                className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all shadow-sm ${
                  currentDayIndex === idx
                    ? "bg-green-700 text-white scale-105"
                    : "bg-white text-gray-600 hover:bg-green-100 border"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Meal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dietPlan[currentDayIndex]?.meals.map((meal, mealIndex) => (
              <div
                key={mealIndex}
                className="bg-white/80 backdrop-blur-md border border-green-100 rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-green-700">
                    {meal.name}
                  </h3>
                  <span className="text-sm text-gray-500">{meal.time}</span>
                </div>

                {/* Food Items */}
                <ul className="space-y-3 mb-4 max-h-[160px] overflow-y-auto pr-1">
                  {meal.foodItems.length > 0 ? (
                    meal.foodItems.map((food) => (
                      <li
                        key={food.id}
                        className="flex flex-col bg-green-50/60 p-2.5 rounded-lg border border-green-100"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {food.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFood(mealIndex, food.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={15} />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex gap-x-3 flex-wrap">
                          <span>
                            P:{" "}
                            <span
                              className={getMacroColor(
                                food.macronutrients.protein
                              )}
                            >
                              {food.macronutrients.protein[0]}
                            </span>
                          </span>
                          <span>
                            C:{" "}
                            <span
                              className={getMacroColor(
                                food.macronutrients.carbs
                              )}
                            >
                              {food.macronutrients.carbs[0]}
                            </span>
                          </span>
                          <span>
                            F:{" "}
                            <span
                              className={getMacroColor(
                                food.macronutrients.fats
                              )}
                            >
                              {food.macronutrients.fats[0]}
                            </span>
                          </span>
                          <span>
                            Fi:{" "}
                            <span
                              className={getMacroColor(
                                food.macronutrients.fiber
                              )}
                            >
                              {food.macronutrients.fiber[0]}
                            </span>
                          </span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic text-center py-3">
                      No food added yet
                    </p>
                  )}
                </ul>

                {/* Add Food */}
                <button
                  onClick={() =>
                    setSelectedMealIndex(
                      selectedMealIndex === mealIndex ? null : mealIndex
                    )
                  }
                  className="w-full border border-green-700 text-green-700 rounded-lg py-2 text-sm font-medium hover:bg-green-50 transition"
                >
                  {selectedMealIndex === mealIndex
                    ? "Close Food Picker"
                    : "Add Food"}
                </button>

                {/* Food Picker */}
                {selectedMealIndex === mealIndex && (
                  <div className="mt-3 border rounded-lg bg-white shadow-inner max-h-40 overflow-y-auto">
                    <div className="text-xs text-center p-2 bg-green-100 text-green-800 font-medium border-b">
                      Dosha-Pacifying Foods
                    </div>
                    {doshaFoods[patient.dosha as DoshaType][
                      meal.name as MealNameType
                    ].map((food) => (
                      <button
                        key={food.id}
                        onClick={() => handleAddFood(mealIndex, food)}
                        className="w-full text-left px-3 py-1.5 hover:bg-green-50 text-sm transition"
                      >
                        {food.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------- VIEWER VIEW --------------------
  return (
    <div className="min-h-screen bg-[#fafcf9] text-gray-800 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-green-100">
        {/* Header */}
        <header className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-700">
              Ayurvedic Diet Plan
            </h1>
            <p className="text-gray-500 text-sm">Prepared by {doctorName}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setView("creator")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow flex items-center gap-2 transition"
            >
              <X size={18} /> Edit
            </button>
            <button
              onClick={() => window.print()}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow flex items-center gap-2 transition"
            >
              <Printer size={18} /> Print
            </button>
          </div>
        </header>

        {/* Patient Info */}
        <section className="mb-8 bg-green-50/60 p-5 rounded-2xl border border-green-100">
          <h2 className="text-lg font-semibold text-green-800 mb-3">
            Patient Details
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
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
          <h2 className="text-lg font-semibold text-green-800 mb-4">
            Weekly Diet Schedule
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-green-200 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="p-3 text-left">Day</th>
                  {mealsOfDay.map((meal) => (
                    <th key={meal.name} className="p-3 text-left">
                      {meal.name} <span className="text-xs">({meal.time})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {dietPlan.map((dayPlan, dayIdx) => (
                  <tr key={dayIdx} className="hover:bg-green-50">
                    <td className="p-3 font-semibold text-green-800">
                      {dayPlan.day}
                    </td>
                    {dayPlan.meals.map((meal, mealIdx) => (
                      <td key={mealIdx} className="p-3 align-top">
                        {meal.foodItems.length > 0 ? (
                          <ul className="space-y-1">
                            {meal.foodItems.map((food) => (
                              <li
                                key={food.id}
                                className="text-sm text-gray-700 bg-green-50/60 rounded-md p-2 border border-green-100"
                              >
                                <span className="font-medium">{food.name}</span>{" "}
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

        {/* Final Macros Section */}
        <section className="mt-10 bg-green-50/80 border border-green-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-green-800 mb-3">
            🧮 Final Macronutrient Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white shadow border border-green-100">
              <p className="text-gray-500 text-sm">Protein</p>
              <p className="text-green-600 font-bold text-lg">84g</p>
              <p className="text-green-600 text-sm font-medium">High</p>
            </div>
            <div className="p-4 rounded-xl bg-white shadow border border-green-100">
              <p className="text-gray-500 text-sm">Carbs</p>
              <p className="text-amber-600 font-bold text-lg">160g</p>
              <p className="text-amber-600 text-sm font-medium">Medium</p>
            </div>
            <div className="p-4 rounded-xl bg-white shadow border border-green-100">
              <p className="text-gray-500 text-sm">Fats</p>
              <p className="text-amber-600 font-bold text-lg">60g</p>
              <p className="text-amber-600 text-sm font-medium">Medium</p>
            </div>
            <div className="p-4 rounded-xl bg-white shadow border border-green-100">
              <p className="text-gray-500 text-sm">Fiber</p>
              <p className="text-red-600 font-bold text-lg">15g</p>
              <p className="text-red-600 text-sm font-medium">Low</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
