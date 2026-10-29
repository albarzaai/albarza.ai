"use client";

import { useActionState } from "react";
import { formMessage } from "@/lib/form-messages";
import type { FormState } from "@/lib/auth-actions";
import type { Locale } from "@/lib/i18n";

// One-click confirmation for emailed links (verify email / confirm new email).
export function TokenConfirm({ locale, token, action, label }: { locale: Locale; token: string; action: (s: FormState, f: FormData) => Promise<FormState>; label: string }) {
  const [s, run, pending] = useActionState<FormState, FormData>(action, null);
  return (
    <form action={run} className="mt-6">
      <input type="hidden" name="token" value={token} /><input type="hidden" name="locale" value={locale} />
      {formMessage(s?.message, locale) && <p role="alert" className="mb-3 rounded-xl bg-red-500/10 p-3 text-center text-xs text-red-500">{formMessage(s?.message, locale)}</p>}
      <button disabled={pending} className="btn btn-gold w-full !py-3">{label}</button>
    </form>
  );
}
