export type Language = "en" | "it";

export type Theme = "light" | "dark";

export type ExpirationStatus = "expired" | "active" | "unknown";

export const expirationStatuses: ExpirationStatus[] = [
  "expired",
  "active",
  "unknown",
];

export function isExpirationStatus(value: string): value is ExpirationStatus {
  return (expirationStatuses as readonly string[]).includes(value);
}

export interface CurrentCcnl {
  row_id: string;
  codice_ccnl: string;
  title: string;
  agreement_type: string | null;
  contractual_expiry_date: string | null;
  economic_expiry_date: string | null;
  effective_date: string | null;
  signing_date: string | null;
  sector_descriptions: string[];
  subsector_descriptions: string[];
  expiration_status: ExpirationStatus;
  renewal_delay_days: number;
}

export interface DashboardMetrics {
  reference_date: string;
  total_current_ccnl: number;
  known_expiration_count: number;
  expired_count: number;
  active_count: number;
  unknown_expiration_count: number;
  expired_percentage: number;
  average_renewal_delay_days: number;
  median_renewal_delay_days: number;
  maximum_renewal_delay_days: number;
  expiring_soon_count: number;
  expiring_soon_window_days: number;
}

export interface DashboardData {
  rows: CurrentCcnl[];
  metrics: DashboardMetrics;
}
