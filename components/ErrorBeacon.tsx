"use client";

import { useEffect } from "react";

// Sends uncaught browser errors to /api/client-error (once per message per page view, at most 5), so problems real visitors hit are visible in the logs.
export function ErrorBeacon() {
  useEffect(() => {
    const seen = new Set<string>();
    const send = (k: string, m: string, s?: string) => {
      const key = k + m;
      if (seen.size >= 5 || seen.has(key)) return;
      seen.add(key);
      navigator.sendBeacon?.("/api/client-error", new Blob([JSON.stringify({ k, m: m.slice(0, 300), p: location.pathname.slice(0, 200), ...(s ? { s: s.slice(0, 600) } : {}) })], { type: "application/json" }));
    };
    const onError = (e: ErrorEvent) => send("error", e.message || "error", e.error?.stack);
    const onRejection = (e: PromiseRejectionEvent) => send("rejection", String((e.reason as Error)?.message ?? e.reason), (e.reason as Error)?.stack);
    addEventListener("error", onError); addEventListener("unhandledrejection", onRejection);
    return () => { removeEventListener("error", onError); removeEventListener("unhandledrejection", onRejection); };
  }, []);
  return null;
}
