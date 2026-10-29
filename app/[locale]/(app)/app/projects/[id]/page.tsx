import Link from "next/link";
import { Feed } from "@/components/Feed";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: l, id } = await params;
  const locale = l as Locale;
  const d = t(locale);
  const name = locale === "ar" ? ["حملة رمضان", "إعلان المنتج", "فيلم قصير"][(Number(id) || 1) - 1] ?? d.newProject : ["Ramadan campaign", "Product ad", "Short film"][(Number(id) || 1) - 1] ?? d.newProject;
  return (
    <div className="p-5 md:p-8">
      <Link href={`/${locale}/app/projects`} className="text-sm text-muted hover:text-white">{locale === "ar" ? "›" : "‹"} {d.backProjects}</Link>
      <div className="mb-8 mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{name}</h1>
        <div className="flex gap-2"><button className="btn btn-ghost">{d.rename}</button><Link href={`/${locale}/app/video?tab=creations`} className="btn btn-gold">＋ {d.generate}</Link></div>
      </div>
      <Feed locale={locale} type="all" />
    </div>
  );
}
