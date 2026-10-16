#!/usr/bin/env python3
import json, os
from playwright.sync_api import sync_playwright
URL = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1200, "height": 800}).new_page()
    reqs = []
    page.on("response", lambda r: reqs.append((r.status, r.url[:110])))
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")
    out = page.evaluate("""async ([wisp]) => {
        Nebula.set({ engine: 'sc2', transport: 'libcurl', wisp });
        Nebula.Proxy.mux = null; Nebula.Proxy.muxApplied = null; Nebula.Proxy._standalone = null; Nebula.Proxy._standaloneOpts = null;
        Nebula.Proxy.sc2 = { controller: null, loaded: false, scriptPromise: null, runtimePromise: null };
        await Nebula.Proxy.registerSW(); await Nebula.Proxy.ensureEngine('sc2');
        // fetch discord's login page *through the running proxy* and inspect headers
        const r = await fetch(new URL('/sj2/' + Nebula.Proxy.sc2.controller.id + '/x/https%3A%2F%2Fdiscord.com%2Flogin', location.origin).href);
        const hdrs = [...r.headers.entries()].filter(([k]) => /csp|content-security|x-frame|permissions/i.test(k));
        const txt = await r.text();
        return { status: r.status, cspHeaders: hdrs, len: txt.length, scriptSrcs: (txt.match(/src="([^"]+)"/g) || []).slice(0, 6) };
    }""", [WISP])
    print(json.dumps(out, indent=1)[:1800])
    print("\n--- requests to engine prefix ---")
    for st, u in reqs[-14:]:
        print(" ", st, u)
    b.close()
