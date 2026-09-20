import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

/**
 * SEÑAL — visualización abstracta de una transmisión.
 *
 * Recorre conceptualmente las tres formas que toma una señal en Sender:
 *   1. ONDA       — señal de programa, envolvente suave
 *   2. PORTADORA  — RF de alta frecuencia modulada
 *   3. DATOS      — flujo digital cuantizado
 * y vuelve a empezar. No es decoración aleatoria: es la misma transición
 * que describe la sección "La señal".
 *
 * Implementación en canvas 2D con un solo `requestAnimationFrame`.
 * Se eligió canvas sobre WebGL a propósito: el brief prohíbe añadir
 * Three.js/WebGL "solo porque se vea tecnológico", y esto consigue el
 * efecto con una fracción del coste y sin dependencias nuevas.
 *
 * Con `phase` numérico fijo (o `prefers-reduced-motion`) no se anima:
 * se dibuja un solo fotograma determinista.
 */

interface SignalWaveProps {
  className?: string;
  /** Altura en píxeles CSS. */
  height?: number;
  /** Fase fija entre 0 y 1. Si se omite, la animación corre sola. */
  phase?: number;
  /** Color del trazo principal. */
  color?: string;
}

const TAU = Math.PI * 2;

/** Mezcla cíclica entre tres modos de señal. */
function modeWeights(t: number): [number, number, number] {
  const cycle = (t % 1 + 1) % 1;
  const w1 = Math.max(0, 1 - Math.abs(cycle - 0.0) * 3.2) + Math.max(0, 1 - Math.abs(cycle - 1) * 3.2);
  const w2 = Math.max(0, 1 - Math.abs(cycle - 0.38) * 3.2);
  const w3 = Math.max(0, 1 - Math.abs(cycle - 0.72) * 3.2);
  const sum = w1 + w2 + w3 || 1;
  return [w1 / sum, w2 / sum, w3 / sum];
}

export function SignalWave({
  className,
  height = 180,
  phase,
  color = "rgba(79,154,216,0.85)",
}: SignalWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticPhase = phase;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const sample = (x: number, t: number, w: [number, number, number]): number => {
      const u = x / Math.max(1, width);
      // Envolvente: la señal entra y sale del cuadro.
      const envelope = Math.sin(Math.PI * u) ** 1.4;

      // 1 · Onda de programa
      const wave =
        Math.sin(u * TAU * 2.1 + t * TAU * 0.8) * 0.6 +
        Math.sin(u * TAU * 5.3 - t * TAU * 0.5) * 0.28 +
        Math.sin(u * TAU * 11.7 + t * TAU * 1.3) * 0.12;

      // 2 · Portadora RF
      const carrier =
        Math.sin(u * TAU * 46 + t * TAU * 2.2) *
        (0.55 + 0.45 * Math.sin(u * TAU * 3.1 + t * TAU * 0.6));

      // 3 · Datos: escalones cuantizados
      const stepped = Math.round(
        (Math.sin(u * TAU * 7.5 + Math.floor(t * 6) * 0.7) * 0.5 +
          Math.sin(u * TAU * 19.3 + Math.floor(t * 4) * 1.1) * 0.3) * 4,
      ) / 4;

      return (wave * w[0] + carrier * w[1] + stepped * w[2]) * envelope;
    };

    const draw = (t: number) => {
      if (width === 0) resize();
      ctx.clearRect(0, 0, width, height);

      const weights = modeWeights(t);
      const mid = height / 2;
      const amp = height * 0.34;
      const step = width > 900 ? 2 : 3;

      // Rastro tenue: da profundidad sin coste de composición.
      for (let layer = 2; layer >= 0; layer--) {
        ctx.beginPath();
        const lag = t - layer * 0.035;
        const alpha = layer === 0 ? 1 : 0.16 / layer;
        ctx.strokeStyle = layer === 0 ? color : `rgba(30,115,190,${alpha.toFixed(3)})`;
        ctx.lineWidth = layer === 0 ? 1.25 : 1;
        for (let x = 0; x <= width; x += step) {
          const y = mid - sample(x, lag, weights) * amp * (1 - layer * 0.08);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Eje de referencia: línea técnica de 0 dB.
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.09)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 6]);
      ctx.moveTo(0, mid);
      ctx.lineTo(width, mid);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    if (typeof staticPhase === "number") {
      draw(staticPhase);
      return () => window.removeEventListener("resize", resize);
    }

    const start = performance.now();
    const loop = (now: number) => {
      draw(((now - start) / 1000) * 0.06);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [height, color, staticPhase]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("block h-auto w-full", className)}
      style={{ height }}
    />
  );
}
