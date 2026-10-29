#!/usr/bin/env python3
"""Generate the Abu Dhabi hero loop with Gemini Omni (Interactions API). Needs GEMINI_API_KEY and ffmpeg."""
import base64, json, os, subprocess, sys, time, urllib.request, urllib.error

KEY = os.environ["GEMINI_API_KEY"]
BASE = "https://generativelanguage.googleapis.com/v1beta"
MODELS = ["gemini-omni-1.1-flash", "gemini-omni-flash-preview"]
PROMPT = (
    "Cinematic slow aerial drone shot of Abu Dhabi at golden hour: the white marble domes and minarets of Sheikh Zayed Grand Mosque "
    "reflecting in still water, then gliding along the Corniche skyline with glass towers glowing in warm gold and cream light. "
    "Smooth, steady camera motion, soft haze, elegant and luxurious mood, photorealistic, no text, no logos, no people in close-up."
)


def call(method, path, body=None, timeout=600):
    r = urllib.request.Request(BASE + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                               headers={"x-goog-api-key": KEY, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=timeout) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, {"error": e.read()[:300].decode(errors="replace")}


def video_of(d):
    for step in d.get("steps", []):
        for c in step.get("content", []):
            if c.get("type") == "video" and c.get("data"):
                return base64.b64decode(c["data"])
    return None


data, errors = None, []
for m in MODELS:
    code, d = call("POST", "/interactions", {"model": m, "input": PROMPT, "response_format": {"type": "video", "aspect_ratio": "16:9", "resolution": "1080p"}})
    print(m, code, d.get("status"))
    for _ in range(60):  # in case the interaction is still running
        if code != 200 or d.get("status") in ("completed", "failed", "cancelled") or video_of(d):
            break
        time.sleep(10)
        code, d = call("GET", f"/interactions/{d['id']}")
    data = video_of(d) if code == 200 else None
    if data:
        break
    errors.append(f"{m}: {code} {json.dumps(d)[:300]}")

if not data:
    for e in errors:
        print("::error title=hero-video::" + e.replace("\n", " "))
    sys.exit(1)

os.makedirs("public/media", exist_ok=True)
open("/tmp/raw.mp4", "wb").write(data)
# Muted, web-sized loop plus a poster frame.
subprocess.run(["ffmpeg", "-y", "-i", "/tmp/raw.mp4", "-an", "-vf", "scale=1280:-2,fps=24", "-c:v", "libx264", "-crf", "30", "-preset", "slow",
                "-movflags", "+faststart", "-pix_fmt", "yuv420p", "public/media/hero-abudhabi.mp4"], check=True)
subprocess.run(["ffmpeg", "-y", "-i", "/tmp/raw.mp4", "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "4", "public/media/hero-abudhabi.jpg"], check=True)
print("done", os.path.getsize("public/media/hero-abudhabi.mp4"), "bytes")
