import { SiteHeader } from "@/components/SiteHeader";
import type { Locale } from "@/lib/i18n";

// The modal sits over the (blurred) site, like Davinci.
export default async function AuthLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (<div className="min-h-dvh"><SiteHeader locale={locale} />{children}</div>);
}
