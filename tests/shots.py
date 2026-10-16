#!/usr/bin/env python3
"""Capture the presentation screenshots for README / review."""
import os, pathlib
from playwright.sync_api import sync_playwright
BASE = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
SHOTS = pathlib.Path(__file__).resolve().parent.parent / "shots"; SHOTS.mkdir(exist_ok=True)

def snap(page, name):
    page.screenshot(path=str(SHOTS / f"{name}.png"))
    print("  ", name, flush=True)

def close_all(page):
    page.evaluate("() => [...document.querySelectorAll('.window')].forEach(w => w.querySelector('.tbtn.close')?.click())")
    page.wait_for_timeout(400)

with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1600, "height": 1000}, device_scale_factor=1).new_page()
    page.goto(BASE, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    page.wait_for_timeout(800)
    page.evaluate("""wisp => { Nebula.set({ wisp }); Nebula.Proxy.mux = null; Nebula.Proxy.muxApplied = null; }""", WISP)
    page.evaluate("async () => { await Nebula.Proxy.registerSW(); await Nebula.Proxy.ensureMux(); }")
    page.wait_for_timeout(600)
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")
    snap(page, "01-desktop")

    # launcher
    page.keyboard.press("Control+Space"); page.wait_for_timeout(600); snap(page, "02-app-grid")
    page.keyboard.type("proxy"); page.wait_for_timeout(500); snap(page, "03-launcher-search")
    page.keyboard.press("Escape"); page.wait_for_timeout(300)

    # browser start page (SC2 + libcurl, real page)
    page.evaluate("""async () => {
        Nebula.set({ engine: 'sc2', transport: 'libcurl' });
        Nebula.Proxy.mux = null; Nebula.Proxy.muxApplied = null; Nebula.Proxy._standalone = null; Nebula.Proxy._standaloneOpts = null;
        await Nebula.Proxy.registerSW(); await Nebula.Proxy.ensureEngine('sc2');
        Nebula.Browser.open();
    }""")
    page.wait_for_timeout(2500); snap(page, "04-browser-startpage")
    page.evaluate("""async () => {
        const b = Nebula.Browser, tab = b.tabs[b.tabs.length - 1];
        await b.navigate('https://example.com/', tab);
        await new Promise(r => setTimeout(r, 5000));
        await b.newTab('https://en.wikipedia.org/wiki/Operating_system');
        await new Promise(r => setTimeout(r, 6000));
    }""")
    page.wait_for_timeout(1500); snap(page, "05-browser-proxied")
    close_all(page)

    # discord (wait until the login page really renders)
    page.evaluate("""async () => {
        Nebula.set({ engine: 'sc2', transport: 'libcurl' });
        Nebula.Proxy.mux = null; Nebula.Proxy.muxApplied = null; Nebula.Proxy._standalone = null; Nebula.Proxy._standaloneOpts = null;
        await Nebula.Proxy.registerSW(); await Nebula.Proxy.ensureEngine('sc2');
        Nebula.openApp('discord');
    }""")
    for _ in range(40):
        page.wait_for_timeout(1500)
        if page.evaluate("""() => { const s = Nebula.Discord && Nebula.Discord.session; if (!s) return false;
            try { const d = s.iframe.contentDocument; return !!d && d.body && d.body.innerText.trim().length > 60; } catch (e) { return false; } }"""):
            break
    page.wait_for_timeout(1200); snap(page, "06-discord")
    close_all(page)

    # games
    page.evaluate("Nebula.Games.open2048()"); page.wait_for_timeout(600)
    page.evaluate("Nebula.Games.openSnake()"); page.wait_for_timeout(900); snap(page, "07-games")
    close_all(page)

    # files + terminal + paint
    page.evaluate("Nebula.Files.open('/')"); page.wait_for_timeout(700)
    page.evaluate("Nebula.openApp('terminal')"); page.wait_for_timeout(900); snap(page, "08-files-terminal")
    close_all(page)
    page.evaluate("Nebula.openApp('paint')"); page.wait_for_timeout(600)
    page.evaluate("""() => {
        const win = Nebula.focusWin(); const c = win.content.querySelector('canvas'); const ctx = c.getContext('2d');
        ctx.strokeStyle = '#6c8cff'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(120, 300); ctx.bezierCurveTo(260, 90, 520, 460, 690, 170); ctx.stroke();
        ctx.strokeStyle = '#e0455f'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(400, 240, 96, 0, 6.2); ctx.stroke();
    }""")
    page.wait_for_timeout(400); snap(page, "09-paint")
    close_all(page)

    # settings panes
    for pane in ["proxy", "appearance", "privacy", "search", "system"]:
        page.evaluate("p => Nebula.Settings.open(p)", pane); page.wait_for_timeout(700)
        snap(page, f"10-settings-{pane}")
        page.evaluate("() => Nebula.Settings.win && Nebula.Settings.win.close()")
        page.wait_for_timeout(400)

    # app store + import dialog
    page.evaluate("Nebula.AppStore.open()"); page.wait_for_timeout(700); snap(page, "11-app-store")
    close_all(page)
    page.evaluate("() => { Nebula.Proxy.probeAll(true); }"); page.wait_for_timeout(2000); snap(page, "12-diagnostics")
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")

    # themes
    for t in ["crimson","terracotta","marigold","emerald","aqua","glacier","midnight","graphite"]:
        page.evaluate("t => Nebula.set({ theme: t })", t); page.wait_for_timeout(350)
        snap(page, f"20-theme-{t}")
    page.evaluate("() => Nebula.set({ theme: 'midnight' })")

    # wallpapers
    for w in ["aurora","glacier","gradient"]:
        page.evaluate("w => Nebula.set({ wallpaper: w })", w); page.wait_for_timeout(500)
        snap(page, f"21-wall-{w}")
    # bottom dock
    page.evaluate("() => Nebula.set({ dockPos: 'bottom', wallpaper: 'aurora' })"); page.wait_for_timeout(600)
    snap(page, "22-dock-bottom")
    page.evaluate("() => Nebula.set({ dockPos: 'left', wallpaper: 'gradient' })")

    # power menu / cloak / lock screen
    page.evaluate("""() => { const b = document.querySelector('#btn-power'); const r = b.getBoundingClientRect(); b.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.x + 4, clientY: r.y + 4 })); }""")
    page.wait_for_timeout(500); snap(page, "23-power-menu")
    page.keyboard.press("Escape")
    b.close()
print("done")
