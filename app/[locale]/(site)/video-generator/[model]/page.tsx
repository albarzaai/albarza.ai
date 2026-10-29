import Link from "next/link";
import { notFound } from "next/navigation";
import { Cta, Faq, Features, HowTo } from "@/components/Sections";
import { models } from "@/lib/content";
import { t } from "@/lib/dict";
import { gallery, HERO } from "@/lib/media";
import type { Locale } from "@/lib/i18n";

export const generateStaticParams = () => models.map((m) => ({ model: m.id }));

export default async function ModelPage({ params }: { params: Promise<{ locale: string; model: string }> }) {
  const { locale: l, model } = await params;
  const m = models.find((x) => x.id === model);
  if (!m) notFound();
  const locale = l as Locale;
  const d = t(locale);
  return (
    <main>
      <section className="relative flex min-h-[78svh] items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        <nav aria-label="breadcrumb" className="absolute start-10 top-[112px] z-10 hidden text-sm text-white/80 md:block">
          <Link href={`/${locale}`}>{d.home}</Link> / <Link href={`/${locale}`}>{d.videoGenerator}</Link> / <span className="text-white">{m.name}</span>
        </nav>
        <div className="relative z-10 mx-auto w-full max-w-[1000px] px-5 pb-20 text-center">
          <h1 className="text-4xl font-semibold md:text-5xl">{m.name}</h1>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/90">{m.desc[locale]}</p>
          <Link href={`/${locale}/signup`} className="btn btn-gold mt-8">{d.tryModelBtn} {m.name}</Link>
        </div>
      </section>
      <section className="section">
        <h2 className="text-3xl font-semibold">{d.whatCreate}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[d.best1, d.best2, d.best3].map((b, i) => (
            <article key={b} className="card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery(i + 4)} alt="" width={400} height={300} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="p-5"><p className="text-xs text-gold-hi">{d.modelBest}</p><h3 className="mt-1 font-semibold">{b}</h3></div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">{d.modelType}: {d.typeT2VI2V}</p>
      </section>
      <HowTo locale={locale} />
      <Features locale={locale} />
      <section className="section pt-0">
        <h2 className="text-3xl font-semibold">{d.otherModels}</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {models.filter((x) => x.id !== m.id).slice(0, 8).map((x) => (
            <Link key={x.id} href={`/${locale}/video-generator/${x.id}`} className="card p-5 hover:!border-gold"><h3 className="font-semibold">{x.name}</h3><p className="mt-2 line-clamp-2 text-xs text-muted">{x.desc[locale]}</p></Link>
          ))}
        </div>
      </section>
      <Faq locale={locale} />
      <Cta locale={locale} />
    </main>
  );
}
