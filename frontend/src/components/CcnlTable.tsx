import { formatDate, formatNumber } from "../format";
import type { CurrentCcnl, ExpirationStatus, Language } from "../types";

export type SortDirection = "asc" | "desc";

export type SortKey =
  | "agreementType"
  | "code"
  | "delay"
  | "effectiveDate"
  | "economicExpiry"
  | "expiry"
  | "sector"
  | "signingDate"
  | "status"
  | "title";

interface CcnlTableProps {
  language: Language;
  onSortChange: (key: SortKey) => void;
  rows: CurrentCcnl[];
  sortDirection: SortDirection;
  sortKey: SortKey;
  t: (key: string) => string;
}

const statusClasses: Record<ExpirationStatus, string> = {
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/60 dark:text-emerald-300",
  expired:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/60 dark:text-red-300",
  unknown:
    "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function CcnlTable({
  language,
  onSortChange,
  rows,
  sortDirection,
  sortKey,
  t,
}: Readonly<CcnlTableProps>) {
  return (
    <section className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
          <colgroup>
            <col className="w-[86px]" />
            <col className="w-[260px]" />
            <col className="w-[112px]" />
            <col className="w-[104px]" />
            <col className="w-[112px]" />
            <col className="w-[128px]" />
            <col className="w-[128px]" />
            <col className="w-[112px]" />
            <col className="w-[150px]" />
            <col className="w-[170px]" />
          </colgroup>
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <HeaderCell
                columnKey="code"
                label={t("code")}
                sortDirection={sortDirection}
                sortKey={sortKey}
                onSortChange={onSortChange}
              />
              <HeaderCell
                columnKey="title"
                label={t("title")}
                sortDirection={sortDirection}
                sortKey={sortKey}
                onSortChange={onSortChange}
              />
              <HeaderCell
                columnKey="status"
                label={t("status")}
                sortDirection={sortDirection}
                sortKey={sortKey}
                onSortChange={onSortChange}
              />
              <HeaderCell
                columnKey="signingDate"
                label={t("signingDate")}
                sortDirection={sortDirection}
                sortKey={sortKey}
                onSortChange={onSortChange}
              />
              <HeaderCell
                columnKey="effectiveDate"
                label={t("effectiveDate")}
                sortDirection={sortDirection}
                sortKey={sortKey}
                onSortChange={onSortChange}
              />
              <HeaderCell
                columnKey="expiry"
                label={t("contractualExpiry")}
                sortDirection={sortDirection}
                sortKey={sortKey}
                onSortChange={onSortChange}
              />
              <HeaderCell
                columnKey="economicExpiry"
                label={t("economicExpiry")}
                sortDirection={sortDirection}
                sortKey={sortKey}
                onSortChange={onSortChange}
              />
              <HeaderCell
                columnKey="delay"
                label={t("daysFromExpiryWithUnit")}
                sortDirection={sortDirection}
                sortKey={sortKey}
                onSortChange={onSortChange}
              />
              <HeaderCell
                columnKey="agreementType"
                label={t("type")}
                sortDirection={sortDirection}
                sortKey={sortKey}
                onSortChange={onSortChange}
              />
              <HeaderCell
                columnKey="sector"
                label={t("sector")}
                sortDirection={sortDirection}
                sortKey={sortKey}
                onSortChange={onSortChange}
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row) => (
              <tr
                key={row.row_id}
                className="align-top transition hover:bg-blue-50/40 dark:hover:bg-slate-800/70"
              >
                <td className="px-3 py-3">
                  <span className="inline-flex max-w-full rounded-md bg-slate-100 px-1.5 py-1 font-mono text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                    {row.codice_ccnl}
                  </span>
                </td>
                <td className="px-3 py-3 font-medium text-slate-900 dark:text-slate-100">
                  <span
                    className="block break-words whitespace-normal"
                    title={row.title}
                  >
                    {row.title}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex max-w-full justify-center rounded-md border px-1.5 py-1 text-xs font-semibold capitalize ${statusClasses[row.expiration_status]}`}
                  >
                    {t(`status.${row.expiration_status}`)}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                  {formatDate(row.signing_date, language)}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                  {formatDate(row.effective_date, language)}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                  {formatDate(row.contractual_expiry_date, language)}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                  {formatDate(row.economic_expiry_date, language)}
                </td>
                <td className="px-3 py-3 text-right whitespace-nowrap text-slate-700 tabular-nums dark:text-slate-300">
                  {row.renewal_delay_days > 0
                    ? formatNumber(row.renewal_delay_days, language)
                    : "-"}
                </td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                  <span
                    className="block break-words whitespace-normal"
                    title={row.agreement_type ?? ""}
                  >
                    {row.agreement_type ?? ""}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                  <span
                    className="block break-words whitespace-normal"
                    title={row.sector_descriptions.join(", ")}
                  >
                    {row.sector_descriptions.join(", ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

interface HeaderCellProps {
  columnKey: SortKey;
  label: string;
  onSortChange: (key: SortKey) => void;
  sortDirection: SortDirection;
  sortKey: SortKey;
}

function HeaderCell({
  columnKey,
  label,
  onSortChange,
  sortDirection,
  sortKey,
}: Readonly<HeaderCellProps>) {
  const isActive = sortKey === columnKey;
  const indicator = isActive ? (sortDirection === "asc" ? "↑" : "↓") : "↕";

  return (
    <th
      className="sticky top-0 border-b border-slate-200 px-3 py-3 dark:border-slate-800"
      aria-sort={
        isActive
          ? sortDirection === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <button
        className="grid max-w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-1 rounded-md text-left font-semibold text-slate-600 uppercase transition outline-none hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-200 dark:text-slate-400 dark:hover:text-blue-300 dark:focus-visible:ring-blue-950"
        type="button"
        onClick={() => onSortChange(columnKey)}
      >
        <span className="min-w-0 break-words whitespace-normal">{label}</span>
        <span
          className={`pt-0.5 text-[0.7rem] leading-none ${
            isActive ? "text-blue-700 dark:text-blue-300" : "text-slate-400"
          }`}
          aria-hidden="true"
        >
          {indicator}
        </span>
      </button>
    </th>
  );
}
