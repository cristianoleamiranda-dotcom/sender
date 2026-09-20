import type { Lang, Product, SpecGroup } from "@/content/types";
import { cn } from "@/utils/cn";

/**
 * Tabla de especificaciones técnicas.
 *
 * Es una `<table>` semántica y no una lista decorativa: las especificaciones
 * son datos comparables y los lectores de pantalla las navegan por celda.
 * Cada fila es clave/valor tal como Sender la publica; no se normalizan
 * unidades ni se completan huecos.
 */
export function ProductTechnicalSpecs({
  groups,
  lang,
  title,
  className,
}: {
  groups: SpecGroup[];
  lang: Lang;
  title: string;
  className?: string;
}) {
  if (groups.length === 0) return null;

  return (
    <section className={cn("border-t border-line pt-8", className)} aria-label={title}>
      <h3 className="label-signal">{title}</h3>

      <div className="mt-8 space-y-12">
        {groups.map((group) => (
          <div key={group.title[lang]}>
            <h4 className="mono text-[0.6875rem] tracking-[0.18em] text-paper uppercase">
              {group.title[lang]}
            </h4>

            <table className="mt-5 w-full border-collapse text-left">
              <caption className="sr-only">{group.title[lang]}</caption>
              <tbody>
                {group.rows.map((row) => (
                  <tr
                    key={`${row.k[lang]}-${row.v[lang]}`}
                    className="group border-b border-line transition-colors duration-300 hover:bg-graphite/50"
                  >
                    <th
                      scope="row"
                      className="label w-1/2 py-4 pr-6 font-normal align-top sm:w-2/5"
                    >
                      {row.k[lang]}
                    </th>
                    <td className="mono py-4 text-[0.8125rem] align-top text-paper">
                      {row.v[lang]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Variantes / modelos publicados de un producto. */
export function ProductVariants({
  product,
  lang,
  title,
}: {
  product: Product;
  lang: Lang;
  title: string;
}) {
  if (!product.variants || product.variants.length === 0) return null;

  return (
    <section className="border-t border-line pt-8" aria-label={title}>
      <h3 className="label-signal">{title}</h3>

      <ul className="mt-8 grid gap-px sm:grid-cols-2">
        {product.variants.map((variant) => (
          <li
            key={variant.model[lang]}
            className="group border border-line bg-carbon p-5 transition-colors duration-500 hover:border-signal/50 hover:bg-graphite"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="display text-[clamp(1rem,2vw,1.35rem)] transition-colors duration-500 group-hover:text-signal-soft">
                {variant.model[lang]}
              </span>
              <span className="mono shrink-0 text-[0.75rem] text-paper">{variant.power[lang]}</span>
            </div>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-mute">
              {variant.detail[lang]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
