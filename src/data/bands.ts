/**
 * SENDER — BANDAS DE OPERACIÓN
 *
 * Rangos tomados de las fichas de producto publicadas en sender.cl.
 * Las siglas de banda (AM, FM, HF, VHF, UHF, NAVTEX) son nomenclatura
 * técnica internacional: idénticas en ambos idiomas.
 */

import type { Band } from "@/content/types";

export const bands: Band[] = [
  {
    code: { es: "AM", en: "AM" },
    range: { es: "490 – 1700 kHz", en: "490 – 1700 kHz" },
    use: {
      es: "Radiodifusión en banda media · Transmisores Serie SS · Antenas monopolo",
      en: "Medium-wave broadcasting · SS Series transmitters · Monopole antennas",
    },
  },
  {
    code: { es: "FM", en: "FM" },
    range: { es: "87.5 – 108 MHz", en: "87.5 – 108 MHz" },
    use: {
      es: "Radiodifusión FM · 50 W a 1 kW · PLL digital de alta estabilidad",
      en: "FM broadcasting · 50 W to 1 kW · High-stability digital PLL",
    },
  },
  {
    code: { es: "HF", en: "HF" },
    range: { es: "2 – 30 MHz", en: "2 – 30 MHz" },
    use: {
      es: "Antenas HF profesionales · 1 kW · Comunicaciones de largo alcance",
      en: "Professional HF antennas · 1 kW · Long-range communications",
    },
  },
  {
    code: { es: "VHF", en: "VHF" },
    range: { es: "134 – 174 MHz", en: "134 – 174 MHz" },
    use: {
      es: "Enlaces estudio–planta · Antenas Yagi de 3 a 7 elementos",
      en: "Studio–transmitter links · 3 to 7-element Yagi antennas",
    },
  },
  {
    code: { es: "UHF", en: "UHF" },
    range: { es: "Enlaces UHF", en: "UHF links" },
    use: {
      es: "Enlaces de radiodifusión · Antenas direccionales",
      en: "Broadcast links · Directional antennas",
    },
  },
  {
    code: { es: "NAVTEX", en: "NAVTEX" },
    range: { es: "490 / 518 kHz", en: "490 / 518 kHz" },
    use: {
      es: "Seguridad marítima · Automatización propia · Telemetría",
      en: "Maritime safety · In-house automation · Telemetry",
    },
  },
];
