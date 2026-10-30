"use client";

import Link from "next/link";
import { gallery } from "@/lib/media";
import { useActionState, useState } from "react";
import { TurnstileBox } from "./TurnstileBox";
import { Icon } from "./Icon";
import { loginAction, signupAction, type FormState } from "@/lib/auth-actions";
import { t } from "@/lib/dict";
import { formMessage } from "@/lib/form-messages";
import type { Locale } from "@/lib/i18n";

const G = () => (<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>);

// Davinci-style centered modal: art panel + "Sign up or log in". Validation runs in server actions.
export function AuthModal({ locale, initial, next, reset, verified, error }: { locale: Locale; initial: "login" | "signup"; next?: string; reset?: boolean; verified?: boolean; error?: string }) {
  const d = t(locale);
  const [step, setStep] = useState<"choose" | "email">(verified ? "email" : "choose");
  const [mode, setMode] = useState<"login" | "signup">(initial);
  const [state, action, pending] = useActionState<FormState, FormData>(mode === "login" ? loginAction : signupAction, null);
  const err = (k: string) => state?.errors?.[k] && <p className="mt-1 text-xs text-red-400">{locale === "ar" ? "قيمة غير صالحة" : "Invalid value"}</p>;
  const row = "flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-surface-2 text-sm font-medium transition hover:bg-ink/10";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative grid max-h-[92dvh] w-full max-w-[1000px] overflow-auto rounded-3xl border border-line bg-surface md:min-h-[700px] md:grid-cols-2">
        <Link href={`/${locale}`} aria-label="close" className="absolute end-5 top-5 z-10 grid h-9 w-9 place-items-center rounded-full bg-ink/10 hover:bg-ink/20"><Icon n="close" size={14} /></Link>
        <div className="relative m-6 hidden overflow-hidden rounded-2xl md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <video src="/media/login-dubai-sm.mp4" poster="/media/login-dubai.jpg" autoPlay muted loop playsInline preload="auto" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-light.png" alt="" width={42} height={56} className="absolute start-6 top-6" />
        </div>
        <div className="flex flex-col justify-center px-8 py-14 md:px-12">
          <h1 className="text-center text-3xl font-semibold">{d.authTitle}</h1>
          <p className="mt-2 text-center text-sm text-ink/80">{d.authSub}</p>
          {step === "choose" ? (
            <div className="mt-7 space-y-3">
              {error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-xs text-red-500">{formMessage(error, locale) ?? formMessage("unavailable", locale)}</p>}
              {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "1"
                ? <a href={`/api/auth/google/start?locale=${locale}${next ? `&next=${encodeURIComponent(next)}` : ""}`} className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white text-sm font-semibold text-black hover:bg-gold-hi"><G />{d.google}</a>
                : <button type="button" disabled title={locale === "ar" ? "قريباً" : "Coming soon"} className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl bg-white/70 text-sm font-semibold text-black opacity-70"><G />{d.google}<span className="rounded-full bg-gold/25 px-2 py-0.5 text-[10px]">{locale === "ar" ? "قريباً" : "Soon"}</span></button>}
              <button type="button" onClick={() => setStep("email")} className={row}><Icon n="mail" size={16} />{d.withEmail}</button>
            </div>
          ) : (
            <form action={action} noValidate className="mt-7 space-y-3">
              <input type="hidden" name="locale" value={locale} />{next && <input type="hidden" name="next" value={next} />}
              {verified && <p role="status" className="rounded-xl bg-gold/15 p-3 text-xs">{locale === "ar" ? "تم تأكيد بريدك الإلكتروني. سجّل الدخول للمتابعة." : "Email confirmed. Sign in to continue."}</p>}
              {reset && <p role="status" className="rounded-xl bg-gold/15 p-3 text-xs">{locale === "ar" ? "تم تغيير كلمة المرور. سجّل الدخول." : "Password changed. Please sign in."}</p>}
              {error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-xs text-red-500">{formMessage(error, locale) ?? formMessage("unavailable", locale)}</p>}
              {formMessage(state?.message, locale) && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-xs text-red-500">{formMessage(state?.message, locale)}</p>}
              {mode === "signup" && (<div><label className="label" htmlFor="name">{d.name}</label><input id="name" name="name" className="input" autoComplete="name" />{err("name")}</div>)}
              <div><label className="label" htmlFor="email">{d.email}</label><input id="email" name="email" type="email" dir="ltr" className="input" autoComplete="email" />{err("email")}</div>
              <div><label className="label" htmlFor="password">{d.password}</label><input id="password" name="password" type="password" dir="ltr" className="input" autoComplete={mode === "login" ? "current-password" : "new-password"} />{err("password")}</div>
              {mode === "signup" && (<label className="flex items-start gap-2 text-xs text-muted"><input type="checkbox" name="marketing" className="mt-0.5 accent-[#bd9b5f]" />{locale === "ar" ? "أرغب بتلقي العروض والتحديثات (اختياري)" : "Send me offers and updates (optional)"}</label>)}
              {mode === "signup" && (<label className="flex items-start gap-2 text-xs text-muted"><input type="checkbox" name="agree" className="mt-0.5 accent-[#bd9b5f]" />{d.agree}</label>)}
              {mode === "login" && <Link href={`/${locale}/forgot-password`} className="block text-xs text-gold-hi">{d.forgot}</Link>}
              <TurnstileBox locale={locale} /><button disabled={pending} className="btn btn-gold w-full !py-3">{mode === "login" ? d.login : d.signup}</button>
              <div className="flex justify-between text-xs text-muted">
                <button type="button" onClick={() => setStep("choose")} className="hover:text-ink">‹ {d.back}</button>
                <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="hover:text-ink">{mode === "login" ? d.noAcct + " " + d.signup : d.haveAcct + " " + d.login}</button>
              </div>
            </form>
          )}
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ink/80"><Icon n="lock" size={13} />{d.safe}</p>
          <p className="mt-3 text-center text-xs leading-6 text-muted">{d.authAgree} <Link href={`/${locale}/terms`} className="underline">{d.terms}</Link> {d.and} <Link href={`/${locale}/privacy`} className="underline">{d.privacy}</Link>، {d.authPromos}</p>
        </div>
      </div>
    </div>
  );
}
