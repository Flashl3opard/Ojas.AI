"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiClient } from "@/app/lib/api-client";
import { useAuthStore } from "@/app/lib/store/auth-store";
import { useThemeStore } from "@/app/lib/store/theme-store";
import { Button } from "@/app/components/ui/button";
import { Card, CardTitle } from "@/app/components/ui/card";

export default function PatientDashboardPage() {
  const router = useRouter();
  const { token, role, logout } = useAuthStore();
  const { darkMode, toggleTheme } = useThemeStore();
  const [selectedMealDay, setSelectedMealDay] = useState<string | null>(null);

  const patientsQuery = useQuery({
    queryKey: ["my-patients"],
    queryFn: () => apiClient.listPatients(token || ""),
    enabled: Boolean(token),
  });

  const patient = patientsQuery.data?.[0];

  const dietQuery = useQuery({
    queryKey: ["my-diet", patient?.id],
    queryFn: () => apiClient.getDietPlan(patient!.id, token || ""),
    enabled: Boolean(token && patient?.id),
  });

  const weeklyQuery = useQuery({
    queryKey: ["my-weekly", patient?.id],
    queryFn: () => apiClient.getWeeklyPlan(patient!.id, token || ""),
    enabled: Boolean(token && patient?.id),
  });

  const progressQuery = useQuery({
    queryKey: ["my-progress", patient?.id],
    queryFn: () => apiClient.listProgress(patient!.id, token || ""),
    enabled: Boolean(token && patient?.id),
  });

  const mealBreakdown = useMemo(() => {
    if (!dietQuery.data) {
      return [];
    }

    return Object.entries(dietQuery.data.meals_json).map(([meal, items]) => ({
      meal,
      calories: items.reduce((sum, item) => sum + item.calories, 0),
    }));
  }, [dietQuery.data]);

  if (!token || role !== "patient") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-lg text-center">
          <CardTitle>Patient access required</CardTitle>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Please login with a patient account.
          </p>
          <Button className="mt-4" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-100 p-4 dark:bg-slate-950">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Patient Dashboard</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Track your daily plan, meals, and nutrition progress.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={toggleTheme}>
            {darkMode ? "Light" : "Dark"} Mode
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Daily Meal Breakdown</CardTitle>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealBreakdown}>
                <XAxis dataKey="meal" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Nutrition Snapshot</CardTitle>
          {dietQuery.data ? (
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <strong>Daily Calories:</strong> {dietQuery.data.daily_calories}{" "}
                kcal
              </p>
              <p>
                <strong>Protein:</strong> {dietQuery.data.macros.protein}
              </p>
              <p>
                <strong>Carbs:</strong> {dietQuery.data.macros.carbs}
              </p>
              <p>
                <strong>Fats:</strong> {dietQuery.data.macros.fats}
              </p>
              <p>
                <strong>BMI:</strong> {patient?.bmi}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              No diet plan available yet.
            </p>
          )}
        </Card>
      </div>

      <Card>
        <CardTitle>Progress Over Time</CardTitle>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressQuery.data || []}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#0ea5e9"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Weekly Meal Planner</CardTitle>
          <Button
            variant="secondary"
            onClick={() => {
              const firstDay = weeklyQuery.data?.week
                ? Object.keys(weeklyQuery.data.week)[0]
                : null;
              setSelectedMealDay(firstDay);
            }}
          >
            Load This Week
          </Button>
        </div>

        {weeklyQuery.data?.week && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {Object.keys(weeklyQuery.data.week).map((day) => (
                <button
                  key={day}
                  className={`rounded-lg border px-3 py-1 text-sm ${selectedMealDay === day ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" : "border-slate-300 dark:border-slate-600"}`}
                  onClick={() => setSelectedMealDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>

            {selectedMealDay && (
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {Object.entries(weeklyQuery.data.week[selectedMealDay]).map(
                  ([mealName, items]) => (
                    <Card key={mealName} className="p-3">
                      <h3 className="font-semibold capitalize">{mealName}</h3>
                      <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                        {(
                          items as Array<{
                            name: string;
                            quantity: string;
                            calories: number;
                          }>
                        ).map((item, idx) => (
                          <li key={`${mealName}-${idx}`}>
                            {item.name} ({item.quantity}, {item.calories} kcal)
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ),
                )}
              </div>
            )}
          </div>
        )}
      </Card>

      {patient && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Downloads & Grocery</CardTitle>
            <a
              href={apiClient.getDietPlanPdfUrl(patient.id)}
              target="_blank"
              className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Download PDF Plan
            </a>
          </div>
          <GroceryList patientId={patient.id} token={token} />
        </Card>
      )}
    </div>
  );
}

function GroceryList({
  patientId,
  token,
}: {
  patientId: number;
  token: string;
}) {
  const groceryQuery = useQuery({
    queryKey: ["grocery", patientId],
    queryFn: () => apiClient.getGroceryList(patientId, token),
  });

  if (groceryQuery.isLoading) {
    return <p className="mt-3 text-sm">Loading grocery list...</p>;
  }

  return (
    <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-600 md:grid-cols-2 dark:text-slate-300">
      {groceryQuery.data?.items.map((item) => (
        <li
          key={item}
          className="rounded-md border border-slate-200 px-3 py-2 dark:border-slate-700"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
