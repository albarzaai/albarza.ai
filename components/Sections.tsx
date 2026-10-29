import Link from "next/link";
import { HERO_LIGHT, gallery } from "@/lib/media";
import { StepCards } from "./StepCards";
import { ModelShowcase } from "./ModelShowcase";
import { Icon } from "./Icon";
import { faqs, features, testimonials, toolTitles } from "@/lib/content";
import { plans, planName, t } from "@/lib/dict";
import { aed, type Locale } from "@/lib/i18n";

const Start = ({ locale, label }: { locale: Locale; label?: string }) => <Link href={`/${locale}/signup`} className="btn btn-gold">{label ?? t(locale).startCreating}</Link>;
const img = gallery;
const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="text-3xl font-semibold leading-tight md:text-[40px]">{children}</h2>;

export function Models({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="section text-center">
      <H2>{d.modelsTitle}</H2>
      <p className="mx-auto mt-4 max-w-2xl text-muted">{d.modelsSub}</p>
      <div className="mt-6"><Start locale={locale} /></div>
      <ModelShowcase locale={locale} />
    </section>
  );
}

export function HowTo({ locale }: { locale: Locale }) {
  const d = t(locale);
  const steps = [[d.how1, d.how1d], [d.how2, d.how2d], [d.how3, d.how3d]];
  return (
    <section className="section">
      <H2>{d.howTitle}</H2>
      <p className="mt-4 max-w-3xl text-muted">{d.howSub}</p>
      <div className="mt-6"><Start locale={locale} /></div>
      <div className="mt-12"><StepCards locale={locale} items={steps.map(([title, desc]) => ({ title, desc }))} /></div>
    </section>
  );
}

export function Features({ locale }: { locale: Locale }) {
  return (
    <section className="section pt-0">
      <div className="grid gap-4 md:grid-cols-2">
        {features.map((f, i) => (
          <article key={f.t.en} className="card flex overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(i + 6)} alt="" width={400} height={300} loading="lazy" className="hidden h-auto w-40 shrink-0 object-cover sm:block" />
            <div className="p-6"><h3 className="font-semibold">{f.t[locale]}</h3><p className="mt-2 text-sm leading-6 text-muted">{f.d[locale]}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Why({ locale }: { locale: Locale }) {
  const d = t(locale);
  const items = [[d.w1, d.w1d], [d.w2, d.w2d], [d.w3, d.w3d], [d.w4, d.w4d], [d.w5, d.w5d], [d.w6, d.w6d]];
  return (
    <section className="section grid gap-12 lg:grid-cols-2">
      <div>
        <H2>{d.whyTitle}</H2>
        <p className="mt-4 max-w-md text-muted">{d.whyIntro}</p>
        <div className="mt-6"><Start locale={locale} /></div>
      </div>
      <div className="space-y-3">
        {items.map(([title, text]) => (
          <div key={title} className="card p-5"><h3 className="text-sm font-semibold"><span className="text-gold">›</span> {title}</h3><p className="mt-1.5 ps-4 text-xs leading-6 text-muted">{text}</p></div>
        ))}
      </div>
    </section>
  );
}

export function TryModel({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="section pt-0">
      <div className="relative overflow-hidden rounded-3xl border border-line px-6 py-20 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_LIGHT} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="relative"><H2>{d.tryModelTitle}</H2><p className="mx-auto mt-4 max-w-xl text-ink/80">{d.tryModelSub}</p><div className="mt-6"><Start locale={locale} /></div></div>
      </div>
    </section>
  );
}

export function Toolkit({ locale }: { locale: Locale }) {
  const d = t(locale);
  const tools = Object.values(toolTitles);
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1200px] px-5 text-center"><H2>{d.anyTitle}</H2><p className="mx-auto mt-4 max-w-2xl text-muted">{d.anySub}</p></div>
      <div className="noscroll mt-10 flex snap-x gap-5 overflow-x-auto px-5">
        {tools.map((name, i) => (
          <article key={name.en} className="relative h-[440px] w-[78vw] max-w-[640px] shrink-0 snap-center overflow-hidden rounded-3xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(i + 1)} alt="" width={400} height={500} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="glass absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl p-4">
              <h3 className="font-semibold">{name[locale]}</h3>
              <Link href={`/${locale}/signup`} className="btn btn-white !py-1.5">{d.tryTool}</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Community({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="section">
      <div className="text-center"><H2>{d.communityTitle}</H2><p className="mx-auto mt-4 max-w-2xl text-muted">{d.communitySub}</p></div>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((x) => (
          <figure key={x.t.en} className="card p-6">
            <h3 className="font-semibold">{x.t[locale]}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{x.d[locale]}</p>
            <figcaption className="mt-5 flex items-center gap-3 text-sm"><span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-black"><Icon n="mic" size={14} /></span>{x.n[locale]}</figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted/60">{d.sampleNote}</p>
    </section>
  );
}

export function AppPromo({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="section">
      <H2>{d.appTitle}</H2>
      <p className="mt-4 max-w-xl text-muted">{d.appSub}</p>
      <p className="mt-3 text-sm text-gold-hi">{d.appSoon}</p>
    </section>
  );
}

export function Takeaways({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="section max-w-3xl">
      <div className="text-center"><H2>{d.takeTitle}</H2></div>
      <ul className="mt-8 space-y-3 text-sm leading-7 text-muted">
        {[d.k1, d.k2, d.k3, d.k4].map((k) => <li key={k} className="flex gap-3"><span className="text-gold">•</span>{k}</li>)}
      </ul>
    </section>
  );
}

export function Pricing({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="section">
      <div className="text-center"><H2>{d.pricingTitle}</H2><p className="mt-3 text-sm text-muted">{d.vatNote}</p></div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.id} className={`card p-7 ${"popular" in p ? "!border-gold" : ""}`}>
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
  return (
    <section className="section max-w-3xl">
      <div className="text-center"><H2>{d.faqTitle}</H2></div>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {faqs.map((f, i) => (
          <details key={f.q.en} className="group py-5" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">{f.q[locale]}<span className="text-gold transition group-open:rotate-45">+</span></summary>
            <p className="mt-3 text-sm leading-7 text-muted">{f.a[locale]}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Cta({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="relative overflow-hidden py-28 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_LIGHT} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="relative"><H2>{d.designTitle}</H2><p className="mt-3 text-ink/80">{d.designSub}</p><div className="mt-8"><Start locale={locale} label={d.signupBtn} /></div></div>
    </section>
  );
}
