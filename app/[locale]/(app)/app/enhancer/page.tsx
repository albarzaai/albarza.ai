import { EnhancerApp } from "@/components/EnhancerApp";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return <EnhancerApp locale={locale} />;
}
