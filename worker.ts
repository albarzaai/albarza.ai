// Wraps the OpenNext worker with an edge page cache. Pages are stored per deploy version, so a new deploy never serves old HTML.
// @ts-expect-error generated at build time by opennextjs-cloudflare
import openNext from "./.open-next/worker.js";
// @ts-expect-error generated at build time by opennextjs-cloudflare
export * from "./.open-next/worker.js";

import { reportToSentry } from "./lib/sentry";

type Ctx = { waitUntil(p: Promise<unknown>): void };
type Env = { CF_VERSION?: { id: string }; API?: { fetch(url: string, init?: RequestInit): Promise<Response> }; INTERNAL_AUTH_SECRET?: string };

const SESSION_COOKIE = "__Host-albarza_session";
const APP_PATH = /^\/(ar|en)\/app(\/|$)/;

// The signed-in area is closed to everyone without a valid session. The check happens here, before any page code runs.
async function hasSession(req: Request, env: Env): Promise<boolean> {
  const m = new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([A-Za-z0-9_-]{32,64})`).exec(req.headers.get("cookie") ?? "");
  if (!m || !env.API || !env.INTERNAL_AUTH_SECRET) return false;
  const r = await env.API.fetch("https://api.albarza.ai/v1/me", { headers: { "x-internal-auth": env.INTERNAL_AUTH_SECRET, authorization: `Bearer ${m[1]}` } }).catch(() => null);
  return !!r?.ok;
}

const TTL = 6 * 3600;

function cacheable(req: Request): boolean {
  if (req.method !== "GET") return false;
  const { pathname } = new URL(req.url);
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) return false;
  // Anything personal or a Next.js data/action request goes straight to the app.
  return !["cookie", "authorization", "rsc", "next-action", "next-router-prefetch"].some((h) => req.headers.has(h));
}

const errorPage = (lang: string) => new Response(
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Albarza</title><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#0b0b0b;color:#fff;font-family:system-ui,sans-serif;text-align:center"><div><h1 style="font-size:22px">${lang === "ar" ? "حدث خطأ مؤقت" : "Something went wrong"}</h1><p style="opacity:.7">${lang === "ar" ? "أعد تحميل الصفحة وحاول مرة أخرى." : "Reload the page and try again."}</p><a href="" style="color:#bd9b5f">${lang === "ar" ? "إعادة التحميل" : "Reload"}</a></div></body>`,
  { status: 500, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });

// Logs every failed page or action request (visible in the Worker logs) and replaces an empty or crashed answer with a readable page.
async function guarded(run: () => Promise<Response>, req: Request, ctx: Ctx): Promise<Response> {
  const path = new URL(req.url).pathname;
  const lang = path.startsWith("/en") ? "en" : "ar";
  try {
    const res = await run();
    if (res.status >= 500) {
      console.error("server-error", req.method, path, res.status);
      ctx.waitUntil(reportToSentry(new Error(`HTTP ${res.status} ${req.method} ${path}`), { service: "web", path, method: req.method, tags: { kind: "server-error", status: String(res.status) } }));
      if (!res.body && req.headers.get("accept")?.includes("text/html")) return errorPage(lang);
    }
    return res;
  } catch (e) {
    console.error("server-exception", req.method, path, e instanceof Error ? e.message : String(e));
    ctx.waitUntil(reportToSentry(e, { service: "web", path, method: req.method, tags: { kind: "server-exception" } }));
    return errorPage(lang);
  }
}

export default {
  async fetch(req: Request, env: Env, ctx: Ctx): Promise<Response> {
    return guarded(() => handle(req, env, ctx), req, ctx);
  },
};

// Pasted links often carry a trailing newline or a doubled language ("/ar/ar%0A"); send those to the page that was meant.
function tidyPath(url: URL): string | null {
  let decoded: string;
  try { decoded = decodeURIComponent(url.pathname); } catch { return null; }
  const fixed = decoded.replace(/[\s\u0000-\u001f]+$/, "").replace(/^\/(ar|en)\/(ar|en)(?=\/|$)/, "/$1");
  return fixed !== decoded && fixed.startsWith("/") ? url.origin + encodeURI(fixed) + url.search : null;
}

async function handle(req: Request, env: Env, ctx: Ctx): Promise<Response> {
  {
    const url = new URL(req.url);
    const tidy = req.method === "GET" || req.method === "HEAD" ? tidyPath(url) : null;
    if (tidy) return new Response(null, { status: 308, headers: { location: tidy, "cache-control": "no-store" } });
    const app = APP_PATH.exec(url.pathname);
    if (app && !(await hasSession(req, env))) {
      if (req.method !== "GET" && req.method !== "HEAD") return new Response("unauthorized", { status: 401, headers: { "cache-control": "no-store" } });
      const next = encodeURIComponent(url.pathname);
      return new Response(null, { status: 302, headers: { location: `${url.origin}/${app[1]}/login?next=${next}`, "cache-control": "no-store" } });
    }
    if (!cacheable(req)) return openNext.fetch(req, env, ctx);

    const cache = (caches as unknown as { default: Cache }).default;
    const u = new URL(req.url);
    u.searchParams.set("__v", env.CF_VERSION?.id ?? "dev");
    const key = new Request(u.toString(), { method: "GET" });

    const hit = await cache.match(key);
    if (hit) {
      const r = new Response(hit.body, hit);
      r.headers.set("x-edge-cache", "HIT");
      return r;
    }

    const res: Response = await openNext.fetch(req, env, ctx);
    if (res.status === 200 && res.headers.get("content-type")?.startsWith("text/html") && !res.headers.has("set-cookie")) {
      const stored = new Response(res.clone().body, res);
      stored.headers.set("cache-control", `public, max-age=0, s-maxage=${TTL}`);
      ctx.waitUntil(cache.put(key, stored));
      const out = new Response(res.body, res);
      out.headers.set("cache-control", "public, max-age=0, must-revalidate");
      out.headers.set("x-edge-cache", "MISS");
      return out;
    }
    return res;
  }
}
