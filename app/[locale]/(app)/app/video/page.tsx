import { Composer } from "@/components/Composer";
import { CreationsList } from "@/components/CreationsList";
import { Feed } from "@/components/Feed";
import { PageHeader } from "@/components/PageHeader";
import { ta } from "@/lib/app-dict";
import { gallery } from "@/lib/media";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string; q?: string; view?: string; sort?: string }> }) {
  const locale = (await params).locale as Locale;
  const sp = await searchParams;
  const a = ta(locale);
  const tab = ["creations", "library", "templates"].includes(sp.tab ?? "") ? sp.tab! : "creations";
  const tabs = [{ key: "creations", label: a.creations, icon: "library" }, { key: "library", label: a.motionLibrary, icon: "video" }, { key: "templates", label: a.templates, icon: "cards" }];
  return (
    <>
      <PageHeader locale={locale} crumb={a.video} tabs={tabs} active={tab} basePath="video" toolbar />
      <main className="px-5 pb-72 md:px-8">
        {tab === "creations" && <CreationsList locale={locale} kind="video" q={sp.q} />}
        {tab === "library" && <Feed locale={locale} type="motion" cols={4} open="template" q={sp.q} sort={sp.sort} view={sp.view === "row" ? "row" : "grid"} />}
        {tab === "templates" && <Feed locale={locale} type="template" titles open="template" q={sp.q} sort={sp.sort} view={sp.view === "row" ? "row" : "grid"} />}
      </main>
      <Composer locale={locale} initialMode={tab === "library" ? "motionControl" : "createVideo"} />
    </>
  );
}
