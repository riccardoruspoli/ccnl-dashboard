import type { SortDirection, SortKey } from "./components/CcnlTable";
import type { DashboardData } from "./types";

const defaultSortDirections: Record<SortKey, SortDirection> = {
  agreementType: "asc",
  code: "asc",
  delay: "desc",
  effectiveDate: "asc",
  economicExpiry: "asc",
  expiry: "asc",
  sector: "asc",
  signingDate: "asc",
  status: "asc",
  title: "asc",
};

export function nextSortDirection(
  currentKey: SortKey,
  currentDirection: SortDirection,
  nextKey: SortKey,
): SortDirection {
  if (currentKey !== nextKey) {
    return defaultSortDirections[nextKey];
  }
  return currentDirection === "asc" ? "desc" : "asc";
}

export function compareRows(
  left: DashboardData["rows"][number],
  right: DashboardData["rows"][number],
  sortKey: SortKey,
): number {
  if (sortKey === "agreementType") {
    return (left.agreement_type ?? "").localeCompare(
      right.agreement_type ?? "",
    );
  }
  if (sortKey === "code") {
    return left.codice_ccnl.localeCompare(right.codice_ccnl);
  }
  if (sortKey === "delay") {
    return left.renewal_delay_days - right.renewal_delay_days;
  }
  if (sortKey === "effectiveDate") {
    return (left.effective_date || "9999-12-31").localeCompare(
      right.effective_date || "9999-12-31",
    );
  }
  if (sortKey === "economicExpiry") {
    return (left.economic_expiry_date || "9999-12-31").localeCompare(
      right.economic_expiry_date || "9999-12-31",
    );
  }
  if (sortKey === "expiry") {
    return (left.contractual_expiry_date || "9999-12-31").localeCompare(
      right.contractual_expiry_date || "9999-12-31",
    );
  }
  if (sortKey === "sector") {
    return left.sector_descriptions
      .join(", ")
      .localeCompare(right.sector_descriptions.join(", "));
  }
  if (sortKey === "status") {
    return left.expiration_status.localeCompare(right.expiration_status);
  }
  if (sortKey === "signingDate") {
    return (left.signing_date || "9999-12-31").localeCompare(
      right.signing_date || "9999-12-31",
    );
  }
  return left.title.localeCompare(right.title);
}
