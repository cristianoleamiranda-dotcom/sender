/**
 * QA automatizado del rediseño de SENDER.
 *
 * Verifica en un Chromium real (no en curl):
 *   - errores de consola y excepciones no capturadas
 *   - peticiones de red fallidas (404 de assets, imágenes rotas)
 *   - jerarquía de encabezados: exactamente un H1 por ruta
 *   - contenido esperado presente en el DOM renderizado
 *   - cambio de idioma ES -> EN sin mezclar idiomas
 *   - rutas profundas del catálogo
 */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";
import { contrastEvaluator } from "./contrast.mjs";

/**
 * Rutas generadas desde `src/content/catalog.ts` por `tools/gen-routes.mjs`.
 *
 * Antes esta lista estaba escrita a mano y derivó del router: se probaba
 * `/contacto` (que es un ancla de la home, no una ruta) y quedaban fuera 14 de
 * las 16 fichas de producto y la categoría `automatizacion`. Una ruta
 * inexistente no falla: la atiende el comodín, así que el QA seguía en verde
 * midiendo la página equivocada sin avisar.
 */
const rutasArchivo = JSON.parse(
  readFileSync(new URL("./routes.generated.json", import.meta.url), "utf8"),
);
const rutasGeneradas = rutasArchivo.rutas;
const rutasValidas = new Set(rutasGeneradas.map((r) => r.path));
const avisoSitemap = rutasArchivo._meta?.discrepanciaConSitemap ?? null;

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const OUT = new URL("./shots", import.meta.url).pathname;

const problems = [];
const notes = [];

/** Colapsa saltos de linea y espacios, y normaliza a minusculas. */
function normalise(text) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function record(route, kind, message) {
  problems.push({ route, kind, message });
}

const browser = await chromium.launch();

async function newPage(route, viewport) {
  const context = await browser.newContext({ viewport, locale: "es-CL" });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") record(route, "console", msg.text().slice(0, 300));
  });
  page.on("pageerror", (err) => record(route, "pageerror", String(err).slice(0, 300)));
  page.on("requestfailed", (req) => {
    // El video del hero puede abortarse legítimamente al navegar.
    if (req.failure()?.errorText?.includes("ERR_ABORTED")) return;
    record(route, "requestfailed", `${req.url()} :: ${req.failure()?.errorText}`);
  });
  page.on("response", (res) => {
    if (res.status() >= 400) record(route, `http-${res.status()}`, res.url());
  });

  return { context, page };
}

async function headings(page) {
  return page.evaluate(() => {
    const out = {};
    for (const level of [1, 2, 3, 4]) {
      out[`h${level}`] = document.querySelectorAll(`h${level}`).length;
    }
    out.h1text = [...document.querySelectorAll("h1")].map((n) => n.textContent.trim());
    return out;
  });
}

