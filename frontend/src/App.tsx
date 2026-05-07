import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { loadDashboardData } from "./api";
import {
  CcnlTable,
  type SortDirection,
  type SortKey,
} from "./components/CcnlTable";
import { FiltersBar } from "./components/FiltersBar";
import { LanguageToggle } from "./components/LanguageToggle";
import { MetricsGrid } from "./components/MetricsGrid";
import { PaginationBar } from "./components/PaginationBar";
import { ThemeToggle } from "./components/ThemeToggle";
import { formatDate } from "./format";
import { persistLanguage, readInitialLanguage, translate } from "./i18n";
import { compareRows, nextSortDirection } from "./sort";
import { persistTheme, readInitialTheme } from "./theme";
import type { DashboardData, ExpirationStatus, Language, Theme } from "./types";

export function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(readInitialLanguage);
  const [theme, setTheme] = useState<Theme>(readInitialTheme);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ExpirationStatus | "">("");
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  const t = (key: string) => translate(language, key);

  useEffect(() => {
    document.documentElement.lang = language;
    persistLanguage(language);
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    loadDashboardData()
      .then(setData)
      .catch((loadError: unknown) => {
        setError(
          loadError instanceof Error ? loadError.message : String(loadError),
        );
      });
  }, []);

  const filteredRows = useMemo(() => {
    if (!data) {
      return [];
    }

    const cleanSearch = search.toLowerCase().trim();
    return [...data.rows]
      .filter((row) => {
        if (status && row.expiration_status !== status) {
          return false;
        }
        const haystack = [
          row.codice_ccnl,
          row.title,
          row.agreement_type,
          row.sector_descriptions.join(" "),
          row.subsector_descriptions.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return !cleanSearch || haystack.includes(cleanSearch);
      })
      .sort((left, right) => {
        const result = compareRows(left, right, sortKey);
        return sortDirection === "asc" ? result : -result;
      });
  }, [data, search, sortDirection, sortKey, status]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);
  const pageRows = filteredRows.slice(
    safePageIndex * pageSize,
    safePageIndex * pageSize + pageSize,
  );

  function handleSortChange(nextKey: SortKey) {
    setSortDirection((currentDirection) =>
      nextSortDirection(sortKey, currentDirection, nextKey),
    );
    setSortKey(nextKey);
    setPageIndex(0);
  }

  function handleSearchChange(nextSearch: string) {
    setSearch(nextSearch);
    setPageIndex(0);
  }

  function handleStatusChange(nextStatus: ExpirationStatus | "") {
    setStatus(nextStatus);
    setPageIndex(0);
  }

  function handlePageSizeChange(nextPageSize: number) {
    setPageSize(nextPageSize);
    setPageIndex(0);
  }

  if (error) {
    return (
      <Shell
        language={language}
        setLanguage={setLanguage}
        setTheme={setTheme}
        t={t}
        theme={theme}
      >
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200">
          {t("loadingError")}: {error}
        </div>
      </Shell>
    );
  }

  if (!data) {
    return (
      <Shell
        language={language}
        setLanguage={setLanguage}
        setTheme={setTheme}
        t={t}
        theme={theme}
      >
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Loading data...
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      language={language}
      metadata={`${t("referenceDate")} ${formatDate(data.metrics.reference_date, language)}`}
      setLanguage={setLanguage}
      setTheme={setTheme}
      t={t}
      theme={theme}
    >
      <MetricsGrid language={language} metrics={data.metrics} t={t} />
      <FiltersBar
        search={search}
        status={status}
        t={t}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
      />
      <PaginationBar
        language={language}
        pageCount={pageCount}
        pageIndex={safePageIndex}
        pageSize={pageSize}
        totalRows={filteredRows.length}
        t={t}
        onPageChange={setPageIndex}
        onPageSizeChange={handlePageSizeChange}
      />
      <CcnlTable
        language={language}
        rows={pageRows}
        sortDirection={sortDirection}
        sortKey={sortKey}
        t={t}
        onSortChange={handleSortChange}
      />
    </Shell>
  );
}

interface ShellProps {
  children: ReactNode;
  language: Language;
  metadata?: string;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
  theme: Theme;
}

function Shell({
  children,
  language,
  metadata,
  setLanguage,
  setTheme,
  t,
  theme,
}: Readonly<ShellProps>) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/95 shadow-sm dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-3 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">
              {t("ItalianCcnlOpenData")}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
              {t("dashboardTitle")}
            </h1>
          </div>
          <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-end">
            {metadata ? (
              <div className="w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:w-auto sm:px-4 sm:py-3 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                {metadata}
              </div>
            ) : null}
            <ThemeToggle label={t("theme")} theme={theme} onChange={setTheme} />
            <LanguageToggle
              language={language}
              label={t("language")}
              onChange={setLanguage}
            />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-3 py-5 text-center text-xs leading-5 text-slate-600 sm:px-6 lg:px-8 dark:text-slate-400">
          <p className="font-medium text-slate-700 dark:text-slate-300">
            &copy; {currentYear}{" "}
            <a
              className="underline decoration-slate-300 underline-offset-4 hover:text-blue-700 hover:decoration-blue-400 dark:decoration-slate-700 dark:hover:text-blue-300"
              href="https://riccardoruspoli.com"
              rel="noopener"
              target="_blank"
            >
              Riccardo Ruspoli
            </a>
          </p>
          <p>
            {t("footerSourcePrefix")}{" "}
            <a
              className="underline decoration-slate-300 underline-offset-4 hover:text-blue-700 hover:decoration-blue-400 dark:decoration-slate-700 dark:hover:text-blue-300"
              href="https://www.cnel.it/Archivio-Contratti-Collettivi/Contratti-Open-Data"
              rel="noreferrer noopener"
              target="_blank"
            >
              CNEL Open Data
            </a>
            {t("footerLicensePrefix")}{" "}
            <a
              className="underline decoration-slate-300 underline-offset-4 hover:text-blue-700 hover:decoration-blue-400 dark:decoration-slate-700 dark:hover:text-blue-300"
              href="https://www.dati.gov.it/content/italian-open-data-license-v20"
              rel="noreferrer noopener"
              target="_blank"
            >
              Italian Open Data License v2.0
            </a>
            {t("footerLicenseSuffix")}
          </p>
          <p className="max-w-3xl">{t("footerDisclaimer")}</p>
        </div>
      </footer>
    </div>
  );
}
