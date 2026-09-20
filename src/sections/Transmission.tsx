import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLang } from "@/i18n/LanguageContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAnchorNavigation } from "@/hooks/useAnchorNavigation";
import { Section } from "@/ui/Primitives";
import { SectionHeading } from "@/ui/SectionHeading";
import { cn } from "@/utils/cn";

/**
 * 04 — TRANSMISIÓN
 *
 * Narrativa visual de la cadena:
 *   ESTUDIO → PROCESAMIENTO → TRANSMISIÓN → ENLACE RF → ANTENA → AUDIENCIA
 *
 * Un pulso de señal recorre el bus a medida que se avanza en el scroll y cada
 * nodo se enciende cuando el pulso lo alcanza. No es un diagrama corporativo:
 * es la misma señal viajando entre etapas.
 *
 * Cada etapa enlaza a la categoría del catálogo que la resuelve, cumpliendo la
 * regla de llegar a un producto en 2–3 interacciones.
 */

/** Categoría del catálogo que resuelve cada etapa de la cadena. */
const STAGE_CATEGORY: Record<string, string> = {
  studio: "procesamiento-de-audio",
  processing: "procesamiento-de-audio",
  transmission: "transmisores-am",
  "rf-link": "stl-enlaces",
  antenna: "rf-y-componentes",
  audience: "soluciones-especiales",
};

export function Transmission() {
  const { t } = useLang();
  const go = useAnchorNavigation();
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.85", "end 0.45"],
  });

  const stages = t.transmission.stages;
  const pulseX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const pulseOpacity = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [0, 1, 1, 0]);

  return (
    <Section
      id="transmision"
      className="relative overflow-hidden bg-carbon py-28 sm:py-36 lg:py-44"
      labelledBy="transmision-title"
    >
      {/* Retícula de fondo: da profundidad sin WebGL */}
      <div aria-hidden="true" className="grid-tech pointer-events-none absolute inset-0 opacity-45" />

      <div className="relative">
        <SectionHeading
          id="transmision-title"
          kicker={t.transmission.kicker}
          lines={t.transmission.title}
          intro={t.transmission.intro}
          aside={
            <button
              type="button"
              onClick={() => go("/productos")}
              className="group inline-flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.2em] text-paper uppercase transition-colors duration-300 hover:text-signal-soft"
            >
              {t.catalogPage.allProducts}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </button>
          }
        />

        {/* ---------- Bus de señal ---------- */}
        <div ref={trackRef} className="relative mt-20 lg:mt-28">
          {/* Riel */}
          <div aria-hidden="true" className="absolute inset-x-0 top-[26px] hidden h-px bg-line lg:block" />
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-[13px] w-px bg-line lg:hidden" />

          {/* Pulso que viaja (escritorio: horizontal / móvil: se omite) */}
          {!reduced && (
            <motion.div
              aria-hidden="true"
              className="absolute top-[26px] left-0 hidden h-px w-40 -translate-y-1/2 lg:block"
              style={{
                x: pulseX,
                opacity: pulseOpacity,
                background:
                  "linear-gradient(90deg, transparent, rgba(30,115,190,0.9), rgba(79,154,216,1))",
                boxShadow: "0 0 18px rgba(30,115,190,0.6)",
              }}
            />
          )}

          <ol className="grid gap-y-12 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-0">
            {stages.map((stage, i) => {
              const position = stages.length > 1 ? i / (stages.length - 1) : 0;
              const category = STAGE_CATEGORY[stage.id];
              return (
                <StageNode
                  key={stage.id}
                  index={stage.index}
                  title={stage.title}
                  text={stage.text}
                  position={position}
                  progress={scrollYProgress}
                  reduced={reduced}
                  onOpen={
                    category
                      ? () => go(`/productos/${category}`)
                      : undefined
                  }
                  ctaLabel={t.solutions.explore}
                />
              );
            })}
          </ol>
        </div>

        <p className="label mt-16 max-w-[76ch] leading-relaxed lg:mt-24">
          {t.transmission.note}
        </p>
      </div>
    </Section>
  );
}

function StageNode({
  index,
  title,
  text,
  position,
  progress,
  reduced,
  onOpen,
  ctaLabel,
}: {
  index: string;
  title: string;
  text: string;
  position: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduced: boolean;
  onOpen?: () => void;
  ctaLabel: string;
}) {
  // El nodo se enciende cuando el pulso pasa por su posición.
  const glow = useTransform(progress, [position * 0.85, position * 0.85 + 0.12], [0.18, 1]);
  const haloScale = useTransform(progress, [position * 0.85, position * 0.85 + 0.12], [1, 2.4]);
  const haloOpacity = useTransform(progress, [position * 0.85, position * 0.85 + 0.18], [0.55, 0]);

  return (
    <li className="group relative pl-10 lg:pl-0">
      {/* Nodo */}
      <span aria-hidden="true" className="absolute top-[18px] left-0 flex h-[18px] w-[18px] items-center justify-center lg:top-[18px] lg:left-0">
        <motion.span
          className="absolute h-[18px] w-[18px] rounded-full border border-signal"
          style={reduced ? undefined : { scale: haloScale, opacity: haloOpacity }}
        />
        <motion.span
          className="h-[7px] w-[7px] bg-signal-soft"
          style={reduced ? undefined : { opacity: glow }}
        />
      </span>

      <div className={cn("lg:pt-14")}>
        <span className="mono block text-[0.625rem] text-faint">{index}</span>
        <h3 className="display mt-2 text-[clamp(1.05rem,2.2vw,1.5rem)] transition-colors duration-500 group-hover:text-signal-soft">
          {title}
        </h3>
        <p className="mt-3 max-w-[30ch] text-[0.8125rem] leading-relaxed text-mute">{text}</p>

        {onOpen && (
          <button
            type="button"
            onClick={onOpen}
            className="label mt-5 inline-flex items-center gap-2 text-faint transition-colors duration-300 hover:text-signal-soft"
          >
            {ctaLabel}
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </li>
  );
}
