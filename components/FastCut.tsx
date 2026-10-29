"use client";

import { useEffect, useRef, useState } from "react";

// Fast-cut reel: hard cut to the next frame every `every` ms with a small zoom punch, like a highlight edit.
// Runs only while on screen and stays still for visitors who prefer reduced motion.
export function FastCut({ srcs, every = 1000, offset = 0, className = "" }: { srcs: string[]; every?: number; offset?: number; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!on || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t: ReturnType<typeof setInterval>;
    const s = setTimeout(() => { t = setInterval(() => setI((v) => (v + 1) % srcs.length), every); }, offset);
    return () => { clearTimeout(s); clearInterval(t); };
  }, [on, every, offset, srcs.length]);

  return (
    <div ref={box} className={`overflow-hidden ${className}`} aria-hidden>
      {srcs.map((s, k) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={s} src={s} alt="" loading={k === 0 ? "eager" : "lazy"} decoding="async" className={`absolute inset-0 h-full w-full object-cover ${k === i ? "opacity-100" : "opacity-0"} ${k === i && on ? "[animation:cutZoom_1s_ease-out_both]" : ""}`} />
      ))}
    </div>
  );
}
