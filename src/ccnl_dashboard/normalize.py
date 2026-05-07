from __future__ import annotations

from collections.abc import Iterable
from datetime import date

from ccnl_dashboard.dates import parse_date_value
from ccnl_dashboard.json_types import JsonObject, JsonValue
from ccnl_dashboard.models import AgreementRecord


def normalize_agreements(
    raw_records: Iterable[JsonObject],
) -> list[AgreementRecord]:
    """Normalize source agreement records into internal models.

    Args:
        raw_records (Iterable[JsonObject]): Raw agreement objects from the source
            payload data array.

    Returns:
        list[AgreementRecord]: Normalized records containing only fields needed
        by the dashboard pipeline.
    """
    agreements: list[AgreementRecord] = []

    for raw in raw_records:
        agreement = AgreementRecord(
            codice_ccnl=_optional_str(raw.get("codiceCcnl")),
            data_decorrenza=_optional_date(raw.get("dataDecorrenza")),
            data_scadenza_contrattuale=_optional_date(
                raw.get("dataScadenzaContrattuale")
            ),
            data_scadenza_economica=_optional_date(raw.get("dataScadenzaEconomica")),
            data_stipula=_optional_date(raw.get("dataStipula")),
            id_accordo=_optional_int(raw.get("idAccordo")),
            identificativo_accordo=_optional_str(raw.get("identificativoAccordo")),
            settori_descrizione=_string_list(raw.get("settoriDescrizione")),
            sottosettori_descrizione=_string_list(raw.get("sottosettoriDescrizione")),
            tipologia_accordo=_optional_str(raw.get("tipologiaAccordo")),
            titolo=_optional_str(raw.get("titolo")),
            titolo_ccnl=_optional_str(raw.get("titoloCcnl")),
        )
        agreements.append(agreement)

    return agreements


def _optional_str(value: JsonValue) -> str | None:
    if value is None:
        return None
    if isinstance(value, bool | list | dict):
        return None
    clean = str(value).strip()
    return clean or None


def _optional_date(value: JsonValue) -> date | None:
    try:
        return parse_date_value(value)
    except (TypeError, ValueError):
        return None


def _optional_int(value: JsonValue) -> int | None:
    if value is None or value == "":
        return None
    if isinstance(value, bool | list | dict):
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _string_list(value: JsonValue) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [clean for item in value if (clean := _optional_str(item))]
    clean = _optional_str(value)
    return [clean] if clean else []
