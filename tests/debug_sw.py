#!/usr/bin/env python3
"""Ask the NebulaOS service worker for its internal diagnostics."""
import json, os
from playwright.sync_api import sync_playwright
BASE = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1200, "height": 800}).new_page()
    logs = []
    page.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"))
    page.on("pageerror", lambda e: logs.append("PAGEERROR " + str(e)))
    page.goto(BASE, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")
    out = page.evaluate("""async ([wisp]) => {
        Nebula.set({ wisp, engine: 'uv', transport: 'libcurl' });
        await Nebula.Proxy.registerSW();
        await Nebula.Proxy.ensureMux();
        const ask = (msg) => new Promise((resolve) => {
            const ch = new MessageChannel();
            ch.port1.onmessage = (e) => resolve(e.data);
            navigator.serviceWorker.controller.postMessage(msg, [ch.port2]);
            setTimeout(() => resolve({ timeout: true }), 8000);
        });
        const diag = await ask({ nebula: 'diag' });
        const routes = {
            uv: await ask({ nebula: 'route', engine: 'uv' }),
        };
        await Nebula.Proxy.ensureEngine('sc1');
        routes.sc1 = await ask({ nebula: 'route', engine: 'sc1' });
        return { diag, routes, swConfig: Nebula.Proxy.swConfig };
    }""", [WISP])
    print(json.dumps(out, indent=1)[:3500])
    print("--- console ---")
    for l in logs[-25:]:
        print(" ", l[:200])
    b.close()
