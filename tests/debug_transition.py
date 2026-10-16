#!/usr/bin/env python3
"""Reproduce: run Scramjet 1 first, then Scramjet 2 (order matters?)."""
import json, os
from playwright.sync_api import sync_playwright
BASE = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1200, "height": 800}).new_page()
    logs = []
    page.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"[:220]))
    page.on("pageerror", lambda e: logs.append("PAGEERROR " + str(e)[:220]))
    page.goto(BASE, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    out = page.evaluate("""async ([wisp]) => {
        const log = [];
        Nebula.set({ wisp, engine: 'sc1', transport: 'libcurl' });
        await Nebula.Proxy.registerSW();
        await Nebula.Proxy.ensureEngine('sc1');
        log.push('after sc1: $scramjet=' + typeof globalThis.$scramjet + ' version=' + JSON.stringify(globalThis.$scramjet && globalThis.$scramjet.versionInfo || globalThis.$scramjetVersion || null));
        Nebula.set({ engine: 'sc2' });
        Nebula.Proxy.sc2 = { controller: null, loaded: false, scriptPromise: null, runtimePromise: null };
        try { await Nebula.Proxy.ensureEngine('sc2'); log.push('sc2 ensureEngine OK'); }
        catch (e) { log.push('sc2 ensureEngine THREW: ' + (e && e.message || e)); }
        log.push('after sc2: $scramjet=' + typeof globalThis.$scramjet + ' version=' + JSON.stringify(globalThis.$scramjet && globalThis.$scramjet.versionInfo || null));
        try {
            const sess = await new Nebula.ProxySession('sc2', {}).init();
            log.push('ProxySession(sc2) OK');
            await sess.go('https://example.com/');
            await new Promise(r => setTimeout(r, 4000));
            const d = sess.iframe.contentDocument;
            log.push('session doc: ' + (d ? d.title + ' :: ' + (d.body ? d.body.innerText.slice(0,60) : '') : 'none'));
        } catch (e) { log.push('ProxySession(sc2) THREW: ' + (e && e.stack || e).toString().slice(0, 400)); }
        Nebula.Browser.open();
        const b2 = Nebula.Browser;
        const tab = b2.tabs[b2.tabs.length - 1];
        try { await b2.navigate('https://example.com/', tab); log.push('navigate OK'); }
        catch (e) { log.push('navigate THREW: ' + (e && e.message || e)); }
        await new Promise(r => setTimeout(r, 5000));
        let doc = null, txt = '';
        try { doc = tab.session && tab.session.iframe.contentDocument; txt = doc && doc.body ? doc.body.innerText.slice(0,120) : ''; } catch (e) { txt = 'ERR ' + e.message; }
        return { log, hasSession: !!tab.session, iframeSrc: tab.session ? tab.session.iframe.src : null, title: doc ? doc.title : null, txt, errCard: !!tab.view.querySelector('.proxy-error') };
    }""", [WISP])
    print(json.dumps(out, indent=1)[:2500])
    print("--- console tail ---")
    for l in logs[-22:]:
        print(" ", l)
    b.close()
