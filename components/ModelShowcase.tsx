"use client";

import Link from "next/link";
import { useState } from "react";
import { models } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/dict";

export function ModelShowcase({ locale }: { locale: Locale }) {
  const d = t(locale);
  const [i, setI] = useState(0);
  return (
    <div className="relative mt-12 min-h-[520px] overflow-hidden rounded-3xl border border-line text-start">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/media/hero.svg" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="glass relative m-5 max-w-sm rounded-2xl p-6">
        <p className="mb-4 text-sm font-semibold">{d.navAiVideo}</p>
        <ul className="space-y-1">
          {models.map((m, k) => (
            <li key={m.id}>
              <button onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)} className={`w-full rounded-lg px-3 py-1.5 text-start text-sm transition ${k === i ? "bg-white/10 text-gold-hi" : "text-white/70 hover:text-white"}`}>{m.name}</button>
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-white/80">{models[i].desc[locale]}</p>
        <Link href={`/${locale}/signup`} className="btn btn-gold mt-4 w-full">{d.tryTool}</Link>
      </div>
    </div>
  );
}
