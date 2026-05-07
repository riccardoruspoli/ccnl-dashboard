from __future__ import annotations

import argparse
import functools
import http.server
import shutil
import subprocess
from pathlib import Path

from ccnl_dashboard.artifacts import (
    write_dashboard_data,
    write_static_metadata,
)
from ccnl_dashboard.constants import (
    DEFAULT_BUILD_DIR,
    DEFAULT_FRONTEND_DIR,
    DEFAULT_RAW_DIR,
    DEFAULT_SERVE_HOST,
    DEFAULT_SERVE_PORT,
    DEFAULT_SITE_DIR,
    DEFAULT_SITE_URL,
    DEFAULT_SOURCE_URL,
)
from ccnl_dashboard.loader import download_json_file
from ccnl_dashboard.pipeline import build_dashboard_data


def main(argv: list[str] | None = None) -> int:
    """Run the CCNL dashboard command line interface.

    Args:
        argv (list[str] | None): Optional command arguments. When omitted,
            arguments are read from the process command line.

    Returns:
        int: Process exit code.
    """
    parser = argparse.ArgumentParser(prog="ccnl-dashboard")
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("build", help="Build static dashboard artifacts.")

    serve_parser = subparsers.add_parser(
        "serve", help="Serve a generated static dashboard."
    )
    serve_parser.add_argument("--directory", default=Path(DEFAULT_SITE_DIR), type=Path)
    serve_parser.add_argument("--host", default=DEFAULT_SERVE_HOST)
    serve_parser.add_argument("--port", default=DEFAULT_SERVE_PORT, type=int)

    args = parser.parse_args(argv)
    if args.command == "build":
        return _build()
    if args.command == "serve":
        return _serve(args.directory, args.host, args.port)
    return 1


def _build() -> int:
    input_path = download_json_file(DEFAULT_SOURCE_URL, Path(DEFAULT_RAW_DIR))
    current_rows, metrics = build_dashboard_data(input_path=input_path)
    output_dir = Path(DEFAULT_SITE_DIR)
    _build_frontend(Path(DEFAULT_FRONTEND_DIR))
    write_dashboard_data(output_dir, current_rows, metrics)
    write_static_metadata(
        output_dir,
        DEFAULT_SITE_URL,
        metrics.reference_date,
    )
    _remove_build_workspace()
    print(f"Downloaded source JSON to temporary path {input_path}")
    print(f"Generated Vite dashboard at {DEFAULT_SITE_DIR}")
    print(f"Reference date: {metrics.reference_date.isoformat()}")
    print(
        "Metrics: "
        f"{metrics.total_current_ccnl} current CCNL, "
        f"{metrics.expired_count} expired, "
        f"{metrics.active_count} active, "
        f"{metrics.unknown_expiration_count} unknown"
    )
    return 0


def _build_frontend(frontend_dir: Path) -> None:
    npm_path = shutil.which("npm")
    if npm_path is None:
        raise RuntimeError(
            "npm was not found. Install Node.js, run "
            "`npm install --prefix frontend`, then rerun `uv run ccnl-dashboard build`."
        )
    subprocess.run([npm_path, "run", "build"], cwd=frontend_dir, check=True)


def _remove_build_workspace() -> None:
    shutil.rmtree(DEFAULT_BUILD_DIR, ignore_errors=True)


def _serve(directory: Path, host: str, port: int) -> int:
    handler = functools.partial(
        http.server.SimpleHTTPRequestHandler, directory=str(directory)
    )
    with http.server.ThreadingHTTPServer((host, port), handler) as server:
        print(f"Serving {directory} at http://{host}:{port}")
        server.serve_forever()
    return 0
