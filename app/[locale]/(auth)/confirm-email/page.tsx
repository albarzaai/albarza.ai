import { AuthFrame } from "@/components/AuthFrame";
import { Icon } from "@/components/Icon";
import { TokenConfirm } from "@/components/TokenConfirm";
import { confirmEmailAction } from "@/lib/auth-actions";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> }) {
  const locale = (await params).locale as Locale;
  const token = (await searchParams).token ?? "";
  const has = /^[A-Za-z0-9_-]{32,64}$/.test(token);
  return (
    <AuthFrame locale={locale} art={6}>
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ink/5 text-gold"><Icon n="mail" size={28} /></span>
      <h1 className="mt-6 text-center text-3xl font-semibold">{locale === "ar" ? "تأكيد البريد الجديد" : "Confirm your new email"}</h1>
      {has ? <TokenConfirm locale={locale} token={token} action={confirmEmailAction} label={locale === "ar" ? "تأكيد" : "Confirm"} /> : <p className="mt-4 text-center text-sm">{locale === "ar" ? "الرابط غير صالح." : "This link is not valid."}</p>}
    </AuthFrame>
  );
}
