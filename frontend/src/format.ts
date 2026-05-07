import type { Language } from "./types";

export function formatDate(value: string | null, language: Language): string {
  if (!value) {
    return language === "it" ? "Non disponibile" : "Not available";
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.valueOf())) {
    return value;
  }

  return new Intl.DateTimeFormat(language === "it" ? "it-IT" : "en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}

export function formatNumber(value: number, language: Language): string {
  return new Intl.NumberFormat(language === "it" ? "it-IT" : "en-US").format(
    value,
  );
}
