import { Hono, type Context } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { ZodType } from "zod";
import { hashPassword, randomToken, safeEqual, sha256, verifyPassword } from "./lib/crypto";
import * as v from "./lib/validate";
import { sendEmail, tpl } from "./lib/email";

type Limiter = { limit(o: { key: string }): Promise<{ success: boolean }> };
export type Env = {
  DB?: D1Database;
  AUTH_LIMIT: Limiter;
  EMAIL_LIMIT: Limiter;
  INTERNAL_AUTH_SECRET?: string;
  HASH_PEPPER?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  TURNSTILE_SECRET?: string;
  SITE_URL: string;
  PBKDF2_ITERATIONS?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
};
type C = Context<{ Bindings: Env; Variables: { uid?: string; sid?: string } }>;

const DAY = 86_400_000;
const SESSION_TTL = 30 * DAY;
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60_000;
// Workers' WebCrypto refuses PBKDF2 above 100,000 iterations (it throws, so sign-up and login would fail), so that is the ceiling.
const ITER = (c: C) => Math.min(Number(c.env.PBKDF2_ITERATIONS) || 100_000, 100_000);

export const auth = new Hono<{ Bindings: Env; Variables: { uid?: string; sid?: string } }>();

// Only the albarza.ai frontend (over the private service binding, holding the shared secret) may call these routes.
auth.use("*", async (c, next) => {
  const want = c.env.INTERNAL_AUTH_SECRET, got = c.req.header("x-internal-auth");
  if (!want || !got || !(await safeEqual(want, got))) return c.json({ error: "unauthorized" }, 401);
  if (!c.env.DB) return c.json({ error: "unavailable" }, 503); // database binding missing: fail closed
  await next();
});
auth.use("*", bodyLimit({ maxSize: 256 * 1024, onError: (c) => c.json({ error: "too_large" }, 413) }));

const ip = (c: C) => c.req.header("x-client-ip") ?? "unknown";
const ua = (c: C) => (c.req.header("x-client-ua") ?? "").slice(0, 200);
const bad = (c: C, fields: Record<string, string>, status: 400 | 401 | 403 | 409 | 423 = 400) => c.json({ error: "invalid", fields }, status);

async function body<T>(c: C, schema: ZodType<T>) {
  if (!c.req.header("content-type")?.startsWith("application/json")) return { error: c.json({ error: "unsupported_media_type" }, 415) } as const;
  const parsed = schema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return { error: bad(c, v.fieldErrors(parsed.error)) } as const;
  return { data: parsed.data } as const;
}
async function limited(c: C, key?: string) {
  if (!(await c.env.AUTH_LIMIT.limit({ key: ip(c) })).success) return true;
  if (key && !(await c.env.EMAIL_LIMIT.limit({ key })).success) return true;
  return false;
}
async function captchaOk(c: C, tokenValue?: string, emailAddr?: string) {
  const secret = c.env.TURNSTILE_SECRET;
  if (!secret) return true; // not configured yet
  if (!tokenValue) return false;
  // Live end-to-end check (CI): a token only the holder of the internal secret can compute, accepted only for its own throwaway addresses.
  if (tokenValue.startsWith("ci-") && emailAddr && /^ci-live-[a-z0-9-]{4,40}@example\.com$/.test(emailAddr) && c.env.INTERNAL_AUTH_SECRET && (await safeEqual(tokenValue, "ci-" + (await sha256(`ci-captcha:${c.env.INTERNAL_AUTH_SECRET}`))))) return true;
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: new URLSearchParams({ secret, response: tokenValue, remoteip: ip(c) }), signal: AbortSignal.timeout(8000) }).catch(() => null);
  const j = (await r?.json().catch(() => null)) as { success?: boolean } | null;
  return !!j?.success;
}
const audit = async (c: C, userId: string, event: string) => {
  const uh = (await sha256(`${c.env.HASH_PEPPER}:${userId}`)).slice(0, 24);
  const ih = (await sha256(`${c.env.HASH_PEPPER}:${ip(c)}`)).slice(0, 16);
  await c.env.DB!.prepare("INSERT INTO audit (user_hash,event,ip_hash,created_at) VALUES (?,?,?,?)").bind(uh, event, ih, Date.now()).run();
};

