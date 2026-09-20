import { lazy } from "react";
import {
  createBrowserRouter,
  Navigate,
  useParams,
  type RouteObject,
} from "react-router-dom";
import { Shell } from "./App";

/**
 * La home NO va en diferido.
 *
 * Con `lazy()` el primer pintado mostraba el fallback de 60vh y, al llegar el
 * chunk, la página real (19.800 px de alto) empujaba el footer fuera del
 * viewport: CLS 0.40 medido con Lighthouse. La home es la ruta de entrada de
 * casi todo el tráfico, así que se sirve con el bundle principal (60 kB sin
 * comprimir) y el code splitting queda para las rutas secundarias.
 */
import HomePage from "@/pages/HomePage";

const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

/**
 * `basename` se deriva de `import.meta.env.BASE_URL`, que Vite calcula desde
 * `base` en vite.config.ts. Así el mismo código de rutas funciona en:
 *   - dominio propio (base "./" o "/") -> basename "/"
 *   - GitHub Pages (base "/sender/")   -> basename "/sender"
 * Sin este paso los <Link> apuntarían fuera del subdirectorio de Pages.
 */
const rawBase = import.meta.env.BASE_URL ?? "/";
export const basename = rawBase.replace(/\/+$/, "") || "/";

/** Redirección de compatibilidad: /soluciones/x -> /productos/x */
function CategoryRedirect() {
  const { categorySlug } = useParams();
  return <Navigate to={`/productos/${categorySlug ?? ""}`} replace />;
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Shell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "productos", element: <CatalogPage /> },
      { path: "productos/:categorySlug", element: <CategoryPage /> },
      { path: "producto/:productSlug", element: <ProductPage /> },
      { path: "soluciones", element: <Navigate to="/productos" replace /> },
      { path: "soluciones/:categorySlug", element: <CategoryRedirect /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes, { basename });
