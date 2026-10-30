"use client";

import { useEffect, useRef } from "react";

// Publishes how far the block has travelled through the viewport (0 below the fold, 1 above it) as the CSS variable --p.
// Children move with it (parallax) in both scroll directions. Runs only while visible and never for reduced-motion visitors.
export function ScrollDrift({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = (innerHeight - r.top) / (innerHeight + r.height);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { update(); addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); }
      else { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); }
    }, { rootMargin: "120px" });
    io.observe(el);
    return () => { io.disconnect(); removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
