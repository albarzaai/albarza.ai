"use client";

import { useActionState } from "react";
import { Icon } from "./Icon";
import { generateAction, type GenState } from "@/lib/generate-actions";
import { t } from "@/lib/dict";
import { tools, type ToolSlug } from "@/lib/tools";
import type { Locale } from "@/lib/i18n";

// Davinci-style bottom prompt bar: uploads, prompt, option pills and Generate. Server validates on submit.
export function Composer({ locale, tool }: { locale: Locale; tool: ToolSlug }) {
  const d = t(locale);
  const cfg = tools[tool];
  const [state, action, pending] = useActionState<GenState, FormData>(generateAction, null);
  return (
    <form action={action} noValidate className="glass sticky bottom-4 z-20 mx-auto w-full max-w-4xl rounded-3xl p-3">
      <input type="hidden" name="tool" value={tool} />
      <div className="flex items-start gap-3">
        {cfg.uploads.map((u) => (
          <label key={u} className="grid h-16 w-16 shrink-0 cursor-pointer place-items-center rounded-xl border border-dashed border-white/25 text-center text-[10px] text-white/70 hover:border-gold">
            <span><Icon n="plus" size={16} className="mx-auto" />{d[u]}</span><input type="file" name={u} className="sr-only" />
          </label>
        ))}
        {cfg.needsPrompt || tool === "lip-sync" ? (
          <textarea name="prompt" rows={2} maxLength={2000} placeholder={d[cfg.promptKey]} className="min-h-16 flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-white/50" />
        ) : <p className="flex-1 self-center px-2 text-sm text-white/60">{d[cfg.promptKey]}</p>}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {cfg.fields.map((f) => (
          <label key={f.key} className="relative">
            <span className="sr-only">{d[f.label]}</span>
            <select name={f.key} className="appearance-none rounded-full border border-white/15 bg-white/5 py-1.5 pe-8 ps-4 text-xs font-medium outline-none hover:border-gold">
              {f.options.map((o) => <option key={o} className="bg-surface">{o}</option>)}
            </select>
            <Icon n="chev" size={12} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2" />
          </label>
        ))}
        <span className="ms-auto text-xs text-white/60">{d.cost}: <b className="text-white">{cfg.cost.toLocaleString(locale === "ar" ? "ar-AE" : "en-AE")} {d.credits}</b></span>
        <button disabled={pending} className="btn btn-white"><Icon n="spark" size={15} />{d.generate}</button>
      </div>
      {state && <p role="status" className={`mt-2 px-2 text-xs ${state.ok ? "text-gold-hi" : "text-red-400"}`}>{state.ok ? d.queued : locale === "ar" ? "تحقق من المدخلات" : "Please check your input"}</p>}
    </form>
  );
}