/* ------------------------------------------------------------------ */
/* 1 · HOME — escritorio                                               */
/* ------------------------------------------------------------------ */
{
  const route = "/";
  const { context, page } = await newPage(route, { width: 1440, height: 900 });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForSelector("h1", { timeout: 15000 });

  const h = await headings(page);
  notes.push(`HOME headings: ${JSON.stringify({ h1: h.h1, h2: h.h2, h3: h.h3, h4: h.h4 })}`);
  if (h.h1 !== 1) record(route, "seo", `esperado 1 H1, encontrados ${h.h1}: ${h.h1text.join(" | ")}`);

  const body = normalise(await page.locator("body").innerText());
  for (const expectedRaw of [
    "SENDER",
    "Tecnología que transmite",
    "Más de 20 años",
    "La señal",
    "Se experimenta",
    "BROADCASTING",
    "TELECOMUNICACIONES",
    "AUTOMATIZACIÓN",
    "Transmisores AM",
    "Transmisores FM",
    "STL / Enlaces",
    "Procesamiento de Audio",
    "Soluciones Especiales",
    "ESTUDIO",
    "AUDIENCIA",
    "Diseñamos soluciones",
    "EXPERIENCIA",
    "PERSONALIZACIÓN",
    "Radio Colosal",
    "Isla de Pascua",
    "Armada de Chile",
    "¿Qué necesitas transmitir?",
    "Blanco Viel 1108",
    "+56 9 8386 4148",
    "sender@sender.cl",
  ]) {
    const expected = expectedRaw.toLowerCase();
    if (!body.includes(normalise(expectedRaw))) record(route, "contenido", `falta "${expectedRaw}"`);
  }

  // Las secciones deben existir como anclas navegables.
  for (const id of [
    "senal",
    "empresa",
    "soluciones",
    "transmision",
    "ingenieria",
    "productos",
    "automatizacion",
    "proyectos",
    "contacto",
  ]) {
    const found = await page.locator(`#${id}`).count();
    if (found === 0) record(route, "ancla", `falta la sección #${id}`);
  }

  // Datos NO verificados que decidimos retirar: no deben reaparecer.
  for (const forbidden of [
    "Cobertura nacional",
    "Respuesta técnica garantizada",
    "[UBICACIÓN]",
    "[AÑO]",
    "[XX]",
    "Engineering the Signal",
  ]) {
    if (body.includes(forbidden)) record(route, "contenido-no-verificado", `aparece "${forbidden}"`);
  }

  // Imágenes realmente cargadas (no rotas).
  const brokenImages = await page.evaluate(() =>
    [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  );
  if (brokenImages.length) record(route, "imagenes", `rotas: ${brokenImages.join(", ")}`);

  // Lenis activo.
  const lenisActive = await page.evaluate(() => document.documentElement.classList.contains("lenis"));
  notes.push(`HOME lenis activo: ${lenisActive}`);
  if (!lenisActive) record(route, "motion", "Lenis no montó (html no tiene la clase .lenis)");

  // Scroll cinematográfico: el hero debe tener pista de scroll propia.
  const docHeight = await page.evaluate(() => document.body.scrollHeight);
  notes.push(`HOME altura total del documento: ${(docHeight / 1000).toFixed(1)}k px`);

  await page.screenshot({ path: `${OUT}/01-hero-desktop.png` });

  // Scroll hasta soluciones y captura.
  await page.evaluate(() => document.getElementById("soluciones")?.scrollIntoView());
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/02-soluciones-desktop.png` });

  await page.evaluate(() => document.getElementById("automatizacion")?.scrollIntoView());
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/03-automatizacion-desktop.png` });

  await page.evaluate(() => document.getElementById("contacto")?.scrollIntoView());
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/04-contacto-desktop.png` });

  /* ---------------- Cambio de idioma ---------------- */
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: "en", exact: true }).first().click();
  await page.waitForTimeout(900);
  const enBody = normalise(await page.locator("body").innerText());
  for (const expectedRaw of [
    "Technology that transmits",
    "Products",
    "Solutions",
    "Company",
    "Contact",
    "Consult",
    "Documented installations",
  ]) {
    if (!enBody.includes(normalise(expectedRaw))) record(route, "i18n-en", `falta "${expectedRaw}"`);
  }
  // Regla absoluta: sin mezclar idiomas.
  for (const spanishOnly of [
    "Tecnología que transmite",
    "Desliza para explorar",
    "Años de experiencia",
    "¿Qué necesitas transmitir?",
    "Instalaciones documentadas",
    "Productos destacados",
    "Ver producto",
    "Dirección",
  ]) {
    if (enBody.includes(normalise(spanishOnly))) record(route, "i18n-mix", `"${spanishOnly}" sigue en la interfaz EN`);
  }
  notes.push(`HOME html lang tras cambiar: ${await page.evaluate(() => document.documentElement.lang)}`);
  await page.screenshot({ path: `${OUT}/05-hero-en.png` });

  // Volver a ES y comprobar persistencia.
  await page.getByRole("button", { name: "es", exact: true }).first().click();
  await page.waitForTimeout(500);
  const stored = await page.evaluate(() => localStorage.getItem("sender-lang"));
  notes.push(`HOME localStorage sender-lang: ${stored}`);

  await context.close();
}

/* ------------------------------------------------------------------ */
/* 2 · HOME — móvil                                                    */
/* ------------------------------------------------------------------ */
{
  const route = "/ (mobile)";
  const { context, page } = await newPage(route, { width: 390, height: 844 });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForSelector("h1", { timeout: 15000 });

  // En móvil no debe solicitarse el MP4 de 4.8 MB.
  const videoRequested = await page.evaluate(() => {
    const v = document.querySelector("video");
    return v ? v.currentSrc || v.querySelector("source")?.src || "" : "";
  });
  const perf = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .filter((r) => r.name.includes("sender-hero.mp4"))
      .map((r) => ({ name: r.name.split("/").pop(), bytes: r.transferSize })),
  );
  notes.push(`MOBILE video src declarado: ${videoRequested || "(ninguno)"}`);
  notes.push(`MOBILE descargas del MP4: ${JSON.stringify(perf)}`);
  if (perf.length > 0) record(route, "performance", `el MP4 se descargó en móvil: ${JSON.stringify(perf)}`);

  const transferred = await page.evaluate(() =>
    performance.getEntriesByType("resource").reduce((sum, r) => sum + (r.transferSize || 0), 0),
  );
  notes.push(`MOBILE bytes transferidos totales: ${(transferred / 1024).toFixed(0)} kB`);

  // El drawer debe abrir y ser accesible.
  await page.getByRole("button", { name: /Abrir menú/i }).click();
  await page.waitForTimeout(500);
  const drawer = page.locator("#mobile-drawer");
  if ((await drawer.count()) === 0) record(route, "a11y", "el drawer móvil no se abrió");
  else {
    const modal = await drawer.getAttribute("aria-modal");
    if (modal !== "true") record(route, "a11y", "el drawer no declara aria-modal");
  }
  await page.screenshot({ path: `${OUT}/06-mobile-drawer.png` });

  // Escape debe cerrarlo.
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  if ((await page.locator("#mobile-drawer").count()) !== 0)
    record(route, "a11y", "Escape no cierra el drawer móvil");

  await page.evaluate(() => document.getElementById("soluciones")?.scrollIntoView());
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/07-mobile-soluciones.png`, fullPage: false });

  await context.close();
}

