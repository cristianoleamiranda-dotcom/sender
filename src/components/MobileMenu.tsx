import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { NavLink } from "@/content/site";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  lang: "es" | "en";
  onLangChange: (l: "es" | "en") => void;
  onNavigate: (id: string) => void;
}

export function MobileMenu({
  open,
  onClose,
  links,
  lang,
  onLangChange,
  onNavigate,
}: MobileMenuProps) {
  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#494949]/10">
            <span className="text-[15px] tracking-[0.2em] font-medium text-[#494949]">
              SENDER
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="p-2 -mr-2 text-[#494949] hover:text-[#1e73be] transition-colors"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center px-8">
            <ul className="space-y-6">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.35 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const id = link.href.replace("#", "");
                      onNavigate(id);
                      onClose();
                    }}
                    className="block w-full text-left text-[28px] tracking-[-0.01em] font-medium text-[#494949] hover:text-[#1e73be] transition-colors"
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="px-8 py-6 border-t border-[#494949]/10 flex items-center justify-between">
            <LanguageSwitcher lang={lang} onChange={onLangChange} />
            <span className="text-[11px] tracking-[0.15em] text-[#494949]/60">
              CHILE · LATAM
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
