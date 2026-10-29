import { Hero } from "@/components/Hero";
import { AppPromo, Faq, HowTo, Models, Pricing, Takeaways, Toolkit, Why } from "@/components/Sections";
import type { Locale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (
    <main>
      <Hero locale={locale} />
      <Models locale={locale} />
      <HowTo locale={locale} />
      <Why locale={locale} />
      <Toolkit locale={locale} />
      <AppPromo locale={locale} />
      <Takeaways locale={locale} />
      <Pricing locale={locale} />
      <Faq locale={locale} />
    </main>
  );
}
