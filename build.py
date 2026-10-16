#!/usr/bin/env python3
"""
NebulaOS build script
---------------------
1. Inlines the wallpapers as data URIs (compressed).
2. Scans apps/ and games/ for your own single-file HTML apps and bundles them
   (small ones are embedded in the build, larger ones are linked by path).
3. Assembles the single-file desktop HTML from src/*.
4. Writes bundle/NebulaOS.html + bundle/nebula.sw.js + bundle/nebula.apps.json.
5. Packs the desktop into bundle/NebulaOS.svg  (base64 payload booted into a
   srcdoc iframe, exactly like the reference file — this is what makes the page
   origin jsDelivr itself, so localStorage/SW/workers all behave).

Drop-in apps
------------
Put any single-file HTML app in  apps/  and any game in  games/ .  Optional
metadata is read from meta tags in the file:

    <meta name="nebula-name" content="My App">
    <meta name="nebula-icon" content="🎵">
    <meta name="nebula-description" content="What it does.">

Files up to EMBED_LIMIT bytes are embedded straight into the SVG/HTML so the
build stays a true single file; bigger ones are copied next to it and loaded on
demand (keeps the single file small on jsDelivr).
"""
import base64, io, json, os, re, shutil, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
DIST = ROOT / "bundle"   # "dist" is stripped from workspace snapshots; "bundle" persists
ASSETS = ROOT / "assets"
DIST.mkdir(exist_ok=True)

VERSION = "1.0.0"
EMBED_LIMIT = 180 * 1024          # 180 KB — bigger apps are linked instead


def log(msg=""):
    print(msg, flush=True)


def image_data_uri(path: Path, width=1440, quality=66):
    from PIL import Image
    img = Image.open(path).convert("RGB")
    if img.width > width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=quality, optimize=True, progressive=True)
    data = buf.getvalue()
    log(f"   {path.name}: {img.width}x{img.height} -> {len(data)/1024:.0f} KB")
    return "data:image/jpeg;base64," + base64.b64encode(data).decode()


META_RE = re.compile(r'<meta\s+name=["\']nebula-([a-z0-9-]+)["\']\s+content=["\']([^"\']*)["\']', re.I)
TITLE_RE = re.compile(r"<title[^>]*>([^<]{1,80})</title>", re.I)


def read_meta(raw, kind, stem):
    meta = {m.group(1).lower(): m.group(2).strip() for m in META_RE.finditer(raw)}
    t = TITLE_RE.search(raw)
    return {
        "name": meta.get("name") or (t.group(1).strip() if t else stem.replace("-", " ").title()),
        "icon": meta.get("icon") or ("🎮" if kind == "game" else "📦"),
        "description": meta.get("description") or "",
        "kind": meta.get("kind") or kind,
        "category": meta.get("category") or "",
    }


