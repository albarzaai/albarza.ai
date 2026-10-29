import { Icon } from "@/components/Icon";
import { plans, planName, t } from "@/lib/dict";
import { aed, type Locale } from "@/lib/i18n";

const packs = [[200, 29], [600, 79], [1500, 179]] as const;
const invoices = [["INV-0003", "2026-10-01", 69], ["INV-0002", "2026-09-01", 69], ["INV-0001", "2026-08-12", 29]] as const;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const d = t(locale);
  const n = (x: number) => x.toLocaleString(locale === "ar" ? "ar-AE" : "en-AE");
  const feats = [d.f1, d.f2, d.f3, d.f4, d.f5];
  return (
    <div className="mx-auto max-w-6xl space-y-10 p-5 md:p-8">
      <h1 className="text-xl font-semibold">{d.billing}</h1>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card p-5"><p className="text-xs text-muted">{d.currentPlan}</p><p className="mt-2 text-2xl font-bold">{planName.starter[locale]}</p><p className="text-sm text-muted">{d.free}</p></div>
        <div className="card p-5"><p className="text-xs text-muted">{d.creditsLeft}</p><p className="mt-2 text-2xl font-bold text-gold-hi">{n(50)}</p></div>
        <div className="card p-5"><p className="text-xs text-muted">{d.usage}</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[35%] rounded-full bg-gold" /></div><p className="mt-2 text-xs text-muted">{n(27)} / {n(50)}</p></div>
      </section>
      <section>
        <h2 className="mb-4 font-semibold">{d.upgrade}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.id} className={`card p-6 ${"popular" in p ? "!border-gold" : ""}`}>
              <div className="flex items-center justify-between"><h3 className="font-semibold">{planName[p.id][locale]}</h3>{p.id === "starter" && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{d.currentBadge}</span>}</div>
              <p className="mt-3 text-3xl font-bold">{aed(p.price, locale)}<span className="text-sm font-normal text-muted"> {d.perMonth}</span></p>
              <p className="mt-1 text-xs text-muted">{n(p.credits)} {d.monthlyCredits}</p>
              <ul className="mt-5 space-y-2 text-sm text-muted">{feats.slice(0, p.id === "starter" ? 2 : 5).map((f) => <li key={f} className="flex gap-2"><Icon n="spark" size={14} className="mt-0.5 text-gold" />{f}</li>)}</ul>
              <button disabled={p.id === "starter"} className={`btn mt-6 w-full ${p.id === "starter" ? "btn-ghost opacity-50" : "btn-gold"}`}>{p.id === "starter" ? d.currentBadge : d.upgrade}</button>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">{d.vatNote}</p>
      </section>
      <section>
        <h2 className="mb-4 font-semibold">{d.creditPacks}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {packs.map(([c, p]) => (<div key={c} className="card flex items-center justify-between p-5"><div><p className="text-xl font-bold">{n(c)} <span className="text-sm font-normal text-muted">{d.credits}</span></p><p className="text-xs text-muted">{aed(p, locale)} · {d.vatIncl}</p></div><button className="btn btn-ghost">{d.buyCredits}</button></div>))}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-[1fr_2fr]">
        <div className="card p-5"><h2 className="font-semibold">{d.paymentMethod}</h2><p className="mt-3 text-sm text-muted">{d.noPayment}</p><button className="btn btn-ghost mt-4">{d.addCard}</button></div>
        <div className="card overflow-x-auto p-5"><h2 className="font-semibold">{d.invoices}</h2>
          <table className="mt-4 w-full text-sm"><thead className="text-xs text-muted"><tr>{[d.invoiceNo, d.date, d.amount, d.status, ""].map((h, i) => <th key={i} className="pb-2 text-start font-normal">{h}</th>)}</tr></thead>
            <tbody>{invoices.map(([no, date, amt]) => (<tr key={no} className="border-t border-line"><td className="py-3 pe-4" dir="ltr">{no}</td><td className="pe-4">{new Date(date).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-AE", { dateStyle: "medium" })}</td><td className="pe-4">{aed(amt, locale)}</td><td className="pe-4 text-emerald-400">{d.paid}</td><td className="text-end"><button className="text-xs text-gold-hi">{d.download}</button></td></tr>))}</tbody></table>
        </div>
      </section>
    </div>
  );
}
