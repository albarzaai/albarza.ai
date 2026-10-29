"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { api, clearSession, getToken, safeNext, setSession } from "./session";

export type FormState = { ok: boolean; errors?: Record<string, string>; message?: string } | null;

// The first gate. The API Worker validates everything again with the same rules before touching the database.
const email = z.string().trim().toLowerCase().email().max(254);
const strong = z.string().min(10).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/);
const loc = z.enum(["ar", "en"]).catch("ar");
const loginSchema = z.object({ email, password: z.string().min(1).max(128), locale: loc });
const signupSchema = z.object({ name: z.string().trim().min(1).max(60), email, password: strong, agree: z.literal("on"), marketing: z.string().optional(), locale: loc });
const forgotSchema = z.object({ email, locale: loc });
const resetSchema = z.object({ token: z.string().regex(/^[A-Za-z0-9_-]{32,64}$/), password: strong, confirm: z.string().max(128), locale: loc }).refine((v) => v.password === v.confirm, { path: ["confirm"] });
const contactSchema = z.object({ name: z.string().trim().min(2).max(80), email, subject: z.string().trim().min(2).max(120), message: z.string().trim().min(10).max(2000) });

const flatten = (err: z.ZodError) => { const o: Record<string, string> = {}; for (const i of err.issues) o[String(i.path[0])] ??= "invalid"; return o; };
const apiErrors = (d: { error?: string; fields?: Record<string, string>; retryAfter?: number }): FormState =>
  d.error === "rate_limited" ? { ok: false, message: "rate_limited" }
  : d.error === "locked" ? { ok: false, message: "locked" }
  : d.error === "bad_credentials" ? { ok: false, message: "bad_credentials" }
  : d.error === "unverified" ? { ok: false, message: "unverified" }
  : d.error === "unavailable" ? { ok: false, message: "unavailable" }
  : d.fields ? { ok: false, errors: Object.fromEntries(Object.keys(d.fields).map((k) => [k, "invalid"])), message: d.fields.form }
  : { ok: false, message: "unavailable" };
const raw = (form: FormData) => Object.fromEntries(form);

export async function loginAction(_: FormState, form: FormData): Promise<FormState> {
  const r = loginSchema.safeParse(raw(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  const res = await api<{ sessionToken?: string; expiresAt?: number }>("/auth/login", { body: { email: r.data.email, password: r.data.password, captcha: form.get("cf-turnstile-response") ?? undefined } });
  if (!res.ok || !res.data.sessionToken) return apiErrors(res.data);
  await setSession(res.data.sessionToken, res.data.expiresAt!);
  redirect(safeNext(form.get("next"), r.data.locale));
}

export async function signupAction(_: FormState, form: FormData): Promise<FormState> {
  const r = signupSchema.safeParse(raw(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  const res = await api<{ verify?: boolean; sessionToken?: string; expiresAt?: number }>("/auth/signup", { body: { name: r.data.name, email: r.data.email, password: r.data.password, locale: r.data.locale, marketing: r.data.marketing === "on", captcha: form.get("cf-turnstile-response") ?? undefined } });
  if (!res.ok) return apiErrors(res.data);
  if (res.data.sessionToken) { await setSession(res.data.sessionToken, res.data.expiresAt!); redirect(`/${r.data.locale}/app/welcome`); }
  redirect(`/${r.data.locale}/verify-email`);
}

export async function forgotAction(_: FormState, form: FormData): Promise<FormState> {
  const r = forgotSchema.safeParse(raw(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  const res = await api("/auth/forgot", { body: { email: r.data.email, locale: r.data.locale, captcha: form.get("cf-turnstile-response") ?? undefined } });
  if (res.status === 429) return { ok: false, message: "rate_limited" };
  return { ok: true, message: "link-sent" }; // same answer whether or not the account exists
}

export async function resetAction(_: FormState, form: FormData): Promise<FormState> {
  const r = resetSchema.safeParse(raw(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  const res = await api("/auth/reset", { body: { token: r.data.token, password: r.data.password } });
  if (!res.ok) return res.data.error === "invalid_token" ? { ok: false, message: "invalid_token" } : apiErrors(res.data);
  redirect(`/${r.data.locale}/login?reset=1`);
}

export async function logoutAction(form: FormData) {
  const token = await getToken();
  if (token) await api("/me/logout", { method: "POST", token, body: {} });
  await clearSession();
  redirect(`/${loc.parse(form.get("locale"))}/login`);
}

export async function resendAction(): Promise<FormState> { return { ok: true, message: "resent" }; }
export async function contactAction(_: FormState, form: FormData): Promise<FormState> {
  const r = contactSchema.safeParse(raw(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  return { ok: true, message: "sent" };
}

// Email links open a page with a confirm button, so mail scanners that pre-open links cannot use up the one-time token.
const tokenSchema = z.object({ token: z.string().regex(/^[A-Za-z0-9_-]{32,64}$/), locale: loc });
export async function verifyEmailAction(_: FormState, form: FormData): Promise<FormState> {
  const r = tokenSchema.safeParse(raw(form));
  if (!r.success) return { ok: false, message: "invalid_token" };
  const res = await api<{ sessionToken?: string; expiresAt?: number }>("/auth/verify-email", { body: { token: r.data.token } });
  if (!res.ok || !res.data.sessionToken) return { ok: false, message: res.status === 429 ? "rate_limited" : "invalid_token" };
  await setSession(res.data.sessionToken, res.data.expiresAt!);
  redirect(`/${r.data.locale}/app/welcome`);
}
export async function confirmEmailAction(_: FormState, form: FormData): Promise<FormState> {
  const r = tokenSchema.safeParse(raw(form));
  if (!r.success) return { ok: false, message: "invalid_token" };
  const res = await api("/auth/confirm-email", { body: { token: r.data.token } });
  if (!res.ok) return { ok: false, message: res.status === 429 ? "rate_limited" : "invalid_token" };
  redirect(`/${r.data.locale}/app/account?emailChanged=1`);
}
