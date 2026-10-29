"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { toolTitles } from "@/lib/content";
import { tools, type ToolSlug } from "@/lib/tools";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export function AppSidebar({ locale }: { locale: Locale }) {
  const d = t(locale);
  const path = usePathname();
  const base = `/${locale}/app`;
  const Item = ({ href, icon, label }: { href: string; icon: string; label: string }) => {
    const active = path === href || path.startsWith(href + "/");
    return (
      <Link href={href} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
        <Icon n={icon} />{label}
      </Link>
    );
  };
  return (
    <aside className="border-line md:sticky md:top-0 md:flex md:h-dvh md:flex-col md:border-e">
      <div className="hidden h-[72px] items-center px-5 md:flex"><Logo locale={locale} href={base} /></div>
      <nav className="noscroll flex gap-1 overflow-x-auto p-2 md:flex-1 md:flex-col md:overflow-y-auto md:p-3">
        <p className="hidden px-3 pb-1 pt-2 text-xs text-white/40 md:block">{d.tools}</p>
        {(Object.keys(tools) as ToolSlug[]).map((s) => <Item key={s} href={`${base}/${s}`} icon={tools[s].icon} label={toolTitles[s][locale]} />)}
        <p className="hidden px-3 pb-1 pt-4 text-xs text-white/40 md:block">{d.assets}</p>
        <Item href={`${base}/assets`} icon="assets" label={d.assets} />
        <Item href={`${base}/projects`} icon="folder" label={d.projects} />
        <Item href={`${base}/activity`} icon="library" label={d.activity} />
      </nav>
      <div className="hidden space-y-2 border-t border-line p-3 md:block">
        <div className="rounded-xl bg-white/5 p-3 text-xs"><div className="flex justify-between text-white/60"><span>{d.credits}</span><b className="text-white">50</b></div>
          <Link href={`${base}/billing`} className="btn btn-gold mt-3 w-full !py-1.5">{d.upgrade}</Link></div>
        <Item href={`${base}/billing`} icon="card" label={d.billing} />
        <Item href={`${base}/settings`} icon="gear" label={d.settings} />
        <Link href={`/${locale === "ar" ? "en" : "ar"}/app`} className="block px-3 py-1 text-xs text-white/50 hover:text-white">{locale === "ar" ? "English" : "العربية"}</Link>
        <div className="flex items-center gap-3 border-t border-line px-3 pt-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-sm font-bold text-black">A</span><div className="min-w-0 flex-1 text-xs"><p className="truncate font-semibold">Albarza User</p><Link href={`/${locale}/login`} className="text-white/50 hover:text-white">{d.logout}</Link></div></div>
      </div>
    </aside>
  );
}
