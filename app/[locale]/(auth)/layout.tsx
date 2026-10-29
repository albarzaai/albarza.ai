import { Logo } from "@/components/Logo";
import type { Locale } from "@/lib/i18n";

export default async function AuthLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-5 py-10 bg-surface-2">
      <Logo locale={locale} />
      {children}
    </main>
  );
}
