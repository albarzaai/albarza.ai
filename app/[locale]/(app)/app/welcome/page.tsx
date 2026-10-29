import Link from "next/link";
import { t } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const d = t(locale);
  const opts = [d.interestAds, d.interestSocial, d.interestFilm, d.interestShop, d.interestEdu, d.interestArt];
  return (
    <div className="mx-auto grid min-h-dvh max-w-2xl place-items-center p-6 text-center">
      <form noValidate>
        <h1 className="text-3xl font-semibold">{d.welcomeTitle}</h1><p className="mt-3 text-muted">{d.welcomeSub}</p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {opts.map((o) => (<label key={o} className="card cursor-pointer p-5 text-sm font-medium transition has-[:checked]:!border-gold has-[:checked]:bg-white/5"><input type="checkbox" name="interest" value={o} className="sr-only" />{o}</label>))}
        </div>
        <div className="mt-8 flex justify-center gap-3"><Link href={`/${locale}/app/video`} className="btn btn-gold">{d.continue}</Link><Link href={`/${locale}/app/video`} className="btn btn-ghost">{d.skip}</Link></div>
      </form>
    </div>
  );
}
