import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLang } from "@/i18n/LanguageContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAnchorNavigation } from "@/hooks/useAnchorNavigation";
import { Section } from "@/ui/Primitives";
import { SectionHeading } from "@/ui/SectionHeading";
import { RevealOnScroll } from "@/ui/Reveal";
import { SignalWave } from "@/ui/SignalWave";
import { cn } from "@/utils/cn";

/**
 * 01 — LA SEÑAL
 *
 * "La señal no se ve. Se experimenta."
 *
 * El texto no aparece como bloque: se ilumina palabra por palabra ligado al
 * scroll (`RevealOnScroll`). Debajo, la visualización recorre ONDA →
 * FRECUENCIA → DATOS → RF → TRANSMISIÓN y los cinco nodos se encienden
 * a medida que la señal avanza.
 */
export function Signal() {
  const { t } = useLang();
  const go = useAnchorNavigation();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section
      id="senal"
      ref={ref as never}
      className="overflow-hidden surface-light bg-paper py-28 sm:py-36 lg:py-44"
      labelledBy="senal-title"
    >
      <SectionHeading
        id="senal-title"
        kicker={t.signal.kicker}
        lines={t.signal.title}
        titleClassName="max-w-[12ch]"
      />

      <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
        {/* Columna de texto: revelado progresivo, nunca bloque */}
        <div className="lg:col-span-7">
          {t.signal.body.map((paragraph, i) => (
            <RevealOnScroll
              key={i}
              text={paragraph}
              className={cn(
                "lead max-w-[52ch]",
                i > 0 && "mt-6",
              )}
            />
          ))}

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              onClick={() => go("/productos")}
              className="group inline-flex items-center justify-center gap-3 border border-black/15 bg-white px-7 py-3.5 font-mono text-[0.6875rem] tracking-[0.2em] text-ink uppercase transition-colors duration-500 hover:border-signal hover:text-signal-soft"
            >
              {t.solutions.explore}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </button>
            <button
              type="button"
              onClick={() => go("/#transmision")}
              className="label px-2 py-3 text-mute transition-colors duration-300 hover:text-signal-soft"
            >
              {t.transmission.title.join(" ")}
              <span aria-hidden="true" className="ml-2 text-signal">↓</span>
            </button>
          </div>
        </div>

        {/* Columna de lectura técnica */}
        <div className="lg:col-span-5">
          <div className="border-l border-line pl-6">
            <span className="label">{t.signal.stages.length} etapas</span>
            <ol className="mt-6 space-y-5">
              {t.signal.stages.map((stage, i) => (
                <StageRow
                  key={stage.name}
                  index={stage.index}
                  name={stage.name}
                  text={stage.text}
                  progress={scrollYProgress}
                  position={i / t.signal.stages.length}
                  reduced={reduced}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Visualización: onda -> frecuencia -> datos -> RF -> transmisión */}
      <div className="relative mt-20 lg:mt-28">
        <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-line" />
        <SignalWave height={reduced ? 120 : 220} phase={reduced ? 0.12 : undefined} />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px bg-signal"
          style={{ width: reduced ? "100%" : fill }}
        />
      </div>
    </Section>
  );
}

function StageRow({
  index,
  name,
  text,
  progress,
  position,
  reduced,
}: {
  index: string;
  name: string;
  text: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  position: number;
  reduced: boolean;
}) {
  /*
    La etapa se "enciende" al llegar el scroll, pero nunca animando opacidad:
    con un suelo de 0.3 el nombre quedaba en 2.58:1 y el texto en 1.94:1, y
    como el efecto va ligado al scroll ese estado bajo no es transitorio sino
    el reposo de las etapas que todavía no se recorrieron. Se anima el color,
    de un gris del sistema al color final: ambos extremos cumplen WCAG AA
    (mute 8.2:1, paper 19.4:1, faint 6.9:1 sobre tinta).
  */
  // `InputRange` de Motion es mutable: por eso el tipo explícito y no `as const`.
  const range: [number, number] = [position * 0.6, position * 0.6 + 0.35];
  const nameColor = useTransform(progress, range, ["#5e6b7a", "#08090a"]);
  const textColor = useTransform(progress, range, ["#6b7784", "#2a343d"]);
  const x = useTransform(progress, range, [-8, 0]);

  return (
    <motion.li className="flex items-baseline gap-4" style={reduced ? undefined : { x }}>
      <span aria-hidden="true" className="mono w-4 shrink-0 text-[0.625rem] text-signal-soft">
        {index}
      </span>
      <div>
        <motion.span
          className={cn("mono block text-[0.6875rem] tracking-[0.2em] uppercase", reduced && "text-ink")}
          style={reduced ? undefined : { color: nameColor }}
        >
          {name}
        </motion.span>
        <motion.span
          className={cn("mt-1 block text-[0.8125rem] leading-relaxed", reduced && "text-ash")}
          style={reduced ? undefined : { color: textColor }}
        >
          {text}
        </motion.span>
      </div>
    </motion.li>
  );
}
