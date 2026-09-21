/**
 * Restauración de la ruta profunda en GitHub Pages.
 *
 * Pages no tiene reescritura SPA: para `/sender/productos/x` sirve
 * `public/404.html`, que redirige a la raíz llevando la ruta original en
 * `?redirect=`. Aquí se repone esa ruta en la URL antes de que el router la
 * lea. En dominio propio (sender.cl, con rewrite a index.html) no hay
 * `?redirect=` y el módulo no hace nada.
 *
 * POR QUÉ ES UN MÓDULO APARTE Y NO UN BLOQUE EN main.tsx
 *
 * `createBrowserRouter` lee `window.location` al evaluarse, y eso ocurre
 * durante la fase de importación de `main.tsx`, es decir ANTES de que se
 * ejecute cualquier sentencia de su cuerpo. Con el bloque en `main.tsx` el
 * router arrancaba viendo `/sender/?redirect=…` (ruta `/`, la home), y como
 * `history.replaceState` no dispara `popstate`, nunca se enteraba del cambio:
 * todas las rutas profundas publicadas mostraban la home con la URL correcta.
 *
 * Importar este módulo en primer lugar garantiza que la URL ya está repuesta
 * cuando `./router` se evalúa. El orden de los imports es lo que sostiene la
 * corrección: no moverlo.
 */

const params = new URLSearchParams(window.location.search);
const redirect = params.get("redirect");

if (redirect?.startsWith("/")) {
  const base = import.meta.env.BASE_URL || "/";
  const prefijo = base.endsWith("/") ? base.slice(0, -1) : base;
  // `404.html` recorta el prefijo para que `redirect` sea una ruta de
  // aplicación, pero la URL del navegador tiene que conservarlo: el router se
  // crea con `basename` derivado de `BASE_URL`.
  const yaLoTrae = redirect === prefijo || redirect.startsWith(prefijo + "/");
  const ruta = yaLoTrae ? redirect : prefijo + redirect;

  window.history.replaceState(null, "", ruta + window.location.hash);
}

export {};