async function createSession(c: C, userId: string) {
  const raw = randomToken(32), now = Date.now();
  await c.env.DB!.batch([
    c.env.DB!.prepare("INSERT INTO sessions (id,user_id,created_at,last_seen,expires_at,ip_hash,user_agent) VALUES (?,?,?,?,?,?,?)").bind(await sha256(raw), userId, now, now, now + SESSION_TTL, (await sha256(`${c.env.HASH_PEPPER}:${ip(c)}`)).slice(0, 16), ua(c)),
    c.env.DB!.prepare("DELETE FROM sessions WHERE user_id=? AND id NOT IN (SELECT id FROM sessions WHERE user_id=? ORDER BY last_seen DESC LIMIT 10)").bind(userId, userId),
  ]);
  return { sessionToken: raw, expiresAt: now + SESSION_TTL };
}
async function issueToken(c: C, userId: string, kind: string, ttlMs: number, payload?: string) {
  const raw = randomToken(32);
  await c.env.DB!.batch([
    c.env.DB!.prepare("DELETE FROM tokens WHERE user_id=? AND kind=?").bind(userId, kind),
    c.env.DB!.prepare("INSERT INTO tokens (id,user_id,kind,payload,expires_at) VALUES (?,?,?,?,?)").bind(await sha256(raw), userId, kind, payload ?? null, Date.now() + ttlMs),
  ]);
  return raw;
}
async function useToken(c: C, raw: string, kind: string) {
  return c.env.DB!.prepare("UPDATE tokens SET used_at=? WHERE id=? AND kind=? AND used_at IS NULL AND expires_at>? RETURNING user_id, payload").bind(Date.now(), await sha256(raw), kind, Date.now()).first<{ user_id: string; payload: string | null }>();
}
const link = (c: C, path: string, t: string, locale: string) => `${c.env.SITE_URL}/${locale}${path}?token=${t}`;
const publicUser = (u: Record<string, unknown>) => ({ id: u.id, email: u.email, emailVerified: !!u.email_verified, name: u.name, locale: u.locale, marketing: !!u.marketing_opt_in, role: u.role === "admin" ? "admin" : "user", plan: u.plan, planCancelAtPeriodEnd: !!u.plan_cancel_at_period_end, planPeriodEnd: u.plan_period_end, credits: u.credits, hasPassword: !!u.password_hash, createdAt: u.created_at });

// ---------- public flows ----------
auth.post("/auth/signup", async (c) => {
  const b = await body(c, v.signup); if ("error" in b) return b.error;
  const d = b.data;
  if (await limited(c, d.email)) return c.json({ error: "rate_limited" }, 429);
  if (!(await captchaOk(c, d.captcha, d.email))) return bad(c, { form: "captcha" });
  const exists = await c.env.DB!.prepare("SELECT id, email_verified FROM users WHERE email=?").bind(d.email).first<{ id: string; email_verified: number }>();
  const id = crypto.randomUUID(), now = Date.now();
  const hash = await hashPassword(d.password, ITER(c));
  if (exists) {
    // Same response as a fresh sign-up so the form cannot be used to discover registered emails.
    // An account that never confirmed gets a fresh link (at most one a minute), so retrying the sign-up also works.
    if (c.env.RESEND_API_KEY && !exists.email_verified && !(await c.env.DB!.prepare("SELECT 1 FROM tokens WHERE user_id=? AND kind='verify_email' AND expires_at>?").bind(exists.id, Date.now() + DAY - 60_000).first())) {
      await sendEmail(c.env, d.email, ...tpl("verify", d.locale, link(c, "/verify-email", await issueToken(c, exists.id, "verify_email", DAY), d.locale)));
    }
    return c.json({ ok: true, verify: !!c.env.RESEND_API_KEY });
  }
  await c.env.DB!.prepare("INSERT INTO users (id,email,password_hash,name,locale,marketing_opt_in,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)").bind(id, d.email, hash, d.name, d.locale, d.marketing ? 1 : 0, now, now).run();
  await audit(c, id, "signup");
  if (c.env.RESEND_API_KEY) {
    const t = await issueToken(c, id, "verify_email", DAY);
    await sendEmail(c.env, d.email, ...tpl("verify", d.locale, link(c, "/verify-email", t, d.locale)));
    return c.json({ ok: true, verify: true });
  }
  // Email is not configured yet: sign the user straight in (they can verify later).
  return c.json({ ok: true, verify: false, ...(await createSession(c, id)) });
});

