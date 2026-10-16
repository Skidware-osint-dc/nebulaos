#!/usr/bin/env python3
"""How far does discord.com get through each engine? (honest reporting)"""
import json, os
from playwright.sync_api import sync_playwright
URL = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
TARGETS = os.environ.get("DISCORD_URLS", "https://discord.com/login").split(",")
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1400, "height": 900}).new_page()
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")
    for engine, transport in [("sc2", "libcurl"), ("sc1", "libcurl"), ("uv", "libcurl")]:
        for target in TARGETS:
            try:
                res = page.evaluate("""async ([e, t, target, wisp]) => {
                    Nebula.set({ engine: e, transport: t, wisp });
                    Nebula.Proxy.mux = null; Nebula.Proxy.muxApplied = null; Nebula.Proxy._standalone = null;
                    Nebula.Proxy._standaloneOpts = null; Nebula.Proxy.sc2 = { controller: null, loaded: false, scriptPromise: null, runtimePromise: null };
                    try { await Nebula.Proxy.registerSW(); await Nebula.Proxy.ensureEngine(e); }
                    catch (err) { return { stage: 'engine', error: String(err && err.message || err) }; }
                    const s = await new Nebula.ProxySession(e, {}).init();
                    const out = { engine: e, target };
                    const started = Date.now();
                    try { await s.go(target); } catch (err) { out.goError = String(err && err.message || err); }
                    for (let i = 0; i < 56; i++) {
                        await new Promise(r => setTimeout(r, 500));
                        let d = null;
                        try { d = s.iframe.contentDocument; } catch (err) {}
                        if (d && d.readyState === 'complete') {
                            const txt = d.body ? d.body.innerText.replace(/\\s+/g,' ').trim() : '';
                            if (txt.length > 12 || d.title) {
                                out.title = d.title; out.text = txt.slice(0, 150);
                                out.scripts = d.scripts.length; out.done = true;
                                out.loadMs = Date.now() - started;
                                out.appRoot = !!d.querySelector('#app-mount, [class*=app]');
                                break;
                            }
                        }
                    }
                    s.destroy();
                    return out;
                }""", [engine, transport, target, WISP])
                print(json.dumps(res)[:400], flush=True)
            except Exception as e:
                print(f"{engine} {target} -> EXCEPTION {str(e)[:150]}", flush=True)
    b.close()
