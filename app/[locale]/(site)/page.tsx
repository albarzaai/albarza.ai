import { Hero } from "@/components/Hero";
import { AppPromo, Community, Cta, Faq, Features, HowTo, Models, Takeaways, Toolkit, TryModel, Why } from "@/components/Sections";
import type { Locale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (
    <main>
      <Hero locale={locale} />
      <Models locale={locale} />
      <HowTo locale={locale} />
      <Features locale={locale} />
      <Why locale={locale} />
      <TryModel locale={locale} />
      <Toolkit locale={locale} />
      <Community locale={locale} />
      <AppPromo locale={locale} />
      <Takeaways locale={locale} />
      <Faq locale={locale} />
      <Cta locale={locale} />
    </main>
  );
}
