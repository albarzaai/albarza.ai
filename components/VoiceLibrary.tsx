import { Icon } from "./Icon";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

const voices: [string, string, string][] = [
  ["حمد", "Hamad", "male-gulf"], ["فاطمة", "Fatima", "female-gulf"], ["سالم", "Salem", "male-msa"], ["مريم", "Maryam", "female-msa"],
  ["James", "James", "male-english"], ["Noor", "Noor", "female-english"], ["خالد", "Khalid", "male-gulf"], ["ريم", "Reem", "female-gulf"],
];
export function VoiceLibrary({ locale }: { locale: Locale }) {
  const d = t(locale);
  const label = (k: string) => { const [g, a] = k.split("-"); return `${g === "male" ? d.male : d.female} · ${a === "gulf" ? d.gulf : a === "msa" ? d.msa : d.english}`; };
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">{d.voices}</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {voices.map(([ar, en, k]) => (
          <article key={en} className="card flex items-center gap-4 p-4">
            <button aria-label={d.play} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold text-black"><Icon n="play" size={16} /></button>
            <div className="min-w-0 flex-1"><h2 className="font-semibold">{locale === "ar" ? ar : en}</h2><p className="text-xs text-muted">{label(k)}</p></div>
            <button className="btn btn-ghost !px-3 !py-1.5 text-xs">{d.useVoice}</button>
          </article>
        ))}
      </div>
    </div>
  );
}
