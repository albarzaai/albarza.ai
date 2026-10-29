"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import { ProjectSkeleton } from "./AppSkeletons";
import { SHOTS, delBlob, getBlob, getProject, newScene, putBlob, saveProject, uid, type Asset, type Character, type Project, type Scene } from "@/lib/projects";
import type { Locale } from "@/lib/i18n";

const L = {
  ar: { back: "المشاريع", characters: "الشخصيات", library: "المكتبة", storyboard: "لوحة القصة", addChar: "إضافة شخصية", charName: "اسم الشخصية", role: "الدور", desc: "الوصف", upload: "رفع صور وفيديوهات", addScene: "إضافة مشهد", scene: "مشهد", title: "عنوان المشهد", sceneDesc: "ماذا يحدث في هذا المشهد؟", shot: "نوع اللقطة", dur: "المدة (ث)", cast: "الشخصيات في المشهد", media: "الوسائط", pick: "إضافة من المكتبة", notes: "ملاحظات", download: "تنزيل", pdf: "لوحة القصة (PDF)", zip: "كل الملفات (ZIP)", saved: "تم الحفظ على هذا الجهاز", loading: "جارٍ التحميل…", missing: "المشروع غير موجود على هذا الجهاز.", emptyLib: "ارفع صوراً أو فيديوهات لتبدأ.", emptyScenes: "لا توجد مشاهد. أضف أول مشهد.", loglinePh: "جملة تلخّص الفيلم…", total: "المدة الكلية", portrait: "صورة مرجعية", del: "حذف", up: "أعلى", down: "أسفل", tooBig: "الملف كبير جداً (الحد 150 ميغابايت)", dragHint: "اسحب الملفات من المكتبة إلى المشهد" },
  en: { back: "Projects", characters: "Characters", library: "Library", storyboard: "Storyboard", addChar: "Add character", charName: "Character name", role: "Role", desc: "Description", upload: "Upload images and videos", addScene: "Add scene", scene: "Scene", title: "Scene title", sceneDesc: "What happens in this scene?", shot: "Shot", dur: "Duration (s)", cast: "Characters in scene", media: "Media", pick: "Add from library", notes: "Notes", download: "Download", pdf: "Storyboard (PDF)", zip: "All files (ZIP)", saved: "Saved on this device", loading: "Loading…", missing: "This project was not found on this device.", emptyLib: "Upload images or videos to get started.", emptyScenes: "No scenes yet. Add your first scene.", loglinePh: "One sentence about the film…", total: "Total runtime", portrait: "Reference image", del: "Delete", up: "Move up", down: "Move down", tooBig: "File too large (150 MB limit)", dragHint: "Drag files from the library onto a scene" },
};
const field = "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/35 focus:border-gold";
const slug = (s: string) => s.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "untitled";
const ext = (a: Asset) => (a.name.split(".").pop() || (a.kind === "image" ? "jpg" : "mp4")).toLowerCase();

async function videoFrame(url: string): Promise<string> {
  return new Promise((res) => {
    const v = document.createElement("video");
    v.muted = true; v.preload = "auto"; v.src = url;
    v.onloadeddata = () => { v.currentTime = Math.min(0.2, (v.duration || 1) / 2); };
    v.onseeked = () => { const c = document.createElement("canvas"); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext("2d")?.drawImage(v, 0, 0); res(c.toDataURL("image/jpeg", 0.8)); };
    v.onerror = () => res("");
  });
}

