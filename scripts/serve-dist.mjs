#!/usr/bin/env node
/**
 * Servidor estático de `dist/` que se comporta como el hosting real.
 *
 * `vite preview` resuelve cualquier ruta desconocida a `dist/index.html`, así
 * que no sirve para comprobar el prerender: `/productos` devolvería siempre la
 * home. Este servidor hace lo que hace nginx o cualquier hosting con índices de
 * directorio:
 *
 *   /productos  ->  dist/productos/index.html   (HTML prerrenderizado de la ruta)
 *   /ruta/rara  ->  dist/index.html             (fallback SPA)
 *
 * Uso: node scripts/serve-dist.mjs   (puerto 4173, o PORT=... )
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const PORT = Number(process.env.PORT ?? 4173);
const HOST = process.env.HOST ?? "0.0.0.0";

/**
 * Prefijo con el que se compilo `dist/`.
 *
 * En GitHub Pages el sitio vive bajo `/sender/`, asi que las URL que llegan
 * traen ese prefijo y hay que recortarlo antes de buscar el archivo en disco.
 * Sin esto `/sender/assets/x.js` no existe, el fallback SPA responde con HTML y
 * el navegador se queda sin modulos.
 */
const BASE = (() => {
  const raw = process.env.VITE_BASE_PATH ?? "/";
  return raw.endsWith("/") ? raw : `${raw}/`;
})();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

if (!existsSync(dist)) {
  console.error("dist/ no existe. Ejecuta primero: npm run build");
  process.exit(1);
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
  let path = decodeURIComponent(url.pathname);
  if (BASE !== "/") {
    const prefijo = BASE.slice(0, -1); // "/sender/" -> "/sender"
    if (path === prefijo) path = "/";
    else if (path.startsWith(prefijo + "/")) path = path.slice(prefijo.length);
  }

  const candidatos = path.endsWith("/")
    ? [join(dist, path, "index.html")]
    : [join(dist, path), join(dist, path, "index.html")];

  for (const file of candidatos) {
    // existsSync vale también para directorios: sin el statSync, `/productos`
    // intentaba leer `dist/productos` como archivo y tumbaba el servidor.
    if (!existsSync(file) || !statSync(file).isFile()) continue;
    const ext = extname(file);
    if (ext && ext !== ".html") {
      try {
        const body = await readFile(file);
        res.writeHead(200, { "content-type": MIME[ext] ?? "application/octet-stream" });
        res.end(body);
        return;
      } catch {
        continue;
      }
    }
    if (!ext || ext === ".html") {
      const body = await readFile(file, "utf8");
      res.writeHead(200, { "content-type": MIME[".html"] });
      res.end(body);
      return;
    }
  }

  // Fallback SPA: rutas profundas que no tienen HTML prerrenderizado.
  const body = await readFile(join(dist, "index.html"), "utf8");
  res.writeHead(200, { "content-type": MIME[".html"] });
  res.end(body);
}).listen(PORT, HOST, () => {
  const raiz = BASE === "/" ? "" : BASE.slice(0, -1);
  console.log(`dist/ en http://127.0.0.1:${PORT}${raiz} (base ${BASE}, índices de directorio + fallback SPA)`);
});
