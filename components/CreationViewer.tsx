"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

export type Creation = { src: string; prompt: string; model: string; kind: "image" | "video" | "audio" };
const toolDefs: { k: string; icon: string; opts?: [string, string[]][]; prompt?: boolean }[] = [
  { k: "aiEdit", icon: "sliders", prompt: true }, { k: "retouch", icon: "spark", prompt: true },
  { k: "resize", icon: "panel", opts: [["aspectRatio", ["1:1", "16:9", "9:16", "4:5"]]] },
  { k: "background", icon: "image", opts: [["mode", ["Remove", "Replace", "Blur"]]] },
  { k: "upscale", icon: "up", opts: [["resolution", ["2x", "4x", "8x"]]] },
  { k: "changeLighting", icon: "star", opts: [["mode", ["Studio", "Golden hour", "Neon", "Moody"]]] },
  { k: "changeCamera", icon: "camera", opts: [["mode", ["Low angle", "High angle", "Close-up", "Wide"]]] },
  { k: "translate", icon: "language", opts: [["language", ["العربية", "English", "Français", "Español"]]] },
];

export function CreationViewer({ locale, c, onClose }: { locale: Locale; c: Creation; onClose: () => void }) {
  const a = ta(locale);
  const [tab, setTab] = useState<"info" | "tools">("info");
  const [tool, setTool] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  useEffect(() => { const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", esc); return () => window.removeEventListener("keydown", esc); }, [onClose]);
  const def = toolDefs.find((t) => t.k === tool);
  const btn = "flex items-center justify-center gap-2 rounded-xl bg-white/[.07] px-3 py-3 text-sm hover:bg-white/15";
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/90 p-4 md:flex-row md:gap-10" onClick={onClose}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.src} alt="" onClick={(e) => e.stopPropagation()} className="aspect-square max-h-[70dvh] w-auto max-w-full rounded-[28px] object-cover md:max-h-[84dvh] md:max-w-[56vw]" />
      <aside onClick={(e) => e.stopPropagation()} className="sheet max-h-[84dvh] w-full max-w-[300px] shrink-0 overflow-auto p-3">
        <div className="flex items-center justify-between p-2"><h2 className="font-semibold">{def ? a[def.k] : a.creation}</h2><button onClick={() => (def ? setTool(null) : onClose())} aria-label={a.close} className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><Icon n={def ? (locale === "ar" ? "chevR" : "chevL") : "close"} size={14} /></button></div>
        {!def && <div className="mb-3 flex rounded-full bg-white/[.07] p-1">{(["info", "tools"] as const).map((k) => <button key={k} onClick={() => setTab(k)} className={`flex-1 rounded-full py-1.5 text-sm ${tab === k ? "bg-white/15" : "text-white/60"}`}>{k === "info" ? a.info : a.toolsTab}</button>)}</div>}
        {!def && tab === "info" && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-white/5 p-4"><div className="flex items-center justify-between text-sm text-white/70"><span>{a.prompt}</span><button aria-label={a.copy} onClick={() => navigator.clipboard?.writeText(c.prompt)} className="grid h-8 w-8 place-items-center rounded-full bg-white/10"><Icon n="copy" size={14} /></button></div>
              <p className="mt-3 min-h-24 border-b border-white/10 pb-3 text-sm leading-6">{c.prompt}</p>
              <dl className="mt-3 space-y-2 text-sm"><div className="flex gap-6"><dt className="w-16 text-white/50">{a.model}</dt><dd>{c.model}</dd></div><div className="flex gap-6"><dt className="w-16 text-white/50">{a.created}</dt><dd>{new Date().toLocaleDateString(locale === "ar" ? "ar-AE" : "en-AE", { dateStyle: "long" })}</dd></div></dl></div>
            <div className="grid grid-cols-2 gap-2"><button className={btn}><Icon n="copy" size={15} />{a.reference}</button><button className={btn}><Icon n="pen" size={15} />{a.edit}</button><button className={btn}><Icon n="up" size={15} />{a.upscale}</button><button className={btn}><Icon n="spark" size={15} />{a.reuse}</button></div>
            <div className="grid grid-cols-3 gap-2"><button aria-label={a.download} className={btn}><Icon n="download" size={16} /></button><button aria-label={a.like} onClick={() => setLiked(!liked)} className={`${btn} ${liked ? "text-gold-hi" : ""}`}><Icon n="heart" size={16} /></button><button aria-label={a.remove} className={btn}><Icon n="trash" size={16} /></button></div>
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-semibold text-black"><Icon n="video" size={16} />{a.createVideoBtn}</button>
          </div>
        )}
        {!def && tab === "tools" && <ul className="space-y-1">{toolDefs.map((t) => <li key={t.k}><button onClick={() => setTool(t.k)} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm hover:bg-white/[.07]"><span className="flex items-center gap-3"><Icon n={t.icon} size={16} />{a[t.k]}</span><Icon n={locale === "ar" ? "chevL" : "chevR"} size={14} className="text-white/40" /></button></li>)}</ul>}
        {def && (
          <div className="space-y-4 p-2">
            {def.prompt && <textarea rows={4} placeholder={a.describeImage} className="w-full resize-none rounded-xl bg-white/5 p-3 text-sm outline-none" />}
            {def.opts?.map(([label, vals]) => <div key={label}><p className="mb-2 text-xs text-white/60">{a[label] ?? label}</p><div className="flex flex-wrap gap-2">{vals.map((v, i) => <button key={v} className={`pill ${i === 0 ? "pill-on" : ""}`}>{v}</button>)}</div></div>)}
            <button className="gbtn w-full justify-center">{a.applyTool}</button>
          </div>
        )}
      </aside>
    </div>
  );
}
