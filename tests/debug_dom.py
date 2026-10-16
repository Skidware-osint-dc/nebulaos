#!/usr/bin/env python3
"""Quick DOM inspector for NebulaOS during development."""
import json, os, sys, pathlib
from playwright.sync_api import sync_playwright

BASE = os.environ.get("NEBULA_URL", "http://localhost:8000/NebulaOS.html")
SHOTS = pathlib.Path(__file__).resolve().parent.parent / "shots"
SHOTS.mkdir(exist_ok=True)

DEBUG_JS = r"""
() => {
  const out = {};
  const dock = document.querySelector('#dock');
  out.dockHTML = dock.innerHTML.slice(0, 600);
  out.dockRect = dock.getBoundingClientRect().toJSON();
  out.dockStyle = { bg: getComputedStyle(dock).backgroundColor, backdrop: getComputedStyle(dock).backdropFilter };
  const firstItem = dock.querySelector('.dock-item');
  out.itemRect = firstItem ? firstItem.getBoundingClientRect().toJSON() : null;
  out.itemColor = firstItem ? getComputedStyle(firstItem).color : null;
  out.itemHTML = firstItem ? firstItem.innerHTML.slice(0, 400) : null;
  const svg = firstItem && firstItem.querySelector('svg');
  out.svgRect = svg ? svg.getBoundingClientRect().toJSON() : null;
  out.svgStyle = svg ? { w: getComputedStyle(svg).width, h: getComputedStyle(svg).height, fill: getComputedStyle(svg).fill, stroke: getComputedStyle(svg).stroke, color: getComputedStyle(svg).color, display: getComputedStyle(svg).display } : null;
  const use = svg && svg.querySelector('use');
  out.useHref = use ? use.getAttribute('href') : null;
  out.symbolExists = !!document.querySelector('#i-globe');
  out.symbolRect = document.querySelector('#i-globe') ? document.querySelector('#i-globe').getBoundingClientRect().toJSON() : null;
  // what is at the top-centre of the bar?
  const elAt = document.elementFromPoint(720, 20);
  out.elementAtTopCentre = elAt ? (elAt.tagName + '.' + elAt.className + '#' + elAt.id) : null;
  out.elementAtTopCentreOuter = elAt ? elAt.outerHTML.slice(0, 200) : null;
  out.bodyClasses = document.body.className;
  out.theme = document.body.dataset.theme;
  out.walls = { aurora: getComputedStyle(document.documentElement).getPropertyValue('--wp-aurora').slice(0, 40) };
  out.windows = [...document.querySelectorAll('.window')].map(w => w.className);
  out.barChildren = [...document.querySelector('#bar').children].map(c => c.id || c.tagName);
  const clock = document.querySelector('#clock-time');
  out.clockText = clock ? clock.textContent : null;
  out.clockRect = clock ? clock.getBoundingClientRect().toJSON() : null;
  out.proxyBadge = document.querySelector('#badge-proxy-text')?.textContent;
  return out;
}
"""

with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = b.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page.goto(BASE, wait_until="domcontentloaded")
    page.wait_for_function("() => !!window.Nebula && document.querySelector('#splash') === null", timeout=45000)
    # dismiss welcome dialog
    page.evaluate("""() => { document.querySelectorAll('.dialog-wrap').forEach(w => w.remove()); }""")
    page.wait_for_timeout(600)
    data = page.evaluate(DEBUG_JS)
    print(json.dumps(data, indent=1)[:4000])
    page.screenshot(path=str(SHOTS / "debug-desktop.png"))
    page.locator("#dock").screenshot(path=str(SHOTS / "debug-dock.png"))
    b.close()
