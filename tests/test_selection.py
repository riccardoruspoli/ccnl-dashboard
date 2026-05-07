from datetime import date

from ccnl_dashboard.normalize import normalize_agreements
from ccnl_dashboard.select import build_current_ccnl


def test_current_selection_excludes_solidarity_and_keeps_duplicate_codes() -> None:
    raw_records = [
        {
            "codiceCcnl": "A001",
            "idAccordo": 1,
            "titoloCcnl": "Older agreement",
            "tipologiaAccordo": "Testo definitivo",
            "dataDecorrenza": "2020-01-01",
            "dataScadenzaContrattuale": "2022-12-31",
            "dataStipula": "2020-01-10",
        },
        {
            "codiceCcnl": "A001",
            "idAccordo": 2,
            "titoloCcnl": "Renewal agreement",
            "tipologiaAccordo": "Accordo di rinnovo",
            "dataDecorrenza": "2023-01-01",
            "dataScadenzaContrattuale": "2026-12-31",
            "dataStipula": "2023-02-01",
        },
        {
            "codiceCcnl": "A001",
            "idAccordo": 3,
            "titoloCcnl": "Solidarity",
            "tipologiaAccordo": "Contratto di solidarietà",
            "dataDecorrenza": "2025-01-01",
            "dataScadenzaContrattuale": "2025-12-31",
            "dataStipula": "2025-01-02",
        },
    ]
    agreements = normalize_agreements(raw_records)
    current_rows = build_current_ccnl(agreements, date(2026, 4, 29))

    assert [row.row_id for row in current_rows] == ["idAccordo:1", "idAccordo:2"]
    assert [row.expiration_status for row in current_rows] == ["expired", "active"]


def test_missing_code_falls_back_to_identificativo_accordo() -> None:
    agreements = normalize_agreements(
        [
            {
                "codiceCcnl": "",
                "idAccordo": 9,
                "identificativoAccordo": "CCNL-9",
                "tipologiaAccordo": "Testo definitivo",
                "dataScadenzaContrattuale": "2026-12-31",
            }
        ]
    )
    current_rows = build_current_ccnl(agreements, date(2026, 4, 29))

    assert len(current_rows) == 1
    assert current_rows[0].codice_ccnl == "CCNL-9"
    assert current_rows[0].row_id == "idAccordo:9"
