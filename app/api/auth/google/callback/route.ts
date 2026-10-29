import { NextResponse } from "next/server";
import { api, COOKIE } from "@/lib/session";

const OAUTH_COOKIE = process.env.NODE_ENV === "production" ? "__Host-albarza_oauth" : "albarza_oauth";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const stateCookie = /(?:^|;\s*)(?:__Host-)?albarza_oauth=([A-Za-z0-9_-]+)/.exec(req.headers.get("cookie") ?? "")?.[1] ?? "";
  const fail = (e: string, locale = "ar") => { const r = NextResponse.redirect(new URL(`/${locale}/login?error=${e}`, u.origin), 303); r.cookies.delete(OAUTH_COOKIE); return r; };
  const code = u.searchParams.get("code"), state = u.searchParams.get("state");
  if (u.searchParams.get("error") || !code || !state || !stateCookie) return fail("google_cancelled");
  const r = await api<{ sessionToken?: string; expiresAt?: number; next?: string; locale?: string }>("/auth/google/callback", { body: { code, state, stateCookie } });
  if (!r.ok || !r.data.sessionToken) return fail(r.data.error === "oauth_unverified" ? "google_unverified" : r.status === 429 ? "rate_limited" : "google_failed");
  const res = NextResponse.redirect(new URL(r.data.next ?? `/${r.data.locale ?? "ar"}/app`, u.origin), 303);
  res.cookies.set(COOKIE, r.data.sessionToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(r.data.expiresAt!) });
  res.cookies.delete(OAUTH_COOKIE);
  return res;
}
