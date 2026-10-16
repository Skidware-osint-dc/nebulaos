/* =============================================================================
 *  NebulaOS — service worker  (nebula.sw.js)
 *  ---------------------------------------------------------------------------
 *  Put this file in the SAME FOLDER as NebulaOS.svg / NebulaOS.html.
 *
 *  Why a separate file?  A service worker's scope is limited to its own
 *  directory, and every proxied URL must live inside that scope.  This worker
 *  therefore derives all of its routes from its own location, so the app works
 *  from jsDelivr, GitHub Pages, Netlify, a USB stick served over localhost… —
 *  no hardcoded paths, no build step.
 *
 *  It powers three engines at once:
 *    nb-uv/   Ultraviolet 3.2.10          (+ synthesized uv config)
 *    sj1/     Scramjet 1.1.0
 *    sj2/     Scramjet 2.0.67-alpha.2     (scramjet-controller 0.0.14)
 *  and a message API the desktop uses to read its own configuration.
 * ========================================================================== */
"use strict";

/* ------------------------------------------------------------------ config */
const VERSIONS = { uv: "3.2.10", sc1: "1.1.0", sc2Controller: "0.0.14" };
const CDN = "https://cdn.jsdelivr.net/npm/";

const SW_URL = self.location.href;
const SW_ORIGIN = self.location.origin;
const DIR = self.location.pathname.replace(/[^/]*$/, ""); // e.g. "/gh/user/repo@main/"

const PREFIX = {
  uv: DIR + "nb-uv/",
  sc1: DIR + "sj1/",
  sc2: DIR + "sj2/",   /* path stays sj2/, key matches the desktop's engine id */
};

const UV_FILES = {
  bundle: CDN + `@titaniumnetwork-dev/ultraviolet@${VERSIONS.uv}/dist/uv.bundle.js`,
  handler: CDN + `@titaniumnetwork-dev/ultraviolet@${VERSIONS.uv}/dist/uv.handler.js`,
  client: CDN + `@titaniumnetwork-dev/ultraviolet@${VERSIONS.uv}/dist/uv.client.js`,
  sw: CDN + `@titaniumnetwork-dev/ultraviolet@${VERSIONS.uv}/dist/uv.sw.js`,
  config: PREFIX.uv + "config.js", // synthesized below
};
const SC1_FILES = {
  all: CDN + `@mercuryworkshop/scramjet@${VERSIONS.sc1}/dist/scramjet.all.js`,
  wasm: CDN + `@mercuryworkshop/scramjet@${VERSIONS.sc1}/dist/scramjet.wasm.wasm`,
  sync: CDN + `@mercuryworkshop/scramjet@${VERSIONS.sc1}/dist/scramjet.sync.js`,
};
const SC2_FILES = { controller: CDN + `@mercuryworkshop/scramjet-controller@${VERSIONS.sc2Controller}/dist/controller.sw.js` };

/* ------------------------------------------------ 1) Ultraviolet engine --- */
importScripts(UV_FILES.bundle, UV_FILES.sw);

const UV_CONFIG_INLINE = {
  prefix: PREFIX.uv,
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: UV_FILES.handler,
  client: UV_FILES.client,
  bundle: UV_FILES.bundle,
  config: UV_FILES.config,
  sw: UV_FILES.sw,
};
const ultraviolet = new UVServiceWorker(UV_CONFIG_INLINE);

/* The client half of Ultraviolet (injected into proxied pages) needs a config
 * file that carries *these* paths.  jsDelivr cannot host it, so this worker
 * serves it as a virtual file inside its own scope. */
const UV_CONFIG_SOURCE =
  `/* NebulaOS virtual Ultraviolet config */\n` +
  `self.__uv$config = {\n` +
  `  prefix: ${JSON.stringify(PREFIX.uv)},\n` +
  `  encodeUrl: Ultraviolet.codec.xor.encode,\n` +
  `  decodeUrl: Ultraviolet.codec.xor.decode,\n` +
  `  handler: ${JSON.stringify(UV_FILES.handler)},\n` +
  `  client: ${JSON.stringify(UV_FILES.client)},\n` +
  `  bundle: ${JSON.stringify(UV_FILES.bundle)},\n` +
  `  config: ${JSON.stringify(PREFIX.uv + "config.js")},\n` +
  `  sw: ${JSON.stringify(SW_URL)}\n` +
  `};\n`;

