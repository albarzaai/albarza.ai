"use client";

import Link from "next/link";
import { Composer, type Mode } from "./Composer";
import { EditProfile } from "./EditProfile";
import { EnhancerApp } from "./EnhancerApp";
import { FeedSkeleton } from "./Feed";
import { Icon } from "./Icon";
import { PageHeader, type TabDef } from "./PageHeader";
import { PopularPill } from "./PopularPill";
import { PricingView } from "./PricingView";
import { ProjectsList } from "./ProjectsList";
import { ta } from "@/lib/app-dict";
import { t as td } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

// Route skeletons for everything under /app/*. Static chrome (header, tabs, toolbar, composer, pills, headings, card text) is the REAL
// markup/components with the real labels; only data/media-dependent parts (images, feed cards) are skeleton blocks of the exact same size.
export const Bar = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => <div className={`skeleton ${className}`} style={style} />;
// Inline pill whose text is real (so height/width match) but painted as a skeleton.
const Ghost = ({ children, on = false }: { children: React.ReactNode; on?: boolean }) => <span className={`pill ${on ? "pill-on" : ""}`} style={{ background: "var(--color-surface-2)", color: "transparent" }}>{children}</span>;

type Search = { get: (k: string) => string | null };

// ---- shared body skeletons -------------------------------------------------------------------------------------------------------
// Same wrapper + sentinel as <Feed>, so the page height is identical.
const FeedBody = ({ max = 5, row = false }: { max?: 4 | 5; row?: boolean }) => (
  <div className="min-h-[100dvh]"><FeedSkeleton max={max} row={row} /><div className="h-12" /></div>
);

// Mirrors <CreationsList>: 3 seeded rows, each = date/prompt/model line (34px chip) + result tile.
const SEED_MODELS = ["Nano Banana", "GPT Image 2.5 Flare", "Seedance 2.0 Fast"];
function CreationsBody({ kind, locale }: { kind: "image" | "video" | "audio"; locale: Locale }) {
  const a = ta(locale);
  return (
    <div className="mx-auto max-w-[920px] space-y-8" aria-busy="true">
      {[0, 1, 2].map((i) => (
        <section key={i}>
          <div className="mb-3 flex items-center gap-3 text-xs text-white/55">
            <span className="h-4 w-4 rounded border border-white/25" aria-hidden />
            <span className="skeleton shrink-0 rounded text-transparent">{a.thisWeek}</span><span aria-hidden>•</span>
            <Bar className="h-4 min-w-0 flex-1 rounded" />
            <span className="skeleton shrink-0 rounded-full border border-transparent px-3 py-1.5 text-sm text-transparent">{SEED_MODELS[i]}</span>
          </div>
          {kind === "audio" ? <Bar className="mx-auto h-20 w-[min(86vw,560px)] rounded-2xl" />
            : <Bar className={`mx-auto block rounded-[28px] ${kind === "video" ? "aspect-video w-[min(80vw,680px)]" : "aspect-square w-[min(80vw,400px)]"}`} />}
        </section>
      ))}
    </div>
  );
}


