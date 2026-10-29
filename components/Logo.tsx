import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/dict";

export function Logo({ locale }: { locale: Locale }) {
  return (
    <Link href={`/${locale}`} className="flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo.svg" alt="" width={28} height={35} />
      <span className="text-lg font-bold tracking-tight">{t(locale).brand}</span>
    </Link>
  );
}
