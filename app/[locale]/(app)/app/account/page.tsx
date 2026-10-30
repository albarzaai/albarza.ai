import { PlanName } from "@/components/PlanName";
import Link from "next/link";
import { DeleteForm, EmailForm, MembershipButton, PasswordForm, ProfileForm, SessionsList, type SessionRow } from "@/components/AccountForms";
import { Icon } from "@/components/Icon";
import { Toggle } from "@/components/Toggle";
import { api, currentUser, getToken } from "@/lib/session";
import { redirect } from "next/navigation";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

const secs = [["account", "user"], ["usage", "chart"], ["plan", "gem"], ["support", "lifebuoy"], ["terms", "doc"]] as const;
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <section className={`rounded-2xl bg-[#121212] p-5 ${className}`}>{children}</section>;
const Row = ({ title, sub, right }: { title: string; sub?: string; right: React.ReactNode }) => <Card className="flex items-center justify-between gap-4"><div><h2 className="font-semibold">{title}</h2>{sub && <p className="mt-1 text-sm text-white/55">{sub}</p>}</div>{right}</Card>;

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ section?: string; emailChanged?: string }> }) {
  const locale = (await params).locale as Locale;
  const { section } = await searchParams;
  const a = ta(locale);
  const user = await currentUser();
  if (!user) redirect(`/${locale}/login?next=/${locale}/app/account`);
  const sessions = ((await api<{ sessions?: SessionRow[] }>("/me/sessions", { token: await getToken() })).data.sessions) ?? [];
  const ar = locale === "ar";
  const sec = secs.some((s) => s[0] === section) ? section! : "account";
  const label: Record<string, string> = { account: a.account, usage: a.usage, plan: a.plan, support: a.support, terms: a.termsPolicies };
  const n = (x: number) => x.toLocaleString(locale === "ar" ? "ar-AE" : "en-AE");
  const base = `/${locale}/app/account`;
  return (
    <div>
      <Link href={`/${locale}/app`} className="flex h-[60px] items-center gap-3 border-b border-white/5 px-6 text-lg"><Icon n={locale === "ar" ? "chevR" : "chevL"} size={18} />{a.backHome}</Link>
      <div className="grid gap-6 p-5 md:grid-cols-[240px_minmax(0,720px)] md:p-6">
        <nav className="flex gap-1 overflow-x-auto md:flex-col">{secs.map(([k, i]) => <Link key={k} href={`${base}?section=${k}`} className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 ${k === sec ? "bg-white/10" : "text-white/60 hover:text-white"}`}><Icon n={i} size={17} />{label[k]}</Link>)}<Link href={`/${locale}/login`} className="flex items-center gap-3 rounded-xl px-4 py-3 text-red-400"><Icon n="logout" size={17} />{a.logOut}</Link></nav>
        <div className="space-y-4">
          {sec === "account" && (<>
            {(await searchParams).emailChanged === "1" && <Card className="!bg-gold/15 text-sm">{ar ? "تم تغيير بريدك الإلكتروني ✓" : "Your email was changed ✓"}</Card>}
            <Card className="flex items-center gap-5"><span className="grid h-20 w-20 place-items-center rounded-full bg-gold text-2xl font-bold text-black">{(user.name || user.email).trim().charAt(0).toUpperCase()}</span><div className="min-w-0 flex-1"><p className="truncate text-lg font-semibold">{user.name}{user.role === "admin" && <span className="ms-2 rounded-full bg-gold px-2 py-0.5 align-middle text-[11px] font-bold text-black">{ar ? "مشرف" : "Admin"}</span>}</p><p className="truncate text-sm text-white/55" dir="ltr">{user.email}</p>{!user.emailVerified && <p className="mt-1 text-xs text-gold">{ar ? "البريد غير مؤكد بعد" : "Email not confirmed yet"}</p>}</div></Card>
            <Card><h2 className="mb-4 font-semibold">{ar ? "الملف الشخصي" : "Profile"}</h2><ProfileForm locale={locale} name={user.name} lang={user.locale} marketing={user.marketing} /></Card>
            <Card><h2 className="mb-4 font-semibold">{ar ? "تغيير البريد الإلكتروني" : "Change email"}</h2><EmailForm locale={locale} /></Card>
            {user.hasPassword && <Card><h2 className="mb-4 font-semibold">{a.password}</h2><PasswordForm locale={locale} /></Card>}
            <Card><h2 className="mb-4 font-semibold">{ar ? "الأجهزة المسجّلة" : "Signed-in devices"}</h2><SessionsList locale={locale} sessions={sessions} /></Card>
            <Card><h2 className="font-semibold">{ar ? "بياناتك" : "Your data"}</h2><p className="mt-1 text-sm text-white/55">{ar ? "نزّل نسخة كاملة من بيانات حسابك." : "Download a full copy of your account data."}</p><a href={`${base}/export`} download className="pill mt-4"><Icon n="download" size={14} />{a.exportData}</a></Card>
            <Card className="border border-red-500/30"><h2 className="mb-4 font-semibold text-red-300">{a.deleteAccount}</h2><DeleteForm locale={locale} hasPassword={user.hasPassword} /></Card>
          </>)}
          {sec === "usage" && (<>
            <div><h2 className="text-lg font-semibold">{a.usageStats}</h2><p className="text-sm text-white/55">{a.usageSub}</p></div>
            <div className="flex gap-2"><Link href={`/${locale}/app/pricing?tab=topup`} className="pill"><Icon n="coins" size={14} />{a.buyCredits}</Link><Link href={`${base}?section=plan`} className="pill"><Icon n="card" size={14} />{a.billing}</Link></div>
            <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm text-white/60">{a.dateRange2}<select className="mt-1 block w-full rounded-xl bg-[#121212] px-3 py-2 text-white"><option>{a.last7}</option><option>{a.last30}</option></select></label><label className="text-sm text-white/60">{a.product}<select className="mt-1 block w-full rounded-xl bg-[#121212] px-3 py-2 text-white"><option>{a.all}</option><option>{a.video}</option><option>{a.image}</option></select></label></div>
            <div className="grid gap-3 sm:grid-cols-3">{[[a.totalGeneration, n(10), a.yourGenerations], [a.totalCredits, n(484), a.creditsConsumed], [a.totalModel, n(7), a.modelsUsed]].map(([t, v, s]) => <Card key={t}><p className="text-[11px] tracking-wider text-white/45">{t}</p><p className="mt-2 text-3xl font-bold">{v}</p><p className="text-xs text-white/50">{s}</p></Card>)}</div>
            <Card><p className="mb-4 flex items-center gap-2 text-[11px] tracking-wider text-white/45"><Icon n="chart" size={13} />{a.usageOverTime}</p><div className="flex h-56 items-end gap-3" dir="ltr">{[12, 58, 8, 76, 30, 100, 44].map((h, k) => <div key={k} className="flex flex-1 flex-col-reverse overflow-hidden rounded-t-md" style={{ height: `${h}%` }}><i className="h-1/2 bg-gold" /><i className="h-1/3 bg-[#e2c88d]" /><i className="h-1/6 bg-[#7d5f22]" /></div>)}</div></Card>
          </>)}
          {sec === "plan" && (<>
            <Card className="!p-0 overflow-hidden"><p className="bg-white/5 px-5 py-2 text-xs text-white/60">{a.subscription}</p><div className="flex items-center justify-between p-5"><div><h2 className="text-lg font-semibold">{user.plan === "starter" ? (ar ? "البداية (مجانية)" : "Starter (free)") : <PlanName id={user.plan} locale={locale} />}</h2><p className="text-sm text-white/55">{user.plan === "starter" ? (ar ? "لا توجد عملية دفع حالياً." : "No billing yet.") : user.planPeriodEnd ? `${user.planCancelAtPeriodEnd ? (ar ? "ينتهي في" : "Ends on") : a.planEnds} ${new Date(user.planPeriodEnd).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-AE", { dateStyle: "long" })}` : ""}</p></div><Link href={`/${locale}/app/pricing`} className="gbtn"><Icon n="spark" size={14} />{a.changePlan}</Link></div></Card>
            <Card className="!p-0 overflow-hidden"><p className="bg-white/5 px-5 py-2 text-xs text-white/60">{a.creditsT}</p><div className="space-y-4 p-5"><div className="flex items-center justify-between text-sm"><span className="text-white/60">{a.remaining}</span><span className="flex items-center gap-3">{a.autoRefill}<Toggle label={a.autoRefill} /></span></div><p className="text-2xl font-bold">{n(user.credits)}</p><div className="rail"><div className="h-full rounded-full bg-gold" style={{ width: `${Math.min(100, user.credits / 10)}%` }} /></div><div className="flex justify-end"><Link href={`/${locale}/app/pricing?tab=topup`} className="gbtn"><Icon n="coins" size={14} />{a.buyCredits}</Link></div></div></Card>
            <Card><p className="text-sm text-white/60">{a.paymentMethod}</p><button className="mt-3 flex items-center gap-2 text-sm"><span aria-hidden>＋</span>{a.addPayment}</button></Card>
            <Row title={a.billingInfo} sub={a.billingInfoSub} right={<button className="pill"><Icon n="doc" size={14} />{a.invoices}</button>} />
            <Card><h2 className="font-semibold">{ar ? "الاشتراك" : "Membership"}</h2><p className="text-sm text-white/55">{user.plan === "starter" ? (ar ? "أنت على الخطة المجانية. لا يوجد اشتراك مدفوع لإلغائه." : "You are on the free plan. There is no paid membership to cancel.") : user.planCancelAtPeriodEnd ? (ar ? "سيُلغى اشتراكك في نهاية الفترة الحالية." : "Your membership will end at the close of the current period.") : a.manageSubs}</p>{user.plan !== "starter" && <div className="mt-4"><MembershipButton locale={locale} cancelling={user.planCancelAtPeriodEnd} label={user.planCancelAtPeriodEnd ? undefined : a.cancelSub} /></div>}</Card>
          </>)}
          {sec === "support" && <Card><h2 className="font-semibold">{a.supportT}</h2><p className="mt-1 text-sm text-white/55">{a.supportSub}</p><Link href={`/${locale}/contact`} className="gbtn mt-4">{a.contactUs}</Link></Card>}
          {sec === "terms" && [[a.terms, "terms"], [a.privacy, "privacy"], [a.refund, "refund"], [a.cookies, "cookies"]].map(([l, h]) => <Row key={h} title={l} right={<Link href={`/${locale}/${h}`} className="pill"><Icon n="arrow" size={13} /></Link>} />)}
        </div>
      </div>
    </div>
  );
}