// ---- page shell ------------------------------------------------------------------------------------------------------------------
function Shell({ locale, header, main = "pb-72", mode, fade, children }: { locale: Locale; header: React.ReactNode; main?: string; mode?: Mode; fade?: number; children: React.ReactNode }) {
  return (
    <div aria-busy="true">
      {header}
      <main className={`px-5 md:px-8 ${main}`}>{children}</main>
      {fade && <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[var(--fade)] bg-gradient-to-t from-black via-black/80 to-transparent md:ms-[calc(var(--sb)+20px)]" style={{ "--fade": `${fade}px` } as React.CSSProperties} aria-hidden />}
      {mode && <Composer locale={locale} initialMode={mode} />}
    </div>
  );
}

export function RouteSkeleton({ route, locale, sp, id }: { route: string; locale: Locale; sp: Search; id?: string }): React.ReactNode {
  const a = ta(locale);
  const ar = locale === "ar";
  const tab = sp.get("tab");
  const row = sp.get("view") === "row";
  const pick = (keys: string[], def: string) => (tab && keys.includes(tab) ? tab : def);
  const hdr = (p: Omit<React.ComponentProps<typeof PageHeader>, "locale">) => <PageHeader locale={locale} {...p} />;

  switch (route) {
    case "explore":
      return (
        <Shell locale={locale} mode="createImage" header={<>{hdr({ title: a.explore, tabs: [], right: null })}<div className="pointer-events-none absolute inset-x-0 top-0 z-30 hidden h-[76px] items-center justify-center md:flex"><div className="pointer-events-auto"><PopularPill locale={locale} /></div></div></>}>
          <FeedBody />
        </Shell>
      );
    case "image": {
      const t = pick(["creations", "templates"], "creations");
      const tabs: TabDef[] = [{ key: "creations", label: a.creations, icon: "library" }, { key: "templates", label: a.templates, icon: "cards" }];
      return (
        <Shell locale={locale} mode="createImage" header={hdr({ crumb: a.image, tabs, active: t, basePath: "image", toolbar: true, filters: true })}>
          {t === "creations" && <CreationsBody kind="image" locale={locale} />}
          {t === "templates" && <FeedBody row={row} />}
        </Shell>
      );
    }
    case "templates": {
      const t = pick(["video", "motion", "image"], "video");
      const tabs: TabDef[] = [{ key: "video", label: a.tabVideo, icon: "video" }, { key: "motion", label: a.motionLibrary, icon: "library" }, { key: "image", label: a.tabImage, icon: "image" }];
      const chips = ar ? ["الكل", "رائج", "تعديل", "إعلانات المنتجات", "تصوير", "إبداعي", "وشم"] : ["All", "Trending", "Edit", "Product Ads", "Photography", "Creative", "Tattoo"];
      return (
        <Shell locale={locale} mode={t === "image" ? "createImage" : "createVideo"} header={hdr({ title: a.templates, tabs, active: t, basePath: "templates" })}>
          {t === "image" && <div className="noscroll mb-4 flex gap-2 overflow-x-auto">{chips.map((c, i) => <Ghost key={c} on={i === 0}>{c}</Ghost>)}</div>}
          <FeedBody row={row} />
        </Shell>
      );
    }
    case "reshoot": {
      const t = tab === "dance" ? "dance" : "spotlight";
      const cats = ar ? ["الكل", "لقطات رائجة", "أناقة رياضية", "العودة للتسعينات", "صور مهنية", "جلسة عيد ميلاد", "كوتشيلا", "أصدقاء الفرو"] : ["All", "Trending Shots", "Sports Chic", "Back to 90s", "Business Portraits", "Birthday Photoshoot", "Coachella", "Furry Friends"];
      return (
        <Shell locale={locale} mode={t === "dance" ? "motionControl" : "createImage"} header={hdr({ title: a.reshoot, tabs: [{ key: "spotlight", label: a.spotlight, icon: "spark" }, { key: "dance", label: a.dance, icon: "user" }], active: t, basePath: "reshoot" })}>
          {t === "spotlight" && (
            <nav className="noscroll mb-4 flex gap-6 overflow-x-auto border-b border-white/10">
              {cats.map((c, i) => <span key={c} className={`whitespace-nowrap pb-3 text-sm ${i === 0 ? "border-b-2 border-white font-semibold" : ""}`}><span className="skeleton rounded text-transparent">{c}</span></span>)}
            </nav>
          )}
          <FeedBody max={4} />
        </Shell>
      );
    }
    case "video": {
      const t = pick(["creations", "library", "templates"], "creations");
      const tabs: TabDef[] = [{ key: "creations", label: a.creations, icon: "library" }, { key: "library", label: a.motionLibrary, icon: "video" }, { key: "templates", label: a.templates, icon: "cards" }];
      return (
        <Shell locale={locale} mode={t === "library" ? "motionControl" : "createVideo"} header={hdr({ crumb: a.video, tabs, active: t, basePath: "video", toolbar: true })}>
          {t === "creations" && <CreationsBody kind="video" locale={locale} />}
          {t === "library" && <FeedBody max={4} row={row} />}
          {t === "templates" && <FeedBody row={row} />}
        </Shell>
      );
    }
    case "music": {
      const t = pick(["creations", "studio"], "studio");
      const shelf = (title: string) => (
        <section><h2 className="mb-4 text-lg font-semibold">{title}</h2>
          <div className="noscroll flex gap-4 overflow-x-auto pb-2">{Array.from({ length: 6 }, (_, k) => <article key={k} className="w-[200px] shrink-0 md:w-[223px]"><Bar className="aspect-[4/5] w-full rounded-2xl" /><div className="mt-3 flex h-5 items-center"><Bar className="h-3.5 w-24 rounded" /></div></article>)}</div>
        </section>
      );
      return (
        <Shell locale={locale} main="space-y-8 pb-80" fade={310} mode="musicGenerator" header={hdr({ crumb: a.music, tabs: [{ key: "creations", label: a.creations, icon: "library" }, { key: "studio", label: a.studio, icon: "gem" }], active: t, basePath: "music" })}>
          {t === "studio" && <>{shelf(a.editorsChoice)}{shelf(a.newReleases)}</>}
          {t === "creations" && <CreationsBody kind="audio" locale={locale} />}
        </Shell>
      );
    }
    case "voice": {
      const t = pick(["creations", "voices"], "creations");
      return (
        <Shell locale={locale} main="pb-80" fade={300} mode="voiceover" header={hdr({ crumb: a.voice, tabs: [{ key: "creations", label: a.creations, icon: "wave" }, { key: "voices", label: a.voices, icon: "mic" }], active: t, basePath: "voice", toolbar: t === "creations" })}>
          {t === "creations" && <CreationsBody kind="audio" locale={locale} />}
          {t === "voices" && (
            <div className="mx-auto max-w-[1000px]">
              <div className="noscroll mb-6 flex gap-2 overflow-x-auto"><Ghost on><span aria-hidden>⚙</span> {a.filterBtn}</Ghost>{[a.narrative, a.conversational, a.informative, a.socialMedia].map((c) => <Ghost key={c}>{c}</Ghost>)}</div>
              <h2 className="mb-4 font-semibold">{a.trendingVoices}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 8 }, (_, k) => (
                  <article key={k} className="flex items-center gap-4 rounded-2xl bg-[#141414] p-3">
                    <Bar className="h-16 w-16 shrink-0 rounded-xl" />
                    <div className="min-w-0"><div className="flex h-6 items-center"><Bar className="h-4 w-16 rounded" /></div><div className="flex h-4 items-center"><Bar className="h-3 w-24 rounded" /></div><div className="mt-1 flex h-4 items-center"><Bar className="h-3 w-14 rounded" /></div></div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </Shell>
      );
    }
    case "artwork": {
      const t = tab === "creations" ? "creations" : "moodboard";
      return (
        <Shell locale={locale} main="pb-80" fade={280} mode="createArtwork" header={hdr({ crumb: a.artwork, tabs: [{ key: "creations", label: a.creations, icon: "library" }, { key: "moodboard", label: a.moodboard, icon: "pin" }], active: t, basePath: "artwork" })}>
          {t === "creations" ? <CreationsBody kind="image" locale={locale} /> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 12 }, (_, k) => <Bar key={k} className="h-[216px] rounded-3xl" />)}</div>}
        </Shell>
      );
    }
    case "enhancer":
      return <EnhancerApp locale={locale} />; // fully static client page: render it as is, nothing can shift
    case "pricing":
      return <PricingView locale={locale} initialTab={tab === "topup" ? "topup" : "upgrade"} />;
    case "projects":
      return id ? <ProjectSkeleton locale={locale} /> : <div aria-busy="true">{hdr({ crumb: ar ? "المشاريع" : "Projects" })}<ProjectsList locale={locale} /></div>;
    case "editor": return <EditorSkeleton locale={locale} />;
    case "profile": return <ProfileSkeleton locale={locale} tab={tab === "likes" ? "likes" : "creations"} />;
    case "account": return <AccountSkeleton locale={locale} section={sp.get("section")} />;
    case "welcome": return <WelcomeSkeleton locale={locale} />;
  }
  return null;
}

