import { Composer } from "@/components/Composer";
import { CreationsList } from "@/components/CreationsList";
import { PageHeader } from "@/components/PageHeader";
import { ta } from "@/lib/app-dict";
import { gallery } from "@/lib/media";
import type { Locale } from "@/lib/i18n";

const boards: [string, string, string][] = [
  ["نوار قرمزي بسيط", "Crimson Noir Minimalism", "#c9777a"], ["أحادي اللون الداكن", "Noir Monochrome", "#777b86"], ["أفانت جارد سينمائي", "Cinematic Avant-Garde", "#8a8f99"],
  ["كيروسكورو كهرماني", "Amber Chiaroscuro", "#c79a62"], ["إنفراريد وردي", "Surreal Infrared", "#c58aa2"], ["عدسة عين السمكة", "Fisheye Action", "#7fa3c4"],
];

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string; q?: string }> }) {
  const locale = (await params).locale as Locale;
  const sp = await searchParams;
  const a = ta(locale);
  const tab = sp.tab === "creations" ? "creations" : "moodboard";
  const i = locale === "ar" ? 0 : 1;
  return (
    <>
      <PageHeader locale={locale} crumb={a.artwork} tabs={[{ key: "creations", label: a.creations, icon: "library" }, { key: "moodboard", label: a.moodboard, icon: "pin" }]} active={tab} basePath="artwork" />
      <main className="px-5 pb-80 md:px-8">
        {tab === "creations" ? <CreationsList locale={locale} kind="image" q={sp.q} /> : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {boards.concat(boards).map((b, k) => (
              <article key={k} className="relative flex h-[216px] items-center justify-center overflow-hidden rounded-3xl" style={{ background: b[2] }}>
                {[-1, 1].map((d) => /* eslint-disable-next-line @next/next/no-img-element */ <img key={d} src={gallery(k + 3 + d)} alt="" loading="lazy" className="absolute h-[140px] w-[100px] rounded-2xl object-cover opacity-80" style={{ transform: `translateX(${d * 78}px) rotate(${d * 6}deg)` }} />)}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={gallery(k + 3)} alt="" loading="lazy" className="relative h-[170px] w-[112px] rounded-2xl object-cover shadow-xl" />
                <p className="absolute bottom-3 start-4 text-sm font-medium text-white drop-shadow">{b[i]}</p>
              </article>
            ))}
          </div>
        )}
      </main>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[280px] bg-gradient-to-t from-black via-black/80 to-transparent md:ms-[calc(var(--sb)+20px)]" aria-hidden />
      <Composer locale={locale} initialMode="createArtwork" />
    </>
  );
}
