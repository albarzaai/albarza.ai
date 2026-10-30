"use client";

import { useEffect, useRef } from "react";

declare global { interface Window { turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; remove: (id: string) => void } } }

const KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// Cloudflare Turnstile bot check. Renders nothing until a site key is configured. The token travels in the form as
// "cf-turnstile-response" and is verified by the API Worker (never trusted on its own here).
export function TurnstileBox({ locale }: { locale: string }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!KEY || !el) return;
    let id = "";
    // The submit button waits for the token (it arrives in a moment); if the check cannot load at all it is released after 8 s and the server answers.
    const btn = el.closest("form")?.querySelector<HTMLButtonElement>("button.btn-gold");
    const hold = (on: boolean) => { if (btn) btn.disabled = on; };
    hold(true);
    const release = setTimeout(() => hold(false), 8000);
    const draw = () => { if (window.turnstile && !id) id = window.turnstile.render(el, { sitekey: KEY, language: locale === "ar" ? "ar" : "en", theme: "light", appearance: "interaction-only", callback: () => { clearTimeout(release); hold(false); }, "expired-callback": () => hold(true), "error-callback": () => { clearTimeout(release); hold(false); } }); };
    if (window.turnstile) draw();
    else {
      let s = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
      if (!s) { s = document.createElement("script"); s.src = SRC; s.async = true; document.head.appendChild(s); }
      s.addEventListener("load", draw);
    }
    return () => { clearTimeout(release); hold(false); if (id) window.turnstile?.remove(id); };
  }, [locale]);
  return KEY ? <div ref={box} className="flex justify-center" /> : null;
}
