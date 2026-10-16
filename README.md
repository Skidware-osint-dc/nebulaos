# NebulaOS

A complete glass desktop environment — shell, window manager, proxied browser, app suite,
games and privacy tools — packed into **one SVG / one HTML file**, with a ~13 KB service-worker
companion that makes real web proxying work from a static host like **jsDelivr**.

![Desktop](screenshots/01-desktop.png)

---

## 1. Files

| File | Size | What it is |
| --- | --- | --- |
| `bundle/NebulaOS.svg` | ~561 KB | **The whole desktop**, base64-packed and booted inside a `srcdoc` iframe — the same technique as your reference file. |
| `bundle/NebulaOS.html` | ~419 KB | Identical desktop as a normal HTML file (easier to edit/develop). |
| `bundle/nebula.sw.js` | ~13 KB | The service worker: **must be uploaded to the same folder** (see §2). |
| `bundle/index.html` | = HTML | Copy of the HTML build, so a bare folder URL opens the desktop. |
| `bundle/nebula.apps.json` | ~1 KB | Manifest of the apps found in `apps/` + `games/` (name, icon, size, whether it was embedded). |
| `apps/`, `games/` | — | **Your own single-file HTML apps and games** — see §5a. Bundled into the build automatically. |
| `samples/` | — | The three bundled apps plus a starter template, a guide, and `inline-xhtml-test.svg` (the raw inline-HTML experiment from §2a). |

Both `NebulaOS.svg` and `NebulaOS.html` are fully self-contained: wallpapers are inlined as
data URIs, libraries load from jsDelivr, and there are **no other dependencies**.

---

## 2. Why the service worker must sit next to the file

A service worker's **scope is limited to its own directory**, and every proxied URL must be
served from inside that scope (`…/nb-uv/…`, `…/sj1/…`, `…/sj2/…`).

`nebula.sw.js` derives all of its routes from its **own location**, so it works from any path —
but it has to be in the same folder as the app. Nothing is hardcoded, no config file to edit.

```
your-repo/                 →  https://cdn.jsdelivr.net/gh/USER/REPO@main/
├── NebulaOS.svg           ← the desktop  (also upload index.html)
├── index.html
└── nebula.sw.js           ← the proxy engine
```

Open (this build is already online):

```
https://cdn.jsdelivr.net/gh/Skidware-osint-dc/nebulaos@v1.0.1/bundle/NebulaOS.svg    ← packed SVG
https://cdn.jsdelivr.net/gh/Skidware-osint-dc/nebulaos@v1.0.1/bundle/index.html      ← HTML build
```

Use a **tag** (`@v1.0.1`), not `@main`: jsDelivr caches branches for up to 12 hours, so a fresh
push to `main` can still be served as the previous build. Tags are cached per version and are
always correct. `nebula.sw.js` is picked up from the same folder automatically.

If `nebula.sw.js` is missing, everything still works **except** the proxied browser — the app
tells you exactly that and offers to run diagnostics.

> **jsDelivr note:** for the newest service worker to be picked up after a re-upload, either
> bump the version tag (`@main` → `@v2`) or purge the cache
> (`https://purge.jsdelivr.net/gh/USER/REPO@main/nebula.sw.js`). The worker is registered with
> `updateViaCache: "none"` so it normally refreshes itself.

---

## 2a. How the SVG holds the whole site (and why it is packed)

You are right that SVG supports CSS, JavaScript and HTML — the desktop's HTML genuinely lives
inside the SVG. There are two ways to do it, and this build uses the second one on purpose:

**Raw inline XHTML** — `<svg><foreignObject><xhtml:div>…</xhtml:div></foreignObject></svg>`

**Base64-packed `srcdoc`** — `<svg><foreignObject><xhtml:iframe id="nebula-frame"/></foreignObject><script>frame.srcdoc = decode(payload)</script></svg>` ← **what ships**

`samples/inline-xhtml-test.svg` is a real, runnable experiment for the first approach. Measured
in a browser (`image/svg+xml` document, `document.contentType` confirms it):

