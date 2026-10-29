import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export type LegalSection = { h: Record<Locale, string>; p: Record<Locale, string> };

export function LegalPage({ locale, title, sections }: { locale: Locale; title: string; sections: LegalSection[] }) {
  const d = t(locale);
  return (
    <main className="section max-w-5xl pt-32">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <p className="mt-3 text-sm text-muted">{d.legalUpdated}: {new Date("2026-10-29").toLocaleDateString(locale === "ar" ? "ar-AE" : "en-AE", { dateStyle: "long" })} · {d.legalDraft}</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <nav aria-label={d.toc} className="hidden lg:block"><div className="sticky top-24 space-y-2 text-sm text-muted"><p className="font-semibold text-white">{d.toc}</p>{sections.map((s, i) => <a key={i} href={`#s${i}`} className="block hover:text-white">{s.h[locale]}</a>)}</div></nav>
        <div className="space-y-10">{sections.map((s, i) => (<section key={i} id={`s${i}`}><h2 className="text-xl font-semibold">{i + 1}. {s.h[locale]}</h2><p className="mt-3 leading-8 text-muted">{s.p[locale]}</p></section>))}</div>
      </div>
    </main>
  );
}
