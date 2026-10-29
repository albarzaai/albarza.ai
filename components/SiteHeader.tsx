import Link from "next/link";
import { Logo } from "./Logo";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const d = t(locale);
  const other = locale === "ar" ? "en" : "ar";
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <Logo locale={locale} />
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            <Link href={`/${locale}#models`} className="hover:text-cream">{d.navVideo}</Link>
            <Link href={`/${locale}#tools`} className="hover:text-cream">{d.toolsTitle}</Link>
            <Link href={`/${locale}#pricing`} className="hover:text-cream">{d.navPricing}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/${other}`} className="text-sm text-muted hover:text-cream" hrefLang={other}>{other === "ar" ? "العربية" : "English"}</Link>
          <Link href={`/${locale}/login`} className="btn btn-ghost hidden sm:inline-flex">{d.login}</Link>
          <Link href={`/${locale}/signup`} className="btn btn-gold">{d.signup}</Link>
        </div>
      </div>
    </header>
  );
}
