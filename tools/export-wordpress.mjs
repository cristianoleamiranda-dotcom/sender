/**
 * EXPORTACIÓN A WORDPRESS
 *
 * Convierte el sistema de contenido del sitio (src/content/) en archivos que
 * WordPress puede consumir sin tocar el código del front:
 *
 *   wordpress-export/contenido/catalogo.json        árbol bilingüe completo
 *   wordpress-export/contenido/productos-woocommerce.csv   importador nativo
 *   wordpress-export/contenido/categorias-woocommerce.csv
 *   wordpress-export/seo/jsonld-*.json              datos estructurados por ruta
 *   wordpress-export/seo/sitemap.xml
 *   wordpress-export/medios/manifest.json           mapa imagen -> variantes
 *   wordpress-export/medios/webp/ y medios/jpg/
 *
 * Por qué un script y no un volcado manual: el catálogo vive en TypeScript con
 * textos `{ es, en }` entrelazados. Copiarlo a mano garantiza que se pierda una
 * variante o se mezcle un idioma. Aquí se compila el módulo real con esbuild y
 * se serializa, así que la exportación no puede divergir del sitio.
 *
 * Uso:
 *   npm run export:wordpress
 *   npm run export:wordpress -- --sitio=https://www.sender.cl
 */
import { build } from "esbuild";
import { createRequire } from "node:module";
import { mkdirSync, rmSync, writeFileSync, copyFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { statSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "wordpress-export");
const require = createRequire(import.meta.url);

/* ImagenMagick está disponible como `convert` (ver README de la exportación). */
const CONVERT = process.env.CONVERT_BIN ?? "convert";

const args = process.argv.slice(2);
const flag = (nombre, def) => {
  const hit = args.find((a) => a.startsWith(`--${nombre}=`));
  return hit ? hit.slice(nombre.length + 3) : def;
};
const SITIO = flag("sitio", "https://www.sender.cl").replace(/\/+$/, "");

/* ------------------------------------------------------------------ */
/* 1. Compilar el catálogo real con esbuild                            */
/* ------------------------------------------------------------------ */

/**
 * `src/content/images.ts` importa los WebP vía Vite, que fuera del build no
 * existe. Se sustituye por un módulo que devuelve las RUTAS de archivo, que es
 * lo que WordPress necesita, y las dimensiones se leen del disco.
 */
const clavesImagen = [
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
const genDir = join(root, "src", "assets", "gen");
const srcDir = join(root, "src", "assets");

/**
 * El shim tiene que devolver EXACTAMENTE la forma del `images.ts` real
 * (`{ sm, md, lg, widths }`), porque el catálogo escribe `image: img.projAm.sm`.
 * Las rutas son relativas a `medios/webp/`, que es donde se copian los archivos.
 */
function variantesDe(base) {
  return [640, 960, 1280].filter((w) => existsSync(join(genDir, `${base}-${w}.webp`)));
}
const shim = clavesImagen
  .map((k) => {
    const base = kebab(k);
    const vs = variantesDe(base);
    const f = (w) => `${base}-${w}.webp`;
    return `  ${k}: { sm: ${JSON.stringify(f(vs[0]))}, md: ${JSON.stringify(f(vs[1] ?? vs[0]))}, lg: ${JSON.stringify(vs[2] ? f(vs[2]) : undefined)}, widths: ${JSON.stringify(vs)} },`;
  })
  .join("\n");

const imagesPlugin = {
  name: "images-shim",
  setup(b) {
    b.onResolve({ filter: /\/images$/ }, (a) => ({ path: a.path, namespace: "images-shim" }));
    b.onLoad({ filter: /.*/, namespace: "images-shim" }, () => ({
      contents: `export const img = {\n${shim}\n};\nexport const heroPoster = { base: "hero-poster", dir: "public/assets" };\nexport const heroVideo = "public/assets/sender-hero.mp4";\nexport function srcSetOf() { return ""; }\n`,
      loader: "js",
    }));
  },
};

const tmp = join(root, ".wp-export");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
const entry = join(tmp, "entry.mjs");
writeFileSync(
  entry,
  `export { categories, products } from "${join(root, "src/content/catalog.ts")}";
export { siteContent } from "${join(root, "src/content/site.ts")}";
export { company, specializations } from "${join(root, "src/content/company.ts")}";
export { resolve } from "${join(root, "src/content/resolve.ts")}";
`,
);

const bundle = join(tmp, "bundle.mjs");
await build({
  entryPoints: [entry],
  outfile: bundle,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  plugins: [imagesPlugin],
  absWorkingDir: root,
  logLevel: "silent",
});

const data = await import(bundle);
const { categories, products, company, specializations, resolve } = data;

/* ------------------------------------------------------------------ */
/* 2. Medios: WebP tal cual + JPG para editores que no los aceptan      */
/* ------------------------------------------------------------------ */

for (const d of ["contenido", "seo", "medios/webp", "medios/jpg", "build-spa"]) {
  rmSync(join(OUT, d), { recursive: true, force: true });
  mkdirSync(join(OUT, d), { recursive: true });
}

/** base -> { archivoOriginal, variantes } leído del disco. */
const porBase = new Map();
for (const f of readdirSync(genDir)) {
  const m = f.match(/^(.+)-(640|960|1280)\.webp$/);
  if (!m) continue;
  const [, base, w] = m;
  if (!porBase.has(base)) porBase.set(base, []);
  porBase.get(base).push(Number(w));
}
for (const [base, vs] of porBase) vs.sort((a, b) => a - b);

const manifest = { generado: new Date().toISOString(), origen: "src/assets + public/assets", imagenes: [] };
const jpgGenerados = [];
const usosPorBase = new Map();

const tam = (f) => (existsSync(f) ? statSync(f).size : 0);

function dimensiones(ruta) {
  const out = spawnSync(CONVERT, [ruta, "-format", "%w %h", "info:"], { encoding: "utf8" });
  if (out.status === 0) {
    const [w, h] = out.stdout.trim().split(" ").map(Number);
    if (w) return { width: w, height: h };
  }
  return { width: null, height: null };
}

/** Registra una imagen por su base y la asocia a quien la usa. */
function usar(clave, rutaRelativa, uso) {
  const archivo = typeof rutaRelativa === "string" ? rutaRelativa : "";
  const base = archivo.replace(/-(640|960|1280)\.webp$/, "");
  if (!base) return;
  if (!usosPorBase.has(base)) usosPorBase.set(base, []);
  usosPorBase.get(base).push({ clave, uso });
}


for (const cat of categories) usar(`categoria:${cat.slug}`, cat.image, `Categoría ${resolve(cat.name, "es")}`);
for (const p of products) usar(`producto:${p.slug}`, p.image, `Producto ${resolve(p.name, "es")}`);

for (const [base, usos] of usosPorBase) {
  const variantes = (porBase.get(base) ?? []).map((w) => `${base}-${w}.webp`);
  if (!variantes.length) continue;
  const entrada = { base, usos, webp: [], jpg: null, original: null };
  for (const v of variantes) {
    const src = join(genDir, v);
    copyFileSync(src, join(OUT, "medios/webp", v));
    const dim = dimensiones(src);
    entrada.webp.push({ archivo: `medios/webp/${v}`, ancho: Number(v.match(/-(\d+)\.webp$/)[1]), ...dim, bytes: tam(src) });
  }
  const original = [`${base}.jpg`, `${base}.png`].find((f) => existsSync(join(srcDir, f))) ?? null;
  if (original) entrada.original = { archivo: `src/assets/${original}`, bytes: tam(join(srcDir, original)) };
  // JPG a la variante mayor, para la biblioteca de medios de WordPress.
  const mayor = variantes[variantes.length - 1];
  const destino = `${base}.jpg`;
  const out = spawnSync(CONVERT, [join(genDir, mayor), "-quality", "86", join(OUT, "medios/jpg", destino)], { encoding: "utf8" });
  if (out.status === 0 && existsSync(join(OUT, "medios/jpg", destino))) {
    entrada.jpg = { archivo: `medios/jpg/${destino}`, ...dimensiones(join(OUT, "medios/jpg", destino)), bytes: tam(join(OUT, "medios/jpg", destino)) };
    jpgGenerados.push(destino);
  }
  manifest.imagenes.push(entrada);
}

// Hero: póster derivado del frame 1 real + vídeo.
const heroPublic = join(root, "public", "assets");
for (const f of readdirSync(heroPublic)) {
  if (/^hero-poster-\d+\.webp$/.test(f)) copyFileSync(join(heroPublic, f), join(OUT, "medios/webp", f));
}
if (existsSync(join(heroPublic, "sender-hero.mp4"))) {
  copyFileSync(join(heroPublic, "sender-hero.mp4"), join(OUT, "medios", "sender-hero.mp4"));
}
manifest.hero = {
  video: existsSync(join(heroPublic, "sender-hero.mp4")) ? { archivo: "medios/sender-hero.mp4", bytes: tam(join(heroPublic, "sender-hero.mp4")) } : null,
  posters: readdirSync(heroPublic).filter((f) => /^hero-poster-\d+\.webp$/.test(f)).map((f) => ({ archivo: `medios/webp/${f}`, bytes: tam(join(heroPublic, f)) })),
};
writeFileSync(join(OUT, "medios/manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

/* ------------------------------------------------------------------ */
/* 3. HTML reutilizable (specs, features, aplicaciones)                */
/* ------------------------------------------------------------------ */

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function cuerpoProducto(p, lang) {
  const r = (x) => resolve(x, lang);
  const partes = [`<p>${esc(r(p.summary))}</p>`];
  for (const g of p.specs ?? []) {
    partes.push(`<h3>${esc(r(g.title))}</h3>`, "<table>", "<tbody>");
    for (const row of g.rows ?? []) {
      partes.push(`<tr><th scope="row">${esc(r(row.k))}</th><td>${esc(r(row.v))}</td></tr>`);
    }
    partes.push("</tbody>", "</table>");
  }
  if (p.features?.length) {
    partes.push("<h3>Características</h3>", "<ul>");
    for (const f of p.features) partes.push(`<li>${esc(r(f))}</li>`);
    partes.push("</ul>");
  }
  if (p.applications?.length) {
    partes.push("<h3>Aplicaciones</h3>", "<ul>");
    for (const a of p.applications) partes.push(`<li>${esc(r(a))}</li>`);
    partes.push("</ul>");
  }
  if (p.variants?.length) {
    partes.push("<h3>Modelos</h3>", "<table>", "<thead><tr><th>Modelo</th><th>Potencia</th><th>Detalle</th></tr></thead>", "<tbody>");
    for (const v of p.variants) {
      partes.push(`<tr><td>${esc(r(v.model))}</td><td>${esc(r(v.power))}</td><td>${esc(r(v.detail))}</td></tr>`);
    }
    partes.push("</tbody>", "</table>");
  }
  if (p.sourceUrl) {
    partes.push(`<p><small>Fuente verificada: <a href="${esc(p.sourceUrl)}" rel="nofollow">${esc(p.sourceUrl)}</a></small></p>`);
  }
  return partes.join("\n");
}

/* ------------------------------------------------------------------ */
/* 4. CSV compatible con el importador de WooCommerce                  */
/* ------------------------------------------------------------------ */

const columnas = [
  "ID", "Type", "SKU", "Name", "Published", "Is featured?", "Visibility in catalog",
  "Short description", "Description", "Date sale price starts", "Date sale price ends",
  "Tax status", "Tax class", "In stock?", "Stock", "Low stock amount", "Backorders allowed?",
  "Sold individually?", "Weight (kg)", "Length (cm)", "Width (cm)", "Height (cm)",
  "Allow customer reviews?", "Purchase note", "Sale price", "Regular price", "Categories",
  "Tags", "Shipping class", "Images", "Download limit", "Download expiry", "Parent",
  "Grouped products", "Upsells", "Cross-sells", "External URL", "Button text", "Position",
];

function csv(filas) {
  const celda = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columnas.map(celda).join(","), ...filas.map((f) => columnas.map((c) => celda(f[c])).join(","))].join("\n") + "\n";
}

const nombreCat = new Map(categories.map((c) => [c.id, resolve(c.name, "es")]));
const filaCat = [];
for (const c of categories) {
  filaCat.push({
    ID: 0, Type: "product_cat", SKU: "", Name: resolve(c.name, "es"), Published: 1,
    "Visibility in catalog": "visible", "Short description": "", Description: resolve(c.description, "es"),
    Categories: `productos > ${resolve(c.name, "es")}`, Position: Number(c.index?.es ?? 0) || 0,
  });
}

const filas = [];
for (const p of products) {
  const img = manifest.imagenes.find((i) => i.usos.some((u) => u.clave === `producto:${p.slug}`));
  const urlImg = img?.jpg ? `${SITIO}/wp-content/uploads/${basename(img.jpg.archivo)}` : "";
  filas.push({
    ID: 0,
    Type: "product",
    SKU: `SENDER-${p.slug.toUpperCase()}`,
    Name: resolve(p.name, "es"),
    Published: 1,
    "Is featured?": 0,
    "Visibility in catalog": "visible",
    "Short description": resolve(p.summary, "es").slice(0, 300),
    Description: cuerpoProducto(p, "es"),
    "Tax status": "taxable",
    "In stock?": 1,
    "Allow customer reviews?": 1,
    Categories: `productos > ${nombreCat.get(p.categoryId) ?? "Otros"}`,
    Tags: (specializations ?? []).slice(0, 4).map((s) => resolve(s, "es")).join(", "),
    Images: urlImg,
    Position: Number(String(p.index?.es ?? "0").replace(/\D/g, "")) || 0,
  });
}

writeFileSync(join(OUT, "contenido/productos-woocommerce.csv"), "\uFEFF" + csv(filas));
writeFileSync(join(OUT, "contenido/categorias-woocommerce.csv"), "\uFEFF" + csv(filaCat));

/* ------------------------------------------------------------------ */
/* 5. JSON bilingüe completo                                           */
/* ------------------------------------------------------------------ */

const contenido = {
  _meta: {
    generado: new Date().toISOString(),
    origen: "src/content/ (sender)",
    sitio: SITIO,
    idiomas: ["es", "en"],
    nota: "Los textos viven como { es, en }. `resolve(arbol, lang)` los colapsa a un idioma. Ningún dato fue inventado: lo que no está documentado en sender.cl no aparece.",
  },
  empresa: { company, specializations },
  categorias: categories,
  productos: products,
  resuelto: {
    es: { categorias: resolve(categories, "es"), productos: resolve(products, "es") },
    en: { categorias: resolve(categories, "en"), productos: resolve(products, "en") },
  },
};
writeFileSync(join(OUT, "contenido/catalogo.json"), JSON.stringify(contenido, null, 2) + "\n");

/* ------------------------------------------------------------------ */
/* 6. SEO: JSON-LD y sitemap                                           */
/* ------------------------------------------------------------------ */

const org = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name ?? "SENDER",
  url: SITIO,
  email: company.email,
  telephone: company.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address?.street,
    addressLocality: company.address?.city,
    addressRegion: company.address?.region,
    addressCountry: "CL",
  },
};
writeFileSync(join(OUT, "seo/jsonld-organization.json"), JSON.stringify(org, null, 2) + "\n");

const jsonldProductos = products.map((p) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: resolve(p.name, "es"),
  description: resolve(p.summary, "es"),
  sku: `SENDER-${p.slug.toUpperCase()}`,
  category: nombreCat.get(p.categoryId),
  brand: { "@type": "Brand", name: "SENDER" },
  url: `${SITIO}/producto/${p.slug}/`,
}));
writeFileSync(join(OUT, "seo/jsonld-products.json"), JSON.stringify(jsonldProductos, null, 2) + "\n");

