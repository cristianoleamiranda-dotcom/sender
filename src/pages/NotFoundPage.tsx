import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useAnchorNavigation } from "@/hooks/useAnchorNavigation";
import { useDocumentMeta } from "@/seo/useDocumentMeta";
import { categories } from "@/content/catalog";
import { Section } from "@/ui/Primitives";
import { SignalWave } from "@/ui/SignalWave";

/**
 * 404 — señal perdida.
 *
 * No es un callejón sin salida: ofrece las siete estaciones del catálogo y las
 * dos rutas de conversión (contacto y WhatsApp), de modo que incluso un
 * visitante que llegó a una URL rota pueda alcanzar un producto en un clic.
 */
export default function NotFoundPage() {
  const { t, lang } = useLang();
  const go = useAnchorNavigation();

  useDocumentMeta({
    title: lang === "es" ? "Página no encontrada — Sender" : "Page not found — Sender",
    description:
      lang === "es"
        ? "La página solicitada no existe. Explora el catálogo de Sender: transmisores AM y FM, enlaces STL, antenas, automatización y sistemas NAVTEX."
        : "The requested page does not exist. Explore the Sender catalog: AM and FM transmitters, STL links, antennas, automation and NAVTEX systems.",
    });

  return (
    <Section className="relative overflow-hidden bg-ink py-32 sm:py-40 lg:py-48">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-10 opacity-30">
        <SignalWave height={200} />
      </div>

      <div className="relative">
        <span className="label-signal">404</span>

        <h1 className="display mt-6 text-[clamp(2.5rem,10vw,8rem)]">
          {lang === "es" ? "Señal no encontrada" : "Signal not found"}
        </h1>

        <p className="lead mt-8 max-w-[46ch]">
          {lang === "es"
            ? "La ruta que buscas no transmite. Prueba con una de las estaciones del catálogo."
            : "The route you are looking for is not transmitting. Try one of the catalog stations."}
        </p>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-3 bg-paper px-7 py-4 font-mono text-[0.6875rem] tracking-[0.2em] text-ink uppercase transition-colors duration-500 hover:bg-signal hover:text-paper"
          >
            {lang === "es" ? "Ir al inicio" : "Go to home"}
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <button
            type="button"
            onClick={() => go("/#contacto")}
            className="inline-flex items-center justify-center border border-line-strong px-7 py-4 font-mono text-[0.6875rem] tracking-[0.2em] text-paper uppercase transition-colors duration-500 hover:border-signal hover:text-signal-soft"
          >
            {t.nav.cta}
          </button>
        </div>

        <ul className="mt-20 grid gap-px border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.id} className="border-b border-line">
              <Link
                to={`/productos/${category.slug}`}
                className="group flex h-full flex-col gap-2 bg-ink p-5 transition-colors duration-500 hover:bg-graphite"
              >
                <span className="mono text-[0.625rem] text-signal">{category.index[lang]}</span>
                <span className="display text-[clamp(1rem,2vw,1.35rem)] transition-colors duration-500 group-hover:text-signal-soft">
                  {category.name[lang]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
