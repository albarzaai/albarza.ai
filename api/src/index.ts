import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { bodyLimit } from "hono/body-limit";
import { z } from "zod";

type Limiter = { limit(o: { key: string }): Promise<{ success: boolean }> };
type Bindings = {
  GEMINI_API_KEY?: string;
  INTERNAL_AUTH_SECRET?: string;
  ALLOWED_ORIGINS: string;
  GENERATE_LIMIT: Limiter;
  GLOBAL_LIMIT: Limiter;
};

const MODEL = "gemini-2.5-flash-image";
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
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["content-type"],
    maxAge: 600,
  })(c, next),
);

const ip = (c: { req: { header(n: string): string | undefined } }) => c.req.header("cf-connecting-ip") ?? "unknown";

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

const generateSchema = z.object({
  prompt: z.string().trim().min(1).max(2000),
  aspect: z.string().regex(/^\d{1,2}:\d{1,2}$/).optional(),
  userIp: z.string().max(64).optional(),
});

app.post("/v1/generate/image", bodyLimit({ maxSize: 8 * 1024, onError: (c) => c.json({ error: "too_large" }, 413) }), async (c) => {
  if (!(await authorized(c))) return c.json({ error: "unauthorized" }, 401);
  if (!c.req.header("content-type")?.startsWith("application/json")) return c.json({ error: "unsupported_media_type" }, 415);

  const parsed = generateSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ error: "invalid" }, 400);
  const { prompt, aspect, userIp } = parsed.data;

  // The frontend forwards the visitor's IP so limits apply per visitor, not per frontend.
  if (!(await c.env.GENERATE_LIMIT.limit({ key: userIp ?? ip(c) })).success) return c.json({ error: "rate_limited" }, 429);
  if (!c.env.GEMINI_API_KEY) return c.json({ error: "unavailable" }, 503);

  const text = aspect ? `${prompt}\n\nAspect ratio: ${aspect}` : prompt;
  let res: Response;
  try {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": c.env.GEMINI_API_KEY },
      body: JSON.stringify({ contents: [{ parts: [{ text }] }], generationConfig: { responseModalities: ["IMAGE"] } }),
      signal: AbortSignal.timeout(55_000),
    });
  } catch {
    return c.json({ error: "unavailable" }, 502);
  }
  if (!res.ok) return c.json({ error: "unavailable" }, 502);

  const json = (await res.json().catch(() => null)) as { candidates?: { content?: { parts?: { inlineData?: { mimeType?: string; data?: string } }[] } }[] } | null;
  const part = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  const mime = part?.inlineData?.mimeType;
  const data = part?.inlineData?.data;
  if (!data || !mime || !/^image\/(png|jpeg|webp)$/.test(mime) || data.length > 8_000_000) return c.json({ error: "blocked" }, 422);
  return c.json({ image: `data:${mime};base64,${data}` });
});

app.notFound((c) => c.json({ error: "not_found" }, 404));
app.onError((_, c) => c.json({ error: "internal" }, 500));

export default app;