def scan_bundled_apps(strict=False):
    """Collect single-file apps (apps/*.html, games/*.html) and folder apps
    (apps/<name>/index.html with its own assets) into manifest entries."""
    entries, embedded = [], {}
    total_linked = 0

    # ---- folder apps: always linked, the whole directory is copied ----------
    for base, kind in ((ROOT / "apps", "app"), (ROOT / "games", "game")):
        if not base.is_dir():
            continue
        for d in sorted(x for x in base.iterdir() if x.is_dir()):
            entry_file = d / "index.html"
            if not entry_file.exists():
                continue
            raw = entry_file.read_text(encoding="utf-8", errors="replace")
            meta = read_meta(raw, kind, d.name)
            size = sum(f.stat().st_size for f in d.rglob("*") if f.is_file())
            dest = DIST / base.name / d.name
            if dest.exists():
                shutil.rmtree(dest)
            shutil.copytree(d, dest)
            total_linked += size
            entries.append({
                "id": f"bundled-{kind}-{d.name}",
                "name": meta["name"], "kind": meta["kind"] if meta["kind"] in ("app", "game") else kind,
                "icon": meta["icon"], "description": meta["description"] or f"Folder app from {base.name}/{d.name}/",
                "category": meta["category"],
                "path": f"{base.name}/{d.name}/index.html",
                "bytes": size, "embedded": False, "folder": True,
                "files": len([f for f in d.rglob("*") if f.is_file()]),
            })
            log(f"   {base.name}/{d.name}/:   {size/1024:6.1f} KB → linked folder "
                f"({entry['files'] if False else len([f for f in d.rglob('*') if f.is_file()])} files, {meta['name']})")

    # ---- single-file apps ---------------------------------------------------
    for folder, kind in ((ROOT / "apps", "app"), (ROOT / "games", "game")):
        if not folder.is_dir():
            continue
        for f in sorted(folder.glob("*.html")):
            raw = f.read_text(encoding="utf-8", errors="replace")
            meta = read_meta(raw, kind, f.stem)
            entry = {
                "id": f"bundled-{kind}-{f.stem}",
                "name": meta["name"],
                "kind": meta["kind"] if meta["kind"] in ("app", "game") else kind,
                "icon": meta["icon"],
                "description": meta["description"] or f"Bundled {kind} from {folder.name}/{f.name}",
                "category": meta["category"],
                "path": f"{folder.name}/{f.name}",
                "bytes": len(raw.encode("utf-8")),
            }
            if entry["bytes"] <= EMBED_LIMIT:
                entry["embedded"] = True
                embedded[entry["id"]] = base64.b64encode(raw.encode("utf-8")).decode()
                log(f"   {folder.name}/{f.name}: {entry['bytes']/1024:6.1f} KB → embedded ({meta['name']})")
            else:
                entry["embedded"] = False
                total_linked += entry["bytes"]
                # copy next to the build so local/offline hosts work too
                dest_dir = DIST / folder.name
                dest_dir.mkdir(exist_ok=True)
                shutil.copyfile(f, dest_dir / f.name)
                log(f"   {folder.name}/{f.name}: {entry['bytes']/1024:6.1f} KB → linked ({meta['name']})")
            entries.append(entry)
    return entries, embedded, total_linked


def build():
    log("NebulaOS build")
    log("-" * 46)

    log("[1/5] wallpapers")
    wp = {}
    for name, file in (("aurora", "wall-aurora.jpg"), ("glacier", "wall-glacier.jpg")):
        p = ASSETS / file
        wp[name] = image_data_uri(p) if p.exists() else "none"

    log("[2/5] bundled apps (apps/, games/)")
    bundled, embedded, linked_bytes = scan_bundled_apps()
    if not bundled:
        log("   none found — drop single-file HTML apps into apps/ or games/")
    else:
        log(f"   {len(bundled)} app(s): {sum(1 for b in bundled if b['embedded'])} embedded, "
            f"{sum(1 for b in bundled if not b['embedded'])} linked ({linked_bytes/1024:.0f} KB served separately)")

    log("[3/5] assembling single-file desktop")
    css = (SRC / "shell.css").read_text()
    markup = (SRC / "markup.html").read_text()
    core = (SRC / "core.js").read_text()
    apps = (SRC / "apps.js").read_text()

    wallpaper_css = (
        ":root{\n"
        f"  --wp-aurora: url(\"{wp['aurora']}\");\n"
        f"  --wp-glacier: url(\"{wp['glacier']}\");\n"
        "}\n"
    )
    for name, code in (("core.js", core), ("apps.js", apps)):
        if re.search(r"</script", code, re.I):
            log(f"   escaped </script in {name}")

    def safe(code):
        return re.sub(r"</script", "<\\/script", code, flags=re.I)

    # manifest without payloads + payload table
    manifest_json = json.dumps([{k: v for k, v in e.items()} for e in bundled], ensure_ascii=False)
    embedded_json = json.dumps(embedded, ensure_ascii=False)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#0d0f1a">