// ---- static / bespoke pages --------------------------------------------------------------------------------------------------------
function WelcomeSkeleton({ locale }: { locale: Locale }) {
  const d = td(locale);
  const opts = [d.interestAds, d.interestSocial, d.interestFilm, d.interestShop, d.interestEdu, d.interestArt];
  return (
    <div className="mx-auto grid min-h-dvh max-w-2xl place-items-center p-6 text-center" aria-busy="true">
      <div>
        <h1 className="text-3xl font-semibold">{d.welcomeTitle}</h1><p className="mt-3 text-muted">{d.welcomeSub}</p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">{opts.map((o) => <div key={o} className="card p-5 text-sm font-medium">{o}</div>)}</div>
        <div className="mt-8 flex justify-center gap-3"><Link href={`/${locale}/app/video`} className="btn btn-gold">{d.continue}</Link><Link href={`/${locale}/app/video`} className="btn btn-ghost">{d.skip}</Link></div>
      </div>
    </div>
  );
}

function ProfileSkeleton({ locale, tab }: { locale: Locale; tab: "creations" | "likes" }) {
  const a = ta(locale);
  const n = (x: number) => x.toLocaleString(locale === "ar" ? "ar-AE" : "en-AE");
  return (
    <main className="mx-auto max-w-[800px] px-5 py-10" aria-busy="true">
      <div className="flex items-center gap-6">
        <span className="grid h-[90px] w-[90px] shrink-0 place-items-center rounded-full bg-gold text-3xl font-bold text-black">A</span>
        <div><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold" dir="ltr">user_b67f45e7</h1><EditProfile locale={locale} /></div>
          <p className="mt-3 flex gap-6 text-lg"><span><b>{n(0)}</b> <span className="text-white/65">{a.likes}</span></span><span><b>{n(10)}</b> <span className="text-white/65">{a.creationsCount}</span></span></p></div>
      </div>
      <nav className="mt-8 flex justify-center border-t border-white/10">{[["creations", a.creations, "grid"], ["likes", a.likes, "heart"]].map(([k, l, i]) => <Link key={k} href={`/${locale}/app/profile?tab=${k}`} className={`flex items-center gap-2 px-6 py-3 text-lg ${k === tab ? "-mt-px border-t-2 border-white font-semibold" : "text-white/55"}`}><Icon n={i} size={16} />{l}</Link>)}</nav>
      {tab === "creations" ? <div className="mt-6 grid grid-cols-3 gap-1.5">{Array.from({ length: 9 }, (_, k) => <Bar key={k} className="aspect-square" />)}</div> : <p className="py-24 text-center text-white/45">{a.noResults}</p>}
    </main>
  );
}

