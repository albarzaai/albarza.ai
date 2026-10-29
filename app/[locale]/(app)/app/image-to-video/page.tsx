import { ToolPage } from "@/components/ToolPage";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return <ToolPage locale={locale} title="i2v" cost={30} fields={[{kind:"upload"},{kind:"text",label:"prompt",rows:3},{kind:"select",label:"model",options:["Seedance 2.0","Kling O3","Veo 3.1","Wan 2.6"]},{kind:"select",label:"duration",options:["4s","8s","12s","15s"]},{kind:"select",label:"quality",options:["480p","720p","1080p"]}]} />;
}