// Sends the confirmation link again. Same answer whether or not the address exists; at most one new link a minute per account.
auth.post("/auth/resend-verification", async (c) => {
  const b = await body(c, v.forgot); if ("error" in b) return b.error;
  const d = b.data;
  if (await limited(c, d.email)) return c.json({ error: "rate_limited" }, 429);
  if (c.env.RESEND_API_KEY) {
    const u = await c.env.DB!.prepare("SELECT id, email_verified FROM users WHERE email=?").bind(d.email).first<{ id: string; email_verified: number }>();
    if (u && !u.email_verified) {
      const recent = await c.env.DB!.prepare("SELECT 1 FROM tokens WHERE user_id=? AND kind='verify_email' AND expires_at>?").bind(u.id, Date.now() + DAY - 60_000).first();
      if (!recent) {
        const t = await issueToken(c, u.id, "verify_email", DAY);
        await sendEmail(c.env, d.email, ...tpl("verify", d.locale, link(c, "/verify-email", t, d.locale)));
      }
    }
  }
  return c.json({ ok: true });
});

// Whether this address has confirmed. The site only asks about the address kept in the visitor's own HttpOnly cookie from sign-up.
auth.post("/auth/verification-status", async (c) => {
  const b = await body(c, v.forgot); if ("error" in b) return b.error;
  const u = await c.env.DB!.prepare("SELECT email_verified FROM users WHERE email=?").bind(b.data.email).first<{ email_verified: number }>();
  return c.json({ verified: !!u?.email_verified });
});

auth.post("/auth/login", async (c) => {
  const b = await body(c, v.login); if ("error" in b) return b.error;
  const d = b.data;
  if (await limited(c, d.email)) return c.json({ error: "rate_limited" }, 429);
  if (!(await captchaOk(c, d.captcha, d.email))) return bad(c, { form: "captcha" });
  const u = await c.env.DB!.prepare("SELECT * FROM users WHERE email=?").bind(d.email).first<Record<string, unknown>>();
  const now = Date.now();
  if (u && Number(u.locked_until) > now) { await verifyPassword(d.password, null); return c.json({ error: "locked", retryAfter: Math.ceil((Number(u.locked_until) - now) / 1000) }, 423); }
  const ok = await verifyPassword(d.password, (u?.password_hash as string | null) ?? null);
  if (!u || !ok) {
    if (u) {
      const fails = Number(u.failed_logins) + 1;
      await c.env.DB!.prepare("UPDATE users SET failed_logins=?, locked_until=? WHERE id=?").bind(fails >= MAX_FAILS ? 0 : fails, fails >= MAX_FAILS ? now + LOCK_MS : 0, u.id).run();
      await audit(c, String(u.id), "login_failed");
    }
    return c.json({ error: "bad_credentials" }, 401); // identical for unknown email and wrong password
  }
  if (c.env.RESEND_API_KEY && !u.email_verified) return c.json({ error: "unverified" }, 403);
  await c.env.DB!.prepare("UPDATE users SET failed_logins=0, locked_until=0 WHERE id=?").bind(u.id).run();
  // Hashes made with fewer rounds are upgraded the next time their owner signs in.
  if (Number(String(u.password_hash).split("$")[1]) < ITER(c)) await c.env.DB!.prepare("UPDATE users SET password_hash=? WHERE id=?").bind(await hashPassword(d.password, ITER(c)), u.id).run();
  await audit(c, String(u.id), "login");
  return c.json({ ok: true, ...(await createSession(c, String(u.id))), user: publicUser(u) });
});

auth.post("/auth/verify-email", async (c) => {
  const b = await body(c, v.tokenOnly); if ("error" in b) return b.error;
  if (await limited(c)) return c.json({ error: "rate_limited" }, 429);
  const t = await useToken(c, b.data.token, "verify_email");
  if (!t) return c.json({ error: "invalid_token" }, 400);
  await c.env.DB!.prepare("UPDATE users SET email_verified=1, updated_at=? WHERE id=?").bind(Date.now(), t.user_id).run();
  await audit(c, t.user_id, "email_verified");
  return c.json({ ok: true, ...(await createSession(c, t.user_id)) });
});

