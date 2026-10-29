import Link from "next/link";
import { models, plans, planName, t } from "@/lib/dict";
import { aed, type Locale } from "@/lib/i18n";

const Start = ({ locale }: { locale: Locale }) => <Link href={`/${locale}/signup`} className="btn btn-gold">{t(locale).startCreating}</Link>;
const img = (n: number) => `/media/gallery-${((n - 1) % 12) + 1}.svg`;

export function Models({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section id="models" className="section text-center">
      <h2 className="text-3xl font-semibold md:text-4xl">{d.modelsTitle}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-muted">{d.modelsSub}</p>
      <div className="mt-6"><Start locale={locale} /></div>
      <div className="relative mt-12 min-h-[480px] overflow-hidden rounded-3xl border border-line text-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/hero.svg" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="glass relative m-5 w-full max-w-sm rounded-2xl p-6">
          <p className="mb-4 text-sm font-semibold">{d.navAiVideo}</p>
          <ul className="space-y-1.5 text-sm">
            {models.map(([id, name], i) => (
              <li key={id}><Link href={`/${locale}/signup`} className={`block rounded-lg px-3 py-1.5 transition ${i === 0 ? "bg-white/10 text-gold-hi" : "text-white/70 hover:text-white"}`}>{name}</Link></li>
            ))}
          </ul>
          <p className="mt-5 border-t border-white/10 pt-4 text-xs text-white/70">{models[0][2][locale]}</p>
        </div>
      </div>
    </section>
  );
}

export function HowTo({ locale }: { locale: Locale }) {
  const d = t(locale);
  const steps = [[d.how1, d.how1d], [d.how2, d.how2d], [d.how3, d.how3d]];
  return (
    <section className="section">
      <h2 className="text-3xl font-semibold md:text-4xl">{d.howTitle}</h2>
      <p className="mt-4 max-w-2xl text-muted">{d.howSub}</p>
      <div className="mt-6"><Start locale={locale} /></div>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map(([title, text], i) => (
          <div key={title}>
            <h3 className="font-semibold"><span className="text-gold">{i + 1}.</span> {title}</h3>
            <p className="mt-2 text-sm text-muted">{text}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(i + 2)} alt="" width={400} height={300} loading="lazy" className="mt-5 h-56 w-full rounded-2xl border border-line object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function Why({ locale }: { locale: Locale }) {
  const d = t(locale);
  const items = [[d.w1, d.w1d], [d.w2, d.w2d], [d.w3, d.w3d], [d.w4, d.w4d], [d.why5, d.why5d], [d.why6, d.why6d]];
  return (
    <section className="section grid gap-12 lg:grid-cols-2">
      <div>
        <h2 className="text-3xl font-semibold md:text-4xl">{d.whyTitle}</h2>
        <p className="mt-4 max-w-md text-muted">{d.heroSub}</p>
        <div className="mt-6"><Start locale={locale} /></div>
      </div>
      <div className="space-y-3">
        {items.map(([title, text]) => (
          <div key={title} className="card p-5"><h3 className="text-sm font-semibold"><span className="text-gold">›</span> {title}</h3><p className="mt-1.5 ps-4 text-xs text-muted">{text}</p></div>
        ))}
      </div>
    </section>
  );
}

export function Toolkit({ locale }: { locale: Locale }) {
  const d = t(locale);
  const tools = [d.t2i, d.i2v, d.lipsync, d.upscale, d.t2v, d.vc];
  return (
    <section id="tools" className="py-20">
      <div className="mx-auto max-w-[1200px] px-5 text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">{d.anyTitle}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted">{d.anySub}</p>
      </div>
      <div className="noscroll mt-10 flex snap-x gap-5 overflow-x-auto px-5">
        {tools.map((name, i) => (
          <article key={name} className="relative h-[420px] w-[78vw] max-w-[620px] shrink-0 snap-center overflow-hidden rounded-3xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(i + 1)} alt="" width={400} height={500} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="glass absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl p-4">
              <h3 className="font-semibold">{name}</h3>
              <Link href={`/${locale}/signup`} className="btn btn-white !py-1.5">{d.tryTool}</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AppPromo({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="section">
      <h2 className="text-3xl font-semibold md:text-4xl">{d.appTitle}</h2>
      <p className="mt-4 max-w-xl text-muted">{d.appSub}</p>
      <p className="mt-2 text-sm text-muted">{d.appAvail}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <span className="btn btn-gold"> {d.ios}</span>
        <span className="btn btn-ghost">▶ {d.android}</span>
      </div>
    </section>
  );
}

export function Takeaways({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="section max-w-3xl text-center">
      <h2 className="text-3xl font-semibold md:text-4xl">{d.takeTitle}</h2>
      <ul className="mt-8 space-y-3 text-start text-sm text-muted">
        {[d.k1, d.k2, d.k3, d.k4].map((k) => <li key={k} className="flex gap-3"><span className="text-gold">•</span>{k}</li>)}
      </ul>
    </section>
  );
}

export function Pricing({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section id="pricing" className="section">
      <h2 className="text-center text-3xl font-semibold md:text-4xl">{d.pricingTitle}</h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.id} className={`card p-6 ${"popular" in p ? "!border-gold" : ""}`}>
            {"popular" in p && <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-black">{d.popular}</span>}
            <h3 className="mt-3 text-xl font-semibold">{planName[p.id][locale]}</h3>
            <p className="mt-4 text-4xl font-bold">{aed(p.price, locale)} <span className="text-sm font-normal text-muted">{d.perMonth}</span></p>
            <p className="mt-2 text-sm text-muted">{p.credits.toLocaleString(locale === "ar" ? "ar-AE" : "en-AE")} {d.credits}</p>
            <Link href={`/${locale}/signup`} className={`btn mt-6 w-full ${"popular" in p ? "btn-gold" : "btn-ghost"}`}>{d.choose}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Faq({ locale }: { locale: Locale }) {
  const d = t(locale);
  const qs = [[d.q1, d.a1], [d.q2, d.a2], [d.q3, d.a3], [d.q4, d.a4]];
  return (
    <section className="section max-w-3xl">
      <h2 className="text-center text-3xl font-semibold md:text-4xl">{d.faqTitle}</h2>
      <div className="mt-8 divide-y divide-line border-y border-line">
        {qs.map(([q, a]) => (
          <details key={q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">{q}<span className="text-gold transition group-open:rotate-45">+</span></summary>
            <p className="mt-3 text-sm text-muted">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
