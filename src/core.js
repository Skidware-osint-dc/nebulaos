/* =============================================================================
 * NebulaOS — core
 * Shell (bar / dock / launcher / window manager), settings, theming, privacy
 * features (anti-close, about:blank cloak, blob mode) and the proxy stack
 * (Ultraviolet + Scramjet 1 + Scramjet 2 with epoxy / libcurl transports).
 * Everything is dependency free: libraries are pulled from jsDelivr at runtime.
 * ========================================================================== */
"use strict";

const Nebula = (() => {
  /* ----------------------------- helpers --------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const uid = () => Math.random().toString(36).slice(2, 10);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtBytes = (n) => {
    if (n < 1024) return n + " B";
    if (n < 1048576) return (n / 1024).toFixed(1) + " KB";
    return (n / 1048576).toFixed(2) + " MB";
  };
  const el = (tag, attrs = {}, ...kids) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined && v !== false) node.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid != null) node.append(kid);
    return node;
  };
  const icon = (name, style = "") => `<svg class="ic" style="${style}"><use href="#i-${name}"/></svg>`;

  /* ----------------------------- state ----------------------------------- */
  const VERSION = { os: "1.0.0", codename: "Nebula", build: "2026.10" };
  const CDN = "https://cdn.jsdelivr.net/npm/";
  const LIB = {
    baremux: (v) => CDN + `@mercuryworkshop/bare-mux@${v || "2.1.9"}/dist/`,
    uv: (v) => CDN + `@titaniumnetwork-dev/ultraviolet@${v || "3.2.10"}/dist/`,
    sc1: (v) => CDN + `@mercuryworkshop/scramjet@${v || "1.1.0"}/dist/`,
    sc2: (v) => CDN + `@mercuryworkshop/scramjet@${v || "2.0.67-alpha.2"}/dist/`,
    sc2ctl: (v) => CDN + `@mercuryworkshop/scramjet-controller@${v || "0.0.14"}/dist/`,
    epoxy: (v) => CDN + `@mercuryworkshop/epoxy-transport@${v || "3.0.1"}/dist/index.mjs`,
    libcurl: (v) => CDN + `@mercuryworkshop/libcurl-transport@${v || "2.0.5"}/dist/index.mjs`,
  };

  const THEMES = [
    { id: "crimson", name: "Crimson", dark: true, colors: ["#e0455f", "#2a1119", "#ff7a8f"] },
    { id: "terracotta", name: "Terracotta", dark: true, colors: ["#c96a3f", "#2b1c14", "#f0a077"] },
    { id: "marigold", name: "Marigold", dark: true, colors: ["#e0a12a", "#2a2213", "#ffd166"] },
    { id: "emerald", name: "Emerald", dark: true, colors: ["#2fa472", "#0f241c", "#6fdca8"] },
    { id: "aqua", name: "Aqua", dark: true, colors: ["#22b6c4", "#0e2429", "#74e6ef"] },
    { id: "glacier", name: "Glacier", dark: false, colors: ["#2f8fd8", "#dbe7f7", "#63c7f5"] },
    { id: "midnight", name: "Midnight", dark: true, colors: ["#6c8cff", "#171a2b", "#9db2ff"] },
    { id: "graphite", name: "Graphite", dark: true, colors: ["#8f9bb3", "#23262d", "#c3cddf"] },
    { id: "pyro", name: "Pyro", dark: true, colors: ["#ff4a1c", "#170608", "#ff9a4d"] },
  ];
  const WALLS = [
    { id: "gradient", name: "Theme gradient" },
    { id: "aurora", name: "Aurora" },
    { id: "glacier", name: "Glacier light" },
  ];
  const SEARCH_ENGINES = {
    ddg: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=%s", icon: "🦆" },
    google: { name: "Google", url: "https://www.google.com/search?q=%s", icon: "🔎" },
    brave: { name: "Brave", url: "https://search.brave.com/search?q=%s", icon: "🦁" },
    custom: { name: "Custom", url: "", icon: "⚙" },
  };
  const ENGINES = {
    uv: { name: "Ultraviolet", short: "UV", desc: "Battle-tested client-side rewriter. Best all-round compatibility." },
    sc2: { name: "Scramjet v2", short: "SJ2", desc: "Newest Scramjet rewrite engine. Fastest on modern sites, alpha software." },
    sc1: { name: "Scramjet", short: "SJ1", desc: "Original Scramjet release (1.1.0). Great for sites that dislike Ultraviolet." },
  };
  const TRANSPORTS = {
    libcurl: { name: "libcurl", desc: "libcurl.js + Wisp. Best site support (TLS fingerprinting, HTTP/2, cookies)." },
    epoxy: { name: "Epoxy", desc: "Epoxy TLS over Wisp. Much faster startup, slightly lower site compatibility." },
  };
  /* Public Wisp relays. Verified working 2026-10-16 by an actual proxied fetch
   * through each one (a socket that connects but cannot carry traffic is not
   * enough — two of these looked "ok" on connect and then failed the fetch).
   * They are community servers: they can rate-limit, and they can see the
   * traffic that passes through them, so self-hosting is the private option. */
  const WISP_PRESETS = [
    { name: "Anura", url: "wss://anura.pro/" },
    { name: "Mercury Workshop", url: "wss://wisp.mercurywork.shop/" },
    { name: "Fly.io relay", url: "wss://bare-server.fly.dev/wisp/" },
    { name: "Phantom", url: "wss://phantom.lol/wisp/" },
    { name: "Lichology", url: "wss://lichology.com/wisp/" },
    { name: "Mages", url: "wss://mages.io/wisp/" },
    { name: "Swanndvr", url: "wss://shadow-3.swanndvr.net/wisp/" },
    { name: "Go Into Space", url: "wss://gointospace.app/wisp/" },
    { name: "Unified Wisp", url: "wss://unified-wisp-epoxy.fly.dev/wisp/" },
    { name: "Terbium", url: "wss://wisp.terbiumon.top/wisp/" },
    { name: "Koyeb", url: "wss://hurt-agata-liventcord-api-7072e9a6.koyeb.app/" },
    { name: "Local (self-hosted)", url: "ws://localhost:4000/" },
  ];

  const DEFAULTS = {
    theme: "midnight",
    wallpaper: "gradient",
    dockPos: "left",
    dockHidden: false,
    hour12: true,
    blur: true,
    animations: true,
    engine: "uv",
    transport: "epoxy",
    wisp: "wss://bare-server.fly.dev/wisp/",
    search: "ddg",
    searchCustom: "https://duckduckgo.com/?q=%s",
    anticlose: true,
    abMode: "off",
    cloakPreset: "blank",
    cloakCustom: "",
    blobMode: false,
    baseDir: "",
    wispAutoRetry: true,
    wispPinned: false,
    proxyTimeout: 25,
    browserSkin: "glass",        /* "glass" (default) or "pyro" — see Browser.build */
    motion: true,                /* UI + wallpaper animation; off on low-end machines */
    desktopIcons: null,          /* seeded on first boot; [{id, appId|url, name, emoji, c, r}] */
    iconsHidden: false,
    iconGrid: true,              /* snap to grid (false = free placement, kept for convenience) */
    lastEngineTransport: {},
    installedApps: [],
    bookmarks: [
      { title: "Wikipedia", url: "https://en.wikipedia.org", emoji: "📚" },
      { title: "YouTube", url: "https://www.youtube.com", emoji: "▶️" },
      { title: "GitHub", url: "https://github.com", emoji: "🐙" },
      { title: "Reddit", url: "https://www.reddit.com", emoji: "👽" },
      { title: "Twitch", url: "https://www.twitch.tv", emoji: "🎮" },
      { title: "Discord", url: "https://discord.com/app", emoji: "💬" },
    ],
    seenWelcome: false,
  };

  const LS_KEY = "nebula.settings.v1";
  let state = { ...DEFAULTS };
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    state = { ...state, ...saved };
  } catch {}
  const save = () => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
  };
  const set = (patch, opts = {}) => {
    Object.assign(state, patch);
    save();
    if (!opts.silent) applySettings(opts);
    return state;
  };

  /* Tiny pub/sub — drop-in apps inside windows use this to follow the shell.
   *   parent.Nebula.bus.on("theme", ({ theme, dark }) => …)
   *   parent.Nebula.bus.on("windows", ({ count }) => …)                      */
  const bus = {
    map: new Map(),
    on(evt, fn) {
      if (!this.map.has(evt)) this.map.set(evt, new Set());
      this.map.get(evt).add(fn);
      return () => this.off(evt, fn);
    },
    off(evt, fn) { this.map.get(evt)?.delete(fn); },
    emit(evt, data) {
      for (const fn of this.map.get(evt) || []) { try { fn(data); } catch (err) { console.warn("[nebula] bus/" + evt, err); } }
    },
  };
  /* (exposed on the public API at the bottom of this file) */

  /* ----------------------------- theming --------------------------------- */
  function applyTheme() {
    const t = THEMES.find((x) => x.id === state.theme) || THEMES[6];
    document.body.dataset.theme = t.id;
    document.body.classList.toggle("theme-dark", !!t.dark);
    document.body.dataset.wall = state.wallpaper;
    /* default the animation flag from the OS preference the first time */
    if (state.motion === undefined || state.motion === null) {
      state.motion = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    document.body.dataset.motion = state.motion === false ? "off" : "on";
    document.body.classList.toggle("no-blur", !state.blur);
    document.body.classList.toggle("dock-left", state.dockPos === "left");
    document.body.classList.toggle("dock-bottom", state.dockPos === "bottom");
    document.body.classList.toggle("dock-hidden", !!state.dockHidden);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t.colors[1]);
    bus.emit("theme", { theme: t.id, name: t.name, dark: !!t.dark, wall: state.wallpaper });
  }
  function applySettings() {
    applyTheme();
    Shell.clockTick();
    Dock.render();
    Launcher.refreshHint();
    Desktop.applyVisibility();
    Desktop.reflow();
  }
  const cycleTheme = () => {
    const i = THEMES.findIndex((t) => t.id === state.theme);
    const next = THEMES[(i + 1) % THEMES.length];
    set({ theme: next.id });
    toast("Theme changed", `${next.name} theme applied.`, "ok", 2200);
  };

  /* ----------------------------- overlays -------------------------------- */
  const toasts = $("#toasts");
  function toast(title, msg = "", kind = "", ms = 3800) {
    const node = el("div", { class: `toast glass-strong ${kind}` });
    const ico = kind === "ok" ? "check" : kind === "err" ? "warn" : "info";
    node.innerHTML = `<div class="tico">${icon(ico, "width:17px;height:17px")}</div><div class="grow"><div class="tt">${esc(title)}</div>${msg ? `<div class="tm">${msg}</div>` : ""}</div>`;
    toasts.append(node);
    const kill = () => { node.classList.add("out"); setTimeout(() => node.remove(), 220); };
    node.addEventListener("click", kill);
    if (ms) setTimeout(kill, ms);
    return kill;
  }

  function dialog({ title, msg = "", icon: dico = "info", buttons = [{ label: "OK", primary: true, value: true }], input = null, wide = false }) {
    return new Promise((resolve) => {
      const wrap = el("div", { class: "dialog-wrap" });
      const box = el("div", { class: "dialog glass-strong", style: wide ? "width:min(560px,94vw)" : "" });
      const head = el("div", { class: "dhead" });
      head.innerHTML = `<div class="dico">${icon(dico, "width:22px;height:22px")}</div><div class="grow"><div class="dtitle">${esc(title)}</div></div>`;
      const body = el("div", { class: "dmsg", html: msg });
      const foot = el("div", { class: "dfoot" });
      let inputEl = null;
      if (input) {
        const field = el("div", { class: "dfield" });
        inputEl = el("input", { class: "input", value: input.value ?? "", placeholder: input.placeholder ?? "" });
        field.append(inputEl);
        box.append(head, body, field, foot);
      } else box.append(head, body, foot);
      const done = (v) => { wrap.remove(); document.removeEventListener("keydown", onKey); resolve(v); };
      const onKey = (e) => {
        if (e.key === "Escape") { e.stopPropagation(); done(null); }
        if (e.key === "Enter" && inputEl) { e.stopPropagation(); done(inputEl.value, true); }
      };
      for (const b of buttons) {
        const btn = el("button", { class: `btn ${b.primary ? "primary" : ""} ${b.danger ? "danger" : ""}`, text: b.label, onclick: () => done(inputEl ? inputEl.value : b.value) });
        foot.append(btn);
      }
      wrap.append(box);
      wrap.addEventListener("mousedown", (e) => { if (e.target === wrap && !buttons.some((b) => b.sticky)) done(null); });
      $("#overlays").append(wrap);
      document.addEventListener("keydown", onKey);
      setTimeout(() => (inputEl || foot.querySelector(".btn.primary") || foot.querySelector(".btn"))?.focus(), 30);
    });
  }


  /* A dialog with real form fields. Values are captured as they are typed, so
   * they survive the dialog being torn down on resolve. */
  function formDialog({ title, msg = "", icon: dico = "info", fields = [], buttons, wide = true }) {
    const vals = {};
    const rows = fields.map((f, i) => {
      const id = "fd-" + i;
      vals[f.key] = f.value ?? "";
      if (f.type === "select") {
        return `<div class="frow"><label for="${id}">${esc(f.label)}</label><select class="input" id="${id}" data-key="${esc(f.key)}">
          ${(f.options || []).map((o) => `<option value="${esc(o.value)}"${String(o.value) === String(f.value ?? "") ? " selected" : ""}>${esc(o.label)}</option>`).join("")}
        </select></div>`;
      }
      return `<div class="frow"><label for="${id}">${esc(f.label)}</label><input class="input" id="${id}" data-key="${esc(f.key)}"
        value="${esc(f.value ?? "")}" placeholder="${esc(f.placeholder ?? "")}" ${f.maxlength ? `maxlength="${f.maxlength}"` : ""}></div>`;
    }).join("");
    setTimeout(() => {
      for (const node of document.querySelectorAll("#overlays [data-key]")) {
        const key = node.dataset.key;
        const grab = () => { vals[key] = node.value.trim(); };
        node.addEventListener("input", grab); node.addEventListener("change", grab);
        grab();
      }
      const first = document.querySelector("#overlays .frow .input");
      first?.focus();
    }, 40);
    return dialog({ title, icon: dico, wide, msg: msg + rows, buttons }).then((v) => (v === "ok" ? vals : null));
  }

  const ctx = $("#ctxmenu");
  function contextMenu(items, x, y) {
    ctx.innerHTML = "";
    for (const it of items) {
      if (it.sep) { ctx.append(el("div", { class: "ctx-sep" })); continue; }
      const b = el("button", { class: `ctx-item ${it.danger ? "danger" : ""}` });
      b.innerHTML = `<span style="width:16px;display:inline-grid;place-items:center">${it.icon ? icon(it.icon, "width:15px;height:15px") : ""}</span><span class="grow">${esc(it.label)}</span>${it.key ? `<span class="k">${esc(it.key)}</span>` : ""}`;
      b.addEventListener("click", () => { hideCtx(); it.action?.(); });
      ctx.append(b);
    }
    ctx.classList.add("open");
    const r = ctx.getBoundingClientRect();
    ctx.style.left = clamp(x, 6, innerWidth - r.width - 6) + "px";
    ctx.style.top = clamp(y, 6, innerHeight - r.height - 6) + "px";
  }
  const hideCtx = () => ctx.classList.remove("open");
  addEventListener("mousedown", (e) => { if (!ctx.contains(e.target)) hideCtx(); }, true);
  addEventListener("blur", hideCtx);

  /* ----------------------------- window manager -------------------------- */
  const layer = $("#windows");
  const wins = new Map();
  let zTop = 200;
  let focusedWin = null;

  const workarea = () => {
    const bar = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--bar-h")) || 34;
    const dock = state.dockHidden ? 8 : 84;
    return {
      x: state.dockPos === "left" ? dock : 4,
      y: 4,
      w: innerWidth - (state.dockPos === "left" ? dock : 4) - 8,
      h: innerHeight - bar - (state.dockPos === "bottom" ? dock + 4 : 8),
    };
  };

  class Win {
    constructor(opts = {}) {
      const wa = workarea();
      this.id = "win-" + uid();
      this.opts = opts;
      this.appId = opts.appId || "app";
      this.title = opts.title || "Window";
      this.sub = opts.sub || "";
      this.resizable = opts.resizable !== false;
      this.state = "normal";
      const w = Math.min(opts.width || 900, wa.w - 20);
      const h = Math.min(opts.height || 600, wa.h - 20);
      this.bounds = {
        x: opts.x ?? clamp(wa.x + (wa.w - w) / 2 + (wins.size % 6) * 26 - 40, wa.x, wa.x + wa.w - w),
        y: opts.y ?? clamp(wa.y + 18 + (wins.size % 6) * 24, wa.y, wa.y + wa.h - h),
        w, h,
      };
      this.build();
      wins.set(this.id, this);
      this.focus();
      if (opts.onReady) queueMicrotask(() => opts.onReady(this));
    }

    build() {
      const o = this.opts;
      this.el = el("section", { class: "window", id: this.id, role: "dialog", "aria-label": o.title || "window" });
      this.el.style.cssText = `left:${this.bounds.x}px;top:${this.bounds.y}px;width:${this.bounds.w}px;height:${this.bounds.h}px`;
      const tb = el("div", { class: "titlebar" });
      tb.innerHTML =
        `<div class="ticon">${o.iconHtml || ""}</div>
         <div style="min-width:0"><div class="tname">${esc(this.title)}</div></div>
         <div class="tspacer"></div>
         <div class="win-actions row" style="gap:2px"></div>`;
      const actions = tb.querySelector(".win-actions");
      if (o.onMinimize !== false) actions.append(this.btn("min", "Minimize", () => this.minimize()));
      if (this.resizable) actions.append(this.btn("max", "Maximize", () => this.toggleMax()));
      actions.append(this.btn("x", "Close", () => this.close(), "close"));
      this.tb = tb;
      this.subEl = null;
      this.body = el("div", { class: `wbody ${o.solid ? "solid" : ""}` });
      this.content = el("div", { class: "wcontent" });
      this.body.append(this.content);
      this.el.append(tb, this.body);
      this.addResizers();
      layer.append(this.el);
      this.bindDrag();
      if (o.statusbar) {
        this.status = el("div", { class: "wstatus", html: o.statusbar });
        this.body.append(this.status);
      }
      this.el.addEventListener("mousedown", () => this.focus(), true);
    }

    btn(kind, label, fn, cls = "") {
      const b = el("button", { class: `tbtn ${cls}`, title: label, "aria-label": label });
      b.innerHTML = icon(kind === "min" ? "min" : kind === "max" ? "max" : "x");
      b.addEventListener("click", (e) => { e.stopPropagation(); fn(); });
      return b;
    }

    addResizers() {
      if (!this.resizable) return;
      for (const dir of ["n", "s", "e", "w", "ne", "nw", "se", "sw"]) {
        const h = el("div", { class: `rz ${dir}` });
        h.addEventListener("pointerdown", (e) => this.startResize(e, dir));
        this.el.append(h);
      }
    }

    setSub(text) {
      if (!this.subEl) {
        this.subEl = el("div", { class: "tsub" });
        this.tb.querySelector(".tspacer").before(this.subEl);
      }
      this.subEl.textContent = text;
    }
    setTitle(t) { this.title = t; this.tb.querySelector(".tname").textContent = t; }

    focus() {
      if (focusedWin === this && this.el.style.zIndex == zTop) return;
      focusedWin = this;
      wins.forEach((w) => w.el.classList.remove("focused"));
      this.el.classList.add("focused");
      this.el.style.zIndex = ++zTop;
      Shell.setFocus(this);
    }
    minimize() {
      this.state = "minimized";
      this.el.classList.add("minimized");
      Dock.render();
      if (focusedWin === this) { focusedWin = null; Shell.setFocus(null); }
    }
    restore() {
      this.state = "normal";
      this.el.classList.remove("minimized");
      this.focus();
      Dock.render();
    }
    toggleMax() {
      if (this.state === "maximized") {
        this.state = "normal";
        Object.assign(this.bounds, this.prevBounds);
        this.el.classList.remove("maximized");
      } else {
        this.prevBounds = { ...this.bounds };
        this.state = "maximized";
        this.el.classList.add("maximized");
        const wa = workarea();
        Object.assign(this.bounds, { x: wa.x, y: wa.y, w: wa.w, h: wa.h });
      }
      this.apply();
      this.el.classList.add("snapping");
      setTimeout(() => this.el.classList.remove("snapping"), 200);
      this.emitResize();
    }
    apply() {
      const b = this.bounds;
      this.el.style.cssText = `left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;z-index:${this.el.style.zIndex || ""}`;
      this.el.style.zIndex = zTop;
    }
    async close() {
      if (this.opts.onCloseRequest) {
        const ok = await this.opts.onCloseRequest(this);
        if (ok === false) return;
      }
      this.el.style.transition = "opacity 130ms ease, transform 130ms ease";
      this.el.style.opacity = "0";
      this.el.style.transform = "scale(.985)";
      await sleep(130);
      this.el.remove();
      wins.delete(this.id);
      if (focusedWin === this) {
        focusedWin = null;
        const next = [...wins.values()].filter((w) => w.state !== "minimized").pop();
        if (next) next.focus(); else Shell.setFocus(null);
      }
      this.opts.onClose?.(this);
      Dock.render();
    }
    emitResize() { this.opts.onResize?.(this); }

    bindDrag() {
      let start = null;
      this.tb.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".tbtn")) return;
        if (this.state === "maximized") return;
        this.focus();
        start = { x: e.clientX, y: e.clientY, bx: this.bounds.x, by: this.bounds.y, moved: false };
        this.tb.setPointerCapture(e.pointerId);
        this.el.classList.add("dragging");
        Snap.begin(this);
      });
      this.tb.addEventListener("pointermove", (e) => {
        if (!start) return;
        const dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) start.moved = true;
        if (!start.moved) return;
        this.bounds.x = start.bx + dx;
        this.bounds.y = clamp(start.by + dy, -this.bounds.h + 60, innerHeight - 60);
        this.el.style.left = this.bounds.x + "px";
        this.el.style.top = this.bounds.y + "px";
        Snap.hover(this, e);
      });
      const end = (e) => {
        if (!start) return;
        this.el.classList.remove("dragging");
        const zone = Snap.drop(this, e);
        start = null;
        if (zone) this.snapTo(zone);
      };
      this.tb.addEventListener("pointerup", end);
      this.tb.addEventListener("pointercancel", end);
      this.tb.addEventListener("dblclick", (e) => { if (!e.target.closest(".tbtn")) this.toggleMax(); });
    }

    snapTo(zone) {
      const wa = workarea();
      this.prevBounds = { ...this.bounds };
      if (zone === "max") return this.toggleMax();
      const map = {
        left: { x: wa.x, y: wa.y, w: Math.round(wa.w / 2), h: wa.h },
        right: { x: wa.x + Math.round(wa.w / 2), y: wa.y, w: Math.round(wa.w / 2), h: wa.h },
        tl: { x: wa.x, y: wa.y, w: Math.round(wa.w / 2), h: Math.round(wa.h / 2) },
        tr: { x: wa.x + Math.round(wa.w / 2), y: wa.y, w: Math.round(wa.w / 2), h: Math.round(wa.h / 2) },
        bl: { x: wa.x, y: wa.y + Math.round(wa.h / 2), w: Math.round(wa.w / 2), h: Math.round(wa.h / 2) },
        br: { x: wa.x + Math.round(wa.w / 2), y: wa.y + Math.round(wa.h / 2), w: Math.round(wa.w / 2), h: Math.round(wa.h / 2) },
      }[zone];
      if (!map) return;
      Object.assign(this.bounds, map);
      this.el.classList.add("snapping");
      this.apply();
      setTimeout(() => { this.el.classList.remove("snapping"); this.emitResize(); }, 190);
    }

    startResize(e, dir) {
      e.stopPropagation();
      this.focus();
      const start = { x: e.clientX, y: e.clientY, ...this.bounds };
      const target = e.target;
      target.setPointerCapture(e.pointerId);
      this.el.classList.add("resizing");
      const move = (ev) => {
        const dx = ev.clientX - start.x, dy = ev.clientY - start.y;
        let { x, y, w, h } = start;
        if (dir.includes("e")) w = Math.max(320, start.w + dx);
        if (dir.includes("s")) h = Math.max(200, start.h + dy);
        if (dir.includes("w")) { w = Math.max(320, start.w - dx); x = start.x + (start.w - w); }
        if (dir.includes("n")) { h = Math.max(200, start.h - dy); y = start.y + (start.h - h); }
        Object.assign(this.bounds, { x, y, w, h });
        this.el.style.left = x + "px"; this.el.style.top = y + "px";
        this.el.style.width = w + "px"; this.el.style.height = h + "px";
      };
      const up = () => {
        target.removeEventListener("pointermove", move);
        target.removeEventListener("pointerup", up);
        this.el.classList.remove("resizing");
        this.emitResize();
      };
      target.addEventListener("pointermove", move);
      target.addEventListener("pointerup", up);
    }
  }

  const Snap = {
    zone: null,
    begin() { $("#snap-preview").style.display = "none"; },
    hover(win, e) {
      const wa = workarea();
      const ed = 22;
      const relX = e.clientX - wa.x, relY = e.clientY - wa.y;
      let zone = null;
      if (relX < ed) zone = relY < wa.h * 0.18 ? "tl" : relY > wa.h * 0.82 ? "bl" : "left";
      else if (relX > wa.w - ed) zone = relY < wa.h * 0.18 ? "tr" : relY > wa.h * 0.82 ? "br" : "right";
      else if (relY < 6) zone = "max";
      const p = $("#snap-preview");
      if (zone !== this.zone) this.zone = zone;
      const bar = 34;
      if (!zone) { p.style.display = "none"; return; }
      const r = { left: { x: wa.x, y: wa.y + bar, w: wa.w / 2, h: wa.h }, right: { x: wa.x + wa.w / 2, y: wa.y + bar, w: wa.w / 2, h: wa.h }, max: { x: wa.x, y: wa.y + bar, w: wa.w, h: wa.h } }[zone] ||
        { tl: { x: wa.x, y: wa.y + bar, w: wa.w / 2, h: wa.h / 2 }, tr: { x: wa.x + wa.w / 2, y: wa.y + bar, w: wa.w / 2, h: wa.h / 2 }, bl: { x: wa.x, y: wa.y + bar + wa.h / 2, w: wa.w / 2, h: wa.h / 2 }, br: { x: wa.x + wa.w / 2, y: wa.y + bar + wa.h / 2, w: wa.w / 2, h: wa.h / 2 } }[zone];
      Object.assign(p.style, { display: "block", left: r.x + "px", top: r.y + "px", width: r.w + "px", height: r.h + "px" });
    },
    drop() {
      const zone = this.zone;
      this.zone = null;
      $("#snap-preview").style.display = "none";
      return zone;
    },
  };

  /* ----------------------------- shell bar / dock ------------------------ */
  const Shell = {
    focused: null,
    setFocus(win) {
      this.focused = win;
      const fa = $("#focus-app"), fs = $("#focus-sub");
      if (!win) { fa.textContent = "Desktop"; fs.textContent = ""; }
      else { fa.textContent = win.title; fs.textContent = win.sub || ""; }
      Dock.render();
    },
    clockTick() {
      const d = new Date();
      const t = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: state.hour12 });
      $("#clock-time").textContent = t;
      $("#clock-date").textContent = d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
      $("#launcher-clock").textContent = d.toLocaleTimeString([], { hour12: state.hour12 });
      const cl = $("#clock-full");
      if (cl) cl.textContent = `${d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}, ${t}`;
    },
    setProxyBadge(status, text) {
      const b = $("#badge-proxy");
      b.className = "bar-badge" + (status === "ok" ? "" : status === "warn" ? " warn" : " bad");
      $("#badge-proxy-text").textContent = text;
      b.title = (Proxy.status.detail || "") + "\nWisp: " + state.wisp;
    },
  };

  const Dock = {
    render() {
      const dock = $("#dock");
      const apps = Registry.pinned();
      const running = new Set([...wins.values()].map((w) => w.appId));
      dock.innerHTML = "";
      const add = (app) => {
        const item = el("button", { class: "dock-item", title: app.name, "aria-label": app.name });
        item.innerHTML = `<span class="${app.iconHtml ? "" : "em"}">${app.iconHtml || app.emoji || "▫"}</span>` + (running.has(app.id) ? '<span class="running"></span>' : "") + `<span class="tip">${esc(app.name)}</span>`;
        if (app.iconHtml) item.querySelector("span").innerHTML = app.iconHtml;
        item.addEventListener("click", () => {
          const open = [...wins.values()].filter((w) => w.appId === app.id);
          if (open.length) {
            const w = open.find((x) => x.state === "minimized") || open[0];
            w.state === "minimized" ? w.restore() : w.focus();
          } else app.run();
        });
        item.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          const open = [...wins.values()].filter((w) => w.appId === app.id);
          contextMenu([
            { label: "Open", icon: "plus", action: () => app.run() },
            ...open.map((w) => ({ label: w.title, action: () => (w.state === "minimized" ? w.restore() : w.focus()) })),
            { sep: true },
            { label: "App details", icon: "info", action: () => Nebula.AppStore?.openDetails(app) },
          ], e.clientX, e.clientY);
        });
        dock.append(item);
      };
      apps.forEach(add);
      const sep = el("div", { class: "dock-sep" });
      dock.append(sep);
      const gridBtn = el("button", { class: "dock-item", title: "App grid" });
      gridBtn.innerHTML = `<span style="display:grid;place-items:center;width:100%;height:100%">${icon("apps", "width:26px;height:26px")}</span><span class="tip">All apps</span>`;
      gridBtn.addEventListener("click", () => Launcher.toggle(""));
      dock.append(gridBtn);
      if (state.dockHidden) {
        const pinch = el("button", { class: "dock-item", title: "Show dock" });
        pinch.style.cssText = "position:fixed;left:4px;bottom:8px;background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;width:36px;height:36px";
        pinch.innerHTML = icon("menu", "width:18px;height:18px");
        pinch.addEventListener("click", () => set({ dockHidden: false }));
        if (!$("#dock-pinch")) { pinch.id = "dock-pinch"; document.body.append(pinch); }
      } else $("#dock-pinch")?.remove();
    },
  };

  /* ----------------------------- launcher ------------------------------- */
  const Launcher = {
    open: false,
    items: [],
    filtered: [],
    sel: 0,
    toggle(prefill) {
      this.open ? this.close() : this.show(prefill);
    },
    show(prefill = "") {
      this.open = true;
      $("#launcher").classList.add("open");
      const input = $("#launcher-input");
      input.value = prefill || "";
      input.focus();
      this.render(input.value);
    },
    close() {
      this.open = false;
      $("#launcher").classList.remove("open");
    },
    refreshHint() {},
    build() {
      const apps = Registry.all().map((a) => ({ kind: "app", id: a.id, name: a.name, sub: a.sub || "Application", emoji: a.emoji, iconHtml: a.iconHtml, action: () => a.run() }));
      const cmds = [
        { kind: "cmd", name: "Change theme", sub: "theme <crimson|terracotta|marigold|emerald|aqua|glacier>", icon: "palette", action: () => Settings.open("appearance") },
        { kind: "cmd", name: "Change proxy engine", sub: "uv · scramjet v2 · scramjet", icon: "cloud", action: () => Settings.open("proxy") },
        { kind: "cmd", name: "Change transport", sub: "epoxy · libcurl", icon: "bolt", action: () => Settings.open("proxy") },
        { kind: "cmd", name: "Change search engine", sub: "duckduckgo · google · brave", icon: "search", action: () => Settings.open("search") },
        { kind: "cmd", name: "Wisp server", sub: state.wisp, icon: "wifi", action: () => Settings.open("proxy") },
        { kind: "cmd", name: "Cloak tab", sub: "about:blank / history hiding", icon: "eye-off", action: () => Privacy.cloak() },
        { kind: "cmd", name: "Convert tab to blob URL", sub: "hides the page from history", icon: "blob", action: () => Privacy.toBlob() },
        { kind: "cmd", name: "Anti-close", sub: state.anticlose ? "enabled" : "disabled", icon: "shield", action: () => set({ anticlose: !state.anticlose }) },
        { kind: "cmd", name: "Browse the web (proxy)", sub: "open Nebula Browser", icon: "globe", action: () => Nullset.open("browser") },
        { kind: "cmd", name: "Open Discord", sub: "login through the proxy", icon: "discord", action: () => Nullset.open("discord") },
        { kind: "cmd", name: "Restart proxy stack", sub: "re-register service worker + transports", icon: "reload", action: () => Proxy.restart(true) },
        { kind: "cmd", name: "Run connection test", sub: "wisp + transport + engine", icon: "bolt", action: () => Proxy.probeAll(true) },
      ];
      this.items = [...apps, ...cmds];
    },
    render(q) {
      const body = $("#launcher-body");
      const query = (q || "").trim().toLowerCase();
      const all = this.items.length ? this.items : (this.build(), this.items);
      this.filtered = query
        ? all.filter((i) => (i.name + " " + (i.sub || "")).toLowerCase().includes(query)).slice(0, 40)
        : all.filter((i) => i.kind === "app");
      this.sel = 0;
      body.innerHTML = "";
      if (query) {
        if (!this.filtered.length) { body.innerHTML = `<div class="empty">No results for “${esc(q)}”</div>`; return; }
        body.append(el("div", { class: "lsection", text: "Results" }));
        this.filtered.forEach((item, idx) => {
          const row = el("button", { class: "lresult" });
          row.innerHTML = `<span class="ico" style="background:var(--accent-soft);color:var(--accent)">${item.iconHtml || icon(item.icon || "apps", "width:17px;height:17px")}</span><span class="grow"><span class="nm">${esc(item.name)}</span><br><span class="sub">${esc(item.sub || "")}</span></span>`;
          row.addEventListener("click", () => { this.close(); item.action(); });
          body.append(row);
        });
      } else {
        const groups = {};
        for (const item of this.filtered) (groups[item.category || "Applications"] ||= []).push(item);
        for (const [cat, items] of Object.entries(groups)) {
          body.append(el("div", { class: "lsection", text: cat }));
          const grid = el("div", { class: "lgrid" });
          for (const item of items) {
            const tile = el("button", { class: "app-tile" });
            tile.innerHTML = `<span class="ico" style="background:${item.tint || "var(--accent-soft)"};color:var(--accent)">${item.iconHtml || item.emoji || icon("apps", "width:22px;height:22px")}</span><span class="nm">${esc(item.name)}</span><span class="sub">${esc(item.sub || "")}</span>`;
            tile.addEventListener("click", () => { this.close(); item.action(); });
            grid.append(tile);
          }
          body.append(grid);
        }
      }
    },
    key(e) {
      if (e.key === "Escape") { this.close(); return; }
      if (!this.filtered.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const rows = $$(".lresult", $("#launcher-body"));
        if (!rows.length) return;
        e.preventDefault();
        this.sel = clamp(this.sel + (e.key === "ArrowDown" ? 1 : -1), 0, rows.length - 1);
        rows.forEach((r, i) => r.classList.toggle("sel", i === this.sel));
        rows[this.sel].scrollIntoView({ block: "nearest" });
      }
      if (e.key === "Enter") {
        const target = this.filtered[this.sel] || this.filtered[0];
        this.close();
        target?.action();
      }
    },
  };

  /* ----------------------------- privacy --------------------------------- */
  const Privacy = {
    presets: {
      blank: { title: "about:blank", icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>" },
      google: { title: "Google", icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><rect width='48' height='48' rx='10' fill='%23fff'/><text x='24' y='32' font-size='26' font-family='Arial' text-anchor='middle' fill='%234285f4'>G</text></svg>" },
      drive: { title: "My Drive - Google Drive", icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><rect width='48' height='48' rx='10' fill='%23fff'/><text x='24' y='32' font-size='24' font-family='Arial' text-anchor='middle' fill='%2334a853'>D</text></svg>" },
      classroom: { title: "Classes", icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><rect width='48' height='48' rx='10' fill='%23fff'/><text x='24' y='32' font-size='24' font-family='Arial' text-anchor='middle' fill='%23fbbc05'>C</text></svg>" },
    },
    applyCloak() {
      const preset = state.cloakPreset === "custom"
        ? { title: state.cloakCustom || "about:blank", icon: "" }
        : this.presets[state.cloakPreset] || this.presets.blank;
      document.title = preset.title;
      let link = $("link[rel='icon']");
      if (!link) { link = el("link", { rel: "icon" }); document.head.append(link); }
      link.href = preset.icon || "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>";
    },
    uncloak() { document.title = "NebulaOS"; $("link[rel='icon']")?.remove(); },
    cloak() {
      this.applyCloak();
      toast("Tab cloaked", `Title is now “${document.title}”. History entries for this tab are minimised.`, "ok", 4200);
    },
    normalUrl() {
      try {
        const raw = Proxy.appLocation().href || "";
        if (!raw.startsWith("blob:")) return raw;
      } catch {}
      try { return localStorage.getItem("nebula.blobReturn") || ""; } catch { return ""; }
    },
    exitBlob() {
      const back = localStorage.getItem("nebula.blobReturn");
      sessionStorage.removeItem("nebula.blobbed");
      if (back) location.replace(back);
      else dialog({ title: "Blob mode", icon: "info", msg: "This session is running from a blob: URL and the original address was not stored. Open the NebulaOS file again from its normal address.", buttons: [{ label: "OK", primary: true }] });
    },
    async toBlob() {
      try {
        const html = window.__NEBULA_SOURCE__ || "<!DOCTYPE html>" + document.documentElement.outerHTML;
        const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
        const here = this.normalUrl();
        if (here) { try { localStorage.setItem("nebula.blobReturn", here); } catch {} }
        await dialog({
          title: "Convert to blob URL?",
          icon: "blob",
          msg: `The tab will reload from <code>${url.slice(0, 46)}…</code> (a <b>blob:</b> URL).<br><br>Blob URLs are not written to your browser history and vanish when the tab closes, so nothing you do after this shows up as a normal page visit. Your NebulaOS settings are kept.<br><br><b>Trade-off:</b> browsers do not allow service workers on <code>blob:</code> URLs, so the proxied browser is unavailable until you switch back. An “Exit blob mode” button appears in the top bar.`,
          buttons: [
            { label: "Cancel", value: false },
            { label: "Convert now", primary: true, value: true },
          ],
        }).then((ok) => { if (ok) location.replace(url); });
      } catch (err) {
        toast("Blob conversion failed", esc(String(err)), "err");
      }
    },
    initAutoCloak() {
      if (state.abMode === "auto") this.applyCloak();
      if (state.blobMode && !location.protocol.startsWith("blob") && !sessionStorage.getItem("nebula.blobbed")) {
        sessionStorage.setItem("nebula.blobbed", "1");
        this.toBlob();
      }
    },
    initAntiClose() {
      addEventListener("beforeunload", (e) => {
        if (!state.anticlose) return;
        e.preventDefault();
        e.returnValue = "NebulaOS is still running. Leave anyway?";
        return e.returnValue;
      });
    },
  };

  /* ----------------------------- proxy stack ----------------------------- */
  /* --------------------------------------------------------------------------
   * Transport adapter.
   * bare-mux (2.1.6 → 2.1.9) hands transports a plain object of headers, while
   * epoxy-transport 3.x and libcurl-transport 2.x iterate `[key, value]` pairs.
   * This adapter normalises both shapes so any engine works with any transport
   * version, and it also repairs the occasional plain-object websocket headers.
   * ------------------------------------------------------------------------ */
  class NormalizedTransport {
    constructor(inner, label = "transport") {
      this.inner = inner;
      this.label = label;
    }
    get ready() { return !!this.inner.ready; }
    init() { return this.inner.init(); }
    get meta() { return this.inner.meta?.(); }
    static pairs(headers) {
      if (!headers) return [];
      if (Array.isArray(headers)) return headers.map((h) => (Array.isArray(h) ? h : Object.entries(h)[0]));
      if (typeof headers.entries === "function") return [...headers.entries()];
      return Object.entries(headers);
    }
    request(remote, method, body, headers, signal) {
      return this.inner.request(remote, method, body, NormalizedTransport.pairs(headers), signal);
    }
    connect(url, protocols, requestHeaders, onopen, onmessage, onclose, onerror) {
      if (!this.inner.connect) throw new Error("transport has no websocket support");
      return this.inner.connect(url, protocols, NormalizedTransport.pairs(requestHeaders), onopen, onmessage, onclose, onerror);
    }
  }


  const Proxy = {
    reg: null,
    swConfig: null,
    mux: null,
    muxApplied: null,
    transportMode: null,
    _muxBlobUrl: null,
    _standalone: null,
    _standaloneOpts: null,
    sc1Controller: null,
    transportName: null,
    sc2: { controller: null, loaded: false, scriptPromise: null },
    status: { sw: "unknown", transport: "unknown", wisp: "unknown", lastError: "", detail: "" },
    swReady: false,

    baseDir() {
      if (state.baseDir) return state.baseDir;
      let dir = "";
      try {
        let href = this.appLocation().href || "";
        if (href.startsWith("blob:")) href = href.slice(5);
        if (/^https?:/.test(href)) dir = new URL(".", href).pathname;
      } catch {}
      if (!dir) { try { dir = new URL(".", location.href.replace(/^blob:/, "")).pathname; } catch {} }
      if (dir === "/about:") dir = "";           /* about:srcdoc outside the SVG */
      if (!dir.endsWith("/")) dir += "/";
      return dir;
    },
    prefixes() {
      const base = this.baseDir();
      const local = { uv: base + "nb-uv/", sc1: base + "sj1/", sc2: base + "sj2/" };
      const sw = this.swConfig?.prefixes || {};
      return { uv: sw.uv || local.uv, sc1: sw.sc1 || local.sc1, sc2: sw.sc2 || sw.sj2 || local.sc2 };
    },
    /* Build an absolute URL from the *hosting* origin — a blob: document cannot
     * resolve relative URLs against its own location. */
    resolveUrl(path) {
      let origin = location.origin;
      if (!origin || origin === "null") {
        try { origin = new URL(this.appLocation().href.replace(/^blob:/, "")).origin; } catch {}
      }
      try { return new URL(path, origin + "/").href; } catch { return path; }
    },
    swUrl() { return this.resolveUrl(this.baseDir() + "nebula.sw.js"); },
    /* The desktop may live inside the packed SVG's srcdoc iframe (about:srcdoc)
     * or inside a blob: URL, where location.protocol tells us nothing useful.
     * These helpers always report the *hosting document's* context. */
    appLocation() {
      try { if (window.parent !== window && parent.location?.href) return parent.location; } catch {}
      return location;
    },
    appProtocol() { return this.appLocation().protocol || ""; },
    appHost() { return this.appLocation().hostname || ""; },
    secureContextOk() {
      if (this.appProtocol() === "file:") return false;   /* SW is impossible here */
      if (window.isSecureContext) return true;
      const proto = this.appProtocol();
      return proto === "https:" || proto.startsWith("blob") || ["localhost", "127.0.0.1", "[::1]"].includes(this.appHost());
    },

    swWorker(timeout = 6000) {
      /* Returns a ServiceWorker we can postMessage to, waiting out update
       * cycles where registration.active is briefly null. */
      return new Promise(async (resolve) => {
        const t0 = Date.now();
        while (Date.now() - t0 < timeout) {
          const w = this.reg?.active || navigator.serviceWorker?.controller;
          if (w && typeof w.postMessage === "function") return resolve(w);
          await sleep(140);
        }
        resolve(this.reg?.active || navigator.serviceWorker?.controller || null);
      });
    },
    swReadyTimeout() { return this.appProtocol() === "file:" ? 2000 : 12000; },
    blockedHelp() { return this.swBlocked || null; },
    async registerSW() {
      if (this._swPromise) return this._swPromise;
      this._swPromise = this._registerSW();
      try { return await this._swPromise; }
      catch (e) { this._swPromise = null; throw e; }
    },
    async _registerSW() {
      if (!("serviceWorker" in navigator)) throw new Error("Service workers are unavailable in this browser.");
      if (this.appProtocol().startsWith("blob")) throw new Error("Browsers refuse to register service workers from blob: URLs, so blob mode runs without the proxy engine. Everything offline still works — use “Return to the normal page” to get proxying back.");
      if (!this.secureContextOk()) throw new Error("Service workers need HTTPS (or localhost). Open this file from jsDelivr / a web server.");
      const url = this.swUrl();
      this.reg = await navigator.serviceWorker.register(url, { scope: this.resolveUrl(this.baseDir()), updateViaCache: "none" });
      /* Firefox accepts the registration when the desktop is booted from the
       * packed SVG (an about:srcdoc frame whose parent is image/svg+xml) but the
       * worker never finishes installing for that client. Bound the wait and
       * explain the situation instead of stalling the splash screen. */
      const ready = await Promise.race([
        navigator.serviceWorker.ready.then(() => true),
        sleep(this.swReadyTimeout()),
      ]);
      if (!ready) {
        const inFrame = (() => { try { return window.parent !== window && parent.document.contentType === "image/svg+xml"; } catch { return false; } })();
        const hint = inFrame
          ? "This is the packed SVG build running in Firefox: the browser refuses to activate a service worker inside it. Open the HTML build (index.html) — Firefox runs the full proxy there."
          : "The service worker registered but never activated. Reload the page; if it persists, the host may be blocking workers.";
        this.swBlocked = { reason: hint, recover: inFrame ? this.resolveUrl(this.baseDir() + "index.html") : null };
        throw new Error(hint);
      }
      if (!navigator.serviceWorker.controller) {
        await new Promise((resolve) => {
          const t = setTimeout(resolve, 3500);
          navigator.serviceWorker.addEventListener("controllerchange", () => { clearTimeout(t); resolve(); }, { once: true });
        });
      }
      try {
        const chan = new MessageChannel();
        const cfg = await new Promise((resolve) => {
          const t = setTimeout(() => resolve(null), 1500);
          chan.port1.onmessage = (e) => { clearTimeout(t); resolve(e.data); };
          navigator.serviceWorker.controller?.postMessage({ nebula: "config" }, [chan.port2]);
        });
        if (cfg && cfg.prefixes) { this.swConfig = cfg; }
      } catch {}
      this.swReady = true;
      this.swBlocked = null;
      this.status.sw = "ok";
      return this.reg;
    },
    async unregisterSW() {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
      this.swReady = false;
      this.reg = null;
      this.status.sw = "off";
    },

    async loadBareMux() {
      if (this.bareMux) return this.bareMux;
      this.bareMux = await import(LIB.baremux() + "index.mjs");
      return this.bareMux;
    },
    async muxWorkerUrl() {
      /* bare-mux's worker must be same-origin: fetch it from the CDN and hand
       * it to the browser as a blob: URL, which inherits our own origin. */
      if (this._muxBlobUrl) return this._muxBlobUrl;
      const res = await fetch(LIB.baremux() + "worker.js");
      if (!res.ok) throw new Error("Could not fetch the bare-mux worker (" + res.status + ")");
      const code = await res.text();
      this._muxBlobUrl = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
      return this._muxBlobUrl;
    },
    async ensureMux() {
      await this.registerSW();
      const bm = await this.loadBareMux();
      const url = await this.muxWorkerUrl();
      if (!this.mux) this.mux = new bm.BareMuxConnection(url);
      const want = state.transport + "|" + state.wisp;
      if (this.muxApplied === want) return this.transportName;
      /* The transport instance lives on this side of the port, wrapped in the
       * header adapter, and the bare-mux worker proxies to it. This works with
       * every combination of bare-mux / epoxy / libcurl versions. */
      const transport = await this.makeStandaloneTransport();
      if (!transport.ready && transport.init) await transport.init();
      try {
        await this.mux.setRemoteTransport(transport, TRANSPORTS[state.transport].name);
        this.transportMode = "remote";
      } catch (err) {
        /* Last resort: let the worker import the module itself. */
        const tUrl = state.transport === "libcurl" ? LIB.libcurl() : LIB.epoxy();
        await this.mux.setTransport(tUrl, [{ wisp: state.wisp }]);
        this.transportMode = "worker";
      }
      this.transportName = await this.mux.getTransport();
      this.muxApplied = want;
      this.status.transport = "ok";
      return this.transportName;
    },
    async makeStandaloneTransport() {
      if (this._standalone && this._standaloneOpts === state.transport + "|" + state.wisp) return this._standalone;
      const mod = await import(state.transport === "libcurl" ? LIB.libcurl() : LIB.epoxy());
      const T = mod.default || mod.LibcurlClient || mod.EpoxyTransport;
      const inst = new NormalizedTransport(new T({ wisp: state.wisp }), state.transport);
      this._standalone = inst;
      this._standaloneOpts = state.transport + "|" + state.wisp;
      return inst;
    },

    loadScript(src) {
      return new Promise((resolve, reject) => {
        const s = el("script", { src, onload: () => resolve(), onerror: () => reject(new Error("Could not load " + src)) });
        document.head.append(s);
      });
    },
    async loadSc2Lib() {
      if (this.sc2.loaded) return;
      /* The Scramjet v2 controller bundle needs the Scramjet runtime as a
       * global first ("Load scramjet before the controller"). */
      if (!globalThis.$scramjet) this.sc2.runtimePromise ||= this.loadScript(LIB.sc2() + "scramjet.js");
      await this.sc2.runtimePromise;
      if (!globalThis.$scramjetController) this.sc2.scriptPromise ||= this.loadScript(LIB.sc2ctl() + "controller.api.js");
      await this.sc2.scriptPromise;
      if (!globalThis.$scramjetController) throw new Error("The Scramjet v2 controller bundle exposed no API.");
      this.sc2.loaded = true;
    },

    /* Scramjet keeps its config + cookie jar in the "$scramjet" IndexedDB.
     * Its service-worker half opens that database without an upgrade handler,
     * which can create it with no object stores and break the page half with
     * "object store was not found". Create (or repair) it before any engine
     * boots so both halves always agree. */
    async ensureScramjetDB() {
      /* Scramjet v1 opens "$scramjet" (v1) with no upgrade handler, so the store
       * must already exist or it throws "One of the specified object stores was
       * not found". We pre-create it — but carefully: every IndexedDB request
       * here is bounded, because Firefox can leave an *aborted* version-change
       * request silent (no success, no error), which used to hang the whole
       * boot in front of the splash screen. */
      const STORES = ["config", "cookies", "redirectTrackers", "referrerPolicies", "publicSuffixList"];
      const bounded = (fn, ms = 2500) => new Promise((resolve) => {
        let settled = false;
        const done = (v) => { if (!settled) { settled = true; clearTimeout(t); resolve(v); } };
        const t = setTimeout(() => done(null), ms);
        try {
          const req = fn();
          req.onsuccess = () => done(req.result);
          req.onerror = () => done(null);
          req.onblocked = () => done(null);
        } catch { done(null); }
      });
      const create = async () => {
        const db = await bounded(() => {
          const req = indexedDB.open("$scramjet", 1);
          req.onupgradeneeded = () => {
            const d = req.result;
            for (const s of STORES) if (!d.objectStoreNames.contains(s)) d.createObjectStore(s);
          };
          return req;
        }, 3000);
        if (!db) return false;
        try { db.close(); } catch {}
        return true;
      };
      try {
        const existing = await bounded(() => {
          const req = indexedDB.open("$scramjet", 1);
          req.onupgradeneeded = () => { try { req.transaction?.abort?.(); } catch {} };
          return req;
        });
        if (!existing || !existing.objectStoreNames) return create();      /* did not exist (or silent abort) → build it */
        const missing = STORES.filter((s) => !existing.objectStoreNames.contains(s));
        try { existing.close(); } catch {}
        if (!missing.length) return true;
        await bounded(() => indexedDB.deleteDatabase("$scramjet"), 2000);
        return create();
      } catch { return false; }
    },

    async ensureEngine(engine) {
      if (engine === "sc2") {
        await this.registerSW();
        await this.ensureScramjetDB();
        await this.loadSc2Lib();
        const Controller = globalThis.$scramjetController.Controller;
        const transport = await this.makeStandaloneTransport();
        const controller = new Controller({
          serviceworker: await this.swWorker(),
          transport,
          config: {
            prefix: this.prefixes().sc2,
            scramjetPath: LIB.sc2() + "scramjet.js",
            injectPath: LIB.sc2ctl() + "controller.inject.js",
            wasmPath: LIB.sc2() + "scramjet.wasm",
            virtualWasmPath: "scramjet.wasm.js",
            codec: { encode: (u) => (u ? encodeURIComponent(u) : u), decode: (u) => (u ? decodeURIComponent(u) : u) },
          },
        });
        await controller.wait();
        this.sc2.controller = controller;
        return controller;
      }
      if (engine === "sc1") {
        await this.ensureMux();
        await this.ensureScramjetDB();
        if (!this.sc1Controller) {
          if (!globalThis.$scramjetLoadController) await this.loadScript(LIB.sc1() + "scramjet.all.js");
          const loader = globalThis.$scramjetLoadController?.();
          if (!loader?.ScramjetController) throw new Error("Scramjet 1 failed to expose its controller.");
          const prefix = this.prefixes().sc1;
          this.sc1Controller = new loader.ScramjetController({
            prefix,
            files: { wasm: LIB.sc1() + "scramjet.wasm.wasm", all: LIB.sc1() + "scramjet.all.js", sync: LIB.sc1() + "scramjet.sync.js" },
          });
          await this.sc1Controller.init();
        }
        return this.sc1Controller;
      }
      /* Ultraviolet: the rewriting happens inside the service worker; the page
       * only needs the codec (for building URLs) and the mux transport. */
      await this.ensureMux();
      if (!globalThis.Ultraviolet) await this.loadScript(LIB.uv() + "uv.bundle.js");
      return globalThis.Ultraviolet;
    },

    buildUrl(targetUrl, engine) {
      const p = this.prefixes();
      if (engine === "sc2") {
        const enc = encodeURIComponent(targetUrl);
        const base = this.sc2.controller ? this.sc2.controller.prefix : p.sc2;
        return base + enc;
      }
      if (engine === "sc1") {
        /* Scramjet's own encodeUrl already returns "/sj1/<encoded>" — never
         * prepend the prefix twice. */
        const enc = this.sc1Controller ? this.sc1Controller.encodeUrl(targetUrl) : "/" + encodeURIComponent(targetUrl);
        if (/^https?:/i.test(enc) || enc.startsWith(p.sc1) || enc.startsWith("/" + this.prefixes().sc1.replace(/^\//, ""))) return enc;
        return p.sc1 + enc.replace(/^\//, "");
      }
      const U = globalThis.Ultraviolet;
      const enc = U ? U.codec.xor.encode(targetUrl) : encodeURIComponent(targetUrl);
      return p.uv + enc;
    },
    decodeUrl(proxiedUrl) {
      if (!proxiedUrl) return "";
      try {
        const p = this.prefixes();
        const u = new URL(proxiedUrl, location.href);
        const path = u.pathname;
        const finish = (rest) => {
          if (!rest) return null;
          /* Scramjet + Ultraviolet encode with encodeURIComponent */
          let out = null;
          try { const d = decodeURIComponent(rest); if (/^https?:/i.test(d)) out = d; } catch {}
          /* Ultraviolet's xor codec leaves no readable URL, decode it properly */
          if (!out && globalThis.Ultraviolet?.codec?.xor) {
            try { const d = globalThis.Ultraviolet.codec.xor.decode(rest); if (/^https?:/i.test(d)) out = d; } catch {}
          }
          if (!out && this.sc1Controller) { try { const d = this.sc1Controller.decodeUrl(rest); if (/^https?:/i.test(d)) out = d; } catch {} }
          if (!out && /^https?:/i.test(rest)) out = rest;
          return out ? out + (u.search || "") + (u.hash || "") : null;
        };
        if (path.startsWith(p.sc2)) {
          /* /sj2/<controllerId>/<frameId>/<encoded url> */
          const rest = path.slice(p.sc2.length).replace(/^[^/]+\/[^/]+\//, "");
          const v = finish(rest);
          if (v) return v;
        }
        if (path.startsWith(p.sc1)) { const v = finish(path.slice(p.sc1.length)); if (v) return v; }
        if (path.startsWith(p.uv)) { const v = finish(path.slice(p.uv.length)); if (v) return v; }
        /* unknown prefix: try to find the encoding anywhere after the first slash-run */
        const m = path.match(/^(?:\/[^/]+)*?\/([^/]*https?%3A.*)$/i);
        if (m) { const v = finish(m[1]); if (v) return v; }
        return decodeURIComponent(path.replace(/^\//, "")) || proxiedUrl;
      } catch { return proxiedUrl; }
    },
    /* Turn whatever the user typed into a real URL (or a search URL). */
    toUrl(raw) {
      let url = String(raw || "").trim();
      if (!url) return "";
      const looksUrl = /^[a-z]+:\/\//i.test(url) || (/^[\w-]+(\.[\w-]+)+(\/|$|\?|:)/.test(url) && !url.includes(" "));
      if (!looksUrl) return this.searchUrl(url);
      if (!/^[a-z]+:\/\//i.test(url)) url = "https://" + url;
      return url;
    },
    searchUrl(q) {
      const tpl = state.search === "custom" ? state.searchCustom : SEARCH_ENGINES[state.search].url;
      return tpl.replace("%s", encodeURIComponent(q));
    },

    async probeWisp(url = state.wisp, timeout = 6000) {
      return new Promise((resolve) => {
        let done = false;
        let ws;
        const finish = (ok, detail) => { if (done) return; done = true; try { ws?.close(); } catch {}; resolve({ ok, detail }); };
        try { ws = new WebSocket(url); } catch (e) { return finish(false, String(e.message || e)); }
        const timer = setTimeout(() => finish(false, "Timed out after " + timeout / 1000 + "s"), timeout);
        ws.onopen = () => { clearTimeout(timer); finish(true, "WebSocket connected"); };
        ws.onerror = () => { clearTimeout(timer); finish(false, "Connection refused / blocked"); };
      });
    },
    /* Fetch a page's text through the proxy (the service worker rewrites it),
     * used by the Quantum browser's Source panel. */
    async fetchText(url, engine = state.engine, timeout = 15000) {
      const target = this.toUrl(url);
      try { await this.registerSW(); } catch {}
      /* A page only gets the service worker's rewriting once the worker is in
       * control. Until then a request to the proxied path hits the static host
       * and comes back 500. In that case go straight through the transport. */
      if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
        await this.ensureMux();
        const bm = await this.loadBareMux();
        const client = new bm.BareClient(this.mux.getInnerPort());
        const res = await client.fetch(target);
        return { ok: res.status >= 200 && res.status < 400, status: res.status, text: await res.text(), proxied: target, via: "transport" };
      }
      /* the worker can only rewrite a request once the engine + transport are
       * actually set up, otherwise it answers 500 */
      try { await this.ensureEngine(engine); } catch {}
      const proxied = this.buildUrl(target, engine);
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), timeout);
      try {
        const res = await fetch(proxied, { credentials: "omit", signal: ctl.signal });
        return { ok: res.ok, status: res.status, text: await res.text(), proxied };
      } finally { clearTimeout(t); }
    },
    /* ==========================================================================
     *  Network check — works out WHICH layer is broken, not just "proxy bad".
     *  School filters (ContentKeeper, Cisco Umbrella, GoGuardian) usually allow
     *  plain HTTPS and block WebSocket upgrades, which looks like "the relay is
     *  down" from inside the app. This separates the two.
     * ======================================================================== */
    async netCheck(loud = true) {
      const rows = [];
      const push = (ok, label, detail) => { rows.push({ ok, label, detail }); return ok; };
      const race = (pr, ms) => Promise.race([pr, new Promise((_, rj) => setTimeout(() => rj(new Error("timed out after " + ms / 1000 + "s")), ms))]);
      const openWS = (url, ms = 6000) => new Promise((res, rej) => {
        let ws, done = false;
        const fin = (ok, why) => { if (done) return; done = true; try { ws && ws.close(); } catch {}; ok ? res(true) : rej(new Error(why)); };
        try { ws = new WebSocket(url); } catch (e) { return fin(false, "blocked by the browser"); }
        ws.onopen = () => fin(true);
        ws.onerror = () => fin(false, "refused or blocked");
        setTimeout(() => fin(false, "no response"), ms);
      });

      /* 1 — plain HTTPS off-origin */
      let httpsOk = false;
      try {
        const t0 = performance.now();
        await race(fetch("https://cdn.jsdelivr.net/gh/Skidware-osint-dc/nebulaos@v1.0.2/README.md", { mode: "no-cors", cache: "no-store" }), 8000);
        httpsOk = push(true, "Plain HTTPS", `reached cdn.jsdelivr.net in ${Math.round(performance.now() - t0)} ms`);
      } catch (e) { push(false, "Plain HTTPS", String(e.message || e)); }

      /* 2 — can this browser open a WebSocket to a neutral host at all? */
      let wsOk = false, wsWhy = "";
      for (const ctrl of ["wss://ws.postman-echo.com/raw", "wss://echo.websocket.org/"]) {
        try { await openWS(ctrl, 7000); wsOk = true; break; }
        catch (e) { wsWhy = String(e.message || e); }
      }
      push(wsOk, "WebSockets (neutral host)", wsOk ? "this browser can open websockets" : `no websocket anywhere — ${wsWhy}`);

      /* 3 — each relay: is the host reachable, does the socket open, does it proxy */
      let winner = null;
      for (const pre of WISP_PRESETS.slice(0, 6)) {
        let host = ""; try { host = new URL(pre.url).host; } catch {}
        if (pre.url.startsWith("ws://localhost")) continue;
        let https = false;
        try { await race(fetch(pre.url.replace(/^ws/, "http"), { mode: "no-cors", cache: "no-store" }), 6000); https = true; } catch {}
        let opened = false;
        try { await openWS(pre.url, 6000); opened = true; } catch {}
        let proxied = false;
        if (opened) {
          try {
            set({ wisp: pre.url }, { silent: true });
            await race(this.restart(), 8000).catch(() => {});
            const r = await race(this.probeFetch(), 11000);
            proxied = !!r.ok;
            if (proxied && !winner) winner = pre;
          } catch {}
        }
        const state3 = proxied ? "proxies traffic" : opened ? "socket opened, traffic refused" : https ? "socket blocked (HTTPS ok)" : "host unreachable";
        push(proxied, pre.name, `${host} — ${state3}`);
      }

      /* 4 — verdict */
      let verdict, advice;
      if (winner) {
        set({ wisp: winner.url }, { silent: true });
        await this.restart().catch(() => {});
        verdict = `Working: switched to ${winner.name} (${winner.url})`;
        advice = "Browsing should work now. The browser is using this relay.";
        if (loud) toast("Network check", `Relay is working — using <b>${winner.name}</b>.`, "ok", 6000);
      } else if (!httpsOk) {
        verdict = "This network is blocking everything, not just the proxy";
        advice = "Even a plain HTTPS request failed, so the filter is intercepting all traffic. Try a phone hotspot.";
      } else if (!wsOk) {
        verdict = "Your network allows HTTPS but blocks WebSockets";
        advice = "That is exactly what ContentKeeper / Cisco Umbrella do. No public relay can work here — the proxy needs a WebSocket. Options: use a phone hotspot, use the app off-network, or ask IT to allow wss:// to a specific host.";
      } else {
        verdict = "WebSockets work, but no relay carried traffic";
        advice = "Relays are reachable but refusing requests (usually rate-limited or full). Paste your own relay in Settings → Proxy, or run npx wisp-server-node on any machine you control.";
      }
      this.lastNetCheck = { at: Date.now(), rows, verdict, advice };
      if (loud) void dialog({
        title: "Network check", icon: "wifi", wide: true,
        msg: `<div style="font-weight:650;margin-bottom:8px">${esc(verdict)}</div>
              <div style="opacity:.8;margin-bottom:12px">${esc(advice)}</div>` +
             rows.map((r) => `<div style="display:flex;gap:9px;margin:6px 0"><b style="color:${r.ok ? "#2fa472" : "#e0455f"}">${r.ok ? "✔" : "✘"}</b><span><b>${esc(r.label)}</b><br><span style="opacity:.7">${esc(r.detail)}</span></span></div>`).join(""),
        buttons: [{ label: "Close", primary: true }, { label: "Open Settings → Proxy", value: "proxy" }],
      }).then((v) => { if (v === "proxy") Settings.open("proxy"); });
      return { verdict, advice, rows };
    },
    async probeFetch(engine = state.engine) {
      const target = "https://example.com/";
      const t0 = performance.now();
      if (engine === "sc2" || engine === "sc1") {
        await this.ensureEngine(engine);
        const transport = await this.makeStandaloneTransport();
        if (!transport.ready) await transport.init();
        const res = await transport.request(new URL(target), "GET", null, [], undefined);
        return { ok: res.status > 0, status: res.status, ms: Math.round(performance.now() - t0), via: "direct" };
      }
      await this.ensureMux();
      if (this.transportMode === "remote" && this.remoteTransport) {
        const r = await this.remoteTransport.request(new URL(target), "GET", null, [], undefined);
        return { ok: r.status > 0, status: r.status, ms: Math.round(performance.now() - t0), via: "remote" };
      }
      const bm = await this.loadBareMux();
      const client = new bm.BareClient(this.mux.getInnerPort());
      const res = await client.fetch(target);
      return { ok: res.status > 0, status: res.status, ms: Math.round(performance.now() - t0), via: "mux" };
    },
    async probeAll(loud = false) {
      const out = [];
      const push = (ok, label, detail) => out.push({ ok, label, detail });
      push(this.secureContextOk(), "Secure context", this.secureContextOk() ? location.protocol : "Service workers require https:// or localhost");
      try { await this.registerSW(); push(true, "Service worker", this.swUrl()); } catch (e) { push(false, "Service worker", String(e.message || e)); }
      try {
        const name = await this.ensureMux();
        push(true, `Transport (${TRANSPORTS[state.transport].name})`, `mux responded with “${name}” via the ${this.transportMode} path`);
      } catch (e) { push(false, `Transport (${TRANSPORTS[state.transport].name})`, String(e.message || e)); }
      const wisp = await this.probeWisp();
      push(wisp.ok, "Wisp server", `${state.wisp} — ${wisp.detail}`);
      this.status.wisp = wisp.ok ? "ok" : "bad";
      Shell.setProxyBadge(this.status.sw === "ok" && this.status.transport === "ok" && wisp.ok ? "ok" : "bad",
        wisp.ok && this.status.transport === "ok" ? "Proxy: ready" : "Proxy: issue");
      if (loud) {
        const failed = out.filter((o) => !o.ok);
        void dialog({
          title: failed.length ? "Proxy diagnostics — issues found" : "Proxy diagnostics — all good",
          icon: failed.length ? "warn" : "check",
          wide: true,
          msg: out.map((o) => `<div style="display:flex;gap:9px;margin:7px 0"><b style="color:${o.ok ? "#2fa472" : "#e0455f"}">${o.ok ? "✔" : "✘"}</b><span><b>${esc(o.label)}</b><br><span style="opacity:.75">${esc(o.detail)}</span></span></div>`).join(""),
          buttons: [{ label: "Close", primary: true }],
        });
      }
      return out;
    },
    /* Warm the selected engine in the background so the first navigation does
     * not race the config hand-off (hidden cost, no splash delay). */
    warm(engine = state.engine) {
      setTimeout(async () => {
        try {
          if (engine === "sc1" || engine === "sc2") await this.ensureEngine(engine);
          else await this.ensureMux();
          this.status.warm = engine;
        } catch (e) { bootLog("warm-up: " + (e.message || e)); }
      }, 2200);
    },
    async restart(loud = false) {
      try {
        this.mux = null;
        this.muxApplied = null;
        this.transportName = null;
        this.transportMode = null;
        this._standalone = null;
        this._standaloneOpts = null;
        this.sc1Controller = null;
        this.sc2 = { controller: null, loaded: false, scriptPromise: null, runtimePromise: null };
        await this.ensureMux();
        if (loud) toast("Proxy restarted", `${ENGINES[state.engine].name} · ${TRANSPORTS[state.transport].name} → ${state.wisp}`, "ok");
      } catch (e) {
        if (loud) toast("Proxy restart failed", esc(String(e.message || e)), "err", 7000);
      }
    },
    async boot() {
      try {
        await this.ensureScramjetDB();
        await this.registerSW();
        Shell.setProxyBadge("warn", "Proxy: starting");
        await this.probeAll(false);
        if (this.status.wisp !== "ok" && state.wispAutoRetry && !state.wispPinned) {
          for (const p of WISP_PRESETS) {
            if (p.url === state.wisp || p.url.startsWith("ws://localhost")) continue;
            const r = await this.probeWisp(p.url, 5000);
            bootLog(`wisp ${p.url} → ${r.ok ? "ok" : r.detail}`);
            if (!r.ok) continue;
            set({ wisp: p.url }, { silent: true });
            await this.restart();
            let fetchOk = false;
            try { fetchOk = (await this.probeFetch()).ok; } catch { fetchOk = false; }
            bootLog(`wisp ${p.url} → ${fetchOk ? "carried a real request" : "connected but could not proxy"}`);
            if (fetchOk) {
              this.status.wisp = "ok";
              Shell.setProxyBadge("ok", "Proxy: ready");
              toast("Relay switched", `The configured Wisp could not proxy, so NebulaOS fell back to <b>${p.name}</b> (${p.url}).`, "ok", 7000);
              break;
            }
          }
        }
      } catch (e) {
        this.status.lastError = String(e.message || e);
        this.status.sw = "bad";
        Shell.setProxyBadge("bad", "Proxy: unavailable");
        bootLog("Proxy unavailable: " + e.message);
        const blocked = this.blockedHelp();
        if (blocked && blocked.recover && !localStorage.getItem("nebula.swBlockedNotice")) {
          localStorage.setItem("nebula.swBlockedNotice", "1");
          setTimeout(() => {
            dialog({
              title: "This browser needs the HTML build for the proxy",
              icon: "warn", wide: true,
              msg: `${esc(blocked.reason)}<br><br>
                <b>Everything else works here</b> — the desktop, the apps, the games, the themes.<br><br>
                <code>${esc(blocked.recover)}</code>`,
              buttons: [{ label: "Stay in the SVG", value: null },
                        { label: "Open the HTML build", primary: true, value: "go" }],
            }).then((v) => { if (v === "go") window.open(blocked.recover, "_blank"); });
          }, 1200);
        }
        if (this.appProtocol() === "file:") {
          setTimeout(() => {
            dialog({
              title: "Running locally: the proxy needs a web server",
              icon: "info", wide: true,
              msg: `<b>NebulaOS is running, and every offline app works.</b> Browsing through the proxy does not, because browsers refuse to run service workers from <code>file://</code> URLs.<br><br>
                To enable the proxied browser, serve this folder over HTTP — for example:<br>
                <code>python3 -m http.server 8000</code><br>
                then open <code>http://localhost:8000/NebulaOS.html</code>. On a real host (jsDelivr, GitHub Pages, Netlify…) it just works.<br><br>
                Remember: <code>nebula.sw.js</code> must sit in the <b>same folder</b> as this file.`,
              buttons: [{ label: "Got it", primary: true }],
            });
          }, 1200);
          return;
        }
        if (!this._warned) {
          this._warned = true;
          toast("Proxy unavailable", esc(this.status.lastError) + "<br><br>Offline apps, games, files and settings all still work. Open <b>Settings → Proxy</b> to run diagnostics.", "err", 12000);
        }
      }
    },
  };

  /* ----------------------------- settings app ---------------------------- */
  const Settings = {
    panes: [
      { id: "appearance", name: "Appearance", icon: "palette" },
      { id: "proxy", name: "Proxy", icon: "cloud" },
      { id: "search", name: "Search", icon: "search" },
      { id: "privacy", name: "Privacy", icon: "shield" },
      { id: "system", name: "System", icon: "info" },
    ],
    current: "appearance",
    win: null,
    open(pane) {
      if (pane) this.current = pane;
      if (this.win && wins.has(this.win.id)) { this.win.focus(); this.render(); return this.win; }
      this.win = new Win({
        appId: "settings",
        title: "Settings",
        iconHtml: icon("gear", "width:16px;height:16px"),
        width: 900, height: 620, solid: true,
        onClose: () => { this.win = null; },
      });
      this.render();
      return this.win;
    },
    render() {
      const w = this.win;
      if (!w) return;
      const pane = this.panes.find((p) => p.id === this.current) || this.panes[0];
      w.content.innerHTML = "";
      const split = el("div", { class: "settings" });
      const side = el("div", { class: "side" });
      for (const p of this.panes) {
        const b = el("button", { class: `si ${p.id === pane.id ? "on" : ""}` });
        b.innerHTML = `${icon(p.icon, "width:15px;height:15px")}<span>${p.name}</span>`;
        b.addEventListener("click", () => { this.current = p.id; this.render(); });
        side.append(b);
      }
      const main = el("div", { class: "pane" });
      const renderers = { appearance: this.renderAppearance, proxy: this.renderProxy, search: this.renderSearch, privacy: this.renderPrivacy, system: this.renderSystem };
      renderers[pane.id].call(this, main);
      split.append(side, main);
      w.content.append(split);
    },

    row(label, hint, control) {
      const f = el("label", { class: "field" });
      f.innerHTML = `<span class="lbl">${label}</span>`;
      f.append(control);
      if (hint) f.append(el("span", { class: "hint", html: hint }));
      return f;
    },
    segmented(options, value, onPick) {
      const seg = el("div", { class: "seg", style: "flex-wrap:wrap" });
      for (const o of options) {
        const b = el("button", { class: o.value === value ? "on" : "", text: o.label });
        b.addEventListener("click", () => { onPick(o.value); this.render(); });
        seg.append(b);
      }
      return seg;
    },
    toggle(value, onToggle) {
      const s = el("button", { class: "switch " + (value ? "on" : ""), role: "switch", "aria-checked": String(!!value) });
      s.addEventListener("click", () => { const nv = !s.classList.contains("on"); s.classList.toggle("on", nv); onToggle(nv); });
      return s;
    },

    renderAppearance(pane) {
      pane.append(el("h1", { text: "Appearance" }), el("div", { class: "psub", text: "Themes, wallpaper, dock behaviour and motion." }));
      const sect = el("section");
      sect.append(el("h2", { class: "sect", text: "Theme" }));
      const grid = el("div", { class: "theme-grid" });
      for (const t of THEMES) {
        const card = el("button", { class: "theme-card " + (state.theme === t.id ? "on" : "") });
        card.innerHTML = `<div class="sw" style="background:linear-gradient(135deg,${t.colors[0]},${t.colors[1]});display:grid;place-items:center"><div style="width:34px;height:34px;border-radius:11px;background:${t.colors[2]};opacity:.9"></div></div>
          <div class="meta"><span class="nm">${t.name}</span>${state.theme === t.id ? icon("check", "width:15px;height:15px;color:var(--accent)") : ""}</div>`;
        card.addEventListener("click", () => { set({ theme: t.id }); this.render(); });
        grid.append(card);
      }
      sect.append(grid);
      pane.append(sect);

      const sect2 = el("section");
      sect2.append(el("h2", { class: "sect", text: "Wallpaper" }));
      const walls = el("div", { class: "theme-grid" });
      for (const wp of WALLS) {
        const card = el("button", { class: "theme-card " + (state.wallpaper === wp.id ? "on" : "") });
        const preview = wp.id === "aurora" ? "var(--wp-aurora)" : wp.id === "glacier" ? "var(--wp-glacier)" : "var(--wallpaper)";
        card.innerHTML = `<div class="sw" style="background-image:${preview};background-size:cover;background-position:center"></div><div class="meta"><span class="nm">${wp.name}</span>${state.wallpaper === wp.id ? icon("check", "width:15px;height:15px;color:var(--accent)") : ""}</div>`;
        card.addEventListener("click", () => { set({ wallpaper: wp.id }); this.render(); });
        walls.append(card);
      }
      sect2.append(walls);
      pane.append(sect2);

      const sectSkin = el("section");
      sectSkin.append(el("h2", { class: "sect", text: "Browser skin" }));
      sectSkin.append(this.row("Chrome style", "How the Nebula Browser looks. Glass is the default; Pyro ports the black/orange UI with a live clock and GO button. Both browse through the same proxy.",
        this.segmented([{ label: "Glass", value: "glass" }, { label: "Pyro", value: "pyro" }], state.browserSkin || "glass", (v) => { set({ browserSkin: v }); Nebula.Browser.setSkin?.(v); })));
      const pyroNote = el("div", { class: "row", style: "justify-content:space-between;align-items:center;padding:13px 14px;border:1px solid var(--glass-line);border-radius:12px;background:var(--glass-2)" });
      pyroNote.innerHTML = `<div><div style="font-weight:650;font-size:13px">Pyro theme</div><div class="faint" style="font-size:11.5px">Switches the whole desktop to the Pyro palette that ships with that skin.</div></div>`;
      const pyBtn = el("button", { class: "btn", text: state.theme === "pyro" ? "Current theme" : "Apply Pyro theme" });
      pyBtn.addEventListener("click", () => { set({ theme: "pyro" }); this.render(); });
      pyroNote.append(pyBtn);
      sectSkin.append(pyroNote);
      pane.append(sectSkin);

      const sect3 = el("section");
      sect3.append(el("h2", { class: "sect", text: "Desktop" }));
      sect3.append(this.row("Dock position", "Where the application dock sits on screen.", this.segmented([{ label: "Left", value: "left" }, { label: "Bottom", value: "bottom" }], state.dockPos, (v) => set({ dockPos: v }))));
      const tl = el("div", { class: "row", style: "justify-content:space-between;align-items:center;padding:13px 14px;border:1px solid var(--glass-line);border-radius:12px;background:var(--glass-2)" });
      tl.innerHTML = `<div><div style="font-weight:650;font-size:13px">Auto-hide dock</div><div class="faint" style="font-size:11.5px">Reveal it again from the small handle at the screen edge.</div></div>`;
      tl.append(this.toggle(state.dockHidden, (v) => set({ dockHidden: v })));
      sect3.append(tl);
      sect3.append(el("div", { style: "height:10px" }));
      const tl2 = el("div", { class: "row", style: "justify-content:space-between;align-items:center;padding:13px 14px;border:1px solid var(--glass-line);border-radius:12px;background:var(--glass-2)" });
      tl2.innerHTML = `<div><div style="font-weight:650;font-size:13px">Glass blur</div><div class="faint" style="font-size:11.5px">Disable for lower-end machines and maximum performance.</div></div>`;
      tl2.append(this.toggle(state.blur, (v) => set({ blur: v })));
      sect3.append(tl2);
      sect3.append(el("div", { style: "height:10px" }));
      const tl3 = el("div", { class: "row", style: "justify-content:space-between;align-items:center;padding:13px 14px;border:1px solid var(--glass-line);border-radius:12px;background:var(--glass-2)" });
      tl3.innerHTML = `<div><div style="font-weight:650;font-size:13px">24-hour clock</div><div class="faint" style="font-size:11.5px">Show the time in 24-hour format.</div></div>`;
      tl3.append(this.toggle(!state.hour12, (v) => set({ hour12: !v })));
      sect3.append(tl3);
      sect3.append(el("div", { style: "height:10px" }));
      const tl4 = el("div", { class: "row", style: "justify-content:space-between;align-items:center;padding:13px 14px;border:1px solid var(--glass-line);border-radius:12px;background:var(--glass-2)" });
      tl4.innerHTML = `<div><div style="font-weight:650;font-size:13px">Animations</div><div class="faint" style="font-size:11.5px">Moving wallpaper, window and menu motion, hover effects. Turn off on slow machines.</div></div>`;
      tl4.append(this.toggle(state.motion !== false, (v) => set({ motion: v })));
      sect3.append(tl4);
      pane.append(sect3);
    },

    renderProxy(pane) {
      pane.append(el("h1", { text: "Proxy" }), el("div", { class: "psub", html: "The browser engine that fetches and rewrites websites. Requires <code>nebula.sw.js</code> to sit next to this file in the same folder." }));
      pane.append(this.statusCard());

      const s1 = el("section");
      s1.append(el("h2", { class: "sect", text: "Backend engine" }));
      const list = el("div", { class: "opt-list" });
      for (const [id, e] of Object.entries(ENGINES)) {
        const o = el("button", { class: "opt " + (state.engine === id ? "on" : "") });
        o.innerHTML = `<span class="rad"></span><span class="grow"><span class="ot">${e.name}</span><span class="od">${e.desc}</span></span>`;
        o.addEventListener("click", async () => {
          set({ engine: id });
          this.render();
          toast("Engine switched", `${e.name} selected — new browser tabs will use it.`, "ok");
          try { await Proxy.ensureEngine(id); } catch (err) { toast("Engine could not start", esc(String(err.message || err)), "err", 8000); }
        });
        list.append(o);
      }
      s1.append(list);
      pane.append(s1);

      const s2 = el("section");
      s2.append(el("h2", { class: "sect", text: "Transport" }));
      s2.append(el("div", { class: "faint", style: "font-size:12px;margin-bottom:10px", text: "How website data is retrieved from the Wisp relay." }));
      const tlist = el("div", { class: "opt-list" });
      for (const [id, t] of Object.entries(TRANSPORTS)) {
        const o = el("button", { class: "opt " + (state.transport === id ? "on" : "") });
        o.innerHTML = `<span class="rad"></span><span class="grow"><span class="ot">${t.name}</span><span class="od">${t.desc}</span></span>`;
        o.addEventListener("click", async () => {
          set({ transport: id });
          this.render();
          try { await Proxy.restart(); toast("Transport switched", `${t.name} is now active.`, "ok"); }
          catch (e) { toast("Transport switch failed", esc(String(e.message || e)), "err", 8000); }
        });
        tlist.append(o);
      }
      s2.append(tlist);
      pane.append(s2);

      const s3 = el("section");
      s3.append(el("h2", { class: "sect", text: "Wisp server" }));
      const inp = el("input", { class: "input mono", value: state.wisp, spellcheck: "false" });
      s3.append(this.row("Relay websocket URL", "The Wisp server that carries your traffic. Self-host one for best reliability (e.g. <code>ws://localhost:4000/</code>).", inp));
      const row = el("div", { class: "row" });
      const saveBtn = el("button", { class: "btn primary sm" });
      saveBtn.innerHTML = `${icon("check", "width:14px;height:14px")} Save &amp; apply`;
      saveBtn.addEventListener("click", async () => {
        let url = inp.value.trim();
        if (url && !url.endsWith("/")) url += "/";
        set({ wisp: url, wispPinned: true });
        try { await Proxy.restart(); toast("Wisp updated", url, "ok"); } catch (e) { toast("Wisp test failed", esc(String(e.message || e)), "err", 8000); }
      });
      const testBtn = el("button", { class: "btn sm" });
      testBtn.innerHTML = `${icon("bolt", "width:14px;height:14px")} Test connection`;
      testBtn.addEventListener("click", async () => {
        testBtn.disabled = true;
        const r = await Proxy.probeWisp(inp.value.trim());
        testBtn.disabled = false;
        toast(r.ok ? "Wisp reachable" : "Wisp unreachable", `${esc(inp.value.trim())} — ${esc(r.detail)}`, r.ok ? "ok" : "err", 6000);
      });
      row.append(saveBtn, testBtn);
      s3.append(row);
      s3.append(el("div", { style: "height:14px" }));
      const presets = el("div", { class: "chips" });
      for (const p of WISP_PRESETS) {
        const c = el("button", { class: "chip", text: p.name, title: p.url });
        c.addEventListener("click", () => { inp.value = p.url; });
        presets.append(c);
      }
      s3.append(this.row("Known relays", "Public relays are run by volunteers — they can go down. Enter your own anytime.", presets));
      pane.append(s3);

      const s4 = el("section");
      s4.append(el("h2", { class: "sect", text: "Maintenance" }));
      const r2 = el("div", { class: "row" });
      const b1 = el("button", { class: "btn sm" });
      b1.innerHTML = `${icon("reload", "width:14px;height:14px")} Restart proxy stack`;
      b1.addEventListener("click", () => Proxy.restart(true));
      const b2 = el("button", { class: "btn sm" });
      b2.innerHTML = `${icon("bolt", "width:14px;height:14px")} Run full diagnostics`;
      b2.addEventListener("click", () => Proxy.probeAll(true));
      const bNet = el("button", { class: "btn sm" });
      bNet.innerHTML = `${icon("wifi", "width:14px;height:14px")} Network check`;
      bNet.title = "Find out whether it is the relay, the service worker or the network filter";
      bNet.addEventListener("click", () => Proxy.netCheck(true));
      const b3 = el("button", { class: "btn sm danger" });
      b3.innerHTML = `${icon("trash", "width:14px;height:14px")} Unregister worker`;
      b3.addEventListener("click", async () => {
        await Proxy.unregisterSW();
        toast("Service worker removed", "Reload the page to register it again.", "ok");
        this.render();
      });
      r2.append(b1, b2, bNet, b3);
      s4.append(r2);
      pane.append(s4);
    },

    statusCard() {
      const rows = [
        ["Service worker", Proxy.status.sw, Proxy.swReady ? "registered" : "not registered"],
        ["Transport", Proxy.status.transport, Proxy.transportName ? `“${Proxy.transportName}”` : "idle"],
        ["Wisp", Proxy.status.wisp, state.wisp],
        ["Engine", "ok", ENGINES[state.engine].name],
        ["Prefix", "ok", Proxy.prefixes()[state.engine] || ""],
      ];
      const card = el("div", { class: "card" });
      for (const [k, st, v] of rows) {
        const line = el("div", { class: "row", style: "justify-content:space-between;gap:12px;padding:5px 0;font-size:12.5px" });
        line.innerHTML = `<span class="muted">${icon("info", "display:none")}${k}</span><span class="mono" style="text-align:right;word-break:break-all"><span class="status-dot ${st === "ok" ? "ok" : st === "bad" ? "bad" : "warn"}"></span>${esc(v)}</span>`;
        card.append(line);
      }
      return card;
    },

    renderSearch(pane) {
      pane.append(el("h1", { text: "Search" }), el("div", { class: "psub", text: "What happens when you type words instead of a URL in the browser." }));
      const list = el("div", { class: "opt-list" });
      for (const [id, s] of Object.entries(SEARCH_ENGINES)) {
        if (id === "custom") continue;
        const o = el("button", { class: "opt " + (state.search === id ? "on" : "") });
        o.innerHTML = `<span class="rad"></span><span class="grow"><span class="ot">${s.icon} ${s.name}</span><span class="od">${esc(s.url)}</span></span>`;
        o.addEventListener("click", () => { set({ search: id }); this.render(); });
        list.append(o);
      }
      const o = el("button", { class: "opt " + (state.search === "custom" ? "on" : "") });
      o.innerHTML = `<span class="rad"></span><span class="grow"><span class="ot">⚙ Custom (use %s for the query)</span><span class="od">${esc(state.searchCustom)}</span></span>`;
      o.addEventListener("click", () => { set({ search: "custom" }); this.render(); });
      list.append(o);
      pane.append(list);
      const inp = el("input", { class: "input mono", value: state.searchCustom });
      inp.addEventListener("change", () => set({ searchCustom: inp.value.trim() }));
      pane.append(el("div", { style: "height:16px" }), this.row("Custom search template", "Example: <code>https://lite.duckduckgo.com/lite/?q=%s</code>", inp));
    },

    renderPrivacy(pane) {
      pane.append(el("h1", { text: "Privacy & Safety" }), el("div", { class: "psub", text: "Anti-close protection, history cloaking and blob mode." }));

      const s1 = el("section");
      s1.append(el("h2", { class: "sect", text: "Anti-close" }));
      const a = el("div", { class: "row", style: "justify-content:space-between;align-items:center;padding:13px 14px;border:1px solid var(--glass-line);border-radius:12px;background:var(--glass-2)" });
      a.innerHTML = `<div><div style="font-weight:650;font-size:13px">Warn before closing the tab</div><div class="faint" style="font-size:11.5px;line-height:1.5;">When enabled, NebulaOS asks for confirmation before the tab closes — the browser shows its own “Leave site?” prompt, and the Power menu asks first too.</div></div>`;
      a.append(this.toggle(state.anticlose, (v) => { set({ anticlose: v }); toast(v ? "Anti-close enabled" : "Anti-close disabled", v ? "Closing the tab now asks for confirmation." : "The tab closes freely again.", "ok"); }));
      s1.append(a);
      pane.append(s1);

      const s2 = el("section");
      s2.append(el("h2", { class: "sect", text: "about:blank mode" }));
      s2.append(el("div", { class: "faint", style: "font-size:12px;margin-bottom:10px", text: "Cloaks this tab so it looks like a blank page — instantly on boot, or on demand from the bar." }));
      const list = el("div", { class: "opt-list" });
      for (const [id, name, desc] of [
        ["off", "Off", "The tab keeps its normal title."],
        ["auto", "Auto (instant)", "Cloaks automatically the moment NebulaOS boots."],
        ["manual", "Manual", "Only cloaks when you press the eye button in the top bar."],
      ]) {
        const o = el("button", { class: "opt " + (state.abMode === id ? "on" : "") });
        o.innerHTML = `<span class="rad"></span><span class="grow"><span class="ot">${name}</span><span class="od">${desc}</span></span>`;
        o.addEventListener("click", () => { set({ abMode: id }); this.render(); if (id === "off") Privacy.uncloak(); else Privacy.applyCloak(); });
        list.append(o);
      }
      s2.append(list);
      const presetRow = el("div", { class: "chips", style: "margin-top:12px" });
      for (const key of ["blank", "google", "drive", "classroom", "custom"]) {
        const c = el("button", { class: "chip " + (state.cloakPreset === key ? "on" : ""), text: key === "blank" ? "about:blank" : key[0].toUpperCase() + key.slice(1) });
        c.addEventListener("click", () => { set({ cloakPreset: key }); this.render(); Privacy.applyCloak(); });
        presetRow.append(c);
      }
      s2.append(this.row("Cloak disguise", "Pick what the tab pretends to be, then press the eye button in the top bar.", presetRow));
      if (state.cloakPreset === "custom") {
        const ci = el("input", { class: "input", value: state.cloakCustom, placeholder: "Custom tab title" });
        ci.addEventListener("change", () => { set({ cloakCustom: ci.value }); Privacy.applyCloak(); });
        s2.append(ci);
      }
      const cloakNow = el("button", { class: "btn sm primary" });
      cloakNow.innerHTML = `${icon("eye-off", "width:14px;height:14px")} Cloak this tab now`;
      cloakNow.addEventListener("click", () => Privacy.cloak());
      s2.append(el("div", { class: "row", style: "margin-top:12px" }, cloakNow));
      pane.append(s2);

      const s3 = el("section");
      s3.append(el("h2", { class: "sect", text: "Blob mode" }));
      const b = el("div", { class: "row", style: "justify-content:space-between;align-items:center;padding:13px 14px;border:1px solid var(--glass-line);border-radius:12px;background:var(--glass-2)" });
      b.innerHTML = `<div><div style="font-weight:650;font-size:13px">Run NebulaOS from a blob: URL</div><div class="faint" style="font-size:11.5px;line-height:1.5;">Reloads the desktop as <code>blob:…</code> so the visit never shows up in history as a normal page. Blob URLs die with the tab.</div></div>`;
      const bb = el("div", { class: "row", style: "gap:8px" });
      const now = el("button", { class: "btn sm" });
      now.innerHTML = `${icon("blob", "width:14px;height:14px")} Convert now`;
      now.addEventListener("click", () => Privacy.toBlob());
      bb.append(this.toggle(state.blobMode, (v) => { set({ blobMode: v }); if (v) sessionStorage.removeItem("nebula.blobbed"); }), now);
      b.append(bb);
      s3.append(b);
      pane.append(s3);

      const s4 = el("section");
      s4.append(el("h2", { class: "sect", text: "Data" }));
      const d = el("div", { class: "row" });
      const clr = el("button", { class: "btn sm danger" });
      clr.innerHTML = `${icon("trash", "width:14px;height:14px")} Clear NebulaOS data`;
      clr.addEventListener("click", async () => {
        const ok = await dialog({ title: "Clear all NebulaOS data?", icon: "warn", msg: "Settings, bookmarks, notes, files and imported apps stored on this device will be erased. Proxied cookies are kept by the service worker unless you also unregister it.", buttons: [{ label: "Cancel", value: false }, { label: "Erase everything", danger: true, primary: true, value: true }] });
        if (!ok) return;
        Object.keys(localStorage).filter((k) => k.startsWith("nebula.")).forEach((k) => localStorage.removeItem(k));
        toast("Data cleared", "Reloading…", "ok", 1500);
        setTimeout(() => location.reload(), 1200);
      });
      d.append(clr);
      s4.append(d);
      pane.append(s4);
    },

    renderSystem(pane) {
      pane.append(el("h1", { text: "System" }), el("div", { class: "psub", text: "Build information and credits." }));
      const hero = el("div", { class: "about-hero", style: "padding-top:0" });
      hero.innerHTML = `<svg style="width:84px;height:84px" viewBox="0 0 96 96"><use href="#i-logo"/></svg>
        <div style="font-size:20px;font-weight:750">NebulaOS ${VERSION.os}</div>
        <div class="muted" style="font-size:12.5px">codename “${VERSION.codename}” · build ${VERSION.build}</div>`;
      pane.append(hero);
      const kv = el("div", { class: "kv" });
      const rows = [
        ["Address", (() => { const h = Proxy.appLocation().href || location.href; return h.startsWith("blob:") ? "blob:… (hidden)" : h; })()],
        ["Renderer", navigator.userAgent.split(") ").pop() || navigator.userAgent],
        ["Platform", navigator.platform || "—"],
        ["Screen", `${screen.width}×${screen.height} @ ${devicePixelRatio}×`],
        ["Language", navigator.language],
        ["Service worker", Proxy.swReady ? "active" : "inactive"],
        ["Engine", ENGINES[state.engine].name],
        ["Transport", TRANSPORTS[state.transport].name],
        ["Wisp", state.wisp],
        ["Base directory", Proxy.baseDir()],
        ["Storage used", (() => { try { let n = 0; for (const k of Object.keys(localStorage)) n += (localStorage[k] || "").length + k.length; return fmtBytes(n); } catch { return "—"; } })()],
      ];
      for (const [k, v] of rows) kv.append(el("div", { class: "k", text: k }), el("div", { class: "v", text: String(v) }));
      pane.append(kv);
      pane.append(el("div", { class: "hr" }));
      pane.append(el("h2", { class: "sect", text: "Components" }));
      const comp = el("div", { class: "kv" });
      const crows = [
        ["Ultraviolet", "3.2.10 · Titanium Network"],
        ["Scramjet", "1.1.0 &amp; 2.0.67-alpha.2 · Mercury Workshop"],
        ["bare-mux", "2.1.9"],
        ["Epoxy / libcurl.js", "epoxy-transport 3.0.1 · libcurl-transport 2.0.5"],
        ["Wisp", "wisp-js compatible relays"],
      ];
      for (const [k, v] of crows) comp.append(el("div", { class: "k", text: k }), el("div", { class: "v", html: v }));
      pane.append(comp);
      pane.append(el("div", { class: "hr" }));
      const restart = el("button", { class: "btn sm" });
      restart.innerHTML = `${icon("reload", "width:14px;height:14px")} Reload desktop`;
      restart.addEventListener("click", () => location.reload());
      const reset = el("button", { class: "btn sm danger" });
      reset.innerHTML = `${icon("trash", "width:14px;height:14px")} Reset settings`;
      reset.addEventListener("click", async () => {
        const ok = await dialog({ title: "Reset settings?", icon: "warn", msg: "Every preference returns to its default value.", buttons: [{ label: "Cancel", value: false }, { label: "Reset", danger: true, primary: true, value: true }] });
        if (!ok) return;
        localStorage.removeItem(LS_KEY);
        location.reload();
      });
      pane.append(el("div", { class: "row" }, restart, reset));
    },
  };

  /* ----------------------------- app registry ---------------------------- */
  const Registry = {
    apps: [],
    register(app) { this.apps.push(app); return app; },
    all() { return this.apps; },
    byId(id) { return this.apps.find((a) => a.id === id); },
    pinned() {
      const pinned = this.apps.filter((a) => a.pinned);
      return pinned.length ? pinned : this.apps.slice(0, 7);
    },
  };


  /* Sites shown on the Pyro browser skin's start page (the layout pyroroxy used). */
  const PYRO_SITES = [
    { cat: "games", label: "Games", items: [
      { name: "Gn-Math", url: "https://gn-math.dev" },
      { name: "Strongdog", url: "https://strongdog.com/" },
      { name: "NowGG", url: "https://nowgg.fun" },
    ] },
    { cat: "media", label: "Media", items: [
      { name: "YouTube", url: "https://youtube.com" },
      { name: "YouTube (unblocked)", url: "https://invidious.f5.si/" },
      { name: "Monochrome", url: "https://main.monochrome-507.pages.dev" },
    ] },
    { cat: "music", label: "Music", items: [
      { name: "YouTube Music", url: "https://music.youtube.com" },
      { name: "SoundCloud", url: "https://soundcloud.com" },
      { name: "Spotify", url: "https://open.spotify.com" },
    ] },
    { cat: "tools", label: "Tools", items: [
      { name: "GitHub", url: "https://github.com" },
      { name: "VS Code", url: "https://vscode.dev" },
    ] },
  ];

  /* ==========================================================================
   *  Desktop icons — shortcuts on the desktop, Linux style
   *  -------------------------------------------------------------------------
   *  Each entry is  { id, appId | url, name, emoji, c, r }  where c/r are grid
   *  cells. Entries live in state.desktopIcons, so they survive reloads and are
   *  part of the same settings blob as themes and the proxy config.
   *
   *  Supported interactions:
   *    click / ctrl+click / marquee        select (multi-select included)
   *    double-click, Enter, single-click   open (single-click on touch devices)
   *    drag (group-aware), auto-arrange    move + snap to the nearest free cell
   *    F2, right-click → Rename            inline rename
   *    right-click → Change icon           emoji picker
   *    Delete / Backspace                  remove from the desktop
   *    right-click on the desktop          New shortcut, auto-arrange, hide icons
   * ======================================================================== */
  const Desktop = {
    NAMES: ["Browser", "Files", "Terminal", "Settings", "Games", "App Store", "Mines", "System Monitor"],
    CELL: { w: 92, h: 100 },
    layer: null,
    sel: new Set(),
    els: new Map(),
    drag: null,
    marquee: null,

    init() {
      this.layer = $("#icons");
      this.layer.addEventListener("mousedown", (e) => this.onLayerDown(e));
      this.layer.addEventListener("contextmenu", (e) => {
        if (e.target !== this.layer) return;
        e.preventDefault();
        this.desktopMenu(e.clientX, e.clientY, this.extraItems || []);
      });
      this.seed();
      this.render();
      let t = null;
      addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => this.reflow(), 140); });
    },
    /* keep icons inside the visible grid when the window or dock changes */
    reflow() {
      const rows = this.rows(), cols = this.cols();
      const list = this.list();
      let changed = false;
      const taken = new Set();
      for (const ic of list) {
        let c = clamp(ic.c, 0, cols - 1), r = clamp(ic.r, 0, rows - 1);
        while (taken.has(c + ":" + r)) { r++; if (r >= rows) { r = 0; c = (c + 1) % cols; } }
        taken.add(c + ":" + r);
        if (c !== ic.c || r !== ic.r) { ic.c = c; ic.r = r; changed = true; }
      }
      if (changed) this.save(list);
      this.render();
    },

    /* ---- data ---- */
    list() { return (state.desktopIcons || []).slice(); },
    save(list) { set({ desktopIcons: list }, { silent: true }); },
    seed() {
      if (Array.isArray(state.desktopIcons)) return;
      const wanted = ["browser", "files", "terminal", "bundled-game-minesweeper", "store", "settings"];
      const icons = [];
      let r = 0;
      for (const id of wanted) {
        const app = Registry.byId(id);
        if (!app) continue;
        icons.push({ id: "icon-" + uid(), appId: id, name: app.name, emoji: app.emoji || "▫", c: 0, r: r++ });
      }
      this.save(icons);
    },
    /* the usable desktop: never under the dock, never behind the top bar */
    area() {
      const a = workarea();
      return { x: a.x + 8, y: a.y + 8, w: a.w - 16, h: a.h - 16 };
    },
    rows() { return Math.max(1, Math.floor(this.area().h / this.CELL.h)); },
    cols() { return Math.max(1, Math.floor(this.area().w / this.CELL.w)); },
    occupied(skip = []) {
      const skipIds = new Set(skip.map((s) => s.id || s));
      return new Set(this.list().filter((i) => !skipIds.has(i.id)).map((i) => i.c + ":" + i.r));
    },
    freeCell(fromC = 0, fromR = 0) {
      const taken = this.occupied();
      const rows = this.rows(), cols = this.cols();
      for (let c = fromC; c < cols; c++) for (let r = (c === fromC ? fromR : 0); r < rows; r++)
        if (!taken.has(c + ":" + r)) return { c, r };
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) if (!taken.has(c + ":" + r)) return { c, r };
      return { c: 0, r: 0 };
    },
    arrange(silent = false) {
      const list = this.list();
      const rows = this.rows();
      list.forEach((ic, i) => { ic.c = Math.floor(i / rows); ic.r = i % rows; });
      this.save(list);
      this.render();
      if (!silent) toast("Icons arranged", `${list.length} shortcut${list.length === 1 ? "" : "s"} snapped to the grid.`, "ok", 2000);
    },

    /* ---- entries ---- */
    add(entry, { open = false } = {}) {
      const list = this.list();
      const app = entry.appId ? Registry.byId(entry.appId) : null;
      const name = entry.name || app?.name || entry.url || "Shortcut";
      if (app && list.some((i) => i.appId === entry.appId)) {
        toast("Already on the desktop", name + " is already there.", "warn", 2500);
        return null;
      }
      if (!app && entry.url && list.some((i) => i.url === entry.url)) {
        toast("Already on the desktop", name + " is already there.", "warn", 2500);
        return null;
      }
      const cell = this.freeCell();
      const icon = {
        id: "icon-" + uid(),
        appId: entry.appId || null,
        url: entry.url || null,
        name,
        emoji: entry.emoji || app?.emoji || (entry.url ? "🌐" : "▫"),
        c: cell.c, r: cell.r,
      };
      list.push(icon);
      this.save(list);
      this.render();
      toast("Added to desktop", `${name} is now a desktop shortcut.`, "ok", 2500);
      if (open) this.open(icon);
      return icon;
    },
    remove(id, quiet = false) {
      const list = this.list();
      const ic = list.find((i) => i.id === id);
      if (!ic) return;
      this.save(list.filter((i) => i.id !== id));
      this.sel.delete(id);
      this.render();
      if (!quiet) toast("Removed", `${ic.name} was removed from the desktop.`, "ok", 2200);
    },
    removeApp(appId) { const l = this.list().filter((i) => i.appId === appId); l.forEach((i) => this.remove(i.id, true)); },
    has(appId) { return this.list().some((i) => i.appId === appId); },
    update(id, patch) {
      const list = this.list();
      const ic = list.find((i) => i.id === id);
      if (!ic) return;
      Object.assign(ic, patch);
      this.save(list);
      this.render();
    },
    /* the app behind an icon may have been deleted (import) or never existed */
    target(icon) {
      if (icon.appId) return Registry.byId(icon.appId) || null;
      if (icon.url) return { name: icon.name, run: () => Browser.open({ url: icon.url }) };
      return null;
    },

    /* ---- rendering ---- */
    applyVisibility() {
      const l = $("#icons");
      if (l) l.classList.toggle("hidden", !!state.iconsHidden);
    },
    render() {
      const l = this.layer || $("#icons");
      if (!l) return;
      this.layer = l;
      l.innerHTML = "";
      this.els.clear();
      this.applyVisibility();
      const { w, h } = this.CELL;
      const a = this.area();
      for (const icon of this.list()) {
        const app = icon.appId ? Registry.byId(icon.appId) : null;
        const node = el("div", { class: "dicon", tabindex: "0", title: icon.appId ? (app?.sub || "") : icon.url || "" });
        node.dataset.id = icon.id;
        node.style.transform = `translate(${a.x + icon.c * w}px, ${a.y + icon.r * h}px)`;
        const ico = el("div", { class: "dico" });
        const markup = app?.iconHtml && app.iconHtml.trim().startsWith("<img") ? app.iconHtml : null;
        if (markup) ico.innerHTML = markup; else ico.textContent = icon.emoji || "▫";
        const lbl = el("div", { class: "dlbl", text: icon.name });
        node.append(ico, lbl);
        node.addEventListener("mousedown", (e) => this.onIconDown(e, icon));
        node.addEventListener("dblclick", () => this.open(icon));
        node.addEventListener("keydown", (e) => {
          if (e.key === "Enter") { e.preventDefault(); this.open(icon); }
          if (e.key === "F2") { e.preventDefault(); this.rename(icon); }
          if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); this.remove(icon.id); }
          if (e.key.startsWith("Arrow")) this.move(e.key);
        });
        node.addEventListener("contextmenu", (e) => { e.preventDefault(); e.stopPropagation(); if (!this.sel.has(icon.id)) this.select(icon.id); this.iconMenu(icon, e.clientX, e.clientY); });
        node.addEventListener("focus", () => this.select(icon.id));
        l.append(node);
        this.els.set(icon.id, node);
      }
      this.paintSelection();
    },
    paintSelection() {
      for (const [id, node] of this.els) node.classList.toggle("sel", this.sel.has(id));
    },
    select(id, additive = false) {
      if (!additive) this.sel.clear();
      this.sel.add(id);
      this.paintSelection();
    },
    selectMany(ids) { this.sel = new Set(ids); this.paintSelection(); },
    clearSelection() { this.sel.clear(); this.paintSelection(); },

    /* ---- opening ---- */
    open(icon) {
      const app = this.target(icon);
      if (!app) {
        toast("Shortcut is broken", `${icon.name} has no app behind it any more.`, "err", 4000);
        return;
      }
      app.run();
    },
    openSelected() {
      for (const id of this.sel) { const ic = this.list().find((i) => i.id === id); if (ic) { this.open(ic); break; } }
    },

    /* ---- pointer: select, drag, marquee ---- */
    onIconDown(e, icon) {
      if (e.button === 2) return;                       /* context menu handles it */
      e.preventDefault();
      this.layer.querySelectorAll(".dicon.focus-ring").forEach((n) => n.classList.remove("focus-ring"));
      const additive = e.ctrlKey || e.metaKey || e.shiftKey;
      if (additive) { this.sel.has(icon.id) ? this.sel.delete(icon.id) : this.sel.add(icon.id); this.paintSelection(); if (!this.sel.has(icon.id)) return; }
      else if (!this.sel.has(icon.id)) this.select(icon.id);
      const ids = [...this.sel];
      const layerRect = this.layer.getBoundingClientRect();
      const starts = ids.map((id) => {
        const ic = this.list().find((i) => i.id === id);
        const node = this.els.get(id);
        /* offsetLeft/offsetTop ignore CSS transforms, and icons are positioned
         * with translate() — always measure the laid-out box instead. */
        const rect = node.getBoundingClientRect();
        return { id, ic, node, left: rect.left - layerRect.left, top: rect.top - layerRect.top };
      });
      this.drag = { sx: e.clientX, sy: e.clientY, active: false, starts };
      const move = (ev) => this.onDragMove(ev);
      const up = (ev) => {
        removeEventListener("mousemove", move);
        removeEventListener("mouseup", up);
        this.onDragEnd(ev);
      };
      addEventListener("mousemove", move);
      addEventListener("mouseup", up);
    },
    onDragMove(e) {
      const d = this.drag;
      if (!d) return;
      const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
      if (!d.active && Math.hypot(dx, dy) < 4) return;
      d.active = true;
      document.body.classList.add("dragging-icons");
      for (const s of d.starts) {
        s.node.style.transform = `translate(${s.left + dx}px, ${s.top + dy}px)`;
        s.node.classList.add("dragging");
      }
    },
    onDragEnd(e) {
      const d = this.drag;
      this.drag = null;
      document.body.classList.remove("dragging-icons");
      if (!d || !d.active) return;
      const { w, h } = this.CELL;
      const a = this.area();
      const layer = this.layer.getBoundingClientRect();      /* transform-aware: offsetLeft ignores translate() */
      const list = this.list();
      const moving = d.starts.map((s) => s.id);
      const taken = this.occupied(moving);
      const snapped = [];
      for (const s of d.starts) {
        const node = s.node;
        const rect = node.getBoundingClientRect();
        let c = Math.round((rect.left - layer.left - a.x) / w);
        let r = Math.round((rect.top - layer.top - a.y) / h);
        c = clamp(c, 0, this.cols() - 1);
        r = clamp(r, 0, this.rows() - 1);
        let guard = 0;
        while (taken.has(c + ":" + r) && guard++ < 400) { r++; if (r >= this.rows()) { r = 0; c = (c + 1) % this.cols(); } }
        taken.add(c + ":" + r);
        snapped.push({ id: s.id, c, r });
        node.classList.remove("dragging");
      }
      if (state.iconGrid === false) {
        /* free placement: keep the exact pixels instead of the grid cell */
        snapped.forEach((sn, i) => {
          const node = d.starts[i].node;
          const rect = node.getBoundingClientRect();
          node.style.transform = `translate(${rect.left - layer.left}px, ${rect.top - layer.top}px)`;
        });
      }
      for (const sn of snapped) { const ic = list.find((i) => i.id === sn.id); if (ic) { ic.c = sn.c; ic.r = sn.r; } }
      this.save(list);
      /* paint from the model so every icon lands exactly on its cell */
      const byId = new Map(snapped.map((s) => [s.id, s]));
      for (const [id, node] of this.els) {
        if (byId.has(id)) { const s = byId.get(id); node.style.transform = `translate(${a.x + s.c * w}px, ${a.y + s.r * h}px)`; }
      }
    },
    onLayerDown(e) {
      if (e.target !== this.layer || e.button !== 0) return;
      this.clearSelection();
      const rect = { x: e.clientX, y: e.clientY };
      const mq = $("#marquee");
      const start = { ...rect };
      const move = (ev) => {
        const x = Math.min(start.x, ev.clientX), y = Math.min(start.y, ev.clientY);
        const w = Math.abs(ev.clientX - start.x), h = Math.abs(ev.clientY - start.y);
        mq.style.display = "block";
        mq.style.left = x + "px"; mq.style.top = y + "px";
        mq.style.width = w + "px"; mq.style.height = h + "px";
        const box = { l: x, t: y, r: x + w, b: y + h };
        const ids = [];
        for (const [id, node] of this.els) {
          const r = node.getBoundingClientRect();
          if (r.right > box.l && r.left < box.r && r.bottom > box.t && r.top < box.b) ids.push(id);
        }
        this.selectMany(ids);
      };
      const up = () => {
        mq.style.display = "none";
        removeEventListener("mousemove", move);
        removeEventListener("mouseup", up);
      };
      addEventListener("mousemove", move);
      addEventListener("mouseup", up);
    },
    move(key) {
      const ordered = this.list();
      const current = ordered.find((i) => this.sel.has(i.id));
      if (!current) return;
      const { c, r } = current;
      const next = {
        ArrowLeft: { c: c - 1, r }, ArrowRight: { c: c + 1, r },
        ArrowUp: { c, r: r - 1 }, ArrowDown: { c, r: r + 1 },
      }[key];
      next.c = clamp(next.c, 0, this.cols() - 1);
      next.r = clamp(next.r, 0, this.rows() - 1);
      const occupant = ordered.find((i) => i.id !== current.id && i.c === next.c && i.r === next.r);
      if (occupant) { occupant.c = c; occupant.r = r; }          /* swap, like a real desktop */
      current.c = next.c; current.r = next.r;
      this.save(ordered);
      this.render();
      this.select(current.id);
      this.els.get(current.id)?.focus();
    },

    /* ---- rename / icon picker ---- */
    rename(icon) {
      const node = this.els.get(icon.id);
      if (!node) return;
      const lbl = node.querySelector(".dlbl");
      const input = el("input", { class: "drename", value: icon.name });
      lbl.replaceWith(input);
      input.focus(); input.select();
      let committed = false;
      const commit = (ok) => {
        if (committed) return;
        committed = true;
        const value = input.value.trim();
        /* the list may have been re-rendered underneath us (blur after Enter) */
        if (input.isConnected && lbl.isConnected && lbl.parentNode === input.parentNode) input.replaceWith(lbl);
        if (ok && value) { lbl.textContent = value; this.update(icon.id, { name: value }); }
      };
      input.addEventListener("keydown", (e) => { e.stopPropagation(); if (e.key === "Enter") commit(true); if (e.key === "Escape") commit(false); });
      input.addEventListener("blur", () => commit(true));
    },
    emojiDialog(icon) {
      const EMOJI = "🖥️ 💻 🌐 📁 📝 🎮 🎯 🎨 🎵 🎬 📷 📊 📈 🧮 🧩 ⚙️ 🔧 🗄️ 📦 ✨ 🚀 🔒 🛡️ ⚡ 💬 📡 🧠 🃏 💣 ⭕ 🐍 🗺️ 📅 🕒 🧾 🔔 ⭐ ❤️ 🍀 🌈 🔥".split(" ");
      let chosen = icon.emoji;
      const grid = `<div class="emojigrid">${EMOJI.map((e) => `<button type="button" class="emoji${e === icon.emoji ? " on" : ""}" data-e="${e}">${e}</button>`).join("")}</div>`;
      const p = formDialog({
        title: "Icon for " + icon.name, icon: "brush",
        msg: `<div class="faint" style="font-size:12px;margin-bottom:9px">Pick one, or type any character in the box.</div>${grid}`,
        fields: [{ key: "custom", label: "Custom", value: "", maxlength: 4, placeholder: icon.emoji }],
        buttons: [{ label: "Cancel", value: null }, { label: "Use this icon", primary: true, value: "ok" }],
      });
      const host = document.querySelector("#overlays .emojigrid");
      host?.addEventListener("click", (e) => {
        const b = e.target.closest(".emoji");
        if (!b) return;
        chosen = b.dataset.e;
        host.querySelectorAll(".emoji").forEach((x) => x.classList.toggle("on", x === b));
        const custom = document.querySelector("#overlays input[data-key=custom]");
        if (custom) custom.value = "";
      });
      p.then((vals) => { if (vals) this.update(icon.id, { emoji: vals.custom || chosen }); });
    },

    /* ---- menus / dialogs ---- */
    iconMenu(icon, x, y) {
      const app = icon.appId ? Registry.byId(icon.appId) : null;
      const multi = this.sel.size > 1;
      contextMenu([
        { label: "Open", icon: "globe", key: "↵", action: () => this.open(icon) },
        app ? { label: app.pinned ? "Unpin from dock" : "Pin to dock", icon: "apps", action: () => { app.pinned = !app.pinned; Dock.render(); Launcher.build(); toast(app.pinned ? "Pinned to dock" : "Unpinned", app.name, "ok", 2000); } }
            : { label: "Open in Nebula Browser", icon: "globe", action: () => Browser.open({ url: icon.url }) },
        { sep: true },
        { label: "Rename…", icon: "note", key: "F2", action: () => this.rename(icon) },
        { label: "Change icon…", icon: "brush", action: () => this.emojiDialog(icon) },
        { sep: true },
        { label: multi ? `Remove ${this.sel.size} shortcuts` : "Remove from desktop", icon: "trash", danger: true, key: "Del", action: () => {
            const ids = multi ? [...this.sel] : [icon.id];
            ids.forEach((id) => this.remove(id, true));
            toast("Removed", ids.length + " shortcut" + (ids.length === 1 ? "" : "s") + " removed from the desktop.", "ok", 2200);
          } },
        { sep: true },
        { label: "Auto-arrange icons", icon: "grid", action: () => this.arrange() },
        { label: "New shortcut…", icon: "plus", action: () => this.newShortcut() },
        { sep: true },
        { label: "Display settings", icon: "gear", action: () => Settings.open("appearance") },
      ], x, y);
    },
    desktopMenu(x, y, extra = []) {
      contextMenu([
        { label: "New shortcut…", icon: "plus", action: () => this.newShortcut() },
        { label: "Auto-arrange icons", icon: "grid", action: () => this.arrange() },
        { label: state.iconsHidden ? "Show desktop icons" : "Hide desktop icons", icon: "eye-off", action: () => set({ iconsHidden: !state.iconsHidden }) },
        { sep: true },
        ...extra,
        { sep: true },
        { label: "Change theme", icon: "palette", action: () => Settings.open("appearance") },
        { label: "Cycle theme", icon: "palette", action: () => cycleTheme() },
        { label: "Next wallpaper", icon: "brush", action: () => { const i = WALLS.findIndex((w) => w.id === state.wallpaper); set({ wallpaper: WALLS[(i + 1) % WALLS.length].id }); } },
        { sep: true },
        { label: "Proxy diagnostics", icon: "bolt", action: () => Proxy.probeAll(true) },
        { label: "Settings", icon: "gear", action: () => Settings.open() },
      ], x, y);
    },
    newShortcut() {
      const apps = Registry.all().filter((a) => !a.hidden);
      formDialog({
        title: "New desktop shortcut", icon: "plus",
        msg: `<div class="faint" style="font-size:12px;margin-bottom:6px">Point a shortcut at an installed app, or at a website that opens in the Nebula Browser.</div>`,
        fields: [
          { key: "appId", label: "App", type: "select", value: "", options: [{ value: "", label: "— none —" }, ...apps.map((a) => ({ value: a.id, label: `${a.emoji || "▫"} ${a.name}` }))] },
          { key: "url", label: "…or a URL", value: "", placeholder: "https://example.com" },
          { key: "name", label: "Name", value: "", placeholder: "optional" },
          { key: "emoji", label: "Icon", value: "", maxlength: 4, placeholder: "🌐" },
        ],
        buttons: [{ label: "Cancel", value: null }, { label: "Add to desktop", primary: true, value: "ok" }],
      }).then((v) => {
        if (!v) return;
        const url = v.url && !/^https?:\/\//i.test(v.url) ? "https://" + v.url.replace(/^\/\//, "") : v.url;
        if (!v.appId && !url) return toast("Nothing to add", "Choose an app or type a URL.", "warn", 3000);
        this.add({ appId: v.appId || null, url: url || null, name: v.name || undefined, emoji: v.emoji || undefined });
      });
    },
  };

  /* ----------------------------- boot ----------------------------------- */
  const bootMessages = ["Mounting virtual filesystem…", "Starting service worker…", "Waking the Wisp relay…", "Loading themes…", "NebulaOS ready"];
  function bootLog(line) {
    const bl = $("#boot-log");
    if (bl) bl.textContent = (bl.textContent + (bl.textContent ? "\n" : "") + line).split("\n").slice(-4).join("\n");
  }
  async function boot() {
    window.__NEBULA_SOURCE__ = "<!DOCTYPE html>" + document.documentElement.outerHTML;
    applyTheme();
    Privacy.initAntiClose();
    Privacy.initAutoCloak();
    const prog = $("#splash-progress");
    const status = $("#splash-status");
    let i = 0;
    const tick = setInterval(() => { if (messages[i]) { status.textContent = messages[i]; prog.style.width = Math.min(96, 18 + i * 22) + "%"; i++; } }, 420);
    const messages = bootMessages;
    bootLog(`NebulaOS ${VERSION.os} (${VERSION.codename}) starting`);
    window.Nebula = API;
    Nebula.setupAppList?.();
    initUI();
    Desktop.init();
    Shell.clockTick();
    setInterval(() => Shell.clockTick(), 15000);
    Dock.render();
    Launcher.build();
    await sleep(1700);
    /* Failsafe: the desktop must become usable even if some proxy step stalls
     * (a slow relay, a browser quirk). The proxy keeps warming up in the
     * background and the badge reports its state when it settles. */
    const booted = await Promise.race([
      Proxy.boot().then(() => true).catch((e) => { bootLog("proxy: " + e.message); return true; }),
      sleep(20000).then(() => false),
    ]);
    if (!booted) { bootLog("proxy: still starting in the background"); toast("Proxy still starting", "The desktop is ready — the relay is still connecting in the background.", "warn", 6000); }
    clearInterval(tick);
    status.textContent = messages[messages.length - 1];
    prog.style.width = "100%";
    await sleep(420);
    $("#splash").classList.add("hide");
    setTimeout(() => $("#splash").remove(), 700);
    Proxy.warm();
    if (!state.seenWelcome) {
      set({ seenWelcome: true }, { silent: true });
      setTimeout(() => {
        dialog({
          title: "Welcome to NebulaOS",
          icon: "check",
          wide: true,
          msg: `<b>NebulaOS ${VERSION.os}</b> is a full glass desktop in one file.<br><br>
            • Press <code>Ctrl</code>+<code>Space</code> for the app grid, or click <b>All apps</b> in the dock.<br>
            • The <b>Browser</b>, <b>Discord</b> and <b>Games</b> tabs run through the proxy engine you pick in <b>Settings → Proxy</b>.<br>
            • For proxying to work, <code>nebula.sw.js</code> must be in the same folder as this file (jsDelivr / your host).<br>
            • Privacy tools live in the eye and shield buttons up top.`,
          buttons: [{ label: "Open the browser", primary: true, value: "browser" }, { label: "Settings", value: "settings" }, { label: "Dismiss" }],
        }).then((v) => { if (v === "browser") Nullset.open("browser"); if (v === "settings") Settings.open(); });
      }, 500);
    }
  }


  /* ----------------------------- global UI wiring ------------------------ */
  const Popover = {
    node: null,
    close() { this.node?.remove(); this.node = null; },
    show(anchor, html, opts = {}) {
      this.close();
      const p = el("div", { class: "glass-strong", style: `position:fixed;z-index:1200;padding:12px;border-radius:14px;box-shadow:var(--shadow-panel);width:${opts.width || 260}px` });
      p.innerHTML = html;
      $("#overlays").append(p);
      const r = anchor.getBoundingClientRect();
      const pr = p.getBoundingClientRect();
      const left = clamp(opts.align === "center" ? r.left + r.width / 2 - pr.width / 2 : r.right - pr.width, 8, innerWidth - pr.width - 8);
      const top = opts.below === false ? r.top - pr.height - 8 : r.bottom + 8;
      p.style.left = left + "px";
      p.style.top = clamp(top, 6, innerHeight - pr.height - 6) + "px";
      p.addEventListener("mousedown", (e) => e.stopPropagation());
      this.node = p;
      setTimeout(() => {
        const off = (e) => { if (!p.contains(e.target) && !anchor.contains(e.target)) { this.close(); removeEventListener("mousedown", off); } };
        addEventListener("mousedown", off);
      }, 0);
      return p;
    },
  };

  const Lock = {
    show() {
      const overlay = el("div", {
        id: "lockscreen",
        style: "position:fixed;inset:0;z-index:1800;display:grid;place-items:center;background:rgba(4,6,12,.72);backdrop-filter:blur(26px) saturate(140%);-webkit-backdrop-filter:blur(26px) saturate(140%);color:#fff;transition:opacity .3s ease",
      });
      overlay.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:14px">
          <svg style="width:84px;height:84px" viewBox="0 0 96 96"><use href="#i-logo"/></svg>
          <div style="font-size:22px;font-weight:300" id="lock-clock"></div>
          <div class="muted" style="font-size:12.5px">Click anywhere or press Enter to unlock NebulaOS</div>
        </div>`;
      document.body.append(overlay);
      const tick = () => { const t = $("#lock-clock"); if (t) t.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: state.hour12 }); };
      tick(); const iv = setInterval(tick, 1000);
      const unlock = () => {
        clearInterval(iv);
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 320);
        removeEventListener("keydown", onKey);
      };
      const onKey = (e) => { if (e.key === "Enter") unlock(); };
      overlay.addEventListener("click", unlock);
      addEventListener("keydown", onKey);
    },
  };

  function initUI() {
    /* top bar */
    $("#btn-activities").addEventListener("click", () => Launcher.toggle(""));
    const quickLaunch = (sel, appId) => $(sel)?.addEventListener("click", () => Nebula_app(appId));
    quickLaunch("#btn-bar-browser", "browser");
    quickLaunch("#btn-bar-apps", "store");
    quickLaunch("#btn-bar-games", "games");
    quickLaunch("#btn-bar-discord", "discord");
    quickLaunch("#btn-settings", "settings");
    $("#btn-new-window").addEventListener("click", (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      contextMenu([
        { label: "New browser window", icon: "globe", action: () => Nebula_app("browser") },
        { label: "New terminal", icon: "term", key: "Ctrl+Alt+T", action: () => Nebula_app("terminal") },
        { label: "Files", icon: "files", action: () => Nebula_app("files") },
        { label: "Settings", icon: "gear", action: () => Settings.open() },
        { sep: true },
        { label: "App grid", icon: "apps", key: "Ctrl+Space", action: () => Launcher.toggle("") },
      ], r.left, r.bottom + 6);
    });
    $("#btn-clock").addEventListener("click", (e) => {
      const d = new Date();
      const days = [...Array(7)].map((_, i) => {
        const cur = new Date(d); cur.setDate(d.getDate() - ((d.getDay() + 6) % 7) + i);
        const isToday = cur.toDateString() === d.toDateString();
        return `<div style="text-align:center;padding:5px 3px;border-radius:8px;${isToday ? "background:var(--accent);color:var(--accent-ink);font-weight:700" : ""}">
          <div style="font-size:9.5px;opacity:.7">${cur.toLocaleDateString([], { weekday: "short" }).slice(0, 3)}</div>
          <div style="font-size:12px">${cur.getDate()}</div></div>`;
      }).join("");
      Popover.show(e.currentTarget, `
        <div style="text-align:center;margin-bottom:10px">
          <div style="font-size:26px;font-weight:300" id="clock-full">${d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: state.hour12 })}</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">${days}</div>
        <div class="hr" style="margin:12px 0"></div>
        <div style="font-size:12px;line-height:1.7" class="muted">
          Engine <b>${esc(ENGINES[state.engine].name)}</b><br>
          Transport <b>${esc(TRANSPORTS[state.transport].name)}</b><br>
          Wisp <span class="mono" style="font-size:11px">${esc(state.wisp)}</span>
        </div>`, { align: "center", width: 300 });
    });
    $("#btn-quicktheme").addEventListener("click", (e) => {
      const cols = THEMES.map((t) => `<button class="theme-swatch" data-theme-id="${t.id}" title="${t.name}" style="height:34px;border-radius:9px;border:2px solid ${state.theme === t.id ? "var(--accent)" : "transparent"};background:linear-gradient(135deg,${t.colors[0]},${t.colors[1]});cursor:pointer"></button>`).join("");
      const p = Popover.show(e.currentTarget, `<div style="font-size:12px;font-weight:650;margin-bottom:9px">Theme</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:7px">${cols}</div>`, { width: 250 });
      p.querySelectorAll("[data-theme-id]").forEach((b) => b.addEventListener("click", () => { const t = b.dataset.themeId; set({ theme: t }); Popover.close(); toast("Theme changed", THEMES.find((x) => x.id === t).name, "ok", 1600); }));
    });
    if (Proxy.appProtocol().startsWith("blob")) {
      const b = $("#btn-blob-exit") || el("button", { class: "bar-btn", id: "btn-blob-exit", title: "This tab is running from a blob: URL — click to return to the normal page" });
      b.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:currentColor;display:inline-block"></span><span>Blob mode</span>`;
      if (!b.parentElement) $("#bar-right").prepend(b);
      b.addEventListener("click", () => Privacy.exitBlob());
      setTimeout(() => toast("Blob mode active", "This session is a <b>blob:</b> URL, so nothing is written to history. The proxy engine needs a normal page — click <b>Blob mode</b> in the top bar to switch back.", "ok", 12000), 2600);
    }
    $("#btn-cloak").addEventListener("click", () => {
      if (document.title !== "NebulaOS") { Privacy.uncloak(); toast("Cloak removed", "The tab shows NebulaOS again.", "ok", 2200); }
      else Privacy.cloak();
    });
    $("#btn-settings").addEventListener("click", () => Settings.open());
    $("#btn-power").addEventListener("click", (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      contextMenu([
        { label: "Lock screen", icon: "lock", action: () => Lock.show() },
        { label: "Restart desktop", icon: "reload", action: async () => {
            if (state.anticlose) {
              const ok = await dialog({ title: "Restart the desktop?", icon: "warn", msg: "Anti-close is enabled, so this needs a confirmation. Open windows will close.", buttons: [{ label: "Cancel", value: false }, { label: "Restart", primary: true, value: true }] });
              if (!ok) return;
            }
            location.reload();
          } },
        { sep: true },
        { label: "Close this tab", icon: "x", danger: true, action: async () => {
            if (state.anticlose) {
              const ok = await dialog({
                title: "Close this tab?", icon: "warn",
                msg: "Anti-close is on. Choose <b>Dismiss</b> to keep working, or confirm to really close the tab.<br><br>If your browser blocks scripts from closing tabs that they did not open, NebulaOS will cloak the tab instead.",
                buttons: [{ label: "Keep working", value: false, primary: true }, { label: "Close tab", danger: true, value: true }],
              });
              if (!ok) return;
            }
            try { window.close(); } catch {}
            setTimeout(() => {
              Privacy.applyCloak();
              dialog({ title: "This tab could not be closed", icon: "warn", msg: "Your browser only lets scripts close tabs they opened. NebulaOS cloaked the tab instead (title set to <code>" + esc(document.title) + "</code>). Press Ctrl+W to close it yourself.", buttons: [{ label: "Understood", primary: true }] });
            }, 260);
          } },
        { label: "Cloak tab", icon: "eye-off", action: () => Privacy.cloak() },
        { label: "Convert to blob URL", icon: "blob", action: () => Privacy.toBlob() },
      ], r.right - 220, r.bottom + 6);
    });
    $("#tray-status").addEventListener("click", () => Settings.open("proxy"));

    /* launcher input */
    const linput = $("#launcher-input");
    linput.addEventListener("input", () => Launcher.render(linput.value));
    linput.addEventListener("keydown", (e) => Launcher.key(e));
    $("#launcher").addEventListener("mousedown", (e) => { if (e.target.dataset.close) Launcher.close(); });

    /* desktop right-click — the shell items are shared with the icon layer */
    Desktop.extraItems = [
        { label: "New browser window", icon: "globe", action: () => Nebula_app("browser") },
        { label: "New terminal", icon: "term", key: "Ctrl+Alt+T", action: () => Nebula_app("terminal") },
      { label: "App grid", icon: "apps", key: "Ctrl+Space", action: () => Launcher.toggle("") },
    ];
    $("#wallpaper").addEventListener("contextmenu", (e) => {
      e.preventDefault();
      Desktop.desktopMenu(e.clientX, e.clientY, Desktop.extraItems);
    });
    /* bar background right-click = session menu */
    $("#bar").addEventListener("contextmenu", (e) => {
      if (e.target.closest(".bar-btn")) return;
      e.preventDefault();
      contextMenu([
        { label: "Restart desktop", icon: "reload", action: () => location.reload() },
        { label: "Lock screen", icon: "lock", action: () => Lock.show() },
        { sep: true },
        { label: state.dockHidden ? "Show dock" : "Hide dock", icon: "menu", action: () => set({ dockHidden: !state.dockHidden }) },
        { label: state.dockPos === "left" ? "Dock to bottom" : "Dock to left", icon: "snap", action: () => set({ dockPos: state.dockPos === "left" ? "bottom" : "left" }) },
        { sep: true },
        { label: state.anticlose ? "Disable anti-close" : "Enable anti-close", icon: "shield", action: () => set({ anticlose: !state.anticlose }) },
      ], e.clientX, e.clientY);
    });

    /* global shortcuts */
    addEventListener("keydown", (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "textarea" || e.target.isContentEditable;
      // launcher
      if ((e.ctrlKey && e.code === "Space") || e.key === "Meta") { e.preventDefault(); Launcher.toggle(""); return; }
      if (e.key === "Escape") { if (Launcher.open) Launcher.close(); hideCtx(); Popover.close(); return; }
      if (typing) return;

      /* desktop icons: arrows / Enter / F2 / Delete when a shortcut is selected
       * and the focus is not inside a window, dialog or the launcher (so those
       * keys keep working normally everywhere else) */
      const insideUI = !!document.activeElement?.closest?.(".win, .dialog-wrap, #launcher, #ctxmenu, input, textarea, select");
      if (Desktop.sel.size && !insideUI && e.key !== "Escape") {
        if (e.key.startsWith("Arrow")) { e.preventDefault(); Desktop.move(e.key); return; }
        if (e.key === "Enter") { e.preventDefault(); Desktop.openSelected(); return; }
        if (e.key === "F2") { const ic = Desktop.list().find((i) => Desktop.sel.has(i.id)); if (ic) { e.preventDefault(); Desktop.rename(ic); } return; }
        if (e.key === "Delete" || e.key === "Backspace") {
          e.preventDefault();
          const ids = [...Desktop.sel];
          ids.forEach((id) => Desktop.remove(id, true));
          toast("Removed", ids.length + " shortcut" + (ids.length === 1 ? "" : "s") + " removed.", "ok", 2200);
          return;
        }
      }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "t") { e.preventDefault(); Nebula_app("terminal"); return; }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "b") { e.preventDefault(); Nebula_app("browser"); return; }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "f") { e.preventDefault(); Nebula_app("files"); return; }
      if (e.ctrlKey && e.altKey && e.shiftKey && e.key.toLowerCase() === "p") { e.preventDefault(); Nebula_app("paint"); return; }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "q") { e.preventDefault(); $("#btn-power").click(); return; }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "l") { e.preventDefault(); Lock.show(); return; }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "d") { e.preventDefault(); set({ dockHidden: !state.dockHidden }); return; }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "r") { e.preventDefault(); Proxy.probeAll(true); return; }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "p") { e.preventDefault(); Nebula_app("paint"); return; }
      // window management
      if (e.altKey && focusedWin && ["ArrowLeft", "ArrowRight", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") focusedWin.toggleMax();
        else focusedWin.snapTo(e.key === "ArrowLeft" ? "left" : "right");
        return;
      }
      if (e.altKey && e.key === "F4" && focusedWin) { e.preventDefault(); focusedWin.close(); return; }
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        const list = [...wins.values()].filter((w) => w.state !== "minimized");
        if (list.length < 2) return;
        const i = list.indexOf(focusedWin);
        list[(i + 1) % list.length].focus();
        return;
      }
    });

    /* keep windows sane on resize */
    addEventListener("resize", () => {
      const wa = workarea();
      wins.forEach((w) => {
        if (w.state === "maximized") { Object.assign(w.bounds, { x: wa.x, y: wa.y, w: wa.w, h: wa.h }); w.apply(); }
        else {
          w.bounds.x = clamp(w.bounds.x, -w.bounds.w + 80, innerWidth - 80);
          w.bounds.y = clamp(w.bounds.y, wa.y - 20, innerHeight - 60);
          w.apply();
        }
        w.emitResize();
      });
    });

    /* warn when leaving via reload/close */
    addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") Popover.close(); });
  }

  /* small helper so UI code can launch apps without referencing the apps module */
  function Nebula_app(id) {
    const a = Registry.byId(id);
    if (a) return a.run();
    return null;
  }

  /* ----------------------------- public API ----------------------------- */
  const API = {
    $, $$, el, icon, esc, uid, clamp, sleep, fmtBytes, toast, dialog, contextMenu,
    state, set, save, applyTheme, applySettings, cycleTheme,
    Win, wins, focusWin: () => focusedWin, workarea,
    Shell, Dock, Launcher, Privacy, Proxy, Settings, Registry, Desktop, PYRO_SITES, THEMES, WALLS, SEARCH_ENGINES, ENGINES, TRANSPORTS, WISP_PRESETS, LIB, CDN, VERSION,
    boot, bootLog, initUI, Lock, Popover,
    bus,   /* pub/sub for drop-in apps: bus.on("theme" | "settings", fn) */
    openApp(id, opts) { const a = Registry.byId(id); return a ? a.run(opts) : null; },
  };
  return API;
})();

/* Apps module attaches itself here during boot */
const Nullset = {
  open(id, opts) {
    const app = Nebula.Registry.byId(id);
    return app ? app.run(opts) : null;
  },
};
