"use client";

import { useState } from "react";
import { suiteTabs } from "@/lib/home-copy";
import { pic } from "@/lib/media";
import { Icon } from "./Icon";
import type { Locale } from "@/lib/i18n";

// Side tab list plus a large framed preview with a prompt composer, like Davinci's "complete suite" block.
export function SuiteTabs({ locale }: { locale: Locale }) {
  const [i, setI] = useState(0);
  const tab = suiteTabs[i];
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[200px_1fr] lg:gap-10">
      <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:gap-1 lg:overflow-visible">
        {suiteTabs.map((x, k) => (
          <li key={x.key} className="shrink-0">
            <button type="button" onClick={() => setI(k)} className={`flex w-full items-center gap-2 rounded-full px-4 py-2.5 text-start text-[15px] transition-colors lg:rounded-xl lg:px-3 ${k === i ? "bg-ink/8 font-semibold text-ink" : "text-muted hover:text-ink"}`}>
              {x.label[locale]}{x.soon && <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-gold-hi">{locale === "ar" ? "قريباً" : "Soon"}</span>}
            </button>
          </li>
        ))}
      </ul>
      <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] border border-line bg-surface-2 lg:aspect-[16/8.2]">
        {suiteTabs.map((x, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={x.key} src={pic("suite", k + 1)} alt="" loading="lazy" className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${k === i ? "opacity-100" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/30 bg-black/35 p-3 text-white backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-4 lg:inset-x-[12%]">
          <p className="line-clamp-2 text-[13px] leading-5 sm:text-sm">{tab.prompt[locale]}</p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-white/85">
            <span className="rounded-full bg-white/15 px-2.5 py-1">{tab.label[locale]}</span>
            <span className="hidden rounded-full bg-white/15 px-2.5 py-1 sm:inline">Auto</span>
            <span className="hidden rounded-full bg-white/15 px-2.5 py-1 sm:inline">1x</span>
            <span className="ms-auto grid h-8 place-items-center rounded-full bg-white px-4 text-[12px] font-medium text-black">{locale === "ar" ? "إنشاء" : "Generate"}</span>
          </div>
        </div>
        <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium backdrop-blur-md"><Icon n="spark" size={12} />{tab.label[locale]}</span>
      </div>
    </div>
  );
}
