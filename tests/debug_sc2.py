#!/usr/bin/env python3
"""Deep debug of the Scramjet v2 engine path."""
import json, os, pathlib
from playwright.sync_api import sync_playwright

BASE = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
SHOTS = pathlib.Path(__file__).resolve().parent.parent / "shots"

with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1440, "height": 900}).new_page()
    logs = []
    page.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"))
    page.on("pageerror", lambda e: logs.append("PAGEERROR " + str(e)))
    page.on("requestfailed", lambda r: logs.append(f"REQFAIL {r.url[:130]} :: {r.failure}"))
    page.on("response", lambda r: logs.append(f"RESP {r.status} {r.url[:130]}") if "sj2" in r.url or "scramjet" in r.url else None)
    page.goto(BASE, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")

    out = page.evaluate("""async ([wisp]) => {
        const log = [];
        Nebula.set({ engine: 'sc2', transport: 'libcurl', wisp });
        Nebula.Proxy.mux = null; Nebula.Proxy.muxApplied = null; Nebula.Proxy._standalone = null; Nebula.Proxy._standaloneOpts = null;
        try { await Nebula.Proxy.registerSW(); } catch (e) { log.push('registerSW: ' + e.message); }
        try { await Nebula.Proxy.ensureEngine('sc2'); log.push('engine ready'); } catch (e) { log.push('ensureEngine: ' + e.message); return { log }; }
        const c = Nebula.Proxy.sc2.controller;
        log.push('controller prefix=' + c.prefix);
        log.push('sw controller=' + (navigator.serviceWorker.controller ? navigator.serviceWorker.controller.state : 'none'));
        const frameEl = document.createElement('iframe');
        document.body.append(frameEl);
        let frame;
        try { frame = c.createFrame(frameEl, { plugins: [] }); log.push('frame created, prefix=' + frame.prefix); } catch (e) { log.push('createFrame: ' + e.message); return { log }; }
        try { await frame.go('https://example.com/'); log.push('go() resolved, src=' + frameEl.src); } catch (e) { log.push('go(): ' + e.message); }
        await new Promise(r => setTimeout(r, 6000));
        let doc = null;
        try { doc = frameEl.contentDocument; } catch (e) {}
        return { log, src: frameEl.src, prefix: c.prefix, framePrefix: frame.prefix,
                 docState: doc ? doc.readyState : null, docTitle: doc ? doc.title : null,
                 docText: doc && doc.body ? doc.body.innerText.slice(0, 200) : null,
                 docHTML: doc ? (doc.documentElement ? doc.documentElement.outerHTML.slice(0, 400) : null) : null,
                 swControllerState: navigator.serviceWorker.controller ? navigator.serviceWorker.controller.state : 'none' };
    }""", [WISP])
    print(json.dumps(out, indent=1)[:4000])
    page.screenshot(path=str(SHOTS / "debug-sc2.png"))
    print("\n--- console/network log ---")
    for l in logs[-45:]:
        print(" ", l[:190])
    b.close()
