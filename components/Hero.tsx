import Link from "next/link";
import { Icon } from "./Icon";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

// The prompt bar is a plain form posting to signup; all validation happens on the server.
export function Hero({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="relative flex min-h-[100svh] items-end justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/media/hero.svg" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      <nav aria-label="breadcrumb" className="absolute start-10 top-[112px] z-10 hidden text-sm text-white/80 md:block">
        <Link href={`/${locale}`}>{d.home}</Link> <span className="px-1">/</span> <span className="text-white">{d.videoGenerator}</span>
      </nav>
      <div className="relative z-10 mx-auto flex w-full max-w-[1000px] flex-col items-center px-5 pb-28 text-center">
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{d.heroTitle}</h1>
        <p className="mt-5 text-sm leading-7 text-white/90 md:text-base md:leading-8">{d.heroLong}</p>
        <form action={`/${locale}/signup`} className="glass mt-8 flex w-full max-w-2xl items-center gap-3 rounded-full py-2 ps-7 pe-2">
          <input name="prompt" maxLength={1000} placeholder={d.promptPh} className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-white/60" />
          <button className="btn btn-white"><Icon n="spark" size={16} />{d.generate}</button>
        </form>
      </div>
    </section>
  );
}
