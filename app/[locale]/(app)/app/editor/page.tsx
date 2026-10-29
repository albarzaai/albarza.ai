import { Icon } from "@/components/Icon";
import { ta } from "@/lib/app-dict";
import { gallery } from "@/lib/media";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const a = ta(locale);
  return (
    <div className="flex min-h-dvh flex-col gap-3 p-3 md:p-4">
      <header className="flex h-12 items-center justify-between px-2"><div className="flex items-center gap-3"><h1 className="font-semibold">{a.editorTitle}</h1><span className="text-sm text-white/45">{a.project}</span></div><button className="gbtn !py-2">{a.exportBtn}</button></header>
      <div className="grid flex-1 gap-3 lg:grid-cols-[260px_1fr]">
        <aside className="sheet p-3"><p className="mb-3 text-sm font-semibold">{a.assets}</p><div className="grid grid-cols-3 gap-2 lg:grid-cols-2">{[1, 2, 3, 4, 5, 6].map((n) => /* eslint-disable-next-line @next/next/no-img-element */ <img key={n} src={gallery(n)} alt="" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />)}</div></aside>
        <div className="flex min-h-0 flex-col gap-3">
          <section className="sheet grid min-h-[300px] flex-1 place-items-center p-4"><div className="relative aspect-video w-full max-w-[640px] overflow-hidden rounded-xl bg-black">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={gallery(3)} alt="" className="h-full w-full object-cover" /><span className="absolute inset-0 grid place-items-center"><span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-black"><Icon n="play" size={22} /></span></span></div></section>
          <section className="sheet p-3"><div className="mb-2 flex items-center gap-3 text-white/70"><Icon n="scissors" size={16} /><Icon n="prev" size={16} /><Icon n="play" size={16} /><Icon n="next" size={16} /><span className="ms-auto text-xs tabular-nums" dir="ltr">00:00 / 00:12</span></div>
            <div className="space-y-2" dir="ltr">{[0, 1, 2].map((t) => <div key={t} className="flex items-center gap-2"><span className="w-14 text-xs text-white/40">{a.track} {t + 1}</span><div className="relative h-10 flex-1 rounded-lg bg-white/5">{[[2, 30], [36, 28], [68, 24]].slice(0, 3 - t).map(([l, w], k) => <span key={k} className="absolute top-1 h-8 rounded-md bg-gold/70" style={{ left: `${l}%`, width: `${w}%` }} />)}</div></div>)}</div></section>
        </div>
      </div>
    </div>
  );
}
