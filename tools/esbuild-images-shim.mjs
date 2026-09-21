/**
 * Shim de esbuild para `src/content/images.ts`.
 *
 * Ese módulo importa los WebP con la sintaxis de Vite
 * (`import x from "@/assets/gen/x-640.webp"`), que fuera del build de Vite no
 * significa nada: esbuild no tiene loader para `.webp`. Los scripts que
 * necesitan leer el catálogo desde Node (exportador a WordPress, generador de
 * rutas de QA) sustituyen el módulo por uno que devuelve las rutas de archivo.
 *
 * El shim respeta la FORMA del módulo real —`{ sm, md, lg, widths }`— porque el
 * catálogo escribe `image: img.projAm.sm`. Si el shim devolviera otra cosa, el
 * catálogo compilaría pero los campos de imagen saldrían `undefined`.
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const CLAVES_IMAGEN = [
  "about",
  "capAntennas",
  "capBroadcast",
  "capCritical",
  "capRf",
  "capTransmission",
  "heroWide",
  "projAm",
  "projStl",
];

const kebab = (k) => k.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/** base -> anchos disponibles, leído del disco. */
export function inventarioWebp(genDir) {
  const porBase = new Map();
  if (!existsSync(genDir)) return porBase;
  for (const f of readdirSync(genDir)) {
    const m = f.match(/^(.+)-(640|960|1280)\.webp$/);
    if (!m) continue;
    if (!porBase.has(m[1])) porBase.set(m[1], []);
    porBase.get(m[1]).push(Number(m[2]));
  }
  for (const vs of porBase.values()) vs.sort((a, b) => a - b);
  return porBase;
}

export function crearPlugin({ root }) {
  const genDir = join(root, "src", "assets", "gen");
  const porBase = inventarioWebp(genDir);

  const shim = CLAVES_IMAGEN.map((k) => {
    const base = kebab(k);
    const vs = porBase.get(base) ?? [];
    const f = (w) => `${base}-${w}.webp`;
    const sm = vs[0] ? f(vs[0]) : "";
    const md = vs[1] ? f(vs[1]) : sm;
    const lg = vs[2] ? f(vs[2]) : undefined;
    return `  ${k}: { sm: ${JSON.stringify(sm)}, md: ${JSON.stringify(md)}, lg: ${JSON.stringify(lg)}, widths: ${JSON.stringify(vs)} },`;
  }).join("\n");

  const plugin = {
    name: "images-shim",
    setup(b) {
      b.onResolve({ filter: /\/images$/ }, (a) => ({ path: a.path, namespace: "images-shim" }));
      b.onLoad({ filter: /.*/, namespace: "images-shim" }, () => ({
        contents:
          `export const img = {\n${shim}\n};\n` +
          `export const heroPoster = { sm: "hero-poster-640.webp", md: "hero-poster-960.webp", lg: "hero-poster-1280.webp" };\n` +
          `export const heroVideo = "sender-hero.mp4";\n` +
          `export function srcSetOf() { return ""; }\n`,
        loader: "js",
      }));
    },
  };
  return plugin;
}
