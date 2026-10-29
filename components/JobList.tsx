import { Icon } from "./Icon";
import { gallery } from "@/lib/media";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export type JobStatus = "queued" | "processing" | "done" | "failed";
export const sampleJobs: { id: number; title: [string, string]; tool: string; status: JobStatus; pct: number; ago: [string, string] }[] = [
  { id: 1, title: ["ليلة دبي", "Dubai Night"], tool: "video", status: "processing", pct: 62, ago: ["قبل دقيقتين", "2 min ago"] },
  { id: 2, title: ["صحراء ذهبية", "Golden Desert"], tool: "video", status: "queued", pct: 0, ago: ["قبل ٣ دقائق", "3 min ago"] },
  { id: 3, title: ["بورتريه", "Portrait"], tool: "image", status: "done", pct: 100, ago: ["قبل ساعة", "1 h ago"] },
  { id: 4, title: ["رقصة النيون", "Neon Dance"], tool: "video", status: "failed", pct: 0, ago: ["قبل ٣ ساعات", "3 h ago"] },
];

// Mock job rows showing the queue UX: queued position, live progress, retry on failure.
export function JobList({ locale, compact = false, jobs = sampleJobs }: { locale: Locale; compact?: boolean; jobs?: typeof sampleJobs }) {
  const d = t(locale); const i = locale === "ar" ? 0 : 1;
  const color: Record<JobStatus, string> = { queued: "text-white/60", processing: "text-gold-hi", done: "text-emerald-400", failed: "text-red-400" };
  return (
    <ul className="space-y-3">
      {jobs.map((j) => (
        <li key={j.id} className="card flex items-center gap-4 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gallery(j.id + 2)} alt="" width={96} height={64} className="h-16 w-24 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3"><h3 className="truncate text-sm font-semibold">{j.title[i]}</h3><span className={`shrink-0 text-xs ${color[j.status]}`}>{d[j.status]}{j.status === "processing" && ` · ${j.pct}%`}</span></div>
            {!compact && <p className="mt-0.5 text-xs text-muted">{j.ago[i]}</p>}
            {j.status === "processing" && <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gold" style={{ width: `${j.pct}%` }} /></div>}
            {j.status === "queued" && <p className="mt-1 text-xs text-muted">{d.position}: 2 · {d.eta}: ~1m</p>}
          </div>
          <div className="flex shrink-0 gap-2">
            {j.status === "failed" && <button className="btn btn-ghost !px-3 !py-1.5 text-xs"><Icon n="spark" size={13} />{d.retry}</button>}
            {(j.status === "queued" || j.status === "processing") && <button className="btn btn-ghost !px-3 !py-1.5 text-xs">{d.cancel}</button>}
            {j.status === "done" && <button className="btn btn-ghost !px-3 !py-1.5 text-xs">{d.download}</button>}
          </div>
        </li>
      ))}
    </ul>
  );
}
