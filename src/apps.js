/* =============================================================================
 * NebulaOS — applications
 * Registers the full app suite: Nebula Browser (multi-tab proxied browsing),
 * Discord, App Store, Games, Files, Notepad, Calculator, Paint, Terminal.
 * ========================================================================== */
(() => {
  const { $, el, icon, esc, uid, clamp, sleep, toast, dialog, contextMenu, Win, Registry, state, set, Proxy, Privacy, Settings, openApp, fmtBytes, Launcher, Dock } = Nebula;

  /* ==========================================================================
   *  Proxy session — one per browser tab / app view
   * ======================================================================== */
  class ProxySession {
    constructor(engine, opts = {}) {
      this.engine = engine;
      this.opts = opts;
      this.iframe = el("iframe", { allow: "clipboard-read; clipboard-write; fullscreen; geolocation; microphone; camera", referrerpolicy: "no-referrer" });
      this.currentUrl = "";
      this.loading = false;
      this.frameObj = null;
      this.timer = null;
      this.navStack = [];
      this.ready = false;
    }

    async init() {
      if (this.engine === "sc2") {
        await Proxy.registerSW();
        await Proxy.loadSc2Lib();
        const Controller = globalThis.$scramjetController.Controller;
        const transport = await Proxy.makeStandaloneTransport();
        const controller = new Controller({
          serviceworker: await Proxy.swWorker(),
          transport,
          config: {
            prefix: Proxy.prefixes().sc2,
            scramjetPath: Nebula.LIB.sc2() + "scramjet.js",
            injectPath: Nebula.LIB.sc2ctl() + "controller.inject.js",
            wasmPath: Nebula.LIB.sc2() + "scramjet.wasm",
            virtualWasmPath: "scramjet.wasm.js",
            codec: { encode: (u) => (u ? encodeURIComponent(u) : u), decode: (u) => (u ? decodeURIComponent(u) : u) },
          },
        });
        await controller.wait();
        this.controller = controller;
        this.frameObj = controller.createFrame(this.iframe, { plugins: [] });
      } else {
        await Proxy.ensureEngine(this.engine);
      }
      this.bindIframe();
      this.ready = true;
      return this;
    }

    bindIframe() {
      this.iframe.addEventListener("load", () => {
        this.loading = false;
        this.opts.onLoading?.(false);
        this.syncUrl();
        try { this.opts.onTitle?.(this.iframe.contentDocument?.title || ""); } catch {}
      });
    }

    tick() {
      clearInterval(this.timer);
      this.timer = setInterval(() => this.syncUrl(), 420);
    }

    syncUrl() {
      try {
        const href = this.iframe.contentWindow?.location?.href || this.iframe.src;
        if (href && href !== "about:blank" && href !== this.currentUrl) {
          this.currentUrl = href;
          this.opts.onUrl?.(Proxy.decodeUrl(href), href);
        }
        if (!this.loading) {
          const title = this.iframe.contentDocument?.title;
          if (title) this.opts.onTitle?.(title);
        }
      } catch {}
    }

    async go(url) {
      this.loading = true;
      this.opts.onLoading?.(true);
      const proxied = Proxy.buildUrl(url, this.engine);
      if (this.engine === "sc2" && this.frameObj) {
        try { await this.frameObj.go(url); } catch (e) { this.iframe.src = proxied; }
      } else {
        this.iframe.src = proxied;
      }
      this.currentUrl = proxied;
      this.opts.onUrl?.(url, proxied);
      this.tick();
    }
    back() { try { this.iframe.contentWindow.history.back(); } catch {} }
    forward() { try { this.iframe.contentWindow.history.forward(); } catch {} }
    reload() {
      this.loading = true;
      this.opts.onLoading?.(true);
      try { this.iframe.contentWindow.location.reload(); } catch { this.iframe.src = this.iframe.src; }
    }
    stop() { try { this.iframe.contentWindow.stop(); } catch {} this.loading = false; this.opts.onLoading?.(false); }
    destroy() { clearInterval(this.timer); try { this.iframe.remove(); } catch {} }
  }


  /* ==========================================================================
   *  Quantum Browser — rebuilt on the Nebula proxy stack
   *  ---------------------------------------------------------------------
   *  This keeps the UI people already knew from quantumbrouser.html (tab strip,
   *  address bar + Go, quick links, Bookmarks / History / Source panels) but
   *  every page is now loaded through a real ProxySession instead of a bare
   *  <iframe src="https://...">, which is why sites like Google, Discord and
   *  YouTube work here instead of bouncing off X-Frame-Options.
   * ======================================================================== */
  const Quantum = {
    win: null,
    tabs: [],
    active: null,
    panel: null,
    bookmarks: null,
    history: null,

    open(url) {
      if (this.win && Nebula.wins.has(this.win.id)) {
        this.win.focus();
        if (url) this.tab().url || this.navigate(url);
        return this.win;
      }
      try { this.bookmarks = JSON.parse(localStorage.getItem("qbm") || "[]"); } catch { this.bookmarks = []; }
      try { this.history = JSON.parse(localStorage.getItem("qhist") || "[]"); } catch { this.history = []; }
      this.tabs = [];
      this.active = null;
      this.panel = null;
      this.win = new Win({
        appId: "quantum", title: "Quantum Browser", sub: "Proxied", width: 1100, height: 740, solid: true,
        iconHtml: icon("globe", "width:16px;height:16px"),
        onClose: () => { this.tabs.forEach((t) => t.session?.destroy()); this.tabs = []; this.active = null; this.win = null; },
      });
      this.build();
      this.statusUrl.textContent = "Ready · pages load through the Nebula proxy";
      if (url) this.newTab(url); else this.newTab();
      return this.win;
    },

    tab() { return this.tabs.find((t) => t.id === this.active) || null; },

    build() {
      const c = this.win.content;
      c.innerHTML = "";
      const root = el("div", { class: "quantum" });

      /* --- tab strip --- */
      const bar = el("div", { class: "q-tabs" });
      this.tabstrip = bar;
      const add = el("button", { class: "q-plus", title: "New tab" });
      add.innerHTML = icon("plus", "width:14px;height:14px");
      add.addEventListener("click", () => this.newTab());
      const brand = el("div", { class: "q-brand", html: `<span class="q-orb"></span>QUANTUM` });
      bar.append(brand);

      /* --- toolbar --- */
      const tools = el("div", { class: "q-tools" });
      const mk = (ic, title, fn) => { const b = el("button", { class: "q-btn", title }); b.innerHTML = icon(ic, "width:15px;height:15px"); b.addEventListener("click", fn); return b; };
      this.btnBack = mk("back", "Back", () => this.back());
      this.btnFwd = mk("fwd", "Forward", () => this.forward());
      this.btnReload = mk("reload", "Reload", () => this.reload());
      this.btnHome = mk("home", "Home", () => this.home());
      const addr = el("div", { class: "q-addr" });
      addr.innerHTML = `<span class="q-lock">${icon("lock", "width:12px;height:12px")}</span>`;
      this.addr = el("input", { placeholder: "Search with DuckDuckGo or type an address", spellcheck: "false", autocomplete: "off" });
      this.addr.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { const v = this.addr.value.trim(); if (v) this.navigate(v); this.addr.blur(); }
        if (e.key === "Escape") { this.syncAddr(); this.addr.blur(); }
      });
      this.addr.addEventListener("focus", () => this.addr.select());
      const go = el("button", { class: "q-go", text: "Go" });
      go.addEventListener("click", () => { const v = this.addr.value.trim(); if (v) this.navigate(v); });
      addr.append(this.addr, go);
      this.engineSel = el("select", { class: "q-sel", title: "Proxy engine" });
      for (const [id, e] of Object.entries(Nebula.ENGINES)) this.engineSel.append(el("option", { value: id, text: e.name, selected: state.engine === id }));
      this.engineSel.addEventListener("change", async () => {
        const t = this.tab();
        const url = t?.url || "";
        set({ engine: this.engineSel.value });
        toast("Quantum", "Engine → " + Nebula.ENGINES[this.engineSel.value].name, "ok", 2000);
        (this.tab() || t).loading = true;
        if (t) { t.url = url || t.url; await this.loadTab(t, url || t.url); }
      });
      const spinner = el("div", { class: "q-spin" });
      this.spinner = spinner;
      const panelBtn = mk("menu", "Bookmarks, history & proxy info", () => this.togglePanel());
      panelBtn.classList.add("q-panelbtn");
      tools.append(this.btnBack, this.btnFwd, this.btnReload, this.btnHome, addr, this.engineSel, spinner, panelBtn);

      /* --- viewport --- */
      this.view = el("div", { class: "q-view" });
      this.drawer = el("div", { class: "q-drawer" });

      const status = el("div", { class: "wstatus q-status" });
      const sUrl = el("div", { class: "q-surl" });
      this.statusUrl = sUrl;

      root.append(bar, tools, el("div", { class: "q-stage" }));
      const stage = root.querySelector(".q-stage");
      stage.append(this.view, this.drawer);
      root.append(status);
      c.append(root);
      status.append(sUrl);
      bar.append(add);
    },

    /* ---------------- tabs ---------------- */
    newTab(url) {
      const id = "qt-" + uid();
      const tab = { id, title: "New tab", url: "", session: null, stack: [], idx: -1 };
      this.tabs.push(tab);
      this.active = id;
      this.renderTabs();
      if (url) this.loadTab(tab, url); else this.showStart(tab);
      return tab;
    },
    closeTab(id) {
      const i = this.tabs.findIndex((t) => t.id === id);
      if (i < 0) return;
      this.tabs[i].session?.destroy();
      this.tabs.splice(i, 1);
      if (!this.tabs.length) return this.newTab();
      if (this.active === id) this.active = (this.tabs[i] || this.tabs[i - 1]).id;
      this.renderTabs();
      this.mount(this.tab());
    },
    selectTab(id) { this.active = id; this.renderTabs(); this.mount(this.tab()); },
    renderTabs() {
      this.tabstrip.querySelectorAll(".q-tab").forEach((n) => n.remove());
      for (const t of this.tabs) {
        const node = el("div", { class: "q-tab" + (t.id === this.active ? " active" : ""), title: t.title });
        node.innerHTML = `<span class="q-dot"></span><span class="q-title">${esc(t.title)}</span>`;
        const x = el("button", { class: "q-x", title: "Close tab" });
        x.innerHTML = icon("x", "width:11px;height:11px");
        x.addEventListener("click", (e) => { e.stopPropagation(); this.closeTab(t.id); });
        node.append(x);
        node.addEventListener("click", () => this.selectTab(t.id));
        this.tabstrip.append(node);
      }
    },

    /* ---------------- loading ---------------- */
    async loadTab(tab, input) {
      const url = Proxy.toUrl(input);
      tab.url = url;
      tab.title = "Loading…";
      this.renderTabs();
      this.setBusy(true);
      this.history.unshift({ url, title: url, at: Date.now() });
      this.history = this.history.slice(0, 200);
      localStorage.setItem("qhist", JSON.stringify(this.history));
      if (tab.stack[tab.idx] !== url) { tab.stack = tab.stack.slice(0, tab.idx + 1); tab.stack.push(url); tab.idx = tab.stack.length - 1; }
      try {
        tab.session?.destroy();
        const session = await new ProxySession(state.engine, {
          onLoading: (on) => this.setBusy(on),
          onTitle: (title) => { if (title && this.tabs.includes(tab)) { tab.title = title; this.renderTabs(); this.win.setSub?.(title); } },
          onUrl: (url2) => { if (url2 && this.tabs.includes(tab)) { tab.url = url2; this.syncAddr(); this.statusUrl.textContent = url2; if (this.panelName === "proxy" && this.drawer.classList.contains("open")) this.renderPanel("proxy"); } },
        }).init();
        tab.session = session;
        this.mount(tab);
        await session.go(url);
        this.syncAddr();
        this.statusUrl.textContent = "Proxied via " + Nebula.ENGINES[state.engine].name + " · " + Nebula.TRANSPORTS[state.transport].name;
      } catch (err) {
        this.setBusy(false);
        this.showError(tab, err);
      }
    },
    mount(tab) {
      if (!tab) return;
      this.view.innerHTML = "";
      if (tab.session?.iframe) this.view.append(tab.session.iframe);
      else if (!tab.start) this.showStart(tab);
      this.syncAddr();
    },
    setBusy(on) {
      this.spinner?.classList.toggle("on", !!on);
      this.btnReload?.classList.toggle("stop", !!on);
    },
    syncAddr() {
      const t = this.tab();
      if (!t) return;
      if (document.activeElement !== this.addr) this.addr.value = t.url || "";
    },

    /* ---------------- navigation ---------------- */
    navigate(input, tab) {
      const t = tab || this.tab() || this.newTab();
      if (!state.wisp) { toast("Wisp relay missing", "Set a relay in Settings → Proxy before browsing.", "warn", 4000); }
      this.loadTab(t, input);
      if (t.start) { t.start = false; }
    },
    home() { const t = this.tab(); if (!t) return; t.session?.destroy(); t.session = null; t.start = true; t.url = ""; this.showStart(t); this.statusUrl.textContent = "New tab · proxy ready"; },
    back() { const t = this.tab(); if (!t?.stack.length || t.idx <= 0) return; t.idx--; this.loadTab(t, t.stack[t.idx]); },
    forward() { const t = this.tab(); if (!t || t.idx >= t.stack.length - 1) return; t.idx++; this.loadTab(t, t.stack[t.idx]); },
    reload() { const t = this.tab(); if (!t) return; if (t.url) this.loadTab(t, t.url); },

    /* ---------------- start page ---------------- */
    showStart(tab) {
      tab.start = true;
      this.renderTabs();
      this.view.innerHTML = "";
      const sp = el("div", { class: "q-start" });
      sp.innerHTML = `
        <div class="q-logo"><span class="q-orb big"></span></div>
        <h2>Start browsing privately</h2>
        <p>Every page is fetched through the Nebula proxy — the site never sees this window.</p>`;
      const quick = el("div", { class: "q-quick" });
      const links = [["Google", "https://www.google.com"], ["DuckDuckGo", "https://duckduckgo.com"], ["Wikipedia", "https://en.wikipedia.org"], ["GitHub", "https://github.com"], ["Reddit", "https://www.reddit.com"], ["YouTube", "https://www.youtube.com"]];
      for (const [name, url] of links) {
        const b = el("button", { class: "q-chip", text: name });
        b.addEventListener("click", () => this.navigate(url, tab));
        quick.append(b);
      }
      sp.append(quick);
      const note = el("div", { class: "q-note" });
      const ok = Proxy.swReady;
      note.innerHTML = ok
        ? `Proxy ready · <b>${esc(Nebula.ENGINES[state.engine].name)}</b> + <b>${esc(Nebula.TRANSPORTS[state.transport].name)}</b> · relay <code>${esc(state.wisp)}</code>`
        : `Proxy service worker ${Proxy.swReady ? "active" : "not active yet"} · <a href="#" id="q-fix">run diagnostics</a>`;
      note.querySelector("#q-fix")?.addEventListener("click", (e) => { e.preventDefault(); Proxy.probeAll(true); });
      sp.append(note);
      this.view.append(sp);
    },
    showError(tab, err) {
      this.view.innerHTML = "";
      const box = el("div", { class: "q-start" });
      box.innerHTML = `<h2>This page could not be proxied</h2><p>${esc(String(err?.message || err))}</p>
        <p class="q-hint">Check the relay in <b>Settings → Proxy</b>, or try another engine (Scramjet v2 handles the most sites, Ultraviolet is the lightest).</p>`;
      const retry = el("button", { class: "q-chip", text: "Try again" });
      retry.addEventListener("click", () => tab.url && this.loadTab(tab, tab.url));
      box.append(retry);
      this.view.append(box);
    },

    /* ---------------- drawer: bookmarks / history / source / proxy ---------------- */
    togglePanel(tabName) {
      const open = this.drawer.classList.toggle("open");
      if (open) this.renderPanel(tabName || this.panelName || "bookmarks");
    },
    renderPanel(name) {
      this.panelName = name;
      const d = this.drawer;
      d.innerHTML = "";
      const tabs = el("div", { class: "q-dtabs" });
      for (const [id, label] of [["bookmarks", "Bookmarks"], ["history", "History"], ["source", "Source"], ["proxy", "Proxy"]]) {
        const b = el("button", { class: "q-dtab" + (id === name ? " on" : ""), text: label });
        b.addEventListener("click", () => this.renderPanel(id));
        tabs.append(b);
      }
      d.append(tabs);
      const body = el("div", { class: "q-dbody" });
      d.append(body);

      if (name === "bookmarks") {
        const t = this.tab();
        const add = el("button", { class: "q-chip wide", text: t?.url ? "★ Bookmark this page" : "Open a page first" });
        add.disabled = !t?.url;
        add.addEventListener("click", () => {
          this.bookmarks.unshift({ title: t.title, url: t.url });
          this.bookmarks = this.bookmarks.slice(0, 100);
          localStorage.setItem("qbm", JSON.stringify(this.bookmarks));
          this.renderPanel("bookmarks");
        });
        body.append(add);
        if (!this.bookmarks.length) body.append(el("p", { class: "q-empty", text: "No bookmarks yet." }));
        for (const b of this.bookmarks) {
          const row = el("div", { class: "q-row" });
          row.innerHTML = `<div class="q-main"><div class="q-rt">${esc(b.title || b.url)}</div><div class="q-ru">${esc(b.url)}</div></div>`;
          const del = el("button", { class: "q-btn", title: "Remove" });
          del.innerHTML = icon("x", "width:12px;height:12px");
          del.addEventListener("click", () => { this.bookmarks = this.bookmarks.filter((x) => x !== b); localStorage.setItem("qbm", JSON.stringify(this.bookmarks)); this.renderPanel("bookmarks"); });
          const open = el("button", { class: "q-btn", title: "Open" });
          open.innerHTML = icon("expand", "width:12px;height:12px");
          open.addEventListener("click", () => this.navigate(b.url));
          row.append(open, del);
          body.append(row);
        }
      } else if (name === "history") {
        const clear = el("button", { class: "q-chip wide", text: "Clear history" });
        clear.addEventListener("click", () => { this.history = []; localStorage.setItem("qhist", "[]"); this.renderPanel("history"); });
        body.append(clear);
        if (!this.history.length) body.append(el("p", { class: "q-empty", text: "Nothing here yet." }));
        for (const h of this.history.slice(0, 80)) {
          const row = el("div", { class: "q-row" });
          row.innerHTML = `<div class="q-main"><div class="q-rt">${esc(h.url)}</div><div class="q-ru">${new Date(h.at).toLocaleString()}</div></div>`;
          row.addEventListener("click", () => this.navigate(h.url));
          body.append(row);
        }
      } else if (name === "source") {
        const t = this.tab();
        const url = t?.url || (t?.session?.currentUrl ? Proxy.decodeUrl(t.session.currentUrl) : "");
        const box = el("textarea", { class: "q-src", spellcheck: "false", readonly: "true" });
        box.value = "Fetching page source through the proxy…";
        body.append(box);
        (async () => {
          try {
            const url2 = url || "https://example.com/";
            const res = await Proxy.fetchText(url2, state.engine);
            box.value = `<!-- ${url2} · HTTP ${res.status} · ${res.text.length} bytes · via ${res.proxied.slice(0, 60)}… -->\n` + res.text;
          } catch (e) { box.value = "// Could not fetch source: " + (e?.message || e); }
        })();
      } else {
        const t = this.tab();
        const rows = [
          ["Engine", Nebula.ENGINES[state.engine].name],
          ["Transport", Nebula.TRANSPORTS[state.transport].name],
          ["Relay", state.wisp],
          ["Service worker", Proxy.swReady ? "active" : "inactive"],
          ["Frame origin", t?.session?.iframe?.contentWindow?.origin || "—"],
          ["Proxied URL", t?.session?.currentUrl || "—"],
          ["Real URL", t?.url || "—"],
          ["Tab title", t?.title || "—"],
        ];
        for (const [k, v] of rows) {
          const row = el("div", { class: "q-kv" });
          row.innerHTML = `<b>${esc(k)}</b><span>${esc(String(v))}</span>`;
          body.append(row);
        }
        const btns = el("div", { class: "row", style: "gap:6px;flex-wrap:wrap" });
        const mk = (label, fn) => { const b = el("button", { class: "q-chip", text: label }); b.addEventListener("click", fn); btns.append(b); return b; };
        mk("Diagnostics", () => Proxy.probeAll(true));
        mk("Settings", () => Settings.open("proxy"));
        mk("Cloak (about:blank)", () => Privacy.cloak());
        mk("Open in real tab", () => { const u = t?.session?.currentUrl; if (u) window.open(u, "_blank"); });
        mk("Copy URL", async () => { const u = t?.session?.currentUrl; if (u) { await navigator.clipboard?.writeText(u).catch(() => {}); toast("Copied", u, "ok", 2000); } });
        body.append(btns);
      }
    },
  };

  /* ==========================================================================
   *  Nebula Browser
   * ======================================================================== */
  const Browser = {
    win: null,
    tabs: [],
    active: null,
    /* ---- browser skins ----------------------------------------------------
     * "glass" is the default look; "pyro" ports the pyro proxy UI (orange/red
     * glow on black, monospace chrome, live clock, GO + PRIVACY/PROXY/RESET
     * chips, category start page). Everything routes through the real proxy
     * stack either way — the skin only changes the chrome. */
    skin() { return state.browserSkin === "pyro" ? "pyro" : "glass"; },
    setSkin(id) {
      set({ browserSkin: id });
      const win = this.win;
      if (win && Nebula.wins.has(win.id)) {
        const r = win.content.querySelector(".browser");
        if (r) r.classList.toggle("skin-pyro", id === "pyro");
        if (r) { r.classList.toggle("skin-glass", id !== "pyro"); }
        this.decorateChrome();
        this.home();
      }
      toast("Browser skin", id === "pyro" ? "Pyro skin applied." : "Glass skin applied.", "ok", 2200);
    },
    open(opts = {}) {
      if (this.win && Nebula.wins.has(this.win.id)) {
        this.win.restore?.();
        this.win.focus();
        if (opts.url) this.newTab(opts.url);
        return this.win;
      }
      this.win = new Win({
        appId: "browser",
        title: "Nebula Browser",
        iconHtml: icon("globe", "width:16px;height:16px"),
        width: 1120, height: 720, solid: true,
        statusbar: `<span id="bw-status">Ready</span><span class="grow"></span><span id="bw-engine" class="pill"></span><span id="bw-wisp" class="faint mono"></span>`,
        onClose: () => { this.closeAll(); this.win = null; },
      });
      this.build(this.win);
      this.decorateChrome();
      this.updateStatus();
      this.newTab(opts.url);
      return this.win;
    },
    closeAll() {
      clearInterval(this._pyroTimer);
      this.tabs.forEach((t) => t.session?.destroy());
      this.tabs = []; this.active = null;
    },
    build(win) {
      const pyro = this.skin() === "pyro";
      const root = el("div", { class: "browser skin-" + this.skin() });
      const strip = el("div", { class: "tabstrip" });
      const newTabBtn = el("button", { class: "nav-btn", title: "New tab (Ctrl+T)", style: "margin-left:4px" });
      newTabBtn.innerHTML = icon("plus");
      newTabBtn.addEventListener("click", () => this.newTab());
      strip.append(newTabBtn);
      this.strip = strip;

      const nav = el("div", { class: "navbar" });
      const mkNav = (ic, title, fn) => { const b = el("button", { class: "nav-btn", title }); b.innerHTML = icon(ic); b.addEventListener("click", fn); return b; };
      this.btnBack = mkNav("back", "Back", () => this.session()?.back());
      this.btnFwd = mkNav("fwd", "Forward", () => this.session()?.forward());
      this.btnReload = mkNav("reload", "Reload", () => { const s = this.session(); s?.loading ? s.stop() : s?.reload(); });
      this.btnHome = mkNav("home", "Home", () => this.home());
      const omni = el("div", { class: "omnibox" });
      omni.innerHTML = `<span class="lock">${icon("lock", "width:13px;height:13px")}</span>`;
      const input = el("input", { placeholder: "Search the web or enter an address", spellcheck: "false", autocomplete: "off" });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { const v = input.value.trim(); if (v) this.navigate(v); input.blur(); }
        if (e.key === "Escape") { input.value = this.session()?.currentUrl ? Proxy.decodeUrl(this.session().currentUrl) : ""; input.blur(); }
      });
      input.addEventListener("focus", () => input.select());
      const engineSel = el("select", { title: "Backend engine" });
      for (const [id, e] of Object.entries(Nebula.ENGINES)) engineSel.append(el("option", { value: id, text: e.name, selected: state.engine === id }));
      engineSel.addEventListener("change", async () => {
        const prev = this.session();
        const url = prev ? Proxy.decodeUrl(prev.currentUrl) : "";
        set({ engine: engineSel.value });
        this.pill.textContent = "… starting " + Nebula.ENGINES[engineSel.value].name;
        try {
          const t = this.tabs.find((x) => x.session === prev);
          if (t && url) { t.session.destroy(); t.session = await new ProxySession(engineSel.value, t.hooks).init(); t.session.iframe.style.display = "block"; t.view.innerHTML = ""; t.view.append(t.session.iframe); await t.session.go(url); }
          else this.newTab(url);
          toast("Engine switched", Nebula.ENGINES[engineSel.value].name + " is now serving this tab.", "ok");
        } catch (e) { toast("Engine failed", esc(String(e.message || e)), "err", 7000); }
        this.updateStatus();
      });
      this.engineSel = engineSel;
      const pill = el("span", { class: "badge-engine", text: Nebula.ENGINES[state.engine].short });
      this.pill = pill;
      omni.append(input, engineSel, pill);
      this.omni = input;
      const star = mkNav("star", "Bookmark this page", () => this.bookmark());
      const menuBtn = mkNav("menu", "Browser menu", (e) => this.menu(e));
      this.chrome = { root, nav, omni, strip };
      nav.append(this.btnBack, this.btnFwd, this.btnReload, this.btnHome, omni, star, menuBtn);

      const bk = el("div", { class: "bkbar" });
      this.bkbar = bk;
      this.renderBookmarks();

      const stack = el("div", { class: "viewstack" });
      this.stack = stack;

      root.append(strip, nav, bk, stack);
      win.content.append(root);
      win.el.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "t") { e.preventDefault(); this.newTab(); }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "w") { e.preventDefault(); this.closeTab(this.active); }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") { e.preventDefault(); this.omni.focus(); }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") { e.preventDefault(); this.session()?.reload(); }
      });
      win.setSub("Proxy browser");
    },
    session() { return this.active?.session; },

    newTab(url = "") {
      const tab = { id: uid(), title: "New tab", url: "", favicon: "🌐", session: null, loading: false };
      const stripTab = el("div", { class: "tab" });
      stripTab.innerHTML = `<span class="fav">🌐</span><span class="tlabel">New tab</span><button class="tx" title="Close tab">✕</button>`;
      stripTab.addEventListener("click", (e) => { if (!e.target.classList.contains("tx")) this.select(tab.id); });
      stripTab.querySelector(".tx").addEventListener("click", (e) => { e.stopPropagation(); this.closeTab(tab.id); });
      stripTab.addEventListener("auxclick", (e) => { if (e.button === 1) this.closeTab(tab.id); });
      tab.el = stripTab;
      this.strip.insertBefore(stripTab, this.strip.querySelector(".nav-btn"));

      const view = el("div", { class: "startpage" });
      tab.view = view;
      tab.hooks = {
        onUrl: (pretty, proxied) => { tab.url = pretty; this.tabInfo(tab); if (this.active === tab) this.omni.value = pretty; },
        onTitle: (t) => { if (t) { tab.title = t; stripTab.querySelector(".tlabel").textContent = t; if (this.active === tab) this.win.setTitle(`Nebula Browser — ${t}`); } },
        onLoading: (l) => { tab.loading = l; this.updateStatus(); },
      };
      this.renderStartPage(view, tab);
      this.stack.append(view);
      this.tabs.push(tab);
      this.select(tab.id);
      if (url) this.navigate(url, tab);
      return tab;
    },
    tabInfo(tab) {
      try {
        const u = new URL(tab.url.startsWith("http") ? tab.url : "https://" + tab.url);
        tab.favicon = u.hostname.replace(/^www\./, "").slice(0, 1).toUpperCase();
        tab.el.querySelector(".fav").textContent = tab.favicon;
        tab.title = tab.title && tab.title !== "New tab" ? tab.title : u.hostname;
        tab.el.querySelector(".tlabel").textContent = tab.title;
      } catch {}
    },
    select(id) {
      const tab = this.tabs.find((t) => t.id === id);
      if (!tab) return;
      this.active = tab;
      this.tabs.forEach((t) => {
        t.el.classList.toggle("on", t === tab);
        t.view.style.display = t === tab ? "" : "none";
        if (t.session) t.session.iframe.style.display = t === tab ? "block" : "none";
      });
      this.omni.value = tab.url || "";
      this.win.setTitle(`Nebula Browser — ${tab.title === "New tab" ? "New tab" : tab.title}`);
      if (tab.session) tab.session.tick();
      this.updateStatus();
    },
    async closeTab(id) {
      const idx = this.tabs.findIndex((t) => t.id === id);
      if (idx < 0) return;
      const [tab] = this.tabs.splice(idx, 1);
      tab.session?.destroy();
      tab.el.remove(); tab.view.remove();
      if (this.active === tab) {
        const next = this.tabs[Math.min(idx, this.tabs.length - 1)];
        if (next) this.select(next.id); else this.newTab();
      }
    },
    async navigate(raw, tab = this.active) {
      if (!raw || !tab) return;
      let url = raw.trim();
      const looksUrl = /^[a-z]+:\/\//i.test(url) || (/^[\w-]+(\.[\w-]+)+(\/|$|\?|:)/.test(url) && !url.includes(" "));
      if (!looksUrl) url = Proxy.searchUrl(url);
      else if (!/^[a-z]+:\/\//i.test(url)) url = "https://" + url;
      if (!tab.session) {
        tab.view.innerHTML = `<div class="center" style="height:100%;flex-direction:column;gap:12px;display:flex;align-items:center;justify-content:center"><div class="spin">${icon("reload", "width:26px;height:26px")}</div><div class="muted">Starting ${esc(Nebula.ENGINES[state.engine].name)} session…</div></div>`;
        try {
          tab.session = await new ProxySession(state.engine, tab.hooks).init();
        } catch (e) {
          this.showError(tab, url, e);
          return;
        }
        tab.view.innerHTML = "";
        tab.view.style.background = "#fff";
        tab.view.append(tab.session.iframe);
      }
      // timeout guard: if nothing rendered, show a diagnostic card
      const started = Date.now();
      const guard = setInterval(() => {
        if (!tab.session || tab.session.loading === false) return clearInterval(guard);
        if (Date.now() - started > (state.proxyTimeout || 25) * 1000) {
          clearInterval(guard);
          this.showError(tab, url, new Error("The page did not load in time."), true);
        }
      }, 1000);
      tab.view.addEventListener("load", () => clearInterval(guard), { once: true });
      try {
        await tab.session.go(url);
      } catch (e) {
        clearInterval(guard);
        this.showError(tab, url, e);
      }
      this.updateStatus();
    },
    showError(tab, url, err, slow = false) {
      tab.view.innerHTML = "";
      tab.view.style.background = "";
      const box = el("div", { class: "proxy-error" });
      box.innerHTML = `
        <div class="big">🛰️</div>
        <div style="font-size:16px;font-weight:700;margin-bottom:6px">${slow ? "This page is taking too long" : "The proxy could not start this page"}</div>
        <div class="muted" style="max-width:560px;margin:0 auto 16px">
          ${esc(err?.message || String(err))}<br><br>
          NebulaOS needs its service worker (<code>nebula.sw.js</code>) next to the app file, plus a reachable Wisp relay.
          Most failures are one of these:
        </div>
        <div class="card" style="max-width:600px;margin:0 auto 16px;text-align:left">
          <div style="font-size:12.5px;line-height:1.9">
            <span class="status-dot ${Proxy.swReady ? "ok" : "bad"}"></span> Service worker: <b>${Proxy.swReady ? "active" : "not registered"}</b><br>
            <span class="status-dot ${Proxy.status.transport === "ok" ? "ok" : "bad"}"></span> Transport: <b>${esc(Proxy.transportName || "not set")}</b> (${esc(Nebula.TRANSPORTS[state.transport].name)})<br>
            <span class="status-dot ${Proxy.status.wisp === "ok" ? "ok" : "bad"}"></span> Wisp: <b>${esc(state.wisp)}</b><br>
            <span class="status-dot warn"></span> Engine: <b>${esc(Nebula.ENGINES[state.engine].name)}</b> · prefix <code>${esc(Proxy.prefixes()[state.engine])}</code>
          </div>
        </div>
        <div class="row" style="justify-content:center">
          <button class="btn primary" id="pe-retry">${icon("reload", "width:14px;height:14px")} Retry</button>
          <button class="btn" id="pe-diag">${icon("bolt", "width:14px;height:14px")} Run diagnostics</button>
          <button class="btn" id="pe-settings">Open proxy settings</button>
        </div>`;
      tab.view.append(box);
      box.querySelector("#pe-retry").addEventListener("click", () => { tab.view.innerHTML = ""; this.navigate(url, tab); });
      box.querySelector("#pe-diag").addEventListener("click", () => Proxy.probeAll(true));
      box.querySelector("#pe-settings").addEventListener("click", () => Settings.open("proxy"));
    },
    home() {
      const tab = this.active;
      if (!tab) return;
      tab.session?.destroy();
      tab.session = null;
      tab.url = "";
      tab.title = "New tab";
      tab.el.querySelector(".tlabel").textContent = "New tab";
      tab.view.innerHTML = "";
      tab.view.style.background = "";
      this.renderStartPage(tab.view, tab);
      this.omni.value = "";
      this.win?.setTitle("Nebula Browser");
      this.updateStatus();
    },
    /* Adds/removes the pyro-only chrome: clock widget, GO button, tool chips. */
    decorateChrome() {
      if (!this.chrome) return;
      const { root, nav, omni, strip } = this.chrome;
      const pyro = this.skin() === "pyro";
      root.querySelectorAll(".pyro-only").forEach((n) => n.remove());
      clearInterval(this._pyroTimer);
      if (!pyro) return;

      /* clock, like the pyro header */
      const clock = el("div", { class: "pyro-clock pyro-only" });
      const orb = el("div", { class: "orb" });
      const wrap = el("div", {});
      const t = el("div", { class: "t" });
      const d = el("div", { class: "d" });
      wrap.append(t, d);
      clock.append(orb, wrap);
      const tick = () => {
        const now = new Date();
        t.textContent = now.toLocaleTimeString([], { hour12: false });
        d.textContent = now.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) + " · UTC" + (-now.getTimezoneOffset() / 60 >= 0 ? "+" : "") + (-now.getTimezoneOffset() / 60);
      };
      tick();
      this._pyroTimer = setInterval(tick, 1000);
      nav.prepend(clock);

      /* GO button inside the omnibox */
      const go = el("button", { class: "pyro-go pyro-only", text: "Go" });
      go.addEventListener("click", () => {
        const v = this.omni.value.trim();
        if (v) this.navigate(v);
      });
      omni.append(go);

      /* PRIVACY / PROXY / RESET, wired to the real features */
      const chips = el("div", { class: "row pyro-only", style: "gap:6px;flex:none" });
      const mk = (label, title, fn) => { const b = el("button", { class: "pyro-chip", text: label, title }); b.addEventListener("click", fn); return b; };
      chips.append(
        mk("Privacy", "Cloak this tab to about:blank", () => Privacy.cloak()),
        mk("Proxy", "Proxy settings", () => Settings.open("proxy")),
        mk("Reset", "Reload the desktop session", () => location.reload()),
      );
      nav.append(chips);
      root.classList.add("skin-pyro");
      strip.classList.add("pyro-only-strip");
    },
    /* The pyro layout: big glowing logo, tags, search, then the four category
       cards that pyroproxy shipped (games / media / music / tools). */
    renderPyroStart(view, tab) {
      const wrap = el("div", { class: "startpage pyro" });
      const inner = el("div", { class: "sp-inner" });
      inner.innerHTML = `
        <div class="pyro-logo">
          <div class="word">ρ&#769;&#769;яо</div>
          <div class="tags">Secret · Unblocking · Bypass · Proxy</div>
        </div>`;
      const search = el("div", { class: "sp-search" });
      const q = el("input", { class: "input", placeholder: `Search with ${Nebula.SEARCH_ENGINES[state.search].name} or type an address…`, spellcheck: "false" });
      const go = el("button", { class: "pyro-go", text: "Go" });
      const submit = () => { const v = q.value.trim(); if (v) this.navigate(v, tab); };
      q.addEventListener("keydown", (e) => e.key === "Enter" && submit());
      go.addEventListener("click", submit);
      search.append(q, go);
      inner.append(search);

      const cats = el("div", { class: "pyro-cats" });
      for (const group of Nebula.PYRO_SITES) {
        const card = el("div", { class: "pyro-cat" });
        card.append(el("h3", { text: group.label }));
        for (const item of group.items) {
          const a = el("a", { href: "#", text: item.name });
          a.addEventListener("click", (e) => { e.preventDefault(); this.navigate(item.url, tab); });
          card.append(a);
        }
        cats.append(card);
      }
      inner.append(cats);

      const note = el("div", { class: "sp-note glass" });
      const ok = Proxy.swReady && Proxy.status.transport === "ok";
      note.innerHTML = ok
        ? `<b>Proxy ready.</b> ${esc(Nebula.ENGINES[state.engine].name)} + ${esc(Nebula.TRANSPORTS[state.transport].name)} through <code>${esc(state.wisp)}</code>.`
        : `<b>Proxy not ready yet.</b> Service worker ${Proxy.swReady ? "active" : "inactive"} · transport ${esc(Proxy.transportName || "—")} · wisp ${esc(state.wisp)}. <a href="#" id="sp-fix">Run diagnostics</a>`;
      note.querySelector("#sp-fix")?.addEventListener("click", (e) => { e.preventDefault(); Proxy.probeAll(true); });
      inner.append(note);
      wrap.append(inner);
      view.append(wrap);
      setTimeout(() => q.focus(), 40);
    },
    renderStartPage(view, tab) {
      if (this.skin() === "pyro") return this.renderPyroStart(view, tab);
      const sp = el("div", { class: "startpage-inner" });
      const inner = el("div", { class: "sp-inner" });
      inner.innerHTML = `
        <div class="sp-logo"><svg style="width:38px;height:38px" viewBox="0 0 96 96"><use href="#i-logo"/></svg><span>Nebula Browser</span>
          <span class="badge-engine" style="margin-left:6px">${esc(Nebula.ENGINES[state.engine].name)} · ${esc(Nebula.TRANSPORTS[state.transport].name)}</span></div>`;
      const search = el("div", { class: "sp-search" });
      const q = el("input", { class: "input", placeholder: `Search with ${Nebula.SEARCH_ENGINES[state.search].name} or type a URL…`, spellcheck: "false" });
      const go = el("button", { class: "btn primary", text: "Go" });
      const submit = () => { if (q.value.trim()) this.navigate(q.value.trim(), tab); };
      q.addEventListener("keydown", (e) => e.key === "Enter" && submit());
      go.addEventListener("click", submit);
      search.append(q, go);
      inner.append(search);
      const note = el("div", { class: "sp-note glass" });
      const ok = Proxy.swReady && Proxy.status.transport === "ok";
      note.innerHTML = ok
        ? `<b>Proxy ready.</b> Traffic is relayed through <code>${esc(state.wisp)}</code> using <b>${esc(Nebula.ENGINES[state.engine].name)}</b> + <b>${esc(Nebula.TRANSPORTS[state.transport].name)}</b>.`
        : `<b>Proxy not ready yet.</b> Service worker: ${Proxy.swReady ? "active" : "inactive"} · transport: ${esc(Proxy.transportName || "—")} · wisp: ${esc(state.wisp)}. <a href="#" id="sp-fix">Run diagnostics</a> or open <a href="#" id="sp-set">proxy settings</a>.`;
      inner.append(note);
      note.querySelector("#sp-fix")?.addEventListener("click", (e) => { e.preventDefault(); Proxy.probeAll(true); });
      note.querySelector("#sp-set")?.addEventListener("click", (e) => { e.preventDefault(); Settings.open("proxy"); });

      const quick = el("div", { class: "sp-quick" });
      for (const b of state.bookmarks) {
        const a = el("button", { class: "sp-link glass" });
        a.innerHTML = `<span class="ico glass">${esc(b.emoji || "🔗")}</span><span>${esc(b.title)}</span>`;
        a.addEventListener("click", () => this.navigate(b.url, tab));
        a.addEventListener("contextmenu", (e) => { e.preventDefault(); contextMenu([{ label: "Open", icon: "globe", action: () => this.navigate(b.url, tab) }, { label: "Remove bookmark", icon: "trash", danger: true, action: () => { set({ bookmarks: state.bookmarks.filter((x) => x.url !== b.url) }); this.home(); } }], e.clientX, e.clientY); });
        quick.append(a);
      }
      const addTile = el("button", { class: "sp-link glass" });
      addTile.innerHTML = `<span class="ico glass">${icon("plus", "width:18px;height:18px")}</span><span>Add</span>`;
      addTile.addEventListener("click", async () => {
        const v = await dialog({ title: "Add a quick link", icon: "plus", input: { placeholder: "https://example.com" }, buttons: [{ label: "Cancel", value: null }, { label: "Add", primary: true, value: "add" }] });
        if (v && /^https?:/.test(v)) { set({ bookmarks: [...state.bookmarks, { title: new URL(v).hostname.replace(/^www\./, ""), url: v, emoji: "🔗" }] }); this.home(); this.renderBookmarks(); }
      });
      quick.append(addTile);
      inner.append(quick);

      const engines = el("div", { class: "chips" });
      engines.append(el("span", { class: "faint", style: "font-size:12px;align-self:center;margin-right:4px", text: "Switch engine:" }));
      for (const [id, e] of Object.entries(Nebula.ENGINES)) {
        const c = el("button", { class: "chip " + (state.engine === id ? "on" : ""), text: e.name });
        c.addEventListener("click", async () => {
          set({ engine: id });
          this.renderStartPage(view, tab);
          this.updateStatus();
          try { await Proxy.ensureEngine(id); toast("Engine ready", e.name + " is warmed up.", "ok", 2200); } catch (err) { toast("Engine failed to start", esc(String(err.message || err)), "err", 7000); }
        });
        engines.append(c);
      }
      engines.append(el("span", { class: "faint", style: "font-size:12px;align-self:center;margin:0 4px", text: "·" }));
      for (const [id, t] of Object.entries(Nebula.TRANSPORTS)) {
        const c = el("button", { class: "chip " + (state.transport === id ? "on" : ""), text: t.name });
        c.addEventListener("click", async () => {
          set({ transport: id });
          this.renderStartPage(view, tab);
          try { await Proxy.restart(); toast("Transport switched", t.name + " active.", "ok"); } catch (e) { toast("Switch failed", esc(String(e.message || e)), "err"); }
          this.updateStatus();
        });
        engines.append(c);
      }
      inner.append(engines);
      sp.append(inner);
      view.append(sp);
    },
    renderBookmarks() {
      const bk = this.bkbar;
      bk.innerHTML = "";
      for (const b of state.bookmarks.slice(0, 12)) {
        const btn = el("button", { class: "bm", text: `${b.emoji || "🔗"} ${b.title}` });
        btn.addEventListener("click", () => this.navigate(b.url));
        bk.append(btn);
      }
      const add = el("button", { class: "bm", text: "+ Bookmark" });
      add.addEventListener("click", () => this.bookmark());
      bk.append(add);
    },
    async bookmark() {
      const s = this.session();
      const url = s?.currentUrl ? Proxy.decodeUrl(s.currentUrl) : this.omni.value;
      if (!url) return toast("Nothing to bookmark", "Open a page first.", "err", 2500);
      const t = await dialog({ title: "Add bookmark", icon: "star", input: { value: url, placeholder: "https://…" }, buttons: [{ label: "Cancel", value: null }, { label: "Save", primary: true, value: "save" }] });
      if (!t) return;
      let name = t; try { name = new URL(t).hostname.replace(/^www\./, ""); } catch {}
      set({ bookmarks: [...state.bookmarks, { title: name, url: t, emoji: "⭐" }] });
      this.renderBookmarks();
      toast("Bookmark saved", name, "ok", 2200);
    },
    menu(e) {
      const r = e.currentTarget.getBoundingClientRect();
      contextMenu([
        { label: "New tab", icon: "plus", key: "Ctrl+T", action: () => this.newTab() },
        { label: "New window", icon: "expand", action: () => Browser.open() },
        { label: "Home", icon: "home", action: () => this.home() },
        { sep: true },
        { label: `Engine: ${Nebula.ENGINES[state.engine].name}`, icon: "cloud", action: () => Settings.open("proxy") },
        { label: `Transport: ${Nebula.TRANSPORTS[state.transport].name}`, icon: "bolt", action: () => Settings.open("proxy") },
        { label: "Run connection diagnostics", icon: "check", action: () => Proxy.probeAll(true) },
        { sep: true },
        { label: this.skin() === "pyro" ? "Skin: Pyro → switch to Glass" : "Skin: Glass → switch to Pyro", icon: "palette", action: () => this.setSkin(this.skin() === "pyro" ? "glass" : "pyro") },
        { sep: true },
        { label: "Cloak this tab (about:blank)", icon: "eye-off", action: () => Privacy.cloak() },
        { label: "Convert to blob URL", icon: "blob", action: () => Privacy.toBlob() },
        { label: "Open proxied page in a real tab", icon: "expand", action: () => { const s = this.session(); if (s?.currentUrl) window.open(s.currentUrl, "_blank"); } },
        { sep: true },
        { label: "Close tab", icon: "x", key: "Ctrl+W", danger: true, action: () => this.closeTab(this.active?.id) },
      ], r.left, r.bottom + 4);
    },
    updateStatus() {
      const st = $("#bw-status");
      if (!st || !this.win) return;
      const s = this.session();
      st.textContent = !s ? "Ready" : s.loading ? "Loading…" : s.currentUrl ? "Connected" : "Idle";
      const pill = this.win.content.querySelector(".badge-engine");
      if (pill) pill.textContent = Nebula.ENGINES[state.engine].short;
      const eng = $("#bw-engine"), wisp = $("#bw-wisp");
      if (eng) eng.textContent = `${Nebula.ENGINES[state.engine].name} · ${Nebula.TRANSPORTS[state.transport].name}`;
      if (wisp) wisp.textContent = state.wisp;
    },
  };

  /* ==========================================================================
   *  Discord
   * ======================================================================== */
  const Discord = {
    win: null,
    open() {
      if (this.win && Nebula.wins.has(this.win.id)) { this.win.focus(); return this.win; }
      this.win = new Win({
        appId: "discord", title: "Discord", iconHtml: icon("discord", "width:16px;height:16px"),
        width: 1060, height: 700, solid: true,
        onClose: () => { this.session?.destroy(); this.session = null; this.win = null; },
      });
      const root = el("div", { class: "discord-app" });
      const bar = el("div", { class: "dc-toolbar" });
      const mk = (label, ic, fn, cls = "") => { const b = el("button", { class: "btn sm " + cls }); b.innerHTML = `${icon(ic, "width:14px;height:14px")} ${label}`; b.addEventListener("click", fn); return b; };
      const view = el("div", { class: "dc-view" });
      this.view = view;
      bar.append(
        mk("Login / App", "discord", () => this.go("https://discord.com/app"), "primary"),
        mk("Reload", "reload", () => this.session?.reload()),
        mk("Diagnostics", "check", () => this.diagnostics()),
        mk("Open in browser", "globe", () => Browser.open({ url: "https://discord.com/app" })),
        mk("Pop out to real tab", "expand", () => { const s = this.session; if (s?.currentUrl) window.open(s.currentUrl, "_blank"); }),
      );
      const widget = el("button", { class: "btn sm" });
      widget.innerHTML = `${icon("bolt", "width:14px;height:14px")} Server widget`;
      widget.addEventListener("click", async () => {
        const v = await dialog({
          title: "Embed a Discord server", icon: "discord", wide: true,
          msg: `Paste a <b>server</b> and <b>channel</b> id to embed the official Discord widget (works without the proxy, great for staying in touch while you play).<br><br>Example ids: <code>1093863244907573368/1093863244907573372</code>`,
          input: { placeholder: "guildId/channelId" },
          buttons: [{ label: "Cancel", value: null }, { label: "Embed", primary: true, value: "go" }],
        });
        if (!v) return;
        const m = String(v).match(/^(\d{5,})\/(\d{5,})$/);
        if (!m) return toast("That doesn't look right", "Use the format guildId/channelId.", "err");
        this.view.innerHTML = "";
        this.view.append(el("iframe", { src: `https://e.widgetbot.io/channels/${m[1]}/${m[2]}`, allow: "clipboard-write; fullscreen" }));
      });
      bar.append(widget);
      root.append(bar, view);
      this.win.content.append(root);
      this.win.setSub("via " + Nebula.ENGINES[state.engine].name);
      this.go("https://discord.com/login");
      return this.win;
    },
    progressPanel(url) {
      this.view.innerHTML = `
        <div class="dc-diag" style="text-align:center;padding-top:60px">
          <div class="spin" style="display:inline-block">${icon("reload", "width:30px;height:30px")}</div>
          <h2 style="margin:14px 0 6px;font-size:16px">Connecting to Discord through the proxy…</h2>
          <div class="muted" style="font-size:12.5px" id="dc-step">Starting a ${esc(Nebula.ENGINES[state.engine].name)} session on ${esc(Nebula.TRANSPORTS[state.transport].name)}</div>
          <div class="faint" style="font-size:11.5px;margin-top:6px" id="dc-elapsed">0s</div>
          <div class="faint mono" style="font-size:11px;margin-top:10px">${esc(url)}</div>
          <div class="row" style="justify-content:center;margin-top:18px">
            <button class="btn sm" id="dc-skip">Show troubleshooting</button>
          </div>
        </div>`;
      this.view.querySelector("#dc-skip")?.addEventListener("click", () => this.stalled(url));
      const t0 = Date.now();
      this._stepTimer = setInterval(() => {
        const el2 = this.view.querySelector("#dc-elapsed");
        const step = this.view.querySelector("#dc-step");
        if (!el2) return clearInterval(this._stepTimer);
        const s = Math.round((Date.now() - t0) / 1000);
        el2.textContent = s + "s";
        if (step) step.textContent = s < 6 ? "Handing the request to the Wisp relay…"
          : s < 15 ? "Downloading Discord's application bundle…"
          : s < 30 ? "Booting Discord inside the proxy (this one is heavy)…"
          : "Still booting — Discord loads a lot of scripts…";
      }, 500);
    },
    stalled(url, why = "") {
      const eng = Nebula.ENGINES[state.engine], tr = Nebula.TRANSPORTS[state.transport];
      this.view.innerHTML = `
        <div class="dc-diag">
          <div style="font-size:34px">🛰️</div>
          <h2 style="margin:8px 0 6px;font-size:16px">Discord did not finish booting through the proxy</h2>
          <div class="muted" style="font-size:12.5px;max-width:56em;line-height:1.6">
            ${why ? esc(why) + "<br><br>" : ""}
            The page itself answered — Discord's <i>response</i> arrives fine — but its application bundle never starts.
            That is almost always one of: a strict Content-Security-Policy on <code>discord.com</code>, Discord's
            bot/browser checks against the relay's IP address, or an engine that cannot replay Discord's module workers.
          </div>
          <div class="card" style="margin-top:14px">
            <div style="font-weight:650;font-size:13px;margin-bottom:8px">Try this, in order</div>
            <div class="row" style="gap:8px;flex-wrap:wrap">
              <button class="btn sm primary" id="dc-try-best">Retry with Scramjet v2 + libcurl</button>
              <button class="btn sm" id="dc-try-sc1">Retry with Scramjet</button>
              <button class="btn sm" id="dc-try-uv">Retry with Ultraviolet</button>
              <button class="btn sm" id="dc-wait">Keep waiting</button>
            </div>
            <div class="hr"></div>
            <div class="row" style="gap:8px;flex-wrap:wrap">
              <button class="btn sm" id="dc-webbrowser">Open in Nebula Browser</button>
              <button class="btn sm" id="dc-popout">Pop out to a real tab</button>
              <button class="btn sm" id="dc-widget2">Embed a server widget instead</button>
              <button class="btn sm" id="dc-diag2">Run full diagnostics</button>
            </div>
          </div>
          <div class="card" style="margin-top:12px">
            <div style="font-size:12.5px;line-height:1.75">
              <span class="status-dot ${Proxy.swReady ? "ok" : "bad"}"></span> Service worker: <b>${Proxy.swReady ? "active" : "inactive"}</b><br>
              <span class="status-dot ${Proxy.status.transport === "ok" ? "ok" : "bad"}"></span> Transport: <b>${esc(Proxy.transportName || "—")}</b> (${esc(tr.name)})<br>
              <span class="status-dot ${Proxy.status.wisp === "ok" ? "ok" : "bad"}"></span> Wisp: <b>${esc(state.wisp)}</b><br>
              <span class="status-dot warn"></span> Engine: <b>${esc(eng.name)}</b>
            </div>
          </div>
          <div class="muted" style="font-size:11.5px;margin-top:12px">
            Tip: Discord is far more likely to work on a <b>self-hosted Wisp</b> behind a residential connection,
            because Discord blocks many datacenter IP ranges. Everything else — this widget embed, voice chat in the
            official app, and NebulaOS itself — keeps working normally.
          </div>
        </div>`;
      const retry = async (engine, transport) => {
        set({ engine, transport });
        Nebula.Proxy.mux = null; Nebula.Proxy.muxApplied = null; Nebula.Proxy._standalone = null; Nebula.Proxy._standaloneOpts = null;
        toast("Switching for Discord", `${Nebula.ENGINES[engine].name} · ${Nebula.TRANSPORTS[transport].name}`, "ok", 2500);
        await this.go(url);
      };
      this.view.querySelector("#dc-try-best").onclick = () => retry("sc2", "libcurl");
      this.view.querySelector("#dc-try-sc1").onclick = () => retry("sc1", "libcurl");
      this.view.querySelector("#dc-try-uv").onclick = () => retry("uv", "libcurl");
      this.view.querySelector("#dc-wait").onclick = () => this.go(url, true);
      this.view.querySelector("#dc-webbrowser").onclick = () => { Browser.open({ url }); this.win?.close(); };
      this.view.querySelector("#dc-popout").onclick = () => { const s = this.session; if (s?.currentUrl) window.open(s.currentUrl, "_blank"); else window.open(url, "_blank"); };
      this.view.querySelector("#dc-widget2").onclick = () => this.win?.close();
      this.view.querySelector("#dc-diag2").onclick = () => this.diagnostics();
    },
    async go(url, keepWaiting = false) {
      clearInterval(this._stepTimer);
      this.currentUrl = url;
      this.progressPanel(url);
      try {
        this.session?.destroy();
        this.session = await new ProxySession(state.engine, {
          onTitle: (t) => this.win?.setSub(t || "Discord"),
          onUrl: () => {},
        }).init();
        this.view.innerHTML = "";
        this.view.append(this.session.iframe);
        await this.session.go(url);
        /* Watch the proxied document: Discord answers instantly but its app can
         * take a while (or never) to boot inside a proxy. */
        const started = Date.now();
        const watch = setInterval(() => {
          if (!this.session || this.session.iframe.parentElement !== this.view) return clearInterval(watch);
          let len = 0, title = "";
          try {
            const d = this.session.iframe.contentDocument;
            len = d?.body?.innerText?.trim().length || 0;
            title = d?.title || "";
          } catch {}
          if (len > 40) { clearInterval(watch); clearInterval(this._stepTimer); this.win?.setSub("Discord · connected"); return; }
          const waited = (Date.now() - started) / 1000;
          if (waited > 45 && !keepWaiting) {
            clearInterval(watch);
            this.stalled(url, `Nothing rendered after ${Math.round(waited)}s (page title: “${title || "empty"}”).`);
          }
        }, 1000);
      } catch (e) {
        console.error("[NebulaOS] Discord session failed:", e);
        this.view.innerHTML = "";
        this.view.append(el("div", { class: "dc-diag", html: `<div style="font-size:34px">🛰️</div><h2 style="margin:8px 0">Discord needs a working proxy</h2><div class="muted">${esc(String(e.message || e))}</div>` }));
        this.stalled(url, String(e.message || e));
      }
    },
    async diagnostics() {
      this.view.innerHTML = `<div class="dc-diag" id="dc-diag-body"><div class="row"><span class="spin">${icon("reload", "width:18px;height:18px")}</span> Running checks…</div></div>`;
      const body = $("#dc-diag-body");
      const steps = [];
      const add = (stateOk, t, m) => steps.push({ stateOk, t, m });
      add(Proxy.secureContextOk(), "Secure context", location.protocol);
      try { await Proxy.registerSW(); add(true, "Service worker", Proxy.swUrl()); } catch (e) { add(false, "Service worker", String(e.message || e)); }
      try { const n = await Proxy.ensureMux(); add(true, "Transport", `${Nebula.TRANSPORTS[state.transport].name} → ${n}`); } catch (e) { add(false, "Transport", String(e.message || e)); }
      const w = await Proxy.probeWisp();
      add(w.ok, "Wisp relay", `${state.wisp} — ${w.detail}`);
      try {
        const r = await Proxy.probeFetch(state.engine);
        add(r.ok, "Proxied fetch", `HTTP ${r.status} from example.com in ${r.ms} ms`);
      } catch (e) { add(false, "Proxied fetch", String(e.message || e)); }
      try {
        const session = await new ProxySession(state.engine, {}).init();
        await session.go("https://discord.com/login");
        add(true, state.engine === "sc2" ? "Scramjet v2 session" : "Engine session", "Discord login page requested through the proxy.");
        session.destroy();
      } catch (e) { add(false, "Engine session", String(e.message || e)); }
      add(true, "Cookie persistence", "The proxy service worker keeps discord.com cookies per engine, so a login survives navigation and reloads.");
      body.innerHTML = `
        <h2 style="font-size:16px;margin-bottom:4px">Discord connection diagnostics</h2>
        <div class="muted" style="font-size:12.5px;margin-bottom:12px">Discord is one of the hardest sites to proxy: it uses websockets, strict CORS and device checks. Every step below must pass for a login to work.</div>
        ${steps.map((s) => `<div class="diag-step"><div class="dico" style="color:${s.stateOk ? "#2fa472" : "#e0455f"}">${s.stateOk ? "✔" : "✘"}</div><div><div class="dt">${esc(s.t)}</div><div class="dm">${esc(s.m)}</div></div></div>`).join("")}
        <div class="card" style="margin-top:14px">
          <b>If the login page loads but sign-in fails:</b>
          <ul style="margin:8px 0 0 18px;font-size:12.5px;line-height:1.8" class="muted">
            <li>Switch the engine to <b>Scramjet v2</b> or <b>Scramjet</b> — Discord is known to behave better on Scramjet than Ultraviolet.</li>
            <li>Use the <b>libcurl</b> transport: Discord's TLS/HTTP-2 fingerprinting rejects some relays.</li>
            <li>Try a self-hosted Wisp on a residential connection — Discord blocks many datacenter ranges.</li>
            <li>Use <b>Pop out to real tab</b> for the login step; some flows dislike iframes.</li>
            <li>Or stay inside NebulaOS with the <b>Server widget</b> embed.</li>
          </ul>
        </div>
        <div class="row" style="margin-top:14px">
          <button class="btn primary" id="dc-open-login">Open proxied login</button>
          <button class="btn" id="dc-open-app">Open proxied app</button>
        </div>`;
      body.querySelector("#dc-open-login").addEventListener("click", () => this.go("https://discord.com/login"));
      body.querySelector("#dc-open-app").addEventListener("click", () => this.go("https://discord.com/app"));
    },
  };

  /* ==========================================================================
   *  App Store / hub
   * ======================================================================== */
  const AppStore = {
    win: null,
    open(category) {
      if (this.win && Nebula.wins.has(this.win.id)) { this.win.focus(); this.render(category); return this.win; }
      this.win = new Win({ appId: "store", title: "App Store", iconHtml: icon("apps", "width:16px;height:16px"), width: 940, height: 640, solid: true, onClose: () => (this.win = null) });
      this.render(category);
      return this.win;
    },
    render(category = "All") {
      const w = this.win; if (!w) return;
      const cats = ["All", "Internet", "Games", "Media", "Utilities", "Bundled", "Imported"];
      const root = el("div", { class: "hub" });
      const head = el("div", { class: "hub-head" });
      head.innerHTML = `<div class="grow"><div class="hub-title">App Store</div><div class="faint" style="font-size:12px">Everything here runs offline inside NebulaOS. Bundled apps come from apps/ and games/ in the project — import your own single-file HTML too.</div></div>`;
      const imp = el("button", { class: "btn primary" });
      imp.innerHTML = `${icon("upload", "width:14px;height:14px")} Import HTML app`;
      imp.addEventListener("click", () => Apps.importDialog());
      head.append(imp);
      root.append(head);
      const chips = el("div", { class: "chips" });
      for (const c of cats) {
        const b = el("button", { class: "chip " + (category === c ? "on" : ""), text: c });
        b.addEventListener("click", () => this.render(c));
        chips.append(b);
      }
      root.append(chips);
      const grid = el("div", { class: "hub-grid" });
      const apps = Registry.all().filter((a) => !a.hidden).filter((a) => category === "All" || a.category === category);
      for (const a of apps) {
        const card = el("div", { class: "hub-card" });
        card.innerHTML = `<div class="ico" style="background:${a.tint || "var(--accent-soft)"};color:var(--accent)">${a.iconHtml || a.emoji || "▫"}</div>
          <div class="grow"><div class="nm">${esc(a.name)}</div><div class="ds">${esc(a.sub || "")}</div>
          <div class="ft"><button class="btn sm primary">Open</button>${a.pinned ? '<span class="tag">pinned</span>' : ""}${a.imported ? '<span class="tag">imported</span>' : ""}</div></div>`;
        card.querySelector("button").addEventListener("click", () => a.run());
        grid.append(card);
      }
      if (!apps.length) grid.append(el("div", { class: "empty", text: "Nothing in this category yet — drop a single-file HTML app into apps/ (or games/) and rebuild, or import one right here." }));
      root.append(grid);
      w.content.innerHTML = "";
      w.content.append(root);
    },
    openDetails(app) {
      dialog({
        title: app.name, icon: "info", wide: true,
        msg: `<b>${esc(app.sub || "")}</b><br><br>${esc(app.details || "Built-in NebulaOS application.").replace(/\n/g, "<br>")}<br><br><span class="faint">id: ${esc(app.id)} · category: ${esc(app.category || "—")}${app.imported ? " · imported by you" : ""}${app.bundled ? " · shipped with this build" : ""}</span>`,
        buttons: [app.imported ? { label: "Delete", value: "del" } : { label: app.pinned ? "Unpin from dock" : "Pin to dock", value: "pin" }, { label: "Open", primary: true, value: "open" }],
      }).then((v) => {
        if (v === "open") app.run();
        if (v === "pin") { app.pinned = !app.pinned; Nebula.Dock.render(); toast(app.pinned ? "Pinned to dock" : "Unpinned", app.name, "ok", 2000); }
        if (v === "del") { AppStore.removeImported(app.id); toast("App deleted", app.name + " was removed.", "ok", 2500); }
      });
    },
  };

  /* ==========================================================================
   *  Games
   * ======================================================================== */
  const Games = {
    open2048() {
      const win = new Win({ appId: "game2048", title: "2048", iconHtml: "🎯", width: 420, height: 560, solid: true, resizable: true });
      const wrap = el("div", { class: "game-wrap" });
      const top = el("div", { class: "game-top" });
      const score = el("div", { class: "pill", text: "Score 0" });
      const best = el("div", { class: "pill", text: "Best " + (localStorage.getItem("nebula.2048.best") || 0) });
      const reset = el("button", { class: "btn sm", text: "New game" });
      top.append(score, best, reset);
      const body = el("div", { class: "game-body" });
      const boardEl = el("div", { class: "g2048" });
      body.append(boardEl);
      wrap.append(top, body);
      win.content.append(wrap);
      let g = null;
      const colors = { 0: "var(--field)", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563", 32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72", 256: "#edcc61", 512: "#edc850", 1024: "#edc53f", 2048: "#edc22e" };
      const start = () => { g = { cells: Array(16).fill(0), score: 0, over: false }; add(); add(); draw(); };
      const add = () => {
        const empty = g.cells.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
        if (!empty.length) return;
        g.cells[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4;
      };
      const draw = () => {
        boardEl.innerHTML = "";
        g.cells.forEach((v) => {
          const c = el("div", { class: "c", text: v || "" });
          c.style.background = colors[v] || "#edc22e";
          c.style.color = v > 4 ? "#fff" : "#776e65";
          c.style.fontSize = v > 999 ? "18px" : v > 99 ? "22px" : "26px";
          boardEl.append(c);
        });
        score.textContent = "Score " + g.score;
        const b = Math.max(+localStorage.getItem("nebula.2048.best") || 0, g.score);
        localStorage.setItem("nebula.2048.best", b);
        best.textContent = "Best " + b;
        if (g.over) toast("Game over", "Score " + g.score + " — press New game", "err", 4000);
      };
      const slide = (row) => {
        let a = row.filter((v) => v);
        for (let i = 0; i < a.length - 1; i++) if (a[i] === a[i + 1]) { a[i] *= 2; g.score += a[i]; a.splice(i + 1, 1); }
        while (a.length < 4) a.push(0);
        return a;
      };
      const move = (dir) => {
        if (g.over) return;
        const before = g.cells.join();
        const idx = (r, c) => r * 4 + c;
        for (let i = 0; i < 4; i++) {
          let line = [];
          for (let j = 0; j < 4; j++) line.push(g.cells[dir === "left" || dir === "right" ? idx(i, j) : idx(j, i)]);
          if (dir === "right" || dir === "down") line.reverse();
          line = slide(line);
          if (dir === "right" || dir === "down") line.reverse();
          for (let j = 0; j < 4; j++) g.cells[dir === "left" || dir === "right" ? idx(i, j) : idx(j, i)] = line[j];
        }
        if (g.cells.join() !== before) { add(); draw(); }
        if (!g.cells.includes(0) && !canMove()) { g.over = true; draw(); }
      };
      const canMove = () => {
        for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
          const v = g.cells[r * 4 + c];
          if (c < 3 && v === g.cells[r * 4 + c + 1]) return true;
          if (r < 3 && v === g.cells[(r + 1) * 4 + c]) return true;
        }
        return false;
      };
      win.el.tabIndex = 0;
      win.el.addEventListener("keydown", (e) => {
        const map = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
        if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
      });
      reset.addEventListener("click", start);
      let sx = 0, sy = 0;
      body.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; });
      body.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
        move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
      });
      start();
      win.focus();
      win.el.focus();
      return win;
    },
    openSnake() {
      const win = new Win({ appId: "gamesnake", title: "Snake", iconHtml: "🐍", width: 460, height: 560, solid: true });
      const wrap = el("div", { class: "game-wrap" });
      const top = el("div", { class: "game-top" });
      const sc = el("div", { class: "pill", text: "Score 0" });
      const bst = el("div", { class: "pill", text: "Best " + (localStorage.getItem("nebula.snake.best") || 0) });
      const pause = el("button", { class: "btn sm", text: "Pause" });
      const restart = el("button", { class: "btn sm", text: "Restart" });
      top.append(sc, bst, pause, restart);
      const body = el("div", { class: "game-body" });
      const canvas = el("canvas", { width: 400, height: 400, class: "snake-canvas" });
      body.append(canvas);
      wrap.append(top, body);
      win.content.append(wrap);
      const ctx = canvas.getContext("2d");
      const N = 20, S = 20;
      let snake, dir, food, score, run, timer;
      const reset = () => {
        snake = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
        dir = { x: 1, y: 0 }; score = 0; run = true;
        dropFood(); sc.textContent = "Score 0";
        clearInterval(timer); timer = setInterval(step, 105);
      };
      const dropFood = () => { do { food = { x: (Math.random() * N) | 0, y: (Math.random() * N) | 0 }; } while (snake.some((s) => s.x === food.x && s.y === food.y)); };
      const step = () => {
        if (!run) return;
        const head = { x: (snake[0].x + dir.x + N) % N, y: (snake[0].y + dir.y + N) % N };
        if (snake.some((s) => s.x === head.x && s.y === head.y)) { run = false; clearInterval(timer); const b = Math.max(+localStorage.getItem("nebula.snake.best") || 0, score); localStorage.setItem("nebula.snake.best", b); bst.textContent = "Best " + b; }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) { score += 10; sc.textContent = "Score " + score; dropFood(); }
        else snake.pop();
        render();
      };
      const render = () => {
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--is-dark") === "1" ? "#101319" : "#f5f7fb";
        ctx.fillRect(0, 0, 400, 400);
        ctx.fillStyle = "#e0455f";
        ctx.beginPath(); ctx.arc(food.x * S + S / 2, food.y * S + S / 2, S / 2 - 2, 0, 7); ctx.fill();
        snake.forEach((s, i) => {
          const ac = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#6c8cff";
          ctx.fillStyle = i === 0 ? ac : ac + "cc";
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(s.x * S + 1, s.y * S + 1, S - 2, S - 2, 5) : ctx.rect(s.x * S + 1, s.y * S + 1, S - 2, S - 2);
          ctx.fill();
        });
      };
      const key = (e) => {
        const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
        const k = m[e.key] || m[e.key.toLowerCase?.()];
        if (!k) return;
        e.preventDefault();
        if (dir.x + k[0] === 0 && dir.y + k[1] === 0) return;
        dir = { x: k[0], y: k[1] };
      };
      addEventListener("keydown", key, { signal: AbortSignal.any?.([AbortSignal.timeout?.(1e9)]) });
      pause.addEventListener("click", () => { run = !run; pause.textContent = run ? "Pause" : "Resume"; });
      restart.addEventListener("click", reset);
      win.opts.onClose = () => clearInterval(timer);
      reset(); render();
      return win;
    },
    openTTT() {
      const win = new Win({ appId: "gamettt", title: "Tic-Tac-Toe", iconHtml: "⭕", width: 380, height: 480, solid: true });
      const wrap = el("div", { class: "game-wrap" });
      const top = el("div", { class: "game-top" });
      const msg = el("div", { class: "pill", text: "Your move" });
      const reset = el("button", { class: "btn sm", text: "New game" });
      top.append(msg, reset);
      const body = el("div", { class: "game-body" });
      const grid = el("div", { class: "ttt" });
      body.append(grid);
      wrap.append(top, body);
      win.content.append(wrap);
      let b, over;
      const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      const winner = (bb) => { for (const [a, c, d] of lines) if (bb[a] && bb[a] === bb[c] && bb[a] === bb[d]) return bb[a]; return bb.every(Boolean) ? "tie" : null; };
      const minimax = (bb, me) => {
        const w = winner(bb);
        if (w === "O") return { score: 10 };
        if (w === "X") return { score: -10 };
        if (w === "tie") return { score: 0 };
        const moves = [];
        bb.forEach((v, i) => { if (!v) { const nb = bb.slice(); nb[i] = me; const r = minimax(nb, me === "O" ? "X" : "O"); moves.push({ i, score: r.score }); } });
        return me === "O" ? moves.reduce((a, x) => (x.score > a.score ? x : a)) : moves.reduce((a, x) => (x.score < a.score ? x : a));
      };
      const draw = () => {
        grid.innerHTML = "";
        b.forEach((v, i) => {
          const c = el("button", { class: "c", text: v === "X" ? "✕" : v === "O" ? "◯" : "" });
          c.style.color = v === "X" ? "var(--accent)" : "#e0455f";
          c.addEventListener("click", () => {
            if (over || b[i]) return;
            b[i] = "X";
            let w = winner(b);
            if (!w) { const m = minimax(b, "O"); b[m.i] = "O"; w = winner(b); }
            draw();
            if (w) { over = true; msg.textContent = w === "tie" ? "Draw!" : w === "X" ? "You win! 🎉" : "Computer wins"; }
            else msg.textContent = "Your move";
          });
          grid.append(c);
        });
      };
      const resetGame = () => { b = Array(9).fill(""); over = false; msg.textContent = "Your move"; draw(); };
      reset.addEventListener("click", resetGame);
      resetGame();
      return win;
    },
    openMemory() {
      const win = new Win({ appId: "gamemem", title: "Memory", iconHtml: "🃏", width: 420, height: 520, solid: true });
      const wrap = el("div", { class: "game-wrap" });
      const top = el("div", { class: "game-top" });
      const moves = el("div", { class: "pill", text: "Moves 0" });
      const time = el("div", { class: "pill", text: "0s" });
      const reset = el("button", { class: "btn sm", text: "New game" });
      top.append(moves, time, reset);
      const body = el("div", { class: "game-body" });
      const grid = el("div", { class: "mem-grid" });
      body.append(grid);
      wrap.append(top, body);
      win.content.append(wrap);
      const emoji = ["🚀","🛰️","🪐","⭐","🌌","👾","🔭","🧑‍🚀"];
      let cards, open, count, m, done, t0, timer;
      const start = () => {
        cards = [...emoji, ...emoji].sort(() => Math.random() - 0.5);
        open = []; count = 0; m = 0; done = 0; t0 = Date.now();
        moves.textContent = "Moves 0";
        clearInterval(timer);
        timer = setInterval(() => (time.textContent = Math.floor((Date.now() - t0) / 1000) + "s"), 500);
        draw();
      };
      const draw = () => {
        grid.innerHTML = "";
        cards.forEach((e, i) => {
          const c = el("button", { class: "mem-card " + (cards[i]._open ? "flip" : "") + (cards[i]._done ? "done" : ""), text: cards[i]._open || cards[i]._done ? e : "❔" });
          c.addEventListener("click", () => {
            if (cards[i]._open || cards[i]._done || open.length >= 2) return;
            cards[i]._open = true;
            open.push(i);
            draw();
            if (open.length === 2) {
              m++; moves.textContent = "Moves " + m;
              const [a, b] = open;
              if (cards[a].e === cards[b].e || cards[a] === cards[b]) {}
              if (emoji.includes(cards[a]) && cards[a] === cards[b]) {
                cards[a]._done = cards[b]._done = true; done += 2; open = []; draw();
                if (done === cards.length) { clearInterval(timer); toast("Memory complete", `${m} moves in ${Math.floor((Date.now() - t0) / 1000)}s`, "ok", 5000); }
              } else setTimeout(() => { cards[a]._open = cards[b]._open = false; open = []; draw(); }, 640);
            }
          });
          grid.append(c);
        });
      };
      reset.addEventListener("click", start);
      win.opts.onClose = () => clearInterval(timer);
      start();
      return win;
    },
    openHub() {
      const win = new Win({ appId: "games", title: "Games", iconHtml: icon("gamepad", "width:16px;height:16px"), width: 820, height: 580, solid: true });
      const root = el("div", { class: "hub" });
      root.innerHTML = `<div class="hub-head"><div class="grow"><div class="hub-title">Games</div><div class="faint" style="font-size:12px">Offline arcade built into NebulaOS — plus any game you drop into <code>games/</code> or import.</div></div></div>`;
      const addGame = el("button", { class: "btn primary" });
      addGame.innerHTML = `${icon("upload", "width:14px;height:14px")} Add a game`;
      addGame.addEventListener("click", () => Apps.importDialog());
      root.querySelector(".hub-head").append(addGame);
      const grid = el("div", { class: "hub-grid" });
      const games = [
        { n: "2048", d: "Slide and merge the tiles to reach 2048.", e: "🎯", f: () => this.open2048() },
        { n: "Snake", d: "Classic snake with wrap-around walls.", e: "🐍", f: () => this.openSnake() },
        { n: "Tic-Tac-Toe", d: "Unbeatable AI. Try to draw.", e: "⭕", f: () => this.openTTT() },
        { n: "Memory", d: "Match the space pairs.", e: "🃏", f: () => this.openMemory() },
      ];
      for (const g of games) {
        const c = el("div", { class: "hub-card" });
        c.innerHTML = `<div class="ico" style="background:var(--accent-soft)">${g.e}</div><div class="grow"><div class="nm">${g.n}</div><div class="ds">${g.d}</div><div class="ft"><button class="btn sm primary">Play</button></div></div>`;
        c.querySelector("button").addEventListener("click", () => g.f());
        grid.append(c);
      }
      for (const a of Registry.all().filter((x) => x.category === "Games" && x.id !== "games")) {
        const c = el("div", { class: "hub-card" });
        c.innerHTML = `<div class="ico" style="background:var(--accent-soft)">${a.iconHtml || a.emoji || "🎮"}</div><div class="grow"><div class="nm">${esc(a.name)}</div><div class="ds">${esc(a.sub || "")}</div><div class="ft"><button class="btn sm primary">Play</button></div></div>`;
        c.querySelector("button").addEventListener("click", () => a.run());
        grid.append(c);
      }
      root.append(grid);
      win.content.append(root);
      return win;
    },
  };

  /* ==========================================================================
   *  Files / Notepad / Calculator / Paint / Terminal
   * ======================================================================== */
  const FS = {
    key: "nebula.fs.v1",
    data: null,
    load() {
      try { this.data = JSON.parse(localStorage.getItem(this.key)) || null; } catch { this.data = null; }
      if (!this.data) {
        this.data = {
          "/": { type: "dir" },
          "/Documents": { type: "dir" },
          "/Documents/welcome.txt": { type: "file", text: "Welcome to NebulaOS!\n\nThis virtual filesystem lives in your browser's localStorage.\nCreate folders, write notes, import files from disk and open HTML\ndocuments in their own window.\n\nTip: open the Terminal and run `help` for the full command list." },
          "/Documents/proxy-notes.md": { type: "file", text: "# Proxy notes\n\n- Engine: Ultraviolet / Scramjet v2 / Scramjet\n- Transport: epoxy (fast) or libcurl (compatible)\n- Wisp: the relay server that carries traffic\n\nAnti-close, about:blank and blob mode live in Settings → Privacy." },
          "/Desktop": { type: "dir" },
        };
        this.save();
      }
      return this.data;
    },
    save() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch {} },
    list(dir) {
      const d = this.data;
      const names = new Set();
      for (const k of Object.keys(d)) {
        if (k === dir) continue;
        const prefix = dir.endsWith("/") ? dir : dir + "/";
        if (k.startsWith(prefix)) {
          const rest = k.slice(prefix.length);
          names.add(rest.split("/")[0]);
        }
      }
      return [...names].map((n) => {
        const full = (dir.endsWith("/") ? dir : dir + "/") + n;
        const node = d[full] || { type: "dir" };
        return { name: n, path: full, type: node.type || (Object.keys(d).some((k) => k.startsWith(full + "/")) ? "dir" : "file"), node };
      }).sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "dir" ? -1 : 1));
    },
    read(path) { return this.data[path]?.text ?? ""; },
    write(path, text) { this.data[path] = { type: "file", text }; this.save(); },
    mkdir(path) { this.data[path] = { type: "dir" }; this.save(); },
    remove(path) {
      for (const k of Object.keys(this.data)) if (k === path || k.startsWith(path + "/")) delete this.data[k];
      this.save();
    },
    rename(from, to) { const v = this.data[from]; delete this.data[from]; this.data[to] = v; this.save(); },
    size() { return fmtBytes(JSON.stringify(this.data).length); },
  };

  const Files = {
    win: null, cwd: "/", sel: null,
    open(dir = "/") {
      if (this.win && Nebula.wins.has(this.win.id)) { this.win.focus(); this.cwd = dir; this.render(); return this.win; }
      this.win = new Win({ appId: "files", title: "Files", iconHtml: icon("files", "width:16px;height:16px"), width: 860, height: 580, solid: true, onClose: () => (this.win = null) });
      this.cwd = dir;
      this.render();
      return this.win;
    },
    render() {
      const w = this.win; if (!w) return;
      FS.load();
      w.content.innerHTML = "";
      const split = el("div", { class: "split" });
      const side = el("div", { class: "side" });
      const places = [["/", "Home", "home"], ["/Documents", "Documents", "note"], ["/Desktop", "Desktop", "files"]];
      side.append(el("div", { class: "lsection", style: "margin:2px 6px 8px", text: "Places" }));
      for (const [p, n, ic] of places) {
        const b = el("button", { class: `si ${this.cwd === p ? "on" : ""}` });
        b.innerHTML = `${icon(ic, "width:15px;height:15px")} ${n}`;
        b.addEventListener("click", () => { this.cwd = p; this.render(); });
        side.append(b);
      }
      side.append(el("div", { class: "lsection", style: "margin:14px 6px 8px", text: "Actions" }));
      const acts = [];
      acts.push(["New folder", "plus", async () => { const n = await dialog({ title: "New folder", input: { placeholder: "Folder name" }, buttons: [{ label: "Cancel", value: null }, { label: "Create", primary: true, value: "ok" }] }); if (n) { FS.mkdir(this.cwd.replace(/\/$/, "") + "/" + n); this.render(); } }]);
      acts.push(["New file", "note", async () => { const n = await dialog({ title: "New text file", input: { placeholder: "notes.txt" }, buttons: [{ label: "Cancel", value: null }, { label: "Create", primary: true, value: "ok" }] }); if (n) { const p = this.cwd.replace(/\/$/, "") + "/" + n; FS.write(p, ""); this.openNote(p); this.render(); } }]);
      acts.push(["Import from disk", "upload", () => this.importFile()]);
      for (const [n, ic, fn] of acts) {
        const b = el("button", { class: "si" });
        b.innerHTML = `${icon(ic, "width:15px;height:15px")} ${n}`;
        b.addEventListener("click", fn);
        side.append(b);
      }
      side.append(el("div", { class: "faint", style: "padding:12px 8px;font-size:11px;line-height:1.6", text: `Used ${FS.size()} of localStorage.` }));
      const main = el("div", { class: "files-main" });
      const crumbs = el("div", { class: "files-crumbs" });
      crumbs.innerHTML = `<b>${esc(this.cwd)}</b><span class="grow"></span>`;
      const up = el("button", { class: "btn sm", text: "▲ Up" });
      up.addEventListener("click", () => { if (this.cwd !== "/") { const parts = this.cwd.split("/").filter(Boolean); parts.pop(); this.cwd = "/" + parts.join("/"); if (!this.cwd.startsWith("/")) this.cwd = "/"; this.render(); } });
      crumbs.append(up);
      const grid = el("div", { class: "files-grid" });
      const items = FS.list(this.cwd);
      for (const it of items) {
        const node = el("button", { class: `fitem ${this.sel === it.path ? "on" : ""}` });
        const ico = it.type === "dir" ? "📁" : /\.(md|txt|json|js|css|html?)$/i.test(it.name) ? "📄" : "🧾";
        node.innerHTML = `<span class="ico">${ico}</span><span>${esc(it.name)}</span>`;
        node.addEventListener("click", () => { this.sel = it.path; this.render(); });
        node.addEventListener("dblclick", () => this.openPath(it));
        node.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          contextMenu([
            { label: "Open", icon: "folder", action: () => this.openPath(it) },
            { label: "Rename", icon: "note", action: async () => { const n = await dialog({ title: "Rename", input: { value: it.name }, buttons: [{ label: "Cancel", value: null }, { label: "Rename", primary: true, value: "ok" }] }); if (n) { const target = this.cwd.replace(/\/$/, "") + "/" + n; FS.rename(it.path, target); this.render(); } } },
            { label: "Download", icon: "dl", action: () => this.download(it) },
            { label: "Export to a NebulaOS app (HTML only)", icon: "upload", action: () => it.name.endsWith(".html") ? Apps.importHtml(FS.read(it.path), it.name.replace(/\.html$/, "")) : toast("Not HTML", "Only .html files can become apps.", "err") },
            { sep: true },
            { label: "Delete", icon: "trash", danger: true, action: async () => { const ok = await dialog({ title: "Delete " + it.name + "?", icon: "warn", msg: "This cannot be undone.", buttons: [{ label: "Cancel", value: false }, { label: "Delete", danger: true, primary: true, value: true }] }); if (ok) { FS.remove(it.path); this.render(); } } },
          ], e.clientX, e.clientY);
        });
        grid.append(node);
      }
      if (!items.length) grid.append(el("div", { class: "empty", style: "grid-column:1/-1", text: "This folder is empty." }));
      main.append(crumbs, grid);
      split.append(side, main);
      w.content.append(split);
    },
    openPath(it) {
      if (it.type === "dir") { this.cwd = it.path; this.render(); return; }
      if (/\.html?$/i.test(it.name)) { new Win({ appId: "htmlview", title: it.name, iconHtml: "🌐", width: 900, height: 620, solid: true, onReady: (w) => w.content.append(el("iframe", { srcdoc: FS.read(it.path), style: "width:100%;height:100%;border:0;background:#fff" })) }); return; }
      this.openNote(it.path);
    },
    openNote(path) {
      const w = new Win({ appId: "notepad", title: path.split("/").pop(), iconHtml: icon("note", "width:16px;height:16px"), width: 720, height: 520, solid: true });
      const wrap = el("div", { class: "notepad" });
      const ta = el("textarea", { spellcheck: "false" });
      FS.load();
      ta.value = FS.read(path);
      const bar = el("div", { class: "wstatus", style: "height:auto;padding:8px 12px;gap:8px" });
      const save = el("button", { class: "btn sm primary" }); save.innerHTML = `${icon("check", "width:13px;height:13px")} Save`;
      const dl = el("button", { class: "btn sm" }); dl.innerHTML = `${icon("dl", "width:13px;height:13px")} Download`;
      const st = el("span", { class: "faint mono", style: "margin-left:auto" });
      const upd = () => (st.textContent = `${ta.value.length} chars`);
      ta.addEventListener("input", upd); upd();
      save.addEventListener("click", () => { FS.write(path, ta.value); toast("Saved", path, "ok", 1800); });
      dl.addEventListener("click", () => { const a = el("a", { href: URL.createObjectURL(new Blob([ta.value], { type: "text/plain" })), download: path.split("/").pop() }); a.click(); });
      addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); save.click(); } });
      bar.append(save, dl, st);
      wrap.append(ta, bar);
      w.content.append(wrap);
      return w;
    },
    async importFile() {
      const input = el("input", { type: "file", multiple: true });
      input.addEventListener("change", async () => {
        for (const f of input.files) {
          const text = await f.text();
          const p = this.cwd.replace(/\/$/, "") + "/" + f.name;
          FS.write(p, text);
        }
        this.render();
        toast("Imported", `${input.files.length} file(s) added to ${this.cwd}`, "ok");
      });
      input.click();
    },
    download(it) {
      const text = it.type === "dir" ? "" : FS.read(it.path);
      const a = el("a", { href: URL.createObjectURL(new Blob([text], { type: "text/plain" })), download: it.name });
      a.click();
    },
    openHome() { return this.open("/"); },
  };

  const Calculator = {
    open() {
      const win = new Win({ appId: "calc", title: "Calculator", iconHtml: icon("calc", "width:16px;height:16px"), width: 320, height: 460, resizable: false, solid: true });
      const wrap = el("div", { class: "game-wrap", style: "padding:14px;gap:12px" });
      const disp = el("div", { class: "card mono", style: "font-size:30px;text-align:right;padding:16px;overflow:hidden", text: "0" });
      const pad = el("div", { style: "display:grid;grid-template-columns:repeat(4,1fr);gap:8px;flex:1" });
      let cur = "0", prev = null, op = null, fresh = true;
      const show = () => (disp.textContent = cur.length > 12 ? Number(cur).toPrecision(9) : cur);
      const calc = () => {
        const a = parseFloat(prev), b = parseFloat(cur);
        const r = op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : op === "÷" ? (b === 0 ? NaN : a / b) : b;
        return Number.isFinite(r) ? String(+r.toFixed(10)) : "Error";
      };
      for (const k of ["C", "±", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ".", "⌫", "="]) {
        const b = el("button", { class: "btn", text: k, style: "height:100%;font-size:16px" });
        if ("÷×−+=".includes(k)) b.classList.add("primary");
        b.addEventListener("click", () => {
          if (/[0-9]/.test(k)) { cur = fresh ? k : cur + k; fresh = false; }
          else if (k === "C") { cur = "0"; prev = null; op = null; fresh = true; }
          else if (k === "⌫") cur = cur.slice(0, -1) || "0";
          else if (k === ".") { if (!cur.includes(".")) cur += "."; fresh = false; }
          else if (k === "±") cur = cur.startsWith("-") ? cur.slice(1) : "-" + cur;
          else if (k === "%") cur = String(parseFloat(cur) / 100);
          else if (k === "=") { if (op) { cur = calc(); prev = null; op = null; fresh = true; } }
          else { if (op && !fresh) cur = calc(); prev = cur; op = k; fresh = true; }
          show();
        });
        pad.append(b);
      }
      wrap.append(disp, pad);
      win.content.append(wrap);
      return win;
    },
  };

  const Paint = {
    open() {
      const win = new Win({ appId: "paint", title: "Paint", iconHtml: icon("brush", "width:16px;height:16px"), width: 860, height: 620, solid: true });
      const wrap = el("div", { class: "paint-wrap" });
      const tools = el("div", { class: "paint-tools" });
      const colors = ["#111111", "#e0455f", "#e0a12a", "#2fa472", "#2f8fd8", "#8f5cf7", "#ffffff"];
      let color = colors[0], size = 4, drawing = false;
      for (const c of colors) {
        const s = el("button", { class: "swatch" + (c === color ? " on" : ""), style: `background:${c}` });
        s.addEventListener("click", () => { color = c; tools.querySelectorAll(".swatch").forEach((x) => x.classList.remove("on")); s.classList.add("on"); });
        tools.append(s);
      }
      const sizeSel = el("input", { type: "range", min: "1", max: "40", value: "4", style: "width:120px" });
      sizeSel.addEventListener("input", () => (size = +sizeSel.value));
      const eraser = el("button", { class: "btn sm", text: "Eraser" });
      eraser.addEventListener("click", () => { color = "#ffffff"; });
      const clear = el("button", { class: "btn sm", text: "Clear" });
      const save = el("button", { class: "btn sm primary", text: "Save PNG" });
      tools.append(sizeSel, eraser, clear, save);
      const cw = el("div", { class: "paint-canvas-wrap" });
      const canvas = el("canvas", { width: 800, height: 480 });
      canvas.style.cssText = "max-width:100%;max-height:100%;background:#fff;cursor:crosshair";
      cw.append(canvas);
      wrap.append(tools, cw);
      win.content.append(wrap);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      const pos = (e) => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * canvas.width / r.width, y: (e.clientY - r.top) * canvas.height / r.height }; };
      canvas.addEventListener("pointerdown", (e) => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.strokeStyle = color; ctx.lineWidth = size; canvas.setPointerCapture(e.pointerId); });
      canvas.addEventListener("pointermove", (e) => { if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
      canvas.addEventListener("pointerup", () => (drawing = false));
      clear.addEventListener("click", () => { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); });
      save.addEventListener("click", () => { const a = el("a", { href: canvas.toDataURL("image/png"), download: "nebula-paint.png" }); a.click(); });
      return win;
    },
  };

  const Terminal = {
    open() {
      const win = new Win({ appId: "terminal", title: "Terminal", iconHtml: icon("term", "width:16px;height:16px"), width: 780, height: 500, solid: true });
      const wrap = el("div", { class: "term" });
      const out = el("div", { class: "term-out" });
      const line = el("div", { class: "term-line-in" });
      line.innerHTML = `<span class="ps">nebula@os</span><span class="t-dim">:~$</span>`;
      const input = el("input", { spellcheck: "false", autocomplete: "off" });
      line.append(input);
      wrap.append(out, line);
      win.content.append(wrap);
      const print = (html) => { const d = el("div", { html }); out.append(d); out.scrollTop = out.scrollHeight; };
      print(`<span class="t-acc">NebulaOS Terminal ${Nebula.VERSION.os}</span>\nType <span class="t-ok">help</span> for the command list.`);
      const cmds = {
        help: () => `Commands:
  <span class="t-ok">help</span>                     this list
  <span class="t-ok">about</span>                    version + component info
  <span class="t-ok">diag</span>                     run proxy diagnostics
  <span class="t-ok">engine</span> &lt;uv|sc2|sc1&gt;       switch backend engine
  <span class="t-ok">transport</span> &lt;epoxy|libcurl&gt; switch transport
  <span class="t-ok">wisp</span> [url|presets]         show or set the Wisp relay
  <span class="t-ok">search</span> &lt;ddg|google|brave&gt;  search provider
  <span class="t-ok">theme</span> &lt;name&gt;               crimson terracotta marigold emerald aqua glacier midnight graphite
  <span class="t-ok">wallpaper</span> &lt;name&gt;           gradient aurora glacier
  <span class="t-ok">proxy</span> [on|off|restart]     manage the service worker
  <span class="t-ok">fetch</span> &lt;url&gt;                proxied HEAD request through the wisp
  <span class="t-ok">open</span> &lt;appId|url&gt;           launch an app or browse
  <span class="t-ok">ls</span> / <span class="t-ok">cat</span> &lt;path&gt;            virtual files
  <span class="t-ok">cloak</span> / <span class="t-ok">blob</span> / <span class="t-ok">anticlose</span>   privacy toggles
  <span class="t-ok">date</span> <span class="t-ok">whoami</span> <span class="t-ok">clear</span> <span class="t-ok">exit</span>`,
        about: () => `NebulaOS ${Nebula.VERSION.os} “${Nebula.VERSION.codename}” build ${Nebula.VERSION.build}
Ultraviolet 3.2.10 · Scramjet 1.1.0 · Scramjet 2.0.67-alpha.2 · bare-mux 2.1.9
Transport: ${state.transport}   Engine: ${state.engine}   Wisp: ${state.wisp}`,
        async diag() { Proxy.probeAll(true); return "Running diagnostics in a dialog window…"; },
        engine: async (a) => { if (!Nebula.ENGINES[a]) return `<span class="t-err">unknown engine</span> (uv, sc2, sc1)`; set({ engine: a }); await Proxy.ensureEngine(a); return `engine → <span class="t-ok">${Nebula.ENGINES[a].name}</span>`; },
        transport: async (a) => { if (!Nebula.TRANSPORTS[a]) return `<span class="t-err">unknown transport</span> (epoxy, libcurl)`; set({ transport: a }); await Proxy.restart(); return `transport → <span class="t-ok">${Nebula.TRANSPORTS[a].name}</span>`; },
        wisp: async (a) => {
          if (!a) return `current: ${state.wisp}\npresets:\n` + Nebula.WISP_PRESETS.map((p) => `  ${p.name}  <span class="t-dim">${p.url}</span>`).join("\n");
          const url = a === "presets" ? "" : a;
          if (!url) return Nebula.WISP_PRESETS.map((p) => `${p.name} <span class="t-dim">${p.url}</span>`).join("\n");
          set({ wisp: url.endsWith("/") ? url : url + "/" });
          await Proxy.restart();
          return `wisp → <span class="t-ok">${state.wisp}</span>`;
        },
        search: (a) => (Nebula.SEARCH_ENGINES[a] ? (set({ search: a }), `search → ${Nebula.SEARCH_ENGINES[a].name}`) : "usage: search <ddg|google|brave>"),
        theme: (a) => { const t = Nebula.THEMES.find((x) => x.id === a); if (!t) return `<span class="t-err">unknown theme</span> — try: ` + Nebula.THEMES.map((x) => x.id).join(", "); set({ theme: t.id }); return `theme → ${t.name}`; },
        wallpaper: (a) => { const w = Nebula.WALLS.find((x) => x.id === a); if (!w) return "gradient, aurora, glacier"; set({ wallpaper: w.id }); return `wallpaper → ${w.name}`; },
        proxy: async (a) => {
          if (a === "off") { await Proxy.unregisterSW(); Nebula.Shell.setProxyBadge("bad", "Proxy: off"); return "service worker unregistered"; }
          if (a === "restart" || !a) { await Proxy.restart(); return `transport ${Proxy.transportName || "unknown"} · sw ${Proxy.swReady ? "active" : "inactive"}`; }
          return `sw: ${Proxy.swReady ? "active" : "inactive"} | transport: ${Proxy.transportName || "—"} | wisp: ${state.wisp}`;
        },
        async fetch(a) {
          if (!a) return "usage: fetch <url>";
          try { const r = await Proxy.probeFetch(); return `GET example.com → HTTP ${r.status} in ${r.ms}ms (${Nebula.ENGINES[state.engine].name})`; }
          catch (e) { return `<span class="t-err">${esc(String(e.message || e))}</span>`; }
        },
        open: (a) => {
          if (!a) return "usage: open <appId|url>";
          if (Registry.byId(a)) { Registry.byId(a).run(); return `launched ${a}`; }
          Browser.open({ url: a });
          return `browsing ${a}`;
        },
        ls: (a) => { FS.load(); return FS.list(a || "/").map((i) => `${i.type === "dir" ? "📁" : "📄"} ${i.name}`).join("\n") || "(empty)"; },
        cat: (a) => { FS.load(); if (!a) return "usage: cat <path>"; return esc(FS.read(a)) || `<span class="t-err">not found: ${esc(a)}</span>`; },
        cloak: () => { Privacy.cloak(); return "tab cloaked → " + document.title; },
        blob: () => { Privacy.toBlob(); return "converting…"; },
        anticlose: (a) => { const v = a ? a === "on" : !state.anticlose; set({ anticlose: v }); return `anti-close → ${v ? "on" : "off"}`; },
        date: () => new Date().toString(),
        whoami: () => "nebula@os",
        clear: () => { out.innerHTML = ""; return ""; },
        exit: () => { win.close(); return "bye"; },
      };
      const run = async (raw) => {
        print(`<span class="t-dim">nebula@os:~$</span> ${esc(raw)}`);
        const [c, ...rest] = raw.trim().split(/\s+/);
        const arg = rest.join(" ");
        if (!c) return;
        if (!cmds[c]) return print(`<span class="t-err">command not found:</span> ${esc(c)} — try <span class="t-ok">help</span>`);
        try { const r = await cmds[c](arg); if (r) print(r); } catch (e) { print(`<span class="t-err">${esc(String(e.message || e))}</span>`); }
      };
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { const v = input.value; input.value = ""; run(v); }
        if (e.key === "ArrowUp") { input.value = this.last || ""; }
      });
      win.el.addEventListener("keydown", (e) => { if (e.key === "Enter") input.focus(); });
      setTimeout(() => input.focus(), 60);
      return win;
    },
    last: "",
  };

  /* ==========================================================================
   *  Apps module: registry + HTML import
   * ======================================================================== */
  /* ==========================================================================
   *  Drop-in HTML apps — your own single-file apps and games
   * --------------------------------------------------------------------------
   *  Any single-file HTML app can become a NebulaOS app. Metadata is read from
   *  meta tags in the file (every one of them is optional):
   *
   *     <meta name="nebula-name"        content="Minesweeper">
   *     <meta name="nebula-icon"        content="💣">          emoji, or a path/URL
   *     <meta name="nebula-description" content="Clear the minefield.">
   *     <meta name="nebula-kind"        content="game">        game | app
   *     <meta name="nebula-category"    content="Games">
   *
   *  build.py scans apps/ and games/ and writes window.NEBULA_MANIFEST, which
   *  this module registers at boot. Files can also be imported at runtime from
   *  App Store → “Import HTML app” (kept in localStorage).
   * ======================================================================== */
  const AppMeta = {
    read(html, fallbackName = "Imported app") {
      const meta = {};
      for (const m of html.matchAll(/<meta[^>]+>/gi)) {
        const tag = m[0];
        const n = tag.match(/name\s*=\s*["']nebula-([a-z0-9-]+)["']/i);
        const c = tag.match(/content\s*=\s*["']([^"']*)["']/i);
        if (n && c) meta[n[1].toLowerCase()] = c[1].trim();
      }
      const title = (html.match(/<title[^>]*>([^<]{1,80})<\/title>/i) || [])[1] || "";
      const kind = (meta.kind || "").toLowerCase() === "game" ? "game" : "app";
      return {
        name: meta.name || title.trim() || fallbackName,
        icon: meta.icon || (kind === "game" ? "🎮" : "📦"),
        description: meta.description || "",
        kind,
        category: meta.category || (kind === "game" ? "Games" : "Imported"),
        width: parseInt(meta.width, 10) || 0,
        height: parseInt(meta.height, 10) || 0,
      };
    },
    /* an emoji stays text; a path/URL becomes an <img> the shell can place anywhere */
    iconMarkup(icon, size = 22) {
      if (!icon) return "";
      const asFile = /\.(png|jpe?g|svg|webp|gif|ico)$/i.test(icon) || /^(data:|https?:)/i.test(icon);
      if (!asFile) return esc(icon);
      const src = /^(data:|https?:)/i.test(icon) ? icon : Proxy.resolveUrl(Proxy.baseDir() + icon.replace(/^\.?\//, ""));
      return `<img src="${esc(src)}" alt="" style="width:${size}px;height:${size}px;object-fit:contain;display:block;margin:auto">`;
    },
    decodeB64(b64) {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder("utf-8").decode(bytes);
    },
  };

  /* Opens one single-file HTML app in its own window. `html` (a string) wins over `url`. */
  function openHtmlApp(o) {
    const opts = Object.assign({ html: null, url: null, name: "App", icon: "📦", width: 0, height: 0, appId: "" }, o);
    const win = new Win({
      appId: opts.appId || "html-" + uid(),
      title: opts.name,
      iconHtml: AppMeta.iconMarkup(opts.icon, 16) || "📦",
      width: opts.width || 1024,
      height: opts.height || 680,
      solid: true,
    });
    win.content.style.padding = "0";
    const frame = el("iframe", { title: opts.name, style: "width:100%;height:100%;border:0;display:block;background:#fff" });
    if (opts.html != null) {
      frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-pointer-lock");
      frame.srcdoc = opts.html;
    } else if (opts.url) {
      frame.src = opts.url;
    }
    win.content.append(frame);
    return win;
  }

  const Apps = {
    register() {
      const R = Registry;
      R.register({ id: "browser", name: "Nebula Browser", sub: "Proxied web browser", emoji: "🌐", iconHtml: icon("globe", "width:24px;height:24px"), category: "Internet", pinned: true, tint: "linear-gradient(135deg,#2f8fd8,#63c7f5)", details: "Multi-tab browser that renders any site through Ultraviolet or Scramjet.", run: () => Browser.open() });
      R.register({ id: "discord", name: "Discord", sub: "Login + chat through the proxy", emoji: "💬", iconHtml: icon("discord", "width:24px;height:24px"), category: "Internet", pinned: true, tint: "linear-gradient(135deg,#5865f2,#8b93ff)", details: "Runs Discord web inside the proxy so you can sign in from school or work, with a widget embed fallback.", run: () => Discord.open() });
      R.register({ id: "quantum", name: "Quantum Browser", sub: "Alt browser, real proxy backend", emoji: "⚛️", iconHtml: icon("globe", "width:24px;height:24px"), category: "Internet", tint: "linear-gradient(135deg,#6b4ef0,#2fd0d0)", details: "The Quantum UI from the upload, rebuilt so every page loads through the Nebula proxy instead of a plain iframe.", run: () => Quantum.open() });
      R.register({ id: "store", name: "App Store", sub: "Apps, games & HTML import", emoji: "🧩", iconHtml: icon("apps", "width:24px;height:24px"), category: "Utilities", pinned: true, run: () => AppStore.open() });
      R.register({ id: "games", name: "Games", sub: "Offline arcade", emoji: "🎮", iconHtml: icon("gamepad", "width:24px;height:24px"), category: "Games", pinned: true, run: () => Games.openHub() });
      R.register({ id: "files", name: "Files", sub: "Your NebulaOS documents", emoji: "📁", iconHtml: icon("files", "width:24px;height:24px"), category: "Utilities", pinned: true, run: () => Files.openHome() });
      R.register({ id: "notepad", name: "Notepad", sub: "Write and save notes", emoji: "📝", iconHtml: icon("note", "width:24px;height:24px"), category: "Utilities", run: () => Files.openNote("/Documents/untitled.txt") });
      R.register({ id: "terminal", name: "Terminal", sub: "Command line control", emoji: "⌨️", iconHtml: icon("term", "width:24px;height:24px"), category: "Utilities", pinned: true, run: () => Terminal.open() });
      R.register({ id: "calc", name: "Calculator", sub: "Quick maths", emoji: "🧮", iconHtml: icon("calc", "width:24px;height:24px"), category: "Utilities", run: () => Calculator.open() });
      R.register({ id: "paint", name: "Paint", sub: "Draw and export PNG", emoji: "🎨", iconHtml: icon("brush", "width:24px;height:24px"), category: "Media", run: () => Paint.open() });
      R.register({ id: "settings", name: "Settings", sub: "Themes, proxy, privacy", emoji: "⚙️", iconHtml: icon("gear", "width:24px;height:24px"), category: "Utilities", pinned: true, run: () => Settings.open() });

      // restore apps you imported at runtime
      for (const imp of state.installedApps || []) this.registerImported(imp, true);
      // register the apps and games found in apps/ and games/ by build.py
      this.registerBundled();
    },
    async importDialog() {
      const v = await dialog({
        title: "Import an HTML app",
        icon: "upload", wide: true,
        msg: `Drop in a single-file HTML app and it becomes a launcher entry with its own window.<br><br>
          <b>Stored where?</b> Inside NebulaOS (localStorage) — keep files under ~1 MB.<br>
          <b>Want a nicer entry?</b> Add <code>&lt;meta name="nebula-name" content="My App"&gt;</code>,
          <code>nebula-icon</code> (emoji or image) and <code>nebula-description</code> to the file and
          NebulaOS picks them up automatically.<br>
          <b>Note:</b> imported apps run with full access to your NebulaOS session, so only import files you trust.`,
        buttons: [{ label: "Cancel", value: null }, { label: "Choose file…", primary: true, value: "file" }, { label: "Paste HTML", value: "paste" }],
      });
      if (v === "file") {
        const input = el("input", { type: "file", accept: ".html,.htm,.svg,text/html" });
        input.addEventListener("change", async () => {
          const f = input.files[0]; if (!f) return;
          const text = await f.text();
          const meta = AppMeta.read(text, f.name.replace(/\.(html?|svg)$/i, ""));
          const ok = await dialog({
            title: "Import “" + meta.name + "”?",
            icon: "upload", wide: true,
            msg: `<b>${esc(meta.name)}</b><br>${meta.description ? esc(meta.description) + "<br>" : ""}
              <span class="faint">${meta.kind === "game" ? "Game" : "App"} · ${fmtBytes(text.length)} · icon ${esc(meta.icon)} · category ${esc(meta.category)}</span><br><br>
              It will appear in Apps and in the app grid${meta.kind === "game" ? " (and in Games)" : ""}, stored inside NebulaOS.`,
            buttons: [{ label: "Cancel", value: null }, { label: "Add to NebulaOS", primary: true, value: "ok" }],
          });
          if (ok === "ok") this.importHtml(text, meta.name, meta);
        });
        input.click();
      } else if (v === "paste") {
        const html = await dialog({ title: "Paste the HTML source", input: { placeholder: "<!DOCTYPE html>…" }, buttons: [{ label: "Cancel", value: null }, { label: "Import", primary: true, value: "ok" }] });
        if (html) this.importHtml(html, "Imported app");
      }
    },
    importHtml(html, name, meta) {
      meta = meta || AppMeta.read(html, name);
      if (!html || html.length < 30) return toast("Import failed", "That file looks empty.", "err");
      if (html.length > 3_000_000) return toast("File too large", `${fmtBytes(html.length)} exceeds the ~3 MB localStorage budget.`, "err", 6000);
      const id = "import-" + uid();
      const entry = {
        id, name: meta.name || name || "Imported app", html, at: Date.now(),
        icon: meta.icon, description: meta.description, kind: meta.kind, category: meta.category,
        width: meta.width, height: meta.height,
      };
      const list = [...(state.installedApps || []).filter((a) => a.name !== entry.name), entry];
      try { set({ installedApps: list }); } catch { return toast("Storage full", "Delete another imported app first.", "err", 6000); }
      this.registerImported(entry);
      Nebula.Dock.render();
      Launcher.build();
      toast("App imported", `${entry.name} is now in your dock and app grid.`, "ok");
      const app = Registry.byId(id);
      if (app) app.run();
    },
    /* everything build.py found in apps/ and games/ */
    registerBundled() {
      const manifest = Array.isArray(globalThis.NEBULA_MANIFEST) ? globalThis.NEBULA_MANIFEST : [];
      const payloads = globalThis.NEBULA_EMBEDDED || {};
      for (const e of manifest) {
        if (!e || !e.id || Registry.byId(e.id)) continue;
        let html = null;
        if (e.embedded && payloads[e.id]) {
          try { html = AppMeta.decodeB64(payloads[e.id]); }
          catch (err) { console.warn("[nebula] could not decode bundled app", e.id, err); }
        }
        const url = html == null ? Proxy.resolveUrl(Proxy.baseDir() + e.path) : null;
        const isGame = e.kind === "game";
        const open = () => openHtmlApp({
          appId: e.id, html, url,
          name: e.name, icon: e.icon,
          width: e.width || (isGame ? 1000 : 1040),
          height: e.height || (isGame ? 700 : 690),
        });
        Registry.register({
          id: e.id,
          name: e.name,
          sub: isGame ? "Bundled game" : "Bundled app",
          emoji: e.icon || (isGame ? "🎮" : "📦"),
          iconHtml: AppMeta.iconMarkup(e.icon, 24),
          category: isGame ? "Games" : (e.category || "Bundled"),
          bundled: true,
          details: `${e.description || "Bundled with this build."}\n\n${(e.bytes / 1024).toFixed(1)} KB · ${e.embedded ? "packed inside the NebulaOS file" : "loaded on demand from " + e.path}`,
          run: open,
        });
      }
    },
    registerImported(entry, silent = false) {
      if (Registry.byId(entry.id)) return;
      const isGame = entry.kind === "game" || entry.category === "Games";
      Registry.register({
        id: entry.id,
        name: entry.name,
        sub: isGame ? "Imported game" : "Imported app",
        emoji: entry.icon || (isGame ? "🎮" : "📦"),
        iconHtml: AppMeta.iconMarkup(entry.icon, 24),
        imported: true,
        category: isGame ? "Games" : "Imported",
        details: `Imported ${new Date(entry.at || Date.now()).toLocaleString()}\n\n${entry.description || "Single-file HTML app you added."}\n\nStored inside NebulaOS (localStorage).`,
        run: () => openHtmlApp({
          appId: entry.id, html: entry.html, name: entry.name, icon: entry.icon,
          width: entry.width || (isGame ? 1000 : 1040), height: entry.height || (isGame ? 700 : 690),
        }),
      });
      if (!silent) { /* registered during import already */ }
      return Registry.byId(entry.id);
    },
    removeImported(id) {
      set({ installedApps: (state.installedApps || []).filter((a) => a.id !== id) });
      Registry.apps = Registry.apps.filter((a) => a.id !== id);
      Nebula.Dock.render();
      Launcher.build();
    },
  };

  Nebula.Apps = Apps;
  Nebula.AppStore = AppStore;
  Nebula.Games = Games;
  Nebula.Terminal = Terminal;
  Nebula.Files = Files;
  Nebula.Calculator = Calculator;
  Nebula.Paint = Paint;
  Nebula.Discord = Discord;
  Nebula.Browser = Browser;
  Nebula.Quantum = Quantum;
  Nebula.FS = FS;
  Nebula.ProxySession = ProxySession;
  Nebula.setupAppList = () => Apps.register();
})();
