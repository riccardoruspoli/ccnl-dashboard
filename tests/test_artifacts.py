import json
from datetime import date

from ccnl_dashboard.artifacts import (
    write_dashboard_data,
    write_static_metadata,
)
from ccnl_dashboard.models import CurrentCcnl, DashboardMetrics


def test_write_dashboard_data_writes_json_artifacts(tmp_path) -> None:
    row = CurrentCcnl(
        row_id="idAccordo:1",
        codice_ccnl="A001",
        title="Metalworkers",
        expiration_status="expired",
        renewal_delay_days=119,
    )
    metrics = DashboardMetrics(
        reference_date=date(2026, 4, 29),
        total_current_ccnl=1,
        known_expiration_count=1,
        expired_count=1,
        active_count=0,
        unknown_expiration_count=0,
        expired_percentage=100.0,
        average_renewal_delay_days=119.0,
        median_renewal_delay_days=119.0,
        maximum_renewal_delay_days=119,
        expiring_soon_count=0,
        expiring_soon_window_days=180,
    )

    write_dashboard_data(
        tmp_path,
        current_rows=[row],
        metrics=metrics,
    )

    assert json.loads((tmp_path / "data" / "ccnl.current.json").read_text()) == [
        {
            "row_id": "idAccordo:1",
            "codice_ccnl": "A001",
            "title": "Metalworkers",
            "agreement_type": None,
            "contractual_expiry_date": None,
            "economic_expiry_date": None,
            "effective_date": None,
            "signing_date": None,
            "sector_descriptions": [],
            "subsector_descriptions": [],
            "expiration_status": "expired",
            "renewal_delay_days": 119,
        }
    ]
    assert (
        json.loads((tmp_path / "data" / "metrics.json").read_text())["reference_date"]
        == "2026-04-29"
    )


def test_write_static_metadata_writes_sitemap_and_robots(tmp_path) -> None:
    write_static_metadata(tmp_path, "https://example.test/", date(2026, 5, 5))

    sitemap = (tmp_path / "sitemap.xml").read_text(encoding="utf-8")
    assert "<loc>https://example.test/</loc>" in sitemap
    assert "<lastmod>2026-05-05</lastmod>" in sitemap
    assert "<changefreq>weekly</changefreq>" in sitemap
    assert "<priority>1.0</priority>" in sitemap
    assert "<loc>https://example.test/dashboard/</loc>" not in sitemap
    assert "<loc>https://example.test/dashboard2/</loc>" not in sitemap

    robots = (tmp_path / "robots.txt").read_text(encoding="utf-8")
    assert (
        robots
        == "User-agent: *\nAllow: /\n\nSitemap: https://example.test/sitemap.xml\n"
    )