auth.post("/auth/forgot", async (c) => {
  const b = await body(c, v.forgot); if ("error" in b) return b.error;
  if (await limited(c, b.data.email)) return c.json({ error: "rate_limited" }, 429);
  if (!(await captchaOk(c, b.data.captcha, b.data.email))) return bad(c, { form: "captcha" });
  const u = await c.env.DB!.prepare("SELECT id, locale FROM users WHERE email=?").bind(b.data.email).first<{ id: string; locale: string }>();
  if (u && c.env.RESEND_API_KEY) {
    const t = await issueToken(c, u.id, "reset_password", 60 * 60_000);
    await sendEmail(c.env, b.data.email, ...tpl("reset", u.locale, link(c, "/reset-password", t, u.locale)));
  }
  return c.json({ ok: true }); // same answer whether or not the account exists
});

auth.post("/auth/reset", async (c) => {
  const b = await body(c, v.reset); if ("error" in b) return b.error;
  if (await limited(c)) return c.json({ error: "rate_limited" }, 429);
  const t = await useToken(c, b.data.token, "reset_password");
  if (!t) return c.json({ error: "invalid_token" }, 400);
  await c.env.DB!.batch([
    c.env.DB!.prepare("UPDATE users SET password_hash=?, failed_logins=0, locked_until=0, email_verified=1, updated_at=? WHERE id=?").bind(await hashPassword(b.data.password, ITER(c)), Date.now(), t.user_id),
    c.env.DB!.prepare("DELETE FROM sessions WHERE user_id=?").bind(t.user_id),
  ]);
  await audit(c, t.user_id, "password_reset");
  return c.json({ ok: true });
});

auth.post("/auth/confirm-email", async (c) => {
  const b = await body(c, v.tokenOnly); if ("error" in b) return b.error;
  if (await limited(c)) return c.json({ error: "rate_limited" }, 429);
  const t = await useToken(c, b.data.token, "change_email");
  if (!t?.payload) return c.json({ error: "invalid_token" }, 400);
  const taken = await c.env.DB!.prepare("SELECT id FROM users WHERE email=? AND id<>?").bind(t.payload, t.user_id).first();
  if (taken) return c.json({ error: "email_taken" }, 409);
  await c.env.DB!.prepare("UPDATE users SET email=?, email_verified=1, updated_at=? WHERE id=?").bind(t.payload, Date.now(), t.user_id).run();
  await audit(c, t.user_id, "email_changed");
  return c.json({ ok: true });
});


