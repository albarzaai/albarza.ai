"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

const items = [
  ["", "dashboard", "▦"], ["projects", "projects", "▤"],
  ["text-to-image", "t2i", "✦"], ["image-to-video", "i2v", "▶"], ["lip-sync", "lipsync", "◔"], ["upscale", "upscale", "⬆"],
  ["text-to-voice", "t2v", "♪"], ["voice-changer", "vc", "∿"], ["gallery", "gallery", "▣"],
  ["billing", "billing", "◈"], ["settings", "settings", "⚙"],
] as const;

export function AppSidebar({ locale }: { locale: Locale }) {
  const d = t(locale);
  const path = usePathname();
  const base = `/${locale}/app`;
  return (
    <nav className="flex gap-1 overflow-x-auto p-2 md:flex-col md:overflow-visible md:p-3">
      {items.map(([seg, key, icon]) => {
        const href = seg ? `${base}/${seg}` : base;
        const active = path === href;
        return (
          <Link key={key} href={href} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${active ? "bg-surface-2 text-gold-deep" : "text-muted hover:bg-surface-2 hover:text-gold-deep"}`}>
            <span aria-hidden className="w-5 text-center">{icon}</span>{d[key]}
          </Link>
        );
      })}
    </nav>
  );
}