/* ------------------------------------------------------------------ */
/* 3 · Rutas de catálogo                                               */
/* ------------------------------------------------------------------ */
const catalogRoutes = [
  {
    path: "/productos",
    expect: ["Soluciones", "Transmisores AM", "Sistema NAVTEX", "Condensadores"],
  },
  {
    path: "/productos/transmisores-am",
    expect: ["Transmisores AM", "Estado sólido", "490 kHz", "Clase D", "Amplificador MF"],
  },
  {
    path: "/productos/transmisores-fm",
    expect: ["Transmisores FM", "87.5 – 108 MHz", "PLL digital"],
  },
  {
    path: "/productos/stl-enlaces",
    expect: ["STAL-200", "AL-100", "134 – 174 MHz", "Yagi"],
  },
  {
    path: "/productos/procesamiento-de-audio",
    expect: ["BIS-AP735", "600", "dBu", "AGC"],
  },
  {
    path: "/productos/rf-y-componentes",
    expect: ["Antena HF", "LMR-400", "Super Flex", "TC4420", "6000 pF", "Contraventadas"],
  },
  {
    path: "/productos/soluciones-especiales",
    expect: ["NAVTEX", "490", "518 kHz"],
  },
  {
    path: "/producto/serie-sender-ss",
    expect: ["SENDER SS", "Estado sólido modular", "50", "PWM", "AM-2500SS", "Trifásica", "±5 Hz", "AM-10000SS"],
  },
  {
    path: "/producto/sistema-navtex-490-518",
    expect: ["NAVTEX", "automatización", "monitoreo", "Seguridad marítima", "518 kHz"],
  },
];

