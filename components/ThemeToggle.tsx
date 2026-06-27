"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Sync with whatever the pre-paint script already applied
  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("light") ? "light" : "dark",
    );
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      // white + mix-blend-difference keeps the glyph legible on any background
      className="fixed bottom-6 left-6 z-[9990] flex h-10 w-10 items-center justify-center rounded-full text-[18px] leading-none text-white mix-blend-difference transition-transform duration-200 ease-out hover:scale-110 md:bottom-8 md:left-8"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
