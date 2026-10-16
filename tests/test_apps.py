#!/usr/bin/env python3
"""
NebulaOS — drop-in app pipeline tests.

Verifies the whole "bring your own app" path:
  1. apps/ and games/ files are bundled into the build (manifest + payloads)
  2. they register as real launcher entries with the metadata from their
     <meta name="nebula-*"> tags
  3. a bundled game opens in its own window and is actually interactive
  4. a bundled app can talk to the shell (Nebula host API) from inside its frame
  5. importing a file through the App Store file picker works end to end
     (file chooser -> metadata confirmation -> new window -> renders)
  6. imported apps persist across a reload

Run:  PLAYWRIGHT_BROWSERS_PATH=/opt/ms-playwright python3 tests/test_apps.py
"""
import os, pathlib, sys
from playwright.sync_api import sync_playwright

BASE = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
WISP = os.environ.get("NEBULA_WISP", "ws://localhost:4000/")
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = ROOT / "games" / "minesweeper.html"
APP = ROOT / "apps" / "system-monitor.html"
SHOTS = ROOT / "shots"
SHOTS.mkdir(exist_ok=True)

results = []


def check(label, ok, detail=""):
    results.append((label, bool(ok)))
    print(f"   {'✅' if ok else '❌'} {label}{(' — ' + str(detail)) if detail else ''}", flush=True)
    return ok


def section(name):
    print(f"\n=== {name} ===", flush=True)


def wait_boot(page, timeout=45000):
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=timeout)
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(w => w.remove())")


