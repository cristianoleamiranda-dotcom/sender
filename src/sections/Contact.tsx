import type { Lang } from "@/content/site";
import { content } from "@/content/site";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactProps {
  lang: Lang;
}

export function Contact({ lang }: ContactProps) {
  const t = content[lang].contact;
  const info = t.info;
  return (
    <section
      id={t.id}
      className="relative bg-[#fafafa] py-24 sm:py-32 px-5 sm:px-8 border-t border-[#494949]/10"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] tracking-[0.25em] font-medium text-[#1e73be] mb-6">
          {lang === "es" ? "CONTACTO" : "CONTACT"}
        </p>
        <h2 className="text-[36px] sm:text-[56px] lg:text-[72px] leading-[1.02] tracking-[-0.03em] font-medium text-[#494949] max-w-4xl">
          {t.title}
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-10 md:gap-8">
          <a
            href={`tel:${info.phone.replace(/\s/g, "")}`}
            className="group block p-6 sm:p-7 border border-[#494949]/15 bg-white hover:border-[#1e73be] transition-colors"
          >
            <Phone
              size={20}
              strokeWidth={1.4}
              className="text-[#494949]/50 group-hover:text-[#1e73be] transition-colors"
            />
            <p className="mt-5 text-[11px] tracking-[0.2em] text-[#494949]/50">
              {lang === "es" ? "TELÉFONO" : "PHONE"}
            </p>
            <p className="mt-2 text-[15px] font-medium text-[#494949] group-hover:text-[#1e73be] transition-colors">
              {info.phone}
            </p>
          </a>

          <a
            href={`mailto:${info.email}`}
            className="group block p-6 sm:p-7 border border-[#494949]/15 bg-white hover:border-[#1e73be] transition-colors"
          >
            <Mail
              size={20}
              strokeWidth={1.4}
              className="text-[#494949]/50 group-hover:text-[#1e73be] transition-colors"
            />
            <p className="mt-5 text-[11px] tracking-[0.2em] text-[#494949]/50">
              EMAIL
            </p>
            <p className="mt-2 text-[15px] font-medium text-[#494949] group-hover:text-[#1e73be] transition-colors break-all">
              {info.email}
            </p>
            <p className="mt-1 text-[13px] text-[#494949]/55 break-all">
              {info.emailSecondary}
            </p>
          </a>

          <div className="p-6 sm:p-7 border border-[#494949]/15 bg-white">
            <MapPin
              size={20}
              strokeWidth={1.4}
              className="text-[#494949]/50"
            />
            <p className="mt-5 text-[11px] tracking-[0.2em] text-[#494949]/50">
              {lang === "es" ? "UBICACIÓN" : "LOCATION"}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[#494949]">
              {info.address}
            </p>
          </div>
        </div>

        <footer className="mt-24 pt-8 border-t border-[#494949]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-[11px] tracking-[0.25em] text-[#494949]/60">
            SENDER · ENGINEERING THE SIGNAL
          </span>
          <span className="text-[11px] tracking-[0.2em] text-[#494949]/50">
            © {new Date().getFullYear()} SENDER · CHILE
          </span>
        </footer>
      </div>
    </section>
  );
}
