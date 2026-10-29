import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ta } from "@/lib/app-dict";
import { FastCut } from "@/components/FastCut";
import { gallery } from "@/lib/media";

const reel = (n: number) => [0, 3, 6, 9].map((d) => gallery(((n - 1 + d) % 12) + 1));
import type { Locale } from "@/lib/i18n";

function Banner({ n, badge, title, desc, buttons, locale }: { n: number; badge: { icon: string; label: string }; title: string; desc: string; buttons: [string, string][]; locale: Locale }) {
  return (
    <section className="relative mt-5 flex min-h-[320px] items-end overflow-hidden rounded-3xl border border-white/10 md:min-h-[366px]">
      <FastCut srcs={reel(n)} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="relative flex w-full flex-wrap items-end justify-between gap-4 p-6 md:p-[60px]">
        <div><span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs"><Icon n={badge.icon} size={12} />{badge.label}</span><h2 className="mt-3 text-3xl font-bold md:text-4xl">{title}</h2><p className="mt-2 text-lg text-white/85">{desc}</p></div>
        <div className="flex items-center gap-3">{buttons.map(([label, href], i) => <Link key={label} href={`/${locale}/app/${href}`} className={`rounded-full px-5 py-2.5 text-sm font-semibold ${i === 0 ? "bg-white text-black" : "border border-white text-white"}`}>{label}</Link>)}<span className="grid h-9 w-9 place-items-center rounded-full bg-white/15"><Icon n="pause" size={13} /></span></div>
      </div>
    </section>
  );
}
const Cards = ({ items, cols }: { items: { t: string; d: string; n: number }[]; cols: string }) => (
  <div className={`mt-5 grid gap-4 ${cols}`}>{items.map((c, k) => (<article key={c.t}><FastCut srcs={reel(c.n)} offset={k * 200} className="relative aspect-[16/9] w-full rounded-xl border border-white/10" /><h3 className="mt-3 font-semibold">{c.t}</h3><p className="truncate text-sm text-white/55">{c.d}</p></article>))}</div>
);

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const a = ta(locale);
  return (
    <>
      <header className="flex h-[76px] items-center px-5 md:px-8"><h1 className="text-base font-semibold">{a.home}</h1></header>
      <main className="mx-auto max-w-[1100px] px-5 pb-16 md:px-4">
        <Banner n={3} locale={locale} badge={{ icon: "flame", label: a.hot }} title={a.banner1T} desc={a.banner1D} buttons={[[a.banner1B, "video"]]} />
        <Cards cols="grid-cols-2 md:grid-cols-5" items={[{ t: a.hCards1, d: a.hCards1d, n: 2 }, { t: a.hCards2, d: a.hCards2d, n: 5 }, { t: a.hCards3, d: a.hCards3d, n: 8 }, { t: a.hCards4, d: a.hCards4d, n: 11 }, { t: a.hCards5, d: a.hCards5d, n: 4 }]} />
        <Banner n={7} locale={locale} badge={{ icon: "star", label: a.featured }} title={locale === "ar" ? "نقدّم لكم نماذج الصور" : "Introducing Image Models"} desc={a.createImage} buttons={[[a.createImage, "image"]]} />
        <Cards cols="grid-cols-1 md:grid-cols-3" items={[{ t: a.studio1, d: a.studio1d, n: 6 }, { t: a.studio2, d: a.studio2d, n: 9 }, { t: a.studio3, d: a.studio3d, n: 12 }]} />
        <Banner n={10} locale={locale} badge={{ icon: "star", label: a.featured }} title={a.banner2T} desc={a.banner2D} buttons={[[a.banner2B, "image"]]} />
        <Cards cols="grid-cols-1 md:grid-cols-3" items={[{ t: a.news1, d: a.news1d, n: 1 }, { t: a.news2, d: a.news2d, n: 3 }, { t: a.news3, d: a.news3d, n: 5 }]} />
        <Banner n={12} locale={locale} badge={{ icon: "arrow", label: a.trending }} title={a.banner3T} desc={a.banner3D} buttons={[[a.banner3B1, "voice"], [a.banner3B2, "music"]]} />
        <Cards cols="grid-cols-2 md:grid-cols-4" items={[{ t: a.voiceCards1, d: "", n: 2 }, { t: a.voiceCards2, d: "", n: 4 }, { t: a.voiceCards3, d: "", n: 6 }, { t: a.voiceCards4, d: "", n: 8 }]} />
      </main>
    </>
  );
}
