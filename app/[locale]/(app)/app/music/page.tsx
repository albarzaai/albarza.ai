import { Composer } from "@/components/Composer";
import { CreationsList } from "@/components/CreationsList";
import { MiniPlayer } from "@/components/MiniPlayer";
import { PageHeader } from "@/components/PageHeader";
import { ta } from "@/lib/app-dict";
import { gallery } from "@/lib/media";
import type { Locale } from "@/lib/i18n";

const tracks: [string, string][] = [["ليالي الخليج", "Gulf Nights"], ["صدى الصحراء", "Desert Echo"], ["نبض المدينة", "City Pulse"], ["الساعة الذهبية", "Golden Hour"], ["صدى الواحة", "Oasis Echo"], ["مجلس النيون", "Neon Majlis"]];
const fresh: [string, string][] = [["أمل", "Amal"], ["رمال", "Sands"], ["مطر", "Rain"], ["سفر", "Voyage"], ["حنين", "Nostalgia"], ["فجر", "Dawn"]];

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string; q?: string }> }) {
  const locale = (await params).locale as Locale;
  const sp = await searchParams;
  const a = ta(locale);
  const tab = ["creations", "studio"].includes(sp.tab ?? "") ? sp.tab! : "studio";
  const i = locale === "ar" ? 0 : 1;
  const row = (list: [string, string][], off: number) => (
    <div className="noscroll flex gap-4 overflow-x-auto pb-2">{list.map((t, k) => (<article key={t[1]} className="w-[200px] shrink-0 md:w-[223px]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={gallery(k + off)} alt="" loading="lazy" decoding="async" className="aspect-[4/5] w-full rounded-2xl object-cover" /><p className="mt-3 text-sm">{t[i]}</p></article>))}</div>
  );
  return (
    <>
      <PageHeader locale={locale} crumb={a.music} tabs={[{ key: "creations", label: a.creations, icon: "library" }, { key: "studio", label: a.studio, icon: "gem" }]} active={tab} basePath="music" />
      <main className="space-y-8 px-5 pb-80 md:px-8">
        {tab === "studio" && (<><section><h2 className="mb-4 text-lg font-semibold">{a.editorsChoice}</h2>{row(tracks, 1)}</section><section><h2 className="mb-4 text-lg font-semibold">{a.newReleases}</h2>{row(fresh, 4)}</section></>)}
        {tab === "creations" && <CreationsList locale={locale} kind="audio" q={sp.q} />}
      </main>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[310px] bg-gradient-to-t from-black via-black/80 to-transparent md:ms-[calc(var(--sb)+20px)]" aria-hidden />
      <Composer locale={locale} initialMode="musicGenerator" />
      <div className="hidden md:block"><div className="fixed bottom-[7px] z-40" /></div>
    </>
  );
}
