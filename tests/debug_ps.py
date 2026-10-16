#!/usr/bin/env python3
import os
from playwright.sync_api import sync_playwright
URL = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1200, "height": 800}).new_page()
    logs = []
    page.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"[:200]))
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    print(page.evaluate("""async () => {
        Nebula.set({ wisp: 'ws://localhost:4000/', engine: 'sc2', transport: 'libcurl' });
        Nebula.Proxy.mux = null; Nebula.Proxy.muxApplied = null; Nebula.Proxy._standalone = null; Nebula.Proxy._standaloneOpts = null;
        await Nebula.Proxy.registerSW();
        try {
            const s = await new Nebula.ProxySession('sc2', {}).init();
            return { ok: true, src: s.iframe.src };
        } catch (e) { return { ok: false, stack: String(e && e.stack || e).slice(0, 600) }; }
    }"""))
    for l in logs[-6:]:
        print("  ", l)
    b.close()
