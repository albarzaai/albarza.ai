// Wraps the OpenNext worker with an edge page cache. Pages are stored per deploy version, so a new deploy never serves old HTML.
// @ts-expect-error generated at build time by opennextjs-cloudflare
import openNext from "./.open-next/worker.js";
// @ts-expect-error generated at build time by opennextjs-cloudflare
export * from "./.open-next/worker.js";

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

const TTL = 3600;

function cacheable(req: Request): boolean {
  if (req.method !== "GET") return false;
  const { pathname } = new URL(req.url);
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) return false;
  // Anything personal or a Next.js data/action request goes straight to the app.
  return !["cookie", "authorization", "rsc", "next-action", "next-router-prefetch"].some((h) => req.headers.has(h));
}

export default {
  async fetch(req: Request, env: Env, ctx: Ctx): Promise<Response> {
    const url = new URL(req.url);
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
  },
};
