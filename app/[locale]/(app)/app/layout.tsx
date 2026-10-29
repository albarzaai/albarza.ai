import Link from "next/link";
import { AppSidebar } from "@/components/AppSidebar";
import { Logo } from "@/components/Logo";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function AppLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const d = t(locale);
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-line bg-surface md:sticky md:top-0 md:h-dvh md:border-e">
        <div className="hidden h-16 items-center px-5 md:flex"><Logo locale={locale} /></div>
        <AppSidebar locale={locale} />
      </aside>
      <div>
        <header className="flex h-16 items-center justify-between border-b border-line px-5">
          <span className="text-sm text-muted">{d.credits}: <b className="text-cream">50</b></span>
          <div className="flex items-center gap-3">
            <Link href={`/${locale}/app/billing`} className="btn btn-gold !py-1.5">{d.upgrade}</Link>
            <Link href={`/${locale === "ar" ? "en" : "ar"}/app`} className="text-sm text-muted">{locale === "ar" ? "EN" : "ع"}</Link>
            <Link href={`/${locale}/login`} className="text-sm text-muted hover:text-cream">{d.logout}</Link>
          </div>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
