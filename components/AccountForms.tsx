"use client";

import { useActionState } from "react";
import { changeEmailAction, changePasswordAction, deleteAccountAction, membershipAction, revokeOthersAction, revokeSessionAction, updateProfileAction } from "@/lib/account-actions";
import type { FormState } from "@/lib/auth-actions";
import { formMessage } from "@/lib/form-messages";
import type { Locale } from "@/lib/i18n";

const T = {
  ar: { name: "الاسم", language: "اللغة", offers: "أرغب بتلقي العروض والتحديثات", save: "حفظ", saved: "تم الحفظ ✓", newEmail: "البريد الجديد", current: "كلمة المرور الحالية", changeEmail: "تغيير البريد", emailPending: "أرسلنا رابط تأكيد إلى بريدك الجديد. لن يتغير البريد قبل الضغط عليه.", newPass: "كلمة المرور الجديدة", confirmPass: "تأكيد كلمة المرور", changePass: "تغيير كلمة المرور", passDone: "تم تغيير كلمة المرور وتسجيل الخروج من الأجهزة الأخرى ✓", wrong: "غير صحيحة", invalid: "قيمة غير صالحة", rule: "10 أحرف على الأقل مع حرف كبير وصغير ورقم.", signOutOthers: "تسجيل الخروج من الأجهزة الأخرى", revoke: "إنهاء", thisDevice: "هذا الجهاز", lastSeen: "آخر نشاط", cancelPlan: "إلغاء الاشتراك", resumePlan: "استئناف الاشتراك", deleteTitle: "حذف الحساب", deleteText: "يحذف حسابك وكل مشاريعك وبياناتك نهائياً ولا يمكن التراجع. اكتب DELETE وكلمة مرورك للتأكيد.", typeDelete: "اكتب DELETE", deleteBtn: "حذف حسابي نهائياً", yourEmail: "بريدك الإلكتروني للتأكيد", sessionOut: "انتهت الجلسة. سجّل الدخول من جديد.", confirmHint: "اكتب DELETE بالضبط" },
  en: { name: "Name", language: "Language", offers: "Send me offers and updates", save: "Save", saved: "Saved ✓", newEmail: "New email", current: "Current password", changeEmail: "Change email", emailPending: "We sent a confirmation link to your new address. Your email does not change until you click it.", newPass: "New password", confirmPass: "Confirm password", changePass: "Change password", passDone: "Password changed. Other devices were signed out ✓", wrong: "Incorrect", invalid: "Invalid value", rule: "At least 10 characters with upper case, lower case and a number.", signOutOthers: "Sign out of other devices", revoke: "End", thisDevice: "This device", lastSeen: "Last active", cancelPlan: "Cancel membership", resumePlan: "Resume membership", deleteTitle: "Delete account", deleteText: "This permanently deletes your account, projects and data. It cannot be undone. Type DELETE and enter your password to confirm.", typeDelete: "Type DELETE", deleteBtn: "Delete my account permanently", yourEmail: "Your email to confirm", sessionOut: "Your session ended. Please sign in again.", confirmHint: "Type DELETE exactly" },
};
const inp = "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-gold";
const Err = ({ s, k, l }: { s: FormState; k: string; l: Locale }) => s?.errors?.[k] ? <p className="mt-1 text-xs text-red-400">{s.errors[k] === "wrong" ? T[l].wrong : T[l].invalid}</p> : null;
const Msg = ({ s, l, ok }: { s: FormState; l: Locale; ok: string }) => s?.message === ok ? <p role="status" className="text-xs text-gold">{ok === "saved" ? T[l].saved : ok === "email_pending" ? T[l].emailPending : T[l].passDone}</p> : s?.message === "session" ? <p role="alert" className="text-xs text-red-400">{T[l].sessionOut}</p> : formMessage(s?.message, l) ? <p role="alert" className="text-xs text-red-400">{formMessage(s?.message, l)}</p> : null;

export function ProfileForm({ locale, name, lang, marketing }: { locale: Locale; name: string; lang: string; marketing: boolean }) {
  const t = T[locale];
  const [s, act, pending] = useActionState<FormState, FormData>(updateProfileAction, null);
  return (
    <form action={act} className="space-y-3">
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-xs text-white/55">{t.name}<input name="name" defaultValue={name} maxLength={60} className={`${inp} mt-1`} /><Err s={s} k="name" l={locale} /></label>
      <label className="block text-xs text-white/55">{t.language}<select name="locale" defaultValue={lang} className={`${inp} mt-1`}><option value="ar" className="bg-black">العربية</option><option value="en" className="bg-black">English</option></select></label>
      <label className="flex items-center gap-2 text-sm text-white/70"><input type="checkbox" name="marketing" defaultChecked={marketing} className="accent-[#bd9b5f]" />{t.offers}</label>
      <div className="flex items-center gap-3"><button disabled={pending} className="btn btn-gold !py-2">{t.save}</button><Msg s={s} l={locale} ok="saved" /></div>
    </form>
  );
}

