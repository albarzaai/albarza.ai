import Link from "next/link";
import { FontReveal } from "./FontReveal";
import { HeroVideo } from "./HeroVideo";
import { Carousel } from "./Carousel";
import { ScrollDrift } from "./ScrollDrift";
import { PlanName, planAccent } from "./PlanName";
import { SuiteTabs } from "./SuiteTabs";
import { Icon } from "./Icon";
import { H, channels, featured, homeFaqs, modelNames, whyCards } from "@/lib/home-copy";
import { gallery, pic } from "@/lib/media";
import { plans, planFeatures, t } from "@/lib/dict";
import { aed, type Locale } from "@/lib/i18n";

const btnGold = "btn btn-gold";
const Title = ({ children, center = true }: { children: React.ReactNode; center?: boolean }) => <h2 className={`text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[44px] ${center ? "text-center" : ""}`}>{children}</h2>;
const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <div className={`mx-auto max-w-[1440px] px-4 lg:px-[90px] ${className}`}>{children}</div>;

export function HomeHero({ locale }: { locale: Locale }) {
  return (
    <section className="relative flex min-h-[640px] items-center justify-center overflow-hidden bg-[#3a3028] md:h-[760px]">
      <HeroVideo slug="hero-abudhabi" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-b from-transparent via-[#fdf8ec]/55 to-[var(--color-bg)]" />
      <FontReveal className="relative z-10 mx-auto flex max-w-[900px] flex-col items-center px-5 pb-24 pt-20 text-center text-white">
        <h1 className="text-balance text-[38px] font-bold leading-[1.1] tracking-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.5)] md:text-[64px]">{H.title[locale]}</h1>
        <p className="mt-5 max-w-[620px] text-balance text-[15px] leading-7 text-white/90 [text-shadow:0_1px_14px_rgba(0,0,0,0.6)] md:text-lg md:leading-8">{H.sub[locale]}</p>
        <Link href={`/${locale}/signup`} className={`${btnGold} mt-8 !px-8 !py-3.5 text-base`}>{H.cta[locale]}</Link>
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm font-medium text-white/90">
          {modelNames.map((n) => <li key={n} className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-gold" />{n}</li>)}
        </ul>
      </FontReveal>
    </section>
  );
}

export function Collage({ locale }: { locale: Locale }) {
  const tile = "absolute overflow-hidden rounded-2xl border border-line shadow-lg will-change-transform [transform:translate3d(0,calc((0.5-var(--p,0.5))*var(--dy,0px)),0)]";
  const im = (n: number) => pic("home-collage", n);
  return (
    <section className="pb-8 pt-4">
      <Wrap>
        <ScrollDrift className="relative mx-auto aspect-[1.3] max-w-[1180px] md:aspect-[1.9]">
          {/* eslint-disable @next/next/no-img-element */}
          <div className={`${tile} hidden md:block start-[5%] top-[2%] h-[36%] w-[24%] [--dy:-150px]`}><img src={im(2)} alt="" loading="lazy" decoding="async" className="size-full object-cover" /></div>
          <div className={`${tile} hidden md:block end-[3%] top-[18%] h-[28%] w-[14%] [--dy:210px]`}><img src={im(3)} alt="" loading="lazy" decoding="async" className="size-full object-cover" /></div>
          <div className={`${tile} hidden md:block start-[8%] bottom-[8%] h-[26%] w-[12%] [--dy:260px]`}><img src={im(4)} alt="" loading="lazy" decoding="async" className="size-full object-cover" /></div>
          <div className={`${tile} hidden md:block end-[1%] bottom-[10%] h-[20%] w-[13%] [--dy:-190px]`}><img src={im(5)} alt="" loading="lazy" decoding="async" className="size-full object-cover" /></div>
          <div className={`${tile} inset-x-[3%] top-0 bottom-0 z-10 md:inset-x-[20%] md:top-[12%] !rounded-[22px] [--dy:60px] md:[transform:translate3d(0,calc((0.5-var(--p,0.5))*var(--dy)),0)_scale(calc(0.9+0.1*min(1,var(--p,0.5)*2.4)))]`}><img src={im(1)} alt="" loading="lazy" decoding="async" className="size-full object-cover" /></div>
          {/* eslint-enable @next/next/no-img-element */}
        </ScrollDrift>
        <div className="mx-auto mt-14 max-w-[760px] text-center">
          <p className="text-2xl font-semibold md:text-[28px]">{H.tag1[locale]}</p>
          <p className="mt-2 text-lg text-muted md:text-xl">{H.tag2[locale]}</p>
        </div>
      </Wrap>
    </section>
  );
}

export function FeaturedModels({ locale }: { locale: Locale }) {
  return (
    <section className="py-16">
      <Wrap>
        <div className="rounded-[32px] bg-surface px-5 py-12 md:px-14">
          <h2 className="text-balance text-[28px] font-semibold leading-tight tracking-tight md:text-[40px]"><span className="text-muted">{H.modelsA[locale]}</span><br />{H.modelsB[locale]}</h2>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">{modelNames.map((n) => <li key={n}>{n}</li>)}</ul>
          <p className="mt-10 text-sm font-medium">{H.featured[locale]}</p>
          <div className="mt-4">
            <Carousel label={H.featured[locale]} gap="gap-3">
              {featured.map((f, i) => (
                <article key={f.name} className="relative aspect-[3/4] w-[245px] shrink-0 snap-start overflow-hidden rounded-2xl bg-ink md:w-[300px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pic("feat", i + 1)} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                  <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 text-sm font-medium text-white"><Icon n="spark" size={14} />{f.name}</span>
                  <p className="absolute inset-x-5 bottom-5 text-sm leading-5 text-white">{f.cap[locale]}</p>
                </article>
              ))}
            </Carousel>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

export function Suite({ locale }: { locale: Locale }) {
  return (
    <section className="py-16">
      <Wrap>
        <Title>{H.suite[locale]}</Title>
        <SuiteTabs locale={locale} />
      </Wrap>
    </section>
  );
}

export function Channels({ locale }: { locale: Locale }) {
  return (
    <section className="py-16">
      <Wrap>
        <span className="inline-flex items-center gap-2 text-lg font-bold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.svg" alt="" width={24} height={30} />Albarza<span className="rounded-md bg-ink/8 px-2 py-0.5 text-[11px] font-semibold">Pro</span>
        </span>
        <h2 className="mt-5 text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[44px]">{H.channelsTitle[locale]}</h2>
        <p className="mt-4 max-w-[640px] text-base leading-7 text-muted">{H.channelsText[locale]}</p>
        <Link href={`/${locale}/signup`} className="mt-4 inline-flex items-center gap-1 font-medium text-gold-hi">{H.channelsLink[locale]} <span aria-hidden className="rtl:rotate-180">›</span></Link>
        <div className="mt-10">
          <Carousel label={H.channelsTitle[locale]} gap="gap-4">
            {channels.map((c, i) => (
              <article key={c.lead.en} className="w-[280px] shrink-0 snap-start md:w-[300px]">
                <div className="aspect-[3/3.8] overflow-hidden rounded-2xl border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pic("channel", i + 1)} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
                </div>
                <p className="mt-4 text-sm leading-6 text-muted"><strong className="font-semibold text-ink">{c.lead[locale]}</strong> {c.text[locale]}</p>
              </article>
            ))}
          </Carousel>
        </div>
      </Wrap>
    </section>
  );
}

function Phone() {
  return (
    <div className="relative aspect-[9/19] w-[230px] overflow-hidden rounded-[36px] border-[7px] border-ink bg-ink shadow-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={gallery(6)} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      <span className="absolute inset-x-0 top-2 mx-auto h-4 w-16 rounded-full bg-ink" />
      <div className="absolute inset-x-2.5 bottom-3 flex items-center gap-2 rounded-full bg-white/85 py-1.5 ps-3 pe-1.5 text-[10px] text-ink/60 backdrop-blur-md"><span className="flex-1 truncate">…</span><span className="grid size-6 place-items-center rounded-full bg-gold text-white"><Icon n="spark" size={11} /></span></div>
    </div>
  );
}

export function GoApp({ locale }: { locale: Locale }) {
  const badge = "inline-flex h-12 cursor-not-allowed items-center gap-2.5 rounded-full bg-ink/10 px-6 text-sm font-medium text-ink/70";
  return (
    <section className="py-16">
      <Wrap>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-[30px] font-semibold tracking-tight md:text-[40px]">{H.appTitle[locale]}</h2>
            <p className="mt-4 max-w-[480px] text-base leading-7 text-muted">{H.appSub[locale]}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className={badge} aria-disabled>{locale === "ar" ? "iOS" : "iOS"} <b className="rounded-full bg-gold/25 px-2.5 py-0.5 text-xs font-semibold text-gold-hi">{H.soon[locale]}</b></span>
              <span className={badge} aria-disabled>Android <b className="rounded-full bg-gold/25 px-2.5 py-0.5 text-xs font-semibold text-gold-hi">{H.soon[locale]}</b></span>
            </div>
            <p className="mt-4 text-sm text-gold-hi">{H.appSoon[locale]}</p>
          </div>
          <div className="relative grid aspect-[1.06] place-items-center overflow-hidden rounded-[32px] bg-gradient-to-br from-[#f6ead0] via-[#efe0bd] to-[#e8c987]">
            <Phone />
          </div>
        </div>
      </Wrap>
    </section>
  );
}

export function WhyChoose({ locale }: { locale: Locale }) {
  return (
    <section className="py-16">
      <Wrap>
        <Title>{H.whyTitle[locale]}</Title>
        <p className="mt-3 text-center text-muted">{H.whySub[locale]}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {whyCards.map((c) => (
            <article key={c.t.en} className="rounded-3xl border border-line bg-surface p-8">
              <span className="grid size-10 place-items-center rounded-xl bg-gold/15 text-gold-hi"><Icon n={c.icon} size={20} /></span>
              <h3 className="mt-6 text-base font-semibold">{c.t[locale]}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{c.d[locale]}</p>
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

export function Plans({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="py-16">
      <Wrap>
        <Title>{H.planTitle[locale]}</Title>
        <p className="mt-3 text-center text-muted">{H.planSub[locale]}</p>
        <p className="mt-1 text-center text-xs text-muted">{d.vatNote}</p>
        <div className="mx-auto mt-10 grid max-w-[1100px] gap-4 md:grid-cols-3">
          {plans.map((p) => {
            const pop = "popular" in p;
            return (
              <div key={p.id} className={`rounded-3xl border p-7 ${pop ? "border-gold bg-surface shadow-lg" : "border-line bg-surface"} ${planAccent[p.id] ?? ""}`}>
                <div className="flex items-center gap-2"><h3 className="text-lg font-semibold"><PlanName id={p.id} locale={locale} /></h3>{pop && <span className="rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-semibold text-black">{d.popular}</span>}</div>
                <p className="mt-5 text-4xl font-bold">{aed(p.price, locale)} <span className="text-sm font-normal text-muted">{d.perMonth}</span></p>
                <Link href={`/${locale}/signup`} className={`mt-6 block rounded-full py-3 text-center text-sm font-medium transition ${pop ? "bg-ink text-white hover:bg-ink/85" : "bg-white text-ink ring-1 ring-line hover:bg-ink/5"}`}>{d.choose}</Link>
                <p className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-sm"><Icon n="coins" size={16} className="text-gold-hi" />{p.credits.toLocaleString(locale === "ar" ? "ar-AE" : "en-AE")} {d.credits}</p>
                <ul className="mt-4 space-y-2.5 text-sm">{planFeatures[p.id][locale].map((f) => <li key={f} className="flex items-start gap-2"><span className="mt-0.5 text-gold">✓</span><span>{f}</span></li>)}</ul>
              </div>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}

export function HomeFaq({ locale }: { locale: Locale }) {
  return (
    <section className="mx-auto max-w-[680px] px-5 py-16">
      <Title>{H.faqTitle[locale]}</Title>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {homeFaqs.map((f, i) => (
          <details key={f.q.en} className="group py-5" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">{f.q[locale]}<span className="text-gold transition group-open:rotate-45">+</span></summary>
            <p className="mt-3 text-sm leading-7 text-muted">{f.a[locale]}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function HomeCta({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="relative overflow-hidden py-32 text-center text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={pic("home", "cta")} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative px-5">
        <h2 className="text-balance text-[32px] font-bold leading-tight tracking-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.4)] md:text-5xl">{d.designTitle}</h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/90">{d.designSub}</p>
        <Link href={`/${locale}/signup`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-medium text-black transition hover:bg-white/90">{d.signupBtn}<span aria-hidden className="rtl:rotate-180">→</span></Link>
      </div>
    </section>
  );
}
