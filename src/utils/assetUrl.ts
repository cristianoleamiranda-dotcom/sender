/**
 * Resuelve la URL de un asset servido desde `public/`.
 *
 * Por qué existe: en dominio propio los assets viven en `/assets/...`, pero
 * bajo GitHub Pages viven en `/sender/assets/...`. Escribir la ruta a mano
 * rompe uno de los dos entornos. `import.meta.env.BASE_URL` viene de `base`
 * en vite.config.ts, así que esta función es correcta en ambos casos.
 */
export function publicAsset(path: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = path.replace(/^\.?\//, "");
  return `${cleanBase}${cleanPath}`;
}
