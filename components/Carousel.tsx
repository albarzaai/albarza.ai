"use client";

import { useRef } from "react";
import { Icon } from "./Icon";

// Horizontal scroll-snap track with round prev/next buttons, like the Davinci carousels.
export function Carousel({ children, label, gap = "gap-4" }: { children: React.ReactNode; label: string; gap?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: dir * (rtl ? -1 : 1) * el.clientWidth * 0.9, behavior: "smooth" });
  };
  const btn = "grid h-10 w-10 place-items-center rounded-full bg-ink/6 text-ink transition hover:bg-ink/15";
  return (
    <div>
      <div ref={ref} aria-label={label} className={`flex snap-x snap-mandatory ${gap} overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>{children}</div>
      <div className="mt-5 flex gap-2">
        <button type="button" aria-label="Previous" onClick={() => go(-1)} className={btn}><Icon n="chev" size={14} className="rotate-90 rtl:-rotate-90" /></button>
        <button type="button" aria-label="Next" onClick={() => go(1)} className={btn}><Icon n="chev" size={14} className="-rotate-90 rtl:rotate-90" /></button>
      </div>
    </div>
  );
}
