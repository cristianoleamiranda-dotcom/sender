import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "./useReducedMotion";

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Desplaza a una sección por id usando Lenis cuando está activo
 * y `scrollIntoView` como respaldo (reduced-motion o SSR).
 */
export function scrollToId(id: string, offset = 0): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset, duration: 1.3 });
  } else {
    el.scrollIntoView({ behavior: "auto", block: "start" });
  }
}

/**
 * Devuelve el desplazamiento absoluto de un elemento, para poder
 * fijar animaciones ligadas al scroll sin depender de su offsetParent.
 */
export function absoluteTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY;
}

/**
 * Activa el smooth scrolling global.
 *
 * Nota de arquitectura: Lenis reemplaza `scroll-behavior: smooth` del CSS.
 * Tener ambos activos hace que compitan por el mismo scroll, así que
 * `index.css` anula `scroll-behavior` cuando `html.lenis` está presente.
 *
 * Con `prefers-reduced-motion` no se instancia: el scroll nativo queda
 * intacto y el resto del sitio ya respeta el flag por separado.
 */
export function useLenis(): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
    });
    lenisInstance = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      if (lenisInstance === lenis) lenisInstance = null;
    };
  }, [reduced]);
}
