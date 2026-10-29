"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./Icon";
import { Pop } from "./Pop";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

const main = [["", "home", "home"], ["explore", "explore", "explore"], ["templates", "templates", "cards"], ["reshoot", "reshoot", "reshoot"]] as const;
const tools = [["image", "image", "image"], ["video", "video", "video"], ["music", "music", "note"], ["voice", "voice", "wave"], ["artwork", "artwork", "palette"], ["enhancer", "enhancer", "enhance"], ["editor", "editor", "pen"], ["projects", "projects", "folder"]] as const;

export function AppSidebar({ locale }: { locale: Locale }) {
  const a = ta(locale);
  const path = usePathname();
  const base = `/${locale}/app`;
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => { const c = !collapsed; setCollapsed(c); document.documentElement.style.setProperty("--sb", c ? "64px" : "220px"); };
  const Item = ({ seg, k, icon }: { seg: string; k: string; icon: string }) => {
    const href = seg ? `${base}/${seg}` : base;
    const active = seg ? path === href || path.startsWith(href + "/") : path === base;
    return (
      <Link href={href} title={a[k]} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
        <Icon n={icon} size={18} />{!collapsed && a[k]}
      </Link>
    );
  };
  const mi = "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/5";
  return (
    <aside className="sheet z-30 m-2.5 flex flex-col overflow-hidden md:sticky md:top-2.5 md:h-[calc(100dvh-20px)]">
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && <Link href={base} className="flex items-center gap-2"><img src="/brand/logo.svg" alt="" width={22} height={28} /><span className="text-lg font-bold tracking-wide">{a.myAccount === "حسابي" ? "البرزة" : "ALBARZA"}</span></Link>}
        <button onClick={toggle} aria-label={a.collapse} className="hidden text-white/50 hover:text-white md:block"><Icon n="panel" size={16} /></button>
      </div>
      <nav className="noscroll flex gap-1 overflow-x-auto px-2 md:flex-1 md:flex-col md:overflow-y-auto">
        {main.map(([s, k, i]) => <Item key={k} seg={s} k={k} icon={i} />)}
        {!collapsed && <p className="hidden px-3 pb-1 pt-5 text-sm text-white/40 md:block">{a.tools}</p>}
        {tools.map(([s, k, i]) => <Item key={k} seg={s} k={k} icon={i} />)}
      </nav>
      <div className="hidden space-y-3 p-3 md:block">
        {!collapsed && (
          <Link href={`${base}/pricing`} className="upgrade flex items-center justify-between rounded-full px-4 py-3 text-sm font-semibold">
            <span className="flex items-center gap-1">{a.upgradeCta} <Icon n="arrow" size={13} /></span><span className="rounded-full bg-black/25 px-2 py-0.5 text-xs text-white">50</span>
          </Link>
        )}
        <Pop up align="start" panelClass="w-[250px] p-2 -ms-[-8px]" trigger={
          <span className="flex w-full items-center justify-between rounded-full bg-white/5 px-2 py-2 text-sm"><span className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-gold font-bold text-black">A</span>{!collapsed && a.myAccount}</span>{!collapsed && <Icon n={locale === "ar" ? "chevL" : "chevR"} size={14} />}</span>
        }>
          {(close) => (
            <div onClick={close}>
              <div className="flex items-center gap-3 p-2"><span className="grid h-10 w-10 place-items-center rounded-full bg-gold font-bold text-black">A</span><div><p className="text-sm font-semibold">{a.myAccount}</p><p className="text-xs text-white/50">{a.proPlan}</p></div></div>
              <div className="mb-2 rounded-xl bg-white/5 p-3 text-xs">
                <div className="flex justify-between"><span>{locale === "ar" ? "الأرصدة" : "Credits"}</span><span>50 {a.creditsLeft}</span></div>
                <div className="mt-2 flex gap-[2px]">{Array.from({ length: 24 }, (_, i) => <i key={i} className={`h-3 flex-1 rounded-sm ${i < 3 ? "bg-gold" : "bg-white/15"}`} />)}</div>
                <Link href={`${base}/pricing?tab=topup`} className="mt-3 flex items-center justify-between"><span className="flex items-center gap-2"><Icon n="coins" size={15} />{a.topUp}</span><span className="rounded-full bg-gold px-3 py-0.5 font-semibold text-black">{a.get}</span></Link>
              </div>
              <Link href={`${base}/profile`} className={mi}><Icon n="user" size={16} />{a.viewProfile}</Link>
              <Link href={`${base}/pricing`} className={mi}><Icon n="tag" size={16} />{a.pricingPlans}</Link>
              <Link href={`${base}/account`} className={mi}><Icon n="gear" size={16} />{a.manageAccount}</Link>
              <Link href={`/${locale}/help`} className={mi}><Icon n="lifebuoy" size={16} />{a.helpCenter}</Link>
              <Link href={`/${locale === "ar" ? "en" : "ar"}/app`} prefetch={false} className={mi}><Icon n="language" size={16} />{locale === "ar" ? "English" : "العربية"}</Link>
              <div className="my-1 border-t border-white/10" />
              <Link href={`/${locale}/login`} className={mi}><Icon n="logout" size={16} />{a.signOut}</Link>
            </div>
          )}
        </Pop>
      </div>
    </aside>
  );
}
