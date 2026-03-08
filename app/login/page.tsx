"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/app/lib/api-client";
import { useAuthStore } from "@/app/lib/store/auth-store";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";

const LoginPage = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.login({ email, password });
      setAuth(result.access_token, result.role);
      router.push(
        result.role === "dietitian"
          ? "/dashboard/dietitian"
          : "/dashboard/patient",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-100 px-4 py-16 dark:from-slate-950 dark:to-slate-900">
      <Card className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold">Login to Ojas.AI</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Secure role-based access for dietitians and patients.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-emerald-600 hover:text-emerald-700"
          >
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
