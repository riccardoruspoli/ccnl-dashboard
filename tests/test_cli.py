from datetime import date
from pathlib import Path
from types import SimpleNamespace

from ccnl_dashboard import cli


def test_build_command_uses_default_download_and_output_paths(
    monkeypatch, tmp_path
) -> None:
    downloaded_path = tmp_path / "archivio_corrente20260429.json"
    calls = {}

    def fake_download_json_file(source_url: str, output_dir: Path) -> Path:
        calls["source_url"] = source_url
        calls["raw_dir"] = output_dir
        return downloaded_path

    def fake_build_dashboard_data(input_path: Path):
        calls["input_path"] = input_path
        return (
            [],
            SimpleNamespace(
                reference_date=date(2026, 4, 29),
                total_current_ccnl=0,
                expired_count=0,
                active_count=0,
                unknown_expiration_count=0,
            ),
        )

    def fake_write_dashboard_data(output_dir: Path, *args) -> None:
        calls["site_dir"] = output_dir
        calls["site_artifact_count"] = len(args)

    def fake_write_static_metadata(
        output_dir: Path, site_url: str, lastmod=None
    ) -> None:
        calls["metadata_dir"] = output_dir
        calls["site_url"] = site_url
        calls["lastmod"] = lastmod

    def fake_build_frontend(frontend_dir: Path) -> None:
        calls["frontend_dir"] = frontend_dir

    def fake_remove_build_workspace() -> None:
        calls["removed_build_workspace"] = True

    monkeypatch.setattr(cli, "download_json_file", fake_download_json_file)
    monkeypatch.setattr(cli, "build_dashboard_data", fake_build_dashboard_data)
    monkeypatch.setattr(cli, "write_dashboard_data", fake_write_dashboard_data)
    monkeypatch.setattr(cli, "write_static_metadata", fake_write_static_metadata)
    monkeypatch.setattr(cli, "_build_frontend", fake_build_frontend)
    monkeypatch.setattr(cli, "_remove_build_workspace", fake_remove_build_workspace)

    assert cli.main(["build"]) == 0

    assert calls["raw_dir"] == Path("build/raw")
    assert calls["input_path"] == downloaded_path
    assert calls["site_dir"] == Path("dist")
    assert calls["metadata_dir"] == Path("dist")
    assert calls["frontend_dir"] == Path("frontend")
    assert calls["site_artifact_count"] == 2
    assert calls["site_url"] == "https://ccnl.riccardoruspoli.com"
    assert calls["lastmod"] == date(2026, 4, 29)
    assert calls["removed_build_workspace"] is True
    assert calls["source_url"]


def test_serve_command_uses_default_directory_and_configurable_host_port(
    monkeypatch,
) -> None:
    calls = {}

    def fake_serve(directory: Path, host: str, port: int) -> int:
        calls["directory"] = directory
        calls["host"] = host
        calls["port"] = port
        return 0

    monkeypatch.setattr(cli, "_serve", fake_serve)

    assert cli.main(["serve", "--host", "0.0.0.0", "--port", "9000"]) == 0

    assert calls == {
        "directory": Path("dist"),
        "host": "0.0.0.0",
        "port": 9000,
    }
