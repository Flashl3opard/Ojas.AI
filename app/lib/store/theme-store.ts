"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      toggleTheme: () => {
        const next = !get().darkMode;
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next);
        }
        set({ darkMode: next });
      },
    }),
    {
      name: "ojas-theme",
    }
  )
);
