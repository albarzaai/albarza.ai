"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { CreationViewer, type Creation } from "./CreationViewer";
import { ta } from "@/lib/app-dict";
import { gallery } from "@/lib/media";
import type { Locale } from "@/lib/i18n";

type Row = { id: number; prompt: string; model: string; src: string; kind: "image" | "video" | "audio"; progress?: number };
const seed = (kind: "image" | "video" | "audio", ar: boolean): Row[] => [
  { id: 1, prompt: ar ? "تفاحة حمراء على طاولة خشبية بإضاءة ناعمة" : "a red apple on a wooden table, soft light", model: "Nano Banana 2", src: gallery(2), kind },
  { id: 2, prompt: ar ? "رجل يركض خلف جرذ بأسلوب ثلاثي الأبعاد" : "a man running after rat 3d", model: "GPT Image 2.5 Flare", src: gallery(5), kind },
  { id: 3, prompt: ar ? "مغامرة متحركة مدتها ١٥ ثانية بأسلوب بيكسار، عمودية ٩:١٦" : "15-second animated adventure, 9:16 vertical. STYLE: Pixar-style 3D family-feature look", model: "Seedance 2.0 Fast", src: gallery(3), kind },
];

// Creations list: date label + prompt + model chip, then the result tile. New generations appear as a progress card.
export function CreationsList({ locale, kind, q = "" }: { locale: Locale; kind: "image" | "video" | "audio"; q?: string }) {
  const a = ta(locale);
  const [rows, setRows] = useState<Row[]>(() => seed(kind, locale === "ar"));
  const [open, setOpen] = useState<Creation | null>(null);

  useEffect(() => {
    const onGen = (e: Event) => {
      const d = (e as CustomEvent<{ prompt: string; model: string }>).detail;
      const id = Date.now();
      setRows((r) => [{ id, prompt: d.prompt || "—", model: d.model || "Nano Banana 2", src: gallery(id % 12), kind, progress: 4 }, ...r]);
      const t = setInterval(() => setRows((r) => r.map((x) => (x.id === id && x.progress !== undefined ? (x.progress >= 100 ? { ...x, progress: undefined } : { ...x, progress: Math.min(100, x.progress + 12) }) : x))), 500);
      setTimeout(() => clearInterval(t), 6000);
    };
    window.addEventListener("albarza:generate", onGen);
    return () => window.removeEventListener("albarza:generate", onGen);
  }, [kind]);

  const shown = rows.filter((r) => !q || r.prompt.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto max-w-[920px] space-y-8">
      {shown.map((r) => (
        <section key={r.id}>
          <div className="mb-3 flex items-center gap-3 text-xs text-white/55">
            <span className="h-4 w-4 rounded border border-white/25" aria-hidden />
            <span className="shrink-0">{r.progress !== undefined ? a.now : a.thisWeek}</span><span aria-hidden>•</span>
            <span className="min-w-0 flex-1 truncate">{r.prompt}</span>
            <span className="shrink-0 rounded-full border border-white/20 px-3 py-1.5 text-sm text-white">{r.model}</span>
          </div>
          {r.progress !== undefined ? (
            <div className="relative h-[190px] w-[150px] overflow-hidden rounded-2xl bg-[#181818]">
              <span className="absolute start-2 top-2 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs"><Icon n="spark" size={12} />{r.progress > 80 ? a.almostReady : r.progress > 30 ? a.craftingMagic : a.generating}</span>
              <div className="absolute inset-x-3 bottom-3 rail"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${r.progress}%` }} /></div>
            </div>
          ) : r.kind === "audio" ? (
            <div className="mx-auto flex w-[min(86vw,560px)] items-center gap-4 rounded-2xl bg-white/5 p-4"><button aria-label={a.play} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold text-black"><Icon n="play" size={16} /></button><div className="flex h-10 flex-1 items-center gap-[3px]" aria-hidden>{Array.from({ length: 48 }, (_, i) => <i key={i} className="w-[3px] rounded bg-white/50" style={{ height: `${20 + ((i * 37) % 70)}%` }} />)}</div><span className="text-xs text-white/60">0:12</span></div>
          ) : (
            <button type="button" onClick={() => setOpen({ src: r.src, prompt: r.prompt, model: r.model, kind: r.kind })} className="group relative mx-auto block overflow-hidden rounded-[28px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.src} alt="" loading="lazy" width={400} height={400} className={`object-cover ${r.kind === "video" ? "aspect-video w-[min(80vw,680px)]" : "aspect-square w-[min(80vw,400px)]"}`} />
              {r.kind === "video" && <span className="absolute start-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs"><Icon n="play" size={11} />0:04</span>}
            </button>
          )}
        </section>
      ))}
      {open && <CreationViewer locale={locale} c={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
