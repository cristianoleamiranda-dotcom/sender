#!/usr/bin/env node
/**
 * Control estatico: el texto nunca debe revelarse animando `opacity`.
 *
 * Por que existe ademas del auditor de contraste en navegador: ese mide el DOM
 * en reposo, cuando las animaciones ya terminaron, asi que un fundido desde
 * opacity 0 le pasa desapercibido. Lighthouse si lo caza (mide durante la
 * carga) y reportaba 52 elementos por debajo de 4.5:1.
 *
 * La regla del sistema de diseno es: el texto entra por desplazamiento o por
 * cambio de color entre dos tokens que ya cumplen AA. La opacidad queda
 * reservada a capas decorativas marcadas con `aria-hidden`.
 *
 * Uso: node qa/no-opacity-text.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");

/** Excepciones justificadas: animan capas sin texto (aria-hidden, imagenes, SVG). */
const PERMITIDOS = [
  // Cortina de RevealImage y escala del img: no hay texto dentro.
  { file: "src/ui/Reveal.tsx", porque: "cortina y escala de imagen (aria-hidden)" },
  // Vista previa que sigue al puntero: aria-hidden y solo contiene un <img>.
  { file: "src/sections/Solutions.tsx", porque: "preview de puntero aria-hidden" },
  // Cruce de imagenes del visor de proyectos.
  { file: "src/sections/Projects.tsx", porque: "fundido de imagen, no de texto" },
  // Trazos del diagrama de ingenieria (SVG).
  { file: "src/sections/Engineering.tsx", porque: "trazos SVG" },
];

function archivos(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) out.push(...archivos(full));
    else if (e.endsWith(".tsx") || e.endsWith(".ts")) out.push(full);
  }
  return out;
}

// `opacity: 0` (o muy bajo) dentro de un initial/whileInView/animate de Motion.
const PATRON = /\b(?:initial|animate|whileInView|whileHover)\s*=\s*\{[^}]*?opacity:\s*(0|0?\.\d+)/g;

let fallos = 0;
for (const archivo of archivos(src)) {
  const rel = relative(root, archivo).split("\\").join("/");
  const texto = readFileSync(archivo, "utf8");
  const lineas = texto.split("\n");
  const permitido = PERMITIDOS.find((p) => p.file === rel);

  for (const m of texto.matchAll(PATRON)) {
    const valor = Number(m[1]);
    // Por debajo de 0.56 un texto blanco sobre tinta no llega a 4.5:1.
    if (valor >= 0.56) continue;
    const linea = texto.slice(0, m.index).split("\n").length;
    if (permitido) continue;
    fallos++;
    console.log(`  ✗ ${rel}:${linea}  opacity: ${m[1]}`);
    console.log(`    ${lineas[linea - 1].trim().slice(0, 100)}`);
  }
}

if (fallos) {
  console.log(`\n${fallos} animacion(es) de opacidad sobre texto.`);
  console.log("Mueve el revelado a desplazamiento (y/x) o a color entre dos tokens AA.");
  console.log("Si es una capa decorativa sin texto, marcala con aria-hidden y");
  console.log("anadela a PERMITIDOS con la razon.");
  process.exit(1);
}
console.log("✓ Ninguna animacion de opacidad deja texto por debajo de 4.5:1");
