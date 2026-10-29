import Link from "next/link";
import { preload } from "react-dom";
import { HeroVideo } from "./HeroVideo";
import { heroPoster } from "@/lib/media";
import { FontReveal } from "./FontReveal";
import { Icon } from "./Icon";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

// The prompt bar is a plain form posting to signup; all validation happens on the server.
export function Hero({ locale, variant = "video" }: { locale: Locale; variant?: "video" | "image" }) {
  const d = t(locale);
  preload(heroPoster(variant === "image" ? "ig-hero" : "hero-abudhabi"), { as: "image", fetchPriority: "high" });
  return (
    <section className="relative flex min-h-[100svh] items-end justify-center overflow-hidden bg-[#3a3028]">
      <HeroVideo slug={variant === "image" ? "ig-hero" : "hero-abudhabi"} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(8,6,3,0.62),rgba(8,6,3,0.4)_55%,transparent_80%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-b from-transparent via-[#fdf8ec]/55 to-[var(--color-bg)]" />
      <FontReveal className="relative z-10 mx-auto flex w-full max-w-[1000px] flex-col items-center px-5 pb-40 text-center">
        <h1 className="max-w-[860px] text-balance text-[34px] font-bold leading-[1.15] tracking-tight text-white sm:text-5xl md:text-[64px] md:leading-[1.1] [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">{variant === "image" ? d.imgGenTitle : d.heroTitle}</h1>
        <p className="mx-auto mt-5 max-w-[680px] text-balance text-[15px] font-normal leading-7 text-white/90 md:text-lg md:leading-8 [text-shadow:0_1px_14px_rgba(0,0,0,0.6)]">{variant === "image" ? d.imgGenSub : d.heroLong}</p>
        <form action={`/${locale}/signup`} className="glass mt-8 flex w-full max-w-2xl items-center gap-3 rounded-full py-2 ps-7 pe-2">
          <input name="prompt" maxLength={1000} placeholder={variant === "image" ? d.imgPromptPh : d.promptPh} className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-ink/50" />
          <button className="btn btn-white"><Icon n="spark" size={16} />{d.generate}</button>
        </form>
      </FontReveal>
    </section>
  );
}
