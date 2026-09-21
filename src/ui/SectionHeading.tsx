import type { ReactNode } from "react";
import { Section } from "./Primitives";
import { RevealLines } from "./Reveal";
import { cn } from "@/utils/cn";

/**
 * Encabezado de sección canónico.
 *
 * Todas las secciones del sitio comparten la misma anatomía:
 * kicker numerado → display en líneas con máscara → entradilla técnica.
 * Centralizarlo evita que cada sección reinvente el espaciado y garantiza
 * que la jerarquía H2/H3 sea coherente para SEO.
 */
export function SectionHeading({
  id,
  kicker: _kicker,
  lines,
  intro,
  aside,
  className,
  titleClassName,
  as = "h2",
}: {
  id?: string;
  kicker: string;
  lines: readonly string[];
  intro?: string;
  aside?: ReactNode;
  className?: string;
  titleClassName?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div className={cn("flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between", className)}>
      <div className="max-w-[20ch]">
        <RevealLines
          as={as}
          id={id}
          lines={lines}
          className={cn("display mt-6 text-display-sm", titleClassName)}
        />
      </div>

      {(intro || aside) && (
        <div className="max-w-[46ch] shrink-0 lg:pb-2">
          {intro && <p className="body-tech">{intro}</p>}
          {aside && <div className="mt-6">{aside}</div>}
        </div>
      )}
    </div>
  );
}

/** Variante compacta para bloques internos de una sección. */
export function SubHeading({
  children,
  className,
  as: Tag = "h3",
}: {
  children: ReactNode;
  className?: string;
  as?: "h3" | "h4";
}) {
  return (
    <Tag className={cn("display text-display-xs", className)}>{children}</Tag>
  );
}

export { Section };
