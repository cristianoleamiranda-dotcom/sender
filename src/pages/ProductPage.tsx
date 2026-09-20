import { useParams } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { categoryById, productBySlug } from "@/content/catalog";
import { useDocumentMeta } from "@/seo/useDocumentMeta";
import { breadcrumbLd, organizationLd, productLd } from "@/seo/jsonLd";
import { ProductDetail } from "@/components/products/ProductDetail";
import NotFoundPage from "./NotFoundPage";

/**
 * /producto/:productSlug
 *
 * Ficha individual. La arquitectura ya está preparada para crecer: añadir un
 * equipo al catálogo en `src/content/catalog.ts` crea automáticamente su URL,
 * su H1, su meta description, su schema `Product`, sus especificaciones y sus
 * relacionados, sin tocar este archivo.
 */
export default function ProductPage() {
  const { productSlug } = useParams();
  const { t, lang } = useLang();
  const product = productSlug ? productBySlug.get(productSlug) : undefined;
  const category = product ? categoryById.get(product.categoryId) : undefined;

  const specSummary = product
    ? product.specs
        .flatMap((g) => g.rows)
        .slice(0, 4)
        .map((r) => `${r.k[lang]}: ${r.v[lang]}`)
        .join(" · ")
    : "";

  useDocumentMeta({
    title: product
      ? `${product.name[lang]} — Sender Chile`
      : `${t.productPage.notFound} — Sender`,
    description: product ? clampMeta(product.summary[lang], specSummary) : "",
    path: product ? `/producto/${product.slug}` : "/productos",
    image: product?.image,
    imageAlt: product?.alt[lang],
    type: "article",
    jsonLd: product
      ? [
          organizationLd(),
          breadcrumbLd(
            [
              { name: "Sender", path: "/" },
              { name: lang === "es" ? "Productos" : "Products", path: "/productos" },
              ...(category
                ? [{ name: category.name[lang], path: `/productos/${category.slug}` }]
                : []),
              { name: product.name[lang], path: `/producto/${product.slug}` },
            ],
            lang,
          ),
          productLd(product, category, lang),
        ]
      : undefined,
  });

  if (!product) return <NotFoundPage />;

  return <ProductDetail product={product} />;
}

/**
 * Meta description de longitud controlada: corta por palabra, nunca a media
 * frase, y se mantiene bajo el límite que los buscadores muestran (~300).
 */
function clampMeta(summary: string, specSummary: string): string {
  const full = `${summary}${specSummary ? ` ${specSummary}.` : ""}`;
  if (full.length <= 290) return full;
  const cut = full.slice(0, 290);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 160 ? lastSpace : 290).trimEnd()}…`;
}
