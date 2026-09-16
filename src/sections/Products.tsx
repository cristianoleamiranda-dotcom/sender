import type { Lang } from "@/content/site";
import { content } from "@/content/site";

interface ProductsProps {
  lang: Lang;
}

export function Products({ lang }: ProductsProps) {
  const t = content[lang].products;
  return (
    <section
      id={t.id}
      className="relative bg-white py-24 sm:py-32 px-5 sm:px-8 border-t border-[#494949]/10"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] tracking-[0.25em] font-medium text-[#1e73be] mb-6">
          {lang === "es" ? "PRODUCTOS" : "PRODUCTS"}
        </p>
        <h2 className="text-[36px] sm:text-[56px] lg:text-[72px] leading-[1.02] tracking-[-0.03em] font-medium text-[#494949] max-w-4xl">
          {t.title}
        </h2>

        <ul className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#494949]/10 border border-[#494949]/10">
          {t.categories.map((cat) => (
            <li
              key={cat.title}
              className="bg-white p-6 sm:p-7 min-h-[140px] flex items-end hover:bg-[#1e73be] hover:text-white transition-colors group"
            >
              <span className="text-[13px] sm:text-[14px] tracking-[0.08em] font-medium text-[#494949] group-hover:text-white transition-colors">
                {cat.title}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[11px] tracking-[0.1em] text-[#494949]/50">
          {lang === "es"
            ? "Solicita el catálogo completo por correo."
            : "Request the full catalog by email."}
        </p>
      </div>
    </section>
  );
}