// ---------- Google sign-in (authorisation code flow with PKCE and a browser-bound state) ----------
const b64u = (b: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const redirectUri = (c: C) => `${c.env.SITE_URL}/api/auth/google/callback`;

auth.get("/auth/google/status", (c) => c.json({ enabled: !!(c.env.GOOGLE_CLIENT_ID && c.env.GOOGLE_CLIENT_SECRET) }));

auth.post("/auth/google/start", async (c) => {
  if (!c.env.GOOGLE_CLIENT_ID || !c.env.GOOGLE_CLIENT_SECRET) return c.json({ error: "unavailable" }, 503);
  const b = await body(c, v.googleStart); if ("error" in b) return b.error;
  if (await limited(c)) return c.json({ error: "rate_limited" }, 429);
  const state = randomToken(32), verifier = randomToken(48);
  const challenge = b64u(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
  await c.env.DB!.batch([
    c.env.DB!.prepare("DELETE FROM oauth_state WHERE expires_at<?").bind(Date.now()),
    c.env.DB!.prepare("INSERT INTO oauth_state (id,verifier,next,locale,expires_at) VALUES (?,?,?,?,?)").bind(await sha256(state), verifier, b.data.next, b.data.locale, Date.now() + 10 * 60_000),
  ]);
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({ client_id: c.env.GOOGLE_CLIENT_ID, redirect_uri: redirectUri(c), response_type: "code", scope: "openid email profile", state, code_challenge: challenge, code_challenge_method: "S256", prompt: "select_account", hl: b.data.locale }).toString();
  return c.json({ url: url.toString(), state });
});

auth.post("/auth/google/callback", async (c) => {
  if (!c.env.GOOGLE_CLIENT_ID || !c.env.GOOGLE_CLIENT_SECRET) return c.json({ error: "unavailable" }, 503);
  const b = await body(c, v.googleCallback); if ("error" in b) return b.error;
  if (await limited(c)) return c.json({ error: "rate_limited" }, 429);
  // The state in the URL must equal the one stored in this browser's cookie, and must exist, unused and unexpired.
  if (!(await safeEqual(b.data.state, b.data.stateCookie))) return c.json({ error: "invalid_state" }, 400);
  const st = await c.env.DB!.prepare("DELETE FROM oauth_state WHERE id=? AND expires_at>? RETURNING verifier, next, locale").bind(await sha256(b.data.state), Date.now()).first<{ verifier: string; next: string; locale: string }>();
  if (!st) return c.json({ error: "invalid_state" }, 400);
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body: new URLSearchParams({ code: b.data.code, client_id: c.env.GOOGLE_CLIENT_ID, client_secret: c.env.GOOGLE_CLIENT_SECRET, redirect_uri: redirectUri(c), grant_type: "authorization_code", code_verifier: st.verifier }), signal: AbortSignal.timeout(10_000) }).catch(() => null);
  const tok = (await tokenRes?.json().catch(() => null)) as { access_token?: string } | null;
  if (!tokenRes?.ok || !tok?.access_token) return c.json({ error: "oauth_failed" }, 400);
  const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { authorization: `Bearer ${tok.access_token}` }, signal: AbortSignal.timeout(10_000) }).catch(() => null);
  const info = (await infoRes?.json().catch(() => null)) as { sub?: string; email?: string; email_verified?: boolean; name?: string } | null;
  const em = v.email.safeParse(info?.email);
  if (!infoRes?.ok || !info?.sub || !em.success || info.email_verified !== true) return c.json({ error: "oauth_unverified" }, 403);
  const now = Date.now();
  let userId = (await c.env.DB!.prepare("SELECT user_id FROM oauth_accounts WHERE provider='google' AND provider_id=?").bind(info.sub).first<{ user_id: string }>())?.user_id;
  if (!userId) {
    const existing = await c.env.DB!.prepare("SELECT id, email_verified FROM users WHERE email=?").bind(em.data).first<{ id: string; email_verified: number }>();
    if (existing) {
      userId = existing.id;
      // A pre-registered but never-verified account may belong to an attacker: wipe its password and sessions before linking.
      if (!existing.email_verified) await c.env.DB!.batch([c.env.DB!.prepare("UPDATE users SET password_hash=NULL, email_verified=1, updated_at=? WHERE id=?").bind(now, userId), c.env.DB!.prepare("DELETE FROM sessions WHERE user_id=?").bind(userId)]);
    } else {
      userId = crypto.randomUUID();
      const nm = v.name.safeParse((info.name ?? "").replace(/[<>{}\[\]\\]/g, "").slice(0, 60));
      await c.env.DB!.prepare("INSERT INTO users (id,email,email_verified,password_hash,name,locale,created_at,updated_at) VALUES (?,?,1,NULL,?,?,?,?)").bind(userId, em.data, nm.success ? nm.data : em.data.split("@")[0], st.locale, now, now).run();
    }
    await c.env.DB!.prepare("INSERT OR IGNORE INTO oauth_accounts (provider,provider_id,user_id,created_at) VALUES ('google',?,?,?)").bind(info.sub, userId, now).run();
  }
  await audit(c, userId, "login_google");
  return c.json({ ok: true, next: st.next, locale: st.locale, ...(await createSession(c, userId)) });
});

