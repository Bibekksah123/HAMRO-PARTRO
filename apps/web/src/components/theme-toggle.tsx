"use client";

import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("merodin-theme");
    if (savedTheme === "light" || savedTheme === "dark")
      document.documentElement.dataset.theme = savedTheme;
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const activeTheme =
      root.dataset.theme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    const nextTheme = activeTheme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    window.localStorage.setItem("merodin-theme", nextTheme);
  }

  return (
    <button
      aria-label="Toggle light and dark theme"
      className="theme-toggle"
      onClick={toggleTheme}
      title="Toggle theme"
      type="button"
    >
      <span aria-hidden="true">◐</span>
    </button>
  );
}
