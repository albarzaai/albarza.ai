"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Pop } from "./Pop";
import { ta } from "@/lib/app-dict";
import { logoutAction } from "@/lib/auth-actions";
import { PlanName } from "./PlanName";
import type { Locale } from "@/lib/i18n";

const main = [["", "home", "home"], ["explore", "explore", "explore"], ["templates", "templates", "cards"], ["reshoot", "reshoot", "reshoot"]] as const;
const tools = [["image", "image", "image"], ["video", "video", "video"], ["music", "music", "note"], ["voice", "voice", "wave"], ["artwork", "artwork", "palette"], ["enhancer", "enhancer", "enhance"], ["editor", "editor", "pen"], ["projects", "projects", "folder"]] as const;

export function AppSidebar({ locale, credits: initialCredits = 0, plan = "starter" }: { locale: Locale; credits?: number; plan?: string }) {
  const a = ta(locale);
  const path = usePathname();
  const base = `/${locale}/app`;
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [credits, setCredits] = useState(initialCredits);
  useEffect(() => setCredits(initialCredits), [initialCredits]);
  useEffect(() => {
    const on = (e: Event) => setCredits((e as CustomEvent<number>).detail);
    window.addEventListener("albarza:credits", on);
    return () => window.removeEventListener("albarza:credits", on);
  }, []);
  useEffect(() => setDrawer(false), [path]);
  const toggle = () => { const c = !collapsed; setCollapsed(c); document.documentElement.style.setProperty("--sb", c ? "64px" : "300px"); };
  const Item = ({ seg, k, icon }: { seg: string; k: string; icon: string }) => {
    const href = seg ? `${base}/${seg}` : base;
    const active = seg ? path === href || path.startsWith(href + "/") : path === base;
    return (
      <Link href={href} title={a[k]} onClick={() => setDrawer(false)} className={`flex shrink-0 items-center gap-4 border-s-[3px] px-6 py-2.5 text-[15px] transition ${active ? "border-gold bg-white/[.07] text-white" : "border-transparent text-white/70 hover:bg-white/5 hover:text-white"}`}>
        <Icon n={icon} size={18} />{!collapsed && a[k]}
      </Link>
    );
  };
  const mi = "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/5";
  return (
    <>
      <div className="h-14 md:hidden" />
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-[#0b0b0b]/90 px-4 backdrop-blur md:hidden">
        <Link href={base} className="flex items-center gap-2"><img src="/brand/logo.svg" alt="" width={20} height={26} /><span className="text-base font-bold tracking-wide">{a.myAccount === "حسابي" ? "البرزة" : "ALBARZA"}</span></Link>
        <button type="button" aria-label="menu" aria-expanded={drawer} onClick={() => setDrawer(true)} className="grid size-10 place-items-center rounded-full hover:bg-white/10"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg></button>
      </div>
      {drawer && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setDrawer(false)} aria-hidden />}
      <aside className={`z-50 flex flex-col overflow-hidden border-white/10 bg-[#0b0b0b] transition-transform duration-200 max-md:fixed max-md:inset-y-0 max-md:start-0 max-md:w-[290px] max-md:border-e ${drawer ? "" : "max-md:ltr:-translate-x-full max-md:rtl:translate-x-full"} md:sticky md:top-0 md:z-30 md:h-dvh md:[border-inline-end-width:1px]`}>
      <div className="flex h-16 items-center justify-between px-6">
        {!collapsed && <Link href={base} className="flex items-center gap-2"><img src="/brand/logo.svg" alt="" width={22} height={28} /><span className="text-lg font-bold tracking-wide">{a.myAccount === "حسابي" ? "البرزة" : "ALBARZA"}</span></Link>}
        <button onClick={toggle} aria-label={a.collapse} className="hidden text-white/50 hover:text-white md:block"><Icon n="panel" size={16} /></button>
        <button type="button" onClick={() => setDrawer(false)} aria-label="close" className="grid size-9 place-items-center rounded-full text-white/70 hover:bg-white/10 md:hidden"><Icon n="close" size={16} /></button>
      </div>
      <nav className="noscroll flex flex-1 flex-col overflow-y-auto">
        {main.map(([s, k, i]) => <Item key={k} seg={s} k={k} icon={i} />)}
        {!collapsed && <p className="px-6 pb-1 pt-6 text-sm text-white/40">{a.tools}</p>}
        {tools.map(([s, k, i]) => <Item key={k} seg={s} k={k} icon={i} />)}
      </nav>
      <div className="border-t border-white/10">
        {!collapsed && (
          <Link href={`${base}/pricing`} className="upgrade flex items-center justify-between px-6 py-3.5 text-sm font-semibold">
            <span className="flex items-center gap-1">{a.upgradeCta} <Icon n="arrow" size={13} /></span><span className="rounded-full bg-black/25 px-2 py-0.5 text-xs text-white">{credits.toLocaleString(locale === "ar" ? "ar-AE" : "en-AE")}</span>
          </Link>
        )}
        <Pop up align="start" panelClass="w-[250px] p-2 -ms-[-8px]" trigger={
          <span className="flex w-full items-center justify-between px-6 py-3.5 text-sm hover:bg-white/5"><span className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-gold font-bold text-black">A</span>{!collapsed && a.myAccount}</span>{!collapsed && <Icon n={locale === "ar" ? "chevL" : "chevR"} size={14} />}</span>
        }>
          {(close) => (
            <div onClick={close}>
              <div className="flex items-center gap-3 p-2"><span className="grid h-10 w-10 place-items-center rounded-full bg-gold font-bold text-black">A</span><div><p className="text-sm font-semibold">{a.myAccount}</p><p className="text-xs text-white/50">{plan === "starter" ? (locale === "ar" ? "البداية" : "Starter") : <PlanName id={plan} locale={locale} />}</p></div></div>
              <div className="mb-2 rounded-xl bg-white/5 p-3 text-xs">
                <div className="flex justify-between"><span>{locale === "ar" ? "الأرصدة" : "Credits"}</span><span>{credits.toLocaleString(locale === "ar" ? "ar-AE" : "en-AE")} {a.creditsLeft}</span></div>
                <div className="mt-2 flex gap-[2px]">{Array.from({ length: 24 }, (_, i) => <i key={i} className={`h-3 flex-1 rounded-sm ${i < Math.min(24, Math.ceil((credits / 50) * 24)) ? "bg-gold" : "bg-white/15"}`} />)}</div>
                <Link href={`${base}/pricing?tab=topup`} className="mt-3 flex items-center justify-between"><span className="flex items-center gap-2"><Icon n="coins" size={15} />{a.topUp}</span><span className="rounded-full bg-gold px-3 py-0.5 font-semibold text-black">{a.get}</span></Link>
              </div>
              <Link href={`${base}/profile`} className={mi}><Icon n="user" size={16} />{a.viewProfile}</Link>
              <Link href={`${base}/pricing`} className={mi}><Icon n="tag" size={16} />{a.pricingPlans}</Link>
              <Link href={`${base}/account`} className={mi}><Icon n="gear" size={16} />{a.manageAccount}</Link>
              <Link href={`/${locale}/help`} className={mi}><Icon n="lifebuoy" size={16} />{a.helpCenter}</Link>
              <Link href={`/${locale === "ar" ? "en" : "ar"}/app`} prefetch={false} className={mi}><Icon n="language" size={16} />{locale === "ar" ? "English" : "العربية"}</Link>
              <div className="my-1 border-t border-white/10" />
              <form action={logoutAction}><input type="hidden" name="locale" value={locale} /><button className={mi}><Icon n="logout" size={16} />{a.signOut}</button></form>
            </div>
          )}
        </Pop>
      </div>
    </aside>
    </>
  );
}
