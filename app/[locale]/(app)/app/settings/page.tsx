import Link from "next/link";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

const secs = ["profile", "security", "notifications", "privacy", "preferences"] as const;
const Toggle = ({ name, label, on }: { name: string; label: string; on?: boolean }) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-line py-4 text-sm last:border-0"><span>{label}</span>
    <input type="checkbox" name={name} defaultChecked={on} className="peer sr-only" /><span className="relative h-6 w-11 rounded-full bg-white/15 transition after:absolute after:start-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-gold peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5" /></label>
);

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ section?: string }> }) {
  const locale = (await params).locale as Locale;
  const { section } = await searchParams;
  const sec = (secs as readonly string[]).includes(section ?? "") ? section! : "profile";
  const d = t(locale);
  const label: Record<string, string> = { profile: d.secProfile, security: d.secSecurity, notifications: d.secNotifications, privacy: d.secPrivacy, preferences: d.secPreferences };
  return (
    <div className="mx-auto max-w-4xl p-5 md:p-8">
      <h1 className="mb-6 text-xl font-semibold">{d.settings}</h1>
      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        <nav className="flex gap-1 overflow-x-auto md:flex-col">{secs.map((s) => <Link key={s} href={`/${locale}/app/settings?section=${s}`} className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm ${s === sec ? "bg-white/10" : "text-white/60 hover:text-white"}`}>{label[s]}</Link>)}</nav>
        <div>
          {sec === "profile" && (
            <form className="card space-y-4 p-6" noValidate>
              <div className="flex items-center gap-4"><span className="grid h-16 w-16 place-items-center rounded-full bg-gold text-xl font-bold text-black">A</span><button type="button" className="btn btn-ghost">{d.uploadFile}</button></div>
              <div><label className="label" htmlFor="n">{d.name}</label><input id="n" name="name" className="input" /></div>
              <div><label className="label" htmlFor="e">{d.email}</label><input id="e" name="email" dir="ltr" className="input" /></div>
              <button className="btn btn-gold">{d.save}</button>
            </form>
          )}
          {sec === "security" && (
            <div className="space-y-6">
              <form className="card space-y-4 p-6" noValidate>
                <h2 className="font-semibold">{d.changePassword}</h2>
                <div><label className="label" htmlFor="cp">{d.currentPassword}</label><input id="cp" name="current" type="password" dir="ltr" className="input" /></div>
                <div><label className="label" htmlFor="np">{d.newPassword}</label><input id="np" name="password" type="password" dir="ltr" className="input" /></div>
                <button className="btn btn-gold">{d.save}</button>
              </form>
              <div className="card flex items-center justify-between gap-4 p-6"><div><h2 className="font-semibold">{d.twoFactor}</h2><p className="text-sm text-muted">{d.twoFactorSub}</p></div><button className="btn btn-ghost">{d.enable}</button></div>
              <div className="card p-6"><h2 className="font-semibold">{d.sessions}</h2><p className="mt-3 text-sm text-muted">{d.thisDevice} · Chrome · {locale === "ar" ? "دبي" : "Dubai"}</p><button className="btn btn-ghost mt-4">{d.signOutAll}</button></div>
            </div>
          )}
          {sec === "notifications" && (<form className="card p-6" noValidate><Toggle name="job" label={d.nJobDone} on /><Toggle name="product" label={d.nProduct} on /><Toggle name="promo" label={d.nPromo} /><Toggle name="billing" label={d.nBilling} on /><button className="btn btn-gold mt-4">{d.save}</button></form>)}
          {sec === "preferences" && (
            <form className="card space-y-4 p-6" noValidate>
              <div><label className="label" htmlFor="l">{d.defaultLang}</label><select id="l" name="lang" className="input" defaultValue={locale}><option value="ar">العربية</option><option value="en">English</option></select></div>
              <div><label className="label" htmlFor="th">{d.theme}</label><select id="th" name="theme" className="input"><option>{d.dark}</option></select></div>
              <button className="btn btn-gold">{d.save}</button>
            </form>
          )}
          {sec === "privacy" && (
            <div className="space-y-6">
              <div className="card p-6"><h2 className="font-semibold">{d.pdplTitle}</h2><p className="mt-2 text-sm leading-7 text-muted">{d.pdplSub}</p><div className="mt-4 flex flex-wrap gap-3"><button className="btn btn-ghost">{d.exportData}</button></div></div>
              <form className="card p-6" noValidate><h2 className="font-semibold">{d.consent}</h2><Toggle name="mk" label={d.marketingConsent} /></form>
              <div className="card border-red-900/60 p-6"><h2 className="font-semibold text-red-400">{d.dangerZone}</h2><p className="mt-2 text-sm text-muted">{d.deleteWarn}</p><button className="btn btn-ghost mt-4 !border-red-900 text-red-400">{d.deleteAccount}</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
