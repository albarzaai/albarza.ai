import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/dict";

export function Logo({ locale, href, adaptive }: { locale: Locale; href?: string; adaptive?: boolean }) {
  return (
    <Link href={href ?? `/${locale}`} className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo.svg" alt="" width={26} height={32} className={adaptive ? "group-data-[top=true]:hidden" : undefined} />
      {adaptive && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/brand/logo-light.png" alt="" width={24} height={32} className="hidden group-data-[top=true]:block" />
      )}
      <span className="text-lg font-bold tracking-wide">{t(locale).brand}</span>
    </Link>
  );
}
