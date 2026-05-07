from __future__ import annotations

from datetime import date, timedelta
from statistics import mean, median

from ccnl_dashboard.constants import DEFAULT_EXPIRING_SOON_WINDOW_DAYS
from ccnl_dashboard.models import CurrentCcnl, DashboardMetrics, ExpirationStatus


def expiration_status(
    expiry_date: date | None, reference_date: date
) -> ExpirationStatus:
    """Classify a contractual expiry date against a reference date.

    Args:
        expiry_date (date | None): Contractual expiry date, when known.
        reference_date (date): Date used to evaluate expiry.

    Returns:
        ExpirationStatus: expired, active, or unknown.
    """
    if expiry_date is None:
        return "unknown"
    if expiry_date < reference_date:
        return "expired"
    return "active"


def renewal_delay_days(expiry_date: date | None, reference_date: date) -> int:
    """Return elapsed days since expiry, or zero for non-expired rows.

    Args:
        expiry_date (date | None): Contractual expiry date, when known.
        reference_date (date): Date used to evaluate elapsed delay.

    Returns:
        int: Calendar-day delay for expired rows, otherwise zero.
    """
    if expiry_date is None or expiry_date >= reference_date:
        return 0
    return (reference_date - expiry_date).days


def build_metrics(
    current_rows: list[CurrentCcnl],
    reference_date: date,
    expiring_soon_window_days: int = DEFAULT_EXPIRING_SOON_WINDOW_DAYS,
) -> DashboardMetrics:
    """Compute aggregate dashboard metrics for public rows.

    Args:
        current_rows (list[CurrentCcnl]): Public dashboard rows.
        reference_date (date): Date used to evaluate expiration status metrics.
        expiring_soon_window_days (int): Forward-looking window for active rows
            that are close to contractual expiry.

    Returns:
        DashboardMetrics: Aggregate counts, percentages, delay values, and
        upcoming-expiration totals.
    """
    expired_rows = [row for row in current_rows if row.expiration_status == "expired"]
    active_rows = [row for row in current_rows if row.expiration_status == "active"]
    unknown_rows = [row for row in current_rows if row.expiration_status == "unknown"]
    known_count = len(expired_rows) + len(active_rows)
    delays = [row.renewal_delay_days for row in expired_rows]
    soon_until = reference_date + timedelta(days=expiring_soon_window_days)
    expiring_soon_count = sum(
        1
        for row in active_rows
        if row.contractual_expiry_date is not None
        and reference_date <= row.contractual_expiry_date <= soon_until
    )

    return DashboardMetrics(
        reference_date=reference_date,
        total_current_ccnl=len(current_rows),
        known_expiration_count=known_count,
        expired_count=len(expired_rows),
        active_count=len(active_rows),
        unknown_expiration_count=len(unknown_rows),
        expired_percentage=round((len(expired_rows) / known_count) * 100, 2)
        if known_count
        else 0.0,
        average_renewal_delay_days=round(mean(delays), 1) if delays else 0.0,
        median_renewal_delay_days=float(median(delays)) if delays else 0.0,
        maximum_renewal_delay_days=max(delays) if delays else 0,
        expiring_soon_count=expiring_soon_count,
        expiring_soon_window_days=expiring_soon_window_days,
    )
