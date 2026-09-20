import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useAnchorNavigation } from "@/hooks/useAnchorNavigation";
import { categories } from "@/content/catalog";
import { company, whatsappHref } from "@/content/company";
import { Section } from "@/ui/Primitives";

/**
 * FOOTER
 *
 * Cierra el recorrido repitiendo las dos rutas de conversión (catálogo y
 * contacto) y dejando el mapa del catálogo completo visible: cualquiera de las
 * siete estaciones queda a un clic desde cualquier punto del sitio.
 */
export function Footer() {
  const { t, lang } = useLang();
  const go = useAnchorNavigation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-ink">
      <Section className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Marca */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5"
              aria-label={`${company.name} — ${lang === "es" ? "inicio" : "home"}`}
            >
              <span aria-hidden="true" className="block h-1.5 w-1.5 bg-signal-soft" />
              <span className="font-mono text-sm tracking-[0.32em] text-paper transition-colors group-hover:text-signal-soft">
                SENDER
              </span>
            </Link>

            <p className="display mt-6 max-w-[16ch] text-[clamp(1.5rem,3.4vw,2.4rem)]">
              {t.footer.claim}
            </p>

            <p className="label mt-6 max-w-[34ch] leading-relaxed">
              {/* Un solo nodo de texto. Interpolar `{a} · {b} · {c}` genera
                  varios nodos hermanos y la hidratación del prerender se
                  desajusta en el primero. */}
              {`${company.address.street} · ${company.address.commune} · ${company.address.city}`}
            </p>
          </div>

          {/* Navegación */}
          <nav className="lg:col-span-3" aria-label={t.footer.nav}>
            <h2 className="label-signal">{t.footer.nav}</h2>
            <ul className="mt-6 space-y-3">
              {t.nav.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.href);
                    }}
                    className="group inline-flex items-center gap-2.5 text-[0.875rem] text-mute transition-colors duration-300 hover:text-paper"
                  >
                    <span
                      aria-hidden="true"
                      className="h-px w-0 bg-signal transition-[width] duration-500 group-hover:w-4"
                    />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Catálogo */}
          <nav className="lg:col-span-3" aria-label={t.footer.catalog}>
            <h2 className="label-signal">{t.footer.catalog}</h2>
            <ul className="mt-6 space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/productos/${category.slug}`}
                    className="group inline-flex items-baseline gap-3 text-[0.875rem] text-mute transition-colors duration-300 hover:text-paper"
                  >
                    <span className="mono text-[0.5625rem] text-faint transition-colors group-hover:text-paper">
                      {category.index[lang]}
                    </span>
                    {category.name[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Canales */}
          <div className="lg:col-span-2">
            <h2 className="label-signal">{t.footer.channels}</h2>
            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href={company.phoneHref}
                  className="mono block text-[0.8125rem] text-mute transition-colors duration-300 hover:text-paper"
                >
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="mono block break-all text-[0.8125rem] text-mute transition-colors duration-300 hover:text-paper"
                >
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref(lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono block text-[0.8125rem] text-mute transition-colors duration-300 hover:text-paper"
                >
                  WhatsApp ↗
                </a>
              </li>
              <li>
                <a
                  href={company.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono block text-[0.8125rem] text-mute transition-colors duration-300 hover:text-paper"
                >
                  {`${t.contact.labels.map} ↗`}
                </a>
              </li>
            </ul>

            <h2 className="label-signal mt-10">{t.footer.reach}</h2>
            <ul className="mt-4 space-y-2">
              {t.experience.reach.map((place) => (
                <li key={place} className="mono text-[0.75rem] text-faint">
                  {place}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-16 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label">
            {/* Un solo nodo de texto: mezclar literales y expresiones parte el
                texto y la hidratación del prerender se desajusta. */}
            {`© ${year} ${t.footer.legal}`}
          </p>

          <button
            type="button"
            onClick={() => go("/#top")}
            className="label group inline-flex items-center gap-3 self-start text-mute transition-colors duration-300 hover:text-signal-soft sm:self-auto"
          >
            {t.footer.back}
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-0.5">
              ↑
            </span>
          </button>
        </div>
      </Section>
    </footer>
  );
}