// ---------- signed-in routes: Authorization: Bearer <session token> ----------
const session = async (c: C, next: () => Promise<void>) => {
  const m = /^Bearer ([A-Za-z0-9_-]{32,64})$/.exec(c.req.header("authorization") ?? "");
  if (!m) return c.json({ error: "unauthenticated" }, 401);
  const sid = await sha256(m[1]);
  const row = await c.env.DB!.prepare("SELECT user_id, last_seen FROM sessions WHERE id=? AND expires_at>?").bind(sid, Date.now()).first<{ user_id: string; last_seen: number }>();
  if (!row) return c.json({ error: "unauthenticated" }, 401);
  if (Date.now() - row.last_seen > 10 * 60_000) await c.env.DB!.prepare("UPDATE sessions SET last_seen=? WHERE id=?").bind(Date.now(), sid).run();
  c.set("uid", row.user_id); c.set("sid", sid);
  await next();
};
const me = new Hono<{ Bindings: Env; Variables: { uid?: string; sid?: string } }>();
me.use("*", session as never);
const getUser = (c: C) => c.env.DB!.prepare("SELECT * FROM users WHERE id=?").bind(c.get("uid")).first<Record<string, unknown>>();

me.get("/", async (c) => { const u = await getUser(c); return u ? c.json({ user: publicUser(u) }) : c.json({ error: "unauthenticated" }, 401); });

me.patch("/", async (c) => {
  const b = await body(c, v.profile); if ("error" in b) return b.error;
  const d = b.data;
  await c.env.DB!.prepare("UPDATE users SET name=COALESCE(?,name), locale=COALESCE(?,locale), marketing_opt_in=COALESCE(?,marketing_opt_in), updated_at=? WHERE id=?").bind(d.name ?? null, d.locale ?? null, d.marketing === undefined ? null : d.marketing ? 1 : 0, Date.now(), c.get("uid")).run();
  return c.json({ ok: true, user: publicUser((await getUser(c))!) });
});

me.post("/email", async (c) => {
  const b = await body(c, v.changeEmail); if ("error" in b) return b.error;
  if (await limited(c, `chg:${c.get("uid")}`)) return c.json({ error: "rate_limited" }, 429);
  const u = (await getUser(c))!;
  if (!(await verifyPassword(b.data.password, (u.password_hash as string | null) ?? null))) return bad(c, { password: "wrong" }, 403);
  const taken = await c.env.DB!.prepare("SELECT id FROM users WHERE email=?").bind(b.data.newEmail).first();
  if (!taken && c.env.RESEND_API_KEY) {
    const t = await issueToken(c, String(u.id), "change_email", DAY, b.data.newEmail);
    await sendEmail(c.env, b.data.newEmail, ...tpl("change", String(u.locale), link(c, "/confirm-email", t, String(u.locale))));
  }
  await audit(c, String(u.id), "email_change_requested");
  return c.json({ ok: true, pending: !!c.env.RESEND_API_KEY }); // never reveals whether the address is already used
});

me.post("/password", async (c) => {
  const b = await body(c, v.changePassword); if ("error" in b) return b.error;
  if (await limited(c, `pw:${c.get("uid")}`)) return c.json({ error: "rate_limited" }, 429);
  const u = (await getUser(c))!;
  if (!(await verifyPassword(b.data.current, (u.password_hash as string | null) ?? null))) return bad(c, { current: "wrong" }, 403);
  await c.env.DB!.batch([
    c.env.DB!.prepare("UPDATE users SET password_hash=?, updated_at=? WHERE id=?").bind(await hashPassword(b.data.next, ITER(c)), Date.now(), u.id),
    c.env.DB!.prepare("DELETE FROM sessions WHERE user_id=? AND id<>?").bind(u.id, c.get("sid")),
  ]);
  await audit(c, String(u.id), "password_changed");
  return c.json({ ok: true });
});

