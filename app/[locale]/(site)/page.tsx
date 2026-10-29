import { Channels, Collage, FeaturedModels, GoApp, HomeCta, HomeFaq, HomeHero, Plans, Suite, WhyChoose } from "@/components/HomeSections";
import type { Locale } from "@/lib/i18n";

// Mirrors the Davinci home page: platform hero, collage, featured models, suite tabs, channels, app, why, plans, FAQ, CTA.
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (
    <main>
      <HomeHero locale={locale} />
      <Collage locale={locale} />
      <FeaturedModels locale={locale} />
      <Suite locale={locale} />
      <Channels locale={locale} />
      <GoApp locale={locale} />
      <WhyChoose locale={locale} />
      <Plans locale={locale} />
      <HomeFaq locale={locale} />
      <HomeCta locale={locale} />
    </main>
  );
}
