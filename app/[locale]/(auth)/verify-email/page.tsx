import { AuthFrame } from "@/components/AuthFrame";
import { Icon } from "@/components/Icon";
import { ResendButton } from "@/components/Forms";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const d = t(locale);
  return (
    <AuthFrame locale={locale} art={6}>
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ink/5 text-gold"><Icon n="mail" size={28} /></span>
      <h1 className="mt-6 text-center text-3xl font-semibold">{d.verifyTitle}</h1>
      <p className="mt-2 text-center text-sm text-ink/80">{d.verifySub}</p>
      <ResendButton locale={locale} />
    </AuthFrame>
  );
}
