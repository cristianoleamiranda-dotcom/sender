import { useEffect, useRef, useCallback } from "react";
import { MinimalistHero } from "@/components/ui/minimalist-hero";
import { Navbar } from "@/components/Navbar";
import { useVideoScrub } from "@/hooks/useVideoScrub";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Lang } from "@/content/site";
import { content } from "@/content/site";

interface HeroProps {
  lang: Lang;
  onLangChange: (l: Lang) => void;
}

const VIDEO_SRC = "/assets/sender-hero.mp4";
const POSTER_COLOR = "#e9eef3";

export function Hero({ lang, onLangChange }: HeroProps) {
  const t = content[lang];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const gradientRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  const applyTransforms = useCallback((k: number) => {
    const h = heroRef.current;
    if (!h) return;
    const nav = document.querySelector<HTMLElement>("[data-hero-nav]");
    const tagline = h.querySelector<HTMLElement>("[data-hero-tagline]");
    const cta = h.querySelector<HTMLElement>("[data-hero-cta]");
    const wordmark = h.querySelector<HTMLElement>("[data-hero-wordmark]");
    const sub = h.querySelector<HTMLElement>("[data-hero-sub]");
    const chips = h.querySelector<HTMLElement>("[data-hero-chips]");
    const location = h.querySelector<HTMLElement>("[data-hero-location]");
    const grad = gradientRef.current;

    const navTy = -130 * k;
    const ctaTy = 160 * k;
    const wmTy = -300 * k;
    const chipsTy = -140 * k;
    const locTy = 200 * k;
    const op = Math.max(0, 1 - k * 1.15);

    // NAV is positioned fixed, but it lives outside the container; we apply directly
    if (nav) {
      nav.style.transform = `translate3d(0, ${navTy}%, 0)`;
      nav.style.opacity = String(op);
    }
    if (tagline) {
      tagline.style.transform = `translate3d(0, ${navTy}%, 0)`;
      tagline.style.opacity = String(op);
    }
    if (cta) {
      cta.style.transform = `translate3d(0, ${ctaTy}%, 0)`;
      cta.style.opacity = String(op);
    }
    if (wordmark) {
      wordmark.style.transform = `translate3d(0, ${wmTy}%, 0)`;
      wordmark.style.opacity = String(Math.max(0, op));
    }
    if (sub) {
      sub.style.opacity = String(op);
    }
    if (chips) {
      chips.style.transform = `translate3d(0, ${chipsTy}%, 0)`;
      chips.style.opacity = String(op);
    }
    if (location) {
      location.style.transform = `translate3d(0, ${locTy}%, 0)`;
      location.style.opacity = String(op);
    }
    if (grad) {
      grad.style.opacity = String(Math.max(0, 1 - k * 1.25));
    }
  }, []);

  const { navigateToSection } = useVideoScrub({
    videoRef,
    reducedMotion,
    onFrame: applyTransforms,
  });

  // When hero video exists and metadata loaded, stay at frame 0
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const setFrame0 = () => {
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    };
    if (v.readyState >= 1) setFrame0();
    else v.addEventListener("loadedmetadata", setFrame0, { once: true });
    return () => v.removeEventListener("loadedmetadata", setFrame0);
  }, []);

  return (
    <>
      <Navbar
        links={t.nav}
        lang={lang}
        onLangChange={onLangChange}
        onNavigate={navigateToSection}
      />
      <MinimalistHero
        ref={heroRef}
        logoText="SENDER"
        mainText={t.hero.wordmark}
        readMoreLink={t.hero.cta}
        onReadMore={() => navigateToSection("contact")}
        overlayText={t.hero.sub}
        socialLinks={t.hero.chips.map((c) => ({ label: c, href: "#" }))}
        locationText={t.hero.location}
      >
        {/* Video */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_SRC}
          poster=""
          style={{ backgroundColor: POSTER_COLOR }}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Technical placeholder when video is missing */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0" aria-hidden="true">
          {/* placeholder only visible if video fails to load — handled via style below */}
        </div>

        {/* White gradient overlay that fades out with video progress */}
        <div
          ref={gradientRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,.82) 28%, rgba(255,255,255,.42) 60%, rgba(255,255,255,0) 100%)",
            opacity: 1,
          }}
        />

        {/* Video-missing placeholder indicator (only visible until video can play) */}
        <VideoPlaceholder videoRef={videoRef} />
      </MinimalistHero>
    </>
  );
}

function VideoPlaceholder({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const plsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const v = videoRef.current;
    const p = plsRef.current;
    if (!v || !p) return;
    const hide = () => {
      p.style.opacity = "0";
      p.style.pointerEvents = "none";
    };
    const show = () => {
      // Only show if video cannot play (src missing or error)
      if (v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        p.style.opacity = "1";
      }
    };
    v.addEventListener("canplay", hide);
    v.addEventListener("loadeddata", hide);
    v.addEventListener("error", show);
    // Give browser a moment to attempt load
    const timer = window.setTimeout(() => {
      if (v.readyState < 2 && v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        p.style.opacity = "1";
      }
    }, 1200);
    return () => {
      v.removeEventListener("canplay", hide);
      v.removeEventListener("loadeddata", hide);
      v.removeEventListener("error", show);
      window.clearTimeout(timer);
    };
  }, [videoRef]);

  return (
    <div
      ref={plsRef}
      className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 transition-opacity duration-700"
      style={{ backgroundColor: "rgba(255,255,255,0.35)" }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-2 text-[10px] tracking-[0.3em] font-medium text-[#494949]/70 bg-white/90 border border-[#494949]/15 px-4 py-3 rounded-sm">
        <span>HERO VIDEO · PLACEHOLDER</span>
        <span className="text-[9px] tracking-[0.2em] text-[#494949]/40">
          /assets/sender-hero.mp4
        </span>
      </div>
    </div>
  );
}
