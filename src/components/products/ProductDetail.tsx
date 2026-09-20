import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { categoryById, relatedProducts } from "@/content/catalog";
import type { Product } from "@/content/types";
import { ProductCard } from "./ProductCard";
import { ProductCTA } from "./ProductCTA";
import {
  ProductTechnicalSpecs,
  ProductVariants,
} from "./ProductTechnicalSpecs";
import { company } from "@/content/company";

/**
 * FICHA DE PRODUCTO
 *
 * Composición fija, pensada para que cualquier equipo nuevo encaje sin
 * rehacer la página:
 *   cabecera + imagen real → descripción → especificaciones → modelos →
 *   características → aplicación → documentación/CTA → relacionados.
 *
 * Cada bloque se omite si el producto no trae el dato. Así un equipo del que
 * Sender solo publica una descripción no muestra tablas vacías ni texto
 * inventado para llenar el hueco.
 */
export function ProductDetail({ product }: { product: Product }) {
  const { t, lang } = useLang();
  const category = categoryById.get(product.categoryId);
  const related = relatedProducts(product, 3);

  return (
    <article className="bg-ink">
      {/* ---------- Cabecera ---------- */}
      <header className="border-b border-line px-5 py-8 sm:px-8 lg:px-12 lg:py-10 xl:px-16">
        <div className="mx-auto w-full max-w-[1600px]">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-3">
              <li>
                <Link to="/" className="label transition-colors duration-300 hover:text-signal-soft">
                  {company.name}
                </Link>
              </li>
              <li aria-hidden="true" className="text-faint">/</li>
              <li>
                <Link
                  to="/productos"
                  className="label transition-colors duration-300 hover:text-signal-soft"
                >
                  {t.productPage.allCategories}
                </Link>
              </li>
              {category && (
                <>
                  <li aria-hidden="true" className="text-faint">/</li>
                  <li>
                    <Link
                      to={`/productos/${category.slug}`}
                      className="label transition-colors duration-300 hover:text-signal-soft"
                    >
                      {category.name[lang]}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true" className="text-faint">/</li>
              <li>
                <span className="label-signal">{product.index[lang]}</span>
              </li>
            </ol>
          </nav>

          <h1 className="display mt-8 max-w-[16ch] text-display-sm">
            {product.name[lang]}
          </h1>

          {category && (
            <p className="label mt-5">
              {t.productPage.category}: {category.name[lang]} · {category.kicker[lang]}
            </p>
          )}
        </div>
      </header>

      {/* ---------- Cuerpo ---------- */}
      <div className="mx-auto w-full max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Imagen real */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden border border-line bg-graphite">
              <img
                src={product.image}
                alt={product.alt[lang]}
                width={960}
                height={720}
                fetchPriority="high"
                decoding="async"
                className="aspect-4/3 w-full object-cover"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(8,9,10,0) 40%, rgba(8,9,10,0.7) 100%)",
                }}
              />
              <span aria-hidden="true" className="absolute top-0 left-0 h-px w-full bg-signal" />
              {product.sourceUrl && (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label absolute right-0 bottom-0 p-4 text-paper/60 transition-colors duration-300 hover:text-signal-soft"
                >
                  {t.productPage.source} ↗
                </a>
              )}
            </div>

            {/* Aplicaciones */}
            {product.applications.length > 0 && (
              <section className="mt-12" aria-label={t.productPage.applications}>
                <h2 className="label-signal">{t.productPage.applications}</h2>
                <ul className="mt-6 grid gap-px sm:grid-cols-2">
                  {product.applications.map((app) => (
                    <li
                      key={app[lang]}
                      className="flex items-start gap-3 border-b border-line py-3.5"
                    >
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-signal" />
                      <span className="text-[0.875rem] leading-relaxed text-mute">{app[lang]}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Información técnica */}
          <div className="lg:col-span-5">
            <section aria-label={t.productPage.overview}>
              <h2 className="label-signal">{t.productPage.overview}</h2>
              <p className="lead mt-5">{product.summary[lang]}</p>
            </section>

            {product.features.length > 0 && (
              <section className="mt-12 border-t border-line pt-8" aria-label={t.productPage.features}>
                <h2 className="label-signal">{t.productPage.features}</h2>
                <ul className="mt-6 space-y-3.5">
                  {product.features.map((feature) => (
                    <li key={feature[lang]} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mono mt-0.5 text-[0.625rem] text-signal">
                        —
                      </span>
                      <span className="text-[0.875rem] leading-relaxed text-mute">
                        {feature[lang]}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-12 space-y-12">
              <ProductTechnicalSpecs
                groups={product.specs}
                lang={lang}
                title={t.productPage.specs}
              />
              <ProductVariants product={product} lang={lang} title={t.productPage.variants} />
            </div>

            <ProductCTA product={product} className="mt-12" />
          </div>
        </div>

        {/* ---------- Relacionados ---------- */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-line pt-14 lg:mt-32" aria-label={t.productPage.related}>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="display text-display-xs">{t.productPage.related}</h2>
              <Link
                to="/productos"
                className="label transition-colors duration-300 hover:text-signal-soft"
              >
                {t.catalogPage.allProducts} →
              </Link>
            </div>

            <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((item, i) => (
                <ProductCard
                  key={item.slug}
                  product={item}
                  lang={lang}
                  viewLabel={t.featured.view}
                  index={i}
                />
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
