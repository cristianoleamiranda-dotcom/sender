import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToId } from "./useLenis";

/**
 * Navegación unificada por anclas y rutas.
 *
 * Problema que resuelve: los enlaces `/#seccion` del menú tienen que
 * funcionar también cuando el usuario está dentro de `/producto/x`.
 * Con un `<a href>` a secas el navegador recargaría la aplicación entera;
 * con `navigate()` puro la sección no se desplaza si ya estamos en el home.
 *
 * Regla UX del brief (2–3 interacciones hasta un producto o contacto):
 * este hook es el que hace que cualquier CTA de sección aterrice directo.
 */
export function useAnchorNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback(
    (href: string) => {
      if (/^(https?:|mailto:|tel:)/.test(href)) {
        window.location.href = href;
        return;
      }

      const [pathPart, hashPart] = href.split("#");
      const path = pathPart === "" ? "/" : pathPart;

      if (!hashPart) {
        navigate(path);
        return;
      }

      if (location.pathname === path) {
        scrollToId(hashPart, 0);
      } else {
        navigate(`${path}#${hashPart}`);
      }
    },
    [location.pathname, navigate],
  );
}
