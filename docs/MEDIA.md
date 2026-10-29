# Image slots (generate with Gemini "Nano Banana", then drop into `public/media/`)

Style brief for every prompt: *premium dark cinematic, near-black background (#050505), warm gold accents (#BD9B5F), subtle Arabic/Islamic geometric motifs (arches, mashrabiya patterns), Gulf/UAE setting, no text, no logos, no watermarks.*

| File | Used in | Size | Format | Prompt idea |
|---|---|---|---|---|
| `hero.webp` | Homepage hero, model showcase, CTA band, "Try Veo" band | 2400×1350 (16:9) | WebP ≤ 300 KB | Cinematic Dubai skyline at blue hour reflected on water, gold arches framing the scene, dark moody grading, space in the lower third for text |
| `gallery-1.webp` … `gallery-12.webp` | Template cards, feeds, how-to steps, tools slider, login panel (`gallery-1`) | Mix: tall 1000×1500 (2:3) and wide 1200×900 (4:3). Odd numbers 1, 4, 7, 10 are tall | WebP ≤ 150 KB each | One distinct scene per file: desert dunes at sunrise, neon night street, luxury car, fashion portrait, falcon in flight, souk market, product shot on marble, futuristic city, dhow boat, mosque courtyard arches, coffee pouring (dallah), abstract gold geometry |

## How to swap
1. Save files into `public/media/` using the names above.
2. In `lib/media.ts` change `EXT` from `"svg"` to `"webp"`.
3. `npm run build` and deploy. Nothing else references image paths.

## Rules
- Keep every file ≤ the size above so pages stay fast; they are cached immutably on the CDN, so use a new filename (`gallery-1-v2.webp`) when replacing a live image.
- Generated people and likenesses must not imitate real individuals; label AI-generated images where UAE advertising rules require it.
