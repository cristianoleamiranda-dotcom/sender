#!/usr/bin/env python3
"""
Optimiza los assets fotográficos REALES de Sender para entrega responsive.

No genera ni inventa imágenes: deriva variantes de ancho desde los originales
que ya existen en el repositorio (src/assets/*.jpg y el frame real del hero).

Salida:
  src/assets/gen/<nombre>-<ancho>.webp
  public/assets/hero-poster-<ancho>.webp   (poster del video, derivado del frame 1 real)

Uso:  python3 scripts/optimize-assets.py
"""
from __future__ import annotations

import os
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src", "assets")
OUT = os.path.join(SRC, "gen")
PUBLIC = os.path.join(ROOT, "public", "assets")

BREAKPOINTS = (640, 960, 1280, 1920)
WEBP_QUALITY = 74
POSTER_QUALITY = 62

# Imágenes que se usan en la interfaz. `diagrama-*.png` es documentación interna: se excluye.
TARGETS = [
    "about.jpg",
    "cap-antennas.jpg",
    "cap-broadcast.jpg",
    "cap-critical.jpg",
    "cap-rf.jpg",
    "cap-transmission.jpg",
    "hero-wide.jpg",
    "hero.jpg",
    "proj-am.jpg",
    "proj-stl.jpg",
]

HERO_FRAME = os.path.join(PUBLIC, "sender-hero-frame1.png")


def emit(im: Image.Image, dest: str, quality: int) -> int:
    """Guarda una variante WebP. Nunca agranda el original."""
    im = im.convert("RGB")
    im.save(dest, "WEBP", quality=quality, method=6)
    return os.path.getsize(dest)


def main() -> int:
    os.makedirs(OUT, exist_ok=True)
    total_before = 0
    total_after = 0

    for name in TARGETS:
        path = os.path.join(SRC, name)
        if not os.path.exists(path):
            print(f"  ! falta {name}, se omite")
            continue
        total_before += os.path.getsize(path)
        im = Image.open(path)
        stem = os.path.splitext(name)[0]
        w0 = im.width
        for bp in BREAKPOINTS:
            if bp > w0:
                continue  # no upscaling
            w = bp
            h = round(im.height * (w / w0))
            dest = os.path.join(OUT, f"{stem}-{w}.webp")
            total_after += emit(im.resize((w, h), Image.LANCZOS), dest, WEBP_QUALITY)
        print(f"  ok {stem} (origen {w0}x{im.height})")

    # Poster del hero: mismo frame real, en WebP y en tamaños sensatos.
    if os.path.exists(HERO_FRAME):
        total_before += os.path.getsize(HERO_FRAME)
        im = Image.open(HERO_FRAME)
        for bp in (640, 960, 1280):
            if bp > im.width:
                continue
            w = bp
            h = round(im.height * (w / im.width))
            dest = os.path.join(PUBLIC, f"hero-poster-{w}.webp")
            total_after += emit(im.resize((w, h), Image.LANCZOS), dest, POSTER_QUALITY)
        print(f"  ok hero-poster (origen {im.width}x{im.height})")

    print(
        f"\noriginales: {total_before / 1048576:.2f} MB  ->  "
        f"variantes: {total_after / 1048576:.2f} MB "
        f"({len(os.listdir(OUT))} webp en src/assets/gen)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
