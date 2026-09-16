import { useEffect, useRef } from "react";
import type { Lang } from "@/content/site";
import { content } from "@/content/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AboutProps {
  lang: Lang;
}

export function About({ lang }: AboutProps) {
  const t = content[lang].about;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reducedMotion) {
      v.pause();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { rootMargin: "-15% 0px -15% 0px", threshold: 0 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <section id={t.id} className="relative bg-white py-24 sm:py-32 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] tracking-[0.25em] font-medium text-[#1e73be] mb-6">
          {t.eyebrow}
        </p>
        <h2 className="text-[36px] sm:text-[56px] lg:text-[72px] leading-[1.02] tracking-[-0.03em] font-medium text-[#494949] max-w-4xl">
          {t.title}
        </h2>

        <div className="mt-16 grid md:grid-cols-2 gap-10 md:gap-20 items-start">
          <div className="space-y-6 text-[15px] sm:text-[16px] leading-relaxed text-[#494949]/85 max-w-lg">
            <p>{t.p1}</p>
            <p>{t.p2}</p>
            <div className="pt-4 text-[11px] tracking-[0.2em] text-[#494949]/60">
              <span>SANTIAGO, CHILE</span>
              <span className="mx-3 text-[#494949]/25">|</span>
              <span>20+ YEARS</span>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full bg-[#eef2f6] overflow-hidden border border-[#494949]/10">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              className="h-full w-full object-cover"
              src="/assets/about.mp4"
              style={{ backgroundColor: "#e9eef3" }}
            />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="text-[10px] tracking-[0.3em] text-[#494949]/60 bg-white/90 border border-[#494949]/15 px-3 py-2">
                ABOUT · ASSET PLACEHOLDER
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
