import Link from "next/link";
import { Icon } from "./Icon";
import { gallery } from "@/lib/media";
import type { Locale } from "@/lib/i18n";

// Shared Davinci-style modal chrome: art panel on one side, content on the other.
export function AuthFrame({ locale, children, art = 1 }: { locale: Locale; children: React.ReactNode; art?: number }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative grid max-h-[92dvh] w-full max-w-[1000px] overflow-auto rounded-3xl border border-line bg-surface md:min-h-[640px] md:grid-cols-2">
        <Link href={`/${locale}`} aria-label="close" className="absolute end-5 top-5 z-10 grid h-9 w-9 place-items-center rounded-full bg-ink/10 hover:bg-ink/20"><Icon n="close" size={14} /></Link>
        <div className="relative m-6 hidden overflow-hidden rounded-2xl md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gallery(art)} alt="" className="absolute inset-0 h-full w-full object-cover" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.svg" alt="" width={56} height={70} className="absolute start-6 top-6" />
        </div>
        <div className="flex flex-col justify-center px-8 py-14 md:px-12">{children}</div>
      </div>
    </div>
  );
}
