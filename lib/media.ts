// Single source of truth for site imagery. All files live in /public/media and are served by the CDN.
// To swap placeholders for generated art, drop files with these names into /public/media
// and change EXT below (e.g. "webp"). See docs/MEDIA.md for sizes and prompts.
const EXT = "svg";
const GEXT = "webp";

export const HERO = `/media/hero.${EXT}`;
export const GALLERY_COUNT = 12;
export const gallery = (n: number) => `/media/g/gallery-${((n - 1) % GALLERY_COUNT) + 1}.${GEXT}`;
// Named picture sets (public/media/g/<set>-<n>.webp): every section draws from its own set so nothing repeats on the site.
export const pic = (set: string, n: number | string) => `/media/g/${set}-${n}.${GEXT}`;
export const heroPoster = (slug: string) => `/media/${slug}.jpg`;
export const HERO_LIGHT = `/media/hero-light.${EXT}`;
