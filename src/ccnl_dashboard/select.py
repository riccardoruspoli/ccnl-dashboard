from __future__ import annotations

from datetime import date

from ccnl_dashboard.constants import DEFAULT_EXCLUDED_AGREEMENT_TYPES
from ccnl_dashboard.metrics import expiration_status, renewal_delay_days
from ccnl_dashboard.models import AgreementRecord, CurrentCcnl


def build_current_ccnl(
    agreements: list[AgreementRecord],
    reference_date: date,
    excluded_agreement_types: frozenset[str] = DEFAULT_EXCLUDED_AGREEMENT_TYPES,
) -> list[CurrentCcnl]:
    """Build deterministic public CCNL rows from eligible agreements.

    Args:
        agreements (list[AgreementRecord]): Normalized source agreement records.
        reference_date (date): Date used to compute expiration status and delay.
        excluded_agreement_types (frozenset[str]): Agreement types to exclude
            from the public dashboard.

    Returns:
        list[CurrentCcnl]: Sorted public rows with stable row identifiers.
    """
    current_rows: list[CurrentCcnl] = []

    for agreement in agreements:
        if agreement.tipologia_accordo in excluded_agreement_types:
            continue

        row_id = _row_id(agreement)
        if row_id is None:
            continue

        display_code = (
            agreement.codice_ccnl or agreement.identificativo_accordo or row_id
        )
        status = expiration_status(agreement.data_scadenza_contrattuale, reference_date)
        current_rows.append(
            CurrentCcnl(
                row_id=row_id,
                codice_ccnl=display_code,
                title=agreement.titolo_ccnl or agreement.titolo or display_code,
                agreement_type=agreement.tipologia_accordo,
                contractual_expiry_date=agreement.data_scadenza_contrattuale,
                economic_expiry_date=agreement.data_scadenza_economica,
                effective_date=agreement.data_decorrenza,
                signing_date=agreement.data_stipula,
                sector_descriptions=agreement.settori_descrizione,
                subsector_descriptions=agreement.sottosettori_descrizione,
                expiration_status=status,
                renewal_delay_days=renewal_delay_days(
                    agreement.data_scadenza_contrattuale, reference_date
                ),
            )
        )

    return sorted(current_rows, key=lambda row: (row.codice_ccnl, row.row_id))


def _row_id(agreement: AgreementRecord) -> str | None:
    if agreement.id_accordo is not None:
        return f"idAccordo:{agreement.id_accordo}"
    if agreement.identificativo_accordo:
        return f"identificativoAccordo:{agreement.identificativo_accordo}"
    return None
