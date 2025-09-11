"use client";

import React, { useState } from "react";
import {
  User,
  Edit3,
  Save,
  X,
  Activity,
  Droplets,
  Clock,
  Heart,
  TrendingUp,
} from "lucide-react";

// Type for BMI history entries
type BMIEntry = {
  date: string;
  value: number;
};

// Profile data type (matches all fields in your state)
type ProfileData = {
  // Basic Information
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;

  // Ayurvedic Assessment
  prakriti: string;
  vikriti: string;
  constitution: string;

  // Health Parameters
  height: string;
  weight: string;
  bmi: string;
  bloodPressure: string;
  pulseRate: string;
  bmiHistory: BMIEntry[];

  // Dietary Habits
  dietaryPreference: string;
  allergies: string;
  mealFrequency: string;
  waterIntake: string;

  // Lifestyle
  sleepPattern: string;
  exerciseFrequency: string;
  stressLevel: string;
  bowelMovement: string;

  // Medical History
  medicalConditions: string;
  currentMedications: string;
  lastConsultation: string;
};
type SectionHeaderProps = {
  icon: React.ElementType;
  title: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title }) => (
  <div className="flex items-center bg-gray-100 px-4 py-2 border-b border-gray-200">
    <Icon className="w-5 h-5 text-green-600 mr-2" />
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
  </div>
);

