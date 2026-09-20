import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLang } from "@/i18n/LanguageContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Section } from "@/ui/Primitives";
import { Kicker } from "@/ui/Primitives";
import { RevealLines } from "@/ui/Reveal";

/**
 * 08 — POR QUÉ SENDER
 *
 * Cuatro palabras a gran escala: EXPERIENCIA · TECNOLOGÍA · CALIDAD ·
 * PERSONALIZACIÓN.
 *
 * Animación pedida en el brief: word reveal + escala + tracking + opacidad +
 * desplazamiento + profundidad. Cada palabra entra con máscara, se asienta
 * desde un tracking abierto y gana opacidad; el texto que la explica sube
 * después. El conjunto se desplaza además en sentido contrario al scroll para
 * dar profundidad, con un desplazamiento distinto por fila.
 */
export function Reasons() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <Section
      id="por-que-sender"
      ref={ref as never}
      className="overflow-hidden bg-carbon py-28 sm:py-36 lg:py-44"
      labelledBy="razones-title"
    >
      <Kicker>{t.reasons.kicker}</Kicker>
      <RevealLines
        id="razones-title"
        as="h2"
        lines={t.reasons.title}
        className="display mt-6 text-display-sm"
      />

      <ul className="mt-16 border-t border-line lg:mt-24">
        {t.reasons.items.map((reason, i) => (
          <ReasonRow
            key={reason.word}
            index={reason.index}
            word={reason.word}
            text={reason.text}
            depth={scrollYProgress}
            offset={(i - 1.5) * (reduced ? 0 : 26)}
            reduced={reduced}
            delay={i * 0.05}
          />
        ))}
      </ul>
    </Section>
  );
}

function ReasonRow({
  index,
  word,
  text,
  depth,
  offset,
  reduced,
  delay,
}: {
  index: string;
  word: string;
  text: string;
  depth: ReturnType<typeof useScroll>["scrollYProgress"];
  offset: number;
  reduced: boolean;
  delay: number;
}) {
  const y = useTransform(depth, [0, 1], [offset, -offset]);
  // El tracking se cierra al entrar: la palabra "se enfoca".
  const tracking = useTransform(
    depth,
    [0.1 + delay, 0.45 + delay],
    ["0.06em", "-0.045em"],
  );

  return (
    <motion.li
      className="group relative border-b border-line py-8 sm:py-10"
      style={reduced ? undefined : { y }}
    >
      <div className="grid items-baseline gap-x-8 gap-y-4 lg:grid-cols-[5rem_minmax(0,1fr)_minmax(0,26rem)]">
        <span className="mono text-[0.625rem] text-faint transition-colors duration-500 group-hover:text-paper">
          {index}
        </span>

        <motion.h3
          className="display text-[clamp(2rem,8vw,6rem)] transition-colors duration-500 group-hover:text-signal-soft"
          style={reduced ? undefined : { letterSpacing: tracking }}
          initial={reduced ? false : { color: "#6f787e" }}
          whileInView={reduced ? undefined : { color: "#e4e8eb" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.h3>

        <motion.p
          className="text-[0.875rem] leading-relaxed text-mute lg:pb-3"
          initial={reduced ? false : { y: 16 }}
          whileInView={reduced ? undefined : { y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {text}
        </motion.p>
      </div>

      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-0 bg-signal transition-[width] duration-[900ms] ease-out group-hover:w-full"
      />
    </motion.li>
  );
}