/* Las rutas escritas a mano en catalogRoutes deben existir en el catálogo. */
for (const { path } of catalogRoutes) {
  if (!rutasValidas.has(path)) {
    record(
      path,
      "arnes",
      "ruta del arnés que no existe en el catálogo: se estaría midiendo la página 404",
    );
  }
}
/* Y la lista generada debe coincidir con el sitemap publicado. */
if (avisoSitemap) {
  record("sitemap", "arnes", `rutas y sitemap no coinciden: ${JSON.stringify(avisoSitemap)}`);
}

for (const { path, expect } of catalogRoutes) {
  const { context, page } = await newPage(path, { width: 1440, height: 900 });
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForSelector("h1", { timeout: 15000 }).catch(() =>
    record(path, "seo", "no hay H1"),
  );

  const h = await headings(page);
  if (h.h1 !== 1) record(path, "seo", `esperado 1 H1, encontrados ${h.h1}`);

  const body = normalise(await page.locator("body").innerText());
  for (const token of expect) {
    if (!body.includes(normalise(token))) record(path, "contenido", `falta "${token}"`);
  }

  // Meta y canonical de la ruta.
  const meta = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content ?? "",
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
    ogTitle: document.querySelector('meta[property="og:title"]')?.content ?? "",
    ldCount: document.querySelectorAll('script[type="application/ld+json"]').length,
  }));
  if (!meta.title || meta.title.length < 10) record(path, "seo", `title vacío o corto: "${meta.title}"`);
  if (!meta.description || meta.description.length < 50)
    record(path, "seo", `description demasiado corta (${meta.description.length})`);
  if (meta.description.length > 320)
    record(path, "seo", `description demasiado larga (${meta.description.length})`);
  if (!meta.canonical.startsWith("https://www.sender.cl/"))
    record(path, "seo", `canonical apunta a otro origen: ${meta.canonical}`);
  if (meta.ldCount < 1) record(path, "seo", "sin structured data");
  notes.push(`${path} -> title "${meta.title.slice(0, 60)}…" · ld=${meta.ldCount} · canonical=${meta.canonical}`);

  if (path.startsWith("/producto/")) {
    await page.screenshot({ path: `${OUT}/08-producto-${path.split("/").pop()}.png`, fullPage: false });
  }
  await context.close();
}

/* ------------------------------------------------------------------ */
/* 4 · 404 y compatibilidad de rutas                                   */
/* ------------------------------------------------------------------ */
for (const path of ["/no-existe", "/soluciones/transmisores-fm"]) {
  const { context, page } = await newPage(path, { width: 1440, height: 900 });
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const url = new URL(page.url()).pathname;
  const body = normalise(await page.locator("body").innerText());
  if (path === "/no-existe") {
    if (!/no encontrada|not found/i.test(body)) record(path, "404", "no muestra el estado 404");
    await page.screenshot({ path: `${OUT}/09-404.png` });
  } else if (!url.startsWith("/productos/transmisores-fm")) {
    record(path, "router", `/soluciones/* no redirige a /productos/*: terminó en ${url}`);
  }
  notes.push(`${path} -> pathname final ${url}`);
  await context.close();
}

/* ------------------------------------------------------------------ */
/* 5 · prefers-reduced-motion                                          */
/* ------------------------------------------------------------------ */
{
  const route = "/ (reduced-motion)";
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
    locale: "es-CL",
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => record(route, "pageerror", String(e).slice(0, 200)));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForSelector("h1", { timeout: 15000 });

  const lenisActive = await page.evaluate(() => document.documentElement.classList.contains("lenis"));
  if (lenisActive) record(route, "a11y", "Lenis se montó pese a prefers-reduced-motion");

  const contentVisible = await page.evaluate(() => {
    const el = document.querySelector("h1");
    if (!el) return false;
    const style = getComputedStyle(el.closest("div") ?? el);
    return Number(style.opacity) > 0.5;
  });
  if (!contentVisible) record(route, "a11y", "el contenido queda invisible con reduced-motion");

  const perf = await page.evaluate(() =>
    performance.getEntriesByType("resource").filter((r) => r.name.includes(".mp4")).length,
  );
  notes.push(`REDUCED-MOTION descargas de mp4: ${perf}`);
  await page.screenshot({ path: `${OUT}/10-reduced-motion.png` });
  await context.close();
}

