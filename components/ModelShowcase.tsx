"use client";

import Link from "next/link";
import { useState } from "react";
import { models } from "@/lib/content";
import { HERO_POSTER } from "./HeroVideo";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/dict";

const SRC = "/media/hero-abudhabi.mp4";
const Arrow = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 14 14" className="size-3.5 rtl:rotate-180" aria-hidden><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M8.166 3.208 11.958 7l-3.792 3.792M11.666 7H2.041" /></svg>
);

// Same structure and measurements as the Davinci model showcase: a 550px frosted card on a looping video,
// and on small screens a pill tab strip with a swipeable description.
export function ModelShowcase({ locale }: { locale: Locale }) {
  const d = t(locale);
  const [i, setI] = useState(0);
  const m = models[i];
  const more = (n: string) => (locale === "ar" ? `المزيد عن ${n}` : `More on ${n}`);
  const tryIt = (n: string) => (locale === "ar" ? `جرّب ${n}` : `Try ${n}`);
  const video = <video src={SRC} poster={HERO_POSTER} autoPlay muted loop playsInline preload="metadata" aria-hidden className="absolute inset-0 size-full object-cover object-center" />;
  return (
    <div className="mt-6 text-start lg:mt-[70px]">
      {/* desktop */}
      <div className="relative hidden overflow-hidden rounded-[32px] p-8 lg:block">
        {video}
        <div className="relative z-10 flex h-[550px] w-fit gap-3 rounded-[20px] border border-white/10 bg-black/12 p-10 backdrop-blur-[42px]">
          <nav className="flex min-w-44 shrink-0 flex-col border-white/10 pe-2 [border-inline-end-width:1px]">
            <h3 className="mb-2.5 pe-[34px] text-base font-medium text-white">{d.navAiVideo}</h3>
            <div className="flex flex-col gap-2.5 overflow-auto pe-[34px] [scrollbar-width:none]">
              {models.map((x, k) => (
                <button key={x.id} type="button" onClick={() => setI(k)} onMouseEnter={() => setI(k)} className={`cursor-pointer text-start text-[15px] transition-colors ${k === i ? "font-semibold text-white" : "text-white/70 hover:text-white/90"}`}>{x.name}</button>
              ))}
            </div>
          </nav>
          <div key={m.id} className="flex w-[440px] flex-col ps-8 [animation:fadeIn_.5s_ease-out]">
            <h3 className="text-[18px] font-medium text-white">{m.name}</h3>
            <p className="mt-2.5 text-[15px] font-normal leading-6 text-white">{m.desc[locale]}</p>
            <Link href={`/${locale}/video-generator/${m.id}`} className="mt-3 w-fit text-[15px] font-medium text-white/90 underline underline-offset-4 transition-colors hover:text-white">{more(m.name)}</Link>
            <Link href={`/${locale}/signup`} className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-[50px] bg-white px-6 py-3 text-[15px] font-medium text-black transition-colors hover:bg-white/90">{tryIt(m.name)}<Arrow /></Link>
          </div>
        </div>
      </div>
      {/* mobile */}
      <div className="relative overflow-hidden rounded-3xl px-3 py-8 lg:hidden">
        {video}
        <div className="relative z-10 flex flex-col rounded-[20px] border border-white/10 bg-black/12 pb-8 pt-5 text-white backdrop-blur-[42px]">
          <h3 className="text-center text-base font-medium">{d.navAiVideo}</h3>
          <nav className="mt-2.5 flex snap-x snap-mandatory scroll-px-5 gap-2.5 overflow-x-auto px-5 [scrollbar-width:none]">
            {models.map((x, k) => (
              <button key={x.id} type="button" onClick={() => setI(k)} className={`shrink-0 cursor-pointer snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${k === i ? "bg-white/15 text-white" : "text-white/50 hover:text-white/70"}`}>{x.name}</button>
            ))}
          </nav>
          <div className="mx-5 mt-6 h-px bg-white/10" />
          <div className="mt-4 px-5">
            <h3 className="text-[18px] font-medium">{m.name}</h3>
            <p className="mt-2.5 text-[15px] leading-6">{m.desc[locale]}</p>
            <Link href={`/${locale}/video-generator/${m.id}`} className="mt-5 inline-block w-fit text-[15px] font-medium underline underline-offset-4">{more(m.name)}</Link>
          </div>
          <div className="mt-[22px] px-5">
            <Link href={`/${locale}/signup`} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90">{tryIt(m.name)}<Arrow /></Link>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {models.map((x, k) => (<button key={x.id} type="button" aria-label={x.name} onClick={() => setI(k)} className={`size-2 cursor-pointer rounded-full transition-colors ${k === i ? "bg-white" : "bg-white/30"}`} />))}
          </div>
        </div>
      </div>
    </div>
  );
}
