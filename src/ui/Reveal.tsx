import type { ReactNode, ElementType } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { cn } from "@/utils/cn";

/** Curva insignia del sistema: salida exponencial, sin rebote. */
export const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  once?: boolean;
  amount?: number;
}

/** Fundido + desplazamiento al entrar en viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
  once = true,
  amount = 0.3,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Revelado por líneas con máscara: cada línea sube desde abajo de su
 * propio recorte. Es el recurso tipográfico principal del sitio.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.11,
  as: Tag = "h2",
  id,
}: {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
  id?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      <Tag id={id} className={className}>
        {lines.map((l, i) => (
          <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <motion.span
              variants={{
                hidden: { y: "108%" },
                show: { y: "0%", transition: { duration: 1.05, ease: EASE } },
              }}
              className={cn("block will-change-transform", lineClassName)}
            >
              {l}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}

/**
 * Revelado palabra por palabra, ligado al scroll del contenedor.
 * Se usa para el texto largo de "La señal": nunca aparece como bloque.
 */
export function RevealOnScroll({
  text,
  className,
  wordClassName,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ["start 0.85", "start 0.25"],
  });

  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1.6 / words.length;
        return (
          <Word key={`${word}-${i}`} range={[start, end]} progress={scrollYProgress}>
            <span className={wordClassName}>{word}</span>
          </Word>
        );
      })}
    </Tag>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block will-change-[opacity]">
      {children}{" "}
    </motion.span>
  );
}

/**
 * Imagen con cortina + asentado de escala, servida con srcset responsive.
 * `srcSet` proviene de `src/content/images.ts`, derivado de fotos reales.
 */
export function RevealImage({
  src,
  srcSet,
  sizes,
  alt,
  className,
  imgClassName,
  delay = 0,
  loading = "lazy",
  priority = false,
}: {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  delay?: number;
  loading?: "lazy" | "eager";
  priority?: boolean;
}) {
  return (
    <motion.div
      className={cn("relative overflow-hidden bg-graphite", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : loading}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={cn("h-full w-full object-cover", imgClassName)}
        variants={{ hidden: { scale: 1.14 }, show: { scale: 1 } }}
        transition={{ duration: 1.7, ease: EASE, delay }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 origin-top bg-ink"
        variants={{ hidden: { scaleY: 1 }, show: { scaleY: 0 } }}
        transition={{ duration: 1.1, ease: EASE, delay }}
        style={{ transformOrigin: "top" }}
      />
    </motion.div>
  );
}

/** Línea técnica que se dibuja sola al entrar en viewport. */
export function DrawLine({
  className,
  delay = 0,
  vertical = false,
}: {
  className?: string;
  delay?: number;
  vertical?: boolean;
}) {
  const hidden = vertical ? { scaleY: 0 } : { scaleX: 0 };
  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        "block bg-signal",
        vertical ? "h-full w-px origin-top" : "h-px w-full origin-left",
        className,
      )}
      initial={hidden}
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    />
  );
}
