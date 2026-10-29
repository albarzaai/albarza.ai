import { ContactForm } from "@/components/Forms";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const d = t(locale);
  return (<main className="section max-w-2xl pt-32"><h1 className="text-4xl font-semibold">{d.contactTitle}</h1><p className="mb-8 mt-3 text-muted">{d.contactSub}</p><ContactForm locale={locale} /></main>);
}
