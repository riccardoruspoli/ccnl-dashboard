DEFAULT_SOURCE_URL = (
    "https://az-apim-cne-sa-0002-lgc-we.azure-api.net/ricerca-api/ricerca/pubblica/"
    "open-data?type=ARCHIVIO_CORRENTE"
)
DEFAULT_EXPIRING_SOON_WINDOW_DAYS = 180
DEFAULT_EXCLUDED_AGREEMENT_TYPES = frozenset({"Contratto di solidarietà"})
DEFAULT_BUILD_DIR = "build"
DEFAULT_RAW_DIR = f"{DEFAULT_BUILD_DIR}/raw"
DEFAULT_SITE_DIR = "dist"
DEFAULT_FRONTEND_DIR = "frontend"
DEFAULT_SITE_URL = "https://ccnl.riccardoruspoli.com"
DEFAULT_SERVE_HOST = "127.0.0.1"
DEFAULT_SERVE_PORT = 8000
