import { NextResponse } from "next/server";
import { api, safeNext } from "@/lib/session";

export const OAUTH_COOKIE = process.env.NODE_ENV === "production" ? "__Host-albarza_oauth" : "albarza_oauth";

// Starts "Sign in with Google": the API creates the state and PKCE challenge; the browser keeps a matching state cookie.
export async function GET(req: Request) {
  const u = new URL(req.url);
  const locale = u.searchParams.get("locale") === "en" ? "en" : "ar";
  const back = (e: string) => NextResponse.redirect(new URL(`/${locale}/login?error=${e}`, u.origin), 303);
  const r = await api<{ url?: string; state?: string }>("/auth/google/start", { body: { next: safeNext(u.searchParams.get("next"), locale), locale } });
  if (!r.ok || !r.data.url || !r.data.state) return back(r.status === 429 ? "rate_limited" : "google_unavailable");
  const res = NextResponse.redirect(r.data.url, 303);
  res.cookies.set(OAUTH_COOKIE, r.data.state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
  return res;
}
