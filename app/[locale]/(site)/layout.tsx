import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Locale } from "@/lib/i18n";

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (<div className="light"><SiteHeader locale={locale} />{children}<SiteFooter locale={locale} /></div>);
}
