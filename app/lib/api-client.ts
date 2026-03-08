import {
  AuthTokenResponse,
  DietPlan,
  LoginPayload,
  Patient,
  PatientCreatePayload,
  ProgressCreatePayload,
  ProgressLog,
  SignupPayload,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/backend";

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  signup: (payload: SignupPayload) => request("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload: LoginPayload) =>
    request<AuthTokenResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),

  listPatients: (token: string) => request<Patient[]>("/patients", { method: "GET" }, token),
  getPatient: (id: number, token: string) => request<Patient>(`/patients/${id}`, { method: "GET" }, token),
  createPatient: (payload: PatientCreatePayload, token: string) =>
    request<Patient>("/patients", { method: "POST", body: JSON.stringify(payload) }, token),

  generateDietPlan: (patientId: number, token: string) =>
    request<DietPlan>("/diet/generate", { method: "POST", body: JSON.stringify({ patient_id: patientId }) }, token),
  getDietPlan: (patientId: number, token: string) => request<DietPlan>(`/diet/${patientId}`, { method: "GET" }, token),
  getWeeklyPlan: (patientId: number, token: string) =>
    request<{ patient_id: number; daily_calories: number; macros: Record<string, string>; week: Record<string, Record<string, Array<{ name: string; quantity: string; calories: number }>>> }>(`/diet/${patientId}/weekly`, { method: "GET" }, token),
  getGroceryList: (patientId: number, token: string) =>
    request<{ patient_id: number; items: string[] }>(`/diet/${patientId}/grocery-list`, { method: "GET" }, token),

  createProgress: (payload: ProgressCreatePayload, token: string) =>
    request<ProgressLog>("/progress", { method: "POST", body: JSON.stringify(payload) }, token),
  listProgress: (patientId: number, token: string) =>
    request<ProgressLog[]>(`/progress/${patientId}`, { method: "GET" }, token),

  getDietPlanPdfUrl: (patientId: number) => `${API_BASE}/export/diet/${patientId}/pdf`,
};
