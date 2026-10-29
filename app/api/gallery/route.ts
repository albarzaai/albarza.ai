import { NextResponse, type NextRequest } from "next/server";
import { gallery } from "@/lib/media";
import { z } from "zod";
import { templateTitles } from "@/lib/content";

const query = z.object({
  cursor: z.coerce.number().int().min(0).max(100000).default(0),
  type: z.enum(["all", "image", "video", "audio", "template", "motion"]).default("all"),
  locale: z.enum(["ar", "en"]).default("ar"),
  q: z.string().trim().max(60).default(""),
  sort: z.enum(["new", "old"]).default("new"),
});
const PAGE = 12;

// Mock paginated feed. Items point at static files in /public so the browser/CDN serves media directly.
export async function GET(req: NextRequest) {
  const q = query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!q.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const { cursor, type, locale, q: term, sort } = q.data;
  const kinds = ["image", "video", "image", "audio"] as const;
  const items = Array.from({ length: PAGE }, (_, i) => {
    const n = sort === "new" ? cursor + i : 239 - (cursor + i);
    const title = templateTitles[n % templateTitles.length][locale];
    return { id: n, kind: kinds[n % 4], src: gallery(n + 1), tall: n % 3 !== 1, title };
  }).filter((it) => !term || it.title.toLowerCase().includes(term.toLowerCase())).filter((it) => type === "all" || type === "template" || type === "motion" || it.kind === type);
  const next = cursor + PAGE < 240 ? cursor + PAGE : null;
  return NextResponse.json({ items, next }, { headers: { "Cache-Control": "private, max-age=30" } });
}
