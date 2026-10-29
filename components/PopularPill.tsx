"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { Pop } from "./Pop";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

export function PopularPill({ locale, onChange }: { locale: Locale; onChange?: (v: string) => void }) {
  const a = ta(locale);
  const [v, setV] = useState("popular");
  return (
    <Pop up={false} panelClass="w-40 p-2" trigger={<span className="pill !py-2 pill-on text-sm"><Icon n="flame" size={15} />{v === "popular" ? a.popular : a.latest}</span>}>
      {(close) => ["popular", "latest"].map((k) => <button key={k} type="button" onClick={() => { setV(k); onChange?.(k); close(); }} className="block w-full rounded-lg px-3 py-2 text-start text-sm hover:bg-white/10">{k === "popular" ? a.popular : a.latest}</button>)}
    </Pop>
  );
}
