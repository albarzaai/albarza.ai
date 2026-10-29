"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

type Item = { id: number; kind: "image" | "video" | "audio"; src: string; tall: boolean; title: string };

// Masonry feed. One page per request; a sentinel below the grid fetches the next page as it nears the viewport.
export function Feed({ locale, type, action }: { locale: Locale; type: string; action?: string }) {
  const d = t(locale);
  const [items, setItems] = useState<Item[]>([]);
  const [next, setNext] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const load = useCallback(async (cursor: number, reset: boolean) => {
    if (busy.current) return;
    busy.current = true; setLoading(true);
    try {
      const r = await fetch(`/api/gallery?cursor=${cursor}&type=${type}&locale=${locale}`);
      const j = (await r.json()) as { items: Item[]; next: number | null };
      setItems((p) => (reset ? j.items : [...p, ...j.items]));
      setNext(j.next);
    } finally { busy.current = false; setLoading(false); }
  }, [type, locale]);

  useEffect(() => { setItems([]); setNext(0); void load(0, true); }, [load]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || next === null) return;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) void load(next, false); }, { rootMargin: "800px" });
    io.observe(el);
    return () => io.disconnect();
  }, [next, load]);

  return (
    <div>
      <div className="columns-2 gap-3 md:columns-3 xl:columns-5">
        {items.map((it) => (
          <div key={it.id} className="group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-surface-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.src} alt="" loading="lazy" width={400} height={it.tall ? 600 : 300} className={`w-full object-cover ${it.tall ? "aspect-[2/3]" : "aspect-[4/3]"}`} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-10 text-sm font-semibold">{it.title}</div>
            {action && <span className="absolute end-2 top-2 hidden rounded-full bg-gold px-3 py-1 text-xs font-semibold text-black group-hover:block">{action}</span>}
          </div>
        ))}
      </div>
      <div ref={sentinel} className="h-12 text-center text-sm text-muted">{loading && d.loadingMore}</div>
    </div>
  );
}
