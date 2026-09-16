import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface MinimalistHeroProps {
  logoText?: string;
  navLinks?: readonly { label: string; href: string }[];
  mainText?: string;
  readMoreLink?: string;
  onReadMore?: () => void;
  imageSrc?: string;
  imageAlt?: string;
  overlayText?: string;
  socialLinks?: readonly { label: string; href: string }[];
  locationText?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * MinimalistHero
 *
 * A presentational, mostly-white hero container designed to host a
 * cinematic video background. All high-frequency transforms are applied
 * via CSS custom properties / refs from the parent, so this component
 * stays purely presentational.
 */
export const MinimalistHero = forwardRef<HTMLElement, MinimalistHeroProps>(
  function MinimalistHero(
    {
      logoText: _logoText = "SENDER",
      navLinks: _navLinks,
      mainText = "SENDER",
      readMoreLink,
      imageSrc: _imageSrc,
      imageAlt: _imageAlt,
      overlayText,
      socialLinks,
      locationText = "CHILE · LATAM",
      className,
      children,
      onReadMore,
    },
    ref,
  ) {
    void _logoText;
    void _navLinks;
    void _imageSrc;
    void _imageAlt;
    return (
      <section
        ref={ref}
        id="hero"
        className={cn(
          "relative h-[100svh] w-full overflow-hidden bg-white",
          className,
        )}
        style={{ containerType: "inline-size" }}
      >
        {/* Video / media layer */}
        <div className="absolute inset-0">
          {children}
        </div>

        {/* Content layer */}
        <div className="relative z-20 h-full w-full flex flex-col">
          {/* Top tagline */}
          <div
            data-hero-tagline
            className="hero-transform pt-24 sm:pt-28 px-5 sm:px-8"
            style={{ transform: "translate3d(0,0,0)", opacity: 1 }}
          >
            <p className="text-[11px] sm:text-[12px] tracking-[0.25em] font-medium text-[#494949]">
              ENGINEERING THE SIGNAL
            </p>
          </div>

          {/* CTA button (top-right area) */}
          <div
            data-hero-cta
            className="hero-transform absolute top-24 sm:top-28 right-5 sm:right-8 hidden sm:block"
            style={{ transform: "translate3d(0,0,0)", opacity: 1 }}
          >
            {readMoreLink && (
              <button
                type="button"
                onClick={onReadMore}
                className="inline-flex items-center gap-2 rounded-full border border-[#494949]/20 bg-white px-5 py-2 text-[11px] tracking-[0.2em] font-medium text-[#494949] hover:border-[#1e73be] hover:text-[#1e73be] transition-colors"
              >
                {readMoreLink}
              </button>
            )}
          </div>

          {/* Giant wordmark */}
          <div className="flex-1 flex items-center justify-center px-5">
            <h1
              data-hero-wordmark
              className="hero-transform leading-[0.78] tracking-[-0.055em] font-[500] text-[#494949] whitespace-nowrap select-none text-center"
              style={{
                fontSize: "16cqw",
                transform: "translate3d(0,0,0)",
                opacity: 1,
              }}
            >
              <span className="text-[#494949]">{mainText}</span>
            </h1>
          </div>

          {/* Bottom row: chips + location + subhead */}
          <div className="px-5 sm:px-8 pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div
                data-hero-sub
                className="hero-transform max-w-md"
                style={{ transform: "translate3d(0,0,0)", opacity: 1 }}
              >
                <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#494949]/80">
                  {overlayText}
                </p>
                <div className="mt-3 sm:hidden">
                  <button
                    type="button"
                    onClick={onReadMore}
                    className="inline-flex items-center gap-2 rounded-full border border-[#494949]/20 bg-white px-5 py-2 text-[11px] tracking-[0.2em] font-medium text-[#494949] hover:border-[#1e73be] hover:text-[#1e73be] transition-colors"
                  >
                    {readMoreLink}
                  </button>
                </div>
              </div>

              <div className="flex items-end justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <div
                  data-hero-chips
                  className="hero-transform flex flex-wrap gap-2"
                  style={{ transform: "translate3d(0,0,0)", opacity: 1 }}
                >
                  {(socialLinks ?? []).map((s) => (
                    <span
                      key={s.label}
                      className="inline-flex items-center rounded-full border border-[#494949]/25 bg-white px-3 py-1 text-[10px] sm:text-[11px] tracking-[0.2em] font-medium text-[#494949]"
                    >
                      {s.label}
                    </span>
                  ))}
                </div>
                <div
                  data-hero-location
                  className="hero-transform"
                  style={{ transform: "translate3d(0,0,0)", opacity: 1 }}
                >
                  <span className="text-[11px] tracking-[0.25em] font-medium text-[#494949]/70">
                    {locationText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
);
