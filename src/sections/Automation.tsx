import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAnchorNavigation } from "@/hooks/useAnchorNavigation";
import { Section } from "@/ui/Primitives";
import { SectionHeading } from "@/ui/SectionHeading";
import { cn } from "@/utils/cn";

/**
 * 07 — AUTOMATIZACIÓN
 *
 * Centro de control industrial. Los canales representados son EXACTAMENTE los
 * que Sender documenta para su sistema NAVTEX y su procesador de audio:
 * tensión de alimentación, potencia de transmisión, temperatura interna,
 * audio (entrada balanceada –15 a +15 dBu), alarmas automáticas, control
 * remoto y enlace de telemetría.
 *
 * Honestidad: no hay backend ni telemetría real, así que los valores son una
 * simulación de interfaz y la sección lo declara explícitamente en su nota.
 * Presentar números inventados como si fueran mediciones reales violaría la
 * regla de contenido del proyecto.
 *
 * Estética: instrumento industrial, no interfaz de videojuego. Sin neón,
 * sin vidrio esmerilado dominante, sin gradientes de color.
 */
export function Automation() {
  const { t, lang } = useLang();
  const go = useAnchorNavigation();
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const channels = t.automation.channels;
  const barChannels = channels.filter((c) => c.kind === "bar");
  const stateChannels = channels.filter((c) => c.kind === "state");
  const gaugeChannel = channels.find((c) => c.kind === "gauge");

  /* Valores simulados: una sola fuente de animación para todo el panel. */
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTick((v) => v + 1), 140);
    return () => window.clearInterval(id);
  }, [reduced]);

  const values = useMemo(() => {
    const now = reduced ? 0 : tick * 0.14;
    const at = (seed: number, min: number, max: number, jitter: number) => {
      const base = (Math.sin(now * 0.7 + seed * 2.1) + Math.sin(now * 0.31 + seed)) / 2;
      const noise = Math.sin(now * 5.3 + seed * 7.7) * jitter;
      const normalised = Math.min(1, Math.max(0, 0.5 + base * 0.42 + noise));
      return min + normalised * (max - min);
    };
    return {
      voltage: at(1, 285, 312, 0.01), // alrededor de los 300 VDC nominales
      power: at(2, 940, 1000, 0.02), // alrededor de los 1000 W del amplificador MF
      temperature: at(3, 34, 52, 0.03),
      audio: at(4, -9, 6, 0.06), // dentro del rango –15 a +15 dBu publicado
    };
  }, [tick, reduced]);

  /* Trazo de la señal de audio, en canvas 2D. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const mid = height / 2;
    const t = reduced ? 0 : tick * 0.05;

    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 5]);
    ctx.beginPath();
    ctx.moveTo(0, mid);
    ctx.lineTo(width, mid);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.strokeStyle = "rgba(79,154,216,0.9)";
    ctx.lineWidth = 1.1;
    for (let x = 0; x <= width; x += 2) {
      const u = x / width;
      const envelope = Math.sin(Math.PI * u) ** 0.8;
      const y =
        mid -
        (Math.sin(u * 26 + t * 3) * 0.5 +
          Math.sin(u * 61 - t * 2) * 0.3 +
          Math.sin(u * 7 + t) * 0.2) *
          (height * 0.36) *
          envelope;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [tick, reduced]);

  return (
    <Section
      id="automatizacion"
      className="relative overflow-hidden bg-ink py-28 sm:py-36 lg:py-44"
      labelledBy="automatizacion-title"
    >
      <SectionHeading
        id="automatizacion-title"
        kicker={t.automation.kicker}
        lines={t.automation.title}
        intro={t.automation.intro}
        aside={
          <button
            type="button"
            onClick={() => go("/producto/automatizacion-navtex")}
            className="group inline-flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.2em] text-paper uppercase transition-colors duration-300 hover:text-signal-soft"
          >
            {t.featured.view}
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </button>
        }
      />

      <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-12">
        {/* ---------- Consola ---------- */}
        <div className="border border-line bg-carbon lg:col-span-7">
          {/* Barra de estado */}
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute h-1.5 w-1.5 bg-signal-soft" />
                {!reduced && <span className="absolute h-2 w-2 animate-ping bg-signal/50" />}
              </span>
              <span className="mono text-[0.625rem] tracking-[0.18em] text-paper uppercase">
                {t.automation.statusOnline}
              </span>
            </div>
            <span className="mono text-[0.5625rem] tracking-[0.18em] text-faint uppercase">
              NAVTEX 490 / 518 kHz
            </span>
          </div>

          {/* Canales de barra */}
          <ul className="divide-y divide-[color:var(--color-line)]">
            {barChannels.map((channel) => {
              const value =
                channel.id === "voltage"
                  ? values.voltage
                  : channel.id === "power"
                    ? values.power
                    : values.audio;
              const isAudio = channel.id === "audio";
              const min = isAudio ? -15 : channel.id === "voltage" ? 270 : 900;
              const max = isAudio ? 15 : channel.id === "voltage" ? 330 : 1010;
              const pct = ((value - min) / (max - min)) * 100;

              return (
                <li key={channel.id} className="px-5 py-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="mono text-[0.625rem] tracking-[0.18em] text-mute uppercase">
                      {channel.label}
                    </span>
                    <span className="mono text-[0.75rem] text-paper tabular-nums">
                      {value.toFixed(isAudio ? 1 : 0)}
                      <span className="ml-1.5 text-[0.5625rem] text-faint">{channel.unit}</span>
                    </span>
                  </div>

                  <div className="relative mt-3 h-1.5 w-full overflow-hidden bg-graphite">
                    <span
                      className="absolute inset-y-0 left-0 block bg-signal transition-[width] duration-200 ease-out"
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                    {/* Marcas de escala */}
                    <span aria-hidden="true" className="absolute inset-0 flex justify-between">
                      {Array.from({ length: 11 }).map((_, i) => (
                        <span key={i} className="h-full w-px bg-ink/60" />
                      ))}
                    </span>
                  </div>

                  <span className="label mt-2 block text-faint/80">{channel.range}</span>
                </li>
              );
            })}
          </ul>

          {/* Trazo de audio */}
          <div className="border-t border-line px-5 py-4">
            <div className="flex items-baseline justify-between gap-4">
              <span className="mono text-[0.625rem] tracking-[0.18em] text-mute uppercase">
                {lang === "es" ? "Señal de programa" : "Program signal"}
              </span>
              <span className="mono text-[0.5625rem] text-faint">BIS-AP735</span>
            </div>
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="mt-3 block h-16 w-full"
            />
          </div>

          {/* Nota de honestidad */}
          <p className="label border-t border-line px-5 py-4 leading-relaxed">
            {t.automation.statusSimulated} · {t.automation.note}
          </p>
        </div>

        {/* ---------- Columna derecha ---------- */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Termómetro */}
          {gaugeChannel && (
            <div className="border border-line bg-carbon p-5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="mono text-[0.625rem] tracking-[0.18em] text-mute uppercase">
                  {gaugeChannel.label}
                </span>
                <span className="mono text-[0.75rem] text-paper tabular-nums">
                  {values.temperature.toFixed(1)}
                  <span className="ml-1.5 text-[0.5625rem] text-faint">{gaugeChannel.unit}</span>
                </span>
              </div>
              <div className="relative mt-4 h-24">
                <svg viewBox="0 0 200 90" className="h-full w-full" aria-hidden="true">
                  <path
                    d="M14 78 A 86 86 0 0 1 186 78"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                    strokeLinecap="butt"
                  />
                  <path
                    d="M14 78 A 86 86 0 0 1 186 78"
                    fill="none"
                    stroke="#1e73be"
                    strokeWidth="6"
                    strokeLinecap="butt"
                    strokeDasharray="270"
                    strokeDashoffset={270 - (Math.min(1, Math.max(0, (values.temperature - 20) / 60)) * 270)}
                    style={{ transition: "stroke-dashoffset 200ms linear" }}
                  />
                  {Array.from({ length: 7 }).map((_, i) => {
                    const angle = Math.PI * (1 - i / 6);
                    const x1 = 100 + Math.cos(angle) * 72;
                    const y1 = 78 - Math.sin(angle) * 72;
                    const x2 = 100 + Math.cos(angle) * 62;
                    const y2 = 78 - Math.sin(angle) * 62;
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>
              </div>
              <span className="label block text-faint/80">{gaugeChannel.range}</span>
            </div>
          )}

          {/* Estados */}
          <div className="border border-line bg-carbon">
            <ul className="divide-y divide-[color:var(--color-line)]">
              {stateChannels.map((channel, i) => (
                <li key={channel.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="mono text-[0.625rem] tracking-[0.18em] text-mute uppercase">
                    {channel.label}
                  </span>
                  <span className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block h-1.5 w-1.5",
                        i === 1 ? "bg-signal-soft" : "bg-signal",
                        !reduced && i % 2 === 0 && "animate-pulse",
                      )}
                    />
                    <span className="mono text-[0.625rem] tracking-[0.14em] text-paper uppercase">
                      {channel.unit}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Módulos del sistema */}
          <ul className="space-y-px">
            {t.automation.modules.map((module) => (
              <li
                key={module.title}
                className="group border border-line bg-carbon p-5 transition-colors duration-500 hover:border-signal/50 hover:bg-graphite"
              >
                <div className="flex items-baseline gap-4">
                  <span className="mono text-[0.625rem] text-signal-soft">{module.index}</span>
                  <h3 className="display text-[clamp(1rem,2vw,1.35rem)] transition-colors duration-500 group-hover:text-signal-soft">
                    {module.title}
                  </h3>
                </div>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-mute">{module.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
