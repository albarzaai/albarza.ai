import { AppSidebar } from "@/components/AppSidebar";
import type { Locale } from "@/lib/i18n";

export default async function AppLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (
    <div className="app-bg min-h-dvh md:flex">
      <div className="md:shrink-0 md:w-[var(--sb)] md:transition-[width]"><AppSidebar locale={locale} /></div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
