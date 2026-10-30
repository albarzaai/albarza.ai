import { reportToSentry } from "./lib/sentry";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { bodyLimit } from "hono/body-limit";
import { z } from "zod";
import { auth, type Env as AuthEnv } from "./auth";

type Limiter = { limit(o: { key: string }): Promise<{ success: boolean }> };
type Bindings = AuthEnv & {
  GEMINI_API_KEY?: string;
  ALLOWED_ORIGINS: string;
  GENERATE_LIMIT: Limiter;
  GLOBAL_LIMIT: Limiter;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", secureHeaders({
  strictTransportSecurity: "max-age=63072000; includeSubDomains; preload",
  contentSecurityPolicy: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
  crossOriginResourcePolicy: "same-site",
  referrerPolicy: "no-referrer",
}));

app.use("*", async (c, next) => {
  await next();
  c.header("Cache-Control", "no-store");
});

// Strict CORS: only the site's own origins, no credentials wildcard.
app.use("*", (c, next) =>
  cors({
    origin: (origin) => (c.env.ALLOWED_ORIGINS.split(",").includes(origin) ? origin : null),
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["content-type", "authorization"],
    maxAge: 600,
  })(c, next),
);

const ip = (c: { req: { header(n: string): string | undefined } }) => c.req.header("x-client-ip") ?? c.req.header("cf-connecting-ip") ?? "unknown";

// Global per-IP limit on everything.
app.use("*", async (c, next) => {
  if (!(await c.env.GLOBAL_LIMIT.limit({ key: ip(c) })).success) return c.json({ error: "rate_limited" }, 429);
  await next();
});

app.get("/health", (c) => c.json({ ok: true }));

// Callers must prove they are the albarza.ai frontend until real user sessions exist.
async function authorized(c: { env: Bindings; req: { header(n: string): string | undefined } }) {
  const want = c.env.INTERNAL_AUTH_SECRET;
  const got = c.req.header("x-internal-auth");
  if (!want || !got) return false;
  // Hash both sides so lengths match, then compare in constant time.
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(want)), crypto.subtle.digest("SHA-256", enc.encode(got))]);
  return crypto.subtle.timingSafeEqual(a, b);
}

app.route("/v1", auth);

app.notFound((c) => c.json({ error: "not_found" }, 404));
app.onError((err, c) => {
  console.error("api error", err instanceof Error ? err.message : String(err));
  const path = new URL(c.req.url).pathname;
  c.executionCtx.waitUntil(reportToSentry(err, { service: "api", path, method: c.req.method, tags: { kind: "api-error" } }));
  return c.json({ error: "internal" }, 500);
});

export default app;