type ProfileField = keyof ProfileData;

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    // Basic Information
    name: "Priya Sharma",
    age: 32,
    gender: "Female",
    phone: "+91 98765 43210",
    email: "priya.sharma@email.com",
    address: "123 Wellness Street, Indore, MP 452001",

    // Ayurvedic Assessment
    prakriti: "Vata-Pitta",
    vikriti: "Pitta Imbalance",
    constitution: "Medium Build",

    // Health Parameters
    height: "5'4\"",
    weight: "58 kg",
    bmi: "22.3",
    bloodPressure: "120/80",
    pulseRate: "72 bpm",
    bmiHistory: [
      { date: "Jan 2023", value: 23.5 },
      { date: "Apr 2023", value: 23.0 },
      { date: "Jul 2023", value: 22.8 },
      { date: "Oct 2023", value: 22.5 },
      { date: "Jan 2024", value: 22.3 },
    ],

    // Dietary Habits
    dietaryPreference: "Vegetarian",
    allergies: "Nuts, Dairy",
    mealFrequency: "4 times/day",
    waterIntake: "2.5 liters/day",

    // Lifestyle
    sleepPattern: "7-8 hours",
    exerciseFrequency: "4 times/week",
    stressLevel: "Moderate",
    bowelMovement: "Regular - Once daily",

    // Medical History
    medicalConditions: "Mild Acidity, Occasional Headaches",
    currentMedications: "Ayurvedic digestive tablets",
    lastConsultation: "2024-08-15",
  });

  const [tempData, setTempData] = useState<ProfileData>(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
  };

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (
    field: ProfileField,
    value: ProfileData[ProfileField]
  ) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // InputField component
  type InputFieldProps = {
    label: string;
    field: ProfileField;
    type?: string;
    options?: string[] | null;
  };

  const InputField: React.FC<InputFieldProps> = ({
    label,
    field,
    type = "text",
    options = null,
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {options ? (
        <select
          value={
            isEditing
              ? (tempData[field] as string)
              : (profileData[field] as string)
          }
          onChange={(e) =>
            handleInputChange(
              field,
              e.target.value as ProfileData[ProfileField]
            )
          }
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-600"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={
            isEditing
              ? (tempData[field] as string | number)
              : (profileData[field] as string | number)
          }
          onChange={(e) => {
            const value =
              type === "number"
                ? ((parseInt(e.target.value) || 0) as ProfileData[ProfileField])
                : (e.target.value as ProfileData[ProfileField]);
            handleInputChange(field, value);
          }}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-600"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 mb-6 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {profileData.name}
              </h1>
              <p className="text-gray-600">Patient ID: AYU-2024-001</p>
              <p className="text-sm text-gray-500">
                Last Updated: {new Date().toISOString().split("T")[0]}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center space-x-2 shadow-md"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center space-x-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center space-x-2 shadow-md"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <SectionHeader icon={User} title="Basic Information" />
            <div className="p-6 space-y-4">
              <InputField label="Full Name" field="name" />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Age" field="age" type="number" />
                <InputField
                  label="Gender"
                  field="gender"
                  options={["Male", "Female", "Other"]}
                />
              </div>
              <InputField label="Phone" field="phone" />
              <InputField label="Email" field="email" type="email" />
              <InputField label="Address" field="address" />
            </div>
          </div>
        </div>

        {/* Ayurvedic Assessment */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <SectionHeader icon={Droplets} title="Ayurvedic Assessment" />
            <div className="p-6 space-y-4">
              <InputField
                label="Prakriti (Constitution)"
                field="prakriti"
                options={[
                  "Vata",
                  "Pitta",
                  "Kapha",
                  "Vata-Pitta",
                  "Vata-Kapha",
                  "Pitta-Kapha",
                  "Tridoshic",
                ]}
              />
              <InputField
                label="Vikriti (Current Imbalance)"
                field="vikriti"
                options={[
                  "Balanced",
                  "Vata Imbalance",
                  "Pitta Imbalance",
                  "Kapha Imbalance",
                  "Mixed Imbalance",
                ]}
              />
              <InputField label="Body Constitution" field="constitution" />
            </div>
          </div>

          {/* Health Parameters */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6 overflow-hidden">
            <SectionHeader icon={Activity} title="Health Parameters" />
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Height" field="height" />
                <InputField label="Weight" field="weight" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="BMI" field="bmi" />
                <InputField label="Blood Pressure" field="bloodPressure" />
              </div>
              <InputField label="Pulse Rate" field="pulseRate" />
            </div>
          </div>
        </div>

        {/* Dietary & Lifestyle */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <SectionHeader icon={Droplets} title="Dietary Habits" />
            <div className="p-6 space-y-4">
              <InputField
                label="Dietary Preference"
                field="dietaryPreference"
                options={[
                  "Vegetarian",
                  "Non-Vegetarian",
                  "Vegan",
                  "Jain",
                  "Eggetarian",
                ]}
              />
              <InputField label="Food Allergies" field="allergies" />
              <InputField label="Meal Frequency" field="mealFrequency" />
              <InputField label="Daily Water Intake" field="waterIntake" />
            </div>
          </div>

          {/* Lifestyle */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6 overflow-hidden">
            <SectionHeader icon={Clock} title="Lifestyle" />
            <div className="p-6 space-y-4">
              <InputField label="Sleep Pattern" field="sleepPattern" />
              <InputField
                label="Exercise Frequency"
                field="exerciseFrequency"
              />
              <InputField
                label="Stress Level"
                field="stressLevel"
                options={["Low", "Moderate", "High", "Very High"]}
              />
              <InputField label="Bowel Movement" field="bowelMovement" />
            </div>
          </div>
        </div>
      </div>

      {/* BMI Chart Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6 overflow-hidden">
        <SectionHeader icon={TrendingUp} title="BMI History Chart" />
        <div className="p-6">{/* <BMIChart /> */}</div>
      </div>

      {/* Medical History */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6 overflow-hidden">
        <SectionHeader icon={Heart} title="Medical History" />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Medical Conditions" field="medicalConditions" />
            <InputField
              label="Current Medications"
              field="currentMedications"
            />
            <InputField
              label="Last Consultation"
              field="lastConsultation"
              type="date"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6 p-4 bg-white rounded-lg shadow-sm">
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md">
          Generate Diet Chart
        </button>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md">
          View History
        </button>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md">
          Print Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
