import { AppSidebar } from "@/components/AppSidebar";
import type { Locale } from "@/lib/i18n";

export default async function AppLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[232px_1fr]">
      <AppSidebar locale={locale} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
