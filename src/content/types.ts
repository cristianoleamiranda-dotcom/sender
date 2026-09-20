/**
 * SENDER — Tipos del sistema de contenido.
 *
 * Diseño: se autoriza UN solo árbol de contenido donde cada texto es un par
 * `{ es, en }`. En tiempo de ejecución `resolve(tree, lang)` colapsa ese
 * árbol a strings del idioma activo.
 *
 * Por qué así:
 *  1. Hace **estructuralmente imposible** dejar una clave sin traducir
 *     (ambos idiomas viven en la misma línea).
 *  2. Hace imposible mezclar idiomas en la interfaz: lo que se renderiza
 *     sale siempre del mismo idioma.
 *  3. La nomenclatura técnica universal (AM, FM, HF, VHF, UHF, NAVTEX,
 *     modelos, unidades) se escribe `{ es: "AM", en: "AM" }` a propósito:
 *     es código técnico, no prosa, y no se traduce.
 *  4. Los datos no confirmados NUNCA se inventan: se marcan con
 *     `verified: false` y la UI los oculta hasta que exista el dato real.
 */

export type Lang = "es" | "en";

/** Un texto localizado. */
export interface Loc {
  es: string;
  en: string;
}

/** Árbol de contenido antes de resolver. */
export type ContentTree = {
  [K: string]: Loc | ContentTree | ContentTree[] | Loc[] | string[] | number | boolean | undefined;
};

/** Árbol ya resuelto a un idioma: todos los `Loc` colapsan a `string`. */
export type Resolved<T> = T extends Loc
  ? string
  : T extends (infer U)[]
    ? Resolved<U>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T;

/* ------------------------------------------------------------------ */
/* Navegación                                                          */
/* ------------------------------------------------------------------ */
export interface NavItem {
  id: string;
  href: string;
  label: Loc;
}

