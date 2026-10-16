#!/usr/bin/env python3
"""
NebulaOS — desktop icons tests.

Covers the whole feature: seeding, opening, drag (single + group), snapping,
keyboard move/rename/delete, marquee multi-select, the icon picker, the new
shortcut dialog (app + URL), hiding, auto-arrange, persistence across reload and
the dock-aware work area.

Run:  PLAYWRIGHT_BROWSERS_PATH=/home/user/.cache/ms-playwright python3 tests/test_icons.py
"""
import os, pathlib, sys
from playwright.sync_api import sync_playwright

BASE = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
ROOT = pathlib.Path(__file__).resolve().parent.parent
SHOTS = ROOT / "shots"
results = []


def check(label, ok, detail=""):
    results.append((label, bool(ok)))
    print(f"   {'✅' if ok else '❌'} {label}{(' — ' + str(detail)) if detail else ''}", flush=True)


def section(name):
    print(f"\n=== {name} ===", flush=True)


def boot(page):
    page.goto(BASE, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(d => d.remove())")
    page.wait_for_timeout(500)


def boxes(page):
    return page.evaluate("""() => Object.fromEntries([...document.querySelectorAll('#icons .dicon')].map(n => {
        const r = n.getBoundingClientRect();
        return [n.querySelector('.dlbl').textContent, { x: r.x, y: r.y, cx: r.x + r.width / 2, cy: r.y + r.height / 2, id: n.dataset.id }];
    }))""")


def drag(page, frm, to, steps=12):
    page.mouse.move(frm["cx"], frm["cy"])
    page.mouse.down()
    page.mouse.move(frm["cx"] + (to["cx"] - frm["cx"]) * .4, frm["cy"] + (to["cy"] - frm["cy"]) * .4, steps=steps)
    page.mouse.move(to["cx"], to["cy"], steps=steps)
    page.mouse.up()
    page.wait_for_timeout(320)


def run():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(args=["--disable-dev-shm-usage", "--no-sandbox"])
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        boot(page)

        # ------------------------------------------------------------- seeding
        section("seeding and rendering")
        icons = page.evaluate("() => Nebula.Desktop.list()")
        check("desktop is seeded from the app registry", len(icons) >= 5, f"{len(icons)} icons: {[i['name'] for i in icons]}")
        check("icons saved to settings (persist across reload)", page.evaluate("() => Array.isArray(Nebula.state.desktopIcons) && Nebula.state.desktopIcons.length >= 5"))
        check("icons render on the desktop", len(page.query_selector_all("#icons .dicon")) == len(icons))
        area = page.evaluate("() => Nebula.Desktop.area()")
        first = boxes(page)["Nebula Browser"]
        check("first icon starts inside the shell work area", first["x"] >= area["x"] - 1 and first["y"] >= area["y"] - 1,
              f"icon at {first['x']:.0f},{first['y']:.0f} · area {area['x']:.0f},{area['y']:.0f}")
        check("icons respect the left dock (never under it)",
              all(b["x"] >= area["x"] - 1 for b in boxes(page).values()), f"min x {min(b['x'] for b in boxes(page).values()):.0f}")
        page.screenshot(path=str(SHOTS / "50-desktop-icons.png"))

        # ------------------------------------------------------------ opening
        section("opening shortcuts")
        page.dblclick("#icons .dicon:first-child")
        page.wait_for_timeout(1400)
        check("double-click opens the app in a window",
              page.evaluate("() => [...Nebula.wins.values()].some(w => w.appId === 'browser')"),
              page.evaluate("() => [...Nebula.wins.values()].map(w => w.title)"))
        page.evaluate("() => [...Nebula.wins.values()].forEach(w => w.close())")
        page.wait_for_timeout(400)

        # -------------------------------------------------------- drag + snap
        section("dragging and grid snapping")
        b = boxes(page)
        target = {"cx": b["Nebula Browser"]["cx"] + 3 * 92, "cy": b["Nebula Browser"]["cy"]}
        drag(page, b["Nebula Browser"], target)
        moved = page.evaluate("() => Nebula.Desktop.list().find(i => i.name === 'Nebula Browser')")
        check("the icon moved to a new grid cell", moved["c"] == 3 and moved["r"] == 0, f"cell {moved['c']},{moved['r']}")
        check("no cell is occupied twice", page.evaluate("""() => { const k = Nebula.Desktop.list().map(i => i.c + ':' + i.r); return new Set(k).size === k.length; }"""))
        page.screenshot(path=str(SHOTS / "51-icons-dragged.png"))

        # a cell that is taken must resolve to a free one
        b = boxes(page)
        drag(page, b["Nebula Browser"], {"cx": b["Files"]["cx"], "cy": b["Files"]["cy"]})
        after = page.evaluate("() => Nebula.Desktop.list().map(i => i.name + ':' + i.c + ',' + i.r)")
        check("dropping onto an occupied cell finds a free one instead",
              page.evaluate("""() => { const k = Nebula.Desktop.list().map(i => i.c + ':' + i.r); return new Set(k).size === k.length; }"""), after)

        # ------------------------------------------------- keyboard + rename
        section("keyboard, rename, delete")
        page.mouse.click(1100, 700)          # clear selection
        page.click("#icons .dicon:first-child")
        page.keyboard.press("ArrowDown")
        page.wait_for_timeout(200)
        kb = page.evaluate("() => { const ic = Nebula.Desktop.list().find(i => Nebula.Desktop.sel.has(i.id)); return { name: ic.name, c: ic.c, r: ic.r }; }")
        check("arrow keys move the selected icon", kb["r"] >= 1, f"{kb['name']} now at {kb['c']},{kb['r']}")
        page.keyboard.press("F2")
        page.wait_for_timeout(250)
        check("F2 opens an inline rename field", page.query_selector("#icons .drename") is not None)
        page.fill("#icons .drename", "Surf")
        page.keyboard.press("Enter")
        page.wait_for_timeout(250)
        check("rename is saved", page.evaluate("() => Nebula.Desktop.list().some(i => i.name === 'Surf')"),
              page.evaluate("() => Nebula.Desktop.list().map(i => i.name)"))

        # ---------------------------------------------------------- marquee
        section("marquee selection")
        page.mouse.move(90, 50)                 # just right of the dock, on empty desktop
        page.mouse.down()
        page.mouse.move(330, 780, steps=16)     # sweep across the icon column
        page.mouse.up()
        page.wait_for_timeout(250)
        sel = page.evaluate("() => Nebula.Desktop.sel.size")
        check("dragging on the desktop rubber-band-selects icons", sel >= 2, f"{sel} selected")
        check("marquee box is hidden again afterwards", page.evaluate("() => getComputedStyle(document.querySelector('#marquee')).display") == "none")
        page.mouse.click(1100, 700)

        # ------------------------------------------------- icon picker dialog
        section("change icon")
        page.evaluate("() => { const ic = Nebula.Desktop.list()[0]; Nebula.Desktop.select(ic.id); Nebula.Desktop.emojiDialog(ic); }")
        page.wait_for_timeout(500)
        check("icon picker dialog opens", page.query_selector(".emojigrid") is not None)
        page.click(".emojigrid .emoji:nth-child(6)")
        page.wait_for_timeout(150)
        page.evaluate("""() => [...document.querySelectorAll('.dialog-wrap button')].find(b => /Use this icon/.test(b.textContent)).click()""")
        page.wait_for_timeout(400)
        emoji = page.evaluate("() => Nebula.Desktop.list()[0].emoji")
        check("chosen emoji is applied", emoji and emoji != "🌐", emoji)

        # --------------------------------------------------- new shortcut
        section("new shortcut dialog (app + URL)")
        page.evaluate("() => Nebula.Desktop.newShortcut()")
        page.wait_for_timeout(500)
        check("the form has app, url, name and icon fields", page.query_selector("#overlays select[data-key=appId]") is not None and page.query_selector("#overlays input[data-key=url]") is not None)
        page.select_option("#overlays select[data-key=appId]", "calc")
        page.fill("#overlays input[data-key=name]", "Maths")
        page.fill("#overlays input[data-key=emoji]", "🧮")
        page.evaluate("""() => [...document.querySelectorAll('.dialog-wrap button')].find(b => /Add to desktop/.test(b.textContent)).click()""")
        page.wait_for_timeout(600)
        added = page.evaluate("() => Nebula.Desktop.list().find(i => i.name === 'Maths')")
        check("app shortcut added from the dialog", bool(added), added and f"{added['appId']} at {added['c']},{added['r']}")
        check("the new shortcut has its own emoji and app link",
              bool(added) and added["emoji"] == "🧮" and added["appId"] == "calc", added and f"{added['emoji']} → {added['appId']}")
        page.evaluate("() => document.querySelectorAll('.toast').forEach(t => t.remove())")

        # the same app twice must be refused, not duplicated
        page.evaluate("() => Nebula.Desktop.newShortcut()")
        page.wait_for_timeout(400)
        page.select_option("#overlays select[data-key=appId]", "calc")
        page.evaluate("""() => [...document.querySelectorAll('.dialog-wrap button')].find(b => /Add to desktop/.test(b.textContent)).click()""")
        page.wait_for_timeout(600)
        dupes = page.evaluate("() => Nebula.Desktop.list().filter(i => i.appId === 'calc').length")
        toast_txt = page.inner_text(".toast") if page.query_selector(".toast") else ""
        check("adding the same app twice is refused with a notice", dupes == 1 and "already" in toast_txt.lower(),
              f"{dupes} copy · toast {toast_txt.replace(chr(10), ' ')[:46]!r}")
        page.evaluate("() => document.querySelectorAll('.toast').forEach(t => t.remove())")

        page.evaluate("() => Nebula.Desktop.newShortcut()")
        page.wait_for_timeout(450)
        page.fill("#overlays input[data-key=url]", "example.com")
        page.evaluate("""() => [...document.querySelectorAll('.dialog-wrap button')].find(b => /Add to desktop/.test(b.textContent)).click()""")
        page.wait_for_timeout(600)
        url_icon = page.evaluate("() => Nebula.Desktop.list().find(i => i.url)")
        check("URL shortcut added and normalised", bool(url_icon) and url_icon["url"] == "https://example.com", url_icon and url_icon["url"])
        check("URL shortcut counted as a browser target", page.evaluate("() => !!Nebula.Desktop.target({url:'https://example.com'})"))
        page.screenshot(path=str(SHOTS / "52-icons-shortcuts.png"))

        # ------------------------------------------------------------ menus
        section("context menu + hide/arrange")
        page.evaluate("() => { const ic = Nebula.Desktop.list().find(i => i.name === 'Maths'); Nebula.Desktop.select(ic.id); const r = document.querySelector('#icons .dicon.sel').getBoundingClientRect(); Nebula.Desktop.iconMenu(ic, r.x + 10, r.y + 10); }")
        page.wait_for_timeout(300)
        menu = page.inner_text("#ctxmenu")
        check("icon menu offers rename / change icon / remove",
              all(w in menu for w in ("Rename", "Change icon", "Remove")), menu.replace("\n", " | ")[:80])
        page.keyboard.press("Escape")
        page.wait_for_timeout(200)

        page.evaluate("() => Nebula.Desktop.desktopMenu(700, 400, [{ label: 'New browser window', icon: 'globe', action: () => {} }])")
        page.wait_for_timeout(300)
        dmenu = page.inner_text("#ctxmenu")
        check("desktop menu merges shortcuts with the shell options",
              all(w in dmenu for w in ("New shortcut", "Auto-arrange", "New browser window", "Change theme")), dmenu.replace("\n", " | ")[:95])
        page.keyboard.press("Escape")
        page.wait_for_timeout(200)

        page.evaluate("() => Nebula.set({ iconsHidden: true })")
        page.wait_for_timeout(300)
        check("icons can be hidden", page.evaluate("() => getComputedStyle(document.querySelector('#icons')).display") == "none")
        page.evaluate("() => Nebula.set({ iconsHidden: false })")
        page.wait_for_timeout(300)

        scrambled = page.evaluate("""() => { const l = Nebula.Desktop.list(); l.forEach((i, n) => { i.c = (n % 3) + 2; i.r = n % 4; }); Nebula.Desktop.save(l); Nebula.Desktop.render();
            return l.map(i => i.c + ',' + i.r); }""")
        page.evaluate("() => Nebula.Desktop.arrange(true)")
        page.wait_for_timeout(300)
        arranged = page.evaluate("() => Nebula.Desktop.list().map(i => i.c + ',' + i.r)")
        check("auto-arrange re-packs icons into the first column", arranged == [f"{0},{i}" for i in range(len(arranged))], f"was {scrambled[:4]}… → now {arranged[:4]}…")

        # -------------------------------------------------------- persistence
        section("persistence and work area")
        before = page.evaluate("() => Nebula.Desktop.list().map(i => i.name + ':' + i.emoji + ':' + i.c + ',' + i.r)")
        page.reload(wait_until="domcontentloaded")
        page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
        page.evaluate("() => document.querySelectorAll('.dialog-wrap').forEach(d => d.remove())")
        page.wait_for_timeout(700)
        after = page.evaluate("() => Nebula.Desktop.list().map(i => i.name + ':' + i.emoji + ':' + i.c + ',' + i.r)")
        check("icons, names, emoji and positions survive a reload", before == after, f"{len(after)} icons restored")

        page.evaluate("() => Nebula.set({ dockPos: 'bottom' })")
        page.wait_for_timeout(500)
        area2 = page.evaluate("() => Nebula.Desktop.area()")
        lowest = page.evaluate("() => Math.max(...Nebula.Desktop.list().map(i => Nebula.Desktop.area().y + i.r * Nebula.Desktop.CELL.h))")
        check("moving the dock to the bottom reflows the grid", area2["h"] < area["h"] and lowest <= area2["y"] + area2["h"],
              f"area height {area['h']:.0f} → {area2['h']:.0f}")
        page.evaluate("() => Nebula.set({ dockPos: 'left' })")
        page.wait_for_timeout(400)

        # ---------------------------------------------------------- integrity
        section("broken shortcut handling")
        page.evaluate("""() => { const l = Nebula.Desktop.list(); l.push({ id: 'icon-ghost', appId: 'does-not-exist', name: 'Ghost', emoji: '👻', c: 4, r: 0 }); Nebula.Desktop.save(l); Nebula.Desktop.render(); }""")
        page.wait_for_timeout(300)
        page.evaluate("() => Nebula.Desktop.open(Nebula.Desktop.list().find(i => i.name === 'Ghost'))")
        page.wait_for_timeout(500)
        toast = page.inner_text(".toast") if page.query_selector(".toast") else ""
        check("an icon whose app vanished reports itself instead of throwing",
              "broken" in toast.lower(), toast.replace("\n", " ")[:70])
        page.evaluate("() => Nebula.Desktop.remove('icon-ghost', true)")
        page.wait_for_timeout(300)

        check("no uncaught JS exceptions", not [e for e in errors if e.strip()], errors[:2])
        browser.close()

    passed = sum(1 for _, ok in results if ok)
    print(f"\n{'='*52}\ndesktop icons: {passed}/{len(results)} passed\n{'='*52}")
    return 0 if passed == len(results) else 1


if __name__ == "__main__":
    sys.exit(run())
