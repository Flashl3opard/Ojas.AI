"use client";

import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiUser,
  FiCoffee,
  FiActivity,
  FiDroplet,
  FiClock,
  FiBookOpen,
  FiHeart,
  FiCalendar,
  FiTrendingUp,
  FiBarChart2,
  FiEdit,
} from "react-icons/fi";
import { useState } from "react";

type EditablePatientFields =
  | "weight"
  | "height"
  | "heartRate"
  | "bloodPressure"
  | "bodyTemperature"
  | "respiratoryRate"
  | "oxygenSaturation"
  | "dietaryHabits"
  | "mealFrequency"
  | "bowelMovements"
  | "waterIntake"
  | "physicalActivity"
  | "stressLevel";

export default function AnshBireProfile() {
  const router = useRouter();

  // Doctor-focused patient data (state for editing)
  const [patient, setPatient] = useState({
    name: "Ansh Bire",
    age: 32,
    gender: "Male",
    height: 175, // cm
    weight: 70, // kg
    bmi: 22.8, // weight / (height/100)^2
    dietaryHabits: "Vegetarian, occasional dairy",
    mealFrequency: "3 main meals + 1 snack",
    bowelMovements: "Once daily, slightly irregular",
    waterIntake: "2.5 L/day",
    physicalActivity: "30 min yoga + 20 min walk daily",
    stressLevel: "Moderate",
    adherence: 78, // % adherence
    totalAppointments: 5,
    heartRate: 72, // bpm
    bloodPressure: "120/80", // mmHg
    bodyTemperature: 36.8, // °C
    respiratoryRate: 16, // breaths/min
    oxygenSaturation: 98, // SpO₂ %
    notes:
      "Patient reports occasional bloating and mild lethargy in mornings. Recommended warm, light meals, consistent hydration, and regular physical activity. Follow-up scheduled next month.",
  });

  // Color-coded BMI for quick assessment
  const bmiColor =
    patient.bmi < 18.5
      ? "bg-yellow-200 text-yellow-800"
      : patient.bmi < 25
      ? "bg-green-200 text-green-800"
      : patient.bmi < 30
      ? "bg-yellow-200 text-yellow-800"
      : "bg-red-200 text-red-800";

  const handleEdit = (field: EditablePatientFields) => {
    const currentValue = patient[field];
    const newValue = prompt(`Update ${field}`, `${currentValue}`);
    if (newValue !== null) {
      setPatient((prev) => ({ ...prev, [field]: newValue }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition"
          >
            <FiArrowLeft className="text-lg" /> Back
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            Patient Dashboard — {patient.name}
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push("/diet-doc")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Create Diet Plan
          </button>
          <button
            onClick={() => alert("Re-assessment triggered!")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Re-assess Body Metrics
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Basic Info */}
        <section className="bg-white p-6 rounded-xl shadow flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-green-100 rounded-full p-5">
            <FiUser className="text-green-600 text-4xl" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{patient.name}</h2>
            <p className="text-gray-500">
              Age: {patient.age} | Gender: {patient.gender}
            </p>
          </div>
        </section>

        {/* Vitals & Body Metrics */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Vitals & Body Metrics</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <MetricCard
              icon={<FiBarChart2 />}
              title="Body Metrics"
              value={`Weight: ${patient.weight} kg | Height: ${patient.height} cm`}
              onEdit={() => handleEdit("weight")}
            />
            <MetricCard
              icon={<FiBarChart2 />}
              title="BMI"
              value={patient.bmi.toFixed(1)}
              badgeClass={bmiColor}
            />
            <MetricCard
              icon={<FiHeart />}
              title="Heart Rate"
              value={`${patient.heartRate} bpm`}
              onEdit={() => handleEdit("heartRate")}
            />
            <MetricCard
              icon={<FiBarChart2 />}
              title="Blood Pressure"
              value={patient.bloodPressure}
              onEdit={() => handleEdit("bloodPressure")}
            />
            <MetricCard
              icon={<FiBarChart2 />}
              title="Body Temperature"
              value={`${patient.bodyTemperature} °C`}
              onEdit={() => handleEdit("bodyTemperature")}
            />
            <MetricCard
              icon={<FiBarChart2 />}
              title="Respiratory Rate"
              value={`${patient.respiratoryRate} breaths/min`}
              onEdit={() => handleEdit("respiratoryRate")}
            />
            <MetricCard
              icon={<FiBarChart2 />}
              title="Oxygen Saturation"
              value={`${patient.oxygenSaturation}%`}
              onEdit={() => handleEdit("oxygenSaturation")}
            />
            <MetricCard
              icon={<FiCalendar />}
              title="Appointments"
              value={`${patient.totalAppointments} visits`}
            />
            <MetricCard
              icon={<FiTrendingUp />}
              title="Adherence"
              value={`${patient.adherence}%`}
              progress={patient.adherence}
            />
          </div>
        </section>

        {/* Lifestyle Metrics */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Lifestyle & Habits</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <MetricCard
              icon={<FiCoffee />}
              title="Dietary Habits"
              value={patient.dietaryHabits}
              onEdit={() => handleEdit("dietaryHabits")}
            />
            <MetricCard
              icon={<FiClock />}
              title="Meal Frequency"
              value={patient.mealFrequency}
              onEdit={() => handleEdit("mealFrequency")}
            />
            <MetricCard
              icon={<FiBookOpen />}
              title="Bowel Movements"
              value={patient.bowelMovements}
              onEdit={() => handleEdit("bowelMovements")}
            />
            <MetricCard
              icon={<FiDroplet />}
              title="Water Intake"
              value={patient.waterIntake}
              onEdit={() => handleEdit("waterIntake")}
            />
            <MetricCard
              icon={<FiActivity />}
              title="Physical Activity"
              value={patient.physicalActivity}
              onEdit={() => handleEdit("physicalActivity")}
            />
            <MetricCard
              icon={<FiHeart />}
              title="Stress Level"
              value={patient.stressLevel}
              onEdit={() => handleEdit("stressLevel")}
            />
          </div>
        </section>

        {/* Doctor's Notes */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">Doctor&apos;s Notes</h3>
          <div className="bg-gray-50 border rounded-lg p-4 text-gray-600 text-sm leading-relaxed">
            {patient.notes}
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  progress,
  badgeClass,
  onEdit,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  progress?: number;
  badgeClass?: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-2 border rounded-lg p-4 hover:shadow-sm transition">
      <div className="flex items-center gap-3 w-full">
        <div className="p-2 bg-green-50 rounded-lg text-green-600 text-lg">
          {icon}
        </div>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h4 className="font-medium text-gray-800">{title}</h4>
            <p className={`text-gray-500 text-sm ${badgeClass || ""}`}>
              {value}
            </p>
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800 transition p-1 rounded-full"
              title="Edit"
            >
              <FiEdit />
            </button>
          )}
        </div>
      </div>
      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              progress >= 75
                ? "bg-green-500"
                : progress >= 50
                ? "bg-yellow-400"
                : "bg-red-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
