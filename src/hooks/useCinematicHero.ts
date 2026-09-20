import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * HERO CINEMATOGRÁFICO — transporte de video ligado al progreso de scroll.
 *
 * ---------------------------------------------------------------------
 * POR QUÉ ESTE HOOK REEMPLAZA AL ANTERIOR (`useVideoScrub.ts`)
 * ---------------------------------------------------------------------
 * La implementación anterior secuestraba la entrada del usuario:
 *   - `wheel`  con `preventDefault()` + `window.scrollTo(0, 0)`
 *   - `touchmove` con `preventDefault()`
 *   - `keydown` interceptando ArrowUp/Down, PageUp/Down y **Space**
 * Eso dejaba al visitante encerrado en el hero hasta completar el scrub,
 * rompía el desplazamiento por teclado (Space es "avanzar una pantalla")
 * y era incompatible con Lenis: dos sistemas peleando por el mismo scroll.
 *
 * Esta versión NO intercepta nada. El scroll sigue siendo del usuario y de
 * Lenis; el video simplemente refleja cuánto se ha avanzado dentro de la
 * pista del hero. Es el patrón "pinned scroll-driven video": misma sensación
 * cinematográfica, sin coste de accesibilidad ni de navegación.
 *
 * ---------------------------------------------------------------------
 * DEGRADACIÓN AUTOMÁTICA
 * ---------------------------------------------------------------------
 * Buscar frames en un MP4 es caro si el archivo no tiene keyframes
 * suficientes (H.264 con GOP largo es el caso típico). El hook mide la
 * latencia real de seek durante los primeros intentos y, si el dispositivo
 * o el códec no rinden, cambia a `loop`: el video se reproduce en bucle
 * como fondo cinematográfico y el scroll deja de controlarlo. Nunca se
 * muestra una animación a tirones.
 *
 * `reduced-motion` y pantallas pequeñas van directo al póster estático,
 * que es un frame real del video: no se descarga el MP4 de 4.8 MB.
 */

export type HeroMode = "poster" | "scrub" | "loop";

export interface CinematicHeroOptions {
  videoRef: RefObject<HTMLVideoElement | null>;
  trackRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
  /** Ancho de viewport por debajo del cual no se carga el video. */
  mobileBreakpoint?: number;
  onProgress?: (progress: number) => void;
}

export interface CinematicHeroState {
  mode: HeroMode;
  progress: number;
}

/** Latencia de seek por encima de la cual el scrub deja de ser viable. */
const SEEK_BUDGET_MS = 90;
const PROBE_LIMIT = 6;

/**
 * Network Information API: no es estándar en todos los navegadores, así que
 * se declara localmente y se consulta de forma defensiva.
 */
interface NetworkInfo {
  saveData?: boolean;
  effectiveType?: string;
}

function prefersStatic(breakpoint: number): boolean {
  if (typeof window === "undefined") return true;
  if (window.innerWidth < breakpoint) return true;

  const connection: NetworkInfo | undefined = (navigator as Navigator & { connection?: NetworkInfo })
    .connection;
  if (!connection) return false;

  return connection.saveData === true || connection.effectiveType === "2g";
}

export function useCinematicHero({
  videoRef,
  trackRef,
  reducedMotion,
  mobileBreakpoint = 900,
  onProgress,
}: CinematicHeroOptions): CinematicHeroState {
  const [mode, setMode] = useState<HeroMode>("poster");
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(0);
  const seekTimesRef = useRef<number[]>([]);
  const seekStartedAtRef = useRef(0);
  const degradedRef = useRef(false);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  /* ---------------------------------------------------------------- */
  /* Elección de modo inicial                                          */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const useStatic = reducedMotion || prefersStatic(mobileBreakpoint);
    setMode(useStatic ? "poster" : "scrub");
  }, [reducedMotion, mobileBreakpoint]);

  /* Reacción al cambio de tamaño: móvil nunca arrastra el MP4. */
  useEffect(() => {
    if (reducedMotion) return;
    const onResize = () => {
      if (window.innerWidth < mobileBreakpoint) {
        setMode("poster");
        videoRef.current?.pause();
      } else if (!degradedRef.current) {
        setMode("scrub");
      }
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [reducedMotion, mobileBreakpoint, videoRef]);

  /* ---------------------------------------------------------------- */
  /* Pista de scroll -> progreso 0..1                                  */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      // `rect.top` es 0 cuando la pista queda fija en el tope del viewport.
      const raw = Math.min(1, Math.max(0, -rect.top / total));
      if (Math.abs(raw - progressRef.current) < 0.0005) return;
      progressRef.current = raw;
      setProgress(raw);
      onProgressRef.current?.(raw);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [trackRef]);

  /* ---------------------------------------------------------------- */
  /* Aplicación del progreso al elemento de video                      */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode !== "scrub") return;

    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (duration <= 0) return;

    video.pause();
    const target = progressRef.current * duration;

    // Medición de latencia de seek para decidir si el dispositivo aguanta.
    const onSeeked = () => {
      if (degradedRef.current || seekTimesRef.current.length >= PROBE_LIMIT) return;
      const elapsed = performance.now() - seekStartedAtRef.current;
      seekTimesRef.current.push(elapsed);
      if (seekTimesRef.current.length < PROBE_LIMIT) return;

      const sorted = [...seekTimesRef.current].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      if (median > SEEK_BUDGET_MS) {
        degradedRef.current = true;
        setMode("loop");
      }
    };

    video.addEventListener("seeked", onSeeked);
    seekStartedAtRef.current = performance.now();

    // `fastSeek` (no estándar, soportado en Gecko/WebKit) salta al keyframe
    // más cercano y evita decodificar desde el anterior, que es lo que hace
    // caro el scrub. Fuera de TypeScript: se accede por casteo explícito.
    const seekable = video as HTMLVideoElement & {
      fastSeek?: (time: number) => void;
    };
    try {
      if (typeof seekable.fastSeek === "function") {
        seekable.fastSeek(target);
      } else {
        video.currentTime = target;
      }
    } catch {
      /* el navegador rechazó el seek: el modo loop se hará cargo */
    }

    return () => video.removeEventListener("seeked", onSeeked);
  }, [progress, mode, videoRef]);

  /* ---------------------------------------------------------------- */
  /* Modo loop: fondo cinematográfico sin control de scroll            */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (mode === "loop") {
      video.loop = true;
      video.muted = true;
      const play = video.play();
      if (play && typeof play.catch === "function") play.catch(() => setMode("poster"));
    } else {
      video.loop = false;
      if (mode === "poster") video.pause();
    }
  }, [mode, videoRef]);

  return { mode, progress };
}
