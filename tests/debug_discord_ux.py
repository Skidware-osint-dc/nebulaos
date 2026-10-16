#!/usr/bin/env python3
import json, os
from playwright.sync_api import sync_playwright
URL = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1440, "height": 900}).new_page()
    logs = []
    page.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"[:180]))
    page.on("pageerror", lambda e: logs.append("PAGEERROR " + str(e)[:200]))
    page.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"[:600]) if "Discord session failed" in m.text or m.type == "error" else None)
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")
    print(page.evaluate("""async (wisp) => {
        Nebula.set({ engine: 'sc2', transport: 'libcurl', wisp });
        await Nebula.Proxy.registerSW();
        const w = Nebula.openApp('discord');
        await new Promise(r => setTimeout(r, 6000));
        const win = [...document.querySelectorAll('.window')].find(x => x.getAttribute('aria-label') === 'Discord');
        return { why: (win ? win.querySelector(".dc-diag .muted").innerText : ""), opened: !!w, winFound: !!win, dcid: !!Nebula.Discord,
                 viewHTML: win ? win.querySelector('.dc-view').innerHTML.slice(0, 260) : null,
                 hasSession: !!(Nebula.Discord && Nebula.Discord.session),
                 iframeSrc: (Nebula.Discord && Nebula.Discord.session) ? Nebula.Discord.session.iframe.src.slice(0, 110) : null,
                 bodyLen: (() => { try { const d = Nebula.Discord.session.iframe.contentDocument; return d.body ? d.body.innerText.length : -1; } catch (e) { return 'err ' + e.message; } })(),
                 title2: (() => { try { return Nebula.Discord.session.iframe.contentDocument.title; } catch (e) { return null; } })() };
    }""", WISP))
    print("--- console ---")
    for l in logs[-14:]:
        print("  ", l)
    b.close()