| Inline XHTML inside `<foreignObject>` | Result |
| --- | --- |
| Scripts executed | ✅ `document.contentType` = `image/svg+xml`, script ran |
| Inline `<xhtml:style>` + CSS animations | ✅ applied and animating |
| `createElementNS(ns, "div")` | ✅ renders correctly |
| `createElement("div")` (no namespace) | ✅ appended — but **not HTML** (null namespace) |
| `element.innerHTML = "<b>x</b><br><br>y"` | ❌ **`SyntaxError`** — the SVG parser rejects unclosed HTML tags |
| `element.innerHTML` with strictly closed tags | ✅ works, but every app must be tag-perfect |
| `document.body` | ⚠️ `null` — code that touches `document.body` breaks |
| `localStorage`, service worker, `<nav id="dock">` queried through `querySelectorAll` | ✅ |

That `innerHTML` failure is why the desktop is not inlined: **one unclosed `<br>` or `<img>` in
any fragment of the app (or of a third-party library that builds DOM from strings) takes the whole
file down.** The packed `srcdoc` iframe gets a normal HTML document with a real `<body>`, a real
HTML parser, `localStorage`, workers — everything — while the file you host is still an SVG that a
browser opens directly from jsDelivr. The cost is 33 % base64 overhead and a decode step on load.

**Proof that the whole site is in there** — `tests/test_svg_full.py` decodes the payload out of
the SVG and hashes it:

```
decoded payload is byte-identical to NebulaOS.html — 331 KB vs 331 KB · sha256 9a3b16bf8766
payload contains desktop markup / design system CSS / shell JavaScript / bundled game + app
             / wallpaper data URI / window manager / proxy stack            ✅ all
SVG is self-contained (no external script or stylesheet tags)              ✅
```

| The packed SVG running the desktop | …with a real proxied page |
| --- | --- |
| ![svg desktop](screenshots/42-svg-bundled-app.png) | ![svg proxied](screenshots/43-svg-proxied-page.png) |

### Browser note (measured)

| Build | Chromium | Firefox |
| --- | --- | --- |
| `bundle/NebulaOS.svg` (packed) | ✅ everything, proxy included | ✅ desktop, apps, games, themes — ⚠️ **proxy unavailable** |
| `bundle/index.html` / `NebulaOS.html` | ✅ everything | ✅ everything, proxy included (`200 via mux`) |

Firefox will not activate a service worker for an `about:srcdoc` frame whose parent document is
`image/svg+xml` — the registration resolves, but the worker stays `installing` forever, so no
proxied browsing. NebulaOS detects exactly that condition and offers a one-click switch to the
HTML build instead of failing silently. Proxy-less on Firefox? Everything offline still works
(Files, Terminal, Paint, Calculator, all games, your own apps). See `screenshots/45-svg-firefox.png`.

---

## 3. Settings you asked for

### Proxy → Backend engine
| Option | Library | Notes |
| --- | --- | --- |
| **Ultraviolet** | `@titaniumnetwork-dev/ultraviolet@3.2.10` | Default, battle-tested, widest compatibility. |
| **Scramjet v2** | `@mercuryworkshop/scramjet@2.0.67-alpha.2` + `scramjet-controller@0.0.14` | Newest rewriter, fastest on modern sites (Wikipedia, YouTube, Discord). |
| **Scramjet** | `@mercuryworkshop/scramjet@1.1.0` | Original Scramjet build — good for sites that dislike UV. |

Switching takes effect immediately in every new browser tab; existing tabs keep working on the
engine they started with.

### Proxy → Transport
| Option | Package | Notes |
| --- | --- | --- |
| **Epoxy** | `@mercuryworkshop/epoxy-transport@3.0.1` | Faster startup, narrower site support. |
| **libcurl** | `@mercuryworkshop/libcurl-transport@2.0.5` | libcurl.js + Wisp — best site support (TLS, HTTP/2, cookies). |

Both run through `bare-mux@2.1.9`, and only the selected transport is ever downloaded
(lazy-loaded).

### Proxy → Wisp
- Ships with a working default: `wss://wisp.mercurywork.shop/`
- Four presets: Mercury Workshop, rhw.one, Dogeystamp, **Local (`ws://localhost:4000/`)**
- Custom URL field, with **Test connection**
- **Auto-failover**: if the configured relay is unreachable at boot, NebulaOS probes the other
  presets and switches to the first one that answers (pinned relays are never overridden).


