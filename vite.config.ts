import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * `base` se toma de VITE_BASE_PATH para que el mismo build sirva en:
 *   - desarrollo local            -> "/"
 *   - GitHub Pages (repo /sender) -> "/sender/"
 *   - dominio propio sender.cl    -> "/"
 * El workflow de Pages lo fija con `actions/configure-pages`.
 */
const base = process.env.VITE_BASE_PATH ?? "./";

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
