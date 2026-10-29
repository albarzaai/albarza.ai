import Link from "next/link";
import { models, plans, planName, t } from "@/lib/dict";
import { aed, type Locale } from "@/lib/i18n";

export function Models({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section id="models" className="section">
      <h2 className="text-3xl font-bold md:text-4xl">{d.modelsTitle}</h2>
      <p className="mt-3 max-w-2xl text-muted">{d.modelsSub}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {models.map(([id, name, desc], i) => (
          <article key={id} className="card group overflow-hidden transition hover:border-gold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/media/gallery-${(i % 12) + 1}.svg`} alt="" width={400} height={300} loading="lazy" className="arch mx-auto mt-4 h-44 w-[80%] object-cover" />
            <div className="space-y-2 p-4">
              <h3 className="font-semibold">{name}</h3>
              <p className="line-clamp-3 text-sm text-muted">{desc[locale]}</p>
              <Link href={`/${locale}/signup`} className="inline-block pt-1 text-sm font-semibold text-gold hover:text-gold-hi">{d.tryModel} →</Link>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10"><Link href={`/${locale}/signup`} className="btn btn-gold">{d.startCreating}</Link></div>
    </section>
  );
}

export function Steps({ locale }: { locale: Locale }) {
  const d = t(locale);
  const steps = [[d.step1, d.step1d], [d.step2, d.step2d], [d.step3, d.step3d]];
  return (
    <section className="section">
      <h2 className="text-3xl font-bold md:text-4xl">{d.stepsTitle}</h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map(([title, text], i) => (
          <div key={title} className="card p-6">
            <span className="text-xs font-semibold tracking-widest text-gold">{locale === "ar" ? "الخطوة" : "STEP"} {i + 1}</span>
            <h3 className="mt-3 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Features({ locale }: { locale: Locale }) {
  const d = t(locale);
  const items = [[d.f1, d.f1d], [d.f2, d.f2d], [d.f3, d.f3d], [d.f4, d.f4d]];
  return (
    <section id="tools" className="section">
      <h2 className="text-3xl font-bold md:text-4xl">{d.toolsTitle}</h2>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {items.map(([title, text], i) => (
          <div key={title} className="card flex gap-2 overflow-hidden p-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/media/gallery-${i + 9}.svg`} alt="" width={400} height={300} loading="lazy" className="arch m-4 h-32 w-24 shrink-0 object-cover" />
            <div className="p-5"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm text-muted">{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Why({ locale }: { locale: Locale }) {
  const d = t(locale);
  const items = [[d.w1, d.w1d], [d.w2, d.w2d], [d.w3, d.w3d], [d.w4, d.w4d]];
  return (
    <section className="section">
      <h2 className="text-3xl font-bold md:text-4xl">{d.whyTitle}</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([title, text]) => (
          <div key={title} className="border-s-2 border-gold ps-4"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm text-muted">{text}</p></div>
        ))}
      </div>
    </section>
  );
}

export function Pricing({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section id="pricing" className="section">
      <h2 className="text-3xl font-bold md:text-4xl">{d.pricingTitle}</h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.id} className={`card p-6 ${"popular" in p ? "border-gold" : ""}`}>
            {"popular" in p && <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-bg">{d.popular}</span>}
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
      <h2 className="text-3xl font-bold md:text-4xl">{d.faqTitle}</h2>
      <div className="mt-8 divide-y divide-line border-y border-line">
        {qs.map(([q, a]) => (
          <details key={q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">{q}<span className="text-gold transition group-open:rotate-45">+</span></summary>
            <p className="mt-3 text-sm text-muted">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Cta({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="section text-center">
      <div className="rounded-xl bg-gold px-6 py-14 text-ink">
        <h2 className="text-3xl font-bold">{d.ctaTitle}</h2>
        <p className="mt-3">{d.ctaSub}</p>
        <Link href={`/${locale}/signup`} className="btn mt-8 bg-ink text-bg hover:bg-white hover:text-ink">{d.startCreating}</Link>
      </div>
    </section>
  );
}
