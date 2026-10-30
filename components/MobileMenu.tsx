"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import type { Locale } from "@/lib/i18n";

type Item = { label: string; href: string };

// Phone menu for the public site: a hamburger that opens a full-screen sheet with every page, sign-in / sign-up and the language switch.
export function MobileMenu({ locale, items, signin, signup, langLabel, langHref, label }: { locale: Locale; items: Item[]; signin: string; signup: string; langLabel: string; langHref: string; label: string }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; removeEventListener("keydown", esc); };
  }, [open]);
  const bar = "grid size-10 place-items-center rounded-full";
  return (
    <>
      <button type="button" aria-label={label} aria-expanded={open} onClick={() => setOpen(true)} className={`${bar} lg:hidden`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-50 flex flex-col bg-[#fbf8f1] text-ink lg:hidden">
          <div className="flex h-[76px] shrink-0 items-center justify-between px-5">
            <Logo locale={locale} />
            <button type="button" aria-label="close" onClick={() => setOpen(false)} className={`${bar} bg-ink/10`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 pb-6">
            <ul className="divide-y divide-line border-y border-line">
              {items.map((i) => <li key={i.href + i.label}><Link href={`/${locale}${i.href}`} prefetch={false} className="flex h-14 items-center justify-between text-lg font-medium">{i.label}<span className="text-muted rtl:rotate-180" aria-hidden>›</span></Link></li>)}
            </ul>
          </nav>
          <div className="space-y-3 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <Link href={`/${locale}/signup`} className="btn btn-gold w-full !py-3.5 text-base">{signup}</Link>
            <Link href={`/${locale}/login`} className="btn btn-ghost w-full !py-3.5 text-base">{signin}</Link>
            <Link href={langHref} prefetch={false} className="block py-2 text-center text-sm text-muted">{langLabel}</Link>
          </div>
        </div>
      )}
    </>
  );
}
