import { Composer } from "@/components/Composer";
import { CreationsList } from "@/components/CreationsList";
import { PageHeader } from "@/components/PageHeader";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

const voices: [string, string, string, string][] = [
  ["حمد", "Hamad", "narrative", "ar"], ["فاطمة", "Fatima", "conversational", "ar"], ["سالم", "Salem", "informative", "ar"], ["مريم", "Maryam", "narrative", "ar"],
  ["Bella", "Bella", "conversational", "en"], ["James", "James", "informative", "en"], ["خالد", "Khalid", "socialMedia", "ar"], ["Noor", "Noor", "entertainment", "en"],
];
const hues = [38, 28, 46, 20, 34, 42, 30, 50];

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string; q?: string }> }) {
  const locale = (await params).locale as Locale;
  const sp = await searchParams;
  const a = ta(locale);
  const tab = ["creations", "voices", "tutorial"].includes(sp.tab ?? "") ? sp.tab! : "creations";
  const i = locale === "ar" ? 0 : 1;
  return (
    <>
      <PageHeader locale={locale} crumb={a.voice} tabs={[{ key: "creations", label: a.creations, icon: "wave" }, { key: "voices", label: a.voices, icon: "mic" }, { key: "tutorial", label: a.tutorial, icon: "tutorial" }]} active={tab} basePath="voice" toolbar={tab === "creations"} />
      <main className="px-5 pb-80 md:px-8">
        {tab === "creations" && <CreationsList locale={locale} kind="audio" q={sp.q} />}
        {tab === "voices" && (
          <div className="mx-auto max-w-[1000px]">
            <div className="noscroll mb-6 flex gap-2 overflow-x-auto"><span className="pill pill-on"><span aria-hidden>⚙</span> {a.filterBtn}</span>{[a.narrative, a.conversational, a.informative, a.socialMedia].map((c) => <span key={c} className="pill">{c}</span>)}</div>
            <h2 className="mb-4 font-semibold">{a.trendingVoices}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {voices.map((v, k) => (
                <article key={v[1]} className="flex items-center gap-4 rounded-2xl bg-[#141414] p-3 hover:bg-[#1c1c1c]">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl text-xl font-bold text-black" style={{ background: `hsl(${hues[k]},50%,62%)` }}>{v[1][0]}</span>
                  <div className="min-w-0"><h3 className="font-semibold">{v[i]}</h3><p className="truncate text-xs text-white/55">{a[v[2]]}</p><p className="mt-1 text-xs">{v[3] === "ar" ? a.arabic : a.english}</p></div>
                </article>
              ))}
            </div>
          </div>
        )}
        {tab === "tutorial" && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[a.voiceover, a.voiceChanger, a.voices].map((t) => <article key={t} className="rounded-2xl bg-[#111] p-6"><h3 className="font-semibold">{t}</h3><div className="mt-4 flex h-16 items-center gap-[3px]" aria-hidden>{Array.from({ length: 40 }, (_, k) => <i key={k} className="w-[3px] rounded bg-gold/60" style={{ height: `${15 + ((k * 29) % 80)}%` }} />)}</div></article>)}</div>}
      </main>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[300px] bg-gradient-to-t from-black via-black/80 to-transparent md:ms-[calc(var(--sb)+20px)]" aria-hidden />
      <Composer locale={locale} initialMode="voiceover" />
    </>
  );
}
