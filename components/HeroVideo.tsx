"use client";

import { useEffect, useRef, useState } from "react";
import lqip from "@/lib/lqip.json";

export const HERO_POSTER = "/media/hero-abudhabi.jpg";
export const heroPoster = (slug: string) => `/media/${slug}.jpg`;

// Three layers fade in one after another, never to black: an inlined blurred colour wash (instant, part of the HTML),
// the full poster (the video's own first frame) and finally the video once it is actually playing.
export function HeroVideo({ slug = "hero-abudhabi" }: { slug?: string }) {
  const poster = heroPoster(slug);
  const wash = (lqip as Record<string, string>)[slug];
  const vref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const v = vref.current;
    if (v && !v.paused && v.readyState >= 3) setPlaying(true);
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden bg-cover bg-center" style={wash ? { backgroundImage: `url(${wash})` } : { backgroundColor: "#3a3028" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" fetchPriority="high" decoding="async"
        className="absolute inset-0 h-full w-full object-cover [animation:fadeIn_.6s_ease-out]" />
      <video ref={vref} poster={poster} autoPlay muted loop playsInline preload="auto" onPlaying={() => setPlaying(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}>
        <source src={`/media/${slug}-sm.mp4`} type="video/mp4" media="(max-width: 767px)" />
        <source src={`/media/${slug}-hd.mp4`} type="video/mp4" media="(min-width: 1920px)" />
        <source src={`/media/${slug}.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}
