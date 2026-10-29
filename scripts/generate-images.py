#!/usr/bin/env python3
"""Generate the site's unique images with Atlas Cloud text-to-image (ATLASCLOUD_API_KEY). Writes public/media/g/<slug>.webp."""
import io, json, os, sys, time
from concurrent.futures import ThreadPoolExecutor
import requests
from PIL import Image

KEY = os.environ["ATLASCLOUD_API_KEY"]
BASE = "https://api.atlascloud.ai/api/v1"
H = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}
STYLE = " Photorealistic, cinematic, warm gold and cream color grade, soft natural light, refined luxury mood, no text, no logos, no watermark."
OUT = "public/media/g"
os.makedirs(OUT, exist_ok=True)

# slug -> (prompt, aspect)
S = {
    # Gallery (app + misc), 12 distinct
    "gallery-1": ("A falcon perched on a leather glove at sunrise in the Arabian desert, shallow depth of field.", "1:1"),
    "gallery-2": ("A glowing golden lantern in a narrow old Dubai souq alley, bokeh lights.", "1:1"),
    "gallery-3": ("An Arabian oryx standing on a rippled dune at golden hour.", "1:1"),
    "gallery-4": ("Aerial view of Palm Jumeirah at sunset with turquoise water.", "1:1"),
    "gallery-5": ("A woman in an elegant cream abaya walking through the Louvre Abu Dhabi dome light patterns.", "1:1"),
    "gallery-6": ("A traditional Emirati coffee pot dallah pouring gahwa into a small cup, warm light.", "1:1"),
    "gallery-7": ("Burj Khalifa piercing low clouds at dawn, dreamy pastel sky.", "1:1"),
    "gallery-8": ("Close-up of intricate Islamic geometric gold inlay on white marble.", "1:1"),
    "gallery-9": ("A dhow boat silhouette on calm water at dusk with a glowing orange sky.", "1:1"),
    "gallery-10": ("Desert camp tents with warm string lights under a starry Milky Way sky.", "1:1"),
    "gallery-11": ("A sleek supercar parked on a quiet Dubai street at blue hour with neon reflections.", "1:1"),
    "gallery-12": ("A potter's hands shaping golden clay, soft window light, artisan craft.", "1:1"),
    # 'Built for 4K' carousel (16:9)
    "built-1": ("Wide cinematic shot of a camel caravan crossing sunlit dunes with long shadows, ultra detailed.", "16:9"),
    "built-2": ("Cinematic aerial of Sheikh Zayed Grand Mosque courtyard at golden hour with reflections, ultra detailed.", "16:9"),
    "built-3": ("Cinematic close-up portrait of an Emirati man in a white kandura and ghutra on a rooftop at sunset, ultra detailed.", "16:9"),
    "built-4": ("Dubai Marina skyline at blue hour with yachts and glowing towers, long exposure, ultra detailed.", "16:9"),
    # Pipeline features (≈1.86)
    "pipe-1": ("A film crew style frame: golden-hour desert scene with a drone silhouette and camera rig, cinematic.", "16:9"),
    "pipe-2": ("Four consistent stills of the same character in different cinematic poses collage, same outfit, warm palette.", "16:9"),
    "pipe-3": ("Audio waveform glowing gold over a dark desert horizon, abstract cinematic sound design.", "16:9"),
    "pipe-4": ("Storyboard style multi-shot sequence panels of a desert chase, golden color grade.", "16:9"),
    # Why creators choose (16:9)
    "why-1": ("A creator at a desk editing video on a large monitor with a Dubai skyline window view, warm light.", "16:9"),
    "why-2": ("Cinematic slow-motion splash of water on a white marble fountain in a palace courtyard.", "16:9"),
    "why-3": ("Hot air balloons floating over golden dunes at sunrise.", "16:9"),
    "why-4": ("A tailor's workshop with rolls of cream and gold fabric in warm light, documentary style.", "16:9"),
    "why-5": ("A chef plating a luxurious Arabic dessert with gold leaf, macro shot.", "16:9"),
    "why-6": ("Children flying kites on a beach at sunset in the Gulf, joyful cinematic frame.", "16:9"),
    # Model page grid (4:3)
    "model-1": ("A knight-like falconer on horseback in the desert, epic cinematic fantasy, golden light.", "4:3"),
    "model-2": ("Futuristic Dubai skyline with flying cars at dusk, clean sci-fi, gold and cream palette.", "4:3"),
    "model-3": ("Surreal floating islands of golden dunes in a pastel sky, dreamlike.", "4:3"),
    "model-4": ("Macro of a falcon's eye reflecting a desert sunset.", "4:3"),
    # Backgrounds / banners
    "bg-cta": ("Soft abstract golden desert dunes under a cream sky, minimal, wide panorama, very low contrast.", "16:9"),
    "bg-feature": ("Soft abstract cream and gold marble texture with subtle arches, wide, very low contrast.", "16:9"),
    # Portrait cards (4:5)
    "card-1": ("Portrait of an Emirati woman with a golden headpiece in warm studio light, fashion editorial.", "3:4"),
    "card-2": ("Portrait of an elder with a weathered face and white beard smiling in the desert, documentary.", "3:4"),
    "card-3": ("Portrait of a young creator with headphones against a cream wall, soft light.", "3:4"),
    "card-4": ("Portrait of a falconer's hand and falcon in profile, dramatic warm light.", "3:4"),
    "card-5": ("Portrait of a boy in a traditional white kandura laughing in sunlit courtyard.", "3:4"),
    "card-6": ("Portrait of a calligrapher at work with brush and golden ink, close up.", "3:4"),
    # Home page (Davinci home structure)
    "home-collage-1": ("Low-angle cinematic shot of a young Emirati woman in a flowing cream cape standing on top of a huge golden dune, sun flare, wind-blown sand, wide.", "16:9"),
    "home-collage-2": ("Editorial close-up of a woman wearing gold-rimmed sunglasses reflecting desert dunes, warm light.", "4:3"),
    "home-collage-3": ("Portrait of a laughing man in a white ghutra against a sunlit sandstone wall, warm documentary light.", "4:3"),
    "home-collage-4": ("A woman lying on a cream sand dune in a wide straw hat, aerial view, soft shadows.", "4:3"),
    "home-collage-5": ("Studio portrait of a girl with a delicate golden butterfly headpiece, cream backdrop.", "4:3"),
    "feat-1": ("Expressive high-fidelity portrait of a woman in a blue and gold embroidered abaya against a bright sky, editorial.", "3:4"),
    "feat-2": ("A hand holding a smartphone capturing a golden desert sunset, creative editorial, shallow depth of field.", "3:4"),
    "feat-3": ("A teenager in sneakers kicking a football on a rooftop at golden hour, motion blur, dynamic.", "3:4"),
    "feat-4": ("Extreme macro of a camel's eye with long lashes, razor sharp detail.", "3:4"),
    "feat-5": ("Luxury perfume bottle on white marble with a splash of liquid gold, studio, cinematic.", "3:4"),
    "feat-6": ("A dancer in flowing gold fabric twirling on a dune at sunrise, motion, graceful.", "3:4"),
    "suite-1": ("Editorial fashion shot of a model in a cream suit with gold accessories against a terracotta wall, wide.", "16:9"),
    "suite-2": ("A product photo of an ornate brass lantern on a dark velvet table with dramatic side light, wide.", "16:9"),
    "suite-3": ("Film still of a lone rider on a camel at dusk, silhouette against a huge orange sun, widescreen.", "16:9"),
    "suite-4": ("Film strip frames of a driving shot through desert dunes laid on a dark editing desk, warm light, wide.", "16:9"),
    "suite-5": ("A traditional oud on a velvet cushion in warm candle light, wide, musical mood.", "16:9"),
    "channel-1": ("A model holding a gold perfume bottle in a sunlit studio, social ad style.", "3:4"),
    "channel-2": ("A golden watch emerging from a splash of water, dynamic commercial product shot.", "3:4"),
    "channel-3": ("Macro of a human eye with long lashes and golden eyeshadow, super detailed.", "3:4"),
    "channel-4": ("A small street cafe at dusk with warm lamps and a coffee cup on a table, cozy.", "3:4"),
    "home-cta": ("Wide panorama of a field of wild desert flowers blooming after rain in the UAE, pink and gold, fisheye perspective, dramatic sky.", "16:9"),
}

