import { currentUser } from "@/lib/session";
import { PricingView } from "@/components/PricingView";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string }> }) {
  const locale = (await params).locale as Locale;
  const { tab } = await searchParams;
  const user = await currentUser();
  const plan = ["starter", "creator", "studio"].includes(user?.plan ?? "") ? user!.plan : "starter";
  return <PricingView locale={locale} initialTab={tab === "topup" ? "topup" : "upgrade"} current={plan} />;
}