**Which relay?** The shipped default (`wss://bare-server.fly.dev/wisp/`) was tested end-to-end —
browsing a real page through it, not just opening a socket. Two of the four relays the community
lists most often look healthy on connect and then refuse to carry traffic, so the boot sequence now
*proves* a candidate with one real request before switching to it (`Settings → Proxy → Test` runs
the same check).

| Relay | State (2026-10-16) |
| --- | --- |
| `wss://bare-server.fly.dev/wisp/` | default — connects **and** proxies |
| `wss://hurt-agata-liventcord-api-7072e9a6.koyeb.app/` | connects and proxies, slower (~1.4 s) |
| `wss://wisp.mercurywork.shop/` | accepts the socket, then drops the request — do not rely on it |
| `ws://localhost:4000/` | self-hosted, private, fastest — see §9 |

Public relays are other people's servers: they can rate-limit you, and they can see the traffic that
passes through them. For anything private, run your own (`npx wisp-server-node`) and paste its URL
into Settings → Proxy.

### Search
DuckDuckGo, Google, Brave, or a custom template (`%s` = query). Applies to the omnibox and to
the browser start page.

---

## 4. Feature map

### Top bar
`Activities` · App grid · new window · **Browser · Apps · Games · Discord** quick-launch buttons ·
window title strip · clock / calendar popover · **proxy status badge** · theme picker ·
cloak toggle (eye) · Settings · session menu (lock, restart, close, blob).

### Privacy
| Feature | Where | Behaviour |
| --- | --- | --- |
| **Anti-close** | Settings → Privacy | `beforeunload` guard plus an in-app “Close this tab?” confirmation. If the browser blocks a script-initiated close (tabs the page didn't open), NebulaOS cloaks the tab instead and tells you to press Ctrl+W. |
| **about:blank** | Settings → Privacy | Off / **Auto (instant)** / Manual. Cloaks the real title + favicon; presets for `about:blank`, Google, Drive, Classroom or a custom title. |
| **Blob mode** | Settings → Privacy | Reloads the desktop from a `blob:` URL so visits never appear as a normal page. A **Blob mode** chip appears in the top bar to switch back. |
| **Data** | Settings → Privacy | One-click erase of all NebulaOS storage. |

**Blob mode's honest trade-off:** browsers refuse to register service workers on `blob:` URLs, so
while you're in blob mode the proxied browser is unavailable (offline apps, games, files all still
work). NebulaOS states this in the confirmation dialog and in the bar chip. `about:blank` mode and
anti-close are unaffected.

### Themes
`crimson`, `terracotta`, `marigold`, `emerald`, `aqua`, `glacier` (light), `midnight`, `graphite`
and **`pyro`** — the black/orange palette from the pyro UI upload, with a breathing ember glow on
the wallpaper. Every theme restyles the bar, dock, windows, controls **and** the wallpaper gradient.

| Pyro |
| --- |
| ![](screenshots/20-theme-pyro.png) |

### Browser skins
The browser has two chrome styles, switchable from **Settings → Appearance → Browser skin** or the
browser's ⋮ menu. Both drive the *same* proxy stack — only the chrome changes.

| Skin | What it looks like |
| --- | --- |
| **Glass** (default) | The clean glass omnibox, translucent tab strip, status bar. |
| **Pyro** | Monospace orange-on-black chrome: live clock widget, `GO` button inside the omnibox, `PRIVACY / PROXY / RESET` chips, and a start page with the four pyro category cards (Games / Media / Music / Tools) plus the glowing ρяо wordmark. |

| Pyro skin — start page | Pyro skin — real proxied page |
| --- | --- |
| ![](screenshots/30-browser-skin-pyro.png) | ![](screenshots/31-pyro-proxied-ddg.png) |

| Crimson | Marigold | Emerald | Aqua |
| --- | --- | --- | --- |
| ![](screenshots/20-theme-crimson.png) | ![](screenshots/20-theme-marigold.png) | ![](screenshots/20-theme-emerald.png) | ![](screenshots/20-theme-aqua.png) |

Wallpapers: theme gradient (default), **Aurora**, **Glacier light** — both are AI-generated images
inlined as data URIs, so nothing is fetched at runtime.

