"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, signupAction, type FormState } from "@/lib/auth-actions";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export function AuthForm({ locale, mode }: { locale: Locale; mode: "login" | "signup" }) {
  const d = t(locale);
  const [state, action, pending] = useActionState<FormState, FormData>(mode === "login" ? loginAction : signupAction, null);
  const err = (k: string) => state?.errors?.[k] && <p className="mt-1 text-xs text-red-400">{locale === "ar" ? "قيمة غير صالحة" : "Invalid value"}</p>;
  const other = mode === "login" ? "signup" : "login";
  return (
    <div className="card w-full max-w-md p-8">
      <h1 className="text-2xl font-bold">{mode === "login" ? d.loginTitle : d.signupTitle}</h1>
      <button type="button" className="btn btn-ghost mt-6 w-full" aria-label={d.google}>
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
        {d.google}
      </button>
      <p className="my-5 text-center text-xs text-muted">{d.or}</p>
      <form action={action} noValidate className="space-y-4">
        {mode === "signup" && (<div><label className="label" htmlFor="name">{d.name}</label><input id="name" name="name" className="input" autoComplete="name" />{err("name")}</div>)}
        <div><label className="label" htmlFor="email">{d.email}</label><input id="email" name="email" type="email" dir="ltr" className="input" autoComplete="email" />{err("email")}</div>
        <div><label className="label" htmlFor="password">{d.password}</label><input id="password" name="password" type="password" dir="ltr" className="input" autoComplete={mode === "login" ? "current-password" : "new-password"} />{err("password")}</div>
        {mode === "signup" && (<label className="flex items-start gap-2 text-xs text-muted"><input type="checkbox" name="agree" className="mt-0.5 accent-[#bd9b5f]" />{d.agree}</label>)}
        {mode === "login" && <Link href="#" className="block text-xs text-gold">{d.forgot}</Link>}
        <button disabled={pending} className="btn btn-gold w-full">{mode === "login" ? d.login : d.signup}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        {mode === "login" ? d.noAcct : d.haveAcct}{" "}
        <Link href={`/${locale}/${other}`} className="font-semibold text-gold">{mode === "login" ? d.signup : d.login}</Link>
      </p>
    </div>
  );
}
