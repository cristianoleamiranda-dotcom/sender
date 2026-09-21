import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useAnchorNavigation } from "@/hooks/useAnchorNavigation";
import { company } from "@/content/company";
import { cn } from "@/utils/cn";

/**
 * NAVBAR
 *
 * - Minimalista: 5 destinos + switch ES/EN + CTA permanente.
 * - El CTA "CONSULTAR" NUNCA desaparece. En la versión anterior al
 *   rediseño el hero llevaba su propia barra que se desvanecía con el
 *   scroll y el CTA se perdía justo en la primera pantalla.
 * - Un solo nav para todo el sitio: antes existían dos implementaciones
 *   paralelas (la del hero y esta) con etiquetas duplicadas.
 * - Mobile: drawer a pantalla completa con focus trap y cierre por Escape.
 */
export function Navbar() {
  const { t, lang, setLang } = useLang();
  const go = useAnchorNavigation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* Estado de scroll: el nav pasa de transparente a sólido. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Bloqueo de scroll del documento con el drawer abierto. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* Escape + focus trap: accesibilidad real del menú móvil. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;

      const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    const raf = window.requestAnimationFrame(() => {
      drawerRef.current?.querySelector<HTMLElement>("a[href], button")?.focus();
    });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.cancelAnimationFrame(raf);
    };
  }, [open]);

  const handle = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    go(href);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-black/10 bg-paper/95 backdrop-blur-xl shadow-sm"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-12 lg:py-5">
          {/* Marca */}
          <a
            href="/"
            onClick={handle("/")}
            className="group flex shrink-0 items-center gap-2.5"
            aria-label={`${company.name} — ${lang === "es" ? "inicio" : "home"}`}
          >
            <span aria-hidden="true" className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute h-1.5 w-1.5 bg-signal-soft transition-colors group-hover:bg-signal" />
              <span className="absolute h-2 w-2 animate-ping bg-signal/40" />
            </span>
            <span className={cn("font-mono text-sm font-medium tracking-[0.32em] transition-colors sm:text-base", scrolled ? "text-ink group-hover:text-signal" : "text-paper group-hover:text-signal-soft")}>
              SENDER
            </span>
          </a>

          {/* Destinos — desktop */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label={t.nav.main}>
            {t.nav.items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={handle(item.href)}
                className={cn("label relative px-3.5 py-2 transition-colors duration-300", scrolled ? "text-ash hover:text-signal" : "text-white/70 hover:text-white")}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 ease-out hover:scale-x-100"
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Selector de idioma */}
            <div
              className="flex items-center gap-1.5"
              role="group"
              aria-label={t.nav.language}
            >
              {(["es", "en"] as const).map((code, i) => (
                <span key={code} className="flex items-center gap-1.5">
                  {i === 1 && (
                    <span aria-hidden="true" className={cn("h-3 w-px", scrolled ? "bg-black/15" : "bg-white/20")} />
                  )}
                  <button
                    type="button"
                    onClick={() => setLang(code)}
                    aria-pressed={lang === code}
                    className={cn(
                      "font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors duration-300",
                      lang === code
                        ? scrolled ? "text-signal" : "text-signal-soft"
                        : scrolled ? "text-ash hover:text-ink" : "text-white/60 hover:text-white",
                    )}
                  >
                    {code}
                  </button>
                </span>
              ))}
            </div>

            {/* CTA permanente */}
            <a
              href="/#contacto"
              onClick={handle("/#contacto")}
              className={cn("group hidden items-center gap-2.5 border px-4 py-2.5 font-mono text-[0.625rem] tracking-[0.2em] uppercase transition-colors duration-500 sm:inline-flex", scrolled ? "border-signal bg-signal text-white hover:bg-signal-deep hover:border-signal-deep" : "border-white/20 text-white hover:border-white hover:bg-white hover:text-ink")}
            >
              {t.nav.cta}
              <span
                aria-hidden="true"
                className="h-1 w-1 bg-signal transition-colors duration-500 group-hover:bg-paper"
              />
            </a>

            {/* Apertura del drawer */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={open}
              aria-controls="mobile-drawer"
            >
              <span
                aria-hidden="true"
                className={cn(
                  scrolled ? "block h-px w-5 bg-ink transition-transform duration-300" : "block h-px w-5 bg-paper transition-transform duration-300",
                  open && "translate-y-[3px] rotate-45",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  scrolled ? "block h-px w-5 bg-ink transition-transform duration-300" : "block h-px w-5 bg-paper transition-transform duration-300",
                  open && "-translate-y-[3px] -rotate-45",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer mobile a pantalla completa */}
      {open && (
        <div
          id="mobile-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.main}
          className="fixed inset-0 z-50 flex flex-col bg-ink lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-8">
            <span className="font-mono text-sm tracking-[0.32em] text-paper">SENDER</span>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
              className="label px-2 py-2 text-mute"
              aria-label={t.nav.closeMenu}
            >
              {t.nav.closeMenu}
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col justify-center gap-1 px-5 sm:px-8"
            aria-label={t.nav.main}
          >
            {t.nav.items.map((item, i) => (
              <a
                key={item.id}
                href={item.href}
                onClick={handle(item.href)}
                className="group flex items-baseline justify-between border-b border-line py-5"
              >
                <span className="display text-[clamp(2rem,11vw,3.5rem)] transition-colors duration-300 group-hover:text-signal-soft">
                  {item.label}
                </span>
                <span className="mono text-[0.625rem] text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </a>
            ))}
          </nav>

          <div className="space-y-4 px-5 pb-8 sm:px-8">
            <a
              href="/#contacto"
              onClick={handle("/#contacto")}
              className="flex w-full items-center justify-center gap-3 bg-paper px-6 py-4 font-mono text-[0.6875rem] tracking-[0.2em] text-ink uppercase"
            >
              {t.nav.cta}
            </a>
            <p className="label text-center">{t.nav.location}</p>
          </div>
        </div>
      )}
    </>
  );
}
