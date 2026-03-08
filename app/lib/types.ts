export type UserRole = "dietitian" | "patient";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface Patient {
  id: number;
  dietitian_id: number;
  patient_user_id?: number | null;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number;
  weight: number;
  bmi: number;
  activity_level: "sedentary" | "light" | "moderate" | "active" | "athlete";
  medical_conditions?: string | null;
  allergies?: string | null;
  dietary_preferences?: string | null;
  goal: "weight_loss" | "maintenance" | "weight_gain";
  created_at: string;
}

export interface PatientCreatePayload {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number;
  weight: number;
  activity_level: "sedentary" | "light" | "moderate" | "active" | "athlete";
  medical_conditions?: string;
  allergies?: string;
  dietary_preferences?: string;
  goal: "weight_loss" | "maintenance" | "weight_gain";
  patient_user_id?: number;
}

export interface DietPlan {
  id: number;
  patient_id: number;
  created_at: string;
  daily_calories: number;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
  };
  meals_json: Record<string, Array<{ name: string; calories: number; quantity: string; notes?: string }>>;
}

export interface ProgressLog {
  id: number;
  patient_id: number;
  date: string;
  weight: number;
  notes?: string | null;
}

export interface ProgressCreatePayload {
  patient_id: number;
  date: string;
  weight: number;
  notes?: string;
}
