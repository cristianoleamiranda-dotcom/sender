import { useState } from "react";
import { motion } from "motion/react";
import { useLang } from "@/i18n/LanguageContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Section } from "@/ui/Primitives";
import { SectionHeading } from "@/ui/SectionHeading";
import { cn } from "@/utils/cn";

/**
 * 05 — INGENIERÍA
 *
 * "No solo vendemos equipos. Diseñamos soluciones."
 *
 * Las seis disciplinas forman una red: están unidas por líneas técnicas que
 * se dibujan al entrar en viewport y se iluminan cuando el cursor pasa por
 * cualquier nodo. La sensación buscada es la de un sistema técnico vivo,
 * no la de una lista de servicios.
 *
 * El grafo es SVG estático con `stroke-dashoffset` animado: mismo resultado
 * visual que un motor 3D, coste prácticamente nulo.
 */

/**
 * Coordenadas normalizadas (0–100) de cada nodo del grafo.
 * Se corresponden, en orden, con `disciplines` del contenido.
 */
const NODES = [
  { x: 14, y: 26 },
  { x: 50, y: 12 },
  { x: 86, y: 26 },
  { x: 14, y: 78 },
  { x: 50, y: 92 },
  { x: 86, y: 78 },
];

/** Aristas del sistema: qué disciplina alimenta a cuál. */
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [2, 5],
  [3, 4],
  [4, 5],
  [1, 4],
  [0, 4],
  [2, 4],
  [3, 1],
  [5, 1],
];

export function Engineering() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  const disciplines = t.engineering.disciplines;

  return (
    <Section
      id="ingenieria"
      className="relative overflow-hidden surface-light bg-paper py-28 sm:py-36 lg:py-44"
      labelledBy="ingenieria-title"
    >
      <SectionHeading
        id="ingenieria-title"
        kicker={t.engineering.kicker}
        lines={t.engineering.title}
        intro={t.engineering.intro}
        titleClassName="max-w-[18ch]"
      />

      {/* ---------- Grafo del sistema ---------- */}
      <div className="relative mt-20 lg:mt-28">
        {/* SVG solo aporta las líneas en escritorio; en móvil la red se
            simplifica a una lista para no dibujar un grafo ilegible. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        >
          {EDGES.map(([a, b], i) => {
            const lit = hovered === a || hovered === b;
            return (
              <motion.line
                key={`${a}-${b}`}
                x1={NODES[a].x}
                y1={NODES[a].y}
                x2={NODES[b].x}
                y2={NODES[b].y}
                vectorEffect="non-scaling-stroke"
                stroke={lit ? "#4f9ad8" : "rgba(255,255,255,0.11)"}
                strokeWidth={lit ? 1.2 : 0.6}
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 1.4,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ transition: "stroke 400ms, stroke-width 400ms" }}
              />
            );
          })}
        </svg>

        {/* Nodos */}
        <ul
          className="relative grid gap-px sm:grid-cols-2 lg:min-h-[520px] lg:grid-cols-3"
          onMouseLeave={() => setHovered(null)}
        >
          {disciplines.map((d, i) => {
            const isHovered = hovered === i;
            return (
              <li
                key={d.name}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className={cn(
                  "group relative bg-ink px-1 py-8 transition-colors duration-500 sm:px-6",
                  isHovered && "bg-graphite/70",
                )}
              >
                <motion.div
                  initial={reduced ? false : { y: 26 }}
                  whileInView={reduced ? undefined : { y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block h-2 w-2 shrink-0 transition-all duration-500",
                        isHovered ? "scale-125 bg-signal-soft" : "bg-steel",
                      )}
                    />
                    <span className="mono text-[0.625rem] text-faint">{d.index}</span>
                  </div>

                  <h3
                    className={cn(
                      "display mt-4 text-[clamp(1.35rem,3.2vw,2.4rem)] transition-colors duration-500",
                      isHovered ? "text-signal-soft" : "text-paper/90",
                    )}
                  >
                    {d.name}
                  </h3>

                  <p className="mt-3 max-w-[34ch] text-[0.8125rem] leading-relaxed text-mute">
                    {d.text}
                  </p>
                </motion.div>

                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute bottom-0 left-0 h-px bg-signal transition-[width] duration-700 ease-out sm:left-6",
                    isHovered ? "w-[calc(100%-3rem)]" : "w-0",
                  )}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
