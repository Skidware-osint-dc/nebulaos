#!/usr/bin/env python3
"""
NebulaOS — linked (large) drop-in app test.

build.py embeds apps under 180 KB and *links* anything bigger so the single-file
build stays small. This test proves the linked branch works end to end:

  1. a 210 KB app is dropped into apps/ and the project is rebuilt
  2. the manifest marks it not-embedded and the file is copied into bundle/apps/
  3. the desktop opens it from that URL (iframe src, not srcdoc) and it renders
  4. removing it and rebuilding restores the shipped build

Run:  PLAYWRIGHT_BROWSERS_PATH=/opt/ms-playwright python3 tests/test_linked_app.py
"""
import os, pathlib, shutil, subprocess, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
BIG = ROOT / "apps" / "big-sample.html"
SHOTS = ROOT / "shots"
results = []


def check(label, ok, detail=""):
    results.append((label, bool(ok)))
    print(f"   {'✅' if ok else '❌'} {label}{(' — ' + str(detail)) if detail else ''}", flush=True)


def build():
    out = subprocess.run([sys.executable, str(ROOT / "build.py")], cwd=ROOT, capture_output=True, text=True)
    if out.returncode:
        raise RuntimeError(out.stdout + out.stderr)
    return out.stdout


def make_big():
    """A ~210 KB single-file app: real content plus inline padding, like a
    bundled sprite sheet or a big data table would be."""
    pad = "/* padding line so this file lands over the embed limit */ .k{margin:0}\n" * 4200
    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="nebula-name" content="Big Sample">
<meta name="nebula-icon" content="🗄️">
<meta name="nebula-kind" content="app">
<meta name="nebula-description" content="A large app that NebulaOS links instead of embedding.">
<title>Big Sample</title>
<style>
  {pad}
  body{{background:#0f1116;color:#e9edf7;font:14px system-ui;display:grid;place-items:center;height:100vh;margin:0}}
  .big{{border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:22px}}
</style></head>
<body><div class="big"><b id="marker">BIG-SAMPLE-RENDERED</b><div id="origin"></div></div>
<script>document.getElementById('origin').textContent = 'loaded from ' + location.pathname;</script>
</body></html>
"""


def run():
    print("=== build: linked app ===\n", flush=True)
    BIG.write_text(make_big())
    size_kb = BIG.stat().st_size / 1024
    check("test app is bigger than the embed limit", size_kb > 180, f"{size_kb:.0f} KB")
    log = build()
    check("build reports it as linked", "linked (Big Sample)" in log,
          [l.strip() for l in log.splitlines() if "big-sample" in l][:1])
    copied = ROOT / "bundle" / "apps" / "big-sample.html"
    check("file copied next to the build for on-demand loading", copied.exists(),
          f"bundle/apps/big-sample.html {copied.stat().st_size/1024:.0f} KB" if copied.exists() else "missing")

    with sync_playwright() as pw:
        browser = pw.chromium.launch(args=["--disable-dev-shm-usage", "--no-sandbox"])
        page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(BASE, wait_until="domcontentloaded")
        page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
        page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")

        entry = page.evaluate("() => (window.NEBULA_MANIFEST||[]).find(m => m.id === 'bundled-app-big-sample')")
        check("manifest knows the app", bool(entry), entry and entry.get("name"))
        check("manifest marks it as not embedded", entry and entry.get("embedded") is False)
        check("no payload was inlined for it",
              page.evaluate("() => !(window.NEBULA_EMBEDDED||{})['bundled-app-big-sample']"))

        page.evaluate("() => Nebula.Registry.byId('bundled-app-big-sample').run()")
        page.wait_for_timeout(2200)
        info = page.evaluate("""() => {
            const w = [...Nebula.wins.values()].find(w => w.appId === 'bundled-app-big-sample');
            const f = w && w.el.querySelector('iframe');
            return f ? { title: w.title, src: f.getAttribute('src') || '', srcdoc: !!f.srcdoc } : null;
        }""")
        check("opened from a URL, not srcdoc", bool(info) and info["src"].endswith("apps/big-sample.html") and not info["srcdoc"],
              info and (info["src"] or "no src"))
        frame = None
        for f in page.frames:
            if f != page.main_frame and "big-sample" in (f.url or ""):
                frame = f
        check("frame loaded", frame is not None, frame.url if frame else "not found")
        if frame:
            txt = frame.inner_text("#marker")
            origin = frame.inner_text("#origin")
            check("large app renders", txt == "BIG-SAMPLE-RENDERED", txt)
            check("it runs from the dist folder", "apps/big-sample.html" in origin, origin)
        page.screenshot(path=str(SHOTS / "40-linked-app.png"))
        check("no uncaught JS exceptions", not [e for e in errors if e.strip()], errors[:2])
        browser.close()

    print("\n=== cleanup: back to the shipped build ===", flush=True)
    BIG.unlink()
    shutil.rmtree(ROOT / "bundle" / "apps", ignore_errors=True)
    log = build()
    line = [l.strip() for l in log.splitlines() if "app(s)" in l][:1]
    check("shipped build restored (6 bundled apps: 4 embedded + 2 linked)",
          "6 app(s): 4 embedded, 2 linked" in log, line)
    check("linked copy removed", not (ROOT / "bundle" / "apps" / "big-sample.html").exists())

    passed = sum(1 for _, ok in results if ok)
    print(f"\n{'='*52}\nlinked app support: {passed}/{len(results)} passed\n{'='*52}")
    return 0 if passed == len(results) else 1


if __name__ == "__main__":
    sys.exit(run())
