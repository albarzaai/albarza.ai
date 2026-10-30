import Link from "next/link";
import type { Locale } from "@/lib/i18n";

const l = (ar: string, en: string) => ({ ar, en });
const copy = {
  badge: l("الجهات الحكومية", "Government & public sector"),
  title: l("مصمَّمة للجهات الحكومية في الإمارات", "Built for UAE government entities"),
  sub: l("إنشاء صور وفيديو بالذكاء الاصطناعي بخصوصية وضوابط واضحة للوزارات والهيئات والمؤسسات العامة، مع فريق يدعم إجراءات الشراء لديكم.", "Private AI image and video creation with clear controls for ministries, authorities and public institutions, and a team that supports your procurement."),
  points: [
    l("تسجيل دخول موحّد وصلاحيات حسب الأدوار للفرق", "Single sign-on and role-based team access"),
    l("رصيد مركزي مشترك وتقارير استخدام وفواتير رسمية", "Central credit pools, usage reports and official invoices"),
    l("تهيئة وتدريب مخصّصان ودعم ذو أولوية", "Dedicated onboarding, training and priority support"),
  ],
  cta: l("تواصل مع فريق القطاع الحكومي", "Contact our government team"),
};

// Pricing-page band for government entities: a hoist-red bar and the green / white / black bands of the UAE flag, set in the Albarza cream and gold.
export function GovSection({ locale }: { locale: Locale }) {
  return (
    <section className="mx-auto w-full max-w-[1100px] px-5 pb-24 md:px-10">
      <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface">
        <span aria-hidden className="absolute inset-y-0 start-0 w-3 bg-[#CE1126] md:w-4" />
        <div className="grid gap-8 py-9 ps-10 pe-6 md:grid-cols-[1.15fr_1fr] md:gap-12 md:py-12 md:ps-14 md:pe-12">
          <div>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide">
              <span aria-hidden className="flex h-3.5 w-6 overflow-hidden rounded-[3px] border border-line">
                <span className="w-[30%] bg-[#CE1126]" />
                <span className="flex flex-1 flex-col"><span className="flex-1 bg-[#00732F]" /><span className="flex-1 bg-white" /><span className="flex-1 bg-black" /></span>
              </span>
              {copy.badge[locale]}
            </span>
            <h2 className="mt-5 text-balance text-[28px] font-bold leading-tight tracking-tight md:text-4xl">{copy.title[locale]}</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted">{copy.sub[locale]}</p>
            <Link href={`/${locale}/contact?topic=government`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-ink/85">
              {copy.cta[locale]}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="rtl:rotate-180"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M2 7h10M8 3l4 4-4 4" /></svg>
            </Link>
          </div>
          <ul className="space-y-4 self-center">
            {copy.points.map((p) => (
              <li key={p.en} className="flex items-start gap-3.5 text-[15px] leading-6">
                <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#00732F] text-white">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m2.5 6.2 2.3 2.3 4.7-4.9" /></svg>
                </span>
                {p[locale]}
              </li>
            ))}
          </ul>
        </div>
        <div aria-hidden className="flex h-1.5"><span className="flex-1 bg-[#00732F]" /><span className="flex-1 bg-white" /><span className="flex-1 bg-black" /></div>
      </div>
    </section>
  );
}
