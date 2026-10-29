import Link from "next/link";
import { HERO_LIGHT, gallery } from "@/lib/media";
import { Icon } from "./Icon";
import { Carousel } from "./Carousel";
import { features } from "@/lib/content";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

// Section sizes follow the Davinci video-generator page: 760px hero, 1260px cards, 1440px feature panel.
const copy = {
  steps: { ar: "أنشئ فيديو حتى ١٥ ثانية بسهولة", en: "Easily generate videos up to 15 sec" },
  step: { ar: "الخطوة", en: "Step" },
  s1: { ar: "أضف صورة مرجعية", en: "Input image reference" },
  s1d: { ar: "ارفع صوراً مرجعية لتوجيه رؤيتك.", en: "Upload reference images to guide your vision." },
  s2: { ar: "اكتب الوصف", en: "Write the prompt" },
  s2d: { ar: "استخدم لغة طبيعية لوصف المشهد والحركة.", en: "Use natural language to describe your scene and motion." },
  s3: { ar: "اختر نموذجاً وأنشئ", en: "Pick a model and generate" },
  s3d: { ar: "اضغط إنشاء واحصل على فيديو عالي الدقة خلال ثوانٍ.", en: "Click Generate and receive high-fidelity video in seconds." },
  yourImage: { ar: "صورتك", en: "Your Image" },
  prompt: { ar: "مع تمدّد الأجنحة الميكانيكية، تنفجر الأضواء عبر الفجوات وتُلقي أشعة حادة على…", en: "As the mechanical wings fully extend, light bursts through the gaps in the metal feathers, casting sharp beams across the h…" },
  builtLead: { ar: "مصمّم لدقة 4K، وجاهز لكل شيء.", en: "Built for 4K, made for Everything." },
  builtRest: { ar: "من الإعلانات إلى الأفلام القصيرة والتواصل الاجتماعي والتجارة الإلكترونية — يجمع Veo 3.1 بين تفاصيل 4K بجودة البث وصوت متزامن مولَّد أصلياً.", en: "From ads to short films, social, and e-commerce — Veo 3.1 pairs broadcast-ready 4K detail with natively generated, perfectly synced sound." },
  tryVeo: { ar: "جرّب Veo 3.1", en: "Try Veo 3.1" },
  pipeLead: { ar: "نموذج واحد لكل المسار.", en: "One model for the pipeline." },
  pipeRest: { ar: "من النص والمراجع إلى فيديو متعدد اللقطات بصوت متزامن وشخصيات متسقة وتحكم سينمائي بالكاميرا", en: "From text and references to multi-shot video with synchronized audio, consistent characters and cinematic camera control" },
  whyTitle: { ar: "لماذا يختار المبدعون مولّد الفيديو في البرزة", en: "Why creators choose Albarza's AI video generator" },
};
const c = (k: keyof typeof copy, l: Locale) => copy[k][l];

export function VideoHero({ locale, video }: { locale: Locale; video?: string }) {
  const d = t(locale);
  const pill = "inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-ink/5 px-3.5 py-2 text-xs font-medium hover:bg-ink/10";
  return (
    <section className="relative flex min-h-[620px] items-center justify-center overflow-hidden bg-[#fdf8ec] md:h-[760px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_LIGHT} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      {video && <video src={video} poster={HERO_LIGHT} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/10 to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(253,248,236,0.88),rgba(253,248,236,0.55)_55%,transparent_80%)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1000px] flex-col items-center px-5 pt-16 text-center">
        <h1 className="max-w-[660px] text-[40px] font-bold leading-[1.1] md:text-[56px] [text-shadow:0_1px_18px_rgba(253,248,236,0.9)]">{d.heroTitle}</h1>
        <p className="mt-5 max-w-[520px] text-sm leading-6 font-medium text-ink md:text-base [text-shadow:0_1px_12px_rgba(253,248,236,0.9)]">{d.heroSub}</p>
        <form action={`/${locale}/signup`} className="mt-10 w-full max-w-[860px] rounded-3xl border border-ink/10 bg-white/75 p-4 text-start shadow-sm backdrop-blur-md">
          <textarea name="prompt" rows={2} maxLength={1000} placeholder={locale === "ar" ? "صِف الفيديو الذي تريده" : "Describe your video"} className="min-h-[56px] w-full resize-none bg-transparent px-1 text-sm outline-none placeholder:text-ink/45" />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link href={`/${locale}/signup`} className={pill}><Icon n="wave" size={14} />Seedance 2.0 Fast<Icon n="chev" size={12} /></Link>
            <Link href={`/${locale}/signup`} className={pill}>{d.auto} · {d.sec4} · {d.res}<Icon n="chev" size={12} /></Link>
            <Link href={`/${locale}/signup`} className={pill}><Icon n="enhance" size={14} />{locale === "ar" ? "إيقاف" : "Off"}</Link>
            <button className="btn btn-gold ms-auto !px-6 !py-2.5">{d.generate}</button>
          </div>
        </form>
      </div>
    </section>
  );
}

const Mock = ({ children }: { children: React.ReactNode }) => <div className="relative grid aspect-[1.13] place-items-center overflow-hidden rounded-2xl border border-line bg-surface-2 p-5">{children}</div>;

