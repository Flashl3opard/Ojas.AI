"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import { useAuthStore } from "@/app/lib/store/auth-store";
import { Button } from "@/app/components/ui/button";
import { Card, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useThemeStore } from "@/app/lib/store/theme-store";

const emptyPatient = {
  name: "",
  age: 30,
  gender: "female" as "male" | "female" | "other",
  height: 165,
  weight: 65,
  activity_level: "moderate" as
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "athlete",
  medical_conditions: "",
  allergies: "",
  dietary_preferences: "",
  goal: "maintenance" as "weight_loss" | "maintenance" | "weight_gain",
};

export default function DietitianDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, role, logout } = useAuthStore();
  const { darkMode, toggleTheme } = useThemeStore();

  const [form, setForm] = useState(emptyPatient);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null,
  );
  const [progressWeight, setProgressWeight] = useState(0);
  const [progressNotes, setProgressNotes] = useState("");

  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: () => apiClient.listPatients(token || ""),
    enabled: Boolean(token),
  });

  const selectedPatient = useMemo(
    () => patientsQuery.data?.find((p) => p.id === selectedPatientId) || null,
    [patientsQuery.data, selectedPatientId],
  );

  const progressQuery = useQuery({
    queryKey: ["progress", selectedPatientId],
    queryFn: () => apiClient.listProgress(selectedPatientId!, token || ""),
    enabled: Boolean(token && selectedPatientId),
  });

  const dietQuery = useQuery({
    queryKey: ["diet", selectedPatientId],
    queryFn: () => apiClient.getDietPlan(selectedPatientId!, token || ""),
    enabled: Boolean(token && selectedPatientId),
  });

  const createPatientMutation = useMutation({
    mutationFn: () => apiClient.createPatient(form, token || ""),
    onSuccess: () => {
      setForm(emptyPatient);
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const generatePlanMutation = useMutation({
    mutationFn: () =>
      apiClient.generateDietPlan(selectedPatientId!, token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diet", selectedPatientId] });
    },
  });

  const createProgressMutation = useMutation({
    mutationFn: () =>
      apiClient.createProgress(
        {
          patient_id: selectedPatientId!,
          date: new Date().toISOString().slice(0, 10),
          weight: progressWeight,
          notes: progressNotes,
        },
        token || "",
      ),
    onSuccess: () => {
      setProgressWeight(0);
      setProgressNotes("");
      queryClient.invalidateQueries({
        queryKey: ["progress", selectedPatientId],
      });
    },
  });

  if (!token || role !== "dietitian") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-lg text-center">
          <CardTitle>Dietitian access required</CardTitle>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Please login with a dietitian account.
          </p>
          <Button className="mt-4" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-slate-100 p-4 lg:grid-cols-[280px_1fr] dark:bg-slate-950">
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-xl font-bold">Ojas.AI</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Dietitian Dashboard
        </p>

        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={toggleTheme}
        >
          {darkMode ? "Switch to Light" : "Switch to Dark"}
        </Button>

        <Button
          variant="ghost"
          className="mt-2 w-full"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Logout
        </Button>

        <div className="mt-6">
          <h2 className="font-semibold">Patients</h2>
          <div className="mt-3 space-y-2">
            {patientsQuery.data?.map((patient) => (
              <button
                key={patient.id}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                  selectedPatientId === patient.id
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                }`}
                onClick={() => setSelectedPatientId(patient.id)}
              >
                <div className="font-medium">{patient.name}</div>
                <div className="text-xs text-slate-500">BMI {patient.bmi}</div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="space-y-6">
        <Card>
          <CardTitle>Create Patient Profile</CardTitle>
          <form
            className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              createPatientMutation.mutate();
            }}
          >
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: Number(e.target.value) })
              }
              required
            />
            <Input
              type="number"
              placeholder="Height (cm)"
              value={form.height}
              onChange={(e) =>
                setForm({ ...form, height: Number(e.target.value) })
              }
              required
            />
            <Input
              type="number"
              placeholder="Weight (kg)"
              value={form.weight}
              onChange={(e) =>
                setForm({ ...form, weight: Number(e.target.value) })
              }
              required
            />

            <select
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              value={form.gender}
              onChange={(e) =>
                setForm({
                  ...form,
                  gender: e.target.value as "male" | "female" | "other",
                })
              }
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>

            <select
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              value={form.activity_level}
              onChange={(e) =>
                setForm({
                  ...form,
                  activity_level: e.target.value as
                    | "sedentary"
                    | "light"
                    | "moderate"
                    | "active"
                    | "athlete",
                })
              }
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="athlete">Athlete</option>
            </select>

            <select
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              value={form.goal}
              onChange={(e) =>
                setForm({
                  ...form,
                  goal: e.target.value as
                    | "weight_loss"
                    | "maintenance"
                    | "weight_gain",
                })
              }
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="maintenance">Maintenance</option>
              <option value="weight_gain">Weight Gain</option>
            </select>

            <Input
              placeholder="Medical conditions"
              value={form.medical_conditions}
              onChange={(e) =>
                setForm({ ...form, medical_conditions: e.target.value })
              }
            />
            <Input
              placeholder="Allergies"
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            />
            <Input
              placeholder="Dietary preferences"
              value={form.dietary_preferences}
              onChange={(e) =>
                setForm({ ...form, dietary_preferences: e.target.value })
              }
            />

            <Button
              type="submit"
              className="md:col-span-2"
              disabled={createPatientMutation.isPending}
            >
              {createPatientMutation.isPending
                ? "Creating..."
                : "Create Patient"}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Diet Plan Generator</CardTitle>
            <div className="flex gap-2">
              <Button
                disabled={!selectedPatientId || generatePlanMutation.isPending}
                onClick={() => generatePlanMutation.mutate()}
              >
                {generatePlanMutation.isPending
                  ? "Generating..."
                  : "Generate / Regenerate"}
              </Button>
              {selectedPatientId && (
                <a
                  className="inline-flex items-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100"
                  href={apiClient.getDietPlanPdfUrl(selectedPatientId)}
                  target="_blank"
                >
                  Export PDF
                </a>
              )}
            </div>
          </div>

          {selectedPatient && dietQuery.data && (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Latest plan for <strong>{selectedPatient.name}</strong>:{" "}
                {dietQuery.data.daily_calories} kcal
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Card className="p-3">
                  <p className="text-sm">Protein</p>
                  <p className="text-lg font-semibold">
                    {dietQuery.data.macros.protein}
                  </p>
                </Card>
                <Card className="p-3">
                  <p className="text-sm">Carbs</p>
                  <p className="text-lg font-semibold">
                    {dietQuery.data.macros.carbs}
                  </p>
                </Card>
                <Card className="p-3">
                  <p className="text-sm">Fats</p>
                  <p className="text-lg font-semibold">
                    {dietQuery.data.macros.fats}
                  </p>
                </Card>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <CardTitle>Progress Tracking</CardTitle>
          {selectedPatientId ? (
            <>
              <form
                className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_2fr_auto]"
                onSubmit={(e) => {
                  e.preventDefault();
                  createProgressMutation.mutate();
                }}
              >
                <Input
                  type="number"
                  placeholder="Weight (kg)"
                  value={progressWeight || ""}
                  onChange={(e) => setProgressWeight(Number(e.target.value))}
                  required
                />
                <Input
                  placeholder="Notes"
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                />
                <Button
                  type="submit"
                  disabled={createProgressMutation.isPending}
                >
                  Add Log
                </Button>
              </form>

              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressQuery.data || []}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#059669"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Select a patient to track progress.
            </p>
          )}
        </Card>
      </main>
    </div>
  );
}
