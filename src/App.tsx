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
    <div className="relative min-h-screen bg-ink text-mute antialiased">
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

function RouteFallback() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center bg-ink"
      aria-busy="true"
      role="status"
    >
      <span className="label">SENDER</span>
    </div>
  );
}
