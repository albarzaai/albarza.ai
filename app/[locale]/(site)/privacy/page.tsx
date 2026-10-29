import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (<main className="section max-w-3xl pt-32"><h1 className="text-3xl font-bold">{t(locale).privacy}</h1><p className="mt-6 text-muted">{locale === "ar" ? "مسودة وفق المرسوم بقانون اتحادي رقم ٤٥ لسنة ٢٠٢١ (PDPL): أساس المعالجة، حقوق الوصول والحذف والنقل، الاحتفاظ بالبيانات، ومعالجة البيانات خارج الدولة. تُراجع قانونياً قبل الإطلاق." : "Draft aligned with Federal Decree-Law No. 45 of 2021 (PDPL): lawful basis, access/erasure/portability rights, retention and cross-border transfers. To be legally reviewed before launch."}</p></main>);
}
