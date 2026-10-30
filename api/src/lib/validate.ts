import { z } from "zod";

// Every rule here is enforced on the server. The browser's own checks are only a convenience.
const COMMON = new Set(["password", "password1", "123456789", "1234567890", "qwertyuiop", "iloveyou12", "letmein123", "welcome123", "admin12345", "albarza123", "11111111111", "0123456789"]);

export const email = z.string().trim().toLowerCase().max(254).pipe(z.email());
export const password = z.string().min(10, "short").max(128, "long").refine((p) => /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p), "weak").refine((p) => !COMMON.has(p.toLowerCase()), "common");
export const name = z.string().trim().min(1).max(60).regex(/^[^<>{}\[\]\\\u0000-\u001f]+$/u, "chars");
export const locale = z.enum(["ar", "en"]);
export const token = z.string().regex(/^[A-Za-z0-9_-]{32,64}$/);
const clientCtx = { captcha: z.string().max(2048).optional() };

export const signup = z.object({ email, password, name, locale: locale.default("ar"), marketing: z.boolean().default(false), ...clientCtx }).strict();
export const login = z.object({ email, password: z.string().min(1).max(128), ...clientCtx }).strict();
export const forgot = z.object({ email, locale: locale.default("ar"), ...clientCtx }).strict();
export const reset = z.object({ token, password, ...clientCtx }).strict();
export const tokenOnly = z.object({ token, ...clientCtx }).strict();
export const profile = z.object({ name: name.optional(), locale: locale.optional(), marketing: z.boolean().optional(), ...clientCtx }).strict();
export const changeEmail = z.object({ newEmail: email, password: z.string().min(1).max(128), ...clientCtx }).strict();
export const changePassword = z.object({ current: z.string().min(1).max(128), next: password, ...clientCtx }).strict();
export const deleteAccount = z.object({ password: z.string().max(128).optional(), confirm: z.string().max(20), email: z.string().max(254).optional(), ...clientCtx }).strict();
export const projectSave = z.object({ id: z.string().uuid(), title: z.string().trim().min(1).max(120), data: z.string().max(200_000) }).strict();

export function fieldErrors(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of err.issues) { const k = String(i.path[0] ?? "form"); if (!out[k]) out[k] = i.message.length < 20 ? i.message : "invalid"; }
  return out;
}

const nextPath = z.string().regex(/^\/(ar|en)\/app(\/[\w\-/]*)?$/).max(200);
export const googleStart = z.object({ next: nextPath, locale }).strict();
export const googleCallback = z.object({ code: z.string().min(10).max(2048), state: token, stateCookie: token }).strict();

export const generateImage = z.object({ prompt: z.string().trim().min(1).max(2000), aspect: z.string().regex(/^\d{1,2}:\d{1,2}$/).optional(), quality: z.enum(["flash", "pro"]).default("flash"), n: z.number().int().min(1).max(4).default(1) }).strict();
