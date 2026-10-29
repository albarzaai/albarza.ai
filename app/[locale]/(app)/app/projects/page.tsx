import Link from "next/link";
import { gallery } from "@/lib/media";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

const names: [string, string][] = [["حملة رمضان", "Ramadan campaign"], ["إعلان المنتج", "Product ad"], ["فيلم قصير", "Short film"]];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const d = t(locale);
  const i = locale === "ar" ? 0 : 1;
  return (
    <div className="mx-auto max-w-6xl p-5 md:p-8">
      <h1 className="mb-6 text-xl font-semibold">{d.projects}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <form className="card flex min-h-56 flex-col justify-center gap-3 border-dashed p-5" noValidate>
          <label className="label" htmlFor="pname">{d.newProject}</label>
          <input id="pname" name="name" maxLength={80} className="input" />
          <button className="btn btn-gold">＋ {d.newProject}</button>
        </form>
        {names.map((n, k) => (
          <Link key={k} href={`/${locale}/app/projects/${k + 1}`} className="card overflow-hidden hover:!border-gold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery(k + 7)} alt="" width={400} height={300} loading="lazy" className="h-40 w-full object-cover" />
            <div className="p-4"><h2 className="font-semibold">{n[i]}</h2><p className="mt-1 text-xs text-muted">{12 - k * 3} {d.items} · {d.updated} {d.justNow}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
