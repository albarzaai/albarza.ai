import { FeedClient } from "./FeedClient";
import { galleryPage } from "@/lib/gallery";
import type { Locale } from "@/lib/i18n";

type Props = { locale: Locale; type: string; titles?: boolean; open?: "viewer" | "template" | "none"; q?: string; sort?: string; cat?: string; view?: "grid" | "row"; cols?: 4 | 5 };

// Server component: the first page of the feed is rendered on the worker with the page, so the HTML already contains the cards.
export function Feed(props: Props) {
  const { locale, type, q = "", sort = "new", cat = "" } = props;
  const initial = galleryPage({ type, locale, q, sort: sort === "old" ? "old" : "new", cat });
  return <FeedClient key={`${type}|${q}|${sort}|${cat}`} {...props} initial={initial} />;
}
