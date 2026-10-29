"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Pop } from "./Pop";
import { ta } from "@/lib/app-dict";
import { gallery } from "@/lib/media";
import type { Locale } from "@/lib/i18n";

const Slider = ({ label, icon, value, set }: { label: string; icon: string; value: number; set: (n: number) => void }) => (
  <div><p className="mb-1 text-sm text-white/80">{label}</p><div className="flex items-center gap-3"><Icon n={icon} size={15} className="text-white/60" /><input type="range" min={0} max={100} value={value} onChange={(e) => set(+e.target.value)} className="rng flex-1" aria-label={label} /><span className="w-10 rounded-full bg-white/10 py-0.5 text-center text-xs">{value}</span></div></div>
);

export function EnhancerApp({ locale }: { locale: Locale }) {
  const a = ta(locale);
  const [stage, setStage] = useState<"upload" | "edit" | "busy" | "done">("upload");
  const [scale, setScale] = useState("2x"); const [sharp, setSharp] = useState(20); const [den, setDen] = useState(20); const [face, setFace] = useState(true); const [str, setStr] = useState(80); const [cre, setCre] = useState(0); const [subject, setSubject] = useState(a.all); const [p, setP] = useState(0);
  useEffect(() => { if (stage !== "busy") return; setP(0); const t = setInterval(() => setP((x) => { if (x >= 100) { clearInterval(t); setStage("done"); return 100; } return x + 10; }), 350); return () => clearInterval(t); }, [stage]);
  const px = scale === "1x" ? 512 : scale === "2x" ? 1024 : 2048;
  return (
    <div className="dots relative min-h-dvh">
      <header className="flex h-[76px] items-center justify-between px-6"><h1 className="text-base font-semibold">{a.enhancerTitle}</h1><button onClick={() => setStage("upload")} className="pill"><span aria-hidden>＋</span>{a.newBtn}</button></header>
      {stage === "upload" ? (
        <div className="mx-auto mt-4 w-[340px] max-w-[92vw] overflow-hidden rounded-[36px] bg-[#1a1a1a] text-center">
          <div className="relative h-[260px]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={gallery(4)} alt="" className="h-full w-full object-cover" /><div className="absolute inset-y-0 start-1/2 w-0.5 bg-white/80" /><span className="absolute start-1/2 top-1/2 grid h-10 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-black/60 text-xs">⇄</span></div>
          <div className="space-y-4 p-6"><h2 className="text-xl font-semibold">{a.enhancerTitle}</h2><p className="text-sm text-white/60">{a.enhancerSub}</p>
            <button onClick={() => setStage("edit")} className="gbtn w-full justify-center py-3 text-base"><span aria-hidden>＋</span>{a.upload}</button>
            <button onClick={() => setStage("edit")} className="flex w-full items-center justify-center gap-2 rounded-full bg-white/10 py-3 text-sm"><Icon n="spark" size={14} />{a.selectAsset}</button>
            <p className="text-xs text-white/40">{a.maxFile}</p></div>
        </div>
      ) : (
        <div className="grid gap-4 px-4 pb-8 lg:grid-cols-[1fr_340px]">
          <div className="relative grid min-h-[420px] place-items-center">
            <div className="relative overflow-hidden rounded-xl">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={gallery(2)} alt="" className={`aspect-square w-[min(88vw,480px)] object-cover ${stage === "edit" ? "brightness-50" : ""}`} />
              {stage === "edit" && <div className="absolute inset-0 grid place-items-center text-xl">{a.clickEnhance}&nbsp;<button onClick={() => setStage("busy")} className="gbtn">{a.enhance}</button>&nbsp;{a.toStart}</div>}
              {stage === "busy" && <div className="absolute inset-0 grid place-items-center bg-black/55"><div className="w-48 text-center text-sm">{a.enhancing}<div className="rail mt-3"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${p}%` }} /></div></div></div>}
            </div>
            <div className="absolute bottom-2 start-2 flex items-center gap-2 rounded-2xl bg-white/5 p-2">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={gallery(2)} alt="" className="h-12 w-12 rounded-lg object-cover" /><span className="grid h-12 w-12 place-items-center rounded-lg bg-white/10">＋</span></div>
          </div>
          <aside className="sheet space-y-5 p-4">
            <div className="flex items-center justify-between rounded-full bg-white/8 px-4 py-2 bg-white/[.07] text-sm"><span className="text-white/60">{a.model}</span><span className="flex items-center gap-2 font-semibold"><Icon n="enhance" size={14} />Topaz</span></div>
            <div className="flex rounded-full bg-white/[.07] p-1">{["1x", "2x", "4x"].map((s) => <button key={s} onClick={() => setScale(s)} className={`flex-1 rounded-full py-1.5 text-sm ${scale === s ? "bg-white/20" : "text-white/60"}`}>{s}</button>)}</div>
            <div><p className="mb-2 text-sm">{a.resolution}</p><div className="flex items-center gap-2 text-sm"><span className="flex-1 rounded-full bg-white/[.07] px-3 py-2">W {px} px</span>×<span className="flex-1 rounded-full bg-white/[.07] px-3 py-2">H {px} px</span></div></div>
            <div className="space-y-4 border-t border-white/10 pt-4"><p className="text-sm font-semibold">{a.settings}</p><Slider label={a.sharpness} icon="sliders" value={sharp} set={setSharp} /><Slider label={a.denoise} icon="star" value={den} set={setDen} />
              <div className="flex items-center justify-between text-sm"><span>{a.subjectDetection}</span><Pop panelClass="w-32 p-2" trigger={<span className="flex items-center gap-1">{subject}<Icon n="chev" size={13} /></span>}>{(close) => [a.all, a.faceEnhancement].map((v) => <button key={v} onClick={() => { setSubject(v); close(); }} className="block w-full rounded-lg px-3 py-2 text-start text-sm hover:bg-white/10">{v}</button>)}</Pop></div></div>
            <div className="space-y-4 border-t border-white/10 pt-4"><div className="flex items-center justify-between"><p className="text-sm font-semibold">{a.faceEnhancement}</p><button role="switch" aria-checked={face} onClick={() => setFace(!face)} className={`relative h-6 w-11 rounded-full ${face ? "bg-gold" : "bg-white/20"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${face ? "start-[22px]" : "start-0.5"}`} /></button></div><Slider label={a.strength} icon="bolt" value={str} set={setStr} /><Slider label={a.creativity} icon="spark" value={cre} set={setCre} /></div>
            <button onClick={() => setStage("busy")} className="gbtn w-full justify-center py-3">{stage === "done" ? a.download : a.enhance}</button>
          </aside>
        </div>
      )}
    </div>
  );
}
