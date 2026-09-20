import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLenis, scrollToId } from "./useLenis";

/**
 * Restauración de scroll consciente del router y de Lenis.
 *
 * - Ruta nueva sin hash  -> al tope, instantáneo (sin animación: animar
 *   un cambio de página se siente como lag).
 * - Ruta con `#seccion`  -> desplaza a esa sección, animado si Lenis vive.
 *
 * El pequeño retardo existe porque al montar una ruta lazily la altura del
 * documento todavía no es definitiva; sin él, el destino queda corto.
 */
export function useScrollRestore(): void {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const lenis = getLenis();

    if (hash) {
      const id = hash.replace("#", "");
      const attempt = (tries: number) => {
        if (document.getElementById(id)) {
          scrollToId(id, 0);
        } else if (tries > 0) {
          window.requestAnimationFrame(() => attempt(tries - 1));
        }
      };
      const timer = window.setTimeout(() => attempt(12), 60);
      return () => window.clearTimeout(timer);
    }

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, hash]);
}
