"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_LQIP } from "@/lib/hero-lqip";

export const HERO_POSTER = "/media/hero-abudhabi.jpg";

// Three layers fade in one after another, never to black: an inlined blurred colour wash (instant, part of the HTML),
// the full poster (the video's own first frame) and finally the video once it is actually playing.
export function HeroVideo() {
  const vref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const v = vref.current;
    if (v && !v.paused && v.readyState >= 3) setPlaying(true);
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${HERO_LQIP})` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_POSTER} alt="" fetchPriority="high" decoding="async"
        className="absolute inset-0 h-full w-full object-cover [animation:fadeIn_.6s_ease-out]" />
      <video ref={vref} poster={HERO_POSTER} autoPlay muted loop playsInline preload="auto" onPlaying={() => setPlaying(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}>
        <source src="/media/hero-abudhabi-sm.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/media/hero-abudhabi.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
