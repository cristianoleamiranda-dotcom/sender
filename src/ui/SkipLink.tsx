import { useLang } from "@/i18n/LanguageContext";

/**
 * Enlace de salto al contenido.
 *
 * Requisito de accesibilidad del brief: navegación por teclado usable.
 * Está localizado porque es texto visible en cuanto recibe foco.
 */
export function SkipLink() {
  const { lang } = useLang();
  return (
    <a
      href="#main"
      className="label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:border focus:border-signal focus:bg-ink focus:px-4 focus:py-3 focus:!text-white" style={{ color: "#1e73be" } as React.CSSProperties}
    >
      {lang === "es" ? "Saltar al contenido" : "Skip to content"}
    </a>
  );
}
