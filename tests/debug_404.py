#!/usr/bin/env python3
import os, pathlib
from playwright.sync_api import sync_playwright
BASE = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
bad = []
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1280, "height": 800}).new_page()
    page.on("response", lambda r: bad.append((r.status, r.url[:150])) if r.status >= 400 else None)
    page.goto(BASE, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")
    for engine in ["uv", "sc1", "sc2"]:
        for transport in ["epoxy", "libcurl"]:
            page.evaluate("""async ([e, t, wisp]) => {
                Nebula.set({ engine: e, transport: t, wisp });
                Nebula.Proxy.mux = null; Nebula.Proxy.muxApplied = null; Nebula.Proxy._standalone = null; Nebula.Proxy._standaloneOpts = null;
                await Nebula.Proxy.registerSW();
                try { await Nebula.Proxy.ensureEngine(e); } catch (err) {}
                Nebula.Browser.open();
                const b2 = Nebula.Browser, tab = b2.tabs[b2.tabs.length - 1];
                try { await b2.navigate('https://example.com/', tab); } catch (err) {}
                await new Promise(r => setTimeout(r, 3500));
                if (tab.session) { try { tab.session.destroy(); } catch(e){} }
            }""", [engine, transport, WISP])
            page.evaluate("() => [...document.querySelectorAll('.window')].forEach(w => w.querySelector('.tbtn.close')?.click())")
            page.wait_for_timeout(600)
    print("--- responses >= 400 ---")
    for status, url in bad:
        print(f"  {status}  {url}")
    b.close()
