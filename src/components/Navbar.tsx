import { useState } from "react";
import { Menu } from "lucide-react";
import type { NavLink } from "@/content/site";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileMenu } from "@/components/MobileMenu";

interface NavbarProps {
  links: NavLink[];
  lang: "es" | "en";
  onLangChange: (l: "es" | "en") => void;
  onNavigate: (id: string) => void;
}

export function Navbar({ links, lang, onLangChange, onNavigate }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        data-hero-nav
        className="fixed top-0 left-0 right-0 z-50 hero-transform"
        style={{ transform: "translate3d(0,0,0)", opacity: 1 }}
      >
        <div className="flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6">
          {/* Left: wordmark lockup */}
          <div className="flex items-center gap-4">
            <span className="text-[15px] tracking-[0.2em] font-medium text-[#494949] select-none">
              SENDER
            </span>
          </div>

          {/* Center: desktop pill nav */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-1 rounded-full border border-[#494949]/15 bg-white/80 backdrop-blur-[2px] px-2 py-1"
          >
            {links.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => onNavigate(link.href.replace("#", ""))}
                className="px-3 py-1.5 text-[11px] tracking-[0.18em] font-medium text-[#494949] rounded-full hover:bg-[#1e73be]/8 hover:text-[#1e73be] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right: language + menu */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher lang={lang} onChange={onLangChange} />
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="md:hidden p-2 -mr-2 text-[#494949] hover:text-[#1e73be] transition-colors"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        links={links}
        lang={lang}
        onLangChange={onLangChange}
        onNavigate={onNavigate}
      />
    </>
  );
}
