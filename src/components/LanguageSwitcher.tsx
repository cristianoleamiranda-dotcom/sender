import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  lang: "es" | "en";
  onChange: (lang: "es" | "en") => void;
  className?: string;
}

export function LanguageSwitcher({
  lang,
  onChange,
  className,
}: LanguageSwitcherProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 text-[11px] font-medium tracking-[0.15em]",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange("es")}
        aria-label="Español"
        aria-pressed={lang === "es"}
        className={cn(
          "px-2 py-1 transition-colors",
          lang === "es"
            ? "text-[#494949]"
            : "text-[#494949]/50 hover:text-[#494949]",
        )}
      >
        ES
      </button>
      <span className="text-[#494949]/30">/</span>
      <button
        type="button"
        onClick={() => onChange("en")}
        aria-label="English"
        aria-pressed={lang === "en"}
        className={cn(
          "px-2 py-1 transition-colors",
          lang === "en"
            ? "text-[#494949]"
            : "text-[#494949]/50 hover:text-[#494949]",
        )}
      >
        EN
      </button>
    </div>
  );
}
