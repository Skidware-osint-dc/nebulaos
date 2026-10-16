#!/usr/bin/env python3
import json, os
from playwright.sync_api import sync_playwright
URL = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1200, "height": 800}).new_page()
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    print(page.evaluate("""async () => {
        Nebula.set({ wisp: 'ws://localhost:4000/', transport: 'libcurl' });
        const out = { wisp: Nebula.state.wisp, type: typeof Nebula.state.wisp };
        try { const t = await Nebula.Proxy.makeStandaloneTransport(); out.ok = true; out.ready = t.ready; }
        catch (e) { out.stack = String(e && e.stack || e).slice(0, 500); }
        return out;
    }"""))
    b.close()
