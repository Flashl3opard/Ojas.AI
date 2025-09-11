// pages/weekly-diet.tsx
import React from "react";
import Navbar from "../components/Navbar";

// Dummy menu data
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const meals = [
  {
    time: "Breakfast",
    hour: "7:00 AM",
    food: "Moong Dal Khichdi",
    calories: 250,
  },
  {
    time: "Mid-Morning Snack",
    hour: "10:00 AM",
    food: "Fruits Bowl",
    calories: 150,
  },
  {
    time: "Lunch",
    hour: "1:00 PM",
    food: "Kitchari with Steamed Greens",
    calories: 400,
  },
  {
    time: "Evening Snack",
    hour: "5:00 PM",
    food: "Dates & Nuts",
    calories: 120,
  },
  { time: "Dinner", hour: "8:00 PM", food: "Vegetable Soup", calories: 200 },
];

const patientInfo = {
  name: "Yash Sheorey",
  age: 22,
  weight: 78,
  dosha: "Vata-Pitta",
  waterIntake: "Low",
  plans: [
    { date: "10/19/2023", name: "Detox Cleanse" },
    { date: "10/20/2023", name: "Digestive Boost" },
  ],
};

const WeeklyDiet: React.FC = () => (
  <>
    <Navbar />
    <div className="flex bg-[#f9fafb] min-h-screen font-sans">
      {/* Sidebar */}

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-green-800">
          Weekly Diet Summary
        </h1>
        {/* Week tabs */}
        <div className="flex items-center gap-3 mb-4">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              className="px-3 py-1 rounded bg-green-200 text-green-900 font-semibold shadow"
            >
              {day}
            </button>
          ))}
        </div>
        {/* Day summary cards */}
        <div className="grid grid-cols-3 gap-8">
          {meals.map((meal) => (
            <div
              key={meal.time}
              className="bg-white rounded-xl shadow-md p-5 border mb-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-green-700">
                  {meal.time}
                </span>
                <span className="text-sm text-gray-500">{meal.hour}</span>
              </div>
              <div className="mb-3 font-semibold text-gray-800">
                {meal.food}
              </div>
              <div className="mb-1 text-gray-600">
                Calories: {meal.calories} kcal
              </div>
              <div className="text-gray-600">Recommended: Vata, Pitta</div>
              <div className="text-xs text-green-700 mt-2">
                Add / Edit / Delete
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sidebar summary */}
      <aside className="w-80 pl-6 pr-6 pt-10 flex flex-col bg-white border-l">
        <div className="mb-6">
          <div className="text-lg font-bold text-green-800">
            {patientInfo.name}, {patientInfo.age}
          </div>
          <ul className="mt-2 space-y-2 text-gray-700">
            <li>Weight: {patientInfo.weight} kg</li>
            <li>Dosha: {patientInfo.dosha}</li>
            <li>
              Water Intake:{" "}
              <span className="text-red-600">{patientInfo.waterIntake}</span>
            </li>
          </ul>
        </div>
        <div className="mb-6 border-t pt-4">
          <div className="text-green-900 font-bold mb-2">Patient Summary</div>
          <ul className="space-y-1 text-gray-800">
            {patientInfo.plans.map((plan) => (
              <li key={plan.date}>
                <span className="text-green-800 font-medium">{plan.date}</span>:{" "}
                {plan.name}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  </>
);

export default WeeklyDiet;
