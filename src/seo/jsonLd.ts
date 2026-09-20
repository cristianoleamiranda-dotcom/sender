/**
 * Structured data (schema.org).
 *
 * Se genera desde los mismos datos que alimentan la interfaz, así que no
 * puede describir algo que el sitio no muestre. Ninguna propiedad usa
 * valores que Sender no publique: sin `aggregateRating`, sin `review`,
 * sin `price`, sin `award`, sin `foundingDate`.
 */

import { company } from "@/content/company";
import { absoluteUrl } from "./useDocumentMeta";
import type { Category, Lang, Product, Project } from "@/content/types";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: `${company.siteUrl}/`,
    slogan: company.claim.en,
    description:
      "Empresa chilena con más de 20 años de experiencia en telecomunicaciones, radiodifusión y sistemas de transmisión profesional. Equipos RF, antenas y tecnología de broadcasting para proyectos nacionales e internacionales.",
    email: company.email,
    telephone: "+56983864148",
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      addressLocality: company.address.commune,
      addressRegion: "Región Metropolitana",
      addressCountry: "CL",
    },
    areaServed: ["CL", "International"],
    knowsAbout: [
      "Ingeniería RF",
      "Radiodifusión AM",
      "Radiodifusión FM",
      "NAVTEX",
      "Antenas HF",
      "Sistemas de transmisión",
      "Enlaces estudio-planta",
      "Automatización de broadcasting",
    ],
  };
}

export function webSiteLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.name,
    url: `${company.siteUrl}/`,
    inLanguage: lang === "es" ? "es-CL" : "en",
  };
}

/** La página de catálogo como colección de productos. */
export function collectionLd(category: Category, lang: Lang, items: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name[lang],
    description: category.description[lang],
    url: absoluteUrl(`/productos/${category.slug}`),
    inLanguage: lang === "es" ? "es-CL" : "en",
    isPartOf: { "@type": "WebSite", name: company.name, url: `${company.siteUrl}/` },
    about: items.map((p) => ({
      "@type": "Product",
      name: p.name[lang],
      description: p.summary[lang],
      url: absoluteUrl(`/producto/${p.slug}`),
    })),
  };
}

/**
 * Ficha de producto.
 *
 * Sin `offers`: Sender no publica precios, y un `Product` sin precio sigue
 * siendo válido mientras no se declare disponibilidad inventada.
 */
export function productLd(product: Product, category: Category | undefined, lang: Lang) {
  const specs = product.specs.flatMap((group) =>
    group.rows.map((row) => `${row.k[lang]}: ${row.v[lang]}`),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name[lang],
    description: product.summary[lang],
    url: absoluteUrl(`/producto/${product.slug}`),
    brand: { "@type": "Brand", name: company.name },
    manufacturer: { "@type": "Organization", name: company.name },
    category: category?.name[lang],
    additionalProperty: specs.map((value) => ({
      "@type": "PropertyValue",
      value,
    })),
  };
}

/**
 * Lista de proyectos.
 * Solo `ItemList` con nombre, lugar y descripción: nada de fechas ni
 * clientes que Sender no publique.
 */
export function projectsLd(projects: Project[], lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: lang === "es" ? "Instalaciones documentadas" : "Documented installations",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Thing",
        name: p.name[lang],
        description: p.summary[lang],
        location: p.location[lang],
      },
    })),
  };
}

/** Breadcrumbs para rutas de catálogo. */
export function breadcrumbLd(trail: { name: string; path: string }[], lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    inLanguage: lang === "es" ? "es-CL" : "en",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
