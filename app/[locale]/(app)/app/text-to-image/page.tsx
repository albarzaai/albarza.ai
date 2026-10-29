import { ToolPage } from "@/components/ToolPage";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return <ToolPage locale={locale} title="t2i" cost={4} fields={[{kind:"text",label:"prompt"},{kind:"select",label:"model",options:["Flux Pro","Imagen 4","Seedream 4"]},{kind:"select",label:"ratio",options:["1:1","16:9","9:16","4:3"]},{kind:"select",label:"quality",options:["Standard","HD"]}]} />;
}
