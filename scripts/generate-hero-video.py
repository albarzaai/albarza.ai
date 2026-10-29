#!/usr/bin/env python3
"""Generate the Abu Dhabi hero loop. Tries Atlas Cloud Seedance 2.0 Mini (ATLASCLOUD_API_KEY), then Gemini Omni (GEMINI_API_KEY). Needs ffmpeg."""
import base64, json, os, subprocess, sys, time, urllib.request, urllib.error

KEY = os.environ.get("GEMINI_API_KEY", "")
ATLAS = os.environ.get("ATLASCLOUD_API_KEY", "")
BASE = "https://generativelanguage.googleapis.com/v1beta"
MODELS = ["gemini-omni-1.1-flash", "gemini-omni-flash-preview"]
PROMPT = (
    "Cinematic slow aerial drone shot of Abu Dhabi at golden hour: the white marble domes and minarets of Sheikh Zayed Grand Mosque "
    "reflecting in still water, then gliding along the Corniche skyline with glass towers glowing in warm gold and cream light. "
    "Smooth, steady camera motion, soft haze, elegant and luxurious mood, photorealistic, no text, no logos, no people in close-up."
)


errors = []


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


def atlas_video():
    """Seedance 2.0 Mini text-to-video on Atlas Cloud. Returns mp4 bytes or None."""
    if not ATLAS:
        errors.append("atlas: ATLASCLOUD_API_KEY secret is not set")
        return None
    import requests  # Atlas documents the `requests` client; it identifies itself honestly.
    h = {"Authorization": f"Bearer {ATLAS}", "Content-Type": "application/json"}

    def a(method, url, body=None):
        r = requests.request(method, url, headers=h, json=body, timeout=120)
        try:
            return r.status_code, r.json()
        except ValueError:
            return r.status_code, {"error": r.text[:300]}

    # Ask for 1080p first; fall back to 720p if the model does not offer it.
    for res in ("1080p", "720p"):
        code, d = a("POST", "https://api.atlascloud.ai/api/v1/model/generateVideo", {
            "model": "bytedance/seedance-2.0-mini/text-to-video", "prompt": PROMPT, "duration": 10, "resolution": res,
            "ratio": "16:9", "generate_audio": False, "watermark": False})
        print("atlas submit", res, code)
        if code == 200 and "data" in d:
            break
        errors.append(f"atlas {res}: {code} {json.dumps(d)[:300]}")
    else:
        return None
    pid = d["data"]["id"]
    for _ in range(90):
        time.sleep(5)
        code, d = a("GET", f"https://api.atlascloud.ai/api/v1/model/prediction/{pid}")
        st = d.get("data", {}).get("status")
        if st in ("completed", "succeeded"):
            url = d["data"]["outputs"][0]
            subprocess.run(["curl", "-sSL", "-o", "/tmp/atlas.mp4", url], check=True)
            return open("/tmp/atlas.mp4", "rb").read()
        if st == "failed":
            errors.append("atlas: generation failed " + str(d["data"].get("error"))[:200])
            return None
    errors.append("atlas: timed out")
    return None


data = atlas_video()
for m in (MODELS if (not data and KEY) else []):
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
# Muted loop in three sizes (desktop HD, laptop, phone) plus a full-size poster frame (the first frame, so the swap is seamless).
def enc(out, width, crf, maxrate):
    subprocess.run(["ffmpeg", "-y", "-i", "/tmp/raw.mp4", "-an", "-vf", f"scale='min({width},iw)':-2:flags=lanczos,fps=24", "-c:v", "libx264", "-crf", str(crf),
                    "-preset", "slow", "-maxrate", maxrate, "-bufsize", "2M", "-profile:v", "high", "-movflags", "+faststart", "-pix_fmt", "yuv420p", out], check=True)
enc("public/media/hero-abudhabi-hd.mp4", 1920, 23, "3M")
enc("public/media/hero-abudhabi.mp4", 1280, 24, "1.6M")
enc("public/media/hero-abudhabi-sm.mp4", 720, 26, "0.8M")
subprocess.run(["ffmpeg", "-y", "-i", "/tmp/raw.mp4", "-frames:v", "1", "-vf", "scale='min(1920,iw)':-2:flags=lanczos", "-q:v", "3", "public/media/hero-abudhabi.jpg"], check=True)
for f in ("hd", "", "sm"):
    n = "public/media/hero-abudhabi" + ("-" + f if f else "") + ".mp4"
    print(n, os.path.getsize(n), "bytes")
