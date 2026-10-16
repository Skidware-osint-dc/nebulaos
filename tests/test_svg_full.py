#!/usr/bin/env python3
"""
NebulaOS — "is the entire website really inside the SVG?" proof.

Two independent checks:

  A. Byte level (no browser): the base64 payload inside bundle/NebulaOS.svg is
     decoded and compared with bundle/NebulaOS.html. They must be identical, so
     the SVG provably contains the whole desktop: markup, CSS, JS, wallpapers,
     the bundled apps — everything.

  B. Runtime: the SVG is opened as a real document in a browser, boots the
     desktop inside its foreignObject iframe, registers its service worker,
     runs a bundled app and renders a real proxied page.

Run:  PLAYWRIGHT_BROWSERS_PATH=/home/user/.cache/ms-playwright python3 tests/test_svg_full.py
"""
import base64, hashlib, os, pathlib, re, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
SVG = ROOT / "bundle" / "NebulaOS.svg"
HTML = ROOT / "bundle" / "NebulaOS.html"
URL = os.environ.get("NEBULA_SVG", "http://localhost:8000/NebulaOS.svg")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
SHOTS = ROOT / "shots"
results = []


def check(label, ok, detail=""):
    results.append((label, bool(ok)))
    print(f"   {'✅' if ok else '❌'} {label}{(' — ' + str(detail)) if detail else ''}", flush=True)


