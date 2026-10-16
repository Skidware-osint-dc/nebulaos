#!/usr/bin/env python3
"""Debug the launcher -> terminal flow and window layout."""
import json, os, pathlib
from playwright.sync_api import sync_playwright

BASE = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
SHOTS = pathlib.Path(__file__).resolve().parent.parent / "shots"

with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1440, "height": 900}).new_page()
    logs = []
    page.on("console", lambda m: logs.append(f"{m.type}: {m.text}"))
    page.on("pageerror", lambda e: logs.append("pageerror: " + str(e)))
    page.goto(BASE, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)

    print("dialog present:", page.evaluate("() => document.querySelectorAll('.dialog-wrap').length"))
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")

    page.keyboard.press("Control+Space")
    page.wait_for_selector("#launcher.open", timeout=5000)
    print("launcher open:", page.evaluate("() => !!document.querySelector('#launcher.open')"))
    page.keyboard.type("term")
    page.wait_for_timeout(400)
    print("results:", page.evaluate("() => [...document.querySelectorAll('#launcher-body .lresult, #launcher-body .app-tile')].map(e => e.textContent.slice(0,40))"))
    page.keyboard.press("Enter")
    page.wait_for_timeout(800)
    print(json.dumps(page.evaluate("""() => {
        const wins = [...document.querySelectorAll('.window')].map(w => {
            const r = w.getBoundingClientRect();
            const inputs = [...w.querySelectorAll('input')].map(i => { const ir = i.getBoundingClientRect(); return { r: [ir.x|0, ir.y|0, ir.width|0, ir.height|0] }; });
            const term = w.querySelector('.term');
            const line = w.querySelector('.term-line-in');
            return { id: w.id, label: w.getAttribute('aria-label'), rect: [r.x|0, r.y|0, r.width|0, r.height|0],
                     inputs, contentRect: w.querySelector('.wcontent')?.getBoundingClientRect().toJSON(),
                     termRect: term?.getBoundingClientRect().toJSON(), lineRect: line?.getBoundingClientRect().toJSON(),
                     outRect: w.querySelector('.term-out')?.getBoundingClientRect().toJSON() };
        });
        return { count: wins.length, wins };
    }"""), indent=1))
    page.screenshot(path=str(SHOTS / "debug-terminal.png"))
    print("--- console ---")
    for l in logs[-12:]:
        print(" ", l[:200])
    b.close()
