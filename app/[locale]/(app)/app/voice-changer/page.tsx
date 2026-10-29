import { ToolPage } from "@/components/ToolPage";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return <ToolPage locale={locale} title="vc" cost={5} fields={[{kind:"upload"},{kind:"select",label:"voice",options:["Hamad (ar-AE)","Fatima (ar-AE)","Noor (en)","James (en)"]}]} />;
}
