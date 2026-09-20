import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { categories, products, productsOfCategory } from "@/content/catalog";
import { ProductCard } from "./ProductCard";
import { cn } from "@/utils/cn";

/**
 * EXPLORADOR DE PRODUCTOS
 *
 * Arquitectura pensada para crecer sin rehacer nada: el explorador no conoce
 * los productos, los recibe del catálogo. Añadir un equipo es añadir una
 * entrada en `src/content/catalog.ts` y aparece en su categoría, en la ficha
 * y en los relacionados.
 *
 * Filtro por estación con estado en la URL opcional (`initialCategory`), de
 * modo que cada categoría tiene su propia dirección — requisito del brief
 * para poder indexar `/productos/transmisores-fm` por separado.
 */
export function ProductExplorer({
  initialCategory,
  showFilter = true,
}: {
  initialCategory?: string;
  showFilter?: boolean;
}) {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<string | null>(initialCategory ?? null);

  const visible = useMemo(() => {
    if (!filter) return products;
    return productsOfCategory(filter);
  }, [filter]);

  const activeCategory = filter ? categories.find((c) => c.slug === filter) : null;

  return (
    <div>
      {showFilter && (
        <div
          className="flex flex-wrap items-center gap-2 border-y border-line py-4"
          role="group"
          aria-label={t.catalogPage.products}
        >
          <FilterChip
            active={filter === null}
            onClick={() => setFilter(null)}
            label={t.catalogPage.allProducts}
            count={products.length}
          />
          {categories.map((category) => (
            <FilterChip
              key={category.id}
              active={filter === category.slug}
              onClick={() => setFilter(category.slug)}
              label={category.name[lang]}
              index={category.index[lang]}
              count={productsOfCategory(category.slug).length}
            />
          ))}
        </div>
      )}

      {activeCategory && (
        <div className="mt-10 max-w-[72ch]">
          <p className="lead">{activeCategory.description[lang]}</p>
          <Link
            to={`/productos/${activeCategory.slug}`}
            className="label mt-5 inline-flex items-center gap-2 text-signal-soft transition-colors duration-300 hover:text-paper"
          >
            {t.catalogPage.viewCategory}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="label mt-12">{t.productPage.notFound}</p>
      ) : (
        <ul
          className={cn(
            "mt-12 grid gap-6",
            visible.length === 1
              ? "sm:grid-cols-1"
              : "sm:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {visible.map((product, i) => (
            <ProductCard
              key={product.slug}
              product={product}
              lang={lang}
              viewLabel={t.featured.view}
              index={i}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  index,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  index?: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group inline-flex items-center gap-2.5 border px-4 py-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase transition-colors duration-400",
        active
          ? "border-signal bg-signal text-paper"
          : "border-line text-mute hover:border-line-strong hover:text-paper",
      )}
    >
      {index && (
        <span className={cn("text-[0.5625rem]", active ? "text-paper" : "text-faint")}>
          {index}
        </span>
      )}
      {label}
      <span className={cn("text-[0.5625rem]", active ? "text-paper" : "text-faint")}>
        {String(count).padStart(2, "0")}
      </span>
    </button>
  );
}