me.get("/sessions", async (c) => {
  const rows = await c.env.DB!.prepare("SELECT id, created_at, last_seen, user_agent FROM sessions WHERE user_id=? AND expires_at>? ORDER BY last_seen DESC").bind(c.get("uid"), Date.now()).all<{ id: string; created_at: number; last_seen: number; user_agent: string }>();
  return c.json({ sessions: rows.results.map((r) => ({ id: r.id.slice(0, 16), current: r.id === c.get("sid"), createdAt: r.created_at, lastSeen: r.last_seen, device: r.user_agent })) });
});
me.delete("/sessions/:id", async (c) => {
  const short = c.req.param("id");
  if (!/^[0-9a-f]{16}$/.test(short)) return c.json({ error: "invalid" }, 400);
  await c.env.DB!.prepare("DELETE FROM sessions WHERE user_id=? AND substr(id,1,16)=? AND id<>?").bind(c.get("uid"), short, c.get("sid")).run();
  return c.json({ ok: true });
});
me.post("/sessions/revoke-others", async (c) => {
  await c.env.DB!.prepare("DELETE FROM sessions WHERE user_id=? AND id<>?").bind(c.get("uid"), c.get("sid")).run();
  return c.json({ ok: true });
});
me.post("/logout", async (c) => { await c.env.DB!.prepare("DELETE FROM sessions WHERE id=?").bind(c.get("sid")).run(); return c.json({ ok: true }); });

me.get("/export", async (c) => {
  const u = (await getUser(c))!;
  const [projects, sessions] = await Promise.all([
    c.env.DB!.prepare("SELECT id,title,data,created_at,updated_at FROM projects WHERE user_id=?").bind(u.id).all(),
    c.env.DB!.prepare("SELECT created_at,last_seen,user_agent FROM sessions WHERE user_id=?").bind(u.id).all(),
  ]);
  return c.json({ exportedAt: new Date().toISOString(), account: publicUser(u), projects: projects.results, sessions: sessions.results });
});

me.post("/membership/cancel", async (c) => {
  const u = (await getUser(c))!;
  if (u.plan === "starter") return c.json({ error: "no_paid_plan" }, 409);
  await c.env.DB!.prepare("UPDATE users SET plan_cancel_at_period_end=1, updated_at=? WHERE id=?").bind(Date.now(), u.id).run();
  await audit(c, String(u.id), "membership_cancel");
  return c.json({ ok: true });
});
me.post("/membership/resume", async (c) => {
  await c.env.DB!.prepare("UPDATE users SET plan_cancel_at_period_end=0, updated_at=? WHERE id=?").bind(Date.now(), c.get("uid")).run();
  return c.json({ ok: true });
});

me.post("/delete", async (c) => {
  const b = await body(c, v.deleteAccount); if ("error" in b) return b.error;
  if (await limited(c, `del:${c.get("uid")}`)) return c.json({ error: "rate_limited" }, 429);
  const u = (await getUser(c))!;
  if (b.data.confirm !== "DELETE") return bad(c, { confirm: "confirm" });
  if (u.password_hash) {
    if (!(await verifyPassword(b.data.password ?? "", u.password_hash as string))) return bad(c, { password: "wrong" }, 403);
  } else if ((b.data.email ?? "").trim().toLowerCase() !== u.email) return bad(c, { email: "wrong" }, 403);
  await audit(c, String(u.id), "account_deleted");
  await c.env.DB!.batch([ // cascades remove sessions, tokens, oauth links and projects
    c.env.DB!.prepare("DELETE FROM users WHERE id=?").bind(u.id),
  ]);
  return c.json({ ok: true });
});

// Cloud copies of projects (the editor still works offline from the browser).
me.get("/projects", async (c) => c.json({ projects: (await c.env.DB!.prepare("SELECT id,title,updated_at FROM projects WHERE user_id=? ORDER BY updated_at DESC LIMIT 200").bind(c.get("uid")).all()).results }));
me.put("/projects", async (c) => {
  const b = await body(c, v.projectSave); if ("error" in b) return b.error;
  const n = await c.env.DB!.prepare("SELECT COUNT(*) AS n FROM projects WHERE user_id=?").bind(c.get("uid")).first<{ n: number }>();
  const exists = await c.env.DB!.prepare("SELECT 1 FROM projects WHERE id=? AND user_id=?").bind(b.data.id, c.get("uid")).first();
  if (!exists && (n?.n ?? 0) >= 100) return c.json({ error: "limit" }, 409);
  await c.env.DB!.prepare("INSERT INTO projects (id,user_id,title,data,created_at,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, data=excluded.data, updated_at=excluded.updated_at WHERE user_id=?").bind(b.data.id, c.get("uid"), b.data.title, b.data.data, Date.now(), Date.now(), c.get("uid")).run();
  return c.json({ ok: true });
});

auth.route("/me", me);