export function EmailForm({ locale }: { locale: Locale }) {
  const t = T[locale];
  const [s, act, pending] = useActionState<FormState, FormData>(changeEmailAction, null);
  return (
    <form action={act} className="space-y-3">
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-xs text-white/55">{t.newEmail}<input name="newEmail" type="email" dir="ltr" autoComplete="email" className={`${inp} mt-1`} /><Err s={s} k="newEmail" l={locale} /></label>
      <label className="block text-xs text-white/55">{t.current}<input name="password" type="password" dir="ltr" autoComplete="current-password" className={`${inp} mt-1`} /><Err s={s} k="password" l={locale} /></label>
      <div className="flex flex-wrap items-center gap-3"><button disabled={pending} className="btn btn-gold !py-2">{t.changeEmail}</button><Msg s={s} l={locale} ok="email_pending" /></div>
    </form>
  );
}

export function PasswordForm({ locale }: { locale: Locale }) {
  const t = T[locale];
  const [s, act, pending] = useActionState<FormState, FormData>(changePasswordAction, null);
  return (
    <form action={act} className="space-y-3">
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-xs text-white/55">{t.current}<input name="current" type="password" dir="ltr" autoComplete="current-password" className={`${inp} mt-1`} /><Err s={s} k="current" l={locale} /></label>
      <label className="block text-xs text-white/55">{t.newPass}<input name="next" type="password" dir="ltr" autoComplete="new-password" className={`${inp} mt-1`} /><Err s={s} k="next" l={locale} /><span className="mt-1 block text-[11px] text-white/35">{t.rule}</span></label>
      <label className="block text-xs text-white/55">{t.confirmPass}<input name="confirm" type="password" dir="ltr" autoComplete="new-password" className={`${inp} mt-1`} /><Err s={s} k="confirm" l={locale} /></label>
      <div className="flex flex-wrap items-center gap-3"><button disabled={pending} className="btn btn-gold !py-2">{t.changePass}</button><Msg s={s} l={locale} ok="password_changed" /></div>
    </form>
  );
}

export type SessionRow = { id: string; current: boolean; lastSeen: number; device: string };
export function SessionsList({ locale, sessions }: { locale: Locale; sessions: SessionRow[] }) {
  const t = T[locale];
  const fmt = (n: number) => new Date(n).toLocaleString(locale === "ar" ? "ar-AE" : "en-AE", { dateStyle: "medium", timeStyle: "short" });
  const label = (ua: string) => (/iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac/.test(ua) ? "Mac" : /Windows/.test(ua) ? "Windows" : /Linux/.test(ua) ? "Linux" : "Browser") + (/Chrome\//.test(ua) && !/Edg/.test(ua) ? " · Chrome" : /Firefox/.test(ua) ? " · Firefox" : /Safari\//.test(ua) && !/Chrome/.test(ua) ? " · Safari" : /Edg/.test(ua) ? " · Edge" : "");
  return (
    <div className="space-y-2">
      {sessions.map((x) => (
        <div key={x.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm">
          <div><p className="font-medium">{label(x.device)} {x.current && <span className="ms-2 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] text-gold">{t.thisDevice}</span>}</p><p className="text-xs text-white/45">{t.lastSeen}: {fmt(x.lastSeen)}</p></div>
          {!x.current && <form action={revokeSessionAction}><input type="hidden" name="id" value={x.id} /><input type="hidden" name="locale" value={locale} /><button className="pill">{t.revoke}</button></form>}
        </div>
      ))}
      {sessions.length > 1 && <form action={revokeOthersAction}><input type="hidden" name="locale" value={locale} /><button className="pill mt-2">{t.signOutOthers}</button></form>}
    </div>
  );
}

export function MembershipButton({ locale, cancelling, label }: { locale: Locale; cancelling: boolean; label?: string }) {
  const t = T[locale];
  return <form action={membershipAction}><input type="hidden" name="op" value={cancelling ? "resume" : "cancel"} /><input type="hidden" name="locale" value={locale} /><button className="pill !text-red-300">{label ?? (cancelling ? t.resumePlan : t.cancelPlan)}</button></form>;
}

export function DeleteForm({ locale, hasPassword }: { locale: Locale; hasPassword: boolean }) {
  const t = T[locale];
  const [s, act, pending] = useActionState<FormState, FormData>(deleteAccountAction, null);
  return (
    <form action={act} className="space-y-3">
      <input type="hidden" name="locale" value={locale} />
      <p className="text-sm text-white/60">{t.deleteText}</p>
      <label className="block text-xs text-white/55">{t.typeDelete}<input name="confirm" autoComplete="off" className={`${inp} mt-1`} placeholder="DELETE" /><Err s={s} k="confirm" l={locale} /></label>
      {hasPassword
        ? <label className="block text-xs text-white/55">{t.current}<input name="password" type="password" dir="ltr" autoComplete="current-password" className={`${inp} mt-1`} /><Err s={s} k="password" l={locale} /></label>
        : <label className="block text-xs text-white/55">{t.yourEmail}<input name="email" type="email" dir="ltr" className={`${inp} mt-1`} /><Err s={s} k="email" l={locale} /></label>}
      <div className="flex flex-wrap items-center gap-3"><button disabled={pending} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500">{t.deleteBtn}</button><Msg s={s} l={locale} ok="x" /></div>
    </form>
  );
}
