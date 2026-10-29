import { AuthModal } from "@/components/AuthModal";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return <AuthModal locale={locale} initial="signup" />;
}
