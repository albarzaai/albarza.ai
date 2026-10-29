import Link from "next/link";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

// The prompt box is a plain form that posts to signup; validation happens on the server.
export function Hero({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <section className="pattern relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(189,155,95,.35),transparent)]" />
      <div className="section relative flex flex-col items-center py-24 text-center md:py-32">
        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">{d.heroTitle}</h1>
        <p className="mt-5 max-w-2xl text-muted">{d.heroSub}</p>
        <form action={`/${locale}/signup`} className="card mt-10 w-full max-w-3xl p-3 text-start">
          <textarea name="prompt" rows={3} maxLength={1000} placeholder={d.promptPh} className="w-full resize-none bg-transparent p-3 outline-none placeholder:text-muted" />
          <div className="flex flex-wrap items-center justify-between gap-3 p-1">
            <div className="flex flex-wrap gap-2 text-xs text-muted">
              {["Seedance 2.0 Fast", d.auto, d.sec4, d.res, d.audio].map((c) => (
                <span key={c} className="rounded-full border border-line bg-surface-2 px-3 py-1.5">{c}</span>
              ))}
            </div>
            <button className="btn btn-gold">{d.generate}</button>
          </div>
        </form>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {[1, 2, 3, 4].map((n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={n} src={`/media/gallery-${n + 4}.svg`} alt="" width={160} height={100} loading="lazy" className="h-24 w-36 rounded-xl border border-line object-cover" />
          ))}
        </div>
        <Link href={`/${locale}/signup`} className="sr-only">{d.signup}</Link>
      </div>
    </section>
  );
}
