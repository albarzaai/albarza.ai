import Link from "next/link";
import { Faq } from "@/components/Sections";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const d = t(locale);
  return (<main className="pt-32"><div className="section max-w-3xl py-0 text-center"><h1 className="text-4xl font-semibold">{d.helpTitle}</h1><p className="mt-3 text-muted">{d.helpSub}</p></div><Faq locale={locale} /><div className="pb-20 text-center"><Link href={`/${locale}/contact`} className="btn btn-gold">{d.contactTitle}</Link></div></main>);
}
