import Link from "next/link";
import { Logo } from "./Logo";
import { models, t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const d = t(locale);
  const cols: [string, string[]][] = [
    [d.footModels, models.slice(0, 6).map((m) => m[1])],
    [d.footFeatures, [d.i2v, d.t2i, d.upscale, d.lipsync, d.t2v, d.vc]],
    [d.footCompany, [d.navPricing, d.help, d.privacy, d.terms, d.contact]],
    [d.footSocial, ["Instagram", "X", "TikTok", "YouTube"]],
  ];
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1200px] px-5 py-14">
        <Logo locale={locale} />
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          {cols.map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold">{title}</h4>
              <ul className="space-y-2.5 text-sm text-muted">
                {links.map((l) => <li key={l}><Link href={l === d.privacy ? `/${locale}/privacy` : l === d.terms ? `/${locale}/terms` : `/${locale}`} className="hover:text-white">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-12 text-xs text-muted">{d.uae}</p>
        <p className="mt-3 text-xs text-muted/70">{d.disclaimer}</p>
        <p className="mt-6 text-xs text-muted">© {new Date().getFullYear()} {d.brand}. {d.rights}.</p>
      </div>
    </footer>
  );
}
