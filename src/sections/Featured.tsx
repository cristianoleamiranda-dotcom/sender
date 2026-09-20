import { useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { productBySlug } from "@/content/catalog";
import type { Product } from "@/content/types";
import { Section } from "@/ui/Primitives";
import { SectionHeading } from "@/ui/SectionHeading";
import { ProductCard } from "@/components/products/ProductCard";

/**
 * 06 — PRODUCTOS DESTACADOS
 *
 * Presentación editorial de los equipos que mejor representan cada línea,
 * con fotografía REAL del repositorio. No se usa ninguna imagen generada
 * ni de stock: si Sender no publicó foto de un equipo, ese equipo no entra
 * en destacados.
 *
 * El primer producto se muestra a doble ancho para romper la cuadrícula y
 * dar jerarquía; el resto en tres columnas.
 */
const FEATURED_SLUGS = [
  "serie-sender-ss",
  "sistema-navtex-490-518",
  "serie-fm",
  "stl-stal-200",
  "bis-ap735",
  "antena-hf-2-30",
  "antenas-monopolo-am",
] as const;

export function Featured() {
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const items = FEATURED_SLUGS.map((slug) => productBySlug.get(slug)).filter(
    (p): p is Product => Boolean(p),
  );

  if (items.length === 0) return null;

  const [lead, ...rest] = items;

  return (
    <Section
      id="productos"
      className="bg-carbon py-28 sm:py-36 lg:py-44"
      labelledBy="productos-title"
    >
      <SectionHeading
        id="productos-title"
        kicker={t.featured.kicker}
        lines={t.featured.title}
        intro={t.featured.intro}
        aside={
          <button
            type="button"
            onClick={() => navigate("/productos")}
            className="group inline-flex items-center gap-3 border border-line-strong px-6 py-3.5 font-mono text-[0.6875rem] tracking-[0.2em] text-paper uppercase transition-colors duration-500 hover:border-signal hover:text-signal-soft"
          >
            {t.catalogPage.allProducts}
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </button>
        }
      />

      {/* Destacado principal a doble ancho */}
      <ul className="mt-16 grid gap-6">
        <ProductCard
          product={lead}
          lang={lang}
          viewLabel={t.featured.view}
          layout="wide"
        />
      </ul>

      {/* Resto del destacado */}
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {rest.map((product, i) => (
          <ProductCard
            key={product.slug}
            product={product}
            lang={lang}
            viewLabel={t.featured.view}
            index={i}
          />
        ))}
      </ul>
    </Section>
  );
}
