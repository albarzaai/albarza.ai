"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { ta } from "@/lib/app-dict";
import type { Locale } from "@/lib/i18n";

export function EditProfile({ locale, className = "" }: { locale: Locale; className?: string }) {
  const a = ta(locale);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className={`pill ${className}`}>{a.editProfile}</button>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" onClick={() => setOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} noValidate className="sheet w-full max-w-[420px] space-y-4 p-6">
            <div className="flex items-center justify-between"><h2 className="font-semibold">{a.editProfileT}</h2><button type="button" onClick={() => setOpen(false)} aria-label={a.close} className="grid h-8 w-8 place-items-center rounded-full bg-white/10"><Icon n="close" size={13} /></button></div>
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold text-2xl font-bold text-black">A</span>
            <div><label className="label" htmlFor="dn">{a.displayName}</label><input id="dn" name="name" maxLength={80} className="input" /></div>
            <div className="flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="pill">{a.cancel}</button><button className="gbtn">{a.save}</button></div>
          </form>
        </div>
      )}
    </>
  );
}
