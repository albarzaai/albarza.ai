import Link from "next/link";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

const tools = [["text-to-image", "t2i", "✦"], ["image-to-video", "i2v", "▶"], ["lip-sync", "lipsync", "◔"], ["upscale", "upscale", "⬆"], ["text-to-voice", "t2v", "♪"], ["voice-changer", "vc", "∿"]] as const;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const d = t(locale);
  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <h1 className="text-2xl font-bold">{d.dashboard}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(([seg, key, icon]) => (
          <Link key={key} href={`/${locale}/app/${seg}`} className="card p-5 transition hover:border-gold">
            <span className="text-2xl text-gold">{icon}</span><h2 className="mt-3 font-semibold">{d[key]}</h2>
          </Link>
        ))}
      </div>
      <section>
        <h2 className="mb-4 font-semibold">{d.recent}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={n} src={`/media/gallery-${n}.svg`} alt="" width={400} height={300} loading="lazy" className="card h-36 w-full object-cover" />
          ))}
        </div>
      </section>
    </div>
  );
}
