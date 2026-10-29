import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type Env = { API?: { fetch(url: string, init?: RequestInit): Promise<Response> }; INTERNAL_AUTH_SECRET?: string };
export type User = { id: string; email: string; emailVerified: boolean; name: string; locale: "ar" | "en"; marketing: boolean; plan: string; planCancelAtPeriodEnd: boolean; planPeriodEnd: number | null; credits: number; hasPassword: boolean; createdAt: number };
export type ApiResult<T = Record<string, unknown>> = { status: number; ok: boolean; data: T & { error?: string; fields?: Record<string, string>; retryAfter?: number } };

// The session lives in an HttpOnly, Secure, SameSite cookie: page scripts can never read it.
export const COOKIE = process.env.NODE_ENV === "production" ? "__Host-albarza_session" : "albarza_session";
export const safeNext = (n: unknown, locale: string) => (typeof n === "string" && /^\/(ar|en)\/app(\/[\w\-/]*)?$/.test(n) ? n : `/${locale}/app`);

// All account logic and validation live in the API Worker. The frontend only forwards requests over the private service binding.
export async function api<T = Record<string, unknown>>(path: string, init: { method?: string; body?: unknown; token?: string | null } = {}): Promise<ApiResult<T>> {
  const env = getCloudflareContext().env as unknown as Env;
  if (!env.API || !env.INTERNAL_AUTH_SECRET) return { status: 503, ok: false, data: { error: "unavailable" } as ApiResult<T>["data"] };
  const h = await headers();
  const res = await env.API.fetch(`https://api.albarza.ai/v1${path}`, {
    method: init.method ?? (init.body ? "POST" : "GET"),
    headers: {
      "content-type": "application/json",
      "x-internal-auth": env.INTERNAL_AUTH_SECRET,
      "x-client-ip": h.get("cf-connecting-ip") ?? "unknown",
      "x-client-ua": (h.get("user-agent") ?? "").slice(0, 200),
      ...(init.token ? { authorization: `Bearer ${init.token}` } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  }).catch(() => null);
  if (!res) return { status: 502, ok: false, data: { error: "unavailable" } as ApiResult<T>["data"] };
  const data = (await res.json().catch(() => ({}))) as ApiResult<T>["data"];
  return { status: res.status, ok: res.ok, data };
}

export const getToken = async () => (await cookies()).get(COOKIE)?.value ?? null;
export async function setSession(token: string, expiresAt: number) {
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(expiresAt) });
}
export async function clearSession() { (await cookies()).delete(COOKIE); }

// One lookup per request, shared by every server component that needs the user.
export const currentUser = cache(async (): Promise<User | null> => {
  const token = await getToken();
  if (!token) return null;
  const r = await api<{ user?: User }>("/me", { token });
  return r.ok && r.data.user ? r.data.user : null;
});
