import { formatNumber } from "../format";
import type { Language } from "../types";

const pageSizeOptions = [25, 50, 100];

interface PaginationBarProps {
  language: Language;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  t: (key: string) => string;
  totalRows: number;
}

export function PaginationBar({
  language,
  onPageChange,
  onPageSizeChange,
  pageCount,
  pageIndex,
  pageSize,
  t,
  totalRows,
}: Readonly<PaginationBarProps>) {
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const lastRow = Math.min(totalRows, (pageIndex + 1) * pageSize);

  return (
    <section
      className="mt-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      aria-label={t("pagination")}
    >
      <div className="font-medium">
        {t("showingRows")} {formatNumber(firstRow, language)}-
        {formatNumber(lastRow, language)} {t("of")}{" "}
        {formatNumber(totalRows, language)}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2">
          <span>{t("rowsPerPage")}</span>
          <select
            className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-950 transition outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-950"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-slate-300 px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            type="button"
            disabled={pageIndex === 0}
            onClick={() => onPageChange(pageIndex - 1)}
          >
            {t("previous")}
          </button>
          <span className="min-w-24 text-center">
            {t("page")} {formatNumber(pageIndex + 1, language)} {t("of")}{" "}
            {formatNumber(pageCount, language)}
          </span>
          <button
            className="rounded-md border border-slate-300 px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            type="button"
            disabled={pageIndex >= pageCount - 1}
            onClick={() => onPageChange(pageIndex + 1)}
          >
            {t("next")}
          </button>
        </div>
      </div>
    </section>
  );
}
