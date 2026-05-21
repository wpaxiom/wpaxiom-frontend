"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("wpaxiom-theme") as Theme | null;
    const initial: Theme = stored === "light" ? "light" : "dark";
    setTheme(initial);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("wpaxiom-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="p-2 rounded-md text-muted hover:text-ink hover:bg-elevated focus-coral transition"
    >
      {mounted && theme === "dark" ? <Moon size={18} strokeWidth={1.7} /> : <Sun size={18} strokeWidth={1.7} />}
    </button>
  );
}
