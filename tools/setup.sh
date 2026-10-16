#!/usr/bin/env bash
# NebulaOS dev environment bootstrap — safe to re-run.
# The sandbox is restored from a snapshot, so pip packages, browsers and
# node_modules are not preserved. Run this once per fresh sandbox:
#     bash tools/setup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

# Browsers live outside the workspace snapshot (.cache is excluded) but on the big
# root disk; a fresh sandbox simply re-downloads them here.
BROWSERS="${PLAYWRIGHT_BROWSERS_PATH:-$PWD/.cache/ms-playwright}"
PORT_RELAY=4000

echo "== python deps =="
python3 -m pip install --quiet --upgrade playwright pillow

echo "== browsers -> $BROWSERS =="
mkdir -p "$BROWSERS" 2>/dev/null || { BROWSERS="$PWD/.cache/ms-playwright"; mkdir -p "$BROWSERS"; }
export PLAYWRIGHT_BROWSERS_PATH="$BROWSERS"
python3 -m playwright install chromium firefox >/dev/null 2>&1 || true
sudo -n true 2>/dev/null && python3 -m playwright install-deps chromium firefox >/dev/null 2>&1 || true

echo "== verify browsers =="
PLAYWRIGHT_BROWSERS_PATH="$BROWSERS" python3 - <<'PY'
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    for name in ("chromium", "firefox"):
        try:
            b = getattr(p, name).launch(); print(f"   {name} {b.version} OK"); b.close()
        except Exception as e:
            print(f"   {name} FAILED: {str(e).splitlines()[0]}")
PY

echo "== local wisp relay (tools/node_modules) =="
if [ ! -d tools/node_modules ]; then
  (cd tools && npm init -y >/dev/null 2>&1; npm install --no-audit --no-fund @mercuryworkshop/wisp-js@0.5.0 >/dev/null 2>&1)
fi
ls tools/node_modules >/dev/null 2>&1 && echo "   relay deps present" || echo "   ⚠ relay install failed — remote wisp will be used"

echo
echo "Done. Run the suite with:"
echo "  PLAYWRIGHT_BROWSERS_PATH=$BROWSERS python3 tests/e2e.py"
echo "  (tests start their own server + relay; see README.md)"
