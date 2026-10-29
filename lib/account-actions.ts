"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { api, clearSession, getToken } from "./session";
import type { FormState } from "./auth-actions";

// Every action re-checks the session on the server and the API validates again. Nothing here trusts the browser.
const loc = z.enum(["ar", "en"]).catch("ar");
const email = z.string().trim().toLowerCase().email().max(254);
const strong = z.string().min(10).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/);
const flatten = (err: z.ZodError) => { const o: Record<string, string> = {}; for (const i of err.issues) o[String(i.path[0])] ??= "invalid"; return o; };

async function authed<T>(locale: string, fn: (token: string) => Promise<T>): Promise<T> {
  const token = await getToken();
  if (!token) redirect(`/${locale}/login`);
  return fn(token);
}
const fail = (r: { status: number; data: { error?: string; fields?: Record<string, string> } }): FormState => {
  if (r.status === 401) return { ok: false, message: "session" };
  if (r.status === 429) return { ok: false, message: "rate_limited" };
  if (r.data.fields) return { ok: false, errors: Object.fromEntries(Object.entries(r.data.fields).map(([k, v]) => [k, v === "wrong" ? "wrong" : "invalid"])) };
  return { ok: false, message: r.data.error ?? "unavailable" };
};
const raw = (f: FormData) => Object.fromEntries(f);

export async function updateProfileAction(_: FormState, form: FormData): Promise<FormState> {
  const r = z.object({ name: z.string().trim().min(1).max(60), locale: loc, marketing: z.string().optional() }).safeParse(raw(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  return authed(r.data.locale, async (token) => {
    const res = await api("/me", { method: "PATCH", token, body: { name: r.data.name, locale: r.data.locale, marketing: r.data.marketing === "on" } });
    if (!res.ok) return fail(res);
    revalidatePath("/", "layout");
    return { ok: true, message: "saved" };
  });
}

export async function changeEmailAction(_: FormState, form: FormData): Promise<FormState> {
  const r = z.object({ newEmail: email, password: z.string().min(1).max(128), locale: loc }).safeParse(raw(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  return authed(r.data.locale, async (token) => {
    const res = await api("/me/email", { token, body: { newEmail: r.data.newEmail, password: r.data.password } });
    return res.ok ? { ok: true, message: "email_pending" } : fail(res);
  });
}

export async function changePasswordAction(_: FormState, form: FormData): Promise<FormState> {
  const r = z.object({ current: z.string().min(1).max(128), next: strong, confirm: z.string().max(128), locale: loc }).refine((v) => v.next === v.confirm, { path: ["confirm"] }).safeParse(raw(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  return authed(r.data.locale, async (token) => {
    const res = await api("/me/password", { token, body: { current: r.data.current, next: r.data.next } });
    return res.ok ? { ok: true, message: "password_changed" } : fail(res);
  });
}

export async function revokeSessionAction(form: FormData) {
  const r = z.object({ id: z.string().regex(/^[0-9a-f]{16}$/), locale: loc }).safeParse(raw(form));
  if (!r.success) return;
  await authed(r.data.locale, (token) => api(`/me/sessions/${r.data.id}`, { method: "DELETE", token }));
  revalidatePath("/", "layout");
}
export async function revokeOthersAction(form: FormData) {
  const locale = loc.parse(form.get("locale"));
  await authed(locale, (token) => api("/me/sessions/revoke-others", { method: "POST", token, body: {} }));
  revalidatePath("/", "layout");
}

export async function membershipAction(form: FormData) {
  const r = z.object({ op: z.enum(["cancel", "resume"]), locale: loc }).safeParse(raw(form));
  if (!r.success) return;
  await authed(r.data.locale, (token) => api(`/me/membership/${r.data.op}`, { method: "POST", token, body: {} }));
  revalidatePath("/", "layout");
}

export async function deleteAccountAction(_: FormState, form: FormData): Promise<FormState> {
  const r = z.object({ confirm: z.string().max(20), password: z.string().max(128).optional(), email: z.string().max(254).optional(), locale: loc }).safeParse(raw(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  const out = await authed(r.data.locale, async (token) => {
    const res = await api("/me/delete", { token, body: { confirm: r.data.confirm, password: r.data.password, email: r.data.email } });
    return res.ok ? null : fail(res);
  });
  if (out) return out;
  await clearSession();
  redirect(`/${r.data.locale}?deleted=1`);
}
