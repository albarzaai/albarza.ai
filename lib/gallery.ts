import { gallery } from "@/lib/media";
import { templateTitles } from "@/lib/content";

export type GalleryItem = { id: number; kind: "image" | "video" | "audio"; src: string; tall: boolean; title: string };
export type GalleryPage = { items: GalleryItem[]; next: number | null };
export type GalleryQuery = { cursor?: number; type?: string; locale?: "ar" | "en"; q?: string; sort?: "new" | "old"; cat?: string };

export const PAGE = 12;
// Each page type (and reshoot category) starts at its own place in the pool so Explore, Templates and Reshoot do not show the same wall.
const TYPE_OFFSET: Record<string, number> = { all: 0, image: 7, video: 31, audio: 53, template: 89, motion: 113, explore: 0, reshoot: 149, dance: 181 };
const hash = (t: string) => [...t].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 240, 0);

// Mock paginated feed. Items point at static files in /public so the browser/CDN serves media directly.
export function galleryPage({ cursor = 0, type = "all", locale = "ar", q = "", sort = "new", cat = "" }: GalleryQuery): GalleryPage {
  const term = q.trim().toLowerCase();
  const off = ((TYPE_OFFSET[type] ?? 0) + hash(cat)) % 240;
  const kinds = ["image", "video", "image", "audio"] as const;
  const items = Array.from({ length: PAGE }, (_, i) => {
    const pos = sort === "new" ? cursor + i : 239 - (cursor + i);
    const n = (pos + off) % 240;
    const title = templateTitles[n % templateTitles.length][locale];
    const video = ["template", "motion", "dance"].includes(type) || kinds[n % 4] === "video";
    return { id: n, kind: (video ? "video" : kinds[n % 4]) as GalleryItem["kind"], src: gallery(n + 1), tall: n % 3 !== 1, title };
  }).filter((it) => !term || it.title.toLowerCase().includes(term)).filter((it) => !["image", "video", "audio"].includes(type) || it.kind === type);
  return { items, next: cursor + PAGE < 240 ? cursor + PAGE : null };
}
