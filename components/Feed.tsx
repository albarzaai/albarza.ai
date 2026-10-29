"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const colCount = (max: number) => (typeof window === "undefined" ? max : window.innerWidth < 768 ? 2 : window.innerWidth < 1280 ? 3 : max);
import { Icon } from "./Icon";
import { CreationViewer, type Creation } from "./CreationViewer";
import { TemplateModal } from "./TemplateModal";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

type Item = { id: number; kind: "image" | "video" | "audio"; src: string; tall: boolean; title: string };
type Props = { locale: Locale; type: string; titles?: boolean; open?: "viewer" | "template" | "none"; q?: string; sort?: string; cat?: string; view?: "grid" | "row"; cols?: 4 | 5 };

// Masonry feed. One page per request; a sentinel below the grid fetches the next page as it nears the viewport.
export function Feed({ locale, type, titles = false, open = "viewer", q = "", sort = "new", cat = "", view = "grid", cols = 5 }: Props) {
  const a = ta(locale);
  const [items, setItems] = useState<Item[]>([]);
  const [next, setNext] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [sel, setSel] = useState<Item | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const [n, setN] = useState<number>(cols);
  useEffect(() => {
    const f = () => setN(colCount(cols));
    f(); window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, [cols]);

  const load = useCallback(async (cursor: number, reset: boolean) => {
    if (busy.current) return;
    busy.current = true; setLoading(true);
    try {
      const r = await fetch(`/api/gallery?cursor=${cursor}&type=${type}&locale=${locale}&q=${encodeURIComponent(q)}&sort=${sort}&cat=${encodeURIComponent(cat)}`);
      const j = (await r.json()) as { items: Item[]; next: number | null };
      setItems((p) => (reset ? j.items : [...p, ...j.items.filter((n) => !p.some((o) => o.id === n.id))]));
      setReady(true);
      setNext(j.next);
    } finally { busy.current = false; setLoading(false); }
  }, [type, locale, q, sort, cat]);

  useEffect(() => { setNext(0); void load(0, true); }, [load]);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || next === null) return;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) void load(next, false); }, { rootMargin: "900px" });
    io.observe(el);
    return () => io.disconnect();
  }, [next, load]);

  const card = (it: Item) => (
    <button key={it.id} type="button" onClick={() => open !== "none" && setSel(it)} className="group relative block w-full overflow-hidden rounded-2xl bg-[#1a1a1a] text-start">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={it.src} alt="" loading="lazy" decoding="async" width={400} height={it.tall ? 600 : 300} onLoad={(e) => e.currentTarget.classList.remove("opacity-0")} ref={(el) => { if (el && el.complete) el.classList.remove("opacity-0"); }} className={`w-full object-cover opacity-0 transition duration-300 group-hover:scale-[1.02] ${view === "row" ? "aspect-video" : it.tall ? "aspect-[3/4.2]" : "aspect-[4/3]"}`} />
      {it.kind === "video" && <span className="absolute end-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/55"><Icon n="mute" size={13} /></span>}
      {titles && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-10 text-sm font-semibold">{it.title}</div>}
    </button>
  );
  const creation: Creation | null = sel ? { src: sel.src, prompt: sel.title, model: "Nano Banana 2", kind: sel.kind } : null;
  return (
    <div className="min-h-[100dvh]">
      {ready && items.length === 0 && !loading && <p className="py-24 text-center text-sm text-white/50">{a.noResults}</p>}
      {!ready ? <FeedSkeleton max={cols} row={view !== "grid"} /> : view === "grid"
        ? <div className="flex items-start gap-3">{Array.from({ length: n }, (_, c) => <div key={c} className="flex min-w-0 flex-1 flex-col gap-3">{items.filter((_, i) => i % n === c).map(card)}</div>)}</div>
        : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{items.map(card)}</div>}
      <div ref={sentinel} className="h-12 text-center text-sm text-white/40">{loading && ready && a.loadingMore}</div>
      {sel && open === "viewer" && creation && <CreationViewer locale={locale} c={creation} onClose={() => setSel(null)} />}
      {sel && open === "template" && <TemplateModal locale={locale} title={sel.title} src={sel.src} onClose={() => setSel(null)} />}
    </div>
  );
}

// Placeholder shown until the first page arrives. Column count follows the same breakpoints as the real grid through CSS only,
// so the first paint is already correct on every screen (no JS-driven switch, no jump).
export function FeedSkeleton({ max = 5, row = false }: { max?: 4 | 5; row?: boolean }) {
  const cell = (i: number) => <div key={i} className={`skeleton w-full rounded-2xl ${i % 3 !== 1 ? "aspect-[3/4.2]" : "aspect-[4/3]"}`} />;
  if (row) return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">{Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton aspect-video rounded-2xl" />)}</div>;
  const block = (n: number, cls: string) => (
    <div className={`items-start gap-3 ${cls}`} aria-busy="true">
      {Array.from({ length: n }, (_, c) => <div key={c} className="flex min-w-0 flex-1 flex-col gap-3">{Array.from({ length: 3 }, (_, r) => cell(r * n + c))}</div>)}
    </div>
  );
  return <>{block(2, "flex md:hidden")}{block(3, "hidden md:flex xl:hidden")}{block(max, "hidden xl:flex")}</>;
}
