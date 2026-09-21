/**
 * Genera la lista de rutas del sitio a partir del catálogo real.
 *
 * POR QUÉ EXISTE
 *
 * El arnés de QA tenía las rutas escritas a mano y derivó del router: probaba
 * `/contacto`, que no es una ruta (es un ancla de la home), así que medía el
 * contraste de la página 404 creyendo medir otra cosa; y dejaba fuera 14 de las
 * 16 fichas de producto y la categoría `automatizacion`. Nadie lo notó porque
 * una ruta inexistente no falla: devuelve el comodín y el QA seguía en verde.
 *
 * La lista se genera desde `src/content/catalog.ts` —la misma fuente que usa
 * `scripts/build-sitemap.py`— de modo que QA, sitemap y router no pueden
 * desincronizarse en silencio.
 *
 * Uso (interno de `npm run qa`):
 *   node tools/gen-routes.mjs          ->  qa/routes.generated.json
 */
import { build } from "esbuild";
import { crearPlugin } from "./esbuild-images-shim.mjs";
import { mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = join(root, ".routes-tmp");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

const entry = join(tmp, "entry.mjs");
writeFileSync(
  entry,
  `export { categories, products } from "${join(root, "src/content/catalog.ts")}";\n`,
);

const outfile = join(tmp, "bundle.mjs");
await build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  plugins: [crearPlugin({ root })],
  absWorkingDir: root,
  logLevel: "silent",
});

const { categories, products } = await import(outfile);

const rutas = [
  { path: "/", tipo: "home" },
  { path: "/productos", tipo: "catalogo" },
  ...categories.map((c) => ({ path: `/productos/${c.slug}`, tipo: "categoria", slug: c.slug })),
  ...products.map((p) => ({ path: `/producto/${p.slug}`, tipo: "producto", slug: p.slug })),
  { path: "/soluciones/transmisores-fm", tipo: "compatibilidad", nota: "redirección histórica a /productos/transmisores-fm" },
  { path: "/no-existe", tipo: "404", nota: "comprobación negativa: debe mostrar la página no encontrada" },
];

/* Control cruzado: las rutas generadas deben coincidir con el sitemap. */
const sitemapPath = join(root, "public", "sitemap.xml");
let aviso = null;
if (existsSync(sitemapPath)) {
  const xml = readFileSync(sitemapPath, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") || "/",
  );
  const propias = rutas.filter((r) => r.tipo !== "404" && r.tipo !== "compatibilidad").map((r) => r.path.replace(/\/$/, "") || "/");
  const faltaEnSitemap = propias.filter((p) => !locs.includes(p));
  const sobraEnSitemap = locs.filter((l) => !propias.includes(l));
  if (faltaEnSitemap.length || sobraEnSitemap.length) {
    aviso = { faltaEnSitemap, sobraEnSitemap };
  }
}

writeFileSync(
  join(root, "qa", "routes.generated.json"),
  JSON.stringify(
    {
      _meta: {
        generado: new Date().toISOString(),
        origen: "src/content/catalog.ts vía tools/gen-routes.mjs",
        aviso: "Archivo generado. No editar a mano: se regenera con `npm run qa`.",
        discrepanciaConSitemap: aviso,
      },
      rutas,
    },
    null,
    2,
  ) + "\n",
);

rmSync(tmp, { recursive: true, force: true });

console.log(
  `✓ ${rutas.length} rutas (${categories.length} categorías, ${products.length} productos)` +
    (aviso ? ` — ⚠ discrepancia con sitemap: ${JSON.stringify(aviso)}` : ""),
);
