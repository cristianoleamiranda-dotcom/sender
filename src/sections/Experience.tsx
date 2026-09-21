import { useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useLang } from "@/i18n/LanguageContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Section } from "@/ui/Primitives";
import { SectionHeading } from "@/ui/SectionHeading";
import { DrawLine } from "@/ui/Reveal";
import { cn } from "@/utils/cn";

/**
 * 02 — EXPERIENCIA
 *
 * El número +20 es el elemento principal, a escala masiva. Debajo, las cuatro
 * áreas se comportan como módulos tecnológicos: entran desplazándose, se
 * iluminan, reaccionan al cursor y quedan conectadas por un bus técnico.
 *
 * CONTENIDO: solo el dato confirmado ("más de 20 años"). La versión anterior
 * del sitio publicaba "100% cobertura nacional", "24/7 operación crítica" y
 * "RF precisión técnica" como estadísticas: ninguna está documentada, así que
 * no se muestran. Tampoco se inventan cantidades de proyectos ni años de hitos.
 */
export function Experience() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const counterRef = useRef<HTMLDivElement>(null);
  const busRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: counterRef,
    offset: ["start 0.8", "start 0.25"],
  });
  const busProgress = useScroll({
    target: busRef,
    offset: ["start 0.9", "end 0.6"],
  }).scrollYProgress;

  return (
    <Section id="empresa" className="surface-light bg-paper py-28 sm:py-36 lg:py-44" labelledBy="empresa-title">
      <SectionHeading
        id="empresa-title"
        kicker={t.experience.kicker}
        lines={[t.experience.valueLabel, ...t.experience.reach]}
        intro={t.experience.note}
        titleClassName="max-w-[16ch]"
      />

      {/* ---------- Contador +20 ---------- */}
      <div ref={counterRef} className="relative mt-16 lg:mt-20">
        <Counter value={t.experience.value} progress={scrollYProgress} reduced={reduced} />
      </div>

      {/* ---------- Bus técnico que conecta los módulos ---------- */}
      <div ref={busRef} className="relative mt-20 lg:mt-28">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line">
          <motion.span
            className="absolute inset-y-0 left-0 block bg-signal"
            style={{ width: useTransform(busProgress, [0, 1], ["0%", "100%"]) }}
          />
        </div>

        <ul className="grid gap-px pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {t.experience.domains.map((domain, i) => (
            <DomainModule
              key={domain.name}
              index={domain.index}
              name={domain.name}
              text={domain.text}
              delay={i * 0.08}
              busProgress={busProgress}
              position={i / t.experience.domains.length}
              reduced={reduced}
            />
          ))}
        </ul>
      </div>

      {/* ---------- Trayectoria sin eventos inventados ---------- */}
      <div className="mt-24 lg:mt-32">
        <div className="flex items-center gap-4">
          <DrawLine className="w-16 bg-signal" />
          <span className="label">
            {t.experience.value} {t.experience.valueLabel.toLowerCase()}
          </span>
        </div>

        <ol className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {t.experience.eras.map((era, i) => (
            <motion.li
              key={era.label}
              className="group relative border-t border-line pt-6 pr-6"
              initial={reduced ? false : { y: 24 }}
              whileInView={reduced ? undefined : { y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 h-px w-full scale-x-0 origin-left bg-signal transition-transform duration-700 ease-out group-hover:scale-x-100"
              />
              <span className="mono block text-[0.625rem] text-signal-soft">{era.index}</span>
              <span className="display mt-3 block text-[clamp(1.35rem,3vw,2rem)]">
                {era.label}
              </span>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-faint">{era.text}</p>
            </motion.li>
          ))}
        </ol>

        <p className="label mt-10 max-w-[70ch] leading-relaxed">{t.experience.note}</p>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Contador                                                            */
/* ------------------------------------------------------------------ */
function Counter({
  value,
  progress,
  reduced,
}: {
  value: string;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Solo se anima si el valor es numérico ("+20"). Si algún día el dato
  // cambia a otra cosa, se renderiza tal cual sin romper.
  const numeric = value.match(/\d+/);
  const target = numeric ? Number.parseInt(numeric[0], 10) : null;
  const raw = useTransform(progress, [0, 1], [0, target ?? 1]);
  const smooth = useSpring(raw, { stiffness: 60, damping: 22, mass: 0.6 });
  const rounded = useTransform(smooth, (v) => Math.round(v));
  const countRef = useRef<HTMLSpanElement>(null);

  // `useMotionValueEvent` escribe en el DOM sin provocar un re-render por
  // cada frame: el contador va a 60 fps sin re-renderizar la sección.
  useMotionValueEvent(rounded, "change", (v) => {
    if (countRef.current) countRef.current.textContent = String(v);
  });

  const prefix = value.startsWith("+") ? "+" : "";

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        className="display select-none leading-[0.78]"
        style={{
          fontSize: "clamp(6rem, 26vw, 22rem)",
          letterSpacing: "-0.06em",
        }}
        initial={reduced ? false : { y: 40 }}
        whileInView={reduced ? undefined : { y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {target === null || reduced ? (
          value
        ) : (
          <>
            {prefix}
            <span ref={countRef}>0</span>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Módulo de área                                                      */
/* ------------------------------------------------------------------ */
function DomainModule({
  index,
  name,
  text,
  delay,
  busProgress,
  position,
  reduced,
}: {
  index: string;
  name: string;
  text: string;
  delay: number;
  busProgress: MotionValue<number>;
  position: number;
  reduced: boolean;
}) {
  const nodeOpacity = useTransform(
    busProgress,
    [Math.max(0, position - 0.05), position + 0.18],
    [0.2, 1],
  );

  return (
    <motion.li
      className={cn(
        "group relative bg-carbon px-0 py-8 transition-colors duration-500 hover:bg-graphite",
        "cursor-default sm:px-6 sm:first:pl-0",
      )}
      initial={reduced ? false : { y: 34 }}
      whileInView={reduced ? undefined : { y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Nodo sobre el bus */}
      <motion.span
        aria-hidden="true"
        className="absolute -top-[4.5px] left-0 h-2 w-2 bg-signal sm:left-6"
        style={reduced ? undefined : { opacity: nodeOpacity }}
      />

      <div className="flex items-baseline gap-4">
        <span className="mono text-[0.625rem] text-faint">{index}</span>
        <h3 className="display text-[clamp(1.1rem,2.4vw,1.7rem)] transition-colors duration-500 group-hover:text-signal-soft">
          {name}
        </h3>
      </div>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-mute sm:pr-4">{text}</p>

      {/* Línea técnica que aparece al pasar el cursor */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-full scale-x-0 origin-left bg-signal-soft transition-transform duration-700 ease-out group-hover:scale-x-100 sm:left-6"
      />
    </motion.li>
  );
}
