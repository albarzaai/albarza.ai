import Link from "next/link";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export function SiteHeader({ locale, overlay = true }: { locale: Locale; overlay?: boolean }) {
  const d = t(locale);
  const other = locale === "ar" ? "en" : "ar";
  const nav: [string, boolean, string][] = [[d.navAiImage, true, "/signup"], [d.navAiVideo, true, "/signup"], [d.navEditor, false, "/signup"], [d.navExplore, false, "/signup"], [d.navTemplates, false, "/signup"]];
  return (
    <header className={`${overlay ? "absolute" : "relative"} inset-x-0 top-0 z-40`}>
      <div className="flex h-[76px] items-center justify-between px-5 md:px-10">
        <div className="flex items-center gap-12">
          <Logo locale={locale} />
          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            {nav.map(([label, chev, href]) => (
              <Link key={label} href={`/${locale}${href}`} className="flex items-center gap-1 hover:text-gold-hi">{label}{chev && <Icon n="chev" size={13} />}</Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link href={`/${other}`} hrefLang={other} className="text-white/80 hover:text-white">{other === "ar" ? "العربية" : "English"}</Link>
          <Link href={`/${locale}/pricing`} className="hidden hover:text-gold-hi sm:block">{d.pricing}</Link>
          <Link href={`/${locale}/login`} className="hover:text-gold-hi">{d.signin}</Link>
          <Link href={`/${locale}/signup`} className="btn btn-gold !px-6">{d.signupBtn}</Link>
        </div>
      </div>
    </header>
  );
}
