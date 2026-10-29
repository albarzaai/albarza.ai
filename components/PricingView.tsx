"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { plansApp, ta } from "@/lib/app-dict";
import { aed, type Locale } from "@/lib/i18n";

const packs = [[5000, 39], [10000, 75], [15000, 109], [25000, 169], [40000, 249]] as const;

export function PricingView({ locale, initialTab }: { locale: Locale; initialTab: "upgrade" | "topup" }) {
  const a = ta(locale);
  const [tab, setTab] = useState(initialTab); const [annual, setAnnual] = useState(true); const [pk, setPk] = useState(4); const [auto, setAuto] = useState(false);
  const n = (x: number) => x.toLocaleString(locale === "ar" ? "ar-AE" : "en-AE");
  const sw = (on: boolean, set: (b: boolean) => void, l: string) => <button type="button" role="switch" aria-checked={on} aria-label={l} onClick={() => set(!on)} className={`relative h-6 w-11 rounded-full ${on ? "bg-emerald-500" : "bg-white/20"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "start-[22px]" : "start-0.5"}`} /></button>;
  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#1a1405] via-[#0b0905] to-[#050505] px-5 py-10 md:px-12">
      <div className="mx-auto max-w-[1000px]">
        <h1 className="text-4xl font-bold">{tab === "upgrade" ? a.pickPlan : a.buyCreditsT}</h1>
        <p className="mt-2 text-white/55">{tab === "upgrade" ? a.pickPlanSub : a.buyCreditsSub}</p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-full bg-white/10 p-1.5"><button onClick={() => setTab("upgrade")} className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm ${tab === "upgrade" ? "bg-white text-black" : ""}`}><Icon n="spark" size={14} />{a.upgradeTab}</button><button onClick={() => setTab("topup")} className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm ${tab === "topup" ? "bg-white text-black" : ""}`}><Icon n="coins" size={14} />{a.topUpTab}</button></div>
          {tab === "upgrade" ? <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 text-sm"><span>{a.annual} <b className="text-emerald-400">{a.off20}</b></span>{sw(annual, setAnnual, a.annual)}</div> : <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm">{a.autoRefillT}{sw(auto, setAuto, a.autoRefillT)}</div>}
        </div>
        {tab === "upgrade" ? (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {plansApp.map((p, k) => (
                <article key={p.id} className={`flex flex-col rounded-2xl bg-white/[.06] p-5 ${"best" in p ? "ring-1 ring-gold" : ""}`}>
                  {"best" in p && <p className="-mt-2 mb-2 text-center text-xs text-gold-hi">{a.bestValue}</p>}
                  <h2 className="text-2xl font-semibold">{p[locale]}</h2>
                  <p className="mt-6 font-semibold">{n(p.credits)} <span className="font-normal text-white/60">{a.creditsPerMonth}</span></p>
                  <p className="mt-3 flex-1 text-sm text-white/50">{locale === "ar" ? `حتى ${n(Math.round(p.credits / 13))} صورة · ${n(Math.round(p.credits / 95))} فيديو` : `Up to ${n(Math.round(p.credits / 13))} images · ${n(Math.round(p.credits / 95))} videos`}</p>
                  <p className="mt-5 text-3xl font-bold">{aed(annual ? p.annual : p.price, locale)}<span className="text-sm font-normal text-white/50"> {a.perMonth}</span></p>
                  <button disabled={k === 0} className={`mt-4 w-full rounded-xl py-2.5 text-sm font-semibold ${k === 0 ? "bg-white/20 text-white/70" : "bg-white text-black hover:bg-gold-hi"}`}>{k === 0 ? a.currentPlan : `${a.go} ${p[locale]}`}</button>
                  <ul className="mt-4 space-y-2 text-xs text-white/65">{[locale === "ar" ? "كل نماذج الصور والفيديو" : "All image and video models", locale === "ar" ? "تنزيل دون علامة مائية" : "No-watermark downloads", locale === "ar" ? "أولوية في قائمة الانتظار" : "Priority queue", locale === "ar" ? "استخدام تجاري" : "Commercial use"].map((f) => <li key={f} className="flex gap-2"><Icon n="check" size={13} className="mt-0.5 text-gold-hi" />{f}</li>)}</ul>
                </article>
              ))}
            </div>
            <p className="mt-6 text-xs text-white/45">{a.vatNote}</p>
          </>
        ) : (
          <div className="mt-8 space-y-4">
            <section className="rounded-3xl bg-gradient-to-br from-[#8a6a2a] to-[#bd9b5f] p-6 text-black">
              <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-2xl font-bold">{n(packs[pk][0])} {a.creditsT}</h2><p className="text-sm">{a.worksAll}</p><p className="mt-2 text-sm">{locale === "ar" ? `حتى ${n(Math.round(packs[pk][0] / 13))} صورة` : `Up to ${n(Math.round(packs[pk][0] / 13))} image generations`}</p></div>
                <div className="text-end"><p className="text-4xl font-bold">{aed(packs[pk][1], locale)}</p><button className="mt-3 w-44 rounded-xl bg-white py-2.5 font-semibold">{a.purchase}</button></div></div>
              <input type="range" min={0} max={packs.length - 1} value={pk} onChange={(e) => setPk(+e.target.value)} aria-label={a.buyCreditsT} className="mt-6 w-full accent-black" />
              <div className="mt-1 flex justify-between text-[11px]" dir="ltr">{packs.map((p) => <span key={p[0]}>{p[0] / 1000}k</span>)}</div>
            </section>
            <div className="grid gap-4 sm:grid-cols-2">{[packs[3], packs[2]].map((p, k) => (<article key={p[0]} className={`rounded-2xl bg-white/[.06] p-5 ${k === 1 ? "ring-1 ring-gold" : ""}`}><div className="flex items-center justify-between"><h3 className="text-xl font-semibold">{n(p[0])} {a.creditsT}</h3><span className="text-2xl font-bold">{aed(p[1], locale)}</span></div><span className="mt-3 inline-block rounded-lg bg-white/10 px-2 py-1 text-xs">{k === 0 ? a.bestValue : a.mostPopular}</span><p className="mt-3 text-sm text-white/55">{a.worksAll}</p><button className="mt-4 w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-black">{a.purchase}</button></article>))}</div>
            <p className="text-xs text-white/45">{a.vatNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
