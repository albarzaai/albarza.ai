import { Composer } from "@/components/Composer";
import { Feed } from "@/components/Feed";
import { PageHeader } from "@/components/PageHeader";
import { PopularPill } from "@/components/PopularPill";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const a = ta(locale);
  return (
    <>
      <PageHeader locale={locale} title={a.explore} tabs={[]} right={null} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 hidden h-[76px] items-center justify-center md:flex"><div className="pointer-events-auto"><PopularPill locale={locale} /></div></div>
      <main className="px-5 pb-72 md:px-8"><Feed locale={locale} type="explore" /></main>
      <Composer locale={locale} initialMode="createImage" />
    </>
  );
}
