#!/usr/bin/env python3
"""Raw transport-level view of discord.com (is it blocking or just heavy?)"""
import json, os, time
from playwright.sync_api import sync_playwright
URL = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1200, "height": 800}).new_page()
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")
    res = page.evaluate("""async ([wisp]) => {
        const out = {};
        for (const [transport, target] of [['libcurl','https://discord.com/login'], ['epoxy','https://discord.com/login'],
                                           ['libcurl','https://discord.com/api/v9/experiments'], ['libcurl','https://example.com/']]) {
            try {
                Nebula.set({ transport, wisp });
                Nebula.Proxy._standalone = null; Nebula.Proxy._standaloneOpts = null;
                const t = await Nebula.Proxy.makeStandaloneTransport();
                if (!t.ready) await t.init();
                const t0 = performance.now();
                const r = await t.request(new URL(target), 'GET', null, [['user-agent', navigator.userAgent]], undefined);
                let body = r.body;
                let text = '';
                try {
                    if (body instanceof ReadableStream) { const b2 = await new Response(body).text(); text = b2.slice(0, 200); }
                    else if (body instanceof ArrayBuffer) text = new TextDecoder().decode(body.slice(0, 300));
                    else if (typeof body === 'string') text = body.slice(0, 300);
                } catch (e) { text = 'body read error: ' + e.message; }
                out[transport + ' ' + target] = { status: r.status, ms: Math.round(performance.now() - t0),
                    headers: (r.headers || []).slice(0, 6), bodyStart: text.replace(/\\s+/g, ' ').slice(0, 190) };
            } catch (err) { out[transport + ' ' + target] = { error: String(err && err.message || err).slice(0, 200) }; }
        }
        return out;
    }""", [WISP])
    print(json.dumps(res, indent=1)[:3000])
    b.close()
