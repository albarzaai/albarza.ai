"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

export function TemplateModal({ locale, title, src, onClose }: { locale: Locale; title: string; src: string; onClose: () => void }) {
  const a = ta(locale);
  const [ratio, setRatio] = useState("9:16");
  useEffect(() => { const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", esc); return () => window.removeEventListener("keydown", esc); }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="sheet relative grid max-h-[92dvh] w-full max-w-[860px] gap-6 overflow-auto p-5 md:grid-cols-[1.1fr_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="aspect-[3/4] w-full rounded-2xl object-cover" />
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-white/60">{a.pumpJam}</p></div><button onClick={onClose} aria-label={a.close} className="grid h-8 w-8 place-items-center rounded-full bg-white/10"><Icon n="close" size={13} /></button></div>
          <label className="relative flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/25 bg-white/5 text-center hover:border-gold">
            <span className="absolute start-3 top-3 rounded-full bg-white/10 px-2 py-0.5 text-[11px]">{a.mainCharacter}</span>
            <Icon n="image" size={20} /><b className="mt-2 text-sm">{a.uploadMedia}</b><span className="text-xs text-white/50">{a.uploadHint}</span><input type="file" className="sr-only" />
          </label>
          <div className="grid grid-cols-3 gap-2">{["16:9", "1:1", "9:16"].map((r) => <button key={r} onClick={() => setRatio(r)} className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm ${ratio === r ? "border-white bg-white/10" : "border-white/15 bg-white/5"}`}><span className="block rounded-[3px] border border-current" style={{ width: r === "16:9" ? 14 : 10, height: r === "9:16" ? 14 : 10 }} />{r}</button>)}</div>
          <button className="gbtn mt-auto justify-center py-3">{a.generate}<span className="flex items-center gap-1 rounded-full bg-black/20 px-2 py-0.5 text-xs"><Icon n="spark" size={11} />210</span></button>
        </div>
      </div>
    </div>
  );
}
