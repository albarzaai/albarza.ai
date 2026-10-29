import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const d = t(locale);
  return (
    <div className="p-5 md:p-8 mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">{d.settings}</h1>
      <form className="card space-y-4 p-6" noValidate>
        <h2 className="font-semibold">{d.account}</h2>
        <div><label className="label">{d.name}</label><input name="name" className="input" /></div>
        <div><label className="label">{d.email}</label><input name="email" dir="ltr" className="input" /></div>
        <button className="btn btn-gold">{d.save}</button>
      </form>
      <section className="card border-red-900/60 p-6">
        <h2 className="font-semibold text-red-400">{d.dangerZone}</h2>
        <button className="btn btn-ghost mt-4 !border-red-900 text-red-400">{d.deleteAccount}</button>
      </section>
    </div>
  );
}
