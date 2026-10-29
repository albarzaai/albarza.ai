"use client";

import { useEffect, useState } from "react";

// Hero copy and buttons appear together once the web fonts are ready, instead of popping in piece by piece
// while the font loads. A short timeout keeps the content from ever staying hidden.
export function FontReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const show = () => { if (!done) { done = true; setReady(true); } };
    const timer = setTimeout(show, 1200);
    if (document.fonts?.ready) document.fonts.ready.then(show, show); else show();
    return () => { done = true; clearTimeout(timer); };
  }, []);
  return <div className={`transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"} ${className}`}>{children}</div>;
}
