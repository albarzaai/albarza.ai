import Link from "next/link";
import { Icon } from "./Icon";
import { toolTitles } from "@/lib/content";
import { tools, type Tab, type ToolSlug } from "@/lib/tools";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

const tabIcon: Record<Tab, string> = { creations: "library", library: "video", templates: "template", tutorial: "tutorial" };

export function ToolHeader({ locale, tool, tab }: { locale: Locale; tool: ToolSlug; tab: Tab }) {
  const d = t(locale);
  const cfg = tools[tool];
  const showTools = tab === "creations" || tab === "templates";
  return (
    <header className="sticky top-0 z-30 flex min-h-[72px] flex-wrap items-center justify-between gap-3 bg-bg/90 px-5 py-3 backdrop-blur md:px-8">
      <div className="flex items-center gap-2 text-sm"><span className="text-white/50">{d.breadTools}</span><span className="text-white/30">{locale === "ar" ? "‹" : "›"}</span><span className="font-semibold">{toolTitles[tool][locale]}</span></div>
      <nav className="noscroll flex gap-1 overflow-x-auto rounded-full">
        {cfg.tabs.map((k) => (
          <Link key={k} href={`/${locale}/app/${tool}?tab=${k}`} className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition ${k === tab ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}>
            <Icon n={tabIcon[k]} size={15} />{d[k]}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4 text-sm text-white/70">
        {showTools ? (<><span className="flex items-center gap-1.5"><Icon n="filter" size={15} />{d.filters}</span><span className="hidden items-center gap-1.5 sm:flex"><Icon n="grid" size={15} />{d.grid}</span><Icon n="search" size={16} /></>) : <span className="w-24" />}
      </div>
    </header>
  );
}
