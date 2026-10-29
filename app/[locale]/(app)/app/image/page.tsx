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
  const tab = ["creations", "templates", "tutorial"].includes(sp.tab ?? "") ? sp.tab! : "creations";
  const tabs = [{ key: "creations", label: a.creations, icon: "library" }, { key: "templates", label: a.templates, icon: "cards" }, { key: "tutorial", label: a.tutorial, icon: "tutorial" }];
  return (
    <>
      <PageHeader locale={locale} crumb={a.image} tabs={tabs} active={tab} basePath="image" toolbar filters />
      <main className="px-5 pb-72 md:px-8">
        {tab === "creations" && <CreationsList locale={locale} kind="image" q={sp.q} />}
        {tab === "templates" && <Feed locale={locale} type="image" titles open="template" q={sp.q} sort={sp.sort} view={sp.view === "row" ? "row" : "grid"} />}
        {tab === "tutorial" && (
          <div className="relative mx-auto max-w-[1000px] overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery(7)} alt="" className="aspect-video w-full object-cover" />
            <div className="absolute inset-0 grid place-items-center bg-black/35 text-center"><div><p className="text-4xl font-bold md:text-6xl">{locale === "ar" ? "نقدّم لكم" : "Introducing"}</p><p className="mt-6 text-4xl font-bold md:text-6xl">{locale === "ar" ? "نماذج الصور" : "Image Models"}</p></div></div>
            <div className="absolute start-6 top-1/2 hidden w-64 -translate-y-1/2 space-y-2 md:block"><p className="dock !rounded-2xl p-3 text-xs">{a.describeImage}</p>{[a.changeLighting, a.background, a.retouch].map((t) => <p key={t} className="dock flex items-center gap-2 !rounded-full px-3 py-1.5 text-xs"><Icon n="spark" size={12} />{t}</p>)}</div>
          </div>
        )}
      </main>
      <Composer locale={locale} initialMode="createImage" />
    </>
  );
}
