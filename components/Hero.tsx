import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

// The prompt box is a plain form that posts to signup; validation happens on the server.
export function Hero({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="bg-surface-2">
      <div className="section grid items-center gap-12 py-16 lg:grid-cols-[1.2fr_1fr] lg:py-24">
        <div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{d.heroTitle}</h1>
          <p className="mt-5 max-w-xl text-muted">{d.heroSub}</p>
          <form action={`/${locale}/signup`} className="card mt-8 bg-white p-3">
            <textarea name="prompt" rows={3} maxLength={1000} placeholder={d.promptPh} className="w-full resize-none bg-transparent p-3 outline-none placeholder:text-muted" />
            <div className="flex flex-wrap items-center justify-between gap-3 p-1">
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted">
                {["Seedance 2.0 Fast", d.auto, d.sec4, d.res, d.audio].map((c) => (
                  <span key={c} className="rounded-md bg-surface-2 px-3 py-1.5">{c}</span>
                ))}
              </div>
              <button className="btn btn-gold">{d.generate}</button>
            </div>
          </form>
        </div>
        <div className="arch-outline mx-auto w-full max-w-sm bg-white">
          <div className="relative flex aspect-[3/4] items-center justify-center bg-gold">
            <svg viewBox="0 0 24 24" className="h-20 w-20" aria-hidden><path d="M7 4v16l13-8z" fill="#fff" /></svg>
          </div>
        </div>
      </div>
      <div className="band bg-white" />
    </section>
  );
}
