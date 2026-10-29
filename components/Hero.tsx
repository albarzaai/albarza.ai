import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

// The prompt bar is a plain form that posts to signup; validation happens on the server.
export function Hero({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="relative flex min-h-[100svh] items-end justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/media/hero.svg" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1000px] flex-col items-center px-5 pb-24 text-center">
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{d.heroTitle}</h1>
        <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-white/90 md:text-base">{d.heroLong}</p>
        <form action={`/${locale}/signup`} className="glass mt-8 flex w-full max-w-2xl items-center gap-3 rounded-full py-2 ps-6 pe-2">
          <input name="prompt" maxLength={1000} placeholder={d.promptPh} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-white/60" />
          <button className="btn btn-white">✦ {d.generate}</button>
        </form>
      </div>
    </section>
  );
}
