import { Community, Cta, Faq, Models, TryModel } from "@/components/Sections";
import { VideoBuilt, VideoHero, VideoPipeline, VideoSteps, VideoWhy } from "@/components/VideoLanding";
import type { Locale } from "@/lib/i18n";

// Mirrors the Davinci video-generator page: hero composer, models, steps, 4K carousel, feature panel, why carousel, community, FAQ.
export default async function VideoGenerator({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (
    <main>
      <VideoHero locale={locale} video="/media/hero-abudhabi.mp4" />
      <Models locale={locale} />
      <VideoSteps locale={locale} />
      <VideoBuilt locale={locale} />
      <VideoPipeline locale={locale} />
      <VideoWhy locale={locale} />
      <TryModel locale={locale} />
      <Community locale={locale} />
      <Faq locale={locale} />
      <Cta locale={locale} />
    </main>
  );
}
