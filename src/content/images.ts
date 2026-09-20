/**
 * Imágenes REALES de Sender, ya presentes en el repositorio.
 *
 * Regla de assets del proyecto: no se generan ni se importan fotografías
 * nuevas, ni stock, ni placeholders externos. Todo proviene de `src/assets/`.
 *
 * Los originales (JPG/PNG) siguen en el repo como fuente. Las variantes WebP
 * de `src/assets/gen/` se derivan de ellos con `npm run assets`
 * (scripts/optimize-assets.py) y son las que se sirven.
 *
 * Los assets de `public/assets/` se referencian con ruta RELATIVA ("./assets/…")
 * para que el mismo build funcione en la raíz de un dominio y bajo
 * GitHub Pages (/sender/) sin recompilar.
 */

import about from "@/assets/gen/about-640.webp";
import aboutMd from "@/assets/gen/about-960.webp";
import capAntennas from "@/assets/gen/cap-antennas-640.webp";
import capAntennasMd from "@/assets/gen/cap-antennas-960.webp";
import capBroadcast from "@/assets/gen/cap-broadcast-640.webp";
import capBroadcastMd from "@/assets/gen/cap-broadcast-960.webp";
import capBroadcastLg from "@/assets/gen/cap-broadcast-1280.webp";
import capCritical from "@/assets/gen/cap-critical-640.webp";
import capCriticalMd from "@/assets/gen/cap-critical-960.webp";
import capCriticalLg from "@/assets/gen/cap-critical-1280.webp";
import capRf from "@/assets/gen/cap-rf-640.webp";
import capRfMd from "@/assets/gen/cap-rf-960.webp";
import capTransmission from "@/assets/gen/cap-transmission-640.webp";
import capTransmissionMd from "@/assets/gen/cap-transmission-960.webp";
import heroWide from "@/assets/gen/hero-wide-640.webp";
import heroWideMd from "@/assets/gen/hero-wide-960.webp";
import heroWideLg from "@/assets/gen/hero-wide-1280.webp";
import projAm from "@/assets/gen/proj-am-640.webp";
import projAmMd from "@/assets/gen/proj-am-960.webp";
import projStl from "@/assets/gen/proj-stl-640.webp";
import projStlMd from "@/assets/gen/proj-stl-960.webp";
import projStlLg from "@/assets/gen/proj-stl-1280.webp";

export interface SrcSet {
  /** ~640px: móvil. */
  sm: string;
  /** ~960px: tablet / escritorio. */
  md: string;
  /** ~1280px: solo cuando el original lo permite (nunca se agranda). */
  lg?: string;
  widths: number[];
}

function set(sm: string, md: string, lg?: string): SrcSet {
  return { sm, md, lg, widths: lg ? [640, 960, 1280] : [640, 960] };
}

export const img = {
  about: set(about, aboutMd),
  capAntennas: set(capAntennas, capAntennasMd),
  capBroadcast: set(capBroadcast, capBroadcastMd, capBroadcastLg),
  capCritical: set(capCritical, capCriticalMd, capCriticalLg),
  capRf: set(capRf, capRfMd),
  capTransmission: set(capTransmission, capTransmissionMd),
  heroWide: set(heroWide, heroWideMd, heroWideLg),
  projAm: set(projAm, projAmMd),
  projStl: set(projStl, projStlMd, projStlLg),
};

export type ImageKey = keyof typeof img;

/** Poster del hero, derivado del frame 1 real de `sender-hero.mp4`. */
export const heroPoster = {
  sm: "./assets/hero-poster-640.webp",
  md: "./assets/hero-poster-960.webp",
  lg: "./assets/hero-poster-1280.webp",
};

/** Video real del hero, existente en el repositorio. */
export const heroVideo = "./assets/sender-hero.mp4";

/** Cadena srcSet lista para el atributo homónimo de <img> / <source>. */
export function srcSetOf(s: SrcSet): string {
  return s.lg
    ? `${s.sm} 640w, ${s.md} 960w, ${s.lg} 1280w`
    : `${s.sm} 640w, ${s.md} 960w`;
}
