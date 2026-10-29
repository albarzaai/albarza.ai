import Link from "next/link";
import { Logo } from "./Logo";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const d = t(locale);
  const other = locale === "ar" ? "en" : "ar";
  const nav: [string, string][] = [[d.navAiImage, "#tools"], [d.navAiVideo, "#models"], [d.navEditor, "#tools"], [d.navExplore, "#gallery"], [d.navTemplates, "#tools"]];
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Logo locale={locale} />
          <nav className="hidden items-center gap-7 text-sm text-white lg:flex">
            {nav.map(([label, href]) => <Link key={label} href={`/${locale}${href}`} className="hover:text-gold-hi">{label}</Link>)}
          </nav>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <Link href={`/${other}`} hrefLang={other} className="text-white/80 hover:text-white">{other === "ar" ? "العربية" : "English"}</Link>
          <Link href={`/${locale}#pricing`} className="hidden text-white/80 hover:text-white sm:block">{d.navPricing}</Link>
          <Link href={`/${locale}/login`} className="text-white/80 hover:text-white">{d.login}</Link>
          <Link href={`/${locale}/signup`} className="btn btn-gold">{d.signup}</Link>
        </div>
      </div>
    </header>
  );
}
