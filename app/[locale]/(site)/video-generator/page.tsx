import { Hero } from "@/components/Hero";
import { Community, Cta, Faq, Features, HowTo, Models, TryModel, Why } from "@/components/Sections";
import type { Locale } from "@/lib/i18n";

// Mirrors the structure of the Davinci video-generator page: prompt hero, models, steps, features, why, community, FAQ.
export default async function VideoGenerator({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (
    <main>
      <Hero locale={locale} />
      <Models locale={locale} />
      <HowTo locale={locale} />
      <Features locale={locale} />
      <Why locale={locale} />
      <TryModel locale={locale} />
      <Community locale={locale} />
      <Faq locale={locale} />
      <Cta locale={locale} />
    </main>
  );
}
