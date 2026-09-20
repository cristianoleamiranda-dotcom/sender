/**
 * SENDER — PROYECTOS E INSTALACIONES DOCUMENTADAS
 *
 * Solo se lista lo que Sender publica en sender.cl o lo que fue cubierto
 * por prensa especializada con enlace verificable.
 *
 * Lo que NO se hace:
 *  - no se inventan clientes,
 *  - no se asignan años (Sender no publica fechas de estos proyectos),
 *  - no se agregan cifras de "proyectos completados".
 *
 * Por eso esta ficha no tiene campo `year`: si el dato no está documentado,
 * la interfaz simplemente no lo muestra.
 */

import type { Project } from "@/content/types";
import { img } from "@/content/images";

export const projects: Project[] = [
  {
    id: "radio-colosal-ambato",
    index: { es: "01", en: "01" },
    name: {
      es: "Transmisor Sender en Radio Colosal, Ambato",
      en: "Sender transmitter at Radio Colosal, Ambato",
    },
    category: { es: "BROADCASTING", en: "BROADCASTING" },
    location: { es: "Ambato", en: "Ambato" },
    technology: {
      es: "Transmisor de radiodifusión · Instalación y puesta en marcha",
      en: "Broadcast transmitter · Installation and commissioning",
    },
    summary: {
      es: "Instalación de un transmisor Sender en Radio Colosal de Ambato, documentada por la prensa especializada internacional del sector de radiodifusión.",
      en: "Installation of a Sender transmitter at Radio Colosal in Ambato, documented by international trade press covering the broadcasting sector.",
    },
    image: img.capBroadcast.sm,
    alt: {
      es: "Sala de transmisión con racks de equipos de radiodifusión",
      en: "Transmission hall with broadcast equipment racks",
    },
    source: {
      label: { es: "Radio World", en: "Radio World" },
      url: "https://www.radioworld.com/global/radio-colosal-installs-sender-transmitter-in-ambato",
    },
  },
  {
    id: "torre-armada-playa-ancha",
    index: { es: "02", en: "02" },
    name: {
      es: "Torre autosoportada de 60 m · Armada de Chile",
      en: "60 m self-supporting tower · Chilean Navy",
    },
    category: { es: "INFRAESTRUCTURA", en: "INFRASTRUCTURE" },
    location: { es: "Playa Ancha, Valparaíso", en: "Playa Ancha, Valparaíso" },
    technology: {
      es: "Ingeniería y montaje de infraestructura de telecomunicaciones",
      en: "Telecommunications infrastructure engineering and assembly",
    },
    summary: {
      es: "Proyecto de telecomunicaciones de alta complejidad: desmontaje de una torre autosoportada de 60 metros para la Armada de Chile.",
      en: "High-complexity telecommunications project: dismantling of a 60-metre self-supporting tower for the Chilean Navy.",
    },
    image: img.capAntennas.sm,
    alt: {
      es: "Torre de telecomunicaciones con arreglo de antenas",
      en: "Telecommunications tower with antenna array",
    },
  },
  {
    id: "hf-isla-de-pascua",
    index: { es: "03", en: "03" },
    name: {
      es: "Comunicaciones HF de largo alcance · Isla de Pascua",
      en: "Long-range HF communications · Easter Island",
    },
    category: { es: "HF", en: "HF" },
    location: { es: "Isla de Pascua", en: "Easter Island" },
    technology: {
      es: "Solución HF de largo alcance · Instalación y operación",
      en: "Long-range HF solution · Installation and operation",
    },
    summary: {
      es: "Solución de comunicaciones HF de largo alcance para entornos estratégicos, con instalación y operación en Isla de Pascua.",
      en: "Long-range HF communications solution for strategic environments, installed and operated on Easter Island.",
    },
    image: img.capAntennas.sm,
    alt: {
      es: "Antenas HF de alto rendimiento en proyecto de comunicaciones profesionales",
      en: "High-performance HF antennas in a professional communications project",
    },
  },
  {
    id: "antena-mf-navtex",
    index: { es: "04", en: "04" },
    name: {
      es: "Antena MF para sistema NAVTEX 490 / 518 kHz",
      en: "MF antenna for NAVTEX system 490 / 518 kHz",
    },
    category: { es: "NAVTEX", en: "NAVTEX" },
    location: { es: "Entornos marítimos", en: "Maritime environments" },
    technology: {
      es: "Transmisión MF · Sistema radiante · Automatización",
      en: "MF transmission · Radiating system · Automation",
    },
    summary: {
      es: "Soluciones de transmisión MF para sistemas NAVTEX, diseñadas para operación confiable en entornos marítimos y de defensa, con antena y torre específicas para 490 kHz y 518 kHz.",
      en: "MF transmission solutions for NAVTEX systems, designed for reliable operation in maritime and defense environments, with an antenna and tower specific to 490 kHz and 518 kHz.",
    },
    image: img.capCritical.sm,
    alt: {
      es: "Estación costera de radio con mástil monopolo entre la niebla marina",
      en: "Coastal radio station with monopole mast in sea fog",
    },
  },
  {
    id: "antenas-hf-defensa",
    index: { es: "05", en: "05" },
    name: {
      es: "Antenas HF de alto rendimiento",
      en: "High-performance HF antennas",
    },
    category: { es: "HF", en: "HF" },
    location: { es: "Chile y proyectos internacionales", en: "Chile and international projects" },
    technology: {
      es: "Antenas HF 2 – 30 MHz · 1 kW · Servicio continuo",
      en: "HF antennas 2 – 30 MHz · 1 kW · Continuous duty",
    },
    summary: {
      es: "Soluciones en antenas HF de alta eficiencia para comunicaciones profesionales, con instalación en proyectos de defensa y radiodifusión.",
      en: "High-efficiency HF antenna solutions for professional communications, installed in defense and broadcasting projects.",
    },
    image: img.capRf.sm,
    alt: {
      es: "Sistema radiante y módulos de radiofrecuencia",
      en: "Radiating system and radio-frequency modules",
    },
  },
  {
    id: "stl-enlaces",
    index: { es: "06", en: "06" },
    name: {
      es: "Enlaces estudio–planta AM / FM",
      en: "AM / FM studio–transmitter links",
    },
    category: { es: "STL", en: "STL" },
    location: { es: "Radiodifusión profesional", en: "Professional broadcasting" },
    technology: {
      es: "STAL-200 · AL-100 · Yagi 134 – 174 MHz · Hasta 10 W",
      en: "STAL-200 · AL-100 · Yagi 134 – 174 MHz · Up to 10 W",
    },
    summary: {
      es: "Enlaces estudio–planta con encendido remoto del transmisor, operación Mono/MPX y antenas Yagi de aluminio 6162 para operación continua en ambientes exigentes.",
      en: "Studio–transmitter links with remote transmitter start, Mono/MPX operation and 6162 aluminium Yagi antennas for continuous operation in demanding environments.",
    },
    image: img.projStl.sm,
    alt: {
      es: "Antena Yagi de enlace sobre azotea con vista a Santiago",
      en: "Yagi link antenna on a rooftop overlooking Santiago",
    },
  },
];
