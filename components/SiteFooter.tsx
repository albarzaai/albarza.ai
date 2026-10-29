import Link from "next/link";
import { Logo } from "./Logo";
import { t } from "@/lib/dict";
import { models } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const d = t(locale);
  const p = (s: string) => `/${locale}${s}`;
  const cols: [string, [string, string][]][] = [
    [d.footModels, models.slice(0, 7).map((m) => [m.name, p(`/video-generator/${m.id}`)])],
    [d.footFeatures, [[d.videoGenerator, p("/signup")], [d.navAiImage, p("/image-generator")], [d.upscale, p("/signup")], [d.lipsync, p("/signup")], [d.t2v, p("/signup")], [d.vc, p("/signup")]]],
    [d.footCompany, [[d.pricing, p("/pricing")], [d.help, p("/help")], [d.privacy, p("/privacy")], [d.refund, p("/refund")], [d.cookies, p("/cookies")], [d.terms, p("/terms")], [d.contact, p("/contact")]]],
    [d.footSocial, [["Instagram", "#"], ["X", "#"], ["TikTok", "#"], ["YouTube", "#"]]],
  ];
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1200px] px-5 py-16">
        <Logo locale={locale} />
        <div className="mt-12 grid grid-cols-2 gap-10 md:grid-cols-4">
          {cols.map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold">{title}</h4>
              <ul className="space-y-2.5 text-sm text-muted">
                {links.map(([label, href]) => <li key={label}><Link href={href} className="hover:text-ink">{label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-14 text-xs text-muted">{d.uae}</p>
        <p className="mt-3 text-xs text-muted/70">{d.disclaimer}</p>
        <p className="mt-6 text-xs text-muted">© {new Date().getFullYear()} {d.brand}. {d.rights}.</p>
      </div>
    </footer>
  );
}
