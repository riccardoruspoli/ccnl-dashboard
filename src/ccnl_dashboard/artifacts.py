from __future__ import annotations

import json
from collections.abc import Mapping
from datetime import date
from pathlib import Path

from pydantic import BaseModel

from ccnl_dashboard.json_types import JsonValue
from ccnl_dashboard.models import CurrentCcnl, DashboardMetrics

type _JsonArtifact = BaseModel | list[BaseModel] | JsonValue


def _write_json_artifact(path: Path, value: _JsonArtifact) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(_to_jsonable(value), file, ensure_ascii=False, indent=2)
        file.write("\n")


def write_dashboard_data(
    output_dir: Path,
    current_rows: list[CurrentCcnl],
    metrics: DashboardMetrics,
) -> None:
    """Write dashboard JSON artifacts for public site consumption.

    Args:
        output_dir (Path): Static site output directory.
        current_rows (list[CurrentCcnl]): Public CCNL rows to publish.
        metrics (DashboardMetrics): Aggregate dashboard metrics to publish.

    Returns:
        None.
    """
    data_dir = output_dir / "data"
    _write_json_artifact(data_dir / "ccnl.current.json", current_rows)
    _write_json_artifact(data_dir / "metrics.json", metrics)


def write_static_metadata(
    output_dir: Path,
    site_url: str,
    lastmod: date,
) -> None:
    """Write static sitemap and robots metadata artifacts.

    Args:
        output_dir (Path): Static site output directory.
        site_url (str): Canonical public site URL used in metadata files.
        lastmod (date): Sitemap last-modified date.

    Returns:
        None.
    """
    clean_site_url = site_url.rstrip("/")
    _write_text_artifact(
        output_dir / "sitemap.xml",
        "\n".join(
            [
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
                "  <url>",
                f"    <loc>{clean_site_url}/</loc>",
                f"    <lastmod>{lastmod.isoformat()}</lastmod>",
                "    <changefreq>weekly</changefreq>",
                "    <priority>1.0</priority>",
                "  </url>",
                "</urlset>",
                "",
            ]
        ),
    )
    _write_text_artifact(
        output_dir / "robots.txt",
        "\n".join(
            [
                "User-agent: *",
                "Allow: /",
                "",
                f"Sitemap: {clean_site_url}/sitemap.xml",
                "",
            ]
        ),
    )


def _write_text_artifact(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value, encoding="utf-8")


def _to_jsonable(value: _JsonArtifact) -> JsonValue:
    if isinstance(value, BaseModel):
        return value.model_dump(mode="json")
    if isinstance(value, list):
        return [_to_jsonable(item) for item in value]
    if isinstance(value, Mapping):
        return {str(key): _to_jsonable(item) for key, item in value.items()}
    return value
