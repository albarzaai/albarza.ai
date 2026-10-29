"use client";

import Link from "next/link";
import { useState } from "react";
import { models } from "@/lib/content";
import { HERO_POSTER } from "./HeroVideo";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/dict";

// Video backdrop with a frosted-glass panel on the start side, the way Davinci presents its model list.
export function ModelShowcase({ locale }: { locale: Locale }) {
  const d = t(locale);
  const [i, setI] = useState(0);
  const m = models[i];
  return (
    <div className="relative mt-12 overflow-hidden rounded-3xl bg-black text-start text-white md:h-[720px]">
      <video src="/media/hero-abudhabi.mp4" poster={HERO_POSTER} autoPlay muted loop playsInline preload="metadata" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div className="relative flex h-full flex-col p-3 md:p-10">
        <div className="grid h-full gap-8 rounded-3xl border border-white/20 bg-gradient-to-br from-white/25 via-white/10 to-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150 md:w-[57%] md:grid-cols-[minmax(0,240px)_1fr] md:gap-0 md:p-0">
          <div className="md:p-9">
            <p className="text-lg font-medium">{d.navAiVideo}</p>
            <ul className="mt-5 space-y-0.5">
              {models.map((x, k) => (
                <li key={x.id}>
                  <button onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)} className={`w-full py-1.5 text-start text-[15px] transition ${k === i ? "font-semibold text-white" : "text-white/60 hover:text-white"}`}>{x.name}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col border-white/20 md:border-s md:p-9">
            <h3 className="text-xl font-medium">{m.name}</h3>
            <p className="mt-4 max-w-[520px] text-[15px] leading-7 text-white/85">{m.desc[locale]}</p>
            <Link href={`/${locale}/video-generator/${m.id}`} className="mt-5 w-fit border-b border-white/80 pb-0.5 text-[15px]">{locale === "ar" ? `المزيد عن ${m.name}` : `More on ${m.name}`}</Link>
            <Link href={`/${locale}/signup`} className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-medium text-black transition hover:bg-white/90 md:mt-auto">{locale === "ar" ? `جرّب ${m.name}` : `Try ${m.name}`} <span aria-hidden className="rtl:rotate-180">→</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
