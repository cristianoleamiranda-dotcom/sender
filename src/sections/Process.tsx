import type { Lang } from "@/content/site";
import { content } from "@/content/site";

interface ProcessProps {
  lang: Lang;
}

export function Process({ lang }: ProcessProps) {
  const t = content[lang].process;
  return (
    <section id={t.id} className="relative bg-white py-24 sm:py-32 px-5 sm:px-8 border-t border-[#494949]/10">
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] tracking-[0.25em] font-medium text-[#1e73be] mb-6">
          {lang === "es" ? "INGENIERÍA" : "ENGINEERING"}
        </p>
        <h2 className="text-[36px] sm:text-[56px] lg:text-[72px] leading-[1.02] tracking-[-0.03em] font-medium text-[#494949] max-w-4xl">
          {t.title}
        </h2>
        <p className="mt-4 text-[13px] sm:text-[14px] tracking-[0.05em] text-[#494949]/60">
          {t.note}
        </p>

        <ol className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#494949]/10 border border-[#494949]/10">
          {t.steps.map((step) => (
            <li
              key={step.num}
              className="bg-white p-6 sm:p-8 min-h-[220px] flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] tracking-[0.25em] font-medium text-[#1e73be]">
                  {step.num}
                </span>
                <span className="h-px w-8 bg-[#494949]/20 mt-2" />
              </div>
              <div>
                <h3 className="text-[14px] sm:text-[15px] tracking-[0.12em] font-medium text-[#494949]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-[#494949]/75">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
