"use client";

import { useEffect, useRef, useState } from "react";

// Minimal popover: click trigger to toggle; closes on outside click or Escape.
export function Pop({ trigger, children, className = "", panelClass = "", up = true, align = "start" }: {
  trigger: React.ReactNode; children: React.ReactNode | ((close: () => void) => React.ReactNode); className?: string; panelClass?: string; up?: boolean; align?: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const click = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", click); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", esc); };
  }, [open]);
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="contents">{trigger}</button>
      {open && <div className={`menu absolute z-50 ${up ? "bottom-full mb-2" : "top-full mt-2"} ${align === "end" ? "end-0" : "start-0"} ${panelClass}`}>{typeof children === "function" ? children(() => setOpen(false)) : children}</div>}
    </div>
  );
}
