#!/usr/bin/env python3
"""
Genera public/sitemap.xml a partir del catálogo real.

No se mantiene a mano: lee los `slug` de `src/content/catalog.ts`, que es la
misma fuente de la que salen las rutas. Si se añade un producto o una
categoría al catálogo, el sitemap se actualiza al ejecutar el script.

Uso:  python3 scripts/build-sitemap.py
"""
from __future__ import annotations

import datetime
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join(ROOT, "src", "content", "catalog.ts")
OUT = os.path.join(ROOT, "public", "sitemap.xml")

SITE = "https://www.sender.cl"
TODAY = datetime.date.today().isoformat()


def slugs_of(section: str) -> list[str]:
    """Extrae los `slug: "…"` de un bloque `export const <section> … = [`."""
    src = open(CATALOG, encoding="utf-8").read()
    start = src.index(f"export const {section}")
    # El bloque termina en el primer `];` a nivel de columna 0.
    end = src.index("\n];", start)
    block = src[start:end]
    return re.findall(r'slug:\s*"([^"]+)"', block)


def main() -> int:
    categories = slugs_of("categories")
    products = slugs_of("products")

    urls: list[tuple[str, str]] = [("/", "1.0"), ("/productos/", "0.9")]
    urls += [(f"/productos/{slug}/", "0.8") for slug in categories]
    urls += [(f"/producto/{slug}/", "0.7") for slug in products]

    body = "\n".join(
        f"  <url>\n"
        f"    <loc>{SITE}{path}</loc>\n"
        f"    <lastmod>{TODAY}</lastmod>\n"
        f"    <changefreq>monthly</changefreq>\n"
        f"    <priority>{priority}</priority>\n"
        f"  </url>"
        for path, priority in urls
    )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{body}\n"
        "</urlset>\n"
    )

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(xml)

    print(f"{len(urls)} URLs -> public/sitemap.xml "
          f"({len(categories)} categorías, {len(products)} productos)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
