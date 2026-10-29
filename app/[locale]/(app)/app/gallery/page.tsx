import { GalleryGrid } from "@/components/GalleryGrid";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (<><h1 className="mb-6 text-2xl font-bold">{t(locale).gallery}</h1><GalleryGrid locale={locale} /></>);
}
