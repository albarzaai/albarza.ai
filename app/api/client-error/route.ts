import { z } from "zod";

// Receives browser-side errors so they show up in the Worker logs next to the server errors. Validated and size-capped; nothing is stored.
const report = z.object({ k: z.enum(["error", "rejection", "action", "navigation"]), m: z.string().max(300), p: z.string().max(200), s: z.string().max(600).optional() }).strict();

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return new Response(null, { status: 403 });
  const raw = await req.text();
  if (raw.length > 2000) return new Response(null, { status: 413 });
  const r = report.safeParse((() => { try { return JSON.parse(raw); } catch { return null; } })());
  if (!r.success) return new Response(null, { status: 400 });
  console.error("client-error", JSON.stringify({ ...r.data, ua: (req.headers.get("user-agent") ?? "").slice(0, 120) }));
  return new Response(null, { status: 204 });
}
