import { Link, useParams } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { categoryBySlug, productsOfCategory } from "@/content/catalog";
import { useDocumentMeta } from "@/seo/useDocumentMeta";
import { breadcrumbLd, collectionLd, organizationLd } from "@/seo/jsonLd";
import { Section, Kicker } from "@/ui/Primitives";
import { RevealImage, RevealLines } from "@/ui/Reveal";
import { ProductExplorer } from "@/components/products/ProductExplorer";
import NotFoundPage from "./NotFoundPage";

/**
 * /productos/:categorySlug
 *
 * Una URL propia por categoría, con su H1, su meta description y su schema
 * `CollectionPage`. Es la pieza que hace indexable cada línea de producto por
 * separado ("transmisores FM Chile", "STL enlaces Chile", "RF Chile").
 */
export default function CategoryPage() {
  const { categorySlug } = useParams();
  const { t, lang } = useLang();
  const category = categorySlug ? categoryBySlug.get(categorySlug) : undefined;

  const items = category ? productsOfCategory(category.slug) : [];

  useDocumentMeta({
    title: category
      ? `${category.name[lang]} — Sender Chile`
      : `${t.productPage.notFound} — Sender`,
    description: category ? category.description[lang] : "",
    path: category ? `/productos/${category.slug}` : "/productos",
    image: category?.image,
    imageAlt: category?.alt[lang],
    jsonLd: category
      ? [
          organizationLd(),
          breadcrumbLd(
            [
              { name: "Sender", path: "/" },
              { name: lang === "es" ? "Productos" : "Products", path: "/productos" },
              { name: category.name[lang], path: `/productos/${category.slug}` },
            ],
            lang,
          ),
          collectionLd(category, lang, items),
        ]
      : undefined,
  });

  if (!category) return <NotFoundPage />;

  return (
    <>
      <Section className="bg-ink pt-32 pb-16 sm:pt-40 lg:pt-44">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-3">
            <li>
              <Link to="/" className="label transition-colors duration-300 hover:text-signal-soft">
                Sender
              </Link>
            </li>
            <li aria-hidden="true" className="text-faint">/</li>
            <li>
              <Link
                to="/productos"
                className="label transition-colors duration-300 hover:text-signal-soft"
              >
                {t.productPage.allCategories}
              </Link>
            </li>
            <li aria-hidden="true" className="text-faint">/</li>
            <li>
              <span className="label-signal">{category.index[lang]}</span>
            </li>
          </ol>
        </nav>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Kicker>{category.kicker[lang]}</Kicker>
            <RevealLines
              as="h1"
              lines={[category.name[lang]]}
              className="display mt-6 text-[clamp(2.4rem,7.5vw,5.5rem)]"
            />
            <p className="lead mt-8 max-w-[56ch]">{category.description[lang]}</p>

            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {category.scope.map((item) => (
                <li key={item[lang]} className="label flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-1 w-1 bg-signal" />
                  {item[lang]}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <RevealImage
              src={category.image}
              alt={category.alt[lang]}
              className="aspect-4/3 border border-line"
              priority
            />
          </div>
        </div>
      </Section>

      <Section className="bg-ink pb-28 sm:pb-36 lg:pb-44">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-8">
          <h2 className="label-signal">
            {t.catalogPage.products} · {String(items.length).padStart(2, "0")}
          </h2>
          <Link
            to="/productos"
            className="label transition-colors duration-300 hover:text-signal-soft"
          >
            {t.catalogPage.allProducts} →
          </Link>
        </div>

        <div className="mt-10">
          <ProductExplorer initialCategory={category.slug} showFilter={false} />
        </div>
      </Section>
    </>
  );
}
