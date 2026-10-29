"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { gallery } from "@/lib/media";

// Persistent track bar shown on audio-related pages.
export function MiniPlayer({ title = "Sombra", total = 178 }: { title?: string; total?: number }) {
  const [playing, setPlaying] = useState(false); const [t, setT] = useState(0); const [open, setOpen] = useState(true);
  useEffect(() => { if (!playing) return; const i = setInterval(() => setT((x) => (x >= total ? 0 : x + 1)), 1000); return () => clearInterval(i); }, [playing, total]);
  if (!open) return null;
  const f = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div className="dock pointer-events-auto fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-[860px] items-center gap-4 !rounded-2xl px-3 py-2 md:ms-[calc(var(--sb)+30px)] md:me-4" dir="ltr">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={gallery(1)} alt="" width={32} height={32} className="h-8 w-8 rounded-md object-cover" /><span className="w-20 truncate text-sm">{title}</span>
      <button aria-label="prev" className="text-white/80"><Icon n="prev" size={16} /></button>
      <button aria-label={playing ? "pause" : "play"} onClick={() => setPlaying(!playing)}><Icon n={playing ? "pause" : "play"} size={18} /></button>
      <button aria-label="next" className="text-white/80"><Icon n="next" size={16} /></button>
      <span className="text-xs tabular-nums text-white/70">{f(t)}</span>
      <input type="range" min={0} max={total} value={t} onChange={(e) => setT(+e.target.value)} aria-label="progress" className="rng h-1 flex-1" />
      <span className="text-xs tabular-nums text-white/70">{f(total)}</span>
      <Icon n="volume" size={16} className="text-white/70" /><button aria-label="close" onClick={() => setOpen(false)}><Icon n="close" size={13} /></button>
    </div>
  );
}
