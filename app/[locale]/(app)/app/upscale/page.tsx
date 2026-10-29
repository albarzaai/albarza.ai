import { ToolPage } from "@/components/ToolPage";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return <ToolPage locale={locale} title="upscale" cost={6} fields={[{kind:"upload"},{kind:"select",label:"quality",options:["2x","4x","8x"]}]} />;
}
