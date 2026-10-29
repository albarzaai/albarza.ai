"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { getBlob, listProjects, newProject, removeProject, saveProject, type Project } from "@/lib/projects";
import type { Locale } from "@/lib/i18n";

const L = {
  ar: { title: "المشاريع", sub: "نظّم أفلامك: شخصيات وصور وفيديوهات ولوحة قصة مشهداً بمشهد، ثم نزّلها.", create: "مشروع جديد", name: "اسم الفيلم", empty: "لا توجد مشاريع بعد. ابدأ بفيلمك الأول.", scenes: "مشاهد", chars: "شخصيات", del: "حذف", confirm: "حذف هذا المشروع وكل ملفاته؟", device: "تُحفظ المشاريع على هذا الجهاز حتى يتم ربط الحسابات والتخزين السحابي." },
  en: { title: "Projects", sub: "Organise your film: characters, images, videos and a scene-by-scene storyboard, then download it.", create: "New project", name: "Film title", empty: "No projects yet. Start with your first film.", scenes: "scenes", chars: "characters", del: "Delete", confirm: "Delete this project and all its files?", device: "Projects are saved on this device until accounts and cloud storage are connected." },
};

function Cover({ p }: { p: Project }) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    let u: string | undefined; let off = false;
    const first = p.scenes.flatMap((s) => s.assetIds).map((id) => p.assets.find((a) => a.id === id)).find((a) => a?.kind === "image") ?? p.assets.find((a) => a.kind === "image");
    if (first) getBlob(first.id).then((b) => { if (b && !off) { u = URL.createObjectURL(b); setUrl(u); } });
    return () => { off = true; if (u) URL.revokeObjectURL(u); };
  }, [p]);
  // eslint-disable-next-line @next/next/no-img-element
  return url ? <img src={url} alt="" className="absolute inset-0 size-full object-cover" /> : <Icon n="video" size={34} className="text-white/25" />;
}

export function ProjectsList({ locale }: { locale: Locale }) {
  const t = L[locale];
  const router = useRouter();
  const [list, setList] = useState<Project[] | null>(null);
  const [title, setTitle] = useState("");
  const load = () => listProjects().then(setList).catch(() => setList([]));
  useEffect(() => { load(); }, []);
  const create = async () => {
    const p = newProject(title.trim() || (locale === "ar" ? "فيلم بلا عنوان" : "Untitled film"));
    await saveProject(p);
    router.push(`/${locale}/app/projects/${p.id}`);
  };
  return (
    <main className="px-5 pb-24 md:px-8">
      <p className="max-w-[640px] text-sm text-white/60">{t.sub}</p>
      <div className="mt-6 flex max-w-[560px] gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && create()} placeholder={t.name} className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm outline-none placeholder:text-white/40 focus:border-gold" />
        <button onClick={create} className="btn btn-gold shrink-0"><Icon n="plus" size={16} />{t.create}</button>
      </div>
      <p className="mt-3 text-xs text-white/40">{t.device}</p>
      {list && list.length === 0 && <p className="mt-16 text-center text-white/50">{t.empty}</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list?.map((p) => (
          <article key={p.id} className="group sheet relative overflow-hidden">
            <Link href={`/${locale}/app/projects/${p.id}`} className="block">
              <div className="relative grid aspect-video place-items-center bg-white/5"><Cover p={p} /></div>
              <div className="p-4"><h3 className="truncate font-semibold">{p.title}</h3><p className="mt-1 text-xs text-white/50">{p.scenes.length} {t.scenes} · {p.characters.length} {t.chars}</p></div>
            </Link>
            <button onClick={async () => { if (confirm(t.confirm)) { await removeProject(p); load(); } }} className="absolute end-3 top-3 hidden size-8 place-items-center rounded-full bg-black/60 text-white/80 hover:text-white group-hover:grid" aria-label={t.del}><Icon n="trash" size={15} /></button>
          </article>
        ))}
      </div>
    </main>
  );
}
