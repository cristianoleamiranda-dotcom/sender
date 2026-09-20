import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { siteContent } from "@/content/site";
import { resolve } from "@/content/resolve";
import type { Lang, SiteCopy } from "@/content/types";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Todo el texto visible del sitio, ya resuelto al idioma activo. */
  t: SiteCopy;
}

const STORAGE_KEY = "sender-lang";

const LanguageContext = createContext<LanguageContextValue | null>(null);

function initialLang(): Lang {
  if (typeof window === "undefined") return "es";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "es" || stored === "en") return stored;
  } catch {
    /* almacenamiento no disponible: seguir con la detección */
  }
  const nav = (window.navigator.language ?? "").toLowerCase();
  // Chile es el mercado principal: todo lo que no sea inglés explícito cae en ES.
  return nav.startsWith("en") ? "en" : "es";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = (next: Lang) => setLangState(next);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignorar: modo privado o almacenamiento bloqueado */
    }
  }, [lang]);

  // Se resuelve una sola vez por cambio de idioma, no en cada render.
  const t = useMemo(() => resolve(siteContent, lang) as SiteCopy, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t }),
    [lang, t],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang debe usarse dentro de <LanguageProvider>");
  }
  return ctx;
}

export type { Lang };
