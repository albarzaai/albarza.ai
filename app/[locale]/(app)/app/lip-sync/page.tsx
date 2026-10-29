import { ToolPage } from "@/components/ToolPage";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return <ToolPage locale={locale} title="lipsync" cost={20} fields={[{kind:"upload"},{kind:"upload"},{kind:"select",label:"quality",options:["720p","1080p"]}]} />;
}
