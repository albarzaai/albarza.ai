import { Hero } from "@/components/Hero";
import { Cta, Faq, Features, HowTo, Toolkit } from "@/components/Sections";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (<main><Hero locale={locale} variant="image" /><HowTo locale={locale} /><Features locale={locale} /><Toolkit locale={locale} /><Faq locale={locale} /><Cta locale={locale} /></main>);
}
