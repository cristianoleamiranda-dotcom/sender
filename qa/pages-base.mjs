#!/usr/bin/env node
/**
 * Flujo de ruta profunda en GitHub Pages con base "/sender/".
 *
 * Por qué existe esta prueba: el sitio publicado mostraba la HOME en cualquier
 * ruta profunda, con la URL correcta en la barra. Pasó desapercibido porque el
 * resto del QA se ejecuta contra un servidor con base "/", donde ese camino no
 * se recorre nunca. En Pages sí:
 *
 *   /sender/productos/x  ->  Pages no tiene rewrite y sirve 404.html
 *                        ->  404.html redirige a /sender/?redirect=%2Fproductos%2Fx
 *                        ->  se repone la URL y el router enruta
 *
 * Dos fallos reales vivían en ese encadenamiento, y los dos se detectan aquí:
 *   1. `main.tsx` reponía la ruta DESPUÉS de que `./router` leyera
 *      `window.location` (los imports se evalúan antes que el cuerpo del
 *      módulo), y como `replaceState` no dispara `popstate`, el router se
 *      quedaba en la home para siempre. Ahora vive en `src/restorePagesPath.ts`
 *      y se importa en primer lugar.
 *   2. La ruta repuesta perdía el prefijo `/sender`, así que el `basename` del
 *      router no encajaba.
 *
 * Uso:
 *   VITE_BASE_PATH=/sender/ npm run build && npm run qa:pages
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT ?? 4321);
const BASE = "/sender";
const ORIGIN = `http://127.0.0.1:${PORT}${BASE}`;

if (!existsSync(join(root, "dist", "index.html"))) {
  console.error("dist/ no existe: VITE_BASE_PATH=/sender/ npm run build");
  process.exit(1);
}

const servidor = spawn("node", [join(root, "scripts", "serve-dist.mjs")], {
  cwd: root,
  stdio: "ignore",
  env: { ...process.env, PORT: String(PORT), VITE_BASE_PATH: "/sender/" },
});

const problemas = [];
const notas = [];

try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(ORIGIN + "/")).ok) break;
    } catch {
      /* aún no escucha */
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  const browser = await chromium.launch();

  // 1) Los assets deben resolverse bajo el prefijo. Sin el recorte de base en
  //    el servidor, el fallback SPA responde HTML en vez del módulo.
  {
    const html = await (await fetch(ORIGIN + "/")).text();
    const js = (html.match(/src="([^"]+\.js)"/) || [])[1];
    if (!js) problemas.push("no se encontró el <script> del bundle en el HTML");
    else {
      if (!js.startsWith(BASE + "/")) problemas.push(`el bundle no usa el prefijo: ${js}`);
      const res = await fetch(ORIGIN.replace(BASE, "") + js);
      const tipo = res.headers.get("content-type") ?? "";
      if (!res.ok || !tipo.includes("javascript")) {
        problemas.push(`el asset ${js} responde ${res.status} ${tipo}`);
      } else notas.push(`asset bajo prefijo OK: ${js} (${tipo})`);
    }
  }

  // 2) Rutas profundas vía el rebote de 404.html.
  const casos = [
    { redirect: "/productos/", h1: /soluciones de transmisión/i, titulo: /productos/i },
    { redirect: "/productos/transmisores-am/", h1: /transmisores am/i, titulo: /transmisores am/i },
    { redirect: "/producto/serie-sender-ss/", h1: /sender ss/i, titulo: /sender ss/i },
    { redirect: "/no-existe/", h1: /no encontrada/i, titulo: /no encontrada/i },
  ];

  for (const caso of casos) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: "es-CL" });
    const errores = [];
    page.on("console", (m) => {
      if (m.type() === "error") errores.push(m.text().slice(0, 120));
    });
    page.on("pageerror", (e) => errores.push("EXC " + String(e).slice(0, 120)));

    await page.goto(`${ORIGIN}/?redirect=${encodeURIComponent(caso.redirect)}`, { waitUntil: "load" });
    await page.waitForSelector("#root h1", { timeout: 20000 });
    await page.waitForTimeout(2000);

    const info = await page.evaluate(() => ({
      pathname: location.pathname,
      search: location.search,
      h1: document.querySelector("h1")?.innerText?.replace(/\s+/g, " ").trim() ?? "",
      titulo: document.title,
      secciones: document.querySelectorAll("#root section").length,
    }));

    const esperado = BASE + caso.redirect;
    if (info.pathname !== esperado) problemas.push(`${caso.redirect}: URL final ${info.pathname}, se esperaba ${esperado}`);
    if (info.search) problemas.push(`${caso.redirect}: quedó ?redirect= en la URL`);
    if (!caso.h1.test(info.h1)) problemas.push(`${caso.redirect}: H1 "${info.h1}" no corresponde (se mostraba la home)`);
    if (!caso.titulo.test(info.titulo)) problemas.push(`${caso.redirect}: title "${info.titulo}" no corresponde`);
    if (errores.length) problemas.push(`${caso.redirect}: errores de consola: ${errores[0]}`);
    if (!problemas.length) notas.push(`${caso.redirect} -> H1 "${info.h1.slice(0, 40)}", ${info.secciones} secciones`);

    await page.close();
  }

  // 3) La home sigue precargando su póster (es el LCP) y solo ella.
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const precargas = [];
    page.on("request", (r) => {
      if (/hero-poster/.test(r.url())) precargas.push(r.url().split("/").pop());
    });
    await page.goto(ORIGIN + "/", { waitUntil: "load" });
    await page.waitForTimeout(2500);
    if (!precargas.length) problemas.push("la home no descarga el póster del hero (era el LCP)");
    else notas.push(`home: póster precargado (${precargas[0]})`);
    await page.close();
  }
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const avisos = [];
    page.on("console", (m) => {
      if (/preloaded but not used/i.test(m.text())) avisos.push(m.text().slice(0, 100));
    });
    await page.goto(`${ORIGIN}/?redirect=${encodeURIComponent("/productos/")}`, { waitUntil: "load" });
    await page.waitForTimeout(3000);
    if (avisos.length) problemas.push(`ruta profunda precarga el póster sin usarlo: ${avisos[0]}`);
    else notas.push("ruta profunda: sin precarga inútil del póster");
    await page.close();
  }

  await browser.close();
} finally {
  servidor.kill("SIGTERM");
}

console.log("\n================ NOTAS ================");
for (const n of notas) console.log("  " + n);
console.log("\n================ RESULTADO ================");
if (problemas.length) {
  for (const p of [...new Set(problemas)]) console.log("  ✗ " + p);
  console.log(`\n${new Set(problemas).size} problema(s) en el flujo de Pages.`);
  process.exitCode = 1;
} else {
  console.log("  ✓ Rutas profundas correctas bajo /sender/");
}
