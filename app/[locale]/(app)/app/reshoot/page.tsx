import { Composer } from "@/components/Composer";
import { Feed } from "@/components/Feed";
import { PageHeader } from "@/components/PageHeader";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

const cats: [string, string][] = [["All", "الكل"], ["Trending Shots", "لقطات رائجة"], ["Sports Chic", "أناقة رياضية"], ["Back to 90s", "العودة للتسعينات"], ["Business Portraits", "صور مهنية"], ["Birthday Photoshoot", "جلسة عيد ميلاد"], ["Coachella", "كوتشيلا"], ["Furry Friends", "أصدقاء الفرو"]];

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string; cat?: string }> }) {
  const locale = (await params).locale as Locale;
  const sp = await searchParams;
  const a = ta(locale);
  const tab = sp.tab === "dance" ? "dance" : "spotlight";
  const cat = cats.some((c) => c[0] === sp.cat) ? sp.cat! : "All";
  return (
    <>
      <PageHeader locale={locale} title={a.reshoot} tabs={[{ key: "spotlight", label: a.spotlight, icon: "spark" }, { key: "dance", label: a.dance, icon: "user" }]} active={tab} basePath="reshoot" />
      <main className="px-5 pb-72 md:px-8">
        {tab === "spotlight" && (
          <nav className="noscroll mb-4 flex gap-6 overflow-x-auto border-b border-white/10">
            {cats.map(([k, ar]) => <a key={k} href={`?tab=spotlight&cat=${encodeURIComponent(k)}`} className={`whitespace-nowrap pb-3 text-sm ${k === cat ? "border-b-2 border-white font-semibold" : "text-white/55 hover:text-white"}`}>{locale === "ar" ? ar : k}</a>)}
          </nav>
        )}
        <Feed locale={locale} type={tab === "dance" ? "dance" : "reshoot"} cols={4} open="template" />
      </main>
      <Composer locale={locale} initialMode={tab === "dance" ? "motionControl" : "createImage"} />
    </>
  );
}
