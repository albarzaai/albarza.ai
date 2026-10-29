import { AuthForm } from "@/components/AuthForm";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return <AuthForm locale={locale} mode="signup" />;
}
