import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function Terms({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (<main className="section max-w-3xl pt-32"><h1 className="text-3xl font-bold">{t(locale).terms}</h1><p className="mt-6 text-muted">{locale === "ar" ? "مسودة: تُراجع من مستشار قانوني مرخّص في دولة الإمارات قبل الإطلاق. تشمل: الاستخدام المقبول، المحتوى المحظور وفق قانون مكافحة الجرائم الإلكترونية، الملكية الفكرية، المدفوعات بالدرهم، واستخدام المحتوى المُولَّد." : "Draft: to be reviewed by a UAE-licensed lawyer before launch. Covers acceptable use, content prohibited under the UAE cybercrime law, intellectual property, AED payments and ownership of generated content."}</p></main>);
}
