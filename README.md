# ccnl-dashboard

`ccnl-dashboard` builds a static public dashboard for monitoring current Italian CCNL open data, with a focus on contractual expiration status and renewal delay metrics.

The project downloads the current public archive, normalizes the records needed by the dashboard, generates compact JSON artifacts, and publishes a Vite React frontend that can be hosted as a static site.

> [!NOTE]
> The dashboard is informational and independent. It does not replace official sources, the applicable collective agreement text, or legal, labour-law, payroll, or union advice.

## At a glance

- **Input:** public CNEL current CCNL open data
- **Core engine:** Python + Pydantic
- **Frontend:** Vite + React + TypeScript + Tailwind CSS
- **Output:** static frontend assets and compact JSON files
- **Hosting model:** S3 + CloudFront
- **Refresh model:** scheduled full-site rebuild
- **Public hostname:** `ccnl.riccardoruspoli.com`

## Overview

The dashboard tracks current Italian collective agreement records from the public `ARCHIVIO_CORRENTE` source.

It is built around a simple static contract:

- Python owns ingestion, normalization, eligibility, expiration logic, metrics, and artifact writing.
- The browser reads generated JSON artifacts from the static site.
- The frontend does not call the official source endpoint directly.
- Raw source snapshots and internal build artifacts are not published.

The public site exposes only the dashboard, generated data files, `robots.txt`, and `sitemap.xml`.

## What it does

The build pipeline downloads the current public JSON extract, normalizes the records needed by the dashboard, computes expiration metrics, builds the Vite frontend, and writes the static site to `dist`.

The public JSON artifacts are:

- `data/ccnl.current.json`
- `data/metrics.json`

### Dashboard

The frontend provides:

- Italian as the default language, with English available in-page;
- aggregate expiration and renewal-delay metrics;
- searchable and sortable CCNL inspection.

## Tech stack

### Application

- Python `3.12`
- Pydantic
- httpx
- Vite
- React
- TypeScript
- Tailwind CSS

### Quality

- Ruff
- pytest
- ESLint
- Prettier

### Infrastructure target

- Terraform
- Amazon S3
- Amazon CloudFront
- AWS CodeBuild
- AWS EventBridge Scheduler
- CloudWatch Logs
- Cloudflare DNS

## Setup

Install `uv`, Python `3.12`, Node.js, and npm.

From the repository root:

```sh
uv venv --python python3.12
uv sync --extra dev
npm install --prefix frontend
```

## Local usage

Build the complete static site:

```sh
uv run ccnl-dashboard build
```

Serve the generated site locally:

```sh
uv run ccnl-dashboard serve --host 127.0.0.1 --port 8000
```

Open `http://localhost:8000`.

## Local checks

Run Python checks:

```sh
uv run ruff format .
uv run ruff check .
uv run pytest
```

Run frontend checks:

```sh
npm run format:check --prefix frontend
npm run lint --prefix frontend
npm run build --prefix frontend
```

## AWS architecture

The production target is intentionally static and low-operations.

```mermaid
flowchart LR
  A["EventBridge Scheduler"] --> B["CodeBuild"]
  B --> C["Download CNEL open data"]
  C --> D["Build dashboard"]
  D --> E["S3 site bucket"]
  E --> F["CloudFront"]
  F --> G["Public dashboard"]
```

Main characteristics:

- full-site rebuilds instead of request-time processing;
- private S3 origin served through CloudFront;
- scheduled rebuilds through EventBridge and CodeBuild;
- Terraform-managed AWS infrastructure;
- Cloudflare-managed DNS outside Terraform.

## License and data provenance

The repository source code is released under the MIT License. See `LICENSE`.

The dashboard data is derived from [CNEL Open Data](https://www.cnel.it/Archivio-Contratti-Collettivi/Contratti-Open-Data) for current collective agreements. CNEL publishes the contract open data under the [Italian Open Data License v2.0](https://www.dati.gov.it/content/italian-open-data-license-v20).

Generated public artifacts contain a processed subset of the source data and aggregate metrics. This project is not affiliated with or endorsed by CNEL, the Ministry of Labour, unions, employer associations, or any public administration.
