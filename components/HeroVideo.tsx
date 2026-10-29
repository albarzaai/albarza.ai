"use client";

import { useEffect, useRef, useState } from "react";

export const HERO_POSTER = "/media/hero-abudhabi.jpg";

// The poster is the video's own first frame, so the swap from still to motion has no visible jump.
// The video stays transparent until it is actually playing, then fades in.
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (v && !v.paused && v.readyState >= 3) setReady(true);
  }, []);
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_POSTER} alt="" fetchPriority="high" decoding="sync" className="absolute inset-0 h-full w-full object-cover" />
      <video ref={ref} poster={HERO_POSTER} autoPlay muted loop playsInline preload="auto" onPlaying={() => setReady(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
        <source src="/media/hero-abudhabi-sm.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/media/hero-abudhabi.mp4" type="video/mp4" />
      </video>
    </>
  );
}
