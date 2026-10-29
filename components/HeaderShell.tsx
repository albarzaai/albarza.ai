"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Pages whose first screen is a dark hero: the header is transparent with light text there, and turns solid once scrolled.
const heroPath = (p: string) => /^\/(en|ar)(\/(video-generator|image-generator))?\/?$/.test(p);

export function HeaderShell({ children }: { children: React.ReactNode }) {
  const onHero = heroPath(usePathname() ?? "");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const top = onHero && !scrolled;
  return (
    <header data-top={top} className="group fixed inset-x-0 top-0 z-40 transition-colors duration-300 data-[top=false]:border-b data-[top=false]:border-line data-[top=false]:bg-bg/90 data-[top=false]:backdrop-blur-md data-[top=true]:text-white">
      {children}
    </header>
  );
}
