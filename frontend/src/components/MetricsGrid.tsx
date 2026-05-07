import { formatNumber } from "../format";
import type { DashboardMetrics, Language } from "../types";

interface MetricsGridProps {
  language: Language;
  metrics: DashboardMetrics;
  t: (key: string) => string;
}

export function MetricsGrid({
  language,
  metrics,
  t,
}: Readonly<MetricsGridProps>) {
  const items = [
    {
      label: t("currentCcnl"),
      tone: "bg-blue-600",
      value: formatNumber(metrics.total_current_ccnl, language),
    },
    {
      label: t("active"),
      tone: "bg-emerald-600",
      value: formatNumber(metrics.active_count, language),
    },
    {
      label: t("expired"),
      tone: "bg-red-600",
      value: formatNumber(metrics.expired_count, language),
    },
    {
      label: t("unknownExpiry"),
      tone: "bg-slate-500",
      value: formatNumber(metrics.unknown_expiration_count, language),
    },
    {
      label: t("expiredPercent"),
      tone: "bg-amber-500",
      value: `${formatNumber(metrics.expired_percentage, language)}%`,
    },
    {
      label: t("averageDelay"),
      tone: "bg-indigo-600",
      value: `${formatNumber(metrics.average_renewal_delay_days, language)} ${t("daysUnit")}`,
    },
  ];

  return (
    <section
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6"
      aria-label="Dashboard metrics"
    >
      {items.map((item) => (
        <article
          key={item.label}
          className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className={`h-1 ${item.tone}`} />
          <div className="p-4">
            <span className="block text-xs font-medium break-words text-slate-500 uppercase dark:text-slate-400">
              {item.label}
            </span>
            <strong className="mt-2 block text-2xl font-semibold break-words text-slate-950 sm:text-3xl dark:text-white">
              {item.value}
            </strong>
          </div>
        </article>
      ))}
    </section>
  );
}
