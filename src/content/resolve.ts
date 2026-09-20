/**
 * Resuelve un árbol de contenido `{ es, en }` al idioma activo.
 *
 * `resolve(siteContent, "es")` devuelve un objeto idéntico en forma,
 * pero con todos los `Loc` colapsados a `string` del idioma pedido.
 * Es la pieza que garantiza que la interfaz nunca mezcle idiomas.
 */
import type { Lang, Loc } from "./types";

function isLoc(value: unknown): value is Loc {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    typeof (value as Loc).es === "string" &&
    typeof (value as Loc).en === "string" &&
    Object.keys(value as object).length === 2
  );
}

export function resolve<T>(tree: T, lang: Lang): any {
  if (isLoc(tree)) return tree[lang];
  if (Array.isArray(tree)) return tree.map((item) => resolve(item, lang));
  if (tree && typeof tree === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(tree as Record<string, unknown>)) {
      out[key] = resolve(value, lang);
    }
    return out;
  }
  return tree;
}

/** Atajo para un texto suelto. */
export function pick(loc: Loc, lang: Lang): string {
  return loc[lang];
}
