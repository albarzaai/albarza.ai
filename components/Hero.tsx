import Link from "next/link";
import { preload } from "react-dom";
import { HeroVideo, HERO_POSTER } from "./HeroVideo";
import { Icon } from "./Icon";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

// The prompt bar is a plain form posting to signup; all validation happens on the server.
export function Hero({ locale, variant = "video" }: { locale: Locale; variant?: "video" | "image" }) {
  const d = t(locale);
  preload(HERO_POSTER, { as: "image", fetchPriority: "high" });
  return (
    <section className="relative flex min-h-[100svh] items-end justify-center overflow-hidden bg-[#fdf8ec]">
      <HeroVideo />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(8,6,3,0.62),rgba(8,6,3,0.4)_55%,transparent_80%)]" />
      <nav aria-label="breadcrumb" className="absolute start-10 top-[112px] z-10 hidden text-sm text-ink/80 md:block">
        <Link href={`/${locale}`}>{d.home}</Link> <span className="px-1">/</span> <span className="text-ink">{variant === "image" ? d.navAiImage : d.videoGenerator}</span>
      </nav>
      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col items-center px-5 pb-28 text-center">
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.55)]">{variant === "image" ? d.imgGenTitle : d.heroTitle}</h1>
        <p className="mt-4 text-[11px] font-medium leading-5 text-white sm:text-xs md:text-[13px] md:leading-6 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">{variant === "image" ? d.imgGenSub : d.heroLong}</p>
        <form action={`/${locale}/signup`} className="glass mt-8 flex w-full max-w-2xl items-center gap-3 rounded-full py-2 ps-7 pe-2">
          <input name="prompt" maxLength={1000} placeholder={variant === "image" ? d.imgPromptPh : d.promptPh} className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-ink/50" />
          <button className="btn btn-white"><Icon n="spark" size={16} />{d.generate}</button>
        </form>
      </div>
    </section>
  );
}