def run():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(args=["--disable-dev-shm-usage", "--no-sandbox"])
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(BASE, wait_until="domcontentloaded")
        wait_boot(page)

        # ---------------------------------------------------------- 1. bundled
        section("bundled apps from apps/ and games/")
        manifest = page.evaluate("() => window.NEBULA_MANIFEST || []")
        check("manifest is present", len(manifest) >= 2, f"{len(manifest)} entries")
        names = {m["name"]: m for m in manifest}
        check("games/minesweeper.html is bundled", "Mines" in names)
        check("apps/system-monitor.html is bundled", "System Monitor" in names)
        mine = names.get("Mines", {})
        check("meta tag nebula-kind=game honoured", mine.get("kind") == "game", mine.get("kind"))
        check("meta tag nebula-icon honoured", mine.get("icon") == "💣", mine.get("icon"))
        check("small files are embedded in the build",
              bool(mine.get("embedded")) and page.evaluate("() => Object.keys(window.NEBULA_EMBEDDED||{}).length") >= 2)

        reg = page.evaluate("() => Nebula.Registry.all().map(a => ({id:a.id,name:a.name,cat:a.category,sub:a.sub,bundled:!!a.bundled}))")
        ids = {r["id"]: r for r in reg}
        check("bundled game registered as an app", "bundled-game-minesweeper" in ids)
        check("bundled game lands in the Games category", ids.get("bundled-game-minesweeper", {}).get("cat") == "Games",
              ids.get("bundled-game-minesweeper", {}).get("cat"))
        check("bundled app registered", "bundled-app-system-monitor" in ids,
              ids.get("bundled-app-system-monitor", {}).get("cat"))

        # ------------------------------------------------- 2. open the game app
        section("open the bundled game in a window")
        page.evaluate("() => Nebula.Registry.byId('bundled-game-minesweeper').run()")
        page.wait_for_timeout(1400)
        win = page.evaluate("""() => {
            const w = [...Nebula.wins.values()].find(w => w.appId === 'bundled-game-minesweeper');
            if (!w) return null;
            const f = w.el.querySelector('iframe');
            return { title: w.title, hasFrame: !!f, srcdoc: !!(f && f.srcdoc && f.srcdoc.length > 1000) };
        }""")
        check("window opened", bool(win), win and win["title"])
        check("app rendered in an iframe", bool(win and win["hasFrame"] and win["srcdoc"]))
        page.wait_for_timeout(500)
        frame = [f for f in page.frames if "srcdoc" in (f.url or "") or f != page.main_frame]
        cells = 0
        for f in page.frames:
            if f == page.main_frame:
                continue
            try:
                cells = f.evaluate("() => document.querySelectorAll('#board .c').length")
            except Exception:
                cells = 0
            if cells:
                frame = f
                break
        check("game board painted inside the frame", cells >= 40, f"{cells} cells")
        # play a real move through the UI and confirm the game state advanced
        if cells:
            before = frame.evaluate("() => ({ ms: document.getElementById('mines').textContent, time: document.getElementById('time').textContent })")
            moves = frame.evaluate("""() => {
                const cs = [...document.querySelectorAll('#board .c')];
                let clicks = 0;
                for (const c of cs.slice(0, 8)) {
                    const r = c.getBoundingClientRect();
                    if (!r.width) continue;
                    c.click(); clicks++;
                    if (document.querySelectorAll('#board .c.open').length) break;
                }
                return clicks;
            }""")
            page.wait_for_timeout(400)
            after = frame.evaluate("() => ({ open: document.querySelectorAll('#board .c.open').length, msg: document.getElementById('msg').textContent })")
            check("clicking a tile reveals it (game is live)", after["open"] >= 1,
                  f"{after['open']} revealed after {moves} click(s) · counter {before['ms']} · msg '{after['msg']}'")
        page.screenshot(path=str(SHOTS / "36-bundled-game.png"))

        # --------------------------------------------- 3. bundled app + host API
        section("bundled app talks to the shell")
        page.evaluate("() => Nebula.Registry.byId('bundled-app-system-monitor').run()")
        page.wait_for_timeout(1800)
        mon = None
        for f in page.frames:
            if f == page.main_frame:
                continue
            try:
                if f.evaluate("() => !!document.getElementById('fps')"):
                    mon = f
                    break
            except Exception:
                pass
        check("System Monitor frame loaded", mon is not None)
        if mon:
            info = mon.evaluate("""() => ({
                host: document.getElementById('host').textContent,
                wins: document.getElementById('win-count').textContent,
                engine: document.getElementById('engine').textContent,
                transport: document.getElementById('transport').textContent,
                fps: document.getElementById('fps').textContent,
                rows: document.querySelectorAll('.w').length,
            })""")
            check("app detected the NebulaOS host", info["host"] == "inside NebulaOS", info["host"])
            check("app sees the open windows", info["rows"] >= 1, f"{info['rows']} listed, count={info['wins']}")
            check("app read the shell engine + transport", info["engine"] not in ("", "—") and info["transport"] not in ("", "—"),
                  f"{info['engine']} / {info['transport']}")
            check("frame-rate graph is running", info["fps"] not in ("--", ""), f"{info['fps']} fps")
        page.screenshot(path=str(SHOTS / "37-bundled-app.png"))

        # ------------------------------------------------ 4. import via picker
        section("import a file through the App Store picker")
        # start from a clean slate so the test is repeatable
        page.evaluate("() => { Nebula.set({ installedApps: [] }); Nebula.Registry.apps = Nebula.Registry.apps.filter(a => !a.imported); }")
        page.evaluate("() => Nebula.AppStore.open('All')")
        page.wait_for_timeout(600)
        # the real path: App Store header button -> dialog -> Choose file… -> OS picker
        page.evaluate("() => { const b = document.querySelector('.hub-head button'); if (b) b.click(); }")
        page.wait_for_timeout(700)
        with page.expect_file_chooser() as fc:
            page.evaluate("""() => {
                const b = [...document.querySelectorAll('.dialog-wrap button')].find(b => /Choose file/.test(b.textContent));
                if (!b) throw new Error('no Choose file… button');
                b.click();
            }""")
        chooser = fc.value
        chooser.set_files(str(GAME))
        page.wait_for_timeout(900)
        dlg = page.query_selector(".dialog-wrap")
        dlg_text = page.inner_text(".dialog-wrap") if dlg else ""
        check("import dialog shows the parsed metadata",
              "Import “Mines”?" in dlg_text and "Game" in dlg_text and "💣" in dlg_text and "Games" in dlg_text,
              dlg_text.replace("\n", " ")[:110])
        page.evaluate("""() => {
            const b = [...document.querySelectorAll('.dialog-wrap button')].find(b => /Add to NebulaOS/.test(b.textContent));
            if (b) b.click();
        }""")
        page.wait_for_timeout(2000)
        imported = page.evaluate("""() => {
            const app = Nebula.Registry.all().find(a => a.imported);
            const w = [...Nebula.wins.values()].find(w => w.appId === (app && app.id));
            return app ? { name: app.name, cat: app.category, opened: !!w, meta: app.details } : null;
        }""")
        check("imported entry named from the meta tag (not the filename)", bool(imported) and imported["name"] == "Mines",
              imported and imported["name"])
        check("imported game filed under Games", bool(imported) and imported["cat"] == "Games")
        check("imported app auto-opened", bool(imported and imported["opened"]))
        page.screenshot(path=str(SHOTS / "38-imported-game.png"))

        # ------------------------------------------------------- 5. persistence
        section("imported apps persist")
        page.evaluate("() => Nebula.set({})")
        page.reload(wait_until="domcontentloaded")
        wait_boot(page)
        page.wait_for_timeout(1200)
        after = page.evaluate("""() => Nebula.Registry.all().filter(a => a.imported).map(a => ({name:a.name, cat:a.category}))""")
        check("imported app still present after reload", any(a["name"] == "Mines" for a in after), after)
        bundled_after = page.evaluate("() => Nebula.Registry.all().filter(a => a.bundled).length")
        check("bundled apps re-registered after reload", bundled_after >= 2, bundled_after)

        # ------------------------------------------------ 6. starter template
        section("starter template (samples/starter.html)")
        starter = (ROOT / "samples" / "starter.html").read_text()
        page.evaluate("html => Nebula.Apps.importHtml(html, 'starter.html')", starter)
        page.wait_for_timeout(1800)
        st = page.evaluate("""() => {
            const app = Nebula.Registry.all().find(a => a.name === 'Hello Nebula');
            const w = app ? [...Nebula.wins.values()].find(w => w.appId === app.id) : null;
            return app ? { cat: app.category, opened: !!w, title: w && w.title } : null;
        }""")
        check("starter registers with its meta name", bool(st) and st["title"] == "Hello Nebula", st)
        sframe = None
        for f in page.frames:
            if f == page.main_frame:
                continue
            try:
                if f.evaluate("() => !!document.getElementById('host')"):
                    sframe = f
                    break
            except Exception:
                pass
        check("starter frame loaded", sframe is not None)
        if sframe:
            page.wait_for_timeout(1200)
            info = sframe.evaluate("""() => ({ host: document.getElementById('host').textContent,
                                              theme: document.getElementById('theme').textContent,
                                              wins: document.getElementById('wins').textContent,
                                              appTheme: document.documentElement.dataset.appTheme })""")
            check("starter sees the shell", info["host"] == "inside NebulaOS" and info["wins"] not in ("", "—"), info)
            check("starter followed the desktop theme", info["appTheme"] == "dark", info["appTheme"])
            sframe.evaluate("() => document.getElementById('act').click()")
            page.wait_for_timeout(600)
            t = page.query_selector(".toast")
            check("starter action reached the shell (toast)", t is not None, (t.inner_text() if t else "")[:60].replace("\n", " "))
        page.screenshot(path=str(SHOTS / "39-starter-app.png"))

        # ---------------------------------------------------------- 7. console
        section("console hygiene")
        real = [e for e in errors if e.strip()]
        check("no uncaught JS exceptions", not real, real[:2])

        browser.close()

    passed = sum(1 for _, ok in results if ok)
    print(f"\n{'='*52}\ndrop-in app pipeline: {passed}/{len(results)} passed\n{'='*52}")
    return 0 if passed == len(results) else 1


if __name__ == "__main__":
    sys.exit(run())
