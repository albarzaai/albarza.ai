import { Hero } from "@/components/Hero";
import { Cta, Faq, Features, Models, Pricing, Steps, Why } from "@/components/Sections";
import type { Locale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (<><Hero locale={locale} /><Models locale={locale} /><Steps locale={locale} /><Features locale={locale} /><Why locale={locale} /><Pricing locale={locale} /><Faq locale={locale} /><Cta locale={locale} /></>);
}
