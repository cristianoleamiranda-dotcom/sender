/**
 * Perfil real del Samsung Galaxy S24: viewport CSS 360x780, DPR 3.
 *
 * Por que existe: los perfiles moviles genericos de Lighthouse (412x823) y de
 * DevTools (390x844) son mas anchos que el S24. A 360 px aparecen desbordes que
 * a 390 no, y este es el dispositivo real con el que se revisa el sitio.
 *
 * Fuentes de los valores:
 *   https://en.wikipedia.org/wiki/Samsung_Galaxy_S24            (1080x2340, 6.2", 120 Hz, Exynos 2400 / SD 8 Gen 3)
 *   https://www.webmobilefirst.com/en/devices/samsung-galaxy-s24-2024/  (viewport CSS 360x780, DPR 3, UA)
 *
 * Uso:
 *   npm run build && npm run serve &   BASE=http://127.0.0.1:4173 node qa/dispositivo-s24.mjs
 *   VITE_BASE_PATH=/sender/ npm run build && VITE_BASE_PATH=/sender/ PORT=4321 npm run serve &
 *   BASE=http://127.0.0.1:4321/sender node qa/dispositivo-s24.mjs
 */
import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://127.0.0.1:4321/sender";
const UA = "Mozilla/5.0 (Linux; Android 16; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36";
const rutas = process.env.RUTAS
  ? process.env.RUTAS.split(",").map((r) => r.trim())
  : ["/", "/productos/", "/productos/transmisores-am/", "/producto/serie-sender-ss/", "/no-existe/"];
const browser = await chromium.launch();
const fallos = [];
for (const r of rutas) {
  const page = await browser.newPage({
    viewport: { width: 360, height: 780 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: UA,
    locale: "es-CL",
  });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 80)));
  await page.goto(BASE + r, { waitUntil: "load" });
  await page.waitForSelector("#root h1", { timeout: 20000 });
  await page.waitForTimeout(3500);
  const res = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const anchos = [...document.querySelectorAll("#root *")]
      .filter((el) => el.getBoundingClientRect().right > vw + 1.5 && getComputedStyle(el).position !== "fixed")
      .slice(0, 3)
      .map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().slice(0, 26)} right=${Math.round(el.getBoundingClientRect().right)}`);
    return {
      h1: document.querySelector("h1")?.innerText?.replace(/\s+/g, " ").trim().slice(0, 34),
      secciones: document.querySelectorAll("#root section").length,
      overflowX: document.documentElement.scrollWidth > vw + 1,
      scrollWidth: document.documentElement.scrollWidth,
      vw,
      culpables: anchos,
      titulo: document.title.slice(0, 40),
    };
  });
  if (res.overflowX) fallos.push(`${r}: desborde horizontal (scrollWidth ${res.scrollWidth} > viewport ${res.vw}) — ${res.culpables.join(" ; ") || "sin responsable identificado"}`);
  if (errs.length) fallos.push(`${r}: ${errs[0]}`);
  const flag = res.overflowX ? "DESBORDE" : "ok";
  console.log(`${r.padEnd(28)} ${flag.padEnd(9)} scrollW=${res.scrollWidth}/${res.vw} h1="${res.h1}" ${res.culpables.length ? "| " + res.culpables.join(" ; ") : ""} ${errs.length ? "ERR " + errs[0] : ""}`);
  await page.close();
}
await browser.close();
if (fallos.length) {
  console.log("\n✗ " + fallos.length + " problema(s) en el perfil S24 (360x780):");
  for (const f of fallos) console.log("  - " + f);
  process.exitCode = 1;
} else {
  console.log("\n✓ Sin desbordes horizontales ni errores en el perfil S24 (360x780).");
}
