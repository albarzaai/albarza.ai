import { AuthModal } from "@/components/AuthModal";
import { safeNext } from "@/lib/session";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ next?: string; reset?: string; verified?: string; error?: string }> }) {
  const locale = (await params).locale as Locale;
  const sp = await searchParams;
  return <AuthModal locale={locale} initial="login" next={sp.next ? safeNext(sp.next, locale) : undefined} reset={sp.reset === "1"} verified={sp.verified === "1"} error={sp.error && /^[a-z_]{3,30}$/.test(sp.error) ? sp.error : undefined} />;
}
