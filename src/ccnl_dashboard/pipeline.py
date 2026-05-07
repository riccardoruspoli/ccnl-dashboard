from __future__ import annotations

from pathlib import Path

from ccnl_dashboard.dates import today_utc
from ccnl_dashboard.loader import load_json_file, source_data
from ccnl_dashboard.metrics import build_metrics
from ccnl_dashboard.models import (
    CurrentCcnl,
    DashboardMetrics,
)
from ccnl_dashboard.normalize import normalize_agreements
from ccnl_dashboard.select import build_current_ccnl


def build_dashboard_data(
    input_path: Path,
) -> tuple[
    list[CurrentCcnl],
    DashboardMetrics,
]:
    """Build public dashboard rows and metrics from a source JSON file.

    Args:
        input_path (Path): Local source JSON file path.

    Returns:
        tuple[list[CurrentCcnl], DashboardMetrics]: Public rows and aggregate
        metrics ready to be written as static artifacts.
    """
    payload = load_json_file(input_path)
    reference_date = today_utc()
    raw_records = source_data(payload)

    agreements = normalize_agreements(raw_records)
    current_rows = build_current_ccnl(
        agreements=agreements,
        reference_date=reference_date,
    )
    metrics = build_metrics(current_rows=current_rows, reference_date=reference_date)
    return current_rows, metrics
