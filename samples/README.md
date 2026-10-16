# Sample drop-in apps

These are the three apps that ship bundled with NebulaOS. They are ordinary
single-file HTML files — no build step, no framework, no imports. Copy one,
edit it, and rebuild.

| File | Kind | What it shows |
|------|------|----------------|
| `starter.html` | app | The minimal template: meta tags, theme sync, shell API (`nebula.bus`, `toast`) |
| `system-monitor.html` | app | Reading live shell state — window list, engine/transport, themes, proxy diagnostics |
| `minesweeper.html` | game | A full game with `localStorage` high scores, keyboard-friendly UI, 3 difficulties |

## Install one

1. Copy the file into `apps/` (for an app) or `games/` (for a game) in the project root.
2. Run `python3 build.py`.
3. Reload the desktop. It is now in the App Store, the app grid and the launcher.

Files up to **180 KB** are embedded straight into `NebulaOS.html` / `NebulaOS.svg`
so the build stays a single file. Anything bigger is copied next to the build and
loaded on demand — `build.py` prints which is which.

You can also skip the build entirely: open **App Store → Import HTML app** and pick a
file. Imports are stored inside NebulaOS (localStorage) and survive reloads.

## Metadata

Every tag is optional. Without any of them NebulaOS uses `<title>` and a generic icon.

```html
<meta name="nebula-name"        content="Minesweeper">          <!-- launcher + window title -->
<meta name="nebula-icon"        content="💣">                   <!-- emoji, or a path/URL to an image -->
<meta name="nebula-description" content="Clear the minefield."> <!-- shown in the App Store card -->
<meta name="nebula-kind"        content="game">                 <!-- "game" files land in Games -->
<meta name="nebula-category"    content="Games">                <!-- any store category -->
<meta name="nebula-width"       content="980">                  <!-- optional default window size -->
<meta name="nebula-height"      content="680">
```

## Talking to the desktop

Your app runs in a sandboxed frame with the same origin, so `window.parent.Nebula`
is the running shell. It is always worth guarding that access — the file may also be
opened standalone in a browser:

```js
const shell = (() => { try { return window.parent !== window ? window.parent.Nebula : null; } catch { return null; } })();

shell.toast("Saved", "Stored in localStorage.", "ok");   // toast(title, msg, kind)
shell.dialog({ title: "Sure?", msg: "Delete it?", buttons: [...] });  // returns a promise
shell.openApp("files");                                  // launch another app
shell.state.engine;                                      // "uv" | "sc1" | "sc2"
shell.state.theme;                                       // "midnight", "crimson", …
shell.wins;                                              // Map of open windows
shell.Proxy.probeAll();                                  // proxy diagnostics
shell.bus.on("theme", ({ theme, dark }) => { … });       // react to theme switches
```

## Theme sync

The desktop tells you its theme over `nebula.bus`, and it also toggles a
`theme-dark` class on its own `<body>`. The samples use this pattern:

```js
const dark = window.parent.document.body.classList.contains("theme-dark");
document.documentElement.dataset.appTheme = dark ? "dark" : "light";
```

with matching CSS:

```css
html[data-app-theme="dark"]  { --bg:#0f1116; --text:#e9edf7 }
html[data-app-theme="light"] { --bg:#f2f4f9; --text:#131a26 }
```

## Good to know

* **Keep it single-file.** Relative assets (`./sprite.png`) break once the app is
  embedded in the SVG build — inline them as data URIs, or keep the file small
  enough that linking still works.
* **No internet needed.** Bundled apps run offline; anything that fetches from the
  network should go through the desktop browser instead.
* **Storage.** `localStorage` in your app is the desktop's storage, so namespace
  your keys (`myapp.settings`) to avoid collisions.
* **Imported apps are trusted code.** They run with full access to your NebulaOS
  session — only import files you wrote or read.
