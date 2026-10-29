import Link from "next/link";
import { gallery, pic } from "@/lib/media";
import { Carousel } from "./Carousel";
import { StepCards } from "./StepCards";
import { ModelShowcase } from "./ModelShowcase";
import { Icon } from "./Icon";
import { faqs, features, testimonials, toolTitles } from "@/lib/content";
import { plans, planName, t } from "@/lib/dict";
import { aed, type Locale } from "@/lib/i18n";

const Start = ({ locale, label }: { locale: Locale; label?: string }) => <Link href={`/${locale}/signup`} className="btn btn-gold">{label ?? t(locale).startCreating}</Link>;
const img = gallery;
// One picture per tool card, matched to what the tool does (order follows toolTitles).
const TOOL_IMG = [gallery(9), gallery(11), pic("card", 1), gallery(8), pic("card", 6), pic("card", 3)];
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
      <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
        {features.map((f, i) => (
          <article key={f.t.en} className="card flex h-full min-h-[200px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery(i + 1)} alt="" width={400} height={300} loading="lazy" decoding="async" className="hidden h-full w-[190px] shrink-0 object-cover sm:block" />
            <div className="flex flex-col justify-center p-6"><h3 className="text-lg font-semibold">{f.t[locale]}</h3><p className="mt-2 text-sm leading-6 text-muted">{f.d[locale]}</p></div>
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
        <img src={pic("bg", "cta")} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-70" />
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
            <img src={TOOL_IMG[i % TOOL_IMG.length]} alt="" width={640} height={440} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
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
      <div className="mt-12">
        <Carousel label={d.communityTitle} gap="gap-4">
          {testimonials.map((x) => (
            <figure key={x.t.en} className="flex min-h-[260px] w-[306px] shrink-0 snap-start flex-col rounded-2xl border border-line bg-surface p-5 text-start">
              <div className="flex gap-0.5 text-gold" aria-hidden>{"★★★★★".split("").map((c, k) => <span key={k}>{c}</span>)}</div>
              <h3 className="mt-3 text-base font-semibold leading-snug">{x.t[locale]}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{x.d[locale]}</p>
              <figcaption className="mt-auto flex items-center gap-3 pt-5 text-sm"><span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-gold to-[#8a6a2a] text-sm font-semibold text-white">{x.n[locale].trim().charAt(0)}</span>{x.n[locale]}</figcaption>
            </figure>
          ))}
        </Carousel>
      </div>
      <p className="mt-4 text-center text-xs text-muted/60">{d.sampleNote}</p>
    </section>
  );
}

function Phone({ src, className = "" }: { src: string; className?: string }) {
  return (
    <div className={`relative aspect-[9/19] w-[210px] overflow-hidden rounded-[34px] border-[6px] border-ink bg-ink shadow-2xl ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      <span className="absolute inset-x-0 top-2 mx-auto h-4 w-16 rounded-full bg-ink" />
      <div className="absolute inset-x-2.5 bottom-3 flex items-center gap-2 rounded-full bg-white/85 py-1.5 ps-3 pe-1.5 text-[10px] text-ink/60 backdrop-blur-md"><span className="flex-1 truncate">Describe your idea…</span><span className="grid size-6 place-items-center rounded-full bg-gold text-white"><Icon n="spark" size={11} /></span></div>
    </div>
  );
}

export function AppPromo({ locale }: { locale: Locale }) {
  const d = t(locale);
  const badge = "inline-flex h-12 items-center gap-2 rounded-xl border border-line bg-ink px-5 text-sm font-medium text-white opacity-90";
  return (
    <section className="section">
      <div className="grid items-center gap-10 overflow-hidden rounded-3xl border border-line bg-surface px-6 py-12 md:grid-cols-2 md:px-14">
        <div>
          <H2>{d.appTitle}</H2>
          <p className="mt-4 max-w-md text-muted">{d.appSub}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <span className={badge} aria-disabled>App Store</span>
            <span className={badge} aria-disabled>Google Play</span>
          </div>
          <p className="mt-4 text-sm text-gold-hi">{d.appSoon}</p>
        </div>
        <div className="relative flex justify-center gap-5 md:justify-end">
          <Phone src={gallery(5)} className="mt-8" />
          <Phone src={gallery(10)} className="-mb-8 hidden sm:block" />
        </div>
      </div>
    </section>
  );
}

export function Takeaways({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="section max-w-3xl">
      <div className="text-center"><H2>{d.takeTitle}</H2></div>
      <ul className="mt-8 space-y-3 rounded-2xl border border-line bg-surface p-6 text-[15px] leading-7 text-muted md:p-8">
        {[d.k1, d.k2, d.k3, d.k4].map((k) => <li key={k} className="flex gap-3"><span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-gold text-white"><Icon n="spark" size={11} /></span>{k}</li>)}
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
    <section className="section max-w-[680px]">
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
      <img src={pic("bg", "feature")} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="relative px-5"><h2 className="text-balance text-[32px] font-bold leading-tight tracking-tight md:text-5xl">{d.designTitle}</h2><p className="mx-auto mt-4 max-w-xl text-base text-ink/80">{d.designSub}</p><div className="mt-8"><Start locale={locale} label={d.signupBtn} /></div></div>
    </section>
  );
}
