import { isExpirationStatus, type ExpirationStatus } from "../types";

interface FiltersBarProps {
  search: string;
  status: ExpirationStatus | "";
  t: (key: string) => string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ExpirationStatus | "") => void;
}

export function FiltersBar({
  search,
  status,
  t,
  onSearchChange,
  onStatusChange,
}: Readonly<FiltersBarProps>) {
  return (
    <section
      className="mt-6 grid min-w-0 gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-[minmax(0,1fr)_220px] sm:p-4 dark:border-slate-800 dark:bg-slate-900"
      aria-label="Dashboard filters"
    >
      <label className="grid min-w-0 gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
        {t("search")}
        <input
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 transition outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
          type="search"
          value={search}
          placeholder={t("searchPlaceholder")}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
      <label className="grid min-w-0 gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
        {t("status")}
        <select
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-950"
          value={status}
          onChange={(event) => onStatusChange(parseStatus(event.target.value))}
        >
          <option value="">{t("all")}</option>
          <option value="expired">{t("expired")}</option>
          <option value="active">{t("active")}</option>
          <option value="unknown">{t("unknown")}</option>
        </select>
      </label>
    </section>
  );
}

function parseStatus(value: string): ExpirationStatus | "" {
  return isExpirationStatus(value) ? value : "";
}
