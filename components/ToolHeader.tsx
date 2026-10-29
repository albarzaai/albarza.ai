import Link from "next/link";
import { Icon } from "./Icon";
import { toolTitles } from "@/lib/content";
import { tools, type Tab, type ToolSlug } from "@/lib/tools";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

const tabIcon: Record<Tab, string> = { creations: "library", library: "video", templates: "template", tutorial: "tutorial", voices: "mic" };
export type View = { q: string; sort: "new" | "old"; view: "grid" | "row"; kind: string };

// All controls are plain links/forms (no client JS): state lives in the URL.
export function ToolHeader({ locale, tool, tab, v }: { locale: Locale; tool: ToolSlug; tab: Tab; v: View }) {
  const d = t(locale);
  const cfg = tools[tool];
  const showTools = tab === "creations" || tab === "templates" || tab === "library";
  const href = (o: Partial<View>) => {
    const n = { ...v, ...o };
    const sp = new URLSearchParams({ tab });
    if (n.q) sp.set("q", n.q); if (n.sort !== "new") sp.set("sort", n.sort); if (n.view !== "grid") sp.set("view", n.view); if (n.kind !== "all") sp.set("kind", n.kind);
    return `/${locale}/app/${tool}?${sp}`;
  };
  const pill = "rounded-lg px-3 py-1.5 text-xs transition";
  return (
    <header className="sticky top-0 z-30 flex min-h-[72px] flex-wrap items-center justify-between gap-3 bg-bg/90 px-5 py-3 backdrop-blur md:px-8">
      <div className="flex items-center gap-2 text-sm"><span className="text-white/50">{d.breadTools}</span><span className="text-white/30">{locale === "ar" ? "‹" : "›"}</span><span className="font-semibold">{toolTitles[tool][locale]}</span></div>
      <nav className="noscroll flex gap-1 overflow-x-auto rounded-full">
        {cfg.tabs.map((k) => (
          <Link key={k} href={`/${locale}/app/${tool}?tab=${k}`} className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition ${k === tab ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}>
            <Icon n={tabIcon[k]} size={15} />{d[k]}
          </Link>
        ))}
      </nav>
      <div className="relative flex items-center gap-4 text-sm text-white/70">
        {showTools ? (
          <>
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 hover:text-white"><Icon n="filter" size={15} />{d.filters}</summary>
              <div className="absolute end-0 top-9 z-40 w-64 space-y-4 rounded-2xl border border-line bg-surface p-4 shadow-2xl">
                <div><p className="mb-2 text-xs text-muted">{d.sortBy}</p><div className="flex gap-1">{(["new", "old"] as const).map((s) => <Link key={s} href={href({ sort: s })} className={`${pill} ${v.sort === s ? "bg-gold text-black" : "bg-white/5"}`}>{s === "new" ? d.sortNew : d.sortOld}</Link>)}</div></div>
                <div><p className="mb-2 text-xs text-muted">{d.kind}</p><div className="flex flex-wrap gap-1">{([["all", d.all], ["image", d.images], ["video", d.videos], ["audio", d.audios]] as const).map(([k, l]) => <Link key={k} href={href({ kind: k })} className={`${pill} ${v.kind === k ? "bg-gold text-black" : "bg-white/5"}`}>{l}</Link>)}</div></div>
                <Link href={`/${locale}/app/${tool}?tab=${tab}`} className="block text-xs text-gold-hi">{d.clearFilters}</Link>
              </div>
            </details>
            <Link href={href({ view: v.view === "grid" ? "row" : "grid" })} className="hidden items-center gap-1.5 hover:text-white sm:flex"><Icon n="grid" size={15} />{v.view === "grid" ? d.viewRow : d.viewGrid}</Link>
            <form action={`/${locale}/app/${tool}`} className="relative flex items-center">
              <input type="hidden" name="tab" value={tab} />
              <Icon n="search" size={15} className="pointer-events-none absolute start-3" />
              <input name="q" defaultValue={v.q} maxLength={60} placeholder={d.searchPh} className="w-36 rounded-full border border-line bg-surface-2 py-1.5 ps-9 pe-3 text-xs outline-none focus:border-gold md:w-48" />
            </form>
          </>
        ) : <span className="w-24" />}
      </div>
    </header>
  );
}
