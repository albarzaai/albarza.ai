"use client";

import { useState } from "react";

export function Toggle({ defaultOn = false, label, name }: { defaultOn?: boolean; label: string; name?: string }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => setOn(!on)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-gold" : "bg-white/20"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "start-[22px]" : "start-0.5"}`} />{name && <input type="hidden" name={name} value={String(on)} />}
    </button>
  );
}
