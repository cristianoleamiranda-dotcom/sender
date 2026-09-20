#!/usr/bin/env node
/**
 * Sustituye el marcador __BASE_PATH__ en los HTML de `dist/`.
 *
 * Por qué existe: Vite reemplaza sus propias variables dentro de los módulos
 * JS (`import.meta.env.BASE_URL`), pero NO reescribe el contenido de los
 * archivos copiados desde `public/`. `public/404.html` y el script de
 * precarga del `index.html` necesitan conocer el base real para construir
 * rutas correctas en los dos destinos:
 *
 *   dominio propio   -> "/"
 *   GitHub Pages     -> "/sender/"
 *
 * Se ejecuta al final de `npm run build`.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const base = (() => {
  const raw = process.env.VITE_BASE_PATH ?? "/";
  return raw.endsWith("/") ? raw : `${raw}/`;
})();

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

let touched = 0;
for (const file of htmlFiles(dist)) {
  const source = readFileSync(file, "utf8");
  if (!source.includes("__BASE_PATH__")) continue;
  writeFileSync(file, source.replaceAll("__BASE_PATH__", base));
  touched += 1;
}

console.log(`base "${base}" aplicado en ${touched} archivo(s) HTML de dist/`);