def main():
    print("=== A. byte level: does the SVG contain the whole site? ===")
    svg = SVG.read_text()
    html = HTML.read_text()
    payload = re.search(r'const encoded = "([A-Za-z0-9+/=]+)"', svg)
    check("SVG has a packed payload", bool(payload))
    if payload:
        decoded = base64.b64decode(payload.group(1)).decode("utf-8")
        check("decoded payload is byte-identical to NebulaOS.html",
              hashlib.sha256(decoded.encode()).hexdigest() == hashlib.sha256(html.encode()).hexdigest(),
              f"{len(decoded)/1024:.0f} KB vs {len(html)/1024:.0f} KB · sha256 {hashlib.sha256(decoded.encode()).hexdigest()[:12]}")
        for label, needle in (
            ("desktop markup (wallpaper, dock, launcher)", "id=\"dock\""),
            ("design system CSS", "--glass-line"),
            ("shell JavaScript", "Nebula.boot"),
            ("bundled app names in the manifest", "System Monitor"),
            ("wallpaper data URI", "data:image/jpeg;base64"),
            ("window manager", "class Win"),
            ("proxy stack", "bare-mux"),
        ):
            check(f"payload contains {label}", needle in decoded)
    # bundled apps are base64 payloads inside the packed HTML — decode and verify
    import json
    m = re.search(r"window\.NEBULA_EMBEDDED = (\{.*?\});", html, re.S)
    embedded = json.loads(m.group(1)) if m else {}
    decoded_apps = {k: base64.b64decode(v).decode("utf-8", "replace") for k, v in embedded.items()}
    check("the packed SVGs payload carries the bundled game source",
          any("nebula.mines.best" in v for v in decoded_apps.values()),
          f"{len(embedded)} embedded apps: {', '.join(k.replace('bundled-','') for k in embedded)}")
    check("the packed SVG payload carries the bundled app source",
          any("NebulaOS session" in v for v in decoded_apps.values()))

    check("SVG is self-contained (no external script/stylesheet tags)",
          not re.search(r'<(script|link)[^>]+(src|href)=', svg), "only the packed payload + one boot script")

    print("\n=== B. runtime: the SVG booting the whole desktop ===")
    with sync_playwright() as pw:
        browser = pw.chromium.launch(args=["--disable-dev-shm-usage", "--no-sandbox"])
        page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(URL, wait_until="domcontentloaded")
        check("the URL really is an SVG document", page.evaluate("() => document.contentType") == "image/svg+xml",
              page.evaluate("() => document.contentType"))
        check("top level is <svg>", page.evaluate("() => document.documentElement.tagName") == "svg")

        page.wait_for_function('() => document.querySelector("#nebula-frame") && document.querySelector("#nebula-frame").contentWindow.Nebula', timeout=60000)
        frame = None
        for f in page.frames:
            if f == page.main_frame:
                continue
            try:
                if f.evaluate("() => !!window.Nebula"):
                    frame = f
                    break
            except Exception:
                pass
        check("desktop frame found inside <foreignObject>", frame is not None)
        frame.wait_for_function('() => document.querySelector("#splash") === null', timeout=60000)
        frame.evaluate('() => Nebula.set({ wisp: "%s" })' % WISP)
        page.wait_for_timeout(1500)
        frame.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")

        info = frame.evaluate("""() => ({
            title: document.title,
            dock: document.querySelectorAll('#dock .dock-item').length,
            apps: Nebula.Registry.all().length,
            bundled: Nebula.Registry.all().filter(a => a.bundled).map(a => a.name),
            theme: document.body.dataset.theme,
            origin: location.href,
            base: Nebula.Proxy.baseDir(),
        })""")
        check("desktop boots inside the SVG", info["title"] == "NebulaOS" and info["dock"] >= 7, f"{info['dock']} dock items")
        check("bundled apps came along inside the SVG", len(info["bundled"]) >= 2, info["bundled"])
        outer_origin = page.evaluate("() => location.origin")
        ancestor = frame.evaluate("() => (document.location.ancestorOrigins && document.location.ancestorOrigins[0]) || null")
        check("the app keeps the real host origin (so storage/workers behave)",
              ancestor == outer_origin and info["base"] == "/",
              f"frame href {info['origin']} · ancestor {ancestor} · svg origin {outer_origin} · baseDir {info['base']}")

        store = frame.evaluate("""() => { localStorage.setItem('nebula.proof', 'kept'); return localStorage.getItem('nebula.proof'); }""")
        check("localStorage works from the SVG", store == "kept")

        # a bundled app
        frame.evaluate("() => Nebula.Registry.byId('bundled-game-minesweeper').run()")
        page.wait_for_timeout(1800)
        cells = 0
        for f in page.frames:
            try:
                cells = max(cells, f.evaluate("() => document.querySelectorAll('#board .c').length"))
            except Exception:
                pass
        check("bundled game runs inside the SVG", cells >= 40, f"{cells} cells")
        page.screenshot(path=str(SHOTS / "42-svg-bundled-app.png"))

        # the proxy, from the SVG
        frame.evaluate("() => document.querySelectorAll('.win').forEach(w => w.remove())")
        probe = frame.evaluate("async () => await Nebula.Proxy.probeFetch('https://example.com/')")
        check("service worker + transport work from the SVG",
              bool(probe and probe.get("ok")), probe and f"{probe.get('status')} via {probe.get('via')} in {probe.get('ms')} ms")
        frame.evaluate("() => Nebula.Browser.open({ url: 'https://example.com/' })")
        title = ""
        for _ in range(40):
            page.wait_for_timeout(700)
            for f in page.frames:
                try:
                    t = f.evaluate("() => document.title")
                except Exception:
                    continue
                if t and "Example Domain" in t:
                    title = t
                    break
            if title:
                break
        check("a real proxied page renders inside the SVG", "Example Domain" in title, title or "timed out")
        page.wait_for_timeout(600)
        page.screenshot(path=str(SHOTS / "43-svg-proxied-page.png"))
        check("no uncaught JS exceptions", not [e for e in errors if e.strip()], errors[:2])
        browser.close()

    # ------------------------------------------------ C. cross-browser matrix
    print("\n=== C. browser matrix (Chromium + Firefox) ===")
    print("   Firefox is expected to proxy through the HTML build but NOT through the")
    print("   packed SVG — an about:srcdoc frame under an SVG parent never gets a")
    print("   controlling service worker there. The app must detect that and say so.\n", flush=True)
    for browser_name, target, expect_proxy in (
        ("chromium", "NebulaOS.svg", True),
        ("chromium", "NebulaOS.html", True),
        ("firefox", "NebulaOS.html", True),
        ("firefox", "NebulaOS.svg", False),
    ):
        with sync_playwright() as pw:
            browser = getattr(pw, browser_name).launch()
            ctx = browser.new_context(viewport={"width": 1440, "height": 900})
            page = ctx.new_page()
            errs = []
            page.on("pageerror", lambda e: errs.append(str(e)))
            page.goto(f"http://localhost:8000/{target}", wait_until="domcontentloaded")
            page.wait_for_function('() => { const f=document.querySelector("#nebula-frame"); return !!(f ? f.contentWindow.Nebula : window.Nebula); }', timeout=90000)
            frame = ([f for f in page.frames if f != page.main_frame][0] if target.endswith(".svg") else page.main_frame)
            frame.wait_for_function('() => document.querySelector("#splash") === null', timeout=90000)
            frame.evaluate('() => Nebula.set({ wisp: "%s" })' % WISP)
            if expect_proxy:
                frame.wait_for_function("() => Nebula.Proxy.swReady === true", timeout=90000)
            else:
                frame.wait_for_function("() => !!Nebula.Proxy.blockedHelp() || Nebula.Proxy.swReady === true", timeout=60000)
            page.wait_for_timeout(1500)
            state = frame.evaluate("""() => ({
                dock: document.querySelectorAll('#dock .dock-item').length,
                bundled: Nebula.Registry.all().filter(a => a.bundled).length,
                badge: document.querySelector('#badge-proxy-text').textContent,
                blocked: Nebula.Proxy.blockedHelp(),
            })""")
            label = f"{browser_name} + {target}"
            check(f"{label}: desktop boots with bundled apps", state["dock"] >= 7 and state["bundled"] >= 2,
                  f"dock {state['dock']}, {state['bundled']} bundled")
            if expect_proxy:
                probe_res = frame.evaluate("async () => await Nebula.Proxy.probeFetch('https://example.com/')")
                check(f"{label}: proxy works", bool(probe_res and probe_res.get("ok")),
                      probe_res and f"{probe_res.get('status')} via {probe_res.get('via')} in {probe_res.get('ms')} ms · badge {state['badge']!r}")
            else:
                check(f"{label}: proxy is reported unavailable (browser limit, not a crash)",
                      state["blocked"] is not None and "Firefox" in (state["blocked"] or {}).get("reason", ""),
                      (state["blocked"] or {}).get("reason", "")[:70])
                check(f"{label}: app points at the HTML build to fix it",
                      (state["blocked"] or {}).get("recover", "").endswith("index.html"),
                      (state["blocked"] or {}).get("recover"))
                if browser_name == "firefox":
                    page.screenshot(path=str(SHOTS / "45-svg-firefox.png"))
            check(f"{label}: no uncaught JS exceptions", not [e for e in errs if e.strip()], errs[:1])
            browser.close()

    passed = sum(1 for _, ok in results if ok)
    print(f"\n{'='*56}\nentire site inside the SVG: {passed}/{len(results)} passed\n{'='*56}")
    return 0 if passed == len(results) else 1


if __name__ == "__main__":
    sys.exit(main())
