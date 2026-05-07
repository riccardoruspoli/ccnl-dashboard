from __future__ import annotations

from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

ExpirationStatus = Literal["expired", "active", "unknown"]


class _DashboardBaseModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class AgreementRecord(_DashboardBaseModel):
    """Normalized source agreement fields used by the dashboard.

    Attributes:
        codice_ccnl (str | None): Official CCNL code, when present.
        data_decorrenza (date | None): Agreement effective date.
        data_scadenza_contrattuale (date | None): Contractual expiry date.
        data_scadenza_economica (date | None): Economic expiry date.
        data_stipula (date | None): Signing date.
        id_accordo (int | None): Stable numeric source agreement identifier.
        identificativo_accordo (str | None): Stable textual source identifier.
        settori_descrizione (list[str]): Source sector descriptions.
        sottosettori_descrizione (list[str]): Source subsector descriptions.
        tipologia_accordo (str | None): Source agreement type.
        titolo (str | None): Source agreement title.
        titolo_ccnl (str | None): Source CCNL title.
    """

    codice_ccnl: str | None = None
    data_decorrenza: date | None = None
    data_scadenza_contrattuale: date | None = None
    data_scadenza_economica: date | None = None
    data_stipula: date | None = None
    id_accordo: int | None = None
    identificativo_accordo: str | None = None
    settori_descrizione: list[str] = Field(default_factory=list)
    sottosettori_descrizione: list[str] = Field(default_factory=list)
    tipologia_accordo: str | None = None
    titolo: str | None = None
    titolo_ccnl: str | None = None


class CurrentCcnl(_DashboardBaseModel):
    """Public dashboard row for one eligible source agreement.

    Attributes:
        row_id (str): Deterministic public row identifier.
        codice_ccnl (str): Display code for the row.
        title (str): Display title for the row.
        agreement_type (str | None): Agreement type label.
        contractual_expiry_date (date | None): Contractual expiry date.
        economic_expiry_date (date | None): Economic expiry date.
        effective_date (date | None): Agreement effective date.
        signing_date (date | None): Agreement signing date.
        sector_descriptions (list[str]): Sector labels shown in the dashboard.
        subsector_descriptions (list[str]): Subsector labels used for search.
        expiration_status (ExpirationStatus): Expiration state at reference date.
        renewal_delay_days (int): Days elapsed since contractual expiry.
    """

    row_id: str
    codice_ccnl: str
    title: str
    agreement_type: str | None = None
    contractual_expiry_date: date | None = None
    economic_expiry_date: date | None = None
    effective_date: date | None = None
    signing_date: date | None = None
    sector_descriptions: list[str] = Field(default_factory=list)
    subsector_descriptions: list[str] = Field(default_factory=list)
    expiration_status: ExpirationStatus
    renewal_delay_days: int


class DashboardMetrics(_DashboardBaseModel):
    """Public aggregate metrics for the generated dashboard data.

    Attributes:
        reference_date (date): Date used to compute all time-sensitive metrics.
        total_current_ccnl (int): Number of public rows.
        known_expiration_count (int): Rows with known contractual expiry status.
        expired_count (int): Rows expired at the reference date.
        active_count (int): Rows active at the reference date.
        unknown_expiration_count (int): Rows without known contractual expiry.
        expired_percentage (float): Expired share among rows with known expiry.
        average_renewal_delay_days (float): Mean renewal delay for expired rows.
        median_renewal_delay_days (float): Median renewal delay for expired rows.
        maximum_renewal_delay_days (int): Maximum renewal delay for expired rows.
        expiring_soon_count (int): Active rows expiring in the configured window.
        expiring_soon_window_days (int): Upcoming-expiration window size in days.
    """

    reference_date: date
    total_current_ccnl: int
    known_expiration_count: int
    expired_count: int
    active_count: int
    unknown_expiration_count: int
    expired_percentage: float
    average_renewal_delay_days: float
    median_renewal_delay_days: float
    maximum_renewal_delay_days: int
    expiring_soon_count: int
    expiring_soon_window_days: int