def find_models():
    try:
        r = requests.get(f"{BASE}/models", headers=H, timeout=60)
        txt = r.text
        print("models endpoint", r.status_code, txt[:300].replace("\n", " "))
        d = r.json()
        items = d.get("data", d) if isinstance(d, dict) else d
        ids = [m.get("model") or m.get("id") or m.get("name") for m in items if isinstance(m, dict)]
        return [i for i in ids if i and "text-to-image" in i]
    except Exception as e:
        print("models list failed", e)
        return []

CANDIDATES = []
found = find_models()
pref = [m for m in found if "seedream" in m] + [m for m in found if "flux" in m] + found
CANDIDATES = pref + ["bytedance/seedream-v4/text-to-image", "bytedance/seedream-v4.5", "seedream-3.0", "black-forest-labs/flux-1.1-pro/text-to-image"]
print("candidates", CANDIDATES[:8])

def one(model, slug, prompt, ratio):
    body = {"model": model, "prompt": prompt + STYLE, "aspect_ratio": ratio}
    r = requests.post(f"{BASE}/model/generateImage", headers=H, json=body, timeout=120)
    if r.status_code != 200:
        body.pop("aspect_ratio")
        r = requests.post(f"{BASE}/model/generateImage", headers=H, json=body, timeout=120)
    if r.status_code != 200:
        return None, f"{r.status_code} {r.text[:200]}"
    pid = r.json()["data"]["id"]
    for _ in range(80):
        time.sleep(3)
        d = requests.get(f"{BASE}/model/prediction/{pid}", headers=H, timeout=60).json().get("data", {})
        if d.get("status") in ("completed", "succeeded"):
            url = d["outputs"][0]
            img = Image.open(io.BytesIO(requests.get(url, timeout=120).content)).convert("RGB")
            w = 1920 if ratio == "16:9" else 1280
            if img.width > w:
                img = img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
            path = f"{OUT}/{slug}.webp"
            img.save(path, "WEBP", quality=82, method=6)
            return path, None
        if d.get("status") == "failed":
            return None, "failed " + str(d.get("error"))[:200]
    return None, "timeout"

# Pick the first model that works on a probe.
model = None
for m in CANDIDATES:
    p, err = one(m, "probe", *S["gallery-1"])
    if p:
        os.remove(p)
    print("probe", m, "->", p or err)
    if p:
        model = m
        break
if not model:
    print("::error title=images::no Atlas image model worked")
    sys.exit(1)

def job(item):
    slug, (prompt, ratio) = item
    if os.path.exists(f"{OUT}/{slug}.webp"):
        return slug, "ok"
    for _ in range(2):
        p, err = one(model, slug, prompt, ratio)
        if p:
            return slug, "ok"
    return slug, err

with ThreadPoolExecutor(6) as ex:
    results = list(ex.map(job, S.items()))
bad = [r for r in results if r[1] != "ok"]
print("done", len(results) - len(bad), "ok;", "failed:", bad)
sys.exit(1 if len(bad) > 6 else 0)
