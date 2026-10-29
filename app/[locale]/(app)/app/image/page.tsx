import { Composer } from "@/components/Composer";
import { CreationsList } from "@/components/CreationsList";
import { Feed } from "@/components/Feed";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { ta } from "@/lib/app-dict";
import { gallery } from "@/lib/media";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string; q?: string; view?: string; sort?: string }> }) {
  const locale = (await params).locale as Locale;
  const sp = await searchParams;
  const a = ta(locale);
  const tab = ["creations", "templates"].includes(sp.tab ?? "") ? sp.tab! : "creations";
  const tabs = [{ key: "creations", label: a.creations, icon: "library" }, { key: "templates", label: a.templates, icon: "cards" }];
  return (
    <>
      <PageHeader locale={locale} crumb={a.image} tabs={tabs} active={tab} basePath="image" toolbar filters />
      <main className="px-5 pb-72 md:px-8">
        {tab === "creations" && <CreationsList locale={locale} kind="image" q={sp.q} />}
        {tab === "templates" && <Feed locale={locale} type="image" titles open="template" q={sp.q} sort={sp.sort} view={sp.view === "row" ? "row" : "grid"} />}
      </main>
      <Composer locale={locale} initialMode="createImage" />
    </>
  );
}