| Aurora wallpaper | Glacier light | Dock on the bottom |
| --- | --- | --- |
| ![](screenshots/21-wall-aurora.png) | ![](screenshots/21-wall-glacier.png) | ![](screenshots/22-dock-bottom.png) |

### Window manager
Drag, resize (8 handles), snap to halves/quarters (drag to an edge), double-click to maximise,
minimise / maximise / close, focus stacking, Alt+Tab, Alt+Arrow snapping, Alt+F4, floating glass
titlebars, per-window status bars.

### Desktop shell
App launcher (`Ctrl`+`Space`) with fuzzy search over apps, games, settings and commands; right-click
context menus on the desktop, bar, dock icons and files; toasts; modal dialogs; lock screen.

### Desktop icons
Shortcuts live on the desktop, laid out on a grid that respects the dock and the top bar.

| Action | How |
| --- | --- |
| Open | double-click, or `Enter` when selected (single click to select) |
| Select | click · `Ctrl`/`Shift`-click to toggle · drag a box on empty desktop to rubber-band |
| Move | drag it (a group moves together) — lands on the nearest free cell · arrow keys move, swapping with the occupant |
| Rename | `F2`, or right-click → Rename — inline edit |
| Change icon | right-click → Change icon — emoji picker or any custom character |
| Remove | `Del` / `Backspace`, or right-click → Remove (works on a whole selection) |
| Add | right-click on the desktop → New shortcut — pick an installed app **or** a URL (opens in the proxied browser) |
| Tidy up | right-click → Auto-arrange icons, or Hide desktop icons |

Icons are seeded from your dock apps on first boot, then stored in settings — names, emoji,
positions and URL shortcuts all survive reloads. Right-clicking an icon also pins/unpins it from
the dock, and a shortcut whose app no longer exists reports itself instead of failing silently.

| Desktop icons | Multi-select + icon menu | New shortcut | Icon picker |
| --- | --- | --- | --- |
| ![](screenshots/50-desktop-icons.png) | ![](screenshots/54-icons-menu.png) | ![](screenshots/55-icons-new-shortcut.png) | ![](screenshots/56-icons-picker.png) |

| Rubber-band select | Desktop menu | After a drag |
| --- | --- | --- |
| ![](screenshots/53-icons-marquee.png) | ![](screenshots/57-icons-desktop-menu.png) | ![](screenshots/51-icons-dragged.png) |

---

## 5. Apps

| App | What it does |
| --- | --- |
| **Nebula Browser** | Multi-tab browser (Ctrl+T/W/L/R) rendering sites through the chosen engine, with omnibox, back/forward/reload, <100 ms instant engine switching, bookmarks, and a start page that shows live proxy status. |
| **Quantum Browser** | The Quantum UI (tab strip, address bar + Go, quick links, Bookmarks / History / Source / Proxy drawer) rebuilt on the real proxy stack, so pages that refuse to be framed (Google, DuckDuckGo, Wikipedia) load normally. |
| **Discord** | Runs `discord.com/login` and `discord.com/app` through the proxy, with diagnostics and one-click engine switching (see §6). |
| **App Store** | Every app plus **Import HTML app** — drop in a single-file HTML game/app, it is added to the dock and app grid (metadata read from `nebula-*` meta tags, stored in localStorage, opened in its own window). Categories: All / Internet / Games / Media / Utilities / Bundled / Imported. See §5a. |
| **Games** | 2048, Snake, Tic-Tac-Toe (unbeatable AI), Memory, **Mines** — all offline, plus any game from `games/` or imported HTML games. Has an **Add a game** button. |
| **Files** | Virtual filesystem (localStorage) with folders, rename, delete, download, disk import, and HTML documents that open as their own window. |
| **Notepad** | Editor with Ctrl+S, download, character count. |
| **Calculator, Paint** | Working calculator; Paint with brush sizes, colours, eraser and PNG export. |
| **Terminal** | Real command line across the whole OS — `help`, `engine`, `transport`, `wisp`, `search`, `theme`, `wallpaper`, `proxy`, `fetch`, `diag`, `open`, `ls`, `cat`, `cloak`, `blob`, `anticlose`… |
| **Settings** | Appearance (theme, wallpaper, **browser skin**), Proxy, Search, Privacy, System panes. |

