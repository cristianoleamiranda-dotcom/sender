import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAnchorNavigation } from "@/hooks/useAnchorNavigation";
import { categories, productsOfCategory } from "@/content/catalog";
import { resolve } from "@/content/resolve";
import { Section } from "@/ui/Primitives";
import { SectionHeading } from "@/ui/SectionHeading";
import { bands } from "@/data/bands";
import { cn } from "@/utils/cn";

/**
 * 03 — SOLUCIONES
 *
 * El catálogo deja de ser una cuadrícula de tarjetas y pasa a ser una lista
 * de siete ESTACIONES TECNOLÓGICAS, como los bancos de un sistema.
 *
 * Interacción:
 *  - desktop: al pasar el cursor, la estación se ilumina, su línea técnica
 *    se dibuja y una vista previa con la fotografía REAL de esa línea sigue
 *    al puntero. Click → ficha de categoría.
 *  - móvil: sin vista previa flotante (sería ilegible y caro); cada estación
 *    muestra su miniatura en línea y se expande al tocarla.
 *
 * Debajo, el mapa de bandas: los rangos publicados por Sender. Es el ancla
 * de SEO técnico de la sección (AM, FM, HF, VHF, UHF, NAVTEX).
 */
export function Solutions() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const go = useAnchorNavigation();
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 26, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 26, mass: 0.5 });

  const resolvedBands = resolve(bands, lang);

  // `hover: hover` distingue puntero real de táctil. Se resuelve en el primer
  // efecto para no condicionar el render inicial (evita parpadeo de hidratación).
  const [supportsHover, setSupportsHover] = useState(true);
  useEffect(() => {
    setSupportsHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  const onPointerMove = (e: React.PointerEvent) => {
    if (!listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <Section id="soluciones" className="bg-ink py-28 sm:py-36 lg:py-44" labelledBy="soluciones-title">
      <SectionHeading
        id="soluciones-title"
        kicker={t.solutions.kicker}
        lines={t.solutions.title}
        intro={t.solutions.intro}
        aside={
          <button
            type="button"
            onClick={() => navigate("/productos")}
            className="group inline-flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.2em] text-paper uppercase transition-colors duration-300 hover:text-signal-soft"
          >
            {t.catalogPage.allProducts}
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </button>
        }
      />

      {/* ---------- Estaciones ---------- */}
      <div
        ref={listRef}
        className="relative mt-16 lg:mt-24"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setActive(null)}
      >
        <ul className="border-t border-line">
          {categories.map((category, i) => {
            const items = productsOfCategory(category.slug);
            const isActive = active === i;
            const isExpanded = expandedMobile === category.slug;

            return (
              <li key={category.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => {
                    if (supportsHover) navigate(`/productos/${category.slug}`);
                    else
                      setExpandedMobile((prev) =>
                        prev === category.slug ? null : category.slug,
                      );
                  }}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  aria-expanded={isExpanded}
                  className={cn(
                    "group relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-4 px-1 py-7 text-left transition-colors duration-500 sm:gap-x-8 sm:py-9 lg:grid-cols-[5rem_minmax(0,1fr)_minmax(0,26rem)_auto]",
                    isActive ? "bg-graphite/60" : "bg-transparent",
                  )}
                >
                  {/* Índice */}
                  <span
                    className={cn(
                      "mono text-[0.6875rem] transition-colors duration-500",
                      isActive ? "text-signal-soft" : "text-faint",
                    )}
                  >
                    {category.index[lang]}
                  </span>

                  {/* Nombre + alcance */}
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "display block text-[clamp(1.5rem,4.4vw,3rem)] transition-[transform,color] duration-700 ease-out",
                        isActive && !reduced ? "translate-x-2 text-paper" : "text-paper/85",
                      )}
                    >
                      {category.name[lang]}
                    </span>
                    <span className="label mt-3 block">{category.kicker[lang]}</span>
                  </span>

                  {/* Etiquetas de alcance: solo en escritorio */}
                  <span className="col-span-2 hidden flex-wrap items-center gap-x-5 gap-y-2 lg:col-span-1 lg:flex">
                    {category.scope.slice(0, 3).map((s) => (
                      <span key={s[lang]} className="label">
                        {s[lang]}
                      </span>
                    ))}
                  </span>

                  {/* Acción */}
                  <span className="flex items-center gap-4 justify-self-end">
                    <span className="mono hidden text-[0.625rem] text-faint sm:block">
                      {items.length} {t.solutions.itemsCount}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-9 w-9 items-center justify-center border transition-colors duration-500",
                        isActive
                          ? "border-signal bg-signal text-paper"
                          : "border-line-strong text-mute",
                      )}
                    >
                      →
                    </span>
                  </span>

                  {/* Línea técnica inferior que se dibuja al activar */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-0 left-0 h-px bg-signal transition-[width] duration-700 ease-out",
                      isActive ? "w-full" : "w-0",
                    )}
                  />
                </button>

                {/* Descripción: visible en móvil al expandir, siempre en desktop */}
                <div
                  className={cn(
                    "overflow-hidden px-1 transition-[max-height,opacity] duration-700 ease-out lg:hidden",
                    isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  <p className="body-tech max-w-[52ch] pb-6">{category.description[lang]}</p>
                  <button
                    type="button"
                    onClick={() => navigate(`/productos/${category.slug}`)}
                    className="group mb-8 inline-flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.2em] text-signal-soft uppercase"
                  >
                    {t.solutions.explore}
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>

                {/* Fila de detalle en desktop, sin interacción */}
                <div
                  className={cn(
                    "hidden overflow-hidden transition-[max-height,opacity] duration-700 ease-out lg:block",
                    isActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
                  )}
                  aria-hidden={!isActive}
                >
                  <p className="body-tech max-w-[70ch] px-1 pb-8 lg:pl-[7rem]">
                    {category.description[lang]}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Vista previa flotante que sigue al puntero (solo hover real) */}
        {supportsHover && !reduced && (
          <AnimatePresence>
            {active !== null && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 z-20 hidden lg:block"
                style={{ x: sx, y: sy }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-line-strong bg-graphite">
                  <img
                    src={categories[active].image}
                    alt=""
                    width={320}
                    height={220}
                    loading="lazy"
                    decoding="async"
                    className="h-[220px] w-[320px] object-cover"
                  />
                  <span className="absolute inset-0 bg-signal/10 mix-blend-color" />
                  <span className="absolute bottom-0 left-0 h-px w-full bg-signal" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Alternativa táctil: miniatura real dentro de la estación */}
        {!supportsHover && (
          <p className="label mt-4 lg:hidden">
            {categories.map((c) => c.index[lang]).join(" · ")}
          </p>
        )}
      </div>

      {/* ---------- Mapa de bandas ---------- */}
      <div className="mt-24 lg:mt-32">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h3 className="display text-display-xs">
            {lang === "es" ? "Bandas de operación" : "Operating bands"}
          </h3>
          <button
            type="button"
            onClick={() => go("/#contacto")}
            className="label text-mute transition-colors duration-300 hover:text-signal-soft"
          >
            {t.solutions.consult} →
          </button>
        </div>

        <ul className="mt-10 grid gap-px border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {resolvedBands.map((band) => (
            <li
              key={band.code}
              className="group border-b border-line bg-ink px-1 py-7 transition-colors duration-500 hover:bg-graphite sm:px-5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="display text-[clamp(1.35rem,3vw,2rem)] transition-colors duration-500 group-hover:text-signal-soft">
                  {band.code}
                </span>
                <span className="mono text-[0.6875rem] text-mute">{band.range}</span>
              </div>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-faint">{band.use}</p>
            </li>
          ))}
        </ul>

        <p className="label mt-6">{t.solutions.bandsNote}</p>
      </div>
    </Section>
  );
}
