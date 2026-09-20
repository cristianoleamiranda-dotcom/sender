/**
 * Control positivo del auditor de contraste.
 *
 * Un test de accesibilidad que siempre pasa no vale nada. Aqui se inyectan
 * deliberadamente colores ilegibles en la pagina real y se comprueba que la
 * MISMA funcion que usa qa.mjs los reporta. Si este script falla, el "verde"
 * del QA es falso.
 */
import { chromium } from "playwright";
import { contrastEvaluator } from "./contrast.mjs";

const BASE = "http://127.0.0.1:4173/productos";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(BASE, { waitUntil: "load" });
await page.waitForTimeout(1500);

const medir = () => page.evaluate(contrastEvaluator);
const injectar = (css, texto) => page.evaluate(([css, texto]) => {
  const el = document.createElement("p");
  el.textContent = texto;
  el.style.cssText = `position:fixed;top:4px;left:4px;z-index:99999;background:#08090a;font-size:13px;${css}`;
  document.body.appendChild(el);
  return el.textContent;
}, [css, texto]);

const resultados = [];
const casos = [
  { nombre: "texto blanco puro sobre ink",        css: "color:#f2f4f6", debeFallar: false },
  { nombre: "azul de marca #1e73be sobre ink",    css: "color:#1e73be", debeFallar: true  },
  { nombre: "gris #4a5055 sobre ink (~2.9:1)",    css: "color:#4a5055", debeFallar: true  },
  { nombre: "blanco al 35% sobre ink (~3.4:1)",   css: "color:rgb(255 255 255 / 0.35)", debeFallar: true  },
  { nombre: "blanco al 75% sobre ink",            css: "color:rgb(255 255 255 / 0.75)", debeFallar: false },
  { nombre: "oklab() equivalente a blanco 80%",   css: "color:oklab(0.999994 0.0000455678 0.0000200868 / 0.8)", debeFallar: false },
  { nombre: "texto grande (28px) en azul de marca", css: "color:#1e73be;font-size:28px", debeFallar: false },
];

const base = await medir();
console.log(`Sitio real sin inyecciones: ${base.length} fallo(s)\n`);

for (const caso of casos) {
  const texto = await injectar(caso.css, `CASO ${caso.nombre}`);
  await page.waitForTimeout(200);
  const fallos = await medir();
  const detectado = fallos.some((f) => f.text.includes(texto.slice(0, 20)));
  await page.evaluate((t) => {
    document.querySelectorAll("p").forEach((p) => { if (p.textContent.includes(t)) p.remove(); });
  }, texto);
  const ok = detectado === caso.debeFallar;
  resultados.push(ok);
  console.log(`${ok ? "✓" : "✗"} ${caso.nombre.padEnd(42)} detectado=${detectado} esperado=${caso.debeFallar}`);
}

await browser.close();
const fallidos = resultados.filter((r) => !r).length;
console.log(`\n${fallidos === 0 ? "CONTROL POSITIVO OK: el auditor discrimina correctamente." : `CONTROL POSITIVO FALLIDO en ${fallidos} caso(s): el QA no es fiable.`}`);
process.exit(fallidos === 0 ? 0 : 1);
