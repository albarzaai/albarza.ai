import Link from "next/link";
import { Logo } from "./Logo";
import { HeaderShell } from "./HeaderShell";
import { Icon } from "./Icon";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const d = t(locale);
  const other = locale === "ar" ? "en" : "ar";
  const nav: [string, boolean, string][] = [[d.navAiImage, true, "/image-generator"], [d.navAiVideo, true, "/video-generator"], [d.navEditor, false, "/signup"], [d.navExplore, false, "/signup"], [d.navTemplates, false, "/signup"]];
  return (
    <HeaderShell>
      <div className="mx-auto flex h-[76px] w-full max-w-[1400px] items-center justify-between px-5 md:px-10">
        <div className="flex items-center gap-12">
          <Logo locale={locale} adaptive />
          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            {nav.map(([label, chev, href]) => (
              <Link key={label} href={`/${locale}${href}`} className="flex items-center gap-1 hover:text-gold-hi">{label}{chev && <Icon n="chev" size={13} />}</Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link href={`/${locale}/pricing`} className="hover:text-gold-hi">{d.pricing}</Link>
          <Link href={`/${locale}/login`} className="hover:text-gold-hi">{d.signin}</Link>
          <Link href={`/${locale}/signup`} className="btn btn-gold !px-6">{d.signupBtn}</Link>
          <Link href={`/${other}`} prefetch={false} hrefLang={other} lang={other} aria-label={other === "ar" ? "العربية" : "English"} title={other === "ar" ? "العربية" : "English"} className="grid h-10 w-10 place-items-center rounded-full text-ink/80 hover:bg-black/10 group-data-[top=true]:hover:bg-white/15"><Icon n="globe" size={20} /></Link>
        </div>
      </div>
    </HeaderShell>
  );
}