function EditorSkeleton({ locale }: { locale: Locale }) {
  const a = ta(locale);
  return (
    <div className="flex min-h-dvh flex-col gap-3 p-3 md:p-4" aria-busy="true">
      <header className="flex h-12 items-center justify-between px-2"><div className="flex items-center gap-3"><h1 className="font-semibold">{a.editorTitle}</h1><span className="text-sm text-white/45">{a.project}</span></div><span className="gbtn !py-2">{a.exportBtn}</span></header>
      <div className="grid flex-1 gap-3 lg:grid-cols-[260px_1fr]">
        <aside className="sheet p-3"><p className="mb-3 text-sm font-semibold">{a.assets}</p><div className="grid grid-cols-3 gap-2 lg:grid-cols-2">{[1, 2, 3, 4, 5, 6].map((n) => <Bar key={n} className="aspect-square w-full rounded-xl" />)}</div></aside>
        <div className="flex min-h-0 flex-col gap-3">
          <section className="sheet grid min-h-[300px] flex-1 place-items-center p-4"><div className="relative aspect-video w-full max-w-[640px] overflow-hidden rounded-xl bg-black"><Bar className="h-full w-full" /><span className="absolute inset-0 grid place-items-center"><span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-black"><Icon n="play" size={22} /></span></span></div></section>
          <section className="sheet p-3"><div className="mb-2 flex items-center gap-3 text-white/70"><Icon n="scissors" size={16} /><Icon n="prev" size={16} /><Icon n="play" size={16} /><Icon n="next" size={16} /><span className="ms-auto text-xs tabular-nums" dir="ltr">00:00 / 00:12</span></div>
            <div className="space-y-2" dir="ltr">{[0, 1, 2].map((t) => <div key={t} className="flex items-center gap-2"><span className="w-14 text-xs text-white/40">{a.track} {t + 1}</span><div className="relative h-10 flex-1 rounded-lg bg-white/5">{[[2, 30], [36, 28], [68, 24]].slice(0, 3 - t).map(([l, w], k) => <span key={k} className="absolute top-1 h-8 rounded-md bg-gold/70" style={{ left: `${l}%`, width: `${w}%` }} />)}</div></div>)}</div></section>
        </div>
      </div>
    </div>
  );
}

