#!/usr/bin/env python3
"""Discord app: the login page must actually render through the proxy."""
import os, pathlib
from playwright.sync_api import sync_playwright
URL = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
SHOTS = pathlib.Path("shots")
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")
    page.evaluate("""async (wisp) => {
        Nebula.set({ engine: 'sc2', transport: 'libcurl', wisp });
        await Nebula.Proxy.registerSW();
        Nebula.openApp('discord');
    }""", WISP)
    page.wait_for_timeout(2500)
    page.screenshot(path=str(SHOTS / "33-discord-connecting.png"))
    ok = False
    for i in range(60):
        page.wait_for_timeout(1500)
        st = page.evaluate("""() => {
            const s = Nebula.Discord && Nebula.Discord.session;
            if (!s) return { stage: 'no-session', panel: !!document.querySelector('#dc-try-best') };
            let len = 0, title = '';
            try { const d = s.iframe.contentDocument; len = d?.body?.innerText?.trim().length || 0; title = d?.title || ''; } catch {}
            return { stage: 'loading', len, title, panel: !!document.querySelector('#dc-try-best') };
        }""")
        if st.get("len", 0) > 60:
            ok = True
            print(f"   ✅ Discord rendered: title={st['title']!r} text={st['len']} chars after ~{(i+1)*1.5:.0f}s")
            break
        if st.get("panel"):
            print("   ❌ watchdog showed the troubleshooting panel")
            break
    page.screenshot(path=str(SHOTS / "35-discord-login.png"))
    print("RESULT:", "PASS" if ok else "FAIL")
    b.close()