export interface NavContent {
  items: NavItem[];
  /** Etiqueta accesible de la navegación principal. */
  main: Loc;
  cta: Loc;
  language: Loc;
  openMenu: Loc;
  closeMenu: Loc;
  location: Loc;
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
export interface HeroContent {
  wordmark: Loc;
  claim: Loc;
  sub: Loc;
  primary: Loc;
  secondary: Loc;
  scroll: Loc;
  hint: Loc;
  meta: Loc[];
}

/* ------------------------------------------------------------------ */
/* Producto / catálogo                                                 */
/* ------------------------------------------------------------------ */
export interface ProductVariant {
  model: Loc;
  power: Loc;
  detail: Loc;
}

export interface SpecRow {
  k: Loc;
  v: Loc;
}

export interface SpecGroup {
  title: Loc;
  rows: SpecRow[];
}

export interface Product {
  slug: string;
  categoryId: string;
  index: Loc;
  name: Loc;
  summary: Loc;
  /** Especificaciones publicadas por Sender. Solo datos verificables. */
  specs: SpecGroup[];
  features: Loc[];
  applications: Loc[];
  variants?: ProductVariant[];
  image: string;
  alt: Loc;
  /** Ficha equivalente en el sitio actual: trazabilidad del dato. */
  sourceUrl?: string;
}

export interface Category {
  id: string;
  slug: string;
  index: Loc;
  name: Loc;
  kicker: Loc;
  description: Loc;
  scope: Loc[];
  productSlugs: string[];
  image: string;
  alt: Loc;
}

/* ------------------------------------------------------------------ */
/* Proyectos documentados                                              */
/* ------------------------------------------------------------------ */
export interface Project {
  id: string;
  index: Loc;
  name: Loc;
  category: Loc;
  location: Loc;
  technology: Loc;
  summary: Loc;
  image: string;
  alt: Loc;
  source?: { label: Loc; url: string };
}

/* ------------------------------------------------------------------ */
/* Bandas / cadena / disciplinas / telemetría                          */
/* ------------------------------------------------------------------ */
export interface Band {
  code: Loc;
  range: Loc;
  use: Loc;
}

export interface ChainStage {
  id: string;
  index: Loc;
  title: Loc;
  text: Loc;
}

export interface Discipline {
  index: Loc;
  name: Loc;
  text: Loc;
}

export interface TelemetryChannel {
  id: string;
  label: Loc;
  unit: Loc;
  range: Loc;
  kind: "bar" | "gauge" | "state";
}

export interface AutomationModule {
  index: Loc;
  title: Loc;
  text: Loc;
}

export interface Reason {
  index: Loc;
  word: Loc;
  text: Loc;
}

export interface Era {
  index: Loc;
  label: Loc;
  text: Loc;
}

export interface Domain {
  index: Loc;
  name: Loc;
  text: Loc;
}

export interface SignalStage {
  index: Loc;
  name: Loc;
  text: Loc;
}

/* ------------------------------------------------------------------ */
/* Sitio completo                                                      */
/* ------------------------------------------------------------------ */
export interface SiteContent {
  nav: NavContent;
  hero: HeroContent;
  signal: {
    kicker: Loc;
    title: Loc[];
    body: Loc[];
    stages: SignalStage[];
  };
  experience: {
    kicker: Loc;
    value: Loc;
    valueLabel: Loc;
    domains: Domain[];
    eras: Era[];
    reach: Loc[];
    note: Loc;
  };
  solutions: {
    kicker: Loc;
    title: Loc[];
    intro: Loc;
    explore: Loc;
    consult: Loc;
    itemsCount: Loc;
    bandsNote: Loc;
  };
  transmission: {
    kicker: Loc;
    title: Loc[];
    intro: Loc;
    stages: ChainStage[];
    note: Loc;
  };
  engineering: {
    kicker: Loc;
    title: Loc[];
    intro: Loc;
    disciplines: Discipline[];
  };
  featured: {
    kicker: Loc;
    title: Loc[];
    intro: Loc;
    view: Loc;
  };
  automation: {
    kicker: Loc;
    title: Loc[];
    intro: Loc;
    modules: AutomationModule[];
    channels: TelemetryChannel[];
    note: Loc;
    statusOnline: Loc;
    statusSimulated: Loc;
  };
  reasons: {
    kicker: Loc;
    title: Loc[];
    items: Reason[];
  };
  projects: {
    kicker: Loc;
    title: Loc[];
    intro: Loc;
    view: Loc;
    sourceLabel: Loc;
  };
  contact: {
    kicker: Loc;
    title: Loc;
    sub: Loc;
    primary: Loc;
    whatsapp: Loc;
    products: Loc;
    labels: {
      address: Loc;
      phone: Loc;
      email: Loc;
      salesEmail: Loc;
      map: Loc;
    };
    form: {
      title: Loc;
      name: Loc;
      company: Loc;
      email: Loc;
      type: Loc;
      message: Loc;
      submit: Loc;
      preparing: Loc;
      note: Loc;
      types: Loc[];
    };
  };
  footer: {
    claim: Loc;
    nav: Loc;
    catalog: Loc;
    reach: Loc;
    channels: Loc;
    legal: Loc;
    back: Loc;
  };
  productPage: {
    back: Loc;
    allCategories: Loc;
    overview: Loc;
    specs: Loc;
    features: Loc;
    applications: Loc;
    variants: Loc;
    documentation: Loc;
    docsPending: Loc;
    consult: Loc;
    quoteWhatsapp: Loc;
    related: Loc;
    category: Loc;
    source: Loc;
    notFound: Loc;
  };
  catalogPage: {
    kicker: Loc;
    title: Loc[];
    intro: Loc;
    products: Loc;
    viewCategory: Loc;
    allProducts: Loc;
  };
}

/** `SiteContent` con todos los `Loc` resueltos a `string`. */
export type SiteCopy = Resolved<SiteContent>;
