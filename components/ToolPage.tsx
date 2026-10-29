import { t, type Dict } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

type Field =
  | { kind: "select"; label: keyof Dict; options: string[] }
  | { kind: "upload"; label?: string }
  | { kind: "text"; label: keyof Dict; rows?: number };

// UI-only shell shared by all generation tools. The form posts nowhere yet.
export function ToolPage({ locale, title, fields, cost }: { locale: Locale; title: keyof Dict; fields: Field[]; cost: number }) {
  const d = t(locale);
  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[420px_1fr]">
      <form className="card space-y-4 p-5" noValidate>
        <h1 className="text-xl font-bold">{d[title]}</h1>
        {fields.map((f, i) =>
          f.kind === "upload" ? (
            <label key={i} className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line text-sm text-muted hover:border-gold">
              <span className="text-2xl text-gold">＋</span>{d.upload}<input type="file" name="file" className="sr-only" />
            </label>
          ) : f.kind === "text" ? (
            <div key={i}><label className="label">{d[f.label]}</label><textarea name={String(f.label)} rows={f.rows ?? 4} maxLength={2000} className="input resize-none" /></div>
          ) : (
            <div key={i}><label className="label">{d[f.label]}</label><select name={String(f.label)} className="input">{f.options.map((o) => <option key={o}>{o}</option>)}</select></div>
          ),
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted">{d.cost}: <b className="text-cream">{cost} {d.credits}</b></span>
          <button className="btn btn-gold">{d.generate}</button>
        </div>
      </form>
      <section className="card pattern flex min-h-[420px] items-center justify-center p-6 text-center text-sm text-muted">{d.result}</section>
    </div>
  );
}
