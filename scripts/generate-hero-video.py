#!/usr/bin/env python3
"""Generate the Abu Dhabi hero loop with Veo through the Gemini API. Needs GEMINI_API_KEY and ffmpeg."""
import json, os, subprocess, sys, time, urllib.request, urllib.error

KEY = os.environ["GEMINI_API_KEY"]
BASE = "https://generativelanguage.googleapis.com/v1beta"
MODELS = ["veo-3.1-generate-preview", "veo-3.1-fast-generate-preview", "veo-3.0-generate-001", "veo-3.0-fast-generate-001", "veo-2.0-generate-001"]
PROMPT = (
    "Cinematic slow aerial drone shot of Abu Dhabi at golden hour: the white marble domes and minarets of Sheikh Zayed Grand Mosque "
    "reflecting in still water, then gliding along the Corniche skyline with glass towers glowing in warm gold and cream light. "
    "Smooth, steady camera motion, soft haze, elegant and luxurious mood, photorealistic, 4K look, no text, no logos, no people in close-up."
)


def req(method, url, body=None):
    r = urllib.request.Request(url, method=method, data=json.dumps(body).encode() if body is not None else None,
                               headers={"x-goog-api-key": KEY, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=120) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


op = None
for m in MODELS:
    code, raw = req("POST", f"{BASE}/models/{m}:predictLongRunning",
                    {"instances": [{"prompt": PROMPT}], "parameters": {"aspectRatio": "16:9"}})
    print(m, code, raw[:200].decode(errors="replace"))
    if code == 200:
        op = json.loads(raw)["name"]
        break
if not op:
    print("::error title=hero-video::no Veo model accepted the request (is billing / Veo access enabled for this key?)")
    sys.exit(1)

for _ in range(60):
    time.sleep(10)
    code, raw = req("GET", f"{BASE}/{op}")
    d = json.loads(raw)
    if d.get("done"):
        break
else:
    print("::error title=hero-video::timed out waiting for Veo")
    sys.exit(1)
if "error" in d:
    print("::error title=hero-video::" + json.dumps(d["error"])[:300])
    sys.exit(1)

try:
    uri = d["response"]["generateVideoResponse"]["generatedSamples"][0]["video"]["uri"]
except (KeyError, IndexError):
    print("::error title=hero-video::" + json.dumps(d)[:300])
    sys.exit(1)

os.makedirs("public/media", exist_ok=True)
subprocess.run(["curl", "-sSL", "-H", f"x-goog-api-key: {KEY}", "-o", "/tmp/raw.mp4", uri], check=True)
# Muted, web-sized loop (about 1.5 MB) plus a poster frame.
subprocess.run(["ffmpeg", "-y", "-i", "/tmp/raw.mp4", "-an", "-vf", "scale=1280:-2,fps=24", "-c:v", "libx264", "-crf", "30", "-preset", "slow",
                "-movflags", "+faststart", "-pix_fmt", "yuv420p", "public/media/hero-abudhabi.mp4"], check=True)
subprocess.run(["ffmpeg", "-y", "-i", "/tmp/raw.mp4", "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "4", "public/media/hero-abudhabi.jpg"], check=True)
print("done", os.path.getsize("public/media/hero-abudhabi.mp4"), "bytes")
