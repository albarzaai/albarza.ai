import { Hero } from "@/components/Hero";
import { Cta, Faq, Features, Models, Pricing, Steps, Why } from "@/components/Sections";
import type { Locale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const tint = "bg-surface-2";
  return (
    <>
      <Hero locale={locale} />
      <Models locale={locale} />
      <div className="band" />
      <div className={tint}><Steps locale={locale} /></div>
      <Features locale={locale} />
      <div className="band" />
      <div className={tint}><Why locale={locale} /></div>
      <Pricing locale={locale} />
      <div className={tint}><Faq locale={locale} /></div>
      <Cta locale={locale} />
    </>
  );
}
