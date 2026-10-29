import { plans, planName, t } from "@/lib/dict";
import { aed, type Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const d = t(locale);
  return (
    <div className="p-5 md:p-8 mx-auto max-w-5xl space-y-8">
      <h1 className="text-2xl font-bold">{d.billing}</h1>
      <div className="card flex items-center justify-between p-5"><span className="text-muted">{d.currentPlan}</span><b>{planName.starter[locale]} · {d.free}</b></div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.id} className="card p-6">
            <h2 className="font-semibold">{planName[p.id][locale]}</h2>
            <p className="mt-3 text-3xl font-bold">{aed(p.price, locale)}</p>
            <p className="mt-1 text-sm text-muted">{p.credits} {d.credits} {d.perMonth}</p>
            <button className="btn btn-gold mt-5 w-full">{d.upgrade}</button>
          </div>
        ))}
      </div>
      <section className="card p-5"><h2 className="font-semibold">{d.invoices}</h2><p className="mt-2 text-sm text-muted">—</p></section>
    </div>
  );
}
