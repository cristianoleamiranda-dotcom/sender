/**
 * Resuelve un árbol de contenido `{ es, en }` al idioma activo.
 *
 * `resolve(siteContent, "es")` devuelve un objeto idéntico en forma, pero con
 * todos los `Loc` colapsados a `string` del idioma pedido. Es la pieza que
 * garantiza que la interfaz nunca mezcle idiomas y que ninguna clave quede
 * sin traducir.
 */
import type { Lang, Loc, Resolved } from "./types";

function isLoc(value: unknown): value is Loc {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  if (Object.keys(value).length !== 2) return false;
  const candidate = value as Partial<Loc>;
  return typeof candidate.es === "string" && typeof candidate.en === "string";
}

function walk(value: unknown, lang: Lang): unknown {
  if (isLoc(value)) return value[lang];
  if (Array.isArray(value)) return value.map((item) => walk(item, lang));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      out[key] = walk(entry, lang);
    }
    return out;
  }
  return value;
}

export function resolve<T>(tree: T, lang: Lang): Resolved<T> {
  return walk(tree, lang) as Resolved<T>;
}

/** Atajo para un texto suelto. */
export function pick(loc: Loc, lang: Lang): string {
  return loc[lang];
}
