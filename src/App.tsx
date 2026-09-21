import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/sections/Footer";
import { SkipLink } from "@/ui/SkipLink";
import { RouteProgress } from "@/ui/RouteProgress";
import { useLenis } from "@/hooks/useLenis";
import { useScrollRestore } from "@/hooks/useScrollRestore";

/**
 * Estructura compartida por todas las rutas.
 *
 * Aquí vive el smooth scrolling global (Lenis). En el commit anterior al
 * rediseño el hook estaba implementado pero nadie lo llamaba: la página
 * scrolleaba con el comportamiento nativo del navegador.
 */
export function Shell() {
  useLenis();
  useScrollRestore();

  return (
    <div className="relative min-h-screen bg-paper text-ash antialiased">
      <SkipLink />
      <RouteProgress />
      <Navbar />

      <main id="main">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Estado interino mientras llega el chunk de una ruta diferida.
 *
 * Reserva el alto del viewport a propósito: con `min-h-[60vh]` el contenido
 * real aparecía más alto y empujaba el footer fuera de pantalla, lo que
 * Lighthouse medía como CLS 0.40 en `/productos`. Ocupando 100vh el footer
 * queda debajo del pliegue y el salto deja de ser visible.
 *
 * La home no pasa por aquí: se importa de forma síncrona en `src/router.tsx`.
 */
function RouteFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-paper"
      aria-busy="true"
      role="status"
    >
      <span className="label animate-pulse">SENDER</span>
    </div>
  );
}
