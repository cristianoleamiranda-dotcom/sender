import { useState, useCallback } from "react";
import type { Lang } from "@/content/site";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Process } from "@/sections/Process";
import { Products } from "@/sections/Products";
import { Work } from "@/sections/Work";
import { Quote } from "@/sections/Quote";
import { Contact } from "@/sections/Contact";

function App() {
  const [lang, setLang] = useState<Lang>("es");

  const handleLangChange = useCallback((l: Lang) => {
    setLang(l);
    document.documentElement.lang = l;
  }, []);

  return (
    <main className="relative min-h-screen bg-white text-[#494949] antialiased">
      <Hero lang={lang} onLangChange={handleLangChange} />
      <About lang={lang} />
      <Process lang={lang} />
      <Products lang={lang} />
      <Work lang={lang} />
      <Quote lang={lang} />
      <Contact lang={lang} />
    </main>
  );
}

export default App;
