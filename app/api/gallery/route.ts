import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { galleryPage } from "@/lib/gallery";

const query = z.object({
  cursor: z.coerce.number().int().min(0).max(100000).default(0),
  type: z.enum(["all", "image", "video", "audio", "template", "motion", "explore", "reshoot", "dance"]).default("all"),
  locale: z.enum(["ar", "en"]).default("ar"),
  q: z.string().trim().max(60).default(""),
  sort: z.enum(["new", "old"]).default("new"),
  cat: z.string().trim().max(40).default(""),
});

// Next pages for the infinite scroll. The first page is rendered on the server with the page itself.
export async function GET(req: NextRequest) {
  const q = query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!q.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  return NextResponse.json(galleryPage(q.data), { headers: { "Cache-Control": "private, max-age=30" } });
}
