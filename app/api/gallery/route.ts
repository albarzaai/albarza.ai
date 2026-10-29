import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const query = z.object({
  cursor: z.coerce.number().int().min(0).max(100000).default(0),
  type: z.enum(["all", "image", "video", "audio"]).default("all"),
});
const PAGE = 12;

// Mock paginated feed. Items point at static files in /public so the browser/CDN serves media directly.
export async function GET(req: NextRequest) {
  const q = query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!q.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const { cursor, type } = q.data;
  const kinds = ["image", "video", "image", "audio"] as const;
  const items = Array.from({ length: PAGE }, (_, i) => {
    const n = cursor + i;
    return { id: n, kind: kinds[n % 4], src: `/media/gallery-${(n % 12) + 1}.svg`, tall: n % 3 === 0 };
  }).filter((it) => type === "all" || it.kind === type);
  const next = cursor + PAGE < 240 ? cursor + PAGE : null;
  return NextResponse.json({ items, next }, { headers: { "Cache-Control": "private, max-age=30" } });
}