export function ProjectWorkspace({ locale, id }: { locale: Locale; id: string }) {
  const t = L[locale];
  const [p, setP] = useState<Project | null | undefined>(undefined);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<"characters" | "library">("library");
  const [menu, setMenu] = useState(false);
  const [pickFor, setPickFor] = useState<string | null>(null);
  const [dragScene, setDragScene] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);
  const portraitFor = useRef<string | null>(null);
  const portraitRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getProject(id).then((x) => setP(x ?? null)).catch(() => setP(null)); }, [id]);
  useEffect(() => {
    if (!p) return;
    let off = false;
    (async () => {
      const next: Record<string, string> = {};
      for (const a of p.assets) { if (urls[a.id]) { next[a.id] = urls[a.id]; continue; } const b = await getBlob(a.id); if (b) next[a.id] = URL.createObjectURL(b); }
      if (!off) setUrls(next);
    })();
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p?.assets.length]);
  useEffect(() => () => Object.values(urls).forEach((u) => URL.revokeObjectURL(u)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const update = useCallback((fn: (x: Project) => Project) => {
    setP((cur) => {
      if (!cur) return cur;
      const nx = fn(cur);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { saveProject(nx).then(() => setMsg(t.saved)); }, 400);
      return nx;
    });
  }, [t.saved]);

  const total = useMemo(() => p?.scenes.reduce((n, s) => n + (Number(s.duration) || 0), 0) ?? 0, [p]);
  if (p === undefined) return <ProjectSkeleton locale={locale} />;
  if (p === null) return <p className="p-8 text-white/60">{t.missing} <Link className="text-gold underline" href={`/${locale}/app/projects`}>{t.back}</Link></p>;

  const asset = (aid: string) => p.assets.find((a) => a.id === aid);
  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const added: Asset[] = [];
    for (const f of Array.from(files)) {
      const kind = f.type.startsWith("video/") ? "video" : f.type.startsWith("image/") ? "image" : null;
      if (!kind) continue;
      if (f.size > 150 * 1024 * 1024) { alert(t.tooBig); continue; }
      const a: Asset = { id: uid(), kind, name: f.name, type: f.type, size: f.size };
      await putBlob(a.id, f); added.push(a);
    }
    update((x) => ({ ...x, assets: [...x.assets, ...added] }));
  };
  const removeAsset = (aid: string) => {
    delBlob(aid);
    update((x) => ({ ...x, assets: x.assets.filter((a) => a.id !== aid), characters: x.characters.map((c) => (c.assetId === aid ? { ...c, assetId: undefined } : c)), scenes: x.scenes.map((s) => ({ ...s, assetIds: s.assetIds.filter((i) => i !== aid) })) }));
  };
  const setScene = (sid: string, patch: Partial<Scene>) => update((x) => ({ ...x, scenes: x.scenes.map((s) => (s.id === sid ? { ...s, ...patch } : s)) }));
  const move = (sid: string, dir: -1 | 1) => update((x) => {
    const i = x.scenes.findIndex((s) => s.id === sid); const j = i + dir;
    if (j < 0 || j >= x.scenes.length) return x;
    const sc = [...x.scenes]; [sc[i], sc[j]] = [sc[j], sc[i]]; return { ...x, scenes: sc };
  });
  const dropScene = (onto: string) => {
    if (!dragScene || dragScene === onto) return;
    update((x) => {
      const sc = [...x.scenes]; const from = sc.findIndex((s) => s.id === dragScene); const to = sc.findIndex((s) => s.id === onto);
      const [m] = sc.splice(from, 1); sc.splice(to, 0, m); return { ...x, scenes: sc };
    });
    setDragScene(null);
  };
  const setChar = (cid: string, patch: Partial<Character>) => update((x) => ({ ...x, characters: x.characters.map((c) => (c.id === cid ? { ...c, ...patch } : c)) }));

  const bytesOf = async (a: Asset) => new Uint8Array(await ((await getBlob(a.id)) as Blob).arrayBuffer());
  const downloadZip = async () => {
    setMenu(false);
    const files: Record<string, Uint8Array | [Uint8Array, { level: 0 }]> = {};
    const put = (path: string, data: Uint8Array) => { files[path] = [data, { level: 0 }]; };
    files["storyboard.json"] = new TextEncoder().encode(JSON.stringify({ ...p, exportedAt: new Date().toISOString() }, null, 2));
    files["README.txt"] = new TextEncoder().encode(`${p.title}\n${p.logline}\n\nscenes/ holds each scene's media in order. characters/ holds reference images. library/ holds every uploaded file.\n`);
    for (const a of p.assets) put(`library/${slug(a.name.replace(/\.[^.]+$/, ""))}-${a.id.slice(0, 4)}.${ext(a)}`, await bytesOf(a));
    for (const c of p.characters) { const a = c.assetId ? asset(c.assetId) : undefined; if (a) put(`characters/${slug(c.name)}.${ext(a)}`, await bytesOf(a)); }
    for (const [i, s] of p.scenes.entries()) for (const [k, aid] of s.assetIds.entries()) { const a = asset(aid); if (a) put(`scenes/${String(i + 1).padStart(2, "0")}-${slug(s.title || "scene")}/${String(k + 1).padStart(2, "0")}-${slug(a.name.replace(/\.[^.]+$/, ""))}.${ext(a)}`, await bytesOf(a)); }
    const { zipSync } = await import("fflate"); // loaded only when someone downloads
    const blob = new Blob([zipSync(files as never) as BlobPart], { type: "application/zip" });
    const u = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = u; link.download = `${slug(p.title)}.zip`; link.click(); setTimeout(() => URL.revokeObjectURL(u), 4000);
  };
  const downloadPdf = async () => {
    setMenu(false);
    const w = window.open("", "_blank"); if (!w) return;
    const thumb = async (a: Asset) => (a.kind === "image" ? urls[a.id] : await videoFrame(urls[a.id]));
    const rtl = locale === "ar";
    const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
    let body = `<h1>${esc(p.title)}</h1><p class="sub">${esc(p.logline)}</p><p class="sub">${p.scenes.length} ${t.scene} · ${total}s</p>`;
    if (p.characters.length) {
      body += `<h2>${t.characters}</h2><div class="chars">`;
      for (const c of p.characters) { const a = c.assetId ? asset(c.assetId) : undefined; const src = a ? await thumb(a) : ""; body += `<div class="ch">${src ? `<img src="${src}">` : ""}<b>${esc(c.name)}</b><i>${esc(c.role)}</i><span>${esc(c.description)}</span></div>`; }
      body += `</div>`;
    }
    for (const [i, s] of p.scenes.entries()) {
      const cast = s.characterIds.map((cid) => p.characters.find((c) => c.id === cid)?.name).filter(Boolean).join(", ");
      let imgs = ""; for (const aid of s.assetIds) { const a = asset(aid); if (a) { const src = await thumb(a); if (src) imgs += `<img src="${src}">`; } }
      body += `<section><h2>${t.scene} ${i + 1}${s.title ? ` — ${esc(s.title)}` : ""}</h2><p class="meta">${esc(s.shot)} · ${s.duration}s${cast ? ` · ${esc(cast)}` : ""}</p><div class="frames">${imgs}</div><p>${esc(s.description)}</p>${s.notes ? `<p class="notes">${esc(s.notes)}</p>` : ""}</section>`;
    }
    w.document.write(`<!doctype html><html dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${esc(p.title)}</title><style>body{font-family:system-ui,sans-serif;margin:32px;color:#16120a}h1{font-size:32px;margin:0}h2{font-size:18px;margin:24px 0 6px;border-bottom:1px solid #e9dcc0;padding-bottom:4px}.sub,.meta{color:#6a5e46;margin:4px 0}.frames{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:8px 0}.frames img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:6px}section{break-inside:avoid}.chars{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.ch img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px}.ch b,.ch i,.ch span{display:block;font-size:12px}.notes{background:#fbf6ea;padding:8px;border-radius:6px;font-size:13px}</style></head><body>${body}</body></html>`);
    w.document.close(); setTimeout(() => w.print(), 600);
  };

  const Thumb = ({ a, className = "" }: { a: Asset; className?: string }) => (
    urls[a.id] ? (a.kind === "image"
      // eslint-disable-next-line @next/next/no-img-element
      ? <img src={urls[a.id]} alt={a.name} className={`object-cover ${className}`} />
      : <video src={urls[a.id]} muted playsInline preload="metadata" className={`object-cover ${className}`} />) : <div className={`bg-white/5 ${className}`} />
  );

  return (
    <div className="px-5 pb-24 md:px-8">
      <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-transparent py-4">
        <Link href={`/${locale}/app/projects`} className="flex items-center gap-1 text-sm text-white/55 hover:text-white"><Icon n={locale === "ar" ? "chevR" : "chevL"} size={14} />{t.back}</Link>
        <input value={p.title} onChange={(e) => update((x) => ({ ...x, title: e.target.value }))} className="min-w-[160px] flex-1 bg-transparent text-xl font-semibold outline-none" aria-label="title" />
        <span className="hidden text-xs text-white/40 sm:block">{msg}</span>
        <div className="relative">
          <button onClick={() => setMenu((m) => !m)} className="btn btn-gold !py-2"><Icon n="download" size={16} />{t.download}</button>
          {menu && (
            <div className="sheet absolute end-0 top-12 z-40 w-[230px] p-2 text-sm">
              <button onClick={downloadPdf} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5">{t.pdf}</button>
              <button onClick={downloadZip} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5">{t.zip}</button>
            </div>
          )}
        </div>
      </header>
      <input value={p.logline} onChange={(e) => update((x) => ({ ...x, logline: e.target.value }))} placeholder={t.loglinePh} className="mb-6 w-full max-w-[760px] bg-transparent text-sm text-white/70 outline-none placeholder:text-white/30" />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr] [&>*]:min-w-0">
        <aside className="sheet h-fit p-4 lg:sticky lg:top-24">
          <div className="flex gap-1">
            {(["library", "characters"] as const).map((k) => <button key={k} onClick={() => setTab(k)} className={`pill ${tab === k ? "!bg-white/15" : ""}`}>{t[k]}</button>)}
          </div>
          {tab === "library" ? (
            <div className="mt-4">
              <input ref={fileRef} type="file" multiple accept="image/*,video/*" hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
              <button onClick={() => fileRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-5 text-sm text-white/70 hover:border-gold hover:text-white"><Icon n="up" size={16} />{t.upload}</button>
              {p.assets.length === 0 ? <p className="mt-4 text-center text-xs text-white/40">{t.emptyLib}</p> : <p className="mt-3 text-[11px] text-white/35">{t.dragHint}</p>}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {p.assets.map((a) => (
                  <div key={a.id} draggable onDragStart={(e) => e.dataTransfer.setData("text/asset", a.id)} className="group relative aspect-square overflow-hidden rounded-lg">
                    <Thumb a={a} className="size-full" />
                    {a.kind === "video" && <span className="absolute bottom-1 start-1 rounded bg-black/60 p-0.5"><Icon n="play" size={10} /></span>}
                    <button onClick={() => removeAsset(a.id)} aria-label={t.del} className="absolute end-1 top-1 hidden size-6 place-items-center rounded-full bg-black/70 group-hover:grid"><Icon n="close" size={11} /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <input ref={portraitRef} type="file" accept="image/*" hidden onChange={async (e) => {
                const f = e.target.files?.[0]; const cid = portraitFor.current; e.target.value = "";
                if (!f || !cid) return;
                const a: Asset = { id: uid(), kind: "image", name: f.name, type: f.type, size: f.size };
                await putBlob(a.id, f);
                update((x) => ({ ...x, assets: [...x.assets, a], characters: x.characters.map((c) => (c.id === cid ? { ...c, assetId: a.id } : c)) }));
              }} />
              {p.characters.map((c) => {
                const a = c.assetId ? asset(c.assetId) : undefined;
                return (
                  <div key={c.id} className="rounded-xl border border-white/10 p-3">
                    <div className="flex gap-3">
                      <button onClick={() => { portraitFor.current = c.id; portraitRef.current?.click(); }} title={t.portrait} className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/5 text-white/40 hover:text-white">{a ? <Thumb a={a} className="size-full" /> : <Icon n="user" size={22} />}</button>
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <input value={c.name} onChange={(e) => setChar(c.id, { name: e.target.value })} placeholder={t.charName} className={field} />
                        <input value={c.role} onChange={(e) => setChar(c.id, { role: e.target.value })} placeholder={t.role} className={field} />
                      </div>
                    </div>
                    <textarea value={c.description} onChange={(e) => setChar(c.id, { description: e.target.value })} placeholder={t.desc} rows={2} className={`${field} mt-2 resize-none`} />
                    <button onClick={() => update((x) => ({ ...x, characters: x.characters.filter((k) => k.id !== c.id), scenes: x.scenes.map((s) => ({ ...s, characterIds: s.characterIds.filter((i) => i !== c.id) })) }))} className="mt-2 text-xs text-white/40 hover:text-white">{t.del}</button>
                  </div>
                );
              })}
              <button onClick={() => update((x) => ({ ...x, characters: [...x.characters, { id: uid(), name: "", role: "", description: "" }] }))} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-3 text-sm text-white/70 hover:border-gold hover:text-white"><Icon n="plus" size={15} />{t.addChar}</button>
            </div>
          )}
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t.storyboard} <span className="ms-2 text-xs font-normal text-white/40">{t.total}: {total}s</span></h2>
            <button onClick={() => update((x) => ({ ...x, scenes: [...x.scenes, newScene(x.scenes.length + 1)] }))} className="btn btn-gold !py-2"><Icon n="plus" size={15} />{t.addScene}</button>
          </div>
          {p.scenes.length === 0 && <p className="sheet p-10 text-center text-sm text-white/50">{t.emptyScenes}</p>}
          <div className="space-y-4">
            {p.scenes.map((s, i) => (
              <article key={s.id} draggable onDragStart={() => setDragScene(s.id)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const aid = e.dataTransfer.getData("text/asset"); if (aid) { e.preventDefault(); setScene(s.id, { assetIds: s.assetIds.includes(aid) ? s.assetIds : [...s.assetIds, aid] }); } else dropScene(s.id); }} onDragEnd={() => setDragScene(null)} className={`sheet p-4 ${dragScene === s.id ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2">
                  <span className="grid size-8 shrink-0 cursor-grab place-items-center rounded-full bg-gold text-sm font-bold text-black" title="drag">{i + 1}</span>
                  <input value={s.title} onChange={(e) => setScene(s.id, { title: e.target.value })} placeholder={t.title} className="min-w-0 flex-1 bg-transparent font-semibold outline-none placeholder:text-white/30" />
                  <button onClick={() => move(s.id, -1)} disabled={i === 0} aria-label={t.up} className="grid size-8 place-items-center rounded-full hover:bg-white/10 disabled:opacity-25"><Icon n="up" size={14} /></button>
                  <button onClick={() => move(s.id, 1)} disabled={i === p.scenes.length - 1} aria-label={t.down} className="grid size-8 place-items-center rounded-full hover:bg-white/10 disabled:opacity-25"><Icon n="up" size={14} className="rotate-180" /></button>
                  <button onClick={() => update((x) => ({ ...x, scenes: x.scenes.filter((k) => k.id !== s.id) }))} aria-label={t.del} className="grid size-8 place-items-center rounded-full hover:bg-white/10"><Icon n="trash" size={14} /></button>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-[1fr_200px] [&>*]:min-w-0">
                  <textarea value={s.description} onChange={(e) => setScene(s.id, { description: e.target.value })} placeholder={t.sceneDesc} rows={3} className={`${field} resize-none`} />
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
                    <label className="text-[11px] text-white/45">{t.shot}<select value={s.shot} onChange={(e) => setScene(s.id, { shot: e.target.value })} className={`${field} mt-1`}>{SHOTS.map((x) => <option key={x} className="bg-black">{x}</option>)}</select></label>
                    <label className="text-[11px] text-white/45">{t.dur}<input type="number" min={1} max={600} value={s.duration} onChange={(e) => setScene(s.id, { duration: Number(e.target.value) })} className={`${field} mt-1`} /></label>
                  </div>
                </div>
                {p.characters.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5"><span className="text-[11px] text-white/45">{t.cast}</span>
                    {p.characters.map((c) => { const on = s.characterIds.includes(c.id); return <button key={c.id} onClick={() => setScene(s.id, { characterIds: on ? s.characterIds.filter((k) => k !== c.id) : [...s.characterIds, c.id] })} className={`pill !py-1 !text-[11px] ${on ? "!bg-gold !text-black" : ""}`}>{c.name || "—"}</button>; })}
                  </div>
                )}
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {s.assetIds.map((aid) => { const a = asset(aid); return a ? (
                      <div key={aid} className="group relative h-20 w-[142px] overflow-hidden rounded-lg"><Thumb a={a} className="size-full" />
                        {a.kind === "video" && <span className="absolute bottom-1 start-1 rounded bg-black/60 p-0.5"><Icon n="play" size={10} /></span>}
                        <button onClick={() => setScene(s.id, { assetIds: s.assetIds.filter((k) => k !== aid) })} aria-label={t.del} className="absolute end-1 top-1 hidden size-5 place-items-center rounded-full bg-black/70 group-hover:grid"><Icon n="close" size={10} /></button>
                      </div>) : null; })}
                    <div className="relative">
                      <button onClick={() => setPickFor(pickFor === s.id ? null : s.id)} className="flex h-20 w-[142px] items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/20 text-xs text-white/60 hover:border-gold hover:text-white"><Icon n="plus" size={14} />{t.pick}</button>
                      {pickFor === s.id && (
                        <div className="sheet absolute start-0 top-[84px] z-20 grid max-h-64 w-[300px] grid-cols-4 gap-1.5 overflow-auto p-2">
                          {p.assets.length === 0 && <p className="col-span-4 p-3 text-center text-xs text-white/40">{t.emptyLib}</p>}
                          {p.assets.map((a) => <button key={a.id} onClick={() => { setScene(s.id, { assetIds: s.assetIds.includes(a.id) ? s.assetIds : [...s.assetIds, a.id] }); setPickFor(null); }} className="aspect-square overflow-hidden rounded-md"><Thumb a={a} className="size-full" /></button>)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <input value={s.notes} onChange={(e) => setScene(s.id, { notes: e.target.value })} placeholder={t.notes} className="mt-3 w-full bg-transparent text-xs text-white/60 outline-none placeholder:text-white/25" />
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