/* ------------------------------------------------------------------ */
/* 6 · Navegación por teclado (accesibilidad)                          */
/* ------------------------------------------------------------------ */
{
  const route = "/ (keyboard)";
  const { context, page } = await newPage(route, { width: 1440, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForSelector("h1", { timeout: 15000 });

  // El primer Tab debe alcanzar el "saltar al contenido".
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => {
    const el = document.activeElement;
    return { text: el?.textContent?.trim().slice(0, 40), href: el?.getAttribute?.("href") };
  });
  notes.push(`KEYBOARD primer foco: ${JSON.stringify(first)}`);
  if (first.href !== "#main") record(route, "a11y", `el primer foco no es el skip link: ${JSON.stringify(first)}`);

  // Space no debe quedar secuestrado (regresión del hero anterior).
  const before = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => document.body.focus());
  await page.keyboard.press("Space");
  await page.waitForTimeout(700);
  const after = await page.evaluate(() => window.scrollY);
  notes.push(`KEYBOARD scroll con Space: ${before} -> ${after}`);
  if (after <= before) record(route, "a11y", "Space no desplaza la página: el scroll sigue secuestrado");

  // Los campos del formulario deben tener label asociado.
  const unlabelled = await page.evaluate(() =>
    [...document.querySelectorAll("#contacto input, #contacto textarea, #contacto select")]
      .filter((input) => {
        const id = input.id;
        return !id || !document.querySelector(`label[for="${id}"]`);
      })
      .map((input) => input.name || input.id || "(sin nombre)"),
  );
  if (unlabelled.length) record(route, "a11y", `campos sin label asociado: ${unlabelled.join(", ")}`);


  await context.close();
}

/* ------------------------------------------------------------------ */
/* 8 · Contraste WCAG AA en todas las rutas                            */
/* ------------------------------------------------------------------ */
{
  // Todas las rutas del sitio, incluidas las 16 fichas de producto.
  const rutas = rutasGeneradas.map((r) => r.path);
  for (const path of [...new Set(rutas)]) {
    const { context, page } = await newPage(path, { width: 1440, height: 900 });
    await page.goto(BASE + path, { waitUntil: "load" });
    await page.waitForSelector("h1", { timeout: 15000 });
    await page.waitForTimeout(1000);

    const alto = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < alto; y += 700) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(500);

    const fallos = await page.evaluate(contrastEvaluator);
    if (fallos.length) {
      record(path, "accesibilidad-contraste", `${fallos.length} muestra(s) bajo el mínimo WCAG AA`);
      for (const c of fallos) {
        notes.push(`   ${path} · ${c.ratio}:1 (requiere ${c.required}:1) ${c.size}px "${c.text}" fg=${c.color} bg=${c.bg}`);
      }
    } else {
      notes.push(`CONTRASTE ${path}: cumple WCAG AA`);
    }
    await context.close();
  }
}

await browser.close();

/* ------------------------------------------------------------------ */
console.log("\n================ NOTAS ================");
for (const n of notes) console.log("  " + n);

console.log("\n================ PROBLEMAS ================");
if (problems.length === 0) {
  console.log("  Ninguno. QA en verde.");
} else {
  const grouped = new Map();
  for (const p of problems) {
    const key = `${p.route} · ${p.kind}`;
    grouped.set(key, [...(grouped.get(key) ?? []), p.message]);
  }
  for (const [key, msgs] of grouped) {
    console.log(`\n[${key}] (${msgs.length})`);
    for (const m of [...new Set(msgs)].slice(0, 8)) console.log("   - " + m);
  }
  console.log(`\nTOTAL: ${problems.length} problema(s)`);
  process.exitCode = 1;
}
