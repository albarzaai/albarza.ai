import { Icon } from "./Icon";
import type { Locale } from "@/lib/i18n";

const L = {
  upload: { ar: "ارفع صورة", en: "Upload an image" },
  yourImage: { ar: "صورتك", en: "Your Image" },
  hint: { ar: "أضف الصورة التي تريد تحريكها", en: "Add the image you want to animate" },
  step: { ar: "الخطوة", en: "Step" },
  model: { ar: "Seedance 2.0 · ١٠ ث · 1080p", en: "Seedance 2.0 · 10s · 1080p" },
  done: { ar: "اكتمل", en: "Ready" },
};
const PROMPT = {
  ar: [["مع غروب الشمس، ", false], ["تنساب سفينة شراعية", true], [" بيضاء على صفحة الماء الهادئة، بينما ", false], ["تتوهج أضواء الأفق", true], [" خلفها بالذهب الدافئ…", false]],
  en: [["As the sun sets, ", false], ["a white dhow glides", true], [" across the calm water while ", false], ["the skyline glows", true], [" behind it in warm gold…", false]],
} as const;

const shell = "relative aspect-[406/358] overflow-hidden rounded-2xl border border-line bg-surface-2";

function UploadCard({ locale }: { locale: Locale }) {
  return (
    <div className={`${shell} grid place-items-center`}>
      <div className="w-[74%] rounded-2xl border border-line bg-white/70 p-2.5 shadow-sm">
        <div className="flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-muted"><Icon n="image" size={13} />{L.upload[locale]}</div>
        <div className="grid h-[150px] place-items-center rounded-xl border border-dashed border-gold/60 bg-white/80 text-center">
          <div>
            <Icon n="plus" size={34} className="mx-auto text-gold" />
            <p className="mt-3 text-[13px] font-medium">{L.yourImage[locale]}</p>
            <p className="mt-0.5 text-[10px] text-muted">{L.hint[locale]}</p>
          </div>
        </div>
      </div>
      <div className="step-float absolute start-[3%] top-[52%] w-[30%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/hero-abudhabi.jpg" alt="" width={140} height={100} loading="lazy" decoding="async" className="aspect-[1.3] w-full rotate-[-8deg] rounded-xl border-[5px] border-white object-cover shadow-xl" />
        <span className="absolute -top-3 start-[-6px] grid size-7 place-items-center rounded-full bg-gold text-xs font-bold text-white shadow">1</span>
        <svg viewBox="0 0 24 24" className="absolute -bottom-3 end-[-4px] size-8 drop-shadow rtl:-scale-x-100" aria-hidden><path d="M5 3l14 8-6 1.5L9.5 19z" fill="#16120a" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}

function PromptCard({ locale }: { locale: Locale }) {
  return (
    <div className={`${shell} p-7 text-start`}>
      <p className="text-[21px] font-semibold leading-[1.4] tracking-tight text-ink/40">
        {PROMPT[locale].map(([text, hot], i) => <span key={i} className={hot ? "text-ink" : undefined}>{text}</span>)}
        <span className="step-caret ms-0.5 inline-block h-[1em] w-[2px] translate-y-[3px] bg-gold" />
      </p>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface-2 to-transparent" />
    </div>
  );
}

function ResultCard({ locale }: { locale: Locale }) {
  return (
    <div className={`${shell} flex flex-col`}>
      <div className="relative m-3 mb-0 flex-1 overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/showcase-gulf.jpg" alt="" width={400} height={225} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
        <span className="absolute start-2.5 top-2.5 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">{L.model[locale]}</span>
        <span className="step-pulse absolute inset-0 m-auto grid size-12 place-items-center rounded-full bg-white/85 text-ink shadow-lg"><Icon n="play" size={18} /></span>
      </div>
      <div className="m-3 flex w-fit gap-1 rounded-xl border border-line bg-white/70 p-1.5 text-ink/70">
        {(["download", "spark", "heart", "trash"] as const).map((n, i) => (
          <span key={n} className={`grid size-9 place-items-center rounded-lg ${i === 0 ? "bg-ink/8 text-ink" : ""}`}><Icon n={n} size={17} /></span>
        ))}
      </div>
    </div>
  );
}

// Three Davinci-style step cards (406:358 art, centred STEP pill, title, description) drawn in the Albarza palette.
export function StepCards({ locale, items }: { locale: Locale; items: { title: string; desc: string }[] }) {
  const art = [<UploadCard key="a" locale={locale} />, <PromptCard key="b" locale={locale} />, <ResultCard key="c" locale={locale} />];
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((it, i) => (
        <div key={it.title} className="text-center">
          {art[i]}
          <span className="mt-7 inline-block rounded-full bg-ink/8 px-3.5 py-1 text-[13px] font-bold uppercase">{L.step[locale]} {i + 1}</span>
          <h3 className="mt-3 text-[22px] font-bold uppercase leading-tight">{it.title}</h3>
          <p className="mx-auto mt-2 max-w-[320px] text-sm leading-6 text-muted">{it.desc}</p>
        </div>
      ))}
    </div>
  );
}