const urls = [
  { loc: `${SITIO}/`, priority: "1.0" },
  { loc: `${SITIO}/productos/`, priority: "0.9" },
  ...categories.map((c) => ({ loc: `${SITIO}/productos/${c.slug}/`, priority: "0.8" })),
  ...products.map((p) => ({ loc: `${SITIO}/producto/${p.slug}/`, priority: "0.7" })),
];
const hoy = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(OUT, "seo/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${hoy}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n") +
    `\n</urlset>\n`,
);

/* ------------------------------------------------------------------ */
/* 7. Informe de la exportación                                        */
/* ------------------------------------------------------------------ */

const informe = [
  "# Exportación a WordPress",
  "",
  `Generado: ${new Date().toISOString()}`,
  `Sitio destino declarado: ${SITIO}`,
  "",
  "| Archivo | Contenido |",
  "| --- | --- |",
  `| \`contenido/catalogo.json\` | ${categories.length} categorías y ${products.length} productos, árbol bilingüe + versión resuelta es/en |`,
  `| \`contenido/productos-woocommerce.csv\` | ${filas.length} filas, esquema del importador nativo de WooCommerce |`,
  `| \`contenido/categorias-woocommerce.csv\` | ${filaCat.length} filas |`,
  `| \`seo/jsonld-organization.json\` | Organization con los datos de contacto verificados |`,
  `| \`seo/jsonld-products.json\` | ${jsonldProductos.length} fichas Product |`,
  `| \`seo/sitemap.xml\` | ${urls.length} URLs |`,
  `| \`medios/manifest.json\` | mapa clave -> variantes con dimensiones y peso reales |`,
  `| \`medios/webp/\` | ${manifest.imagenes.reduce((n, i) => n + i.webp.length, 0)} WebP tal como se sirven en el sitio |`,
  `| \`medios/jpg/\` | ${jpgGenerados.length} JPG (Q86) para la biblioteca de medios |`,
  "",
  "Ver `LEEME.md` para las tres rutas de instalación.",
].join("\n");
writeFileSync(join(OUT, "INFORME.md"), informe + "\n");

rmSync(tmp, { recursive: true, force: true });

console.log(`✓ ${products.length} productos, ${categories.length} categorías`);
console.log(`✓ ${jpgGenerados.length} JPG generados con ${CONVERT}`);
console.log(`✓ salida en ${OUT}`);
