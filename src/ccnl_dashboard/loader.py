from __future__ import annotations

import json
from email.message import Message
from pathlib import Path
from urllib.parse import unquote, urlparse

import httpx

from ccnl_dashboard.json_types import JsonObject, JsonValue

_DEFAULT_DOWNLOAD_FILENAME = "archivio_corrente.json"


def load_json_file(path: Path) -> JsonObject:
    """Load and validate the source JSON payload shape.

    Args:
        path (Path): Local JSON file path.

    Returns:
        JsonObject: Loaded JSON object with a validated data array.

    Raises:
        ValueError: If the JSON root is not an object or its data field is invalid.
        json.JSONDecodeError: If the file content is not valid JSON.
    """
    with path.open("r", encoding="utf-8") as file:
        payload = json.load(file)
    if not isinstance(payload, dict):
        raise ValueError("Source JSON root must be an object.")
    data = payload.get("data")
    if not isinstance(data, list):
        raise ValueError("Source JSON root must contain a data array.")
    return {
        str(key): _json_value(value)
        for key, value in payload.items()
        if isinstance(key, str)
    }


def source_data(payload: JsonObject) -> list[JsonObject]:
    """Return the validated source agreement records.

    Args:
        payload (JsonObject): Source payload previously loaded from JSON.

    Returns:
        list[JsonObject]: Agreement records from the payload data field.

    Raises:
        ValueError: If the data field is missing or is not an array.
    """
    data = payload.get("data")
    if not isinstance(data, list):
        raise ValueError("Source JSON root must contain a data array.")
    return [
        {
            str(key): _json_value(value)
            for key, value in item.items()
            if isinstance(key, str)
        }
        for item in data
        if isinstance(item, dict)
    ]


def download_json_file(source_url: str, output_dir: Path) -> Path:
    """Download the source JSON file and return its local path.

    Args:
        source_url (str): Official source endpoint URL.
        output_dir (Path): Local directory where the downloaded file is written.

    Returns:
        Path: Local path to the downloaded JSON file.

    Raises:
        httpx.HTTPStatusError: If the source endpoint returns an error response.
        ValueError: If the downloaded JSON payload has an invalid shape.
        json.JSONDecodeError: If the downloaded content is not valid JSON.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    with httpx.Client(follow_redirects=True, timeout=60) as client:
        response = client.get(source_url)
        response.raise_for_status()

    filename = _download_filename(response, source_url)
    output_path = output_dir / filename
    output_path.write_bytes(response.content)
    load_json_file(output_path)
    return output_path


def _download_filename(response: httpx.Response, source_url: str) -> str:
    disposition = response.headers.get("content-disposition")
    if disposition:
        message = Message()
        message["content-disposition"] = disposition
        filename = message.get_filename()
        if filename:
            return Path(filename).name

    url_path = urlparse(str(response.url or source_url)).path
    url_name = Path(unquote(url_path)).name
    if url_name and "." in url_name:
        return url_name
    return _DEFAULT_DOWNLOAD_FILENAME


def _json_value(value: JsonValue) -> JsonValue:
    return value
