"use server";

import { z } from "zod";

export type FormState = { ok: boolean; errors?: Record<string, string>; message?: string } | null;

const email = z.string().trim().toLowerCase().email().max(254);
const loginSchema = z.object({ email, password: z.string().min(1).max(128) });
const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email,
  password: z.string().min(10).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/),
  agree: z.literal("on"),
});

function flatten(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of err.issues) out[String(i.path[0])] ??= "invalid";
  return out;
}

// All validation is server-side. Persistence/session logic is wired later via the Hono API.
export async function loginAction(_: FormState, form: FormData): Promise<FormState> {
  const r = loginSchema.safeParse(Object.fromEntries(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  return { ok: false, message: "backend-not-connected" };
}

export async function signupAction(_: FormState, form: FormData): Promise<FormState> {
  const r = signupSchema.safeParse(Object.fromEntries(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  return { ok: false, message: "backend-not-connected" };
}

const forgotSchema = z.object({ email });
const resetSchema = z
  .object({ password: signupSchema.shape.password, confirm: z.string().max(128) })
  .refine((v) => v.password === v.confirm, { path: ["confirm"] });
const contactSchema = z.object({ name: z.string().trim().min(2).max(80), email, subject: z.string().trim().min(2).max(120), message: z.string().trim().min(10).max(2000) });

// Anti-enumeration: always report success for forgot-password regardless of account existence.
export async function forgotAction(_: FormState, form: FormData): Promise<FormState> {
  const r = forgotSchema.safeParse(Object.fromEntries(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  return { ok: true, message: "link-sent" };
}
export async function resetAction(_: FormState, form: FormData): Promise<FormState> {
  const r = resetSchema.safeParse(Object.fromEntries(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  return { ok: false, message: "backend-not-connected" };
}
export async function resendAction(): Promise<FormState> {
  return { ok: true, message: "resent" };
}
export async function contactAction(_: FormState, form: FormData): Promise<FormState> {
  const r = contactSchema.safeParse(Object.fromEntries(form));
  if (!r.success) return { ok: false, errors: flatten(r.error) };
  return { ok: true, message: "sent" };
}
