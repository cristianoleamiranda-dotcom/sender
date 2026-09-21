import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { categoryById } from "@/content/catalog";
import type { Lang, Product, SpecRow } from "@/content/types";
import { cn } from "@/utils/cn";

/**
 * Tarjeta de producto reutilizable.
 *
 * Presentación premium según el brief: fondo oscuro, iluminación controlada,
 * escala cinematográfica y, al pasar el cursor, el producto crece ligeramente,
 * aparecen las líneas técnicas, aparecen los datos disponibles y se ofrece el
 * CTA "VER PRODUCTO".
 *
 * Solo muestra datos que existen en la ficha: si un producto no tiene filas de
 * especificación, ese bloque no se renderiza. Sin campos vacíos ni relleno.
 */
export function ProductCard({
  product,
  lang,
  viewLabel,
  className,
  index = 0,
  layout = "grid",
}: {
  product: Product;
  lang: Lang;
  viewLabel: string;
  className?: string;
  index?: number;
  /** `grid` para catálogos, `wide` para destacados editoriales. */
  layout?: "grid" | "wide";
}) {
  const reduced = useReducedMotion();
  const category = categoryById.get(product.categoryId);
  const specRows: SpecRow[] = product.specs
    .flatMap((g) => g.rows)
    .slice(0, layout === "wide" ? 4 : 3);

  const media: ReactElement = (
    <CardMedia
      product={product}
      lang={lang}
      category={category?.name[lang]}
      specRows={specRows}
      wide={layout === "wide"}
    />
  );

  const footer: ReactElement = (
    <CardFooter
      product={product}
      lang={lang}
      viewLabel={viewLabel}
      wide={layout === "wide"}
    />
  );

  return (
    <motion.li
      className={cn("relative", className)}
      initial={reduced ? false : { y: 30 }}
      whileInView={reduced ? undefined : { y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/producto/${product.slug}`}
        className={cn(
          "group flex h-full flex-col border border-line bg-carbon transition-colors duration-500 hover:border-signal/60 hover:bg-graphite focus-visible:border-signal",
          layout === "wide" && "lg:flex-row",
        )}
      >
        {layout === "wide" ? (
          <>
            <div className="lg:w-1/2">{media}</div>
            <div className="flex flex-1 flex-col">{footer}</div>
          </>
        ) : (
          <>
            {media}
            {footer}
          </>
        )}
      </Link>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
function CardMedia({
  product,
  lang,
  category,
  specRows,
  wide,
}: {
  product: Product;
  lang: Lang;
  category?: string;
  specRows: SpecRow[];
  wide: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-graphite",
        wide ? "aspect-16/10 lg:h-full lg:aspect-auto lg:min-h-[340px]" : "aspect-4/3",
      )}
    >
      <img
        src={product.image}
        alt={product.alt[lang]}
        loading="lazy"
        decoding="async"
        width={640}
        height={480}
        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.055]"
      />

      {/* Iluminación controlada */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            "linear-gradient(160deg, rgba(8,9,10,0.12) 0%, rgba(8,9,10,0.5) 45%, rgba(8,9,10,0.92) 100%)",
        }}
      />
      {/* Overlay técnico: solo al hover */}
      <span
        aria-hidden="true"
        className="grid-tech pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-70"
      />
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-px w-full scale-x-0 origin-left bg-signal transition-transform duration-700 ease-out group-hover:scale-x-100"
      />
      <span
        aria-hidden="true"
        className="absolute right-0 bottom-0 h-px w-full scale-x-0 origin-left bg-signal transition-transform duration-700 ease-out group-hover:scale-x-100"
      />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4">
        <span className="mono text-[0.625rem] text-paper/90">{product.index[lang]}</span>
        {category && (
          <span className="label max-w-[18ch] truncate text-right text-paper/80">{category}</span>
        )}
      </div>

      {/* Datos disponibles, revelados al hover (y al foco de teclado) */}
      {specRows.length > 0 && (
        <dl className="absolute inset-x-0 bottom-0 translate-y-2 space-y-1.5 p-4 opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          {specRows.map((row) => (
            <div
              key={`${row.k[lang]}-${row.v[lang]}`}
              className="flex items-baseline justify-between gap-4"
            >
              <dt className="mono truncate text-[0.5625rem] tracking-[0.16em] text-paper/80 uppercase">
                {row.k[lang]}
              </dt>
              <dd className="mono shrink-0 text-[0.625rem] text-paper">{row.v[lang]}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
function CardFooter({
  product,
  lang,
  viewLabel,
  wide,
}: {
  product: Product;
  lang: Lang;
  viewLabel: string;
  wide: boolean;
}) {
  return (
    <div className={cn("flex flex-1 flex-col justify-between gap-5 p-5 sm:p-6", wide && "lg:p-9")}>
      <div>
        <h3
          className={cn(
            "display transition-colors duration-500 group-hover:text-signal-soft",
            wide
              ? "text-[clamp(1.4rem,2.9vw,2.3rem)]"
              : "text-[clamp(1.05rem,2.2vw,1.5rem)]",
          )}
        >
          {product.name[lang]}
        </h3>
        <p
          className={cn(
            "mt-3 text-[0.8125rem] leading-relaxed text-mute",
            wide ? "max-w-[62ch]" : "line-clamp-3 max-w-[38ch]",
          )}
        >
          {product.summary[lang]}
        </p>
      </div>

      <span className="flex items-center gap-3 font-mono text-[0.625rem] tracking-[0.2em] text-paper uppercase">
        {viewLabel}
        <span aria-hidden="true" className="h-px w-6 bg-signal transition-all duration-500 group-hover:w-10" />
      </span>
    </div>
  );
}
