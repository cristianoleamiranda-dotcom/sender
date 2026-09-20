import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { company } from "@/content/company";

/**
 * SEO por ruta.
 *
 * `index.html` trae la metadata del home. Este hook la sobrescribe en cada
 * navegación, de modo que cada categoría y cada producto tengan su propio
 * title, description, canonical, Open Graph y structured data.
 *
 * `canonical` se construye sobre `company.siteUrl` (dominio real) y no sobre
 * `window.location.origin`: en GitHub Pages el origin es `*.github.io`, y
 * canonicalizar hacia ahí le diría a los buscadores que la copia buena es la
 * de Pages en lugar de sender.cl.
 */

export interface SeoInput {
  title: string;
  description: string;
  /** Ruta interna, p. ej. `/productos/transmisores-am`. Por defecto, la actual. */
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE = company.siteUrl.replace(/\/+$/, "");

const KEYWORDS =
  "Sender Chile, broadcasting Chile, transmisores FM Chile, transmisores AM Chile, " +
  "equipos broadcasting Chile, telecomunicaciones Chile, STL enlaces Chile, RF Chile, " +
  "automatización broadcasting, transmisores de radio, equipos para radio, " +
  "tecnología broadcasting, NAVTEX, antenas HF, ingeniería RF";

function upsertMeta(attr: "name" | "property", key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

/** URL canónica absoluta de una ruta interna. */
export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return `${SITE}/`;
  return `${SITE}${clean.replace(/\/+$/, "")}/`;
}

/** Convierte un asset del bundle o de `public/` en URL absoluta. */
export function absoluteAsset(href: string): string {
  if (/^https?:\/\//.test(href)) return href;
  const clean = href.replace(/^\.\//, "").replace(/^\//, "");
  return `${SITE}/${clean}`;
}

export function useDocumentMeta({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
  jsonLd,
}: SeoInput): void {
  const location = useLocation();
  const routePath = path ?? location.pathname;
  // `jsonLd` se serializa para que la dependencia del effect sea estable.
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const url = absoluteUrl(routePath);

    document.title = title;
    upsertCanonical(url);
    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", KEYWORDS);

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", company.name);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);

    if (image) {
      const abs = absoluteAsset(image);
      upsertMeta("property", "og:image", abs);
      upsertMeta("name", "twitter:image", abs);
      upsertMeta("property", "og:image:alt", imageAlt ?? title);
    }

    if (!jsonLdKey) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.routeScoped = "true";
    script.textContent = jsonLdKey;
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [title, description, routePath, image, imageAlt, type, jsonLdKey]);
}