| Browser (real page) | Discord login | Settings → Proxy | Games |
| --- | --- | --- | --- |
| ![](screenshots/05-browser-proxied.png) | ![](screenshots/06-discord.png) | ![](screenshots/10-settings-proxy.png) | ![](screenshots/07-games.png) |

| Quantum Browser | Quantum → Proxy drawer | Quantum → Source |
| --- | --- | --- |
| ![](screenshots/33-quantum-proxied.png) | ![](screenshots/34-quantum-proxy-panel.png) | ![](screenshots/35-quantum-source.png) |

| Files + Terminal | Paint | App Store | Diagnostics |
| --- | --- | --- | --- |
| ![](screenshots/08-files-terminal.png) | ![](screenshots/09-paint.png) | ![](screenshots/11-app-store.png) | ![diag](screenshots/12-diagnostics.png) |

---

## 5a. Bring your own app (drop-in HTML)

Any **single-file HTML file** becomes a NebulaOS app. There are two ways in, and both are
verified by `tests/test_apps.py` (30 checks) and `tests/test_linked_app.py` (13 checks):

**A — put it in the project (shipped in the build)**

```bash
cp my-game.html games/          # apps/ for an app, games/ for a game
python3 build.py                # rebuild bundle/
```
`build.py` reads the file, registers it in the manifest and packs it in. Files up to
**180 KB are embedded** in `NebulaOS.html` / `NebulaOS.svg`; anything bigger is copied to
`bundle/apps/` (or `bundle/games/`) and loaded on demand, so the single file stays small.

**B — import it at runtime (no rebuild, no coding)**

App Store → **Import HTML app** → pick a file. NebulaOS reads its metadata, shows you what it
understood, stores it in localStorage and opens it. It survives reloads, appears in the app
grid, launcher and dock, and can be deleted from its App Store details dialog.

### Metadata (all optional)

```html
<meta name="nebula-name"        content="Minesweeper">
<meta name="nebula-icon"        content="💣">                    <!-- emoji, or a path/URL to an image -->
<meta name="nebula-description" content="Clear the minefield.">
<meta name="nebula-kind"        content="game">                  <!-- games land in the Games hub -->
<meta name="nebula-category"    content="Games">
<meta name="nebula-width"       content="980">                   <!-- optional window size -->
<meta name="nebula-height"      content="680">
```

Without them NebulaOS falls back to `<title>`. A file named `minesweeper.html` whose
`<meta name="nebula-name">` says **Mines** shows up as *Mines* — the meta tag wins.

### Packaged with this build

| App | Kind | Size | What it shows |
| --- | --- | --- | --- |
| **Mines** (`games/minesweeper.html`) | game | 9 KB | Full game: 3 difficulties, flags, timer, per-board best times in `localStorage` |
| **System Monitor** (`apps/system-monitor.html`) | app | 12 KB | Live FPS/heap graphs, the open window list, engine/transport/wisp health, one-click diagnostics |
| **Hello Nebula** (`samples/starter.html`) | app | 6 KB | The minimal template: meta tags, theme sync, `nebula.bus`, shell toasts |
| **URL to HTML** (`apps/url-to-html.html`) | app | 7 KB | Your upload, bundled as-is: fetch a URL, get its source, copy/download it |
| **Code Editor** (`apps/code-editor.html`) | app | 8.5 KB | Your upload, bundled as-is: CodeMirror + jszip, file tree and zip export (needs the CDN online) |
| **SwHelium** (`apps/swhelium.html`) | app | 1.2 MB | Your upload, bundled as a **linked** file: Helium-style start page; its own external embeds need the network |
| **Diesmos Games** (`apps/diesmos/`) | app | 389 KB / 2 files | The uploaded games portal, **patched**: the upstream `main.js` bug that killed the page (`paginationContainer is not defined`) is fixed, the non-Element click targets are guarded, a missing `initGlassMode` is supplied, the getclicky beacon is stripped, and the 300-request description 404 storm is replaced by one shared probe. Ships as a *linked* folder app (2 files): the HTML shell is tiny, the 305 KB game library is fetched as a normal file instead of being inlined into the SVG. |

