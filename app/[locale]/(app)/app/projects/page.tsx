import { PageHeader } from "@/components/PageHeader";
import { ProjectsList } from "@/components/ProjectsList";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (
    <>
      <PageHeader locale={locale} crumb={locale === "ar" ? "المشاريع" : "Projects"} />
      <ProjectsList locale={locale} />
    </>
  );
}
