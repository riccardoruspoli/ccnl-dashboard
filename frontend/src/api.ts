import {
  isExpirationStatus,
  type CurrentCcnl,
  type DashboardData,
  type DashboardMetrics,
} from "./types";

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function loadDashboardData(): Promise<DashboardData> {
  const dataBasePath = new URL("data/", globalThis.location.href).pathname;
  const [rows, metrics] = await Promise.all([
    fetchJson(`${dataBasePath}ccnl.current.json`),
    fetchJson(`${dataBasePath}metrics.json`),
  ]);

  return {
    metrics: parseDashboardMetrics(metrics),
    rows: parseCurrentRows(rows),
  };
}

function parseCurrentRows(value: unknown): CurrentCcnl[] {
  if (!Array.isArray(value)) {
    throw new TypeError("Invalid dashboard rows payload.");
  }
  if (!value.every(isCurrentCcnl)) {
    throw new Error("Invalid dashboard row shape.");
  }
  return value;
}

function parseDashboardMetrics(value: unknown): DashboardMetrics {
  if (!isRecord(value)) {
    throw new Error("Invalid dashboard metrics payload.");
  }

  return {
    active_count: readNumber(value, "active_count"),
    average_renewal_delay_days: readNumber(value, "average_renewal_delay_days"),
    expired_count: readNumber(value, "expired_count"),
    expired_percentage: readNumber(value, "expired_percentage"),
    expiring_soon_count: readNumber(value, "expiring_soon_count"),
    expiring_soon_window_days: readNumber(value, "expiring_soon_window_days"),
    known_expiration_count: readNumber(value, "known_expiration_count"),
    maximum_renewal_delay_days: readNumber(value, "maximum_renewal_delay_days"),
    median_renewal_delay_days: readNumber(value, "median_renewal_delay_days"),
    reference_date: readString(value, "reference_date"),
    total_current_ccnl: readNumber(value, "total_current_ccnl"),
    unknown_expiration_count: readNumber(value, "unknown_expiration_count"),
  };
}

function isCurrentCcnl(value: unknown): value is CurrentCcnl {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.row_id === "string" &&
    typeof value.codice_ccnl === "string" &&
    typeof value.title === "string" &&
    isStringOrNull(value.agreement_type) &&
    isDateStringOrNull(value.contractual_expiry_date) &&
    isDateStringOrNull(value.economic_expiry_date) &&
    isDateStringOrNull(value.effective_date) &&
    isDateStringOrNull(value.signing_date) &&
    isStringArray(value.sector_descriptions) &&
    isStringArray(value.subsector_descriptions) &&
    typeof value.expiration_status === "string" &&
    isExpirationStatus(value.expiration_status) &&
    isNumber(value.renewal_delay_days)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringOrNull(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isDateStringOrNull(value: unknown): value is string | null {
  return isStringOrNull(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string") {
    throw new TypeError(`Invalid dashboard metrics field: ${key}.`);
  }
  return value;
}

function readNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (!isNumber(value)) {
    throw new Error(`Invalid dashboard metrics field: ${key}.`);
  }
  return value;
}
