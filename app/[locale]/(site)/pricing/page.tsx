import { GovSection } from "@/components/GovSection";
import { Pricing } from "@/components/Sections";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return <main className="pt-20"><Pricing locale={locale} /><GovSection locale={locale} /></main>;
}
