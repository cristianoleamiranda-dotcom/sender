import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { company, whatsappHref } from "@/content/company";
import { Section } from "@/ui/Primitives";
import { RevealLines } from "@/ui/Reveal";
import { Kicker } from "@/ui/Primitives";
import { SignalWave } from "@/ui/SignalWave";

/**
 * 10 — CONTACTO
 *
 * El cierre no es un formulario corporativo: es una última experiencia.
 * Título a escala masiva sobre una señal que sigue corriendo, y debajo las
 * tres acciones que importan (contactar, WhatsApp, ver productos) más los
 * datos confirmados de la empresa.
 *
 * El formulario existe pero es secundario y honesto: compone el mensaje en el
 * cliente de correo del usuario. No hay backend, así que fingir un envío sería
 * engañoso. Todos los campos tienen `label` asociado por `htmlFor`/`id`
 * (en la versión anterior al rediseño no lo tenían).
 */
export function Contact() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    type: "",
    message: "",
  });
  const [state, setState] = useState<"idle" | "preparing">("idle");

  const types = t.contact.form.types;
  const selectedType = form.type || types[0];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject =
      lang === "es"
        ? `Consulta — ${selectedType}${form.company ? ` — ${form.company}` : ""}`
        : `Enquiry — ${selectedType}${form.company ? ` — ${form.company}` : ""}`;

    const body =
      lang === "es"
        ? [
            `Nombre: ${form.name}`,
            `Empresa: ${form.company}`,
            `Correo: ${form.email}`,
            `Requerimiento: ${selectedType}`,
            "",
            "Mensaje:",
            form.message,
          ].join("\n")
        : [
            `Name: ${form.name}`,
            `Company: ${form.company}`,
            `Email: ${form.email}`,
            `Request: ${selectedType}`,
            "",
            "Message:",
            form.message,
          ].join("\n");

    setState("preparing");
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    // Se restaura el estado por si el usuario cancela en su cliente de correo.
    window.setTimeout(() => setState("idle"), 2500);
  };

  const field = (id: string) => `${formId}-${id}`;

  return (
    <Section
      id="contacto"
      bleed
      className="relative overflow-hidden surface-light bg-paper"
      labelledBy="contacto-title"
    >
      {/* Señal de fondo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 opacity-40">
        <SignalWave height={reduced ? 120 : 260} phase={reduced ? 0.3 : undefined} />
      </div>
      <div aria-hidden="true" className="grid-tech pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto w-full max-w-[1600px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44 xl:px-16">
        <Kicker>{t.contact.kicker}</Kicker>

        <RevealLines
          id="contacto-title"
          as="h2"
          lines={[t.contact.title]}
          className="display mt-6 text-[clamp(2.5rem,10vw,8rem)]"
        />

        <p className="lead mt-8 max-w-[40ch]">{t.contact.sub}</p>

        {/* Acciones principales */}
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <a
            href={`mailto:${company.email}`}
            className="group inline-flex items-center justify-center gap-3 bg-signal border border-signal px-8 py-4 font-mono text-[0.6875rem] tracking-[0.2em] text-white uppercase transition-colors duration-500 hover:bg-signal-deep hover:border-signal-deep"
          >
            {t.contact.primary}
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </a>

          <a
            href={whatsappHref(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 border border-black/15 bg-white px-8 py-4 font-mono text-[0.6875rem] tracking-[0.2em] text-ink uppercase transition-colors duration-500 hover:border-signal hover:text-signal"
          >
            {t.contact.whatsapp}
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-signal" />
          </a>

          <button
            type="button"
            onClick={() => navigate("/productos")}
            className="inline-flex items-center justify-center px-4 py-4 font-mono text-[0.6875rem] tracking-[0.2em] text-ash uppercase transition-colors duration-300 hover:text-signal"
          >
            {t.contact.products}
          </button>
        </div>

        {/* Datos + formulario */}
        <div className="mt-20 grid gap-14 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          {/* Datos confirmados */}
          <div className="lg:col-span-5">
            <h3 className="label-signal">{company.name}</h3>

            <dl className="mt-8 space-y-px">
              <ContactRow label={t.contact.labels.address}>
                <address className="text-[0.9375rem] leading-relaxed text-ink not-italic">
                  {company.address.street}
                  <br />
                  {company.address.commune}, {company.address.city}
                  <br />
                  {company.address.country}
                </address>
                <a
                  href={company.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label mt-3 inline-flex items-center gap-2 text-mute transition-colors duration-300 hover:text-signal-soft"
                >
                  {`${t.contact.labels.map} ↗`}
                </a>
              </ContactRow>

              <ContactRow label={t.contact.labels.phone}>
                <a
                  href={company.phoneHref}
                  className="mono text-[1.0625rem] text-ink transition-colors duration-300 hover:text-signal-soft"
                >
                  {company.phone}
                </a>
              </ContactRow>

              <ContactRow label={t.contact.labels.email}>
                <a
                  href={`mailto:${company.email}`}
                  className="mono text-[0.9375rem] text-ink transition-colors duration-300 hover:text-signal-soft"
                >
                  {company.email}
                </a>
              </ContactRow>

              <ContactRow label={t.contact.labels.salesEmail}>
                <a
                  href={`mailto:${company.salesEmail}`}
                  className="mono text-[0.9375rem] text-mute transition-colors duration-300 hover:text-signal-soft"
                >
                  {company.salesEmail}
                </a>
              </ContactRow>
            </dl>
          </div>

          {/* Formulario secundario */}
          <div className="lg:col-span-7">
            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="border border-black/10 bg-white p-6 sm:p-9 shadow-sm"
              aria-labelledby={`${formId}-title`}
            >
              <h3 id={`${formId}-title`} className="label-signal">
                {t.contact.form.title}
              </h3>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field id={field("name")} label={t.contact.form.name} required>
                  <input
                    id={field("name")}
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                </Field>

                <Field id={field("company")} label={t.contact.form.company}>
                  <input
                    id={field("company")}
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className={inputClass}
                  />
                </Field>

                <Field id={field("email")} label={t.contact.form.email} required>
                  <input
                    id={field("email")}
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                </Field>

                <Field id={field("type")} label={t.contact.form.type}>
                  <select
                    id={field("type")}
                    name="type"
                    value={selectedType}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={`${inputClass} appearance-none`}
                  >
                    {types.map((type) => (
                      <option key={type} value={type} className="bg-ink text-paper">
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="sm:col-span-2">
                  <Field id={field("message")} label={t.contact.form.message} required>
                    <textarea
                      id={field("message")}
                      name="message"
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputClass} resize-y`}
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={state === "preparing"}
                  className="group inline-flex items-center justify-center gap-3 bg-signal border border-signal px-7 py-4 font-mono text-[0.6875rem] tracking-[0.2em] text-white uppercase transition-colors duration-500 hover:bg-signal-deep disabled:opacity-50"
                >
                  {state === "preparing" ? t.contact.form.preparing : t.contact.form.submit}
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </button>

                <a
                  href={whatsappHref(lang, selectedType)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label inline-flex items-center justify-center gap-2 px-2 py-4 text-ash transition-colors duration-300 hover:text-signal-soft"
                >
                  {t.contact.whatsapp}
                  <span aria-hidden="true" className="h-1.5 w-1.5 bg-signal" />
                </a>
              </div>

              <p className="label mt-6 max-w-[64ch] leading-relaxed">
                {t.contact.form.note}
              </p>
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
}

const inputClass =
  "w-full border border-black/15 bg-white px-4 py-3 text-[0.875rem] text-ink transition-colors duration-300 " +
  "placeholder:text-ash/60 hover:border-black/25 focus:border-signal focus:outline-none";

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-6">
      <dt className="label">{label}</dt>
      <dd className="mt-2.5">{children}</dd>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label mb-2.5 block">
        {label}
        {required && <span className="ml-1 text-signal">*</span>}
      </label>
      {children}
    </div>
  );
}
