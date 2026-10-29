import Link from "next/link";
import { EditProfile } from "@/components/EditProfile";
import { Icon } from "@/components/Icon";
import { ta } from "@/lib/app-dict";
import { gallery } from "@/lib/media";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string }> }) {
  const locale = (await params).locale as Locale;
  const { tab: t } = await searchParams;
  const a = ta(locale);
  const tab = t === "likes" ? "likes" : "creations";
  const n = (x: number) => x.toLocaleString(locale === "ar" ? "ar-AE" : "en-AE");
  return (
    <main className="mx-auto max-w-[800px] px-5 py-10">
      <div className="flex items-center gap-6">
        <span className="grid h-[90px] w-[90px] shrink-0 place-items-center rounded-full bg-gold text-3xl font-bold text-black">A</span>
        <div><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold" dir="ltr">user_b67f45e7</h1><EditProfile locale={locale} /></div>
          <p className="mt-3 flex gap-6 text-lg"><span><b>{n(0)}</b> <span className="text-white/65">{a.likes}</span></span><span><b>{n(10)}</b> <span className="text-white/65">{a.creationsCount}</span></span></p></div>
      </div>
      <nav className="mt-8 flex justify-center border-t border-white/10">{[["creations", a.creations, "assets"], ["likes", a.likes, "heart"]].map(([k, l, i]) => <Link key={k} href={`/${locale}/app/profile?tab=${k}`} className={`flex items-center gap-2 px-6 py-3 text-lg ${k === tab ? "-mt-px border-t-2 border-white font-semibold" : "text-white/55"}`}><Icon n={i === "assets" ? "grid" : i} size={16} />{l}</Link>)}</nav>
      {tab === "creations" ? (
        <div className="mt-6 grid grid-cols-3 gap-1.5">
          {Array.from({ length: 9 }, (_, k) => (
            <div key={k} className="group relative aspect-square overflow-hidden bg-[#1a1a1a]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={gallery(k + 1)} alt="" loading="lazy" className="h-full w-full object-cover" />
              {k % 3 === 1 && <span className="absolute start-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs"><Icon n="play" size={10} />0:04</span>}
              <span className="absolute end-2 top-2 hidden flex-col gap-2 group-hover:flex"><Icon n="heart" size={16} /><Icon n="download" size={16} /></span></div>
          ))}
        </div>
      ) : <p className="py-24 text-center text-white/45">{a.noResults}</p>}
    </main>
  );
}
