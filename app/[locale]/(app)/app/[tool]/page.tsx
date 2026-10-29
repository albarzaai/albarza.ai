import { notFound } from "next/navigation";
import { Composer } from "@/components/Composer";
import { Feed } from "@/components/Feed";
import { Icon } from "@/components/Icon";
import { ToolHeader } from "@/components/ToolHeader";
import { t } from "@/lib/dict";
import { isTool, tools, type Tab } from "@/lib/tools";
import type { Locale } from "@/lib/i18n";

export default async function ToolPage({ params, searchParams }: { params: Promise<{ locale: string; tool: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { locale: l, tool } = await params;
  const { tab: rawTab } = await searchParams;
  if (!isTool(tool)) notFound();
  const locale = l as Locale;
  const d = t(locale);
  const cfg = tools[tool];
  const tab: Tab = cfg.tabs.includes(rawTab as Tab) ? (rawTab as Tab) : cfg.defaultTab;
  return (
    <>
      <ToolHeader locale={locale} tool={tool} tab={tab} />
      <main className="px-5 pb-8 md:px-8">
        {tab === "templates" && <Feed locale={locale} type="template" action={d.useTemplate} />}
        {tab === "library" && <Feed locale={locale} type="motion" action={d.useTemplate} />}
        {tab === "tutorial" && (
          <div>
            <h1 className="mb-6 text-xl font-semibold">{d.tutorialTitle}</h1>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[[d.tut1, d.tut1d], [d.tut2, d.tut2d], [d.tut3, d.tut3d], [d.tut4, d.tut4d]].map(([title, text], i) => (
                <article key={title} className="card overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/media/gallery-${i + 3}.svg`} alt="" width={400} height={300} loading="lazy" className="aspect-video w-full object-cover" />
                  <div className="p-4"><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm text-muted">{text}</p></div>
                </article>
              ))}
            </div>
          </div>
        )}
        {tab === "creations" && (
          <div className="flex min-h-[calc(100dvh-72px)] flex-col">
            <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-gold"><Icon n={cfg.icon} size={28} /></span>
              <h2 className="mt-5 font-semibold">{d.emptyCreations}</h2><p className="mt-1 text-sm text-muted">{d.emptyHint}</p>
            </div>
            <Composer locale={locale} tool={tool} />
          </div>
        )}
      </main>
    </>
  );
}