export function VideoSteps({ locale }: { locale: Locale }) {
  const cols: [string, string, React.ReactNode][] = [
    [c("s1", locale), c("s1d", locale), (
      <Mock key="1">
        <div className="w-[64%] rounded-2xl border border-line bg-white/60 p-4 text-center">
          <div className="grid aspect-[1.3] place-items-center rounded-xl border border-dashed border-ink/20"><Icon n="plus" size={26} className="text-ink/40" /></div>
          <p className="mt-3 text-xs font-medium">{c("yourImage", locale)}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gallery(3)} alt="" width={90} height={90} loading="lazy" className="absolute start-[12%] top-[34%] h-[90px] w-[90px] -rotate-6 rounded-lg border-4 border-white object-cover shadow-lg" />
      </Mock>)],
    [c("s2", locale), c("s2d", locale), <Mock key="2"><p className="text-[19px] font-semibold leading-snug text-ink/45">{c("prompt", locale)}</p></Mock>],
    [c("s3", locale), c("s3d", locale), (
      <Mock key="3">
        <div className="flex h-full w-full flex-col items-center justify-between gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gallery(5)} alt="" width={300} height={200} loading="lazy" className="h-[68%] w-full rounded-xl object-cover" />
          <div className="flex gap-3 rounded-xl bg-ink/5 px-4 py-2 text-ink/70"><Icon n="download" size={16} /><Icon n="spark" size={16} /><Icon n="heart" size={16} /><Icon n="trash" size={16} /></div>
        </div>
      </Mock>)],
  ];
  return (
    <section className="mx-auto max-w-[1300px] px-5 py-20">
      <h2 className="text-center text-2xl font-bold uppercase tracking-tight text-ink/85 md:text-4xl">{c("steps", locale)}</h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cols.map(([title, text, mock], i) => (
          <div key={title} className="text-center">
            {mock}
            <span className="mt-7 inline-block rounded-full bg-ink/10 px-3 py-1 text-[11px] font-semibold uppercase">{c("step", locale)} {i + 1}</span>
            <h3 className="mt-3 text-[17px] font-bold uppercase">{title}</h3>
            <p className="mx-auto mt-2 max-w-[300px] text-xs leading-5 text-muted">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function VideoBuilt({ locale }: { locale: Locale }) {
  return (
    <section className="mx-auto max-w-[1300px] px-5 pb-20">
      <p className="max-w-[1000px] text-base leading-7 text-muted"><strong className="font-semibold text-ink">{c("builtLead", locale)}</strong> {c("builtRest", locale)}</p>
      <Link href={`/${locale}/video-generator/veo-3-1`} className="btn btn-gold mt-5">{c("tryVeo", locale)}</Link>
      <div className="mt-10">
        <Carousel label="Showcase">
          {[7, 2, 9, 4].map((n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={n} src={gallery(n)} alt="" width={1260} height={708} loading="lazy" className="aspect-video w-full shrink-0 snap-start rounded-[28px] border border-line object-cover md:w-[calc(100%-2rem)]" />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export function VideoPipeline({ locale }: { locale: Locale }) {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-20">
      <div className="rounded-[28px] border border-line bg-surface px-6 py-14 md:px-20 md:py-20">
        <p className="max-w-[560px] text-base leading-6 text-muted"><strong className="font-semibold text-ink">{c("pipeLead", locale)}</strong> {c("pipeRest", locale)}</p>
        <div className="mt-12 grid gap-x-4 gap-y-10 md:grid-cols-2">
          {features.map((f, i) => (
            <article key={f.t.en}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery(i + 6)} alt="" width={620} height={330} loading="lazy" className="aspect-[1.86] w-full rounded-2xl object-cover" />
              <h3 className="mt-4 text-xl font-medium">{f.t[locale]}</h3>
              <p className="mt-2 text-[13px] leading-5 text-muted">{f.d[locale]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VideoWhy({ locale }: { locale: Locale }) {
  const d = t(locale);
  const items = [[d.w1, d.w1d], [d.w2, d.w2d], [d.w3, d.w3d], [d.w4, d.w4d]];
  return (
    <section className="mx-auto max-w-[1300px] px-5 pb-24">
      <h2 className="max-w-[900px] text-2xl font-bold uppercase leading-tight tracking-tight text-ink/85 md:text-[30px]">{c("whyTitle", locale)}</h2>
      <p className="mt-3 max-w-[820px] text-sm font-medium text-muted">{d.whyIntro}</p>
      <Link href={`/${locale}/signup`} className="btn btn-gold mt-5">{d.startCreating}</Link>
      <div className="mt-10">
        <Carousel label={c("whyTitle", locale)}>
          {items.map(([title, text], i) => (
            <article key={title} className="w-[min(86vw,780px)] shrink-0 snap-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery(i + 3)} alt="" width={780} height={440} loading="lazy" className="aspect-[1.77] w-full rounded-[24px] border border-line object-cover" />
              <p className="mt-5 text-lg leading-7 text-muted"><strong className="font-semibold text-ink">{title}.</strong> {text}</p>
            </article>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
