import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const d = t(locale);
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-bold">{d.projects}</h1></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <form className="card flex min-h-48 flex-col justify-center gap-3 border-dashed p-5" noValidate>
          <label className="label" htmlFor="pname">{d.newProject}</label>
          <input id="pname" name="name" maxLength={80} className="input" />
          <button className="btn btn-gold">＋ {d.newProject}</button>
        </form>
        {[1, 2, 3].map((n) => (
          <div key={n} className="card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/media/gallery-${n + 6}.svg`} alt="" width={400} height={300} loading="lazy" className="h-36 w-full object-cover" />
            <div className="p-4"><h2 className="font-semibold">{d.newProject} {n}</h2><p className="text-xs text-muted">{d.recent}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
