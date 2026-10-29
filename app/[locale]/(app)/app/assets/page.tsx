import { Feed } from "@/components/Feed";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (<div className="p-5 md:p-8"><h1 className="mb-6 text-xl font-semibold">{t(locale).assets}</h1><Feed locale={locale} type="all" /></div>);
}
