import { JobList } from "@/components/JobList";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const d = t(locale);
  return (<div className="mx-auto max-w-4xl p-5 md:p-8"><h1 className="mb-6 text-xl font-semibold">{d.activityTitle}</h1><JobList locale={locale} /></div>);
}
