#!/usr/bin/env python3
"""Rebuild lib/hero-lqip.ts from public/media/hero-abudhabi.jpg."""
import base64, io
from PIL import Image, ImageFilter
im = Image.open("public/media/hero-abudhabi.jpg").convert("RGB")
im = im.resize((32, round(32 * im.height / im.width)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
b = io.BytesIO(); im.save(b, "JPEG", quality=45)
open("lib/hero-lqip.ts", "w").write('// 32px blurred copy of the hero poster, inlined so the hero shows a matching colour on the very first paint (no black flash).\n// Regenerate after the hero video changes: python3 scripts/make-lqip.py\nexport const HERO_LQIP = "data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode() + '";\n')