| Bundled game in its window | Bundled app reading shell state | Import dialog | Starter template |
| --- | --- | --- | --- |
| ![](screenshots/36-bundled-game.png) | ![](screenshots/37-bundled-app.png) | ![](screenshots/38-imported-game.png) | ![](screenshots/39-starter-app.png) |

| App Store, bundled filter | Launcher |
| --- | --- |
| ![](screenshots/41-app-store-bundled.png) | ![](screenshots/42-launcher-bundled.png) |

The patched **Diesmos Games** portal — 100 cards per page, working pagination, no console errors,
and 5 network requests in total instead of ~300:

![Diesmos patched](screenshots/40-diesmos-patched.png)

### The app API

Your app runs in a sandboxed frame **with the same origin**, so `window.parent.Nebula` is the
running desktop. Guard it — the file may also be opened standalone:

```js
const shell = (() => { try { return window.parent !== window ? window.parent.Nebula : null; } catch { return null; } })();

shell.toast("Saved", "Stored in localStorage.", "ok");       // toast(title, msg, kind)
shell.openApp("files");                                      // launch another app
shell.state.engine / .transport / .theme / .wisp;            // live settings
shell.wins;                                                  // Map of open windows (focus(), minimize(), restore())
shell.Proxy.probeAll();                                      // proxy diagnostics
shell.bus.on("theme", ({ theme, dark }) => { … });           // follow theme + wallpaper changes
```

Theme sync (what all three samples do):

```js
const dark = window.parent.document.body.classList.contains("theme-dark");
document.documentElement.dataset.appTheme = dark ? "dark" : "light";
```

```css
html[data-app-theme="dark"]  { --bg:#0f1116; --text:#e9edf7 }
html[data-app-theme="light"] { --bg:#f2f4f9; --text:#131a26 }
```

Rules of thumb: keep the file self-contained (relative assets break once a file is embedded —
inline them as data URIs), namespace `localStorage` keys (`myapp.settings`), and remember
imported apps are trusted code with full access to the session.

---

## 6. Discord — what actually happens

Discord is the hardest mainstream site to proxy (module workers, CSP, bot checks, websocket
churn). Verified behaviour with a real relay (**Scramjet v2 + libcurl**):

- `https://discord.com/login` **renders the real login page** — email/password fields, QR-code
  login and passkey prompt — in roughly 9–25 seconds.
- The app shows a live progress panel while it boots, then a recovery panel if nothing appears
  after 45 s, offering: retry with Scramjet v2 + libcurl, retry with Scramjet, retry with
  Ultraviolet, keep waiting, open in Nebula Browser, pop out to a real tab, or embed a server
  widget instead.
