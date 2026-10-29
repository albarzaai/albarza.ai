import { NextResponse, type NextRequest } from "next/server";
import { gallery } from "@/lib/media";
import { z } from "zod";
import { templateTitles } from "@/lib/content";

const query = z.object({
  cursor: z.coerce.number().int().min(0).max(100000).default(0),
  type: z.enum(["all", "image", "video", "audio", "template", "motion", "explore", "reshoot", "dance"]).default("all"),
  locale: z.enum(["ar", "en"]).default("ar"),
  q: z.string().trim().max(60).default(""),
  sort: z.enum(["new", "old"]).default("new"),
  cat: z.string().trim().max(40).default(""),
});
const PAGE = 12;
// Each page type (and reshoot category) starts at its own place in the pool so Explore, Templates and Reshoot do not show the same wall.
const TYPE_OFFSET: Record<string, number> = { all: 0, image: 7, video: 31, audio: 53, template: 89, motion: 113, explore: 0, reshoot: 149, dance: 181 };
const hash = (t: string) => [...t].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 240, 0);

// Mock paginated feed. Items point at static files in /public so the browser/CDN serves media directly.
export async function GET(req: NextRequest) {
  const q = query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!q.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const { cursor, type, locale, q: term, sort, cat } = q.data;
  const off = (TYPE_OFFSET[type] + hash(cat)) % 240;
  const kinds = ["image", "video", "image", "audio"] as const;
  const items = Array.from({ length: PAGE }, (_, i) => {
    const pos = sort === "new" ? cursor + i : 239 - (cursor + i);
    const n = (pos + off) % 240;
    const title = templateTitles[n % templateTitles.length][locale];
    const video = ["template", "motion", "dance"].includes(type) || kinds[n % 4] === "video";
    return { id: n, kind: (video ? "video" : kinds[n % 4]) as "image" | "video" | "audio", src: gallery(n + 1), tall: n % 3 !== 1, title };
  }).filter((it) => !term || it.title.toLowerCase().includes(term.toLowerCase())).filter((it) => !["image", "video", "audio"].includes(type) || it.kind === type);
  const next = cursor + PAGE < 240 ? cursor + PAGE : null;
  return NextResponse.json({ items, next }, { headers: { "Cache-Control": "private, max-age=30" } });
}
