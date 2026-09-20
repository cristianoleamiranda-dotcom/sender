import { useLang } from "@/i18n/LanguageContext";
import { company } from "@/content/company";
import { useDocumentMeta } from "@/seo/useDocumentMeta";
import { organizationLd, projectsLd, webSiteLd } from "@/seo/jsonLd";
import { publicAsset } from "@/utils/assetUrl";
import { projects } from "@/data/projects";
import { Hero } from "@/components/Hero";
import { Signal } from "@/sections/Signal";
import { Experience } from "@/sections/Experience";
import { Solutions } from "@/sections/Solutions";
import { Transmission } from "@/sections/Transmission";
import { Engineering } from "@/sections/Engineering";
import { Featured } from "@/sections/Featured";
import { Automation } from "@/sections/Automation";
import { Reasons } from "@/sections/Reasons";
import { Projects } from "@/sections/Projects";
import { Contact } from "@/sections/Contact";

/**
 * HOME — recorrido narrativo completo.
 *
 * Orden pensado como el descenso por la cadena de transmisión:
 *   HERO → SEÑAL → EXPERIENCIA → SOLUCIONES → TRANSMISIÓN → INGENIERÍA →
 *   PRODUCTOS DESTACADOS → AUTOMATIZACIÓN → POR QUÉ SENDER → PROYECTOS →
 *   CONTACTO
 *
 * `id="top"` es el ancla del "volver arriba" del footer.
 */
export default function HomePage() {
  const { t, lang } = useLang();

  useDocumentMeta({
    title:
      lang === "es"
        ? "Sender — Tecnología que transmite | Ingeniería RF, Broadcasting y Telecomunicaciones en Chile"
        : "Sender — Technology that transmits | RF Engineering, Broadcasting and Telecommunications in Chile",
    description:
      lang === "es"
        ? "Sender: empresa chilena con más de 20 años de experiencia en ingeniería RF, radiodifusión y sistemas de transmisión. Transmisores AM/FM, enlaces STL, antenas HF, sistemas NAVTEX, torres y automatización. Diseño, fabricación, implementación y soporte."
        : "Sender: Chilean company with more than 20 years of experience in RF engineering, broadcasting and transmission systems. AM/FM transmitters, STL links, HF antennas, NAVTEX systems, towers and automation. Design, manufacturing, deployment and support.",
    path: "/",
    image: publicAsset("assets/hero-poster-1280.webp"),
    imageAlt: lang === "es" ? "SENDER — Tecnología que transmite" : "SENDER — Technology that transmits",
    jsonLd: [organizationLd(), webSiteLd(lang), projectsLd(projects, lang)],
  });

  return (
    <div id="top">
      <Hero />
      <Signal />
      <Experience />
      <Solutions />
      <Transmission />
      <Engineering />
      <Featured />
      <Automation />
      <Reasons />
      <Projects />
      <Contact />

      {/* Texto alternativo del claim, para lectores de pantalla y SEO */}
      <p className="sr-only">
        {company.name} — {t.footer.claim}
      </p>
    </div>
  );
}
