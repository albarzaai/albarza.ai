"use client";

import { useEffect, useRef } from "react";

// Muted looping clip that loads and plays only while it is on screen; the still image shows until the first frame is ready.
export function LoopVideo({ slug, poster, className = "" }: { slug: string; poster: string; className?: string }) {
  const v = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = v.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !still) void el.play().catch(() => {});
      else el.pause();
    }, { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <video ref={v} src={`/media/${slug}.mp4`} poster={poster} muted loop playsInline preload="metadata" aria-hidden className={`absolute inset-0 h-full w-full object-cover ${className}`} />;
}
