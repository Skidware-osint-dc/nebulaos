#!/usr/bin/env python3
"""Local file:// usage: the OS must boot and give clear guidance."""
import json, pathlib
from playwright.sync_api import sync_playwright
HTML = "file://" + str(pathlib.Path("dist/NebulaOS.html").resolve())
SVG = "file://" + str(pathlib.Path("dist/NebulaOS.svg").resolve())

with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    for label, url in (("html", HTML), ("svg", SVG)):
        page = b.new_context(viewport={"width": 1440, "height": 900}).new_page()
        logs = []
        page.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"[:150]))
        page.on("pageerror", lambda e: logs.append("PAGEERROR " + str(e)[:150]))
        page.goto(url, wait_until="domcontentloaded")
        app = None
        for _ in range(50):
            for f in page.frames:
                try:
                    if f.evaluate("() => !!window.Nebula"):
                        app = f; break
                except Exception: pass
            if app: break
            page.wait_for_timeout(400)
        print(f"\n=== {label} ({url.split('/')[-1]}) ===")
        print("  boots:", bool(app))
        if app:
            app.wait_for_function("() => document.querySelector('#splash') === null", timeout=40000)
            info = app.evaluate("""() => ({
                baseDir: Nebula.Proxy.baseDir(), swReady: Nebula.Proxy.swReady,
                status: Nebula.Proxy.status, secure: Nebula.Proxy.secureContextOk(),
                appProto: Nebula.Proxy.appProtocol(), swUrl: Nebula.Proxy.swUrl(),
                hash: (Nebula.Proxy.appLocation().hash || '').slice(0, 40),
                dock: document.querySelectorAll('#dock .dock-item').length,
                badge: document.querySelector('#badge-proxy-text').textContent
            })""")
            print("  " + json.dumps(info))
            app.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")
        errs = [l for l in logs if "error" in l.lower() and "favicon" not in l.lower()]
        print("  console errors:", errs[:3])
        page.screenshot(path=f"shots/31-local-{label}.png")
        page.close()
    b.close()
