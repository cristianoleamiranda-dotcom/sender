import type { Lang } from "@/content/site";
import { content } from "@/content/site";

interface QuoteProps {
  lang: Lang;
}

export function Quote({ lang }: QuoteProps) {
  const t = content[lang].quote;
  return (
    <section className="relative bg-white py-24 sm:py-32 px-5 sm:px-8 border-t border-[#494949]/10">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-[32px] sm:text-[48px] lg:text-[64px] leading-[1.05] tracking-[-0.025em] font-medium text-[#494949]">
          {t.title}
        </h2>
        <p className="mt-6 text-[15px] sm:text-[17px] leading-relaxed text-[#494949]/75 max-w-2xl mx-auto">
          {t.body}
        </p>
        <div className="mt-10">
          <a
            href="#contact"
            className="inline-flex items-center gap-3 rounded-full bg-[#1e73be] hover:bg-[#0085b2] text-white px-7 py-3.5 text-[12px] tracking-[0.2em] font-medium transition-colors"
          >
            {t.cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
