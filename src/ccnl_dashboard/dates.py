from __future__ import annotations

from datetime import UTC, date, datetime

from ccnl_dashboard.json_types import JsonValue

type _DateValue = JsonValue | date


def today_utc() -> date:
    """Return the current UTC calendar date.

    Returns:
        date: Current date in UTC.
    """
    return datetime.now(tz=UTC).date()


def parse_date_value(value: _DateValue) -> date | None:
    """Parse an optional ISO calendar date value.

    Args:
        value (_DateValue): Date value from JSON or an existing date instance.

    Returns:
        date | None: Parsed date, or None when the input is missing or blank.

    Raises:
        TypeError: If the value is not None, a date, or an ISO date string.
        ValueError: If the value is a non-empty string that is not ISO date text.
    """
    if value is None:
        return None
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, str):
        clean = value.strip()
        if not clean:
            return None
        return date.fromisoformat(clean)
    raise TypeError(f"Expected ISO date string, got {type(value).__name__}")
