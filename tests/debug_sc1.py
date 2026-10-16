#!/usr/bin/env python3
"""Why doesn't the Scramjet 1 service worker keep its config?"""
import json, os
from playwright.sync_api import sync_playwright
BASE = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1200, "height": 800}).new_page()
    logs = []
    page.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"[:200]))
    page.on("pageerror", lambda e: logs.append("PAGEERROR " + str(e)[:200]))
    page.goto(BASE, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    a = page.evaluate("""async ([wisp]) => {
        Nebula.set({ wisp, engine: 'sc1', transport: 'libcurl' });
        await Nebula.Proxy.registerSW();
        await Nebula.Proxy.ensureEngine('sc1');
        const ask = (msg) => new Promise((resolve) => {
            const ch = new MessageChannel();
            ch.port1.onmessage = (e) => resolve(e.data);
            navigator.serviceWorker.controller.postMessage(msg, [ch.port2]);
            setTimeout(() => resolve({ timeout: true }), 6000);
        });
        const before = await ask({ nebula: 'diag' });
        // read the IndexedDB the way Scramjet does
        const idbDump = await new Promise((resolve) => {
            const req = indexedDB.open('$scramjet', 1);
            req.onsuccess = () => {
                const db = req.result;
                const stores = [...db.objectStoreNames];
                const tx = db.transaction(stores, 'readonly');
                const out = {};
                let pending = stores.length;
                stores.forEach((s) => {
                    const r = tx.objectStore(s).getAllKeys();
                    r.onsuccess = () => { out[s] = r.result.map(k => typeof k === 'string' ? k : (k && k.constructor && k.constructor.name) + '/' + JSON.stringify(k).slice(0, 60)); if (!--pending) { db.close(); resolve(out); } };
                    r.onerror = () => { out[s] = 'ERR'; if (!--pending) { db.close(); resolve(out); } };
                });
                if (!stores.length) resolve(out);
            };
            req.onerror = () => resolve({ open: 'failed' });
            req.onblocked = () => resolve({ open: 'blocked' });
        });
        // read the actual stored config value
        const cfgStored = await new Promise((resolve) => {
            const req = indexedDB.open('$scramjet', 1);
            req.onsuccess = () => {
                const db = req.result;
                try {
                    const tx = db.transaction('config', 'readonly');
                    const r = tx.objectStore('config').get('config');
                    r.onsuccess = () => { db.close(); const v = r.result; resolve(v ? { type: typeof v, prefix: v.prefix, files: v.files, keys: Object.keys(v).slice(0,14) } : null); };
                    r.onerror = () => { db.close(); resolve('get error'); };
                } catch (e) { db.close(); resolve('throw: ' + e.message); }
            };
            req.onerror = () => resolve('open failed');
        });
        // push the config to the SW by hand and see if it sticks
        const c = Nebula.Proxy.sc1Controller;
        const after = await new Promise((resolve) => {
            const ch = new MessageChannel();
            ch.port1.onmessage = (e) => resolve(e.data);
            navigator.serviceWorker.controller.postMessage({ nebula: 'route', engine: 'sc1' }, [ch.port2]);
            setTimeout(() => resolve({ timeout: true }), 6000);
        });
        return { before, idbDump, cfgStored, after, prefix: c && c.encodeUrl('https://example.com/'), ctrl: !!navigator.serviceWorker.controller };
    }""", [WISP])
    print(json.dumps(a, indent=1)[:3000])
    print("--- console ---")
    for l in logs[-18:]:
        print(" ", l)
    b.close()
