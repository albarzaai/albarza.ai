"use client";

import { TurnstileBox } from "./TurnstileBox";
import Link from "next/link";
import { useActionState } from "react";
import { contactAction, forgotAction, resendAction, resetAction, type FormState } from "@/lib/auth-actions";
import { t } from "@/lib/dict";
import { formMessage } from "@/lib/form-messages";
import type { Locale } from "@/lib/i18n";

const bad = (s: FormState, k: string, l: Locale) => s?.errors?.[k] && <p className="mt-1 text-xs text-red-400">{l === "ar" ? "قيمة غير صالحة" : "Invalid value"}</p>;

export function ForgotForm({ locale }: { locale: Locale }) {
  const d = t(locale);
  const [s, action, pending] = useActionState<FormState, FormData>(forgotAction, null);
  return (
    <>
      <h1 className="text-center text-3xl font-semibold">{d.forgotTitle}</h1>
      <p className="mt-2 text-center text-sm text-ink/80">{d.forgotSub}</p>
      <form action={action} noValidate className="mt-7 space-y-3">
        <input type="hidden" name="locale" value={locale} />
        <div><label className="label" htmlFor="email">{d.email}</label><input id="email" name="email" type="email" dir="ltr" className="input" autoComplete="email" />{bad(s, "email", locale)}</div>
        <TurnstileBox locale={locale} /><button disabled={pending} className="btn btn-gold w-full !py-3">{d.sendLink}</button>
        {s?.ok && <p role="status" className="text-center text-xs text-gold-hi">{d.linkSent}</p>}
        <Link href={`/${locale}/login`} className="block text-center text-xs text-muted hover:text-ink">‹ {d.backToLogin}</Link>
      </form>
    </>
  );
}

export function ResetForm({ locale, token }: { locale: Locale; token: string }) {
  const d = t(locale);
  const [s, action, pending] = useActionState<FormState, FormData>(resetAction, null);
  return (
    <>
      <h1 className="text-center text-3xl font-semibold">{d.resetTitle}</h1>
      <p className="mt-2 text-center text-sm text-ink/80">{d.resetSub}</p>
      <form action={action} noValidate className="mt-7 space-y-3">
        <input type="hidden" name="locale" value={locale} /><input type="hidden" name="token" value={token} />
        {formMessage(s?.message, locale) && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-xs text-red-500">{formMessage(s?.message, locale)}</p>}
        <div><label className="label" htmlFor="password">{d.newPassword}</label><input id="password" name="password" type="password" dir="ltr" className="input" autoComplete="new-password" />{bad(s, "password", locale)}</div>
        <div><label className="label" htmlFor="confirm">{d.confirmPassword}</label><input id="confirm" name="confirm" type="password" dir="ltr" className="input" autoComplete="new-password" />{bad(s, "confirm", locale)}</div>
        <button disabled={pending} className="btn btn-gold w-full !py-3">{d.resetBtn}</button>
      </form>
    </>
  );
}

export function ResendButton({ locale }: { locale: Locale }) {
  const d = t(locale);
  const [s, action, pending] = useActionState<FormState, FormData>(resendAction, null);
  return (
    <form action={action} className="mt-6 text-center">
      <input type="hidden" name="locale" value={locale} />
      <button disabled={pending} className="btn btn-ghost w-full">{d.resend}</button>
      {s?.ok && <p role="status" className="mt-3 text-xs text-gold-hi">✓</p>}
      {s && !s.ok && formMessage(s.message, locale) && <p role="alert" className="mt-3 text-xs text-red-500">{formMessage(s.message, locale)}</p>}
      <p className="mt-3 text-xs text-muted">{d.checkSpam}</p>
    </form>
  );
}

export function ContactForm({ locale, defaultSubject }: { locale: Locale; defaultSubject?: string }) {
  const d = t(locale);
  const [s, action, pending] = useActionState<FormState, FormData>(contactAction, null);
  return (
    <form action={action} noValidate className="card space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="c-name">{d.name}</label><input id="c-name" name="name" className="input" />{bad(s, "name", locale)}</div>
        <div><label className="label" htmlFor="c-email">{d.email}</label><input id="c-email" name="email" type="email" dir="ltr" className="input" />{bad(s, "email", locale)}</div>
      </div>
      <div><label className="label" htmlFor="c-sub">{d.subject}</label><input id="c-sub" name="subject" defaultValue={defaultSubject} className="input" />{bad(s, "subject", locale)}</div>
      <div><label className="label" htmlFor="c-msg">{d.message}</label><textarea id="c-msg" name="message" rows={6} maxLength={2000} className="input resize-none" />{bad(s, "message", locale)}</div>
      <button disabled={pending} className="btn btn-gold">{d.send}</button>
      {s?.ok && <p role="status" className="text-sm text-gold-hi">{d.sent}</p>}
    </form>
  );
}
