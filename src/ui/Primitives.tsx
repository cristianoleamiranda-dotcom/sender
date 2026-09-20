import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  ReactNode,
  Ref,
} from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { DrawLine, Reveal } from "./Reveal";

/* ------------------------------------------------------------------ */
/* Flecha técnica                                                      */
/* ------------------------------------------------------------------ */
export function Arrow({
  className,
  direction = "right",
}: {
  className?: string;
  direction?: "right" | "down" | "up-right";
}) {
  const rotate =
    direction === "down" ? "rotate-90" : direction === "up-right" ? "-rotate-45" : "";
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-[1em] w-[1em] shrink-0", rotate, className)}
    >
      <path
        d="M4 12h15M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Botones / CTA                                                       */
/*                                                                     */
/* Regla UX del brief: toda sección tiene una acción clara y el CTA    */
/* debe ser alcanzable en 2–3 interacciones. Los tres tamaños existen  */
/* para que ninguna sección se quede sin acción por falta de espacio.  */
/* ------------------------------------------------------------------ */
type Variant = "solid" | "ghost" | "text";

const base =
  "group relative inline-flex items-center justify-center gap-3 font-mono uppercase tracking-[0.18em] " +
  "transition-[background-color,color,border-color,transform] duration-500 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-signal-soft " +
  "disabled:pointer-events-none disabled:opacity-40";

const sizes = {
  sm: "text-[0.625rem] px-4 py-2.5",
  md: "text-[0.6875rem] px-6 py-3.5",
  lg: "text-[0.75rem] px-8 py-4.5",
} as const;

const variants: Record<Variant, string> = {
  solid: "bg-paper text-ink hover:bg-signal hover:text-paper",
  ghost: "border border-line-strong text-paper hover:border-signal hover:text-signal-soft",
  text: "text-mute hover:text-signal-soft py-2",
};

function CTAInner({ children, hideArrow }: { children: ReactNode; hideArrow?: boolean }) {
  return (
    <>
      <span>{children}</span>
      {!hideArrow && (
        <Arrow className="transition-transform duration-500 ease-out group-hover:translate-x-1" />
      )}
    </>
  );
}

type Size = keyof typeof sizes;

export function ButtonLink({
  variant = "solid",
  size = "md",
  className,
  children,
  hideArrow,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  hideArrow?: boolean;
}) {
  return (
    <a className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      <CTAInner hideArrow={hideArrow}>{children}</CTAInner>
    </a>
  );
}

export function Button({
  variant = "solid",
  size = "md",
  className,
  children,
  hideArrow,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  hideArrow?: boolean;
}) {
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      <CTAInner hideArrow={hideArrow}>{children}</CTAInner>
    </button>
  );
}

/** CTA interno. Usa el router: nada de recargas completas. */
export function ButtonRoute({
  to,
  variant = "solid",
  size = "md",
  className,
  children,
  hideArrow,
}: {
  to: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  hideArrow?: boolean;
}) {
  return (
    <Link to={to} className={cn(base, sizes[size], variants[variant], className)}>
      <CTAInner hideArrow={hideArrow}>{children}</CTAInner>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Encabezado de sección: kicker + display                             */
/* ------------------------------------------------------------------ */
export function Kicker({
  children,
  className,
  tone = "signal",
}: {
  children: ReactNode;
  className?: string;
  tone?: "signal" | "mute";
}) {
  return (
    <Reveal y={10} className={cn("flex items-center gap-4", className)}>
      <span
        aria-hidden="true"
        className={cn("h-px w-8 shrink-0", tone === "signal" ? "bg-signal" : "bg-steel")}
      />
      <span className={tone === "signal" ? "label-signal" : "label"}>{children}</span>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Fila de metadatos técnicos                                          */
/* ------------------------------------------------------------------ */
export function MetaRow({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-6 gap-y-2", className)}>
      {items.map((it) => (
        <li key={it} className="label flex items-center gap-2.5">
          <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-signal" />
          {it}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Contenedor de sección                                               */
/* ------------------------------------------------------------------ */
export function Section({
  id,
  className,
  children,
  as: Tag = "section",
  labelledBy,
  bleed = false,
  ref,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  as?: "section" | "div" | "article" | "aside";
  labelledBy?: string;
  bleed?: boolean;
  /** React 19 permite pasar `ref` como prop normal a elementos del DOM. */
  ref?: Ref<HTMLElement>;
}) {
  // `Tag` es una union de elementos intrinsecos; se normaliza a `ElementType`
  // para que TypeScript acepte un `ref` generico de HTMLElement.
  const Box = Tag as ElementType;
  return (
    <Box
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative scroll-mt-24",
        bleed ? "" : "px-5 sm:px-8 lg:px-12 xl:px-16",
        className,
      )}
    >
      {bleed ? children : <div className="mx-auto w-full max-w-[1600px]">{children}</div>}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Filete técnico con nodo de señal                                    */
/* ------------------------------------------------------------------ */
export function SignalRule({
  className,
  delay = 0,
  label,
}: {
  className?: string;
  delay?: number;
  label?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span aria-hidden="true" className="relative flex h-2 w-2 shrink-0 items-center justify-center">
        <span className="absolute h-1.5 w-1.5 bg-signal-soft" />
        <span className="absolute h-2 w-2 animate-pulse bg-signal/40" />
      </span>
      <div className="relative h-px flex-1 overflow-hidden bg-line">
        <DrawLine className="absolute inset-0 bg-gradient-to-r from-signal via-signal-soft to-transparent" delay={delay} />
      </div>
      {label && <span className="label shrink-0">{label}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Marcador numérico de módulo                                         */
/* ------------------------------------------------------------------ */
export function IndexTag({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mono inline-flex h-7 min-w-7 items-center justify-center border border-line px-1.5 text-[0.625rem] text-signal-soft",
        className,
      )}
    >
      {value}
    </span>
  );
}
