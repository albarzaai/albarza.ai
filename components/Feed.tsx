"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

type Item = { id: number; kind: "image" | "video" | "audio"; src: string; tall: boolean; title: string };
type Props = { locale: Locale; type: string; action?: string; q?: string; sort?: string; view?: "grid" | "row"; preview?: boolean };

// Feed: one page per request; a sentinel below the grid fetches the next page as it nears the viewport.
export function Feed({ locale, type, action, q = "", sort = "new", view = "grid", preview = true }: Props) {
  const d = t(locale);
  const [items, setItems] = useState<Item[]>([]);
  const [next, setNext] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<Item | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const load = useCallback(async (cursor: number, reset: boolean) => {
    if (busy.current) return;
    busy.current = true; setLoading(true);
    try {
      const r = await fetch(`/api/gallery?cursor=${cursor}&type=${type}&locale=${locale}&q=${encodeURIComponent(q)}&sort=${sort}`);
      const j = (await r.json()) as { items: Item[]; next: number | null };
      setItems((p) => (reset ? j.items : [...p, ...j.items]));
      setNext(j.next);
    } finally { busy.current = false; setLoading(false); }
  }, [type, locale, q, sort]);

  useEffect(() => { setItems([]); setNext(0); void load(0, true); }, [load]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || next === null) return;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) void load(next, false); }, { rootMargin: "800px" });
    io.observe(el);
    return () => io.disconnect();
  }, [next, load]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const card = (it: Item) => (
    <button key={it.id} type="button" onClick={() => preview && setOpen(it)} className={`group relative block w-full overflow-hidden rounded-2xl bg-surface-2 text-start ${view === "grid" ? "mb-3 break-inside-avoid" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={it.src} alt="" loading="lazy" width={400} height={it.tall ? 600 : 300} className={`w-full object-cover ${view === "row" ? "aspect-video" : it.tall ? "aspect-[2/3]" : "aspect-[4/3]"}`} />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-10 text-sm font-semibold">{it.title}</div>
      {it.kind !== "image" && <span className="absolute start-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-gold-hi"><Icon n={it.kind === "video" ? "play" : "mic"} size={13} /></span>}
      {action && <span className="absolute end-2 top-2 hidden rounded-full bg-gold px-3 py-1 text-xs font-semibold text-black group-hover:block">{action}</span>}
    </button>
  );

  return (
    <div>
      {items.length === 0 && !loading && <p className="py-24 text-center text-sm text-muted">0 {d.results}</p>}
      {view === "grid" ? <div className="columns-2 gap-3 md:columns-3 xl:columns-5">{items.map(card)}</div> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{items.map(card)}</div>}
      <div ref={sentinel} className="h-12 text-center text-sm text-muted">{loading && d.loadingMore}</div>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <div className="grid max-h-[92dvh] w-full max-w-5xl overflow-auto rounded-3xl border border-line bg-surface md:grid-cols-[1.4fr_1fr]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open.src} alt="" className="h-full max-h-[80dvh] w-full object-cover" />
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-start justify-between gap-3"><h2 className="text-xl font-semibold">{open.title}</h2><button onClick={() => setOpen(null)} aria-label={d.close} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10"><Icon n="close" size={13} /></button></div>
              <dl className="space-y-3 text-sm">
                <div><dt className="text-xs text-muted">{d.assetPrompt}</dt><dd className="mt-1 leading-6">{open.title} — {locale === "ar" ? "لقطة سينمائية بإضاءة ذهبية ناعمة وحركة كاميرا بطيئة" : "Cinematic shot with soft golden light and slow camera movement"}</dd></div>
                <div><dt className="text-xs text-muted">{d.assetModel}</dt><dd className="mt-1">Veo 3.1</dd></div>
                <div><dt className="text-xs text-muted">{d.assetCreated}</dt><dd className="mt-1">{d.justNow}</dd></div>
              </dl>
              <div className="mt-auto grid grid-cols-2 gap-2">
                <button className="btn btn-gold">{d.download}</button><button className="btn btn-ghost">{d.share}</button>
                <button className="btn btn-ghost">{d.regenerate}</button><button className="btn btn-ghost">{d.addToProject}</button>
                <button className="btn btn-ghost col-span-2 !border-red-900 text-red-400">{d.remove}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
