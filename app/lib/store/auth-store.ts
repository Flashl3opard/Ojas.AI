"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "../types";

interface AuthState {
  token: string | null;
  role: UserRole | null;
  setAuth: (token: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      setAuth: (token, role) => set({ token, role }),
      logout: () => set({ token: null, role: null }),
    }),
    {
      name: "ojas-auth",
    }
  )
);
