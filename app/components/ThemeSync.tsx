"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/app/lib/store/theme-store";

export default function ThemeSync() {
  const darkMode = useThemeStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return null;
}
