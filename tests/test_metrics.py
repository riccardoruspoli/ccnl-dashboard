from datetime import date

from ccnl_dashboard.metrics import expiration_status, renewal_delay_days


def test_expiration_status_uses_reference_date() -> None:
    reference = date(2026, 4, 29)

    assert expiration_status(date(2026, 4, 28), reference) == "expired"
    assert expiration_status(date(2026, 4, 29), reference) == "active"
    assert expiration_status(None, reference) == "unknown"


def test_renewal_delay_days_only_counts_expired_contracts() -> None:
    reference = date(2026, 4, 29)

    assert renewal_delay_days(date(2026, 4, 19), reference) == 10
    assert renewal_delay_days(date(2026, 4, 29), reference) == 0
    assert renewal_delay_days(None, reference) == 0
