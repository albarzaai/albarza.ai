"use client";

import { useEffect, useRef } from "react";

declare global { interface Window { turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; remove: (id: string) => void; reset: (id: string) => void } } }

const KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// Cloudflare Turnstile bot check. Renders nothing until a site key is configured. The token travels in the form as
// "cf-turnstile-response" and is verified by the API Worker (never trusted on its own here).
// A token works once, and React clears the form after every submit, so the check is re-armed after each submit. A submit made before
// the token is ready is held and sent by itself the moment the token arrives.
export function TurnstileBox({ locale }: { locale: string }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    const form = el?.closest("form");
    if (!KEY || !el || !form) return;
    let id = "";
    let waiting = false;
    const token = () => form.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value ?? "";
    const onSubmit = (e: Event) => {
      if (!id || token()) return; // no widget (script blocked) or token ready: let the server decide
      e.preventDefault(); e.stopImmediatePropagation(); waiting = true;
    };
    const onReset = () => { waiting = false; if (id) window.turnstile?.reset(id); };
    const done = () => { if (waiting) { waiting = false; form.requestSubmit(); } };
    const draw = () => {
      if (!window.turnstile || id) return;
      id = window.turnstile.render(el, { sitekey: KEY, language: locale === "ar" ? "ar" : "en", theme: "light", appearance: "interaction-only", callback: done, "expired-callback": () => window.turnstile?.reset(id), "error-callback": () => { waiting = false; } });
    };
    form.addEventListener("submit", onSubmit, true);
    form.addEventListener("reset", onReset);
    if (window.turnstile) draw();
    else {
      let sc = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
      if (!sc) { sc = document.createElement("script"); sc.src = SRC; sc.async = true; document.head.appendChild(sc); }
      sc.addEventListener("load", draw);
    }
    return () => { form.removeEventListener("submit", onSubmit, true); form.removeEventListener("reset", onReset); if (id) window.turnstile?.remove(id); };
  }, [locale]);
  return KEY ? <div ref={box} className="flex justify-center" /> : null;
}
