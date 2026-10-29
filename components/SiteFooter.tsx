import Link from "next/link";
import { Logo } from "./Logo";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-3">
          <Logo locale={locale} />
          <p className="text-sm text-muted">{d.uae}</p>
        </div>
        <div className="flex gap-6 text-sm text-muted">
          <Link href={`/${locale}/terms`} className="hover:text-gold-deep">{d.terms}</Link>
          <Link href={`/${locale}/privacy`} className="hover:text-gold-deep">{d.privacy}</Link>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">© {new Date().getFullYear()} {d.brand}. {d.rights}.</div>
    </footer>
  );
}
