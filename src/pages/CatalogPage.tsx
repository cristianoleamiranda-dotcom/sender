import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { categories, products } from "@/content/catalog";
import { useDocumentMeta } from "@/seo/useDocumentMeta";
import { breadcrumbLd, organizationLd } from "@/seo/jsonLd";
import { Section, Kicker } from "@/ui/Primitives";
import { RevealLines } from "@/ui/Reveal";
import { ProductExplorer } from "@/components/products/ProductExplorer";

/**
 * /productos — catálogo completo.
 *
 * Las siete estaciones primero (como índice navegable) y el explorador
 * filtrable después. Cada categoría tiene además su propia URL con H1, meta y
 * schema independientes, que es lo que permite posicionar
 * "transmisores FM Chile" o "STL enlaces Chile" por separado.
 */
export default function CatalogPage() {
  const { t, lang } = useLang();

  useDocumentMeta({
    title:
      lang === "es"
        ? "Productos y soluciones — Sender Chile | Transmisores AM/FM, STL, antenas y NAVTEX"
        : "Products and solutions — Sender Chile | AM/FM transmitters, STL, antennas and NAVTEX",
    description:
      lang === "es"
        ? "Catálogo de Sender Chile: transmisores AM de estado sólido 1–10 kW, transmisores FM 50 W–1 kW, enlaces estudio-planta STL, procesamiento de audio, automatización, antenas HF y componentes RF."
        : "Sender Chile catalog: solid-state AM transmitters 1–10 kW, FM transmitters 50 W–1 kW, studio-transmitter STL links, audio processing, automation, HF antennas and RF components.",
    path: "/productos",
    jsonLd: [
      organizationLd(),
      breadcrumbLd(
        [
          { name: "Sender", path: "/" },
          { name: lang === "es" ? "Productos" : "Products", path: "/productos" },
        ],
        lang,
      ),
    ],
  });

  return (
    <>
      <Section className="bg-ink pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-44">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-3">
            <li>
              <Link to="/" className="label transition-colors duration-300 hover:text-signal-soft">
                Sender
              </Link>
            </li>
            <li aria-hidden="true" className="text-faint">/</li>
            <li>
              <span className="label-signal">{t.catalogPage.kicker}</span>
            </li>
          </ol>
        </nav>

        <Kicker className="mt-12">{t.catalogPage.kicker}</Kicker>
        <RevealLines
          as="h1"
          lines={t.catalogPage.title}
          className="display mt-6 text-display"
        />
        <p className="lead mt-8 max-w-[56ch]">{t.catalogPage.intro}</p>

        {/* Índice de estaciones */}
        <ul className="mt-14 grid gap-px border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.id} className="border-b border-line">
              <Link
                to={`/productos/${category.slug}`}
                className="group flex h-full flex-col gap-3 bg-ink p-5 transition-colors duration-500 hover:bg-graphite"
              >
                <span className="mono text-[0.625rem] text-signal">{category.index[lang]}</span>
                <span className="display text-[clamp(1.05rem,2.2vw,1.5rem)] transition-colors duration-500 group-hover:text-signal-soft">
                  {category.name[lang]}
                </span>
                <span className="label mt-auto">{category.kicker[lang]}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="label mt-6">
          {products.length} {t.solutions.itemsCount}
        </p>
      </Section>

      <Section className="bg-ink pb-28 sm:pb-36 lg:pb-44">
        <ProductExplorer />
      </Section>
    </>
  );
}
