"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/app/lib/api-client";
import { useAuthStore } from "@/app/lib/store/auth-store";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";

const SignupPage = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState<"dietitian" | "patient">("patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiClient.signup({
        name: fullName,
        email,
        password,
        role: userRole,
      });
      const loginResult = await apiClient.login({ email, password });
      setAuth(loginResult.access_token, loginResult.role);
      router.push(
        loginResult.role === "dietitian"
          ? "/dashboard/dietitian"
          : "/dashboard/patient",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-100 px-4 py-16 dark:from-slate-950 dark:to-slate-900">
      <Card className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold">Create your Ojas.AI account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Dietitians manage patients. Patients track their own plan and
          progress.
        </p>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <Input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            value={userRole}
            onChange={(e) =>
              setUserRole(e.target.value as "dietitian" | "patient")
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          >
            <option value="patient">Patient</option>
            <option value="dietitian">Dietitian</option>
          </select>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-emerald-600 hover:text-emerald-700"
          >
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default SignupPage;
