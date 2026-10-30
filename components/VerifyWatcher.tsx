"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// On the "Check your email" page: when the address gets confirmed somewhere else (a phone, another browser), move on to sign-in.
export function VerifyWatcher({ locale }: { locale: string }) {
  const router = useRouter();
  useEffect(() => {
    let stop = false;
    const check = async () => {
      if (stop || document.hidden) return;
      const r = await fetch("/api/auth/verified", { cache: "no-store" }).then((x) => x.json() as Promise<{ verified?: boolean }>).catch(() => null);
      if (r?.verified && !stop) { stop = true; router.replace(`/${locale}/login?verified=1`); }
    };
    const t = setInterval(check, 4000);
    const onVisible = () => { if (!document.hidden) void check(); };
    document.addEventListener("visibilitychange", onVisible);
    void check();
    return () => { stop = true; clearInterval(t); document.removeEventListener("visibilitychange", onVisible); };
  }, [locale, router]);
  return null;
}
