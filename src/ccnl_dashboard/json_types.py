from __future__ import annotations

type _JsonPrimitive = str | int | float | bool | None
type JsonValue = _JsonPrimitive | list[JsonValue] | dict[str, JsonValue]
type JsonObject = dict[str, JsonValue]
