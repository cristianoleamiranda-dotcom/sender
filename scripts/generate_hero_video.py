"""
Genera sender-hero.mp4 usando los assets reales de SENDER:
  - hero-wide.jpg  → plano hero principal
  - cap-rf.jpg     → plano RF/engineering de apoyo

Efecto cinemático: slow zoom-in + subtle pan con crossfade entre planos.
Duración objetivo: ~12 segundos (armonico con el transporte de scroll).
"""
import os
import numpy as np
from PIL import Image
import imageio
import imageio_ffmpeg

FFMPEG_BIN = imageio_ffmpeg.get_ffmpeg_exe()

ROOT = "/home/user/sender"
OUT_PATH = os.path.join(ROOT, "public", "assets", "sender-hero.mp4")
os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)

# Cargar planos
img_hero = Image.open(os.path.join(ROOT, "hero-wide.jpg")).convert("RGB")
img_rf   = Image.open(os.path.join(ROOT, "cap-rf.jpg")).convert("RGB")

W, H = 1920, 1080  # resolution hero
FPS = 30
DURATION_SEC = 12
TOTAL_FRAMES = FPS * DURATION_SEC

def resize_cover(img, target_w, target_h):
    iw, ih = img.size
    scale = max(target_w / iw, target_h / ih)
    new_w = int(iw * scale)
    new_h = int(ih * scale)
    img_rs = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    return img_rs.crop((left, top, left + target_w, top + target_h))

hero_frame = resize_cover(img_hero, W, H)
rf_frame   = resize_cover(img_rf, W, H)

def lerp_color(c1, c2, t):
    return tuple(int(round(a + (b - a) * t)) for a, b in zip(c1, c2))

def apply_vignette(arr, strength=0.35):
    h, w, _ = arr.shape
    y, x = np.ogrid[:h, :w]
    cx, cy = w / 2, h / 2
    dist = np.sqrt(((x - cx) / (w / 2)) ** 2 + ((y - cy) / (h / 2)) ** 2)
    mask = np.clip(1 - dist * strength, 0, 1)
    return (arr * mask[:, :, None]).astype(np.uint8)

def frame_at(f, total):
    t = f / total  # 0..1
    # Fase 1: hero-wide (0..0.55) con slow zoom
    # Fase 2: crossfade a cap-rf (0.55..0.75)
    # Fase 3: cap-rf con slow zoom (0.75..1)
    if t < 0.55:
        frac = t / 0.55
        scale = 1.0 + frac * 0.12  # zoom 1.0 → 1.12
        crop = resize_cover(hero_frame, int(W / scale), int(H / scale))
        # center crop back to WxH
        left = (crop.width - W) // 2
        top = (crop.height - H) // 2
        frame = np.array(crop.crop((left, top, left + W, top + H)), dtype=np.float32)
        return apply_vignette(frame, 0.3)
    elif t < 0.75:
        frac = (t - 0.55) / 0.20
        ease = frac * frac * (3 - 2 * frac)
        scale = 1.0 + frac * 0.06
        hero_c = resize_cover(hero_frame, int(W / scale), int(H / scale))
        rf_c = resize_cover(rf_frame, int(W / scale), int(H / scale))
        left = (hero_c.width - W) // 2
        top = (hero_c.height - H) // 2
        hero_final = np.array(hero_c.crop((left, top, left + W, top + H)), dtype=np.float32)
        left = (rf_c.width - W) // 2
        top = (rf_c.height - H) // 2
        rf_final = np.array(rf_c.crop((left, top, left + W, top + H)), dtype=np.float32)
        blended = hero_final * (1 - ease) + rf_final * ease
        return apply_vignette(blended, 0.3)
    else:
        frac = (t - 0.75) / 0.25
        scale = 1.06 + frac * 0.10
        crop = resize_cover(rf_frame, int(W / scale), int(H / scale))
        left = (crop.width - W) // 2
        top = (crop.height - H) // 2
        frame = np.array(crop.crop((left, top, left + W, top + H)), dtype=np.float32)
        # Slight warm tint en fase final (engineering 느낌)
        frame[:, :, 0] = np.clip(frame[:, :, 0] * 1.03, 0, 255)
        return apply_vignette(frame, 0.3)

print(f"Generando {TOTAL_FRAMES} frames a {W}x{H} @ {FPS}fps → {OUT_PATH}")

with imageio.get_writer(OUT_PATH, fps=FPS, codec="libx264",
                        quality=6, macro_block_size=1,
                        ffmpeg_params=["-pix_fmt", "yuv420p",
                                       "-profile:v", "high",
                                       "-crf", "18",
                                       "-preset", "medium"]) as writer:
    for f in range(TOTAL_FRAMES):
        frame = frame_at(f, TOTAL_FRAMES - 1)
        writer.append_data(frame)
        if f % 60 == 0:
            print(f"  frame {f}/{TOTAL_FRAMES}")

print("HEcho: sender-hero.mp4")
print(f"Tamanio: {os.path.getsize(OUT_PATH) / 1024 / 1024:.2f} MB")
