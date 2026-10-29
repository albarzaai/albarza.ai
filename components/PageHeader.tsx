import Link from "next/link";
import { Icon } from "./Icon";
import { Toolbar } from "./Toolbar";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

export type TabDef = { key: string; label: string; icon: string };

// Davinci-style sticky header: title (or Tools › X) on the start side, pill tabs in the middle, controls at the end.
export function PageHeader({ locale, title, crumb, tabs, active, basePath, toolbar = false, filters = true, right }: {
  locale: Locale; title?: string; crumb?: string; tabs?: TabDef[]; active?: string; basePath?: string; toolbar?: boolean; filters?: boolean; right?: React.ReactNode;
}) {
  const a = ta(locale);
  return (
    <header className="sticky top-0 z-30 grid min-h-[76px] grid-cols-[1fr_auto_1fr] items-center gap-3 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-transparent px-5 py-3 md:px-8">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        {crumb ? (<><span className="text-white/45">{a.tools}</span><Icon n={locale === "ar" ? "chevL" : "chevR"} size={13} className="text-white/30" /><span className="text-base font-semibold">{crumb}</span></>) : <span className="text-base font-semibold">{title}</span>}
      </div>
      <nav className="noscroll flex gap-1 overflow-x-auto">
        {tabs?.map((t) => (
          <Link key={t.key} href={`/${locale}/app/${basePath}?tab=${t.key}`} scroll={false} className={`pill !py-2 ${t.key === active ? "pill-on" : "!bg-transparent text-white/65"}`}><Icon n={t.icon} size={15} />{t.label}</Link>
        ))}
      </nav>
      <div className="flex justify-end">{toolbar ? <Toolbar locale={locale} filters={filters} /> : right}</div>
    </header>
  );
}
