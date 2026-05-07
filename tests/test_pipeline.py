import json
from datetime import date

from ccnl_dashboard.pipeline import build_dashboard_data


def test_pipeline_builds_metrics_from_fixture(monkeypatch, tmp_path) -> None:
    source = tmp_path / "source.json"
    source.write_text(
        json.dumps(
            {
                "data": [
                    {
                        "codiceCcnl": "A001",
                        "idAccordo": 1,
                        "titoloCcnl": "Expired",
                        "tipologiaAccordo": "Testo definitivo",
                        "dataScadenzaContrattuale": "2024-12-31",
                        "dataStipula": "2021-01-01",
                    },
                    {
                        "codiceCcnl": "A002",
                        "idAccordo": 2,
                        "titoloCcnl": "Active",
                        "tipologiaAccordo": "Testo definitivo",
                        "dataScadenzaContrattuale": "2027-12-31",
                        "dataStipula": "2024-01-01",
                    },
                    {
                        "codiceCcnl": "A003",
                        "idAccordo": 3,
                        "titoloCcnl": "Unknown",
                        "tipologiaAccordo": "Testo definitivo",
                        "dataStipula": "2024-01-01",
                    },
                ]
            }
        ),
        encoding="utf-8",
    )

    monkeypatch.setattr("ccnl_dashboard.pipeline.today_utc", lambda: date(2026, 4, 29))

    current_rows, metrics = build_dashboard_data(input_path=source)

    assert len(current_rows) == 3
    assert metrics.total_current_ccnl == 3
    assert metrics.expired_count == 1
    assert metrics.active_count == 1
    assert metrics.unknown_expiration_count == 1


def test_pipeline_skips_non_object_source_records(monkeypatch, tmp_path) -> None:
    source = tmp_path / "source.json"
    source.write_text(
        json.dumps(
            {
                "data": [
                    "not an object",
                    {
                        "codiceCcnl": "A001",
                        "idAccordo": 1,
                        "titoloCcnl": "Active",
                        "tipologiaAccordo": "Testo definitivo",
                        "dataScadenzaContrattuale": "2027-12-31",
                    },
                    None,
                ]
            }
        ),
        encoding="utf-8",
    )

    monkeypatch.setattr("ccnl_dashboard.pipeline.today_utc", lambda: date(2026, 4, 29))

    current_rows, metrics = build_dashboard_data(input_path=source)

    assert [row.row_id for row in current_rows] == ["idAccordo:1"]
    assert metrics.total_current_ccnl == 1


def test_pipeline_uses_current_date_when_reference_date_is_omitted(
    monkeypatch, tmp_path
) -> None:
    source = tmp_path / "archivio_corrente20260429.json"
    source.write_text(
        json.dumps(
            {
                "data": [
                    {
                        "codiceCcnl": "A001",
                        "idAccordo": 1,
                        "titoloCcnl": "Expired",
                        "tipologiaAccordo": "Testo definitivo",
                        "dataScadenzaContrattuale": "2024-12-31",
                    }
                ]
            }
        ),
        encoding="utf-8",
    )
    monkeypatch.setattr("ccnl_dashboard.pipeline.today_utc", lambda: date(2026, 5, 1))

    current_rows, metrics = build_dashboard_data(input_path=source)

    assert metrics.reference_date == date(2026, 5, 1)
    assert current_rows[0].expiration_status == "expired"
