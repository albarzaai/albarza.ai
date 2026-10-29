import { notFound } from "next/navigation";
import { Composer } from "@/components/Composer";
import { Feed } from "@/components/Feed";
import { JobList, sampleJobs } from "@/components/JobList";
import { ToolHeader, type View } from "@/components/ToolHeader";
import { VoiceLibrary } from "@/components/VoiceLibrary";
import { gallery } from "@/lib/media";
import { t } from "@/lib/dict";
import { isTool, tools, type Tab } from "@/lib/tools";
import type { Locale } from "@/lib/i18n";

type SP = { tab?: string; q?: string; sort?: string; view?: string; kind?: string };

export default async function ToolPage({ params, searchParams }: { params: Promise<{ locale: string; tool: string }>; searchParams: Promise<SP> }) {
  const { locale: l, tool } = await params;
  const sp = await searchParams;
  if (!isTool(tool)) notFound();
  const locale = l as Locale;
  const d = t(locale);
  const cfg = tools[tool];
  const tab: Tab = cfg.tabs.includes(sp.tab as Tab) ? (sp.tab as Tab) : cfg.defaultTab;
  const v: View = { q: (sp.q ?? "").slice(0, 60), sort: sp.sort === "old" ? "old" : "new", view: sp.view === "row" ? "row" : "grid", kind: ["image", "video", "audio"].includes(sp.kind ?? "") ? sp.kind! : "all" };
  const feedType = tab === "creations" ? (tool === "image" ? "image" : v.kind) : tab === "library" ? "motion" : "template";
  return (
    <>
      <ToolHeader locale={locale} tool={tool} tab={tab} v={v} />
      <main className="px-5 pb-8 md:px-8">
        {(tab === "templates" || tab === "library") && <Feed locale={locale} type={feedType} action={d.useTemplate} q={v.q} sort={v.sort} view={v.view} />}
        {tab === "voices" && <VoiceLibrary locale={locale} />}
        {tab === "tutorial" && (
          <div>
            <h1 className="mb-6 text-xl font-semibold">{d.tutorialTitle}</h1>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[[d.tut1, d.tut1d], [d.tut2, d.tut2d], [d.tut3, d.tut3d], [d.tut4, d.tut4d]].map(([title, text], i) => (
                <article key={title} className="card overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={gallery(i + 3)} alt="" width={400} height={300} loading="lazy" className="aspect-video w-full object-cover" />
                  <div className="p-4"><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm text-muted">{text}</p></div>
                </article>
              ))}
            </div>
          </div>
        )}
        {tab === "creations" && (
          <div className="flex min-h-[calc(100dvh-72px)] flex-col gap-6">
            <section aria-label={d.activity}><JobList locale={locale} compact jobs={sampleJobs.filter((j) => j.tool === tool || tool !== "video").slice(0, 3)} /></section>
            <div className="flex-1"><Feed locale={locale} type={feedType} q={v.q} sort={v.sort} view={v.view} /></div>
            <Composer locale={locale} tool={tool} />
          </div>
        )}
      </main>
    </>
  );
}
