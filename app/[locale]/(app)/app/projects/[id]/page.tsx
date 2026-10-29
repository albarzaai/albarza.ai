import { ProjectWorkspace } from "@/components/ProjectWorkspace";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  return <ProjectWorkspace locale={locale as Locale} id={id} />;
}