// Account: static chrome is real; the section's cards are skeleton blocks with the measured heights of the real cards.
const Card = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => <section className={`rounded-2xl bg-[#121212] p-5 ${className}`}>{children}</section>;
const Line = ({ h, w = "w-1/3", className = "" }: { h: number; w?: string; className?: string }) => <div className={className} style={{ height: h }}><Bar className={`h-full rounded ${w}`} /></div>;
// Fixed-height card (heights measured from the real forms) holding a title bar and a few field bars.
const FormCard = ({ h, fields, danger = false }: { h: number; fields: number; danger?: boolean }) => (
  <Card className={`overflow-hidden ${danger ? "border border-red-500/30" : ""}`}>
    <div style={{ height: h - 40 - (danger ? 2 : 0) }} className="overflow-hidden">
      <Line h={24} w="w-40" className="mb-4" />
      <div className="space-y-3">{Array.from({ length: fields }, (_, i) => <div key={i}><Line h={16} w="w-24" /><Bar className="mt-1 h-[42px] rounded-xl" /></div>)}</div>
    </div>
  </Card>
);
function AccountSkeleton({ locale, section }: { locale: Locale; section: string | null }) {
  const a = ta(locale);
  const secs = [["account", "user"], ["usage", "chart"], ["plan", "gem"], ["support", "lifebuoy"], ["terms", "doc"]] as const;
  const sec = secs.some((s) => s[0] === section) ? section! : "account";
  const label: Record<string, string> = { account: a.account, usage: a.usage, plan: a.plan, support: a.support, terms: a.termsPolicies };
  const base = `/${locale}/app/account`;
  const n = (x: number) => x.toLocaleString(locale === "ar" ? "ar-AE" : "en-AE");
  return (
    <div aria-busy="true">
      <Link href={`/${locale}/app`} className="flex h-[60px] items-center gap-3 border-b border-white/5 px-6 text-lg"><Icon n={locale === "ar" ? "chevR" : "chevL"} size={18} />{a.backHome}</Link>
      <div className="grid gap-6 p-5 md:grid-cols-[240px_minmax(0,720px)] md:p-6">
        <nav className="flex gap-1 overflow-x-auto md:flex-col">{secs.map(([k, i]) => <Link key={k} href={`${base}?section=${k}`} className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 ${k === sec ? "bg-white/10" : "text-white/60 hover:text-white"}`}><Icon n={i} size={17} />{label[k]}</Link>)}<Link href={`/${locale}/login`} className="flex items-center gap-3 rounded-xl px-4 py-3 text-red-400"><Icon n="logout" size={17} />{a.logOut}</Link></nav>
        <div className="space-y-4">
          {sec === "account" && (<>
            <Card className="flex items-center gap-5"><Bar className="h-20 w-20 rounded-full" /><div className="min-w-0 flex-1"><Line h={28} w="w-40" /><Line h={20} w="w-56" /></div></Card>
            <FormCard h={299} fields={3} /><FormCard h={268} fields={2} /><FormCard h={360} fields={3} /><FormCard h={140} fields={1} />
            <Card><Line h={24} w="w-32" /><Line h={20} w="w-2/3" className="mt-1" /><Bar className="mt-4 h-[35px] w-32 rounded-full" /></Card>
            <FormCard h={322} fields={2} danger />
          </>)}
          {sec === "usage" && (<>
            <div><h2 className="text-lg font-semibold">{a.usageStats}</h2><p className="text-sm text-white/55">{a.usageSub}</p></div>
            <div className="flex gap-2"><span className="pill"><Icon n="coins" size={14} />{a.buyCredits}</span><span className="pill"><Icon n="card" size={14} />{a.billing}</span></div>
            <div className="grid gap-3 sm:grid-cols-2">{[a.dateRange2, a.product].map((l) => <div key={l} className="text-sm text-white/60">{l}<div className="mt-1 block h-[40px] w-full rounded-xl bg-[#121212]" /></div>)}</div>
            <div className="grid gap-3 sm:grid-cols-3">{[[a.totalGeneration, n(10), a.yourGenerations], [a.totalCredits, n(484), a.creditsConsumed], [a.totalModel, n(7), a.modelsUsed]].map(([t, v, s]) => <Card key={t}><p className="text-[11px] tracking-wider text-white/45">{t}</p><p className="mt-2 text-3xl font-bold">{v}</p><p className="text-xs text-white/50">{s}</p></Card>)}</div>
            <Card><p className="mb-4 flex items-center gap-2 text-[11px] tracking-wider text-white/45"><Icon n="chart" size={13} />{a.usageOverTime}</p><Bar className="h-56 rounded-md" /></Card>
          </>)}
          {sec === "plan" && (<>
            <Card className="!p-0 overflow-hidden"><p className="bg-white/5 px-5 py-2 text-xs text-white/60">{a.subscription}</p><div className="flex items-center justify-between p-5"><div><Line h={28} w="w-40" /><Line h={20} w="w-56" /></div><span className="gbtn"><Icon n="spark" size={14} />{a.changePlan}</span></div></Card>
            <Card className="!p-0 overflow-hidden"><p className="bg-white/5 px-5 py-2 text-xs text-white/60">{a.creditsT}</p><div className="space-y-4 p-5"><div className="flex items-center justify-between text-sm"><span className="text-white/60">{a.remaining}</span><span className="flex items-center gap-3">{a.autoRefill}<span className="inline-block h-6 w-11 rounded-full bg-white/20" /></span></div><Line h={32} w="w-24" /><div className="rail" /><div className="flex justify-end"><span className="gbtn"><Icon n="coins" size={14} />{a.buyCredits}</span></div></div></Card>
            <Card><p className="text-sm text-white/60">{a.paymentMethod}</p><p className="mt-3 flex items-center gap-2 text-sm"><span aria-hidden>＋</span>{a.addPayment}</p></Card>
            <Card className="flex items-center justify-between gap-4"><div><h2 className="font-semibold">{a.billingInfo}</h2><p className="mt-1 text-sm text-white/55">{a.billingInfoSub}</p></div><span className="pill"><Icon n="doc" size={14} />{a.invoices}</span></Card>
            <Card><h2 className="font-semibold">{locale === "ar" ? "الاشتراك" : "Membership"}</h2><Line h={20} w="w-2/3" /></Card>
          </>)}
          {sec === "support" && <Card><h2 className="font-semibold">{a.supportT}</h2><p className="mt-1 text-sm text-white/55">{a.supportSub}</p><span className="gbtn mt-4">{a.contactUs}</span></Card>}
          {sec === "terms" && [a.terms, a.privacy, a.refund, a.cookies].map((l) => <Card key={l} className="flex items-center justify-between gap-4"><div><h2 className="font-semibold">{l}</h2></div><span className="pill"><Icon n="arrow" size={13} /></span></Card>)}
        </div>
      </div>
    </div>
  );
}

// Project workspace: header + logline + sidebar + storyboard, with one scene card as a stand-in for the data-dependent list.
const PL = {
  ar: { back: "المشاريع", library: "المكتبة", characters: "الشخصيات", storyboard: "لوحة القصة", addScene: "إضافة مشهد", upload: "رفع صور وفيديوهات", download: "تنزيل", emptyLib: "ارفع صوراً أو فيديوهات لتبدأ.", loglinePh: "جملة تلخّص الفيلم…" },
  en: { back: "Projects", library: "Library", characters: "Characters", storyboard: "Storyboard", addScene: "Add scene", upload: "Upload images and videos", download: "Download", emptyLib: "Upload images or videos to get started.", loglinePh: "One sentence about the film…" },
};
export function ProjectSkeleton({ locale }: { locale: Locale }) {
  const t = PL[locale];
  return (
    <div className="px-5 pb-24 md:px-8" aria-busy="true">
      <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-transparent py-4">
        <Link href={`/${locale}/app/projects`} className="flex items-center gap-1 text-sm text-white/55 hover:text-white"><Icon n={locale === "ar" ? "chevR" : "chevL"} size={14} />{t.back}</Link>
        <div className="relative min-w-[160px] flex-1"><input readOnly tabIndex={-1} aria-hidden className="w-full bg-transparent text-xl font-semibold outline-none" /><Bar className="absolute inset-y-0 start-0 w-56 max-w-full rounded" /></div>
        <span className="btn btn-gold !py-2"><Icon n="download" size={16} />{t.download}</span>
      </header>
      <input readOnly tabIndex={-1} aria-hidden placeholder={t.loglinePh} className="mb-6 w-full max-w-[760px] bg-transparent text-sm text-white/70 outline-none placeholder:text-white/30" />
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="sheet h-fit p-4 lg:sticky lg:top-24">
          <div className="flex gap-1"><span className="pill !bg-white/15">{t.library}</span><span className="pill">{t.characters}</span></div>
          <div className="mt-4">
            <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-5 text-sm text-white/70"><Icon n="up" size={16} />{t.upload}</div>
            <p className="mt-4 text-center text-xs text-white/40">{t.emptyLib}</p>
            <div className="mt-3" />
          </div>
        </aside>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t.storyboard}</h2>
            <span className="btn btn-gold !py-2"><Icon n="plus" size={15} />{t.addScene}</span>
          </div>
          <div className="space-y-4"><Bar className="h-[359px] rounded-3xl md:h-[335px]" /></div>
        </section>
      </div>
    </div>
  );
}
