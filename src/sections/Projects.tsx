import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/i18n/LanguageContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projects } from "@/data/projects";
import { Section } from "@/ui/Primitives";
import { SectionHeading } from "@/ui/SectionHeading";
import { RevealImage } from "@/ui/Reveal";
import { cn } from "@/utils/cn";

/**
 * 09 — PROYECTOS
 *
 * Solo instalaciones documentadas. Cada ficha muestra ubicación, tecnología y
 * resumen tal como Sender los publica; cuando existe una fuente externa
 * verificable (prensa especializada) se enlaza.
 *
 * Lo que deliberadamente NO aparece:
 *   - años, porque Sender no publica fechas de estos proyectos;
 *   - clientes añadidos por inferencia;
 *   - cifras del tipo "N proyectos completados".
 * La sección declara esa política en su introducción, en lugar de rellenar.
 */
export function Projects() {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const current = projects[active] ?? projects[0];

  return (
    <Section
      id="proyectos"
      className="surface-light bg-paper py-28 sm:py-36 lg:py-44"
      labelledBy="proyectos-title"
    >
      <SectionHeading
        id="proyectos-title"
        kicker={t.projects.kicker}
        lines={t.projects.title}
        intro={t.projects.intro}
      />

      <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-14">
        {/* Visor */}
        <div className="lg:col-span-7">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={reduced ? false : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <RevealImage
                  src={current.image}
                  alt={current.alt[lang]}
                  className="aspect-16/11 border border-line"
                />
              </motion.div>
            </AnimatePresence>

            {/* Overlay técnico */}
            <span
              aria-hidden="true"
              className="grid-tech pointer-events-none absolute inset-0 opacity-40"
            />
            <span aria-hidden="true" className="absolute top-0 left-0 h-px w-full bg-signal" />

            <div className="absolute right-0 bottom-0 left-0 flex flex-wrap items-end justify-between gap-4 bg-ink p-5 sm:p-7">
              <div>
                <span className="label-signal">{current.category[lang]}</span>
                <p className="display bg-ink !text-white mt-2 max-w-[22ch] text-[clamp(1.2rem,3vw,2.1rem)] px-2 py-1">
                  {current.name[lang]}
                </p>
              </div>
              {current.source && (
                <a
                  href={current.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 border border-white/20 bg-transparent px-4 py-2.5 font-mono text-[0.625rem] tracking-[0.18em] !text-white uppercase transition-colors duration-500 hover:border-signal hover:text-signal-soft"
                >
                  {t.projects.view}: {current.source.label[lang]}
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-0.5">
                    ↗
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Detalle del proyecto activo */}
          <dl className="mt-8 grid gap-px sm:grid-cols-3">
            <Detail label={t.projects.sourceLabel} value={current.location[lang]} />
            <Detail
              label={lang === "es" ? "Tecnología" : "Technology"}
              value={current.technology[lang]}
            />
            <Detail
              label={lang === "es" ? "Referencia" : "Reference"}
              value={current.source ? current.source.label[lang] : current.index[lang]}
            />
          </dl>

          <p className="body-tech mt-8 max-w-[64ch]">{current.summary[lang]}</p>
        </div>

        {/* Selector */}
        <div className="lg:col-span-5">
          <ul ref={listRef} className="border-t border-line">
            {projects.map((project, i) => {
              const isActive = i === active;
              return (
                <li key={project.id} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onPointerEnter={() => !reduced && setActive(i)}
                    aria-current={isActive}
                    className={cn(
                      "group relative flex w-full items-start gap-5 px-1 py-6 text-left transition-colors duration-500",
                      isActive ? "bg-signal" : "hover:bg-black/[0.04]",
                    )}
                  >
                    <span
                      className={cn(
                        "mono mt-1 text-[0.625rem] transition-colors duration-500",
                        isActive ? "text-white" : "text-faint",
                      )}
                    >
                      {project.index[lang]}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-[0.9375rem] leading-snug font-medium transition-colors duration-500",
                          isActive ? "text-ink" : "text-ash group-hover:text-ink",
                        )}
                      >
                        {project.name[lang]}
                      </span>
                      <span className="label mt-2 block">{project.location[lang]}</span>
                    </span>

                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1 block h-px w-6 shrink-0 transition-colors duration-500",
                        isActive ? "bg-signal" : "bg-line-strong",
                      )}
                    />

                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute bottom-0 left-0 h-px bg-signal transition-[width] duration-700 ease-out",
                        isActive ? "w-full" : "w-0",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="label mt-6 leading-relaxed">{t.projects.intro}</p>
        </div>
      </div>
    </Section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-line py-5 sm:pr-6">
      <dt className="label">{label}</dt>
      <dd className="mono mt-2 text-[0.8125rem] leading-relaxed text-ink">{value}</dd>
    </div>
  );
}
