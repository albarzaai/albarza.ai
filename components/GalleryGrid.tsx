"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

type Item = { id: number; kind: "image" | "video" | "audio"; src: string; tall: boolean };

// Fetches one page at a time; the sentinel below the grid triggers the next page as it scrolls into view.
export function GalleryGrid({ locale }: { locale: Locale }) {
  const d = t(locale);
  const [type, setType] = useState<"all" | "image" | "video" | "audio">("all");
  const [items, setItems] = useState<Item[]>([]);
  const [next, setNext] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const load = useCallback(async (cursor: number, kind: string, reset: boolean) => {
    if (busy.current) return;
    busy.current = true; setLoading(true);
    try {
      const r = await fetch(`/api/gallery?cursor=${cursor}&type=${kind}`);
      const j = (await r.json()) as { items: Item[]; next: number | null };
      setItems((p) => (reset ? j.items : [...p, ...j.items]));
      setNext(j.next);
    } finally { busy.current = false; setLoading(false); }
  }, []);

  useEffect(() => { setItems([]); setNext(0); void load(0, type, true); }, [type, load]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || next === null) return;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) void load(next, type, false); }, { rootMargin: "600px" });
    io.observe(el);
    return () => io.disconnect();
  }, [next, type, load]);

  const tabs = [["all", d.all], ["image", d.images], ["video", d.videos], ["audio", d.audios]] as const;
  return (
    <div>
      <div className="mb-6 flex gap-2">
        {tabs.map(([k, label]) => (
          <button key={k} onClick={() => setType(k)} className={`btn !py-1.5 ${type === k ? "btn-gold" : "btn-ghost"}`}>{label}</button>
        ))}
      </div>
      <div className="columns-2 gap-4 md:columns-3 xl:columns-4">
        {items.map((it) => (
          <div key={it.id} className="card relative mb-4 break-inside-avoid overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.src} alt="" loading="lazy" width={400} height={it.tall ? 500 : 300} className="h-auto w-full" />
            {it.kind !== "image" && <span className="absolute start-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-gold">{it.kind === "video" ? "▶" : "♪"}</span>}
          </div>
        ))}
      </div>
      <div ref={sentinel} className="h-10 text-center text-sm text-muted">{loading && d.loadingMore}</div>
    </div>
  );
}
