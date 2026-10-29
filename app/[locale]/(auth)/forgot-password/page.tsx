import { AuthFrame } from "@/components/AuthFrame";
import { ForgotForm } from "@/components/Forms";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return <AuthFrame locale={locale} art={4}><ForgotForm locale={locale} /></AuthFrame>;
}
