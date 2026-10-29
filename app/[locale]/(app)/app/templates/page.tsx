import { Composer } from "@/components/Composer";
import { Feed } from "@/components/Feed";
import { PageHeader } from "@/components/PageHeader";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

const chips: [string, string][] = [["Trending", "رائج"], ["Edit", "تعديل"], ["Product Ads", "إعلانات المنتجات"], ["Photography", "تصوير"], ["Creative", "إبداعي"], ["Tattoo", "وشم"]];

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string; q?: string; view?: string; sort?: string }> }) {
  const locale = (await params).locale as Locale;
  const sp = await searchParams;
  const a = ta(locale);
  const tab = ["video", "motion", "image"].includes(sp.tab ?? "") ? sp.tab! : "video";
  const tabs = [{ key: "video", label: a.tabVideo, icon: "video" }, { key: "motion", label: a.motionLibrary, icon: "library" }, { key: "image", label: a.tabImage, icon: "image" }];
  return (
    <>
      <PageHeader locale={locale} title={a.templates} tabs={tabs} active={tab} basePath="templates" />
      <main className="px-5 pb-72 md:px-8">
        {tab === "image" && <div className="noscroll mb-4 flex gap-2 overflow-x-auto">{[locale === "ar" ? "الكل" : "All", ...chips.map((c) => c[locale === "ar" ? 1 : 0])].map((c, i) => <span key={c} className={`pill ${i === 0 ? "pill-on" : ""}`}>{c}</span>)}</div>}
        <Feed locale={locale} type={tab === "video" ? "template" : tab === "motion" ? "motion" : "image"} titles={tab !== "motion"} open="template" q={sp.q} sort={sp.sort} view={sp.view === "row" ? "row" : "grid"} />
      </main>
      <Composer locale={locale} initialMode={tab === "image" ? "createImage" : "createVideo"} />
    </>
  );
}