- Logins persist through the proxy cookie jar (and Scramjet's IndexedDB snapshot) keyed per engine.

Caveats worth knowing before you rely on it:

- **Datacenter IPs are often blocked by Discord.** A self-hosted Wisp behind a residential
  connection is dramatically more reliable than a public relay. This is Discord's policy, not a
  bug in NebulaOS.
- If sign-in is rejected while the login page renders, switch transport to **libcurl** and engine
  to **Scramjet v2** (both are one click in Settings → Proxy) — TLS fingerprinting and module
  worker replay are the usual culprits.

---

## 7. Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl`+`Space` / `Meta` | App grid |
| `Ctrl`+`Alt`+`B` / `T` / `F` / `P` / `D` / `R` | Browser · Terminal · Files · Paint · dock side · proxy diagnostics |
| `Ctrl`+`Alt`+`L` / `Q` | Lock screen · session menu |
| `Alt`+`Tab`, `Alt`+`F4`, `Alt`+`←/→/↑` | Window switching · close · snap left/right/maximise |
| In browser: `Ctrl`+`T` / `W` / `L` / `R` | New tab · close tab · focus omnibox · reload |
| In notepad: `Ctrl`+`S` | Save |
| Desktop icons: `Enter` / `F2` / `Del` / arrows | Open · rename · remove · move the selected shortcut |

---

## 8. Where it works

| Environment | Status |
| --- | --- |
| jsDelivr (`cdn.jsdelivr.net/gh/…`) | ✅ Recommended — HTTPS origin, works with `index.html` or the SVG |
| GitHub Pages / Netlify / Cloudflare Pages | ✅ Same folder, no config |
| `http://localhost:8000` (`python3 -m http.server`) | ✅ Fully working, including the proxy |
| Directly opening the local file (`file://`) | ⚠️ Desktop boots; browsers forbid service workers on `file://`, so the proxy is unavailable and NebulaOS says so with instructions |
| Blob mode (`blob:`) | ⚠️ Privacy mode; service workers (and therefore proxying) are browser-blocked |
| Sandboxed preview iframe (`allow-scripts` only) | ⚠️ Desktop boots and every offline app runs; no service worker, so no proxying |
| **Firefox + packed SVG** | ⚠️ Desktop, apps, games and themes run; Firefox never activates a service worker for a `srcdoc` frame under an SVG parent, so no proxying — the app detects it and links to the HTML build (§2a) |
| **Firefox + `index.html` / `NebulaOS.html`** | ✅ Fully working, including the proxy (measured: `200 via mux` on Epoxy) |

Fallbacks built in: if the mux `SharedWorker` path is unavailable, the transport is handed to the
worker over a `MessagePort`; if headers arrive in the wrong shape for the installed transport
version, an adapter normalises them; if the Scramjet IndexedDB is left storeless by a cold start,
NebulaOS repairs it; unrouted engine requests get a self-refreshing “warming up” page instead of a
404.

---

## 9. Rebuilding from source

```
src/markup.html     shell markup + icon sprite
src/shell.css       design system: themes, glass, windows, dock, dialogs
src/core.js         shell, window manager, settings, privacy, proxy stack
src/apps.js         browser, discord, games, files, terminal, store, HTML-app pipeline
src/nebula.sw.js    service worker (UV + Scramjet 1 + Scramjet 2)
apps/ games/        your own drop-in single-file HTML apps and games (§5a)
samples/            the bundled apps + starter template + authoring guide
build.py            inlines wallpapers, scans apps/ + games/, writes bundle/ (html, svg, sw, manifest)
tools/setup.sh      one-shot dev environment (playwright, browsers, local Wisp relay)
```

```bash
bash tools/setup.sh          # once per fresh sandbox: playwright + browsers + wisp relay
python3 build.py             # rebuild bundle/
python3 tests/e2e.py         # 20 checks — shell, 6 engine×transport renders, privacy
python3 tests/test_apps.py   # 30 checks — drop-in apps: meta tags, windows, import, persistence
python3 tests/test_linked_app.py  # 13 checks — large apps linked instead of embedded
python3 tests/test_icons.py  # 30 checks — desktop icons: drag, marquee, rename, dialogs, persistence
python3 tests/test_svg.py    # packed-SVG boot + real proxied page
python3 tests/test_svg_full.py    # 36 checks — payload hash, SVG runtime, Chromium+Firefox matrix
python3 tests/test_local.py  # file:// boot with the honest "needs a web server" dialog
python3 tests/test_blob.py   # blob mode: convert, run apps offline, return to http
python3 tests/shots.py       # regenerate the screenshots
```

Passing as of this build: **e2e 20/20 · apps 30/30 · icons 30/30 · linked 13/13 · svg-full 36/36 ·
svg PASS · local PASS · blob PASS**. `tools/setup.sh` installs both Playwright browsers; the browser matrix in
`test_svg_full.py` runs on Chromium **and** Firefox, the remaining suites on Chromium.

Local development with a self-hosted relay:

```bash
python3 -m http.server 8000            # in bundle/
./tools/node_modules/.bin/wisp-js-server --host 0.0.0.0 --port 4000
# then set Wisp to ws://localhost:4000/ in Settings → Proxy
```

---

## 10. Credits

- **Ultraviolet 3.2.10** — Titanium Network
- **Scramjet 1.1.0 & 2.0.67-alpha.2**, **Scramjet Controller 0.0.14** — Mercury Workshop
- **bare-mux 2.1.9**, **epoxy-transport 3.0.1**, **libcurl-transport 2.0.5** — Mercury Workshop
- **Wisp protocol / wisp-js** — Mercury Workshop (used here to run the test relay)

NebulaOS ships no third-party code inside itself: libraries are loaded at runtime from jsDelivr,
so upstream fixes arrive automatically.
