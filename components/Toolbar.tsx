"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./Icon";
import { Pop } from "./Pop";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

// Filters / Row-Grid / Search. State is kept in the URL so server pages and the feed can read it.
export function Toolbar({ locale, filters = true }: { locale: Locale; filters?: boolean }) {
  const a = ta(locale);
  const router = useRouter(); const path = usePathname(); const sp = useSearchParams();
  const [kind, setKind] = useState(sp.get("kind") ?? "all"); const [date, setDate] = useState(sp.get("date") ?? ""); const [prop, setProp] = useState(sp.get("prop") ?? "all");
  const [q, setQ] = useState(sp.get("q") ?? ""); const [searching, setSearching] = useState(!!sp.get("q"));
  const push = (patch: Record<string, string>) => { const n = new URLSearchParams(sp.toString()); Object.entries(patch).forEach(([k, v]) => (v && v !== "all" ? n.set(k, v) : n.delete(k))); router.push(`${path}?${n}`); };
  const chip = (on: boolean) => `pill !py-1.5 text-xs ${on ? "pill-on" : ""}`;
  const view = sp.get("view") === "row" ? "row" : "grid";
  return (
    <div className="flex items-center gap-4 text-sm text-white/80">
      {filters && (
        <Pop up={false} align="end" panelClass="w-[330px] p-4" trigger={<span className="flex items-center gap-1.5 hover:text-white"><Icon n="filter" size={15} />{a.filters}</span>}>
          {(close) => (
            <div className="space-y-4 text-xs">
              <div><p className="mb-2 font-semibold">{a.mediaType}</p><div className="flex gap-1.5">{[["all", a.all], ["image", a.images], ["video", a.videos], ["audio", a.audios]].map(([k, l]) => <button type="button" key={k} onClick={() => setKind(k)} className={chip(kind === k)}>{l}</button>)}</div></div>
              <div><p className="mb-2 font-semibold">{a.dateRange}</p><div className="flex flex-wrap gap-1.5">{[["today", a.today], ["yesterday", a.yesterday], ["7", a.last7], ["30", a.last30]].map(([k, l]) => <button type="button" key={k} onClick={() => setDate(date === k ? "" : k)} className={chip(date === k)}>{l}</button>)}</div></div>
              <div><p className="mb-2 font-semibold">{a.properties}</p><div className="flex gap-1.5">{[["all", a.all], ["liked", a.liked], ["notliked", a.notLiked]].map(([k, l]) => <button type="button" key={k} onClick={() => setProp(k)} className={chip(prop === k)}>{l}</button>)}</div></div>
              <div className="flex items-center justify-between pt-1"><button type="button" onClick={() => { setKind("all"); setDate(""); setProp("all"); push({ kind: "", date: "", prop: "" }); close(); }} className="text-white/50">{a.clearFilters}</button><button type="button" onClick={() => { push({ kind, date, prop }); close(); }} className="gbtn !py-2">{a.apply}</button></div>
            </div>
          )}
        </Pop>
      )}
      <button type="button" onClick={() => push({ view: view === "grid" ? "row" : "grid" })} className="hidden items-center gap-1.5 hover:text-white sm:flex"><Icon n="grid" size={15} />{view === "grid" ? a.row : a.grid}</button>
      {searching ? (
        <form onSubmit={(e) => { e.preventDefault(); push({ q: q.trim() }); }} className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5"><Icon n="search" size={14} /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} maxLength={60} placeholder={a.search} className="w-28 bg-transparent text-xs outline-none md:w-40" /><button type="button" aria-label={a.close} onClick={() => { setQ(""); setSearching(false); push({ q: "" }); }}><Icon n="close" size={12} /></button></form>
      ) : <button type="button" aria-label={a.search} onClick={() => setSearching(true)} className="hover:text-white"><Icon n="search" size={16} /></button>}
    </div>
  );
}
