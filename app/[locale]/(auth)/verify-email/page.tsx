import { redirect } from "next/navigation";
import { VerifyWatcher } from "@/components/VerifyWatcher";
import { pendingConfirmed } from "@/lib/pending";
import { AuthFrame } from "@/components/AuthFrame";
import { Icon } from "@/components/Icon";
import { ResendButton } from "@/components/Forms";
import { TokenConfirm } from "@/components/TokenConfirm";
import { verifyEmailAction } from "@/lib/auth-actions";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> }) {
  const locale = (await params).locale as Locale;
  const token = (await searchParams).token ?? "";
  if (!/^[A-Za-z0-9_-]{32,64}$/.test(token) && (await pendingConfirmed())) redirect(`/${locale}/login?verified=1`);
  const d = t(locale);
  const has = /^[A-Za-z0-9_-]{32,64}$/.test(token);
  return (
    <AuthFrame locale={locale} art={6}>
      {!has && <VerifyWatcher locale={locale} />}
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ink/5 text-gold"><Icon n="mail" size={28} /></span>
      <h1 className="mt-6 text-center text-3xl font-semibold">{d.verifyTitle}</h1>
      <p className="mt-2 text-center text-sm text-ink/80">{has ? (locale === "ar" ? "اضغط لتأكيد بريدك الإلكتروني." : "Click to confirm your email address.") : d.verifySub}</p>
      {has ? <TokenConfirm locale={locale} token={token} action={verifyEmailAction} label={locale === "ar" ? "تأكيد البريد" : "Confirm email"} /> : <ResendButton locale={locale} />}
    </AuthFrame>
  );
}