/* ------------------------------------------------ 2) Scramjet 1 engine ---- */
importScripts(SC1_FILES.all);
let scramjet1 = null;
let scramjet1Loader = null;
let scramjet1Error = null;
try {
  scramjet1Loader = typeof $scramjetLoadWorker === "function" ? $scramjetLoadWorker() : null;
  if (!scramjet1Loader) scramjet1Error = "$scramjetLoadWorker() is unavailable";
  else if (!scramjet1Loader.ScramjetServiceWorker) scramjet1Error = "worker module exports: " + Object.keys(scramjet1Loader).join(", ");
  else scramjet1 = new scramjet1Loader.ScramjetServiceWorker();
} catch (err) {
  scramjet1Error = String((err && err.stack) || err);
  console.warn("[NebulaOS] Scramjet 1 engine unavailable:", err);
}

/* ------------------------------------------------ 3) Scramjet 2 engine ---- */
importScripts(SC2_FILES.controller);
const scramjet2 = self.$scramjetController || null;
const scramjet2Error = scramjet2 ? null : "controller.sw.js did not expose $scramjetController";

/* ------------------------------------------------------- fetch routing --- */
const isSameOrigin = (url) => {
  try { return new URL(url).origin === SW_ORIGIN; } catch { return false; }
};

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method === "POST" && request.url.includes("__nebula_msg")) return; // reserved
  if (!isSameOrigin(request.url)) return;

  let url;
  try { url = new URL(request.url); } catch { return; }

  const unroutedFallback = () => {
    if (!PROXY_PREFIXES.some((p) => url.pathname.startsWith(p))) return null;
    return new Response(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Starting proxy engine…</title>
       <meta http-equiv="refresh" content="1">
       <style>body{background:#0d0f1a;color:#e8ecf7;font:15px/1.6 system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0;text-align:center}
       .b{width:34px;height:34px;border-radius:50%;border:3px solid rgba(255,255,255,.15);border-top-color:#7ea6ff;margin:0 auto 18px;animation:s 1s linear infinite}
       @keyframes s{to{transform:rotate(360deg)}} code{background:rgba(255,255,255,.08);padding:2px 6px;border-radius:5px;font-size:13px}</style></head>
       <body><div><div class="b"></div><b>NebulaOS is warming up the proxy engine…</b>
       <p style="opacity:.7;font-size:13px;max-width:34em">The service worker is waiting for the desktop to hand over its
       configuration for <code>${url.pathname.split("/")[1] || "/"}/</code>. This page reloads itself automatically.</p></div></body></html>`,
      { status: 503, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } }
    );
  };

  /* virtual files */
  if (url.pathname === UV_FILES.config) {
    return event.respondWith(new Response(UV_CONFIG_SOURCE, { headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-store" } }));
  }

  /* Scramjet v2 asks the page-side controller to do the work */
  try {
    if (scramjet2 && scramjet2.shouldRoute(event)) return event.respondWith(scramjet2.route(event));
  } catch (err) {
    console.warn("[NebulaOS] scramjet2 route error", err);
    const fb = unroutedFallback();
    if (fb) return event.respondWith(fb);
  }

  /* Ultraviolet */
  try {
    if (ultraviolet.route(event)) return event.respondWith(ultraviolet.fetch(event));
  } catch (err) {
    console.warn("[NebulaOS] ultraviolet route error", err);
    const fb = unroutedFallback();
    if (fb) return event.respondWith(fb);
  }

  /* Scramjet 1 — its config arrives from the page (ScramjetController.init()) */
  const isSc1 = url.pathname.startsWith(PREFIX.sc1);
  if (scramjet1 && (isSc1 || scramjet1.config)) {
    event.respondWith((async () => {
      try {
        /* The page-side controller stores its config in IndexedDB; on a cold
         * start the worker can beat it there, so retry briefly. */
        for (let i = 0; i < 4 && !scramjet1.config && scramjet1.loadConfig; i++) {
          await scramjet1.loadConfig();
          if (!scramjet1.config) await new Promise((r) => setTimeout(r, 250));
        }
        if (scramjet1.config && scramjet1.route(event)) return await scramjet1.fetch(event);
        console.warn("[NebulaOS] scramjet1 could not route", event.request.url);
      } catch (err) {
        console.warn("[NebulaOS] scramjet1 error", err);
      }
      return unroutedFallback() || fetch(event.request);
    })());
  }
});

/* Any request that looks like it belongs to an engine but could not be routed
 * (usually a cold start racing the page-side config) gets a friendly retry page
 * instead of a bare 404 from the host. */
self.addEventListener("fetch", (event) => {});
const PROXY_PREFIXES = Object.values(PREFIX);
const isProxyPath = (pathname) => PROXY_PREFIXES.some((p) => pathname.startsWith(p));

/* ------------------------------------------------------ lifecycle ------- */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

/* ------------------------------------------------------ message API ----- */
/* Replies to `{nebula:"config"}` with everything the desktop needs to build
 * proxied URLs, and lets the desktop change the Wisp relay / engine at
 * runtime without a reload. */
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data !== "object" || !data.nebula) return;
  const reply = (payload) => {
    const port = event.ports && event.ports[0];
    if (port) port.postMessage(payload);
    else if (event.source && event.source.postMessage) event.source.postMessage(payload);
  };
  switch (data.nebula) {
    case "ping":
      return reply({ nebula: "pong", version: "1.0.0" });
    case "config":
      return reply({
        nebula: "config",
        swUrl: SW_URL,
        origin: SW_ORIGIN,
        dir: DIR,
        prefixes: PREFIX,
        versions: VERSIONS,
        engines: { uv: !!ultraviolet, sc1: !!scramjet1, sc2: !!scramjet2 },
      });
    case "diag": {
      const makeReq = (u) => { try { return new Request(u); } catch { return null; } };
      const sc1Route = (() => {
        if (!scramjet1) return { available: false, error: scramjet1Error };
        try {
          const req = makeReq(PREFIX.sc1 + encodeURIComponent("https://example.com/"));
          return { available: true, configLoaded: !!scramjet1.config, route: scramjet1.route({ request: req }) };
        } catch (err) { return { available: true, configLoaded: !!scramjet1.config, error: String(err && err.message || err) }; }
      })();
      const sc2Route = (() => {
        if (!scramjet2) return { available: false, error: scramjet2Error };
        try {
          const req = makeReq(PREFIX.sc2 + "x/" + encodeURIComponent("https://example.com/"));
          return { available: true, keys: Object.keys(scramjet2), route: scramjet2.shouldRoute?.({ request: req }) };
        } catch (err) { return { available: true, error: String(err && err.message || err) }; }
      })();
      return reply({
        nebula: "diag",
        prefixes: PREFIX,
        engines: { uv: !!ultraviolet, sc1: !!scramjet1, sc2: !!scramjet2 },
        sc1: sc1Route,
        sc2: sc2Route,
        uvConfig: UV_CONFIG_SOURCE.length,
      });
    }
    case "route": {
      /* Route a URL through a chosen engine exactly as the fetch handler would:
       * returns the response body length so the desktop can self-test. */
      const target = data.url || PREFIX.uv + encodeURIComponent("https://example.com/");
      const engine = data.engine || "uv";
      (async () => {
        try {
          const req = new Request(target);
          const fakeEvent = { request: req, respondWith: (p) => { fakeEvent._p = p; } };
          if (engine === "uv" && ultraviolet.route(fakeEvent)) {
            const res = await ultraviolet.fetch(fakeEvent);
            return reply({ nebula: "route", ok: true, engine, status: res.status, len: (await res.clone().text()).length });
          }
          if (engine === "sc1" && scramjet1) {
            if (!scramjet1.config && scramjet1.loadConfig) await scramjet1.loadConfig();
            if (scramjet1.route(fakeEvent)) {
              const res = await scramjet1.fetch(fakeEvent);
              return reply({ nebula: "route", ok: true, engine, status: res.status, len: (await res.clone().text()).length });
            }
          }
          return reply({ nebula: "route", ok: false, engine, error: "engine did not route this URL" });
        } catch (err) {
          return reply({ nebula: "route", ok: false, engine, error: String((err && err.stack) || err) });
        }
      })();
      return;
    }
    case "probe": {
      /* quick self-test: can we reach a website through the active transport? */
      const bare = typeof Ultraviolet !== "undefined" && Ultraviolet.BareClient ? new Ultraviolet.BareClient() : null;
      if (!bare) return reply({ nebula: "probe", ok: false, error: "no bare client in worker" });
      bare
        .fetch("https://example.com/", { method: "GET" })
        .then((res) => reply({ nebula: "probe", ok: true, status: res.status }))
        .catch((err) => reply({ nebula: "probe", ok: false, error: String(err && err.message || err) }));
      return;
    }
    default:
      return reply({ nebula: "error", error: "unknown request" });
  }
});

console.log("[NebulaOS] service worker ready ·", SW_URL, "· prefixes:", JSON.stringify(PREFIX));
