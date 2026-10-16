#!/usr/bin/env python3
"""
Scan the HTML files in uploads_test/ and report whether each one actually runs.

For every file: load it in a real browser, collect console messages and uncaught
errors, measure how much UI actually rendered, note network failures, and take a
screenshot. Prints a table plus per-file detail. Nothing is modified.
"""
import json, os, pathlib, re, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
SERVE = ROOT / "uploads_test"
OUT = ROOT / "shots" / "uploads"
OUT.mkdir(parents=True, exist_ok=True)
BASE = os.environ.get("UPLOAD_URL", "http://localhost:8010")

IGNORE = re.compile(r"(favicon|net::ERR_|getclicky|google-analytics|googletagmanager)", re.I)


def analyse(path: pathlib.Path):
    out = {"file": path.name, "bytes": path.stat().st_size}
    errors, warnings, logs, failed, requests = [], [], [], set(), set()
    with sync_playwright() as pw:
        browser = pw.chromium.launch(args=["--disable-dev-shm-usage", "--no-sandbox"])
        ctx = browser.new_context(viewport={"width": 1280, "height": 800})
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e).splitlines()[0][:160]))
        page.on("console", lambda m: (errors if m.type == "error" else logs).append(m.text[:160]) if m.type in ("error", "warning") else None)
        page.on("requestfailed", lambda r: failed.add(f"{r.url[:80]} ({r.failure})"))
        page.on("response", lambda r: requests.add(f"{r.status} {r.url[:90]}") if r.status >= 400 else None)
        try:
            page.goto(f"{BASE}/{path.name}", wait_until="load", timeout=45000)
        except Exception as e:
            out["load"] = "timeout/error: " + str(e).splitlines()[0][:100]
        page.wait_for_timeout(4500)          # let deferred scripts and frames settle
        try:
            out["title"] = page.title()[:60]
            out["dom"] = page.evaluate("""() => ({
                nodes: document.querySelectorAll('*').length,
                text: (document.body ? document.body.innerText : '').trim().length,
                buttons: document.querySelectorAll('button,a,[role=button]').length,
                inputs: document.querySelectorAll('input,textarea,select').length,
                canvases: document.querySelectorAll('canvas').length,
                iframes: [...document.querySelectorAll('iframe')].map(f => f.src).filter(Boolean).length,
                visible: [...document.querySelectorAll('body *')].filter(e => {
                    const r = e.getBoundingClientRect();
                    return r.width > 8 && r.height > 8 && getComputedStyle(e).visibility !== 'hidden';
                }).length,
            })""")
        except Exception as e:
            out["dom"] = "unreadable: " + str(e)[:80]
        try:
            page.screenshot(path=str(OUT / (path.stem + ".png")))
        except Exception:
            pass
        browser.close()
    out["errors"] = [e for e in errors if not IGNORE.search(e)][:6]
    out["console"] = logs[:6]
    out["failed_requests"] = sorted(f for f in failed if not IGNORE.search(f))[:6]
    out["http_errors"] = sorted(r for r in requests if not IGNORE.search(r))[:6]
    return out


def main():
    files = sorted(SERVE.glob("*.html"))
    if len(sys.argv) > 1:
        files = [f for f in files if any(a in f.name for a in sys.argv[1:])]
    report = []
    for f in files:
        print(f"\n{'='*66}\n{f.name}  ({f.stat().st_size/1024:.0f} KB)\n{'='*66}", flush=True)
        r = analyse(f)
        report.append(r)
        dom = r.get("dom")
        print(f"  title      {r.get('title')}")
        if isinstance(dom, dict):
            print(f"  render     {dom['nodes']} nodes · {dom['visible']} visible · {dom['text']} chars of text · "
                  f"{dom['buttons']} buttons/links · {dom['inputs']} inputs · {dom['canvases']} canvas · {dom['iframes']} iframes")
        else:
            print(f"  render     {dom}")
        if r["errors"]:
            print("  ❌ JS errors:")
            for e in r["errors"]:
                print("       " + e)
        if r["failed_requests"]:
            print("  ❌ failed requests:")
            for e in r["failed_requests"]:
                print("       " + e)
        if r["http_errors"]:
            print("  ⚠  4xx/5xx:")
            for e in r["http_errors"]:
                print("       " + e)
        if r["console"]:
            print("  ⚠  console:")
            for e in r["console"][:4]:
                print("       " + e)
        if not r["errors"] and not r["failed_requests"] and not r["http_errors"]:
            print("  ✅ no errors reported")
    (OUT / "report.json").write_text(json.dumps(report, indent=1))
    print(f"\nscreenshots + report.json → {OUT}")


if __name__ == "__main__":
    main()
