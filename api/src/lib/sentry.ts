// Minimal Sentry reporter (no SDK, so the Worker bundle stays small). The DSN is a public client key; set SENTRY_DSN to override.
const DSN = "https://8b1de565ca53fb2c43c5fb5c0c7543df@o4512343237263360.ingest.de.sentry.io/4512343258431568";

export type SentryContext = { service: "web" | "api"; path?: string; method?: string; tags?: Record<string, string>; extra?: Record<string, string | number> };

// Query strings can hold one-time tokens, so only the path is ever sent. No emails, passwords or cookies leave the Worker.
const cleanPath = (p?: string) => (p ?? "").split("?")[0].slice(0, 200);

export async function reportToSentry(err: unknown, ctx: SentryContext, dsn = DSN): Promise<void> {
  try {
    const m = /^https:\/\/([a-f0-9]+)@([^/]+)\/(\d+)$/.exec(dsn);
    if (!m) return;
    const [, key, host, project] = m;
    const e = err instanceof Error ? err : new Error(String(err));
    const id = crypto.randomUUID().replace(/-/g, "");
    const event = {
      event_id: id, timestamp: Date.now() / 1000, platform: "javascript", level: "error", environment: "production", server_name: ctx.service,
      tags: { service: ctx.service, ...ctx.tags }, extra: ctx.extra,
      request: { url: `https://albarza.ai${cleanPath(ctx.path)}`, method: ctx.method },
      exception: { values: [{ type: e.name || "Error", value: e.message.slice(0, 500), stacktrace: e.stack ? { frames: e.stack.split("\n").slice(1, 12).map((l) => ({ filename: l.trim().slice(0, 200) })) } : undefined }] },
    };
    const body = `${JSON.stringify({ event_id: id, sent_at: new Date().toISOString() })}\n${JSON.stringify({ type: "event" })}\n${JSON.stringify(event)}`;
    await fetch(`https://${host}/api/${project}/envelope/`, { method: "POST", headers: { "content-type": "application/x-sentry-envelope", "x-sentry-auth": `Sentry sentry_version=7, sentry_key=${key}, sentry_client=albarza/1.0` }, body, signal: AbortSignal.timeout(4000) });
  } catch { /* reporting must never break a request */ }
}
