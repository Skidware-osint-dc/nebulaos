#!/usr/bin/env python3
"""Verify the packed dist/NebulaOS.svg boots the full desktop (and the SW works)."""
import os, json
from playwright.sync_api import sync_playwright
URL = os.environ.get("NEBULA_SVG", "http://localhost:8000/NebulaOS.svg")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")

with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1440, "height": 900}).new_page()
    logs = []
    page.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"[:190]))
    page.on("pageerror", lambda e: logs.append("PAGEERROR " + str(e)[:190]))
    page.goto(URL, wait_until="domcontentloaded")
    # the SVG packs the app into a srcdoc iframe
    page.wait_for_timeout(2500)
    frames = page.frames
    print("frames:", [f.url[:70] for f in frames])
    app = None
    for _ in range(40):
        for f in page.frames:
            try:
                if f.evaluate("() => !!window.Nebula"):
                    app = f; break
            except Exception: pass
        if app: break
        page.wait_for_timeout(500)
    print("app frame found:", bool(app))
    if app:
        app.wait_for_function("() => document.querySelector('#splash') === null", timeout=45000)
        app.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")
        info = app.evaluate("""async ([wisp]) => {
            Nebula.set({ wisp });
            await Nebula.Proxy.registerSW();
            await Nebula.Proxy.ensureMux();
            const r = await Nebula.Proxy.probeFetch('uv');
            Nebula.Browser.open();
            const b2 = Nebula.Browser, tab = b2.tabs[b2.tabs.length - 1];
            await b2.navigate('https://example.com/', tab);
            let ok = false, title = '';
            for (let i = 0; i < 40; i++) {
                await new Promise(r => setTimeout(r, 500));
                try { const d = tab.session && tab.session.iframe.contentDocument;
                      if (d && d.title === 'Example Domain') { ok = true; title = d.title; break; } } catch (e) {}
            }
            return { baseDir: Nebula.Proxy.baseDir(), swUrl: Nebula.Proxy.swUrl(), prefixes: Nebula.Proxy.prefixes(),
                     probe: r, page: ok, title, swReady: Nebula.Proxy.swReady };
        }""", [WISP])
        print(json.dumps(info, indent=1))
        page.screenshot(path="shots/30-svg-desktop.png")
    print("--- console (last 12) ---")
    for l in logs[-12:]:
        print("  ", l)
    b.close()
