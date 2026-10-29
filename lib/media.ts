// Single source of truth for site imagery. All files live in /public/media and are served by the CDN.
// To swap placeholders for generated art, drop files with these names into /public/media
// and change EXT below (e.g. "webp"). See docs/MEDIA.md for sizes and prompts.
const EXT = "svg";

export const HERO = `/media/hero.${EXT}`;
export const GALLERY_COUNT = 12;
export const gallery = (n: number) => `/media/gallery-${((n - 1) % GALLERY_COUNT) + 1}.${EXT}`;
export const HERO_LIGHT = `/media/hero-light.${EXT}`;
