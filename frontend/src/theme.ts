import type { Theme } from "./types";

const storageKey = "ccnl-dashboard-theme";

export function readInitialTheme(): Theme {
  const stored = localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return "light";
}

export function persistTheme(theme: Theme): void {
  localStorage.setItem(storageKey, theme);
}
