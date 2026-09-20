import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./router";
import { LanguageProvider } from "@/i18n/LanguageContext";

/**
 * GitHub Pages no sirve `index.html` para rutas profundas. `public/404.html`
 * redirige de vuelta preservando la ruta como query string; aquí la
 * restauramos antes de que el router lea la URL. En dominio propio
 * (sender.cl, con rewrite a index.html) este bloque no hace nada.
 */
(function restorePathFromPages404() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");
  if (!redirect?.startsWith("/")) return;
  window.history.replaceState(null, "", redirect + window.location.hash);
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  </StrictMode>,
);