<meta name="description" content="NebulaOS — a glass desktop in a single file, with a proxied browser, apps, games and privacy tools.">
<title>NebulaOS</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Ccircle cx='48' cy='48' r='32' fill='none' stroke='%237ea6ff' stroke-width='6'/%3E%3Ccircle cx='48' cy='48' r='13' fill='%23b78cff'/%3E%3C/svg%3E">
<style>
{wallpaper_css}{safe(css)}
</style>
</head>
<body class="theme-dark dock-left" data-theme="midnight" data-wall="gradient">
{markup}
<script>window.NEBULA_VERSION = "{VERSION}";window.NEBULA_MANIFEST = {manifest_json};window.NEBULA_EMBEDDED = {embedded_json};</script>
<script>
{safe(core)}
</script>
<script>
{safe(apps)}
</script>
<script>
/* boot the desktop */
try {{ Nebula.boot(); }} catch (err) {{ console.error(err); document.body.innerHTML = '<pre style="color:#f66;padding:20px;font:12px monospace">NebulaOS failed to boot\\n' + (err && err.stack || err) + '</pre>'; }}
</script>
</body>
</html>
"""

    (DIST / "NebulaOS.html").write_text(html)
    log(f"   bundle/NebulaOS.html               {len(html)/1024:8.1f} KB")

    sw = (SRC / "nebula.sw.js").read_text()
    (DIST / "nebula.sw.js").write_text(sw)
    log(f"   bundle/nebula.sw.js                {len(sw)/1024:8.1f} KB")

    # manifest file (for hosts where the app is served as a separate page or for hand-editing)
    (DIST / "nebula.apps.json").write_text(json.dumps(bundled, indent=1, ensure_ascii=False))
    log(f"   bundle/nebula.apps.json           {len(json.dumps(bundled))/1024:8.1f} KB")

    log("[4/5] packing SVG")
    payload = base64.b64encode(html.encode("utf-8")).decode()
    boot = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml"
     width="100%" height="100%" style="display:block;margin:0;padding:0;background:#05060a">
  <rect width="100%" height="100%" fill="#05060a"/>
  <foreignObject x="0" y="0" width="100%" height="100%" style="overflow:visible;">
    <xhtml:iframe id="nebula-frame" frameborder="0" scrolling="auto"
      style="position:absolute;inset:0;width:100%;height:100%;border:0;margin:0;padding:0;display:block;overflow:auto;background:#05060a"></xhtml:iframe>
  </foreignObject>
  <script><![CDATA[
(function () {{
  /* NebulaOS {VERSION} — the whole desktop is base64-packed here and booted into
     the iframe above. Keeping the app inside a srcdoc iframe means this document
     (and therefore the app) keeps the real host origin, so localStorage,
     SharedWorkers and the nebula.sw.js service worker all work normally. */
  const encoded = "{payload}";
  try {{
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const html = new TextDecoder("utf-8").decode(bytes);
    const frame = document.getElementById("nebula-frame");
    if (frame) frame.srcdoc = html;
  }} catch (err) {{
    document.documentElement.innerHTML = '<text x="20" y="40" fill="#ff7b8f" font-family="monospace">NebulaOS could not start: ' + err + '</text>';
  }}
}})();
  ]]></script>
</svg>
"""
    (DIST / "NebulaOS.svg").write_text(boot)
    log(f"   bundle/NebulaOS.svg                {len(boot)/1024:8.1f} KB (payload {len(payload)/1024:.0f} KB base64)")

    shutil.copyfile(DIST / "NebulaOS.html", DIST / "index.html")
    total = sum(f.stat().st_size for f in DIST.rglob("*") if f.is_file())
    log(f"[5/5] done — bundle/ total {total/1024:.0f} KB across {len(list(DIST.rglob('*')))} entries")
    if len(boot) > 12 * 1024 * 1024:
        log("   ⚠  the SVG is getting large for jsDelivr; move big apps out of apps/ (they will be linked instead)")
    return html


if __name__ == "__main__":
    build()
