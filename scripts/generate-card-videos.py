#!/usr/bin/env python3
"""Animate the app-home banner and its five cards with Atlas Cloud Seedance 2.0 Mini (image-to-video). Needs ATLASCLOUD_API_KEY and ffmpeg."""
import os, subprocess, sys, time, json
from concurrent.futures import ThreadPoolExecutor
import requests

KEY = os.environ.get("ATLASCLOUD_API_KEY", "")
SITE = "https://albarza.ai/media/g/"
STYLE = ("Fast-paced highlight-reel energy: rapid dynamic camera moves, a fresh angle and push-in roughly every second, snappy rhythm, "
         "cinematic, photorealistic, warm gold light, no text, no logos, no subtitles. ")
# slug -> (first-frame image, what moves, output width)
JOBS = {
    "home-banner": ("gallery-3.webp", "Arabic gold coffee dallah pouring coffee into a small cup, steam rising, macro cuts between the spout, the cup and the ornate engraving.", 1280),
    "home-c1": ("gallery-2.webp", "Aerial drone sweep over Palm Jumeirah at sunset, banking and diving toward the crescent and the water.", 640),
    "home-c2": ("gallery-5.webp", "Walking through a lantern-lit old Gulf souk, quick cuts between glowing lanterns, spice stalls and alley arches.", 640),
    "home-c3": ("gallery-8.webp", "A white sports car sliding to a stop on a wet street, fast cuts on the wheel, headlights and the reflections.", 640),
    "home-c4": ("gallery-11.webp", "Gold Islamic geometric inlay on white marble, camera gliding and rotating across the pattern as the gold glints.", 640),
    "home-c5": ("gallery-4.webp", "A woman in a flowing white abaya walking under a latticed gold dome with dappled light, quick tracking cuts.", 640),
}
H = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}


def run(slug):
    img, motion, width = JOBS[slug]
    body = {"model": "bytedance/seedance-2.0-mini/image-to-video", "prompt": STYLE + motion, "image": SITE + img, "duration": 5,
            "resolution": "720p", "ratio": "16:9", "generate_audio": False, "watermark": False}
    r = requests.post("https://api.atlascloud.ai/api/v1/model/generateVideo", headers=H, json=body, timeout=120)
    try:
        d = r.json()
    except ValueError:
        d = {"error": r.text[:300]}
    print(slug, "submit", r.status_code, json.dumps(d)[:200], flush=True)
    if r.status_code != 200 or "data" not in d:
        return slug, False
    pid = d["data"]["id"]
    for _ in range(240):
        time.sleep(5)
        p = requests.get(f"https://api.atlascloud.ai/api/v1/model/prediction/{pid}", headers=H, timeout=60).json().get("data", {})
        if p.get("status") in ("completed", "succeeded"):
            raw = f"/tmp/{slug}-raw.mp4"
            subprocess.run(["curl", "-sSL", "-o", raw, p["outputs"][0]], check=True)
            os.makedirs("public/media", exist_ok=True)
            subprocess.run(["ffmpeg", "-y", "-i", raw, "-an", "-vf", f"scale='min({width},iw)':-2:flags=lanczos,fps=24", "-c:v", "libx264", "-crf", "26", "-preset", "slow",
                            "-maxrate", "1.4M" if width > 700 else "0.7M", "-bufsize", "2M", "-profile:v", "high", "-movflags", "+faststart", "-pix_fmt", "yuv420p",
                            f"public/media/{slug}.mp4"], check=True)
            print(slug, "ok", os.path.getsize(f"public/media/{slug}.mp4"), "bytes", flush=True)
            return slug, True
        if p.get("status") == "failed":
            print(slug, "failed", str(p.get("error"))[:200], flush=True)
            return slug, False
    print(slug, "timed out", flush=True)
    return slug, False


if not KEY:
    print("::error::ATLASCLOUD_API_KEY is not set")
    sys.exit(1)
with ThreadPoolExecutor(6) as ex:
    res = list(ex.map(run, JOBS))
if not any(ok for _, ok in res):
    sys.exit(1)
