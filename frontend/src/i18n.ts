import type { Language } from "./types";

type Messages = Record<string, string>;

export const defaultLanguage: Language = "it";

export const messages: Record<Language, Messages> = {
  en: {
    active: "Active",
    all: "All",
    averageDelay: "Average delay",
    code: "Code",
    contractualExpiry: "Contractual expiry",
    currentCcnl: "Current CCNL",
    dashboardTitle: "CCNL Monitoring",
    daysFromExpiryWithUnit: "Days since expiry",
    daysUnit: "days",
    economicExpiry: "Economic expiry",
    effectiveDate: "Effective date",
    expired: "Expired",
    expiredPercent: "Expired %",
    footerDisclaimer:
      "This is an independent, informational project and does not replace institutional sources, legal advice, union advice, or the applicable agreement text.",
    footerLicensePrefix: " public datasets, redistributed under the",
    footerLicenseSuffix: ".",
    footerSourcePrefix: "Data derived from",
    ItalianCcnlOpenData: "Italian CCNL Open Data",
    language: "Language",
    loadingError: "Unable to load dashboard data",
    next: "Next",
    of: "of",
    page: "Page",
    pagination: "Table pagination",
    previous: "Previous",
    referenceDate: "Reference date:",
    rowsPerPage: "Rows per page",
    search: "Search",
    searchPlaceholder: "Code, title, sector...",
    sector: "Sector",
    signingDate: "Signing date",
    showingRows: "Showing",
    "status.active": "Active",
    "status.expired": "Expired",
    "status.unknown": "Unknown",
    status: "Status",
    title: "Title",
    theme: "Theme",
    type: "Agreement Type",
    unknown: "Unknown",
    unknownExpiry: "Unknown expiry",
  },
  it: {
    active: "Attivi",
    all: "Tutti",
    averageDelay: "Ritardo medio",
    code: "Codice",
    contractualExpiry: "Scadenza contrattuale",
    currentCcnl: "Correnti",
    dashboardTitle: "Monitoraggio CCNL",
    daysFromExpiryWithUnit: "Giorni dalla scadenza",
    daysUnit: "giorni",
    economicExpiry: "Scadenza economica",
    effectiveDate: "Decorrenza",
    expired: "Scaduti",
    expiredPercent: "% scaduti",
    footerDisclaimer:
      "Progetto indipendente a scopo informativo: non sostituisce fonti istituzionali, consulenza legale o sindacale, o il testo contrattuale applicabile.",
    footerLicensePrefix: ", ridistribuiti secondo la",
    footerLicenseSuffix: ".",
    footerSourcePrefix: "Dati elaborati da",
    ItalianCcnlOpenData: "Open data CCNL italiani",
    language: "Lingua",
    loadingError: "Impossibile caricare i dati della dashboard",
    next: "Successiva",
    of: "di",
    page: "Pagina",
    pagination: "Paginazione tabella",
    previous: "Precedente",
    referenceDate: "Data di riferimento:",
    rowsPerPage: "Righe per pagina",
    search: "Cerca",
    searchPlaceholder: "Codice, titolo, settore...",
    sector: "Settore",
    signingDate: "Stipula",
    showingRows: "Mostra",
    "status.active": "Attivo",
    "status.expired": "Scaduto",
    "status.unknown": "Sconosciuto",
    status: "Stato",
    title: "Titolo",
    theme: "Tema",
    type: "Tipo accordo",
    unknown: "Sconosciuti",
    unknownExpiry: "Scad. sconosciuta",
  },
};

export function translate(language: Language, key: string): string {
  return messages[language][key] ?? messages.en[key] ?? key;
}

export function readInitialLanguage(): Language {
  const stored = localStorage.getItem("ccnl-dashboard-language");
  return stored === "it" || stored === "en" ? stored : defaultLanguage;
}

export function persistLanguage(language: Language): void {
  localStorage.setItem("ccnl-dashboard-language", language);
}
