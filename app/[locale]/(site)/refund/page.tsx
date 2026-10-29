import { LegalPage } from "@/components/LegalPage";
import { t } from "@/lib/dict";
import { refund } from "@/lib/legal";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return <LegalPage locale={locale} title={t(locale).refundTitle} sections={refund} />;
}
