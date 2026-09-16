import type { Lang } from "@/content/site";
import { content } from "@/content/site";

interface WorkProps {
  lang: Lang;
}

export function Work({ lang }: WorkProps) {
  const t = content[lang].work;
  return (
    <section
      id={t.id}
      className="relative bg-[#494949] text-white py-24 sm:py-32 px-5 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] tracking-[0.25em] font-medium text-[#1e73be] mb-6">
          {lang === "es" ? "PROYECTOS" : "PROJECTS"}
        </p>
        <h2 className="text-[36px] sm:text-[56px] lg:text-[72px] leading-[1.02] tracking-[-0.03em] font-medium text-white max-w-4xl">
          {t.title}
        </h2>

        <ul className="mt-16 divide-y divide-white/15 border-y border-white/15">
          {t.categories.map((cat, i) => (
            <li
              key={cat.title}
              className="group flex items-center justify-between py-6 sm:py-7 hover:pl-2 transition-all"
            >
              <div className="flex items-baseline gap-6">
                <span className="text-[11px] tracking-[0.2em] text-white/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[20px] sm:text-[28px] tracking-[-0.01em] font-medium text-white group-hover:text-[#1e73be] transition-colors">
                  {cat.title}
                </span>
              </div>
              <span className="text-[11px] tracking-[0.2em] text-white/40 group-hover:text-[#1e73be] transition-colors">
                →
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[11px] tracking-[0.1em] text-white/50 max-w-md">
          {lang === "es"
            ? "Proyectos seleccionados disponibles bajo solicitud."
            : "Selected projects available upon request."}
        </p>
      </div>
    </section>
  );
}
