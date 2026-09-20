import { useLang } from "@/i18n/LanguageContext";
import { company, whatsappHref } from "@/content/company";
import type { Product } from "@/content/types";
import { cn } from "@/utils/cn";

/**
 * CTA de producto.
 *
 * Regla UX del brief: desde cualquier producto se puede consultar en una sola
 * interacción. Dos vías, ambas reales y verificables:
 *   - WhatsApp con el nombre del equipo precargado en el mensaje.
 *   - Correo con asunto y cuerpo ya compuestos.
 *
 * No hay formulario propio en la ficha: el sitio es estático y no tiene
 * backend, así que un formulario que no envía nada sería engañoso. Se compone
 * el mensaje en el cliente del usuario y se declara explícitamente.
 */
export function ProductCTA({
  product,
  className,
  compact = false,
}: {
  product: Product;
  className?: string;
  compact?: boolean;
}) {
  const { t, lang } = useLang();
  const name = product.name[lang];

  const subject =
    lang === "es"
      ? `Consulta técnica — ${name}`
      : `Technical enquiry — ${name}`;

  const bodyText =
    lang === "es"
      ? `Hola Sender,\n\nQuiero información sobre: ${name}.\n\nProyecto / aplicación:\nPotencia o configuración requerida:\nUbicación:\n\nDatos de contacto:\nNombre:\nEmpresa:\nTeléfono:`
      : `Hello Sender,\n\nI would like information about: ${name}.\n\nProject / application:\nRequired power or configuration:\nLocation:\n\nContact details:\nName:\nCompany:\nPhone:`;

  const mailto = `mailto:${company.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(bodyText)}`;

  return (
    <div className={cn("border-t border-line pt-8", className)}>
      {!compact && <h3 className="label-signal">{t.productPage.documentation}</h3>}

      {!compact && (
        <p className="body-tech mt-4 max-w-[52ch]">{t.productPage.docsPending}</p>
      )}

      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
          compact ? "mt-0" : "mt-8",
        )}
      >
        <a
          href={whatsappHref(lang, name)}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-3 bg-paper px-7 py-4 font-mono text-[0.6875rem] tracking-[0.2em] text-ink uppercase transition-colors duration-500 hover:bg-signal hover:text-paper"
        >
          {t.productPage.quoteWhatsapp}
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </a>

        <a
          href={mailto}
          className="group inline-flex items-center justify-center gap-3 border border-line-strong px-7 py-4 font-mono text-[0.6875rem] tracking-[0.2em] text-paper uppercase transition-colors duration-500 hover:border-signal hover:text-signal-soft"
        >
          {t.productPage.consult}
        </a>

        <a
          href={company.phoneHref}
          className="mono inline-flex items-center justify-center gap-3 px-2 py-4 text-[0.75rem] text-mute transition-colors duration-300 hover:text-signal-soft"
        >
          {company.phone}
        </a>
      </div>
    </div>
  );
}
