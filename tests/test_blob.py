#!/usr/bin/env python3
"""Blob mode: relocate to blob:, keep the desktop usable, allow returning."""
import json, os
from playwright.sync_api import sync_playwright
URL = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1280, "height": 800}).new_page()
    logs = []
    page.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"[:150]))
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")

    page.evaluate("() => { Nebula.Privacy.toBlob(); }")
    page.wait_for_selector(".dialog .btn.primary", timeout=5000)
    page.click(".dialog .btn.primary")
    page.wait_for_timeout(4000)
    on_blob = page.url.startswith("blob:")
    print("converted to blob:", on_blob, "|", page.url[:64])

    res = page.evaluate("""async () => {
        const out = { dock: document.querySelectorAll('#dock .dock-item').length,
                      badge: document.querySelector('#badge-proxy-text').textContent,
                      exitBtn: !!document.querySelector('#btn-blob-exit'),
                      baseDir: Nebula.Proxy.baseDir(), savedReturn: !!localStorage.getItem('nebula.blobReturn') };
        try { await Nebula.Proxy.registerSW(); out.swError = 'registered (unexpected)'; }
        catch (e) { out.swError = e.message.slice(0, 90); }
        Nebula.Games.openTTT();                       // offline app still works
        await new Promise(r => setTimeout(r, 500));
        out.windowOpened = document.querySelectorAll('.window').length;
        return out;
    }""")
    print(json.dumps(res, indent=1))
    page.screenshot(path="shots/32-blob-mode.png")

    # return to the normal page
    page.evaluate("() => Nebula.Privacy.exitBlob()")
    page.wait_for_timeout(3500)
    print("after exit:", page.url[:64], "| back on http:", page.url.startswith("http"))
    back = page.evaluate("() => ({ sw: Nebula.Proxy.swReady, badge: document.querySelector('#badge-proxy-text').textContent })")
    print(json.dumps(back))
    print("console errors:", [l for l in logs if "error" in l.lower() and "favicon" not in l][:3])
    b.close()
