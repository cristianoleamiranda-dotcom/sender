import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, useAnimate } from "motion/react";

/**
 * Indicador de cambio de ruta.
 *
 * Al existir rutas lazy (`/productos/*`), el usuario necesita señal de que
 * algo está cargando. Es un filete de 2 px en el borde superior: presente
 * pero nunca decorativo, coherente con el lenguaje técnico del sitio.
 */
export function RouteProgress() {
  const { pathname } = useLocation();
  const [scope, animate] = useAnimate();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const controls = animate(
      scope.current,
      { scaleX: [0, 0.7, 1], opacity: [1, 1, 0] },
      { duration: 0.7, ease: [0.16, 1, 0.3, 1], times: [0, 0.4, 1] },
    );
    return () => controls.stop();
  }, [pathname, animate, scope]);

  return (
    <motion.div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-0.5 origin-left scale-x-0 bg-signal opacity-0"
    />
  );
}
