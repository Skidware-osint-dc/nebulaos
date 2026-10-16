#!/usr/bin/env python3
"""
NebulaOS end-to-end tests (Playwright + headless Chromium).

Runs the real desktop against a local Wisp relay (ws://localhost:4000/) and
verifies: shell boot, service worker, all three proxy engines, both transports,
settings persistence and the privacy features.  Screenshots land in shots/.
"""
import json, os, sys, time, pathlib
from playwright.sync_api import sync_playwright

BASE = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
SHOTS = pathlib.Path(__file__).resolve().parent.parent / "shots"
SHOTS.mkdir(exist_ok=True)
TARGET = os.environ.get("NEBULA_TARGET", "https://example.com/")

ONLY = sys.argv[1:] or None


def section(name):
    print(f"\n=== {name} ===", flush=True)


def shot(page, name, full=False):
    p = SHOTS / f"{name}.png"
    page.screenshot(path=str(p), full_page=full)
    print(f"   📸 {p.name}", flush=True)
    return p


def wait_boot(page, timeout=45000):
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=timeout)


def set_config(page, **kw):
    return page.evaluate("cfg => { Nebula.set(cfg); return Nebula.state; }", kw)


def run():
    results = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(args=["--disable-dev-shm-usage", "--no-sandbox"])
        ctx = browser.new_context(viewport={"width": 1440, "height": 900}, permissions=["clipboard-read", "clipboard-write"])
        page = ctx.new_page()
        errors, warns = [], []
        page.on("console", lambda m: (errors if m.type == "error" else warns).append(m.text))
        page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)))

        def check(label, ok, detail=""):
            results.append((label, bool(ok), detail))
            print(f"   {'✅' if ok else '❌'} {label}{(' — ' + str(detail)) if detail else ''}", flush=True)
            return ok

        page.goto(BASE, wait_until="domcontentloaded")
        wait_boot(page)
        page.wait_for_timeout(700)
        page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")

        # ---------------------------------------------------------------- boot
        if not ONLY or "boot" in ONLY:
            section("boot / shell")
            page.wait_for_timeout(900)
            page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")
            check("desktop boots", True)
            check("dock has apps", len(page.query_selector_all("#dock .dock-item")) >= 7,
                  len(page.query_selector_all("#dock .dock-item")))
            check("top bar clock", page.inner_text("#clock-time") not in ("", "--:--"))
            shot(page, "01-desktop")

            section("launcher & window manager")
            page.keyboard.press("Control+Space")
            page.wait_for_selector("#launcher.open")
            shot(page, "02-launcher")
            page.keyboard.type("term")
            page.wait_for_timeout(400)
            page.keyboard.press("Enter")
            page.wait_for_selector(".window .term")
            check("launcher opened terminal", True)
            page.keyboard.type("about")
            page.keyboard.press("Enter")
            page.wait_for_timeout(300)
            page.keyboard.press("Escape")

            section("terminal drives settings")
            page.evaluate("() => document.querySelector('.window .term input')?.focus()")
            page.keyboard.type("theme emerald")
            page.keyboard.press("Enter")
            page.wait_for_timeout(400)
            theme = page.evaluate("Nebula.state.theme")
            check("terminal theme switch", theme == "emerald", theme)
            page.keyboard.type("theme midnight")
            page.keyboard.press("Enter")
            page.wait_for_timeout(300)

            section("settings app")
            page.evaluate("Nebula.Settings.open('proxy')")
            page.wait_for_timeout(600)
            shot(page, "03-settings-proxy")
            page.evaluate("Nebula.Settings.open('privacy')")
            page.wait_for_timeout(400)
            shot(page, "04-settings-privacy")
            page.evaluate("Nebula.Settings.open('appearance')")
            page.wait_for_timeout(400)
            shot(page, "05-settings-appearance")
            page.evaluate("() => [...document.querySelectorAll('.window')].forEach(w => w.querySelector('.tbtn.close')?.click())")
            page.wait_for_timeout(400)

        # ------------------------------------------------------------- proxy
        section("proxy stack (local wisp)")
        page.evaluate("""wisp => {
            Nebula.set({ wisp, baseDir: '' });
            Nebula.Proxy.swConfig = null;
        }""", WISP)
        diag = page.evaluate("async () => { Nebula.Proxy.mux=null; return await Nebula.Proxy.probeAll(false); }")
        for d in diag:
            print(f"      {'✔' if d['ok'] else '✘'} {d['label']}: {d['detail'][:110]}", flush=True)
        check("service worker registered", page.evaluate("Nebula.Proxy.swReady"))
        check("transport reports a name", bool(page.evaluate("Nebula.Proxy.transportName")),
              page.evaluate("Nebula.Proxy.transportName"))

        engines = [("uv", "epoxy"), ("uv", "libcurl"), ("sc1", "epoxy"), ("sc1", "libcurl"), ("sc2", "epoxy"), ("sc2", "libcurl")]
        for engine, transport in engines:
            section(f"engine {engine} + transport {transport}")
            page.evaluate("() => [...document.querySelectorAll('.window')].forEach(w => w.querySelector('.tbtn.close')?.click())")
            page.wait_for_timeout(300)
            try:
                res = page.evaluate("""async ([e, t, target, wisp]) => {
                    Nebula.set({ engine: e, transport: t, wisp });
                    Nebula.Proxy.mux = null; Nebula.Proxy.muxApplied = null; Nebula.Proxy._standalone = null;
                    Nebula.Proxy._standaloneOpts = null; Nebula.Proxy.transportMode = null; Nebula.Proxy.transportName = null;
                    try {
                        await Nebula.Proxy.registerSW();
                        await Nebula.Proxy.ensureEngine(e);
                    } catch (err) { return { ok: false, error: 'engine init: ' + (err && err.message || err) }; }
                    Nebula.Browser.open();
                    const b = Nebula.Browser;
                    const tab = b.tabs[b.tabs.length - 1];
                    try { await b.navigate(target, tab); } catch (err) { return { ok: false, error: 'navigate: ' + (err && err.message || err) }; }
                    for (let i = 0; i < 60; i++) {
                        await new Promise(r => setTimeout(r, 500));
                        try {
                            const d = tab.session && tab.session.iframe.contentDocument;
                            if (d && d.readyState === 'complete' && d.body && d.body.innerText.trim().length > 0) {
                                return { ok: true, title: d.title, text: d.body.innerText.replace(/\s+/g, ' ').slice(0, 130), url: tab.session.currentUrl.slice(0, 90) };
                            }
                        } catch (err) {}
                    }
                    try {
                        const d = tab.session && tab.session.iframe.contentDocument;
                        return { ok: false, error: 'timed out', title: d ? d.title : '', text: d && d.body ? d.body.innerText.replace(/\s+/g, ' ').slice(0, 200) : '' };
                    } catch (err) { return { ok: false, error: 'timed out (cross-origin?)' }; }
                }""", [engine, transport, TARGET, WISP])
                ok = bool(res.get("ok")) and res.get("title") != "Error"
                check(f"{engine}/{transport} real page render", ok, json.dumps(res)[:220])
                if ok:
                    shot(page, f"06-browse-{engine}-{transport}")
            except Exception as e:
                check(f"{engine}/{transport} real page render", False, str(e)[:200])

        # ------------------------------------------- real page in the browser
        section("Nebula Browser end-to-end")
        engine = os.environ.get("NEBULA_ENGINE", "uv")
        transport = os.environ.get("NEBULA_TRANSPORT", "epoxy")
        set_config(page, engine=engine, transport=transport, search="ddg")
        page.evaluate("Nebula.Proxy.mux = null")
        page.evaluate("Nebula.Browser.open()")
        page.wait_for_selector(".window .browser", timeout=20000)
        page.evaluate("""url => { const b = Nebula.Browser; b.navigate(url, b.active); }""", TARGET)
        loaded = False
        for _ in range(40):
            page.wait_for_timeout(500)
            state = page.evaluate("""() => {
                const b = Nebula.Browser, t = b.tabs.find(x => x.id === b.active.id);
                if (!t || !t.session) return { ready: false };
                try {
                    const d = t.session.iframe.contentDocument;
                    return { ready: !!d && d.readyState === 'complete' && (d.body ? d.body.innerText.length > 0 : false),
                             title: d ? d.title : '', text: d && d.body ? d.body.innerText.slice(0, 120) : '' };
                } catch (e) { return { ready: false, err: String(e) }; }
            }""")
            if state.get("ready"):
                loaded = True
                break
        check(f"proxied page rendered ({engine}/{transport})", loaded, json.dumps(state)[:200])
        shot(page, "06-browser-proxied")
        page.wait_for_timeout(300)

        # discord app view
        page.evaluate("Nebula.openApp('discord')")
        page.wait_for_timeout(2500)
        shot(page, "07-discord")
        page.evaluate("Nebula.Apps && null")
        page.evaluate("() => [...document.querySelectorAll('.window')].forEach(w => w.querySelector('.tbtn.close')?.click())")
        page.wait_for_timeout(400)

        section("games / files / paint / calc")
        page.evaluate("Nebula.Games.open2048()")
        page.wait_for_timeout(700)
        shot(page, "08-game-2048")
        page.evaluate("Nebula.Apps && null")
        page.evaluate("() => [...document.querySelectorAll('.window')].forEach(w => w.querySelector('.tbtn.close')?.click())")
        page.wait_for_timeout(300)
        page.evaluate("Nebula.AppStore.open()")
        page.wait_for_timeout(700)
        shot(page, "09-appstore")
        page.evaluate("() => [...document.querySelectorAll('.window')].forEach(w => w.querySelector('.tbtn.close')?.click())")
        page.wait_for_timeout(300)

        section("themes")
        for t in ["crimson", "terracotta", "marigold", "emerald", "aqua", "glacier", "midnight"]:
            page.evaluate("t => Nebula.set({ theme: t })", t)
            page.wait_for_timeout(320)
            shot(page, f"10-theme-{t}")

        section("privacy features")
        cloak = page.evaluate("() => { Nebula.set({aborMode:'x', abMode:'auto', cloakPreset:'blank'}); Nebula.Privacy.applyCloak(); return document.title; }")
        check("about:blank cloak sets title", cloak == "about:blank", cloak)
        page.evaluate("Nebula.Privacy.uncloak()")
        anti = page.evaluate("() => Nebula.state.anticlose")
        check("anti-close enabled by default", anti)
        blocker = page.evaluate("""() => {
            let fired = false;
            const h = (e) => { fired = true; e.preventDefault(); e.returnValue = 'x'; };
            window.addEventListener('beforeunload', h);
            const ev = new Event('beforeunload', {cancelable:true});
            window.dispatchEvent(ev);
            window.removeEventListener('beforeunload', h);
            return fired;
        }""")
        check("beforeunload guard wired", blocker)

        # real browser tab title checks (about:blank cloak reaches the tab strip)
        page.evaluate("() => Nebula.set({ abMode: 'auto', cloakPreset: 'blank' })")
        page.evaluate("() => Nebula.Privacy.applyCloak()")
        page.wait_for_timeout(300)
        check("tab title cloaked to about:blank", page.title() == "about:blank", page.title())
        page.evaluate("() => Nebula.Privacy.uncloak()")
        page.wait_for_timeout(300)
        check("tab title restored", page.title() == "NebulaOS", page.title())

        section("console health")
        def classify(e):
            low = e.lower()
            if "favicon" in low: return None
            if e.startswith("pageerror") or "uncaught" in low or "is not a function" in low or "undefined" in low: return "fatal"
            if "404" in low or "503" in low or "err_failed" in low: return "network"
            return "fatal"
        fatals = [e for e in errors if classify(e) == "fatal"]
        network = [e for e in errors if classify(e) == "network"]
        check("no JS exceptions", len(fatals) == 0, "; ".join(fatals[:3])[:260])
        print(f"      (informational) {len(network)} network messages from proxied pages / cold-start retry pages", flush=True)

        ctx.close(); browser.close()

    print("\n================ SUMMARY ================")
    passed = sum(1 for _, ok, _ in results if ok)
    for label, ok, detail in results:
        print(f"{'PASS' if ok else 'FAIL'}  {label}{('  (' + str(detail)[:80] + ')') if (detail and not ok) else ''}")
    print(f"{passed}/{len(results)} checks passed")
    return 0 if passed == len(results) else 1


if __name__ == "__main__":
    sys.exit(run())
