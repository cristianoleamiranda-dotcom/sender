"""Genera sender-hero.mp4 a partir de los assets reales de SENDER."""
import subprocess, os, shutil

ROOT = "/home/user/sender"
ASSETS = ROOT  # los jpg están en la raíz del proyecto, no en src/assets
OUT = os.path.join(ROOT, "public", "assets", "sender-hero.mp4")
os.makedirs(os.path.dirname(OUT), exist_ok=True)

# Verificar assets
for f in ["hero-wide.jpg", "cap-rf.jpg"]:
    if not os.path.exists(os.path.join(ASSETS, f)):
        print(f"Asset faltante: {f}")
        raise SystemExit(1)

# Usar imageio-ffmpeg si está disponible, sino instalar
try:
    import imageio_ffmpeg
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
except ImportError:
    subprocess.check_call(["pip3", "install", "--break-system-packages", "imageio", "imageio-ffmpeg"])
    import imageio_ffmpeg
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

hero_wide = os.path.join(ASSETS, "hero-wide.jpg")
cap_rf = os.path.join(ASSETS, "cap-rf.jpg")

# Crear video con zoom slow-in desde hero-wide, crossfade a cap-rf, slow zoom out
# Duración: 12 segundos, 30fps = 360 frames

script = f'''
import numpy as np
from PIL import Image
import imageio

W, H = 1920, 1080
FPS = 30
DUR = 12
N = FPS * DUR

hero = np.array(Image.open("{hero_wide}").convert("RGB").resize((W, H)))
rf = np.array(Image.open("{cap_rf}").convert("RGB").resize((W, H)))

def zoom(img, scale):
    h, w = img.shape[:2]
    new_w = int(w / scale)
    new_h = int(h / scale)
    x = (w - new_w) // 2
    y = (h - new_h) // 2
    return img[y:y+new_h, x:x+new_w]

frames = []
for i in range(N):
    t = i / N
    if t < 0.5:
        s = 1.0 + t * 0.15
        f = zoom(hero, s)
        if f.shape[0] < H:
            pad = (H - f.shape[0]) // 2
            f = np.pad(f, ((pad, pad), (0, 0), (0, 0)), mode="edge")
        if f.shape[1] < W:
            pad = (W - f.shape[1]) // 2
            f = np.pad(f, ((0, 0), (pad, pad), (0, 0)), mode="edge")
        f = f[:H, :W]
        frames.append(f)
    elif t < 0.7:
        progress = (t - 0.5) / 0.2
        ease = progress * progress * (3 - 2 * progress)
        fs = 1.075 + progress * 0.05
        hz = zoom(hero, fs)
        rfz = zoom(rf, fs)
        if hz.shape[0] < H:
            pad = (H - hz.shape[0]) // 2
            hz = np.pad(hz, ((pad, pad), (0, 0), (0, 0)), mode="edge")
            rfz = np.pad(rfz, ((pad, pad), (0, 0), (0, 0)), mode="edge")
        hz = hz[:H, :W]
        rfz = rfz[:H, :W]
        blended = hz * (1 - ease) + rfz * ease
        frames.append(blended.astype(np.uint8))
    else:
        s = 1.125 + (t - 0.7) * 0.12
        f = zoom(rf, s)
        if f.shape[0] < H:
            pad = (H - f.shape[0]) // 2
            f = np.pad(f, ((pad, pad), (0, 0), (0, 0)), mode="edge")
        if f.shape[1] < W:
            pad = (W - f.shape[1]) // 2
            f = np.pad(f, ((0, 0), (pad, pad), (0, 0)), mode="edge")
        f = f[:H, :W]
        frames.append(f.astype(np.uint8))

imageio.mimwrite("{OUT}", frames, fps=FPS, codec="libx264", quality=8)
print("OK: " + "{OUT}")
'''

proc = subprocess.run(["python3", "-c", script], capture_output=True, text=True, cwd=ROOT)
print(proc.stdout)
if proc.stderr:
    print("STDERR:", proc.stderr[:500])
if proc.returncode != 0:
    raise SystemExit(proc.returncode)

print(f"Video generado: {OUT}")
print(f"Peso: {os.path.getsize(OUT) / 1024 / 1024:.1f} MB")
