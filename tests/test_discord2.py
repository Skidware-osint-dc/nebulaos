#!/usr/bin/env python3
"""Discord render probe with realistic progress reporting."""
import json, os, pathlib
from playwright.sync_api import sync_playwright
URL = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
SHOTS = pathlib.Path("shots"); SHOTS.mkdir(exist_ok=True)
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")
    out = page.evaluate("""async ([wisp]) => {
        Nebula.set({ engine: 'sc2', transport: 'libcurl', wisp });
        Nebula.Proxy.mux = null; Nebula.Proxy.muxApplied = null; Nebula.Proxy._standalone = null; Nebula.Proxy._standaloneOpts = null;
        Nebula.Proxy.sc2 = { controller: null, loaded: false, scriptPromise: null, runtimePromise: null };
        await Nebula.Proxy.registerSW(); await Nebula.Proxy.ensureEngine('sc2');
        Nebula.openApp('discord');
        const win = [...document.querySelectorAll('.window')].find(w => w.getAttribute('aria-label') === 'Discord');
        const marks = [];
        for (let i = 0; i < 60; i++) {
            await new Promise(r => setTimeout(r, 1000));
            const s = Nebula.Discord.session;
            let st = { t: i };
            try {
                const d = s && s.iframe.contentDocument;
                if (d) { st.ready = d.readyState; st.title = d.title; st.bodyLen = d.body ? d.body.innerText.length : 0;
                         st.scripts = d.scripts.length; st.hasApp = !!d.querySelector('#app-mount, [id*=app]'); }
            } catch (e) { st.err = String(e).slice(0, 40); }
            if (i % 6 === 0 || (st.title && st.bodyLen > 40)) marks.push(st);
            if (st.title && (st.bodyLen > 40 || st.hasApp)) break;
        }
        return { marks, url: Nebula.Discord.session ? Nebula.Discord.session.currentUrl : null };
    }""", [WISP])
    print(json.dumps(out, indent=1)[:2200])
    page.screenshot(path=str(SHOTS / "06-discord-live.png"))
    b.close()
