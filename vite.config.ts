import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * `base` se toma de VITE_BASE_PATH para que el mismo código sirva en los tres
 * destinos:
 *   - desarrollo local            -> "/"  (por defecto)
 *   - GitHub Pages (repo /sender) -> "/sender/"  (lo fija deploy.yml)
 *   - dominio propio sender.cl    -> "/"
 *
 * Por qué "/" y no "./" por defecto: con rutas profundas (/producto/x) las URL
 * relativas se resuelven contra el directorio actual y romperían los
 * <script src> y <link href> del HTML servido. Con base absoluta, un único
 * index.html sirve para cualquier profundidad de ruta.
 */
const base = process.env.VITE_BASE_PATH ?? "/";

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // Las fotos reales de Sender ya se optimizan en scripts/optimize-assets.py.
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["motion"],
          lenis: ["lenis"],
          router: ["react-router-dom"],
        },
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: true,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
