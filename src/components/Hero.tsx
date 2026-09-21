import { useMemo, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useLang } from "@/i18n/LanguageContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCinematicHero } from "@/hooks/useCinematicHero";
import { useAnchorNavigation } from "@/hooks/useAnchorNavigation";
import { publicAsset } from "@/utils/assetUrl";
import { SignalWave } from "@/ui/SignalWave";

/**
 * HERO — SENDER / TECNOLOGÍA QUE TRANSMITE
 *
 * Estructura: una pista de 3 viewports de alto con el contenido fijado en
 * pantalla. El progreso de scroll dentro de esa pista controla el transporte
 * del video real (`public/assets/sender-hero.mp4`) y la opacidad del velo
 * oscuro: la señal "se abre" a medida que se avanza.
 *
 * No se secuestra la rueda, el touch ni el teclado. Ver `useCinematicHero`.
 *
 * Jerarquía semántica: el único H1 del sitio es el wordmark SENDER.
 */

/** Vueltas de pista antes de liberar el hero. 300vh da ~2 viewports de scrub. */
const TRACK_VH = 300;

export function Hero() {
  const { t } = useLang();
  const go = useAnchorNavigation();
  const reduced = useReducedMotion();

  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { mode } = useCinematicHero({
    videoRef,
    trackRef,
    reducedMotion: reduced,
  });

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // El muelle evita que el video y el velo vayan a saltos con un trackpad.
  const k = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  /* El velo se levanta: al principio tapa el video para garantizar contraste. */
  const veilOpacity = useTransform(k, [0, 0.25, 1], [0.94, 0.78, 0.42]);
  const videoOpacity = useTransform(k, (v) => (mode === "poster" ? 0 : Math.min(1, v * 1.5)));
  const contentY = useTransform(k, [0, 1], [0, -160]);
  const contentOpacity = useTransform(k, [0, 0.6, 1], [1, 0.15, 0]);
  const waveOpacity = useTransform(k, [0, 0.35, 1], [0.35, 1, 0.55]);
  const wordmarkScale = useTransform(k, [0, 1], [1, 1.06]);
  const wordmarkTracking = useTransform(k, [0, 1], ["-0.055em", "-0.02em"]);
  const scanY = useTransform(k, [0, 1], ["-10%", "110%"]);

  const wordmarkStyle = useMemo(
    () => ({ scale: wordmarkScale, letterSpacing: wordmarkTracking }),
    [wordmarkScale, wordmarkTracking],
  );

  const heroTitle = t.hero.claim;

  return (
    <div
      ref={trackRef}
      className="relative w-full"
      style={{ height: reduced ? "auto" : `${TRACK_VH}vh` }}
    >
      <div
        className={
          reduced
            ? "relative flex min-h-[100svh] w-full items-center overflow-hidden bg-ink"
            : "sticky top-0 flex h-[100svh] w-full items-center overflow-hidden bg-ink"
        }
      >
        {/* ---------- Capa 1 · video real ---------- */}
        {/* OpenDesign: gradiente vibrante sutil */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-blue-600/20" />
        <motion.video
          ref={videoRef}
          aria-hidden="true"
          tabIndex={-1}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: videoOpacity }}
        >
          <source src={publicAsset("assets/sender-hero.mp4")} type="video/mp4" />
        </motion.video>

        {/* ---------- Capa 2 · póster (frame real del video) ---------- */}
        {/* Siempre presente: es el LCP en móvil y el respaldo del modo poster. */}
        <picture aria-hidden="true">
          <source
            type="image/webp"
            srcSet={`${publicAsset("assets/hero-poster-640.webp")} 640w, ${publicAsset(
              "assets/hero-poster-960.webp",
            )} 960w, ${publicAsset("assets/hero-poster-1280.webp")} 1280w`}
            sizes="100vw"
          />
          <img
            src={publicAsset("assets/hero-poster-960.webp")}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: mode === "poster" ? 0.5 : 0.22 }}
          />
        </picture>

        {/* ---------- Capa 3 · velo oscuro ---------- */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-ink"
          style={{ opacity: veilOpacity }}
        />
        {/* Viñeta: profundidad sin recurrir a glassmorphism. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 45%, transparent 0%, rgba(8,9,10,0.55) 62%, rgba(5,7,8,0.95) 100%)",
          }}
        />

        {/* ---------- Capa 4 · retícula técnica ---------- */}
        <div aria-hidden="true" className="grid-tech absolute inset-0 opacity-60" />

        {/* ---------- Capa 5 · barrido de señal ---------- */}
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-px"
            style={{
              top: 0,
              y: scanY,
              background:
                "linear-gradient(90deg, transparent, rgba(79,154,216,0.55) 20%, rgba(30,115,190,0.9) 50%, rgba(79,154,216,0.55) 80%, transparent)",
              boxShadow: "0 0 24px rgba(30,115,190,0.35)",
            }}
          />
        )}

        {/* ---------- Capa 6 · visualización de señal ---------- */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[18vh] hidden md:block"
          style={{ opacity: waveOpacity }}
        >
          <SignalWave phase={reduced ? 0 : undefined} />
        </motion.div>

        {/* ---------- Capa 7 · contenido ---------- */}
        <motion.div
          className="relative z-10 mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16"
          style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        >
          {/* Eyebrow */}
          <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mb-8">
            <span aria-hidden="true" className="h-px w-10 bg-signal" />
            <span className="label-signal">
              {t.hero.meta[2]}
            </span>
          </div>

          {/* H1 único del sitio */}
          <motion.h1
            className="hero-wordmark display select-none"
            style={reduced ? undefined : wordmarkStyle}
          >
            {t.hero.wordmark}
          </motion.h1>

          {/* Claim */}
          <p className="mt-6 max-w-[22ch] text-[clamp(1.5rem,4.4vw,3.25rem)] leading-[1.02] font-light tracking-[-0.03em] text-paper uppercase sm:mt-8">
            {heroTitle}
          </p>

          <p className="body-tech mt-5 max-w-[54ch] sm:mt-6">{t.hero.sub}</p>

          {/* CTA */}
          <div className="mt-9 flex flex-col gap-3 sm:mt-11 sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              onClick={() => go("/#senal")}
              className="group inline-flex items-center justify-center gap-3 bg-paper px-8 py-4 font-mono text-[0.6875rem] tracking-[0.2em] text-ink uppercase transition-colors duration-500 hover:bg-signal hover:text-paper"
            >
              {t.hero.primary}
              <span
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                ↓
              </span>
            </button>
            <button
              type="button"
              onClick={() => go("/#contacto")}
              className="group inline-flex items-center justify-center gap-3 border border-line-strong px-8 py-4 font-mono text-[0.6875rem] tracking-[0.2em] text-paper uppercase transition-colors duration-500 hover:border-signal hover:text-signal-soft"
            >
              {t.hero.secondary}
              <span
                aria-hidden="true"
                className="h-1 w-1 bg-signal transition-colors duration-500 group-hover:bg-signal-soft"
              />
            </button>
          </div>

          {/* Meta técnica */}
          <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 sm:mt-12">
            {t.hero.meta.slice(0, 2).map((m) => (
              <li key={m} className="label">
                {m}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ---------- Indicador de scroll ---------- */}
        {!reduced && (
          <motion.div
            className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-8"
            style={{ opacity: contentOpacity }}
            aria-hidden="true"
          >
            <span className="label">{t.hero.scroll}</span>
            <span className="relative block h-10 w-px overflow-hidden bg-line-strong">
              <motion.span
                className="absolute inset-x-0 top-0 block h-4 bg-signal-soft"
                animate={{ y: ["-100%", "250%"] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
