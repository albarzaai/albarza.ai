import Link from "next/link";
import { Icon } from "./Icon";
import type { Locale } from "@/lib/i18n";

// Shared Davinci-style modal chrome: art panel on one side, content on the other.
export function AuthFrame({ locale, children }: { locale: Locale; children: React.ReactNode; art?: number }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative grid max-h-[92dvh] w-full max-w-[1000px] overflow-auto rounded-3xl border border-line bg-surface md:min-h-[640px] md:grid-cols-2">
        <Link href={`/${locale}`} aria-label="close" className="absolute end-5 top-5 z-10 grid h-9 w-9 place-items-center rounded-full bg-ink/10 hover:bg-ink/20"><Icon n="close" size={14} /></Link>
        <div className="relative m-6 hidden overflow-hidden rounded-2xl md:block">
          <video src="/media/login-dubai-sm.mp4" poster="/media/login-dubai.jpg" autoPlay muted loop playsInline preload="auto" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/25" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-light.png" alt="" width={42} height={56} className="absolute start-6 top-6" />
        </div>
        <div className="flex flex-col justify-center px-8 py-14 md:px-12">{children}</div>
      </div>
    </div>
  );
}
