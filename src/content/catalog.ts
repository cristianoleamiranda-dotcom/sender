/**
 * SENDER — CATÁLOGO
 *
 * REGLA ABSOLUTA DE CONTENIDO: nada de lo que está aquí fue inventado.
 * Cada especificación proviene de las fichas publicadas en sender.cl
 * (verificadas el 2026-09-20) o del contenido ya existente en el repositorio.
 * El campo `sourceUrl` deja trazable de dónde salió cada producto.
 *
 * Lo que NO está documentado simplemente no está: no hay cifras de ventas,
 * clientes sin nombre, certificaciones, premios ni fechas de hitos.
 */

import type { Category, Product } from "./types";
import { img } from "./images";

/* ==================================================================
   CATEGORÍAS — las 7 definidas en el brief de rediseño.
   Las líneas de producto reales que el brief no numeraba por separado
   (antenas, coaxial, condensadores, integrados, torres, NAVTEX, HF)
   se agrupan dentro de 06 RF Y COMPONENTES y 07 SOLUCIONES ESPECIALES,
   de modo que no se pierde catálogo verificado.
   ================================================================== */

export const categories: Category[] = [
  {
    id: "am",
    slug: "transmisores-am",
    index: { es: "01", en: "01" },
    name: { es: "Transmisores AM", en: "AM Transmitters" },
    kicker: { es: "Banda media · Estado sólido", en: "Medium wave · Solid state" },
    description: {
      es: "Serie SENDER SS de transmisores AM de estado sólido con arquitectura modular, amplificación Clase D y modulación por ancho de pulso (PWM), diseñada y fabricada para radiodifusión profesional en banda media.",
      en: "SENDER SS series of solid-state AM transmitters with modular architecture, Class D amplification and pulse-width modulation (PWM), designed and manufactured for professional medium-wave broadcasting.",
    },
    scope: [
      { es: "1 kW a 10 kW", en: "1 kW to 10 kW" },
      { es: "490 kHz – 1700 kHz", en: "490 kHz – 1700 kHz" },
      { es: "Clase D · PWM", en: "Class D · PWM" },
      { es: "Operación continua 24/7", en: "Continuous 24/7 operation" },
    ],
    productSlugs: ["serie-sender-ss", "amplificador-mf-1000w"],
    image: img.projAm.sm,
    alt: {
      es: "Gabinete de transmisor AM de estado sólido Serie SENDER SS",
      en: "SENDER SS series solid-state AM transmitter cabinet",
    },
  },
  {
    id: "fm",
    slug: "transmisores-fm",
    index: { es: "02", en: "02" },
    name: { es: "Transmisores FM", en: "FM Transmitters" },
    kicker: { es: "87.5 – 108 MHz · Estado sólido", en: "87.5 – 108 MHz · Solid state" },
    description: {
      es: "Serie de transmisores FM de estado sólido para la banda de 87.5 a 108 MHz, con PLL digital de alta estabilidad, dirigida a estaciones comunitarias, locales, regionales y de alta potencia.",
      en: "Solid-state FM transmitter series for the 87.5 to 108 MHz band, with high-stability digital PLL, aimed at community, local, regional and high-power stations.",
    },
    scope: [
      { es: "50 W · 150 W · 350 W · 600 W · 1 kW", en: "50 W · 150 W · 350 W · 600 W · 1 kW" },
      { es: "87.5 – 108 MHz", en: "87.5 – 108 MHz" },
      { es: "PLL digital", en: "Digital PLL" },
      { es: "Salida 50 Ω RF", en: "50 Ω RF output" },
    ],
    productSlugs: ["serie-fm"],
    image: img.capBroadcast.sm,
    alt: {
      es: "Sala de transmisión con racks de equipos de radiodifusión",
      en: "Transmission hall with broadcast equipment racks",
    },
  },
  {
    id: "stl",
    slug: "stl-enlaces",
    index: { es: "03", en: "03" },
    name: { es: "STL / Enlaces", en: "STL / Links" },
    kicker: { es: "Estudio–planta · VHF / UHF", en: "Studio–transmitter · VHF / UHF" },
    description: {
      es: "Enlaces estudio–planta para radiodifusión AM y FM, con encendido remoto del transmisor, operación Mono/MPX y antenas Yagi de alto rendimiento para operación continua en ambientes exigentes.",
      en: "Studio–transmitter links for AM and FM broadcasting, with remote transmitter start, Mono/MPX operation and high-performance Yagi antennas for continuous operation in demanding environments.",
    },
    scope: [
      { es: "STAL-200 · AL-100", en: "STAL-200 · AL-100" },
      { es: "Hasta 10 W", en: "Up to 10 W" },
      { es: "Yagi 134 – 174 MHz", en: "Yagi 134 – 174 MHz" },
      { es: "3 a 7 elementos", en: "3 to 7 elements" },
    ],
    productSlugs: ["stl-stal-200", "stl-al-100", "yagi-134-174"],
    image: img.projStl.sm,
    alt: {
      es: "Antena Yagi de enlace estudio–planta sobre azotea con vista a Santiago",
      en: "Studio–transmitter Yagi link antenna on a rooftop overlooking Santiago",
    },
  },
  {
    id: "audio",
    slug: "procesamiento-de-audio",
    index: { es: "04", en: "04" },
    name: { es: "Procesamiento de Audio", en: "Audio Processing" },
    kicker: { es: "Control de programa · AM", en: "Program control · AM" },
    description: {
      es: "Procesamiento de la señal de programa para radiodifusión AM: control automático de ganancia, control de peak y pre-énfasis adaptable basados en modulación por ancho de pulso, con filtrado activo y protección de canales adyacentes.",
      en: "Program signal processing for AM broadcasting: automatic gain control, peak control and adaptive pre-emphasis based on pulse-width modulation, with active filtering and adjacent-channel protection.",
    },
    scope: [
      { es: "BIS-AP735", en: "BIS-AP735" },
      { es: "19\" × 1U", en: "19\" × 1U" },
      { es: "Entrada balanceada ±15 dBu", en: "Balanced input ±15 dBu" },
      { es: "Salida 600 Ω", en: "600 Ω output" },
    ],
    productSlugs: ["bis-ap735"],
    image: img.capTransmission.sm,
    alt: {
      es: "Base aislada de torre AM con línea de alimentación y unidad de sintonía",
      en: "Insulated AM tower base with feed line and tuning unit",
    },
  },
  {
    id: "automatizacion",
    slug: "automatizacion",
    index: { es: "05", en: "05" },
    name: { es: "Automatización", en: "Automation" },
    kicker: { es: "Software propio · Control remoto", en: "In-house software · Remote control" },
    description: {
      es: "Plataforma de software desarrollada por Sender para programar, administrar y supervisar transmisiones desde una interfaz centralizada, con módulos de monitoreo remoto, alarmas en tiempo real y protecciones integradas de fábrica.",
      en: "Software platform developed by Sender to schedule, manage and supervise transmissions from a centralized interface, with remote monitoring modules, real-time alarms and factory-integrated protections.",
    },
    scope: [
      { es: "Software de automatización propio", en: "In-house automation software" },
      { es: "Monitoreo y control remoto", en: "Remote monitoring & control" },
      { es: "Alarmas en tiempo real", en: "Real-time alarms" },
      { es: "Encendido remoto de transmisor", en: "Remote transmitter start" },
    ],
    productSlugs: ["automatizacion-navtex", "monitoreo-control-remoto"],
    image: img.capCritical.sm,
    alt: {
      es: "Estación costera de radio con mástil monopolo entre la niebla marina",
      en: "Coastal radio station with monopole mast in sea fog",
    },
  },
  {
    id: "rf",
    slug: "rf-y-componentes",
    index: { es: "06", en: "06" },
    name: { es: "RF y Componentes", en: "RF & Components" },
    kicker: { es: "Antenas · Líneas · Potencia", en: "Antennas · Lines · Power" },
    description: {
      es: "Ingeniería y fabricación de sistemas radiantes y componentes de RF: antenas monopolo AM, antenas HF profesionales, torres contraventadas galvanizadas, cable coaxial de baja pérdida, condensadores de alta potencia y circuitos integrados para aplicaciones RF.",
      en: "Engineering and manufacturing of radiating systems and RF components: AM monopole antennas, professional HF antennas, galvanized guyed towers, low-loss coaxial cable, high-power capacitors and integrated circuits for RF applications.",
    },
    scope: [
      { es: "Monopolo AM 510 – 1700 kHz", en: "AM monopole 510 – 1700 kHz" },
      { es: "HF 2 – 30 MHz · 1 kW", en: "HF 2 – 30 MHz · 1 kW" },
      { es: "Heliax® 1/2\" Super Flex · LMR-400", en: "Heliax® 1/2\" Super Flex · LMR-400" },
      { es: "Condensadores 100 pF – 6000 pF", en: "Capacitors 100 pF – 6000 pF" },
    ],
    productSlugs: [
      "antena-hf-2-30",
      "antenas-monopolo-am",
      "torres-contraventadas",
      "cable-coaxial",
      "condensadores-alta-potencia",
      "circuitos-integrados-rf",
    ],
    image: img.capRf.sm,
    alt: {
      es: "Módulo amplificador RF de estado sólido con transistores y bobinas de cobre",
      en: "Solid-state RF amplifier module with transistors and copper coils",
    },
  },
  {
    id: "especiales",
    slug: "soluciones-especiales",
    index: { es: "07", en: "07" },
    name: { es: "Soluciones Especiales", en: "Special Solutions" },
    kicker: { es: "NAVTEX · Defensa · Misión crítica", en: "NAVTEX · Defense · Mission critical" },
    description: {
      es: "Sistemas de transmisión para seguridad marítima y comunicaciones críticas, incluido el sistema NAVTEX 490/518 kHz con unidad de potencia y control, software de automatización propio, monitoreo remoto y sistema radiante dedicado.",
      en: "Transmission systems for maritime safety and critical communications, including the NAVTEX 490/518 kHz system with power and control unit, in-house automation software, remote monitoring and a dedicated radiating system.",
    },
    scope: [
      { es: "NAVTEX 490 / 518 kHz", en: "NAVTEX 490 / 518 kHz" },
      { es: "Seguridad marítima", en: "Maritime safety" },
      { es: "Estaciones costeras", en: "Coastal stations" },
      { es: "Proyectos de defensa", en: "Defense projects" },
    ],
    productSlugs: ["sistema-navtex-490-518"],
    image: img.capAntennas.sm,
    alt: {
      es: "Torre de telecomunicaciones con arreglo de antenas FM y Yagi VHF",
      en: "Telecommunications tower with FM array and VHF Yagi antennas",
    },
  },
];

/* ==================================================================
   PRODUCTOS
   ================================================================== */

export const products: Product[] = [
  /* ---------------------------- 01 AM ---------------------------- */
  {
    slug: "serie-sender-ss",
    categoryId: "am",
    index: { es: "01", en: "01" },
    name: { es: "Transmisores AM Serie SENDER SS", en: "SENDER SS Series AM Transmitters" },
    summary: {
      es: "Serie de transmisores AM de estado sólido diseñada y fabricada para radiodifusión profesional en banda media. Todos los equipos utilizan arquitectura modular de alta eficiencia, con amplificación en Clase D y modulación por ancho de pulso (PWM), garantizando estabilidad, alta eficiencia energética y operación continua 24/7.",
      en: "Solid-state AM transmitter series designed and manufactured for professional medium-wave broadcasting. All units use a high-efficiency modular architecture with Class D amplification and pulse-width modulation (PWM), ensuring stability, high energy efficiency and continuous 24/7 operation.",
    },
    specs: [
      {
        title: { es: "Especificaciones", en: "Specifications" },
        rows: [
          { k: { es: "Arquitectura", en: "Architecture" }, v: { es: "Estado sólido modular", en: "Modular solid state" } },
          { k: { es: "Amplificación", en: "Amplification" }, v: { es: "Clase D", en: "Class D" } },
          { k: { es: "Modulación", en: "Modulation" }, v: { es: "PWM (ancho de pulso)", en: "PWM (pulse width)" } },
          { k: { es: "Rango de frecuencia", en: "Frequency range" }, v: { es: "490 kHz – 1700 kHz", en: "490 kHz – 1700 kHz" } },
          { k: { es: "Impedancia de salida", en: "Output impedance" }, v: { es: "50 Ω", en: "50 Ω" } },
          { k: { es: "Estabilidad de frecuencia", en: "Frequency stability" }, v: { es: "±5 Hz", en: "±5 Hz" } },
          { k: { es: "Operación", en: "Operation" }, v: { es: "Continua 24/7", en: "Continuous 24/7" } },
        ],
      },
    ],
    features: [
      { es: "Arquitectura modular de alta eficiencia", en: "High-efficiency modular architecture" },
      { es: "Amplificación Clase D con modulación PWM", en: "Class D amplification with PWM modulation" },
      { es: "Excelente estabilidad de frecuencia y alta eficiencia de modulación", en: "Excellent frequency stability and high modulation efficiency" },
      { es: "Operación en toda la banda de radiodifusión AM", en: "Operation across the full AM broadcast band" },
      { es: "Sintetizador digital de frecuencia en el modelo de 10.000 W", en: "Digital frequency synthesizer on the 10,000 W model" },
    ],
    applications: [
      { es: "Radiodifusión profesional en banda media (AM)", en: "Professional medium-wave (AM) broadcasting" },
      { es: "Estaciones de baja, media y alta potencia", en: "Low, medium and high-power stations" },
      { es: "Integración de sistemas de transmisión", en: "Transmission system integration" },
    ],
    variants: [
      {
        model: { es: "AM-1000SS", en: "AM-1000SS" },
        power: { es: "1000 W", en: "1000 W" },
        detail: {
          es: "Potencia nominal 1000 W. 490 kHz – 1700 kHz · 50 Ω · estabilidad ±5 Hz · estado sólido modular.",
          en: "Nominal power 1000 W. 490 kHz – 1700 kHz · 50 Ω · ±5 Hz stability · modular solid state.",
        },
      },
      {
        model: { es: "AM-2500SS", en: "AM-2500SS" },
        power: { es: "2000 W", en: "2000 W" },
        detail: {
          es: "Potencia nominal 2000 W. Alimentación monofásica 220 V 50/60 Hz; otras configuraciones disponibles bajo requerimiento.",
          en: "Nominal power 2000 W. Single-phase 220 V 50/60 Hz supply; other configurations available on request.",
        },
      },
      {
        model: { es: "AM-5000SS", en: "AM-5000SS" },
        power: { es: "5000 W", en: "5000 W" },
        detail: {
          es: "Potencia nominal 5000 W. Alimentación trifásica 220 V / 380 V 50/60 Hz · 50 Ω · alta capacidad de modulación.",
          en: "Nominal power 5000 W. Three-phase 220 V / 380 V 50/60 Hz supply · 50 Ω · high modulation capacity.",
        },
      },
      {
        model: { es: "AM-10000SS", en: "AM-10000SS" },
        power: { es: "10.000 W", en: "10,000 W" },
        detail: {
          es: "Potencia nominal 10.000 W. 490 kHz – 1700 kHz · ±5 Hz · sintetizador digital de frecuencia para estabilidad superior.",
          en: "Nominal power 10,000 W. 490 kHz – 1700 kHz · ±5 Hz · digital frequency synthesizer for superior stability.",
        },
      },
    ],
    image: img.projAm.sm,
    alt: {
      es: "Gabinete de transmisor AM de estado sólido Serie SENDER SS",
      en: "SENDER SS series solid-state AM transmitter cabinet",
    },
    sourceUrl: "https://www.sender.cl/transmisor-en-estado-solido-de-2000w/",
  },
  {
    slug: "amplificador-mf-1000w",
    categoryId: "am",
    index: { es: "02", en: "02" },
    name: { es: "Amplificador MF 1000 W", en: "MF Amplifier 1000 W" },
    summary: {
      es: "Solución profesional para aplicaciones de radiodifusión en AM, sistemas NAVTEX y comunicaciones marítimas. Su arquitectura Clase D de alta eficiencia permite una operación confiable, estable y continua, optimizando el consumo energético sin comprometer el rendimiento.",
      en: "Professional solution for AM broadcasting applications, NAVTEX systems and maritime communications. Its high-efficiency Class D architecture enables reliable, stable and continuous operation, optimizing energy consumption without compromising performance.",
    },
    specs: [
      {
        title: { es: "Especificaciones técnicas", en: "Technical specifications" },
        rows: [
          { k: { es: "Potencia máxima", en: "Maximum power" }, v: { es: "1000 W", en: "1000 W" } },
          { k: { es: "Tecnología", en: "Technology" }, v: { es: "Amplificador Clase D", en: "Class D amplifier" } },
          { k: { es: "Frecuencia de operación", en: "Operating frequency" }, v: { es: "490 kHz – 1700 kHz", en: "490 kHz – 1700 kHz" } },
          { k: { es: "Tensión nominal", en: "Nominal voltage" }, v: { es: "300 VDC", en: "300 VDC" } },
          { k: { es: "Peso", en: "Weight" }, v: { es: "2.9 kg", en: "2.9 kg" } },
          { k: { es: "Protecciones", en: "Protections" }, v: { es: "Electrónicas internas", en: "Internal electronic" } },
        ],
      },
    ],
    features: [
      { es: "Potencia de salida hasta 1000 W", en: "Output power up to 1000 W" },
      { es: "Amplificación Clase D de alta eficiencia", en: "High-efficiency Class D amplification" },
      { es: "Protecciones electrónicas internas para operación segura", en: "Internal electronic protections for safe operation" },
      { es: "Diseño compacto y robusto para uso profesional", en: "Compact and robust design for professional use" },
      { es: "Operación continua 24/7 para estaciones críticas", en: "Continuous 24/7 operation for critical stations" },
    ],
    applications: [
      { es: "Radiodifusión AM profesional", en: "Professional AM broadcasting" },
      { es: "Sistemas NAVTEX marítimos", en: "Maritime NAVTEX systems" },
      { es: "Comunicaciones en banda MF", en: "MF band communications" },
      { es: "Estaciones costeras y marítimas", en: "Coastal and maritime stations" },
      { es: "Proyectos especiales de telecomunicaciones", en: "Special telecommunications projects" },
    ],
    image: img.capRf.sm,
    alt: {
      es: "Módulo amplificador RF de estado sólido con transistores y bobinas de cobre",
      en: "Solid-state RF amplifier module with transistors and copper coils",
    },
    sourceUrl: "https://www.sender.cl/amplificador-1000w/",
  },

  /* ---------------------------- 02 FM ---------------------------- */
  {
    slug: "serie-fm",
    categoryId: "fm",
    index: { es: "01", en: "01" },
    name: { es: "Transmisores FM de Estado Sólido", en: "Solid-State FM Transmitters" },
    summary: {
      es: "Serie de transmisores FM SENDER diseñada para radiodifusión profesional en la banda de 87.5 a 108 MHz, con tecnología de estado sólido, alta eficiencia y operación continua para estaciones comunitarias, regionales y de alta potencia.",
      en: "SENDER FM transmitter series designed for professional broadcasting in the 87.5 to 108 MHz band, with solid-state technology, high efficiency and continuous operation for community, regional and high-power stations.",
    },
    specs: [
      {
        title: { es: "Especificaciones", en: "Specifications" },
        rows: [
          { k: { es: "Banda", en: "Band" }, v: { es: "87.5 – 108 MHz", en: "87.5 – 108 MHz" } },
          { k: { es: "Tecnología", en: "Technology" }, v: { es: "Estado sólido", en: "Solid state" } },
          { k: { es: "Síntesis", en: "Synthesis" }, v: { es: "PLL digital de alta estabilidad", en: "High-stability digital PLL" } },
          { k: { es: "Salida RF", en: "RF output" }, v: { es: "50 Ω", en: "50 Ω" } },
          { k: { es: "Potencias disponibles", en: "Available powers" }, v: { es: "50 W · 150 W · 350 W · 600 W · 1 kW", en: "50 W · 150 W · 350 W · 600 W · 1 kW" } },
        ],
      },
    ],
    features: [
      { es: "PLL digital de alta estabilidad", en: "High-stability digital PLL" },
      { es: "Arquitectura de estado sólido eficiente", en: "Efficient solid-state architecture" },
      { es: "Ventilación forzada de alta eficiencia en el modelo de 350 W", en: "High-efficiency forced ventilation on the 350 W model" },
      { es: "Arquitectura modular en el modelo de 1 kW", en: "Modular architecture on the 1 kW model" },
      { es: "Potencia ajustable de 0 a 50 W en el modelo comunitario", en: "Adjustable 0 to 50 W power on the community model" },
    ],
    applications: [
      { es: "Radiodifusión FM comunitaria", en: "Community FM broadcasting" },
      { es: "Estaciones locales y repetidoras", en: "Local stations and repeaters" },
      { es: "Cobertura media profesional", en: "Professional medium coverage" },
      { es: "Estaciones regionales y cobertura amplia", en: "Regional and wide-area stations" },
    ],
    variants: [
      {
        model: { es: "FM 50 W", en: "FM 50 W" },
        power: { es: "0 – 50 W", en: "0 – 50 W" },
        detail: {
          es: "Potencia ajustable 0 – 50 W · PLL digital de alta estabilidad · radiodifusión FM comunitaria.",
          en: "Adjustable 0 – 50 W · high-stability digital PLL · community FM broadcasting.",
        },
      },
      {
        model: { es: "FM 150 W", en: "FM 150 W" },
        power: { es: "150 W", en: "150 W" },
        detail: {
          es: "150 W · estaciones locales y repetidoras · arquitectura de estado sólido eficiente.",
          en: "150 W · local stations and repeaters · efficient solid-state architecture.",
        },
      },
      {
        model: { es: "FM 350 W", en: "FM 350 W" },
        power: { es: "350 W", en: "350 W" },
        detail: {
          es: "350 W · cobertura media profesional · ventilación forzada de alta eficiencia.",
          en: "350 W · professional medium coverage · high-efficiency forced ventilation.",
        },
      },
      {
        model: { es: "FM 600 W", en: "FM 600 W" },
        power: { es: "600 W", en: "600 W" },
        detail: { es: "600 W · estaciones regionales · salida 50 Ω RF.", en: "600 W · regional stations · 50 Ω RF output." },
      },
      {
        model: { es: "FM 1 kW", en: "FM 1 kW" },
        power: { es: "1 kW", en: "1 kW" },
        detail: {
          es: "1 kW · arquitectura modular de estado sólido · cobertura amplia regional.",
          en: "1 kW · modular solid-state architecture · wide regional coverage.",
        },
      },
    ],
    image: img.capBroadcast.sm,
    alt: {
      es: "Sala de transmisión con racks de transmisores de radiodifusión",
      en: "Transmission hall with broadcast equipment racks",
    },
    sourceUrl: "https://www.sender.cl/transmisores-fm/",
  },

  /* --------------------------- 03 STL ---------------------------- */
  {
    slug: "stl-stal-200",
    categoryId: "stl",
    index: { es: "01", en: "01" },
    name: { es: "Enlace Estudio–Planta STAL-200", en: "Studio–Transmitter Link STAL-200" },
    summary: {
      es: "Enlace estudio–planta diseñado para aplicaciones profesionales de radiodifusión, permitiendo una transmisión confiable y de alta calidad entre el estudio y la planta transmisora, con programación de frecuencia y memorias desde el panel frontal.",
      en: "Studio–transmitter link designed for professional broadcasting applications, enabling reliable, high-quality transmission between the studio and the transmitter site, with frequency and memory programming from the front panel.",
    },
    specs: [
      {
        title: { es: "Características principales", en: "Main features" },
        rows: [
          { k: { es: "Potencia de salida", en: "Output power" }, v: { es: "Hasta 10 W", en: "Up to 10 W" } },
          { k: { es: "Operación", en: "Operation" }, v: { es: "Mono / MPX", en: "Mono / MPX" } },
          { k: { es: "Frecuencia", en: "Frequency" }, v: { es: "Programable desde panel frontal", en: "Programmable from front panel" } },
          { k: { es: "Display", en: "Display" }, v: { es: "Español e inglés", en: "Spanish and English" } },
          { k: { es: "Seguridad", en: "Security" }, v: { es: "Protección por clave de acceso", en: "Access key protection" } },
        ],
      },
    ],
    features: [
      { es: "Encendido remoto del transmisor", en: "Remote transmitter start" },
      { es: "Programación de frecuencia y memorias desde panel frontal", en: "Frequency and memory programming from the front panel" },
      { es: "Operación Mono / MPX", en: "Mono / MPX operation" },
      { es: "Preénfasis configurable", en: "Configurable pre-emphasis" },
      { es: "Potencia de salida hasta 10 W", en: "Output power up to 10 W" },
      { es: "Ajuste de nivel de modulación", en: "Modulation level adjustment" },
      { es: "Display en español e inglés", en: "Spanish and English display" },
      { es: "Protección mediante clave de acceso", en: "Access key protection" },
    ],
    applications: [
      { es: "Enlace estudio–planta para radio AM y FM", en: "Studio–transmitter link for AM and FM radio" },
      { es: "Radiodifusión profesional", en: "Professional broadcasting" },
    ],
    image: img.projStl.sm,
    alt: {
      es: "Antena Yagi de enlace sobre azotea con vista a Santiago",
      en: "Yagi link antenna on a rooftop overlooking Santiago",
    },
    sourceUrl: "https://www.sender.cl/enlace-estudio-planta-al-1000-transmisor-y-receptor/",
  },
  {
    slug: "stl-al-100",
    categoryId: "stl",
    index: { es: "02", en: "02" },
    name: { es: "Enlace Estudio–Planta AL-100", en: "Studio–Transmitter Link AL-100" },
    summary: {
      es: "Enlace estudio–planta con selección de frecuencia mediante DIP switch, diseño robusto para operación continua e indicación de modulación mediante LEDs.",
      en: "Studio–transmitter link with DIP-switch frequency selection, rugged design for continuous operation and LED modulation indication.",
    },
    specs: [
      {
        title: { es: "Características principales", en: "Main features" },
        rows: [
          { k: { es: "Potencia de salida", en: "Output power" }, v: { es: "Hasta 10 W", en: "Up to 10 W" } },
          { k: { es: "Operación", en: "Operation" }, v: { es: "Mono / MPX", en: "Mono / MPX" } },
          { k: { es: "Selección de frecuencia", en: "Frequency selection" }, v: { es: "DIP switch", en: "DIP switch" } },
          { k: { es: "Indicación", en: "Indication" }, v: { es: "Modulación mediante LEDs", en: "Modulation via LEDs" } },
        ],
      },
    ],
    features: [
      { es: "Encendido remoto del transmisor", en: "Remote transmitter start" },
      { es: "Selección de frecuencia mediante DIP switch", en: "DIP-switch frequency selection" },
      { es: "Operación Mono / MPX", en: "Mono / MPX operation" },
      { es: "Preénfasis configurable", en: "Configurable pre-emphasis" },
      { es: "Potencia de salida hasta 10 W", en: "Output power up to 10 W" },
      { es: "Indicación de modulación mediante LEDs", en: "LED modulation indication" },
      { es: "Diseño robusto para operación continua", en: "Rugged design for continuous operation" },
    ],
    applications: [
      { es: "Enlace estudio–planta para radio AM y FM", en: "Studio–transmitter link for AM and FM radio" },
      { es: "Operación continua en ambientes exigentes", en: "Continuous operation in demanding environments" },
    ],
    image: img.projStl.sm,
    alt: {
      es: "Antena Yagi de enlace estudio–planta instalada en azotea",
      en: "Studio–transmitter Yagi link antenna installed on a rooftop",
    },
    sourceUrl: "https://www.sender.cl/enlace-estudio-planta-al-1000-transmisor-y-receptor/",
  },
  {
    slug: "yagi-134-174",
    categoryId: "stl",
    index: { es: "03", en: "03" },
    name: { es: "Antenas Yagi 134 – 174 MHz", en: "Yagi Antennas 134 – 174 MHz" },
    summary: {
      es: "Antenas Yagi de alto rendimiento para sistemas de enlace estudio–planta, fabricadas en aluminio de alta resistencia y diseñadas para operación continua en ambientes exigentes.",
      en: "High-performance Yagi antennas for studio–transmitter link systems, manufactured in high-strength aluminium and designed for continuous operation in demanding environments.",
    },
    specs: [
      {
        title: { es: "Construcción", en: "Construction" },
        rows: [
          { k: { es: "Rango", en: "Range" }, v: { es: "134 – 174 MHz", en: "134 – 174 MHz" } },
          { k: { es: "Configuraciones", en: "Configurations" }, v: { es: "3 a 7 elementos", en: "3 to 7 elements" } },
          { k: { es: "Material", en: "Material" }, v: { es: "Aluminio 6162", en: "6162 aluminium" } },
          { k: { es: "Boom", en: "Boom" }, v: { es: "25 × 25 × 1.5 mm", en: "25 × 25 × 1.5 mm" } },
          { k: { es: "Elementos", en: "Elements" }, v: { es: "12.7 mm", en: "12.7 mm" } },
          { k: { es: "Soportes", en: "Brackets" }, v: { es: "Aluminio fundido", en: "Cast aluminium" } },
          { k: { es: "Herrajes", en: "Hardware" }, v: { es: "Galvanizados de alta resistencia", en: "High-strength galvanized" } },
        ],
      },
    ],
    features: [
      { es: "Configuraciones de 3 a 7 elementos", en: "3 to 7 element configurations" },
      { es: "Construcción en aluminio 6162", en: "6162 aluminium construction" },
      { es: "Soportes de aluminio fundido", en: "Cast aluminium brackets" },
      { es: "Herrajes galvanizados de alta resistencia", en: "High-strength galvanized hardware" },
      { es: "Ajuste mecánico según frecuencia de trabajo", en: "Mechanical tuning to the working frequency" },
      { es: "Adaptador gamma ajustable", en: "Adjustable gamma match" },
    ],
    applications: [
      { es: "Enlaces estudio–planta VHF", en: "VHF studio–transmitter links" },
      { es: "Sistemas de enlace UHF", en: "UHF link systems" },
      { es: "Operación continua en exteriores", en: "Continuous outdoor operation" },
    ],
    image: img.capAntennas.sm,
    alt: {
      es: "Torre de telecomunicaciones con arreglo de antenas FM y Yagi VHF",
      en: "Telecommunications tower with FM array and VHF Yagi antennas",
    },
    sourceUrl: "https://www.sender.cl/enlace-estudio-planta-al-1000-transmisor-y-receptor/",
  },

  /* -------------------------- 04 Audio --------------------------- */
  {
    slug: "bis-ap735",
    categoryId: "audio",
    index: { es: "01", en: "01" },
    name: { es: "Procesador de Audio para AM BIS-AP735", en: "BIS-AP735 AM Audio Processor" },
    summary: {
      es: "Procesador de audio para radiodifusión AM construido como un solo gabinete de 19 pulgadas por una unidad de rack. Utiliza modulación por ancho de pulso en los controles de peak y en el pre-énfasis adaptable, logrando un control cuasi-digital de la señal de programa.",
      en: "Audio processor for AM broadcasting built as a single 19-inch, one rack-unit enclosure. It uses pulse-width modulation in the peak controls and in the adaptive pre-emphasis, achieving quasi-digital control of the program signal.",
    },
    specs: [
      {
        title: { es: "Especificaciones técnicas", en: "Technical specifications" },
        rows: [
          { k: { es: "Formato", en: "Form factor" }, v: { es: "19\" × 1U, gabinete único", en: "19\" × 1U, single enclosure" } },
          { k: { es: "Entrada", en: "Input" }, v: { es: "Balanceada, –15 dBu a +15 dBu", en: "Balanced, –15 dBu to +15 dBu" } },
          { k: { es: "Control de ganancia", en: "Gain control" }, v: { es: "AGC automático de entrada", en: "Automatic input AGC" } },
          { k: { es: "Modulación", en: "Modulation" }, v: { es: "PWM en peak y pre-énfasis", en: "PWM on peak and pre-emphasis" } },
          { k: { es: "Filtrado", en: "Filtering" }, v: { es: "Pasa bajo activo de 4 pasos", en: "4-step active low-pass" } },
          { k: { es: "Salida", en: "Output" }, v: { es: "Balanceada 600 Ω", en: "Balanced 600 Ω" } },
          { k: { es: "Filtros RF", en: "RF filters" }, v: { es: "En líneas de entrada y salida", en: "On input and output lines" } },
        ],
      },
    ],
    features: [
      { es: "Control automático de ganancia (AGC) de la señal de entrada", en: "Automatic gain control (AGC) on the input signal" },
      { es: "Modulación PWM en los controles de peak y en el pre-énfasis adaptable", en: "PWM modulation in the peak controls and adaptive pre-emphasis" },
      { es: "Conjunto de etapas de control de peak superior a limitadores convencionales, manteniendo la asimetría y ventajas de la modulación AM", en: "Peak control stages well beyond conventional limiters, preserving the asymmetry and advantages of AM modulation" },
      { es: "Pre-énfasis adaptable que realza, da brillo y claridad a la señal", en: "Adaptive pre-emphasis that enhances brightness and clarity" },
      { es: "Filtro activo pasa bajo de 4 pasos: protege canales adyacentes y elimina chasquidos de limitadores de picos externos", en: "4-step active low-pass filter: protects adjacent channels and removes clicks from external peak limiters" },
      { es: "Indicación y controles digitales en panel frontal", en: "Digital indication and controls on the front panel" },
      { es: "Filtros de radiofrecuencia en líneas de entrada y salida", en: "RF filters on input and output lines" },
    ],
    applications: [
      { es: "Radiodifusión AM profesional", en: "Professional AM broadcasting" },
      { es: "Control de programa y protección de canales adyacentes", en: "Program control and adjacent-channel protection" },
    ],
    image: img.capTransmission.sm,
    alt: {
      es: "Base aislada de torre AM con línea de alimentación y unidad de sintonía",
      en: "Insulated AM tower base with feed line and tuning unit",
    },
    sourceUrl: "https://www.sender.cl/procesador-de-audio-am-bis-ap735/",
  },

  /* --------------------- 05 Automatización ----------------------- */
  {
    slug: "automatizacion-navtex",
    categoryId: "automatizacion",
    index: { es: "01", en: "01" },
    name: { es: "Software de Automatización NAVTEX", en: "NAVTEX Automation Software" },
    summary: {
      es: "Plataforma de software desarrollada por Sender que permite programar, administrar y supervisar las transmisiones NAVTEX desde una interfaz centralizada, facilitando la operación diaria y mejorando la eficiencia operacional del sistema.",
      en: "Software platform developed by Sender that allows scheduling, managing and supervising NAVTEX transmissions from a centralized interface, easing daily operation and improving the system's operational efficiency.",
    },
    specs: [
      {
        title: { es: "Componentes del sistema", en: "System components" },
        rows: [
          { k: { es: "Desarrollo", en: "Development" }, v: { es: "Software propio de Sender", en: "Sender in-house software" } },
          { k: { es: "Interfaz", en: "Interface" }, v: { es: "Centralizada", en: "Centralized" } },
          { k: { es: "Funciones", en: "Functions" }, v: { es: "Programar · Administrar · Supervisar", en: "Schedule · Manage · Supervise" } },
          { k: { es: "Núcleo de comunicación", en: "Communication core" }, v: { es: "Unidad de potencia y control", en: "Power and control unit" } },
        ],
      },
    ],
    features: [
      { es: "Programación de transmisiones desde interfaz centralizada", en: "Transmission scheduling from a centralized interface" },
      { es: "Administración y supervisión de estados operacionales", en: "Management and supervision of operational states" },
      { es: "Distribución segura de la información marítima", en: "Secure distribution of maritime information" },
      { es: "Integración con los transmisores NAVTEX Sender", en: "Integration with Sender NAVTEX transmitters" },
      { es: "Mejora de la eficiencia operacional del servicio", en: "Improved operational efficiency of the service" },
    ],
    applications: [
      { es: "Seguridad marítima y avisos a la navegación", en: "Maritime safety and navigational warnings" },
      { es: "Estaciones costeras", en: "Coastal stations" },
      { es: "Operación diaria de sistemas NAVTEX", en: "Daily NAVTEX system operation" },
    ],
    image: img.capCritical.sm,
    alt: {
      es: "Estación costera de radio con mástil monopolo entre la niebla marina",
      en: "Coastal radio station with monopole mast in sea fog",
    },
    sourceUrl: "https://www.sender.cl/sistema-navtex-490-518-khz/",
  },
  {
    slug: "monitoreo-control-remoto",
    categoryId: "automatizacion",
    index: { es: "02", en: "02" },
    name: { es: "Módulo de Monitoreo y Control Remoto", en: "Remote Monitoring & Control Module" },
    summary: {
      es: "Módulos de monitoreo remoto que permiten supervisar parámetros críticos de operación y recibir alarmas en tiempo real, facilitando el mantenimiento preventivo y la continuidad operacional del servicio.",
      en: "Remote monitoring modules that allow supervising critical operating parameters and receiving real-time alarms, enabling preventive maintenance and operational continuity of the service.",
    },
    specs: [
      {
        title: { es: "Parámetros supervisados", en: "Supervised parameters" },
        rows: [
          { k: { es: "Alimentación", en: "Supply" }, v: { es: "Monitoreo de tensión", en: "Voltage monitoring" } },
          { k: { es: "Transmisión", en: "Transmission" }, v: { es: "Monitoreo de potencia", en: "Power monitoring" } },
          { k: { es: "Térmico", en: "Thermal" }, v: { es: "Temperatura interna", en: "Internal temperature" } },
          { k: { es: "Alarmas", en: "Alarms" }, v: { es: "Automáticas del sistema", en: "Automatic system alarms" } },
          { k: { es: "Control", en: "Control" }, v: { es: "Remoto de operación", en: "Remote operation" } },
          { k: { es: "Protecciones", en: "Protections" }, v: { es: "Integradas de fábrica", en: "Factory integrated" } },
        ],
      },
    ],
    features: [
      { es: "Monitoreo de tensión de alimentación", en: "Supply voltage monitoring" },
      { es: "Monitoreo de potencia de transmisión", en: "Transmission power monitoring" },
      { es: "Supervisión de temperatura interna", en: "Internal temperature supervision" },
      { es: "Alarmas automáticas del sistema", en: "Automatic system alarms" },
      { es: "Control remoto de operación", en: "Remote operation control" },
      { es: "Protecciones integradas de fábrica", en: "Factory-integrated protections" },
    ],
    applications: [
      { es: "Continuidad operacional 24/7", en: "24/7 operational continuity" },
      { es: "Mantenimiento preventivo", en: "Preventive maintenance" },
      { es: "Estaciones no atendidas", en: "Unattended stations" },
    ],
    image: img.capCritical.sm,
    alt: {
      es: "Estación de transmisión en la costa con mástil y sistema radiante",
      en: "Coastal transmission station with mast and radiating system",
    },
    sourceUrl: "https://www.sender.cl/sistema-navtex-490-518-khz/",
  },

  /* --------------------- 06 RF y componentes --------------------- */
  {
    slug: "antena-hf-2-30",
    categoryId: "rf",
    index: { es: "01", en: "01" },
    name: { es: "Antena HF Profesional 2 – 30 MHz · 1 kW", en: "Professional HF Antenna 2 – 30 MHz · 1 kW" },
    summary: {
      es: "Desarrollada para aplicaciones de radiocomunicaciones de largo alcance en la banda de 2 a 30 MHz. Su diseño robusto y su construcción para servicio continuo permiten una operación confiable en entornos exigentes, con excelente desempeño en comunicaciones marítimas, estaciones costeras, organismos gubernamentales, sistemas de emergencia y redes HF de alta disponibilidad.",
      en: "Developed for long-range radiocommunication applications in the 2 to 30 MHz band. Its robust design and continuous-duty construction enable reliable operation in demanding environments, with excellent performance in maritime communications, coastal stations, government bodies, emergency systems and high-availability HF networks.",
    },
    specs: [
      {
        title: { es: "Características principales", en: "Main characteristics" },
        rows: [
          { k: { es: "Rango de frecuencia", en: "Frequency range" }, v: { es: "2 MHz – 30 MHz", en: "2 MHz – 30 MHz" } },
          { k: { es: "Potencia máxima", en: "Maximum power" }, v: { es: "1 kW", en: "1 kW" } },
          { k: { es: "Servicio", en: "Duty" }, v: { es: "Continuo 24/7", en: "Continuous 24/7" } },
          { k: { es: "Construcción", en: "Construction" }, v: { es: "Resistente para exteriores", en: "Outdoor ruggedized" } },
          { k: { es: "Radiación", en: "Radiation" }, v: { es: "Bajas pérdidas, alta eficiencia", en: "Low loss, high efficiency" } },
        ],
      },
    ],
    features: [
      { es: "Funcionamiento estable en todo el espectro HF", en: "Stable operation across the entire HF spectrum" },
      { es: "Enlaces confiables a corta, media y larga distancia", en: "Reliable short, medium and long-distance links" },
      { es: "Construcción mecánica de alta resistencia para larga vida útil", en: "High-strength mechanical construction for long service life" },
      { es: "Resistente a ambientes costeros con alta salinidad, fuertes vientos y clima adverso", en: "Withstands coastal environments with high salinity, strong winds and adverse weather" },
      { es: "Configuración eléctrica optimizada: excelente adaptación de impedancia en amplio rango de frecuencias", en: "Optimized electrical configuration: excellent impedance matching over a wide frequency range" },
      { es: "Compatible con sistemas modernos de radiocomunicaciones HF", en: "Compatible with modern HF radiocommunication systems" },
    ],
    applications: [
      { es: "Comunicaciones marítimas", en: "Maritime communications" },
      { es: "Estaciones costeras", en: "Coastal stations" },
      { es: "Sistemas NAVTEX", en: "NAVTEX systems" },
      { es: "Redes HF gubernamentales", en: "Government HF networks" },
      { es: "Comunicaciones de emergencia", en: "Emergency communications" },
      { es: "Radiocomunicaciones profesionales", en: "Professional radiocommunications" },
      { es: "Centros de control y monitoreo", en: "Control and monitoring centers" },
    ],
    image: img.capAntennas.sm,
    alt: {
      es: "Torre de telecomunicaciones con arreglo de antenas",
      en: "Telecommunications tower with antenna array",
    },
    sourceUrl: "https://www.sender.cl/unidad-sintonia-de-antena-am-usa-xx-st/",
  },
  {
    slug: "antenas-monopolo-am",
    categoryId: "rf",
    index: { es: "02", en: "02" },
    name: { es: "Antenas Monopolo AM 510 – 1700 kHz", en: "AM Monopole Antennas 510 – 1700 kHz" },
    summary: {
      es: "Los sistemas de antena SENDER ofrecen alta eficiencia y un ancho de banda superior en comparación con antenas alimentadas en serie, además de incorporar protección contra descargas atmosféricas. Están diseñados para optimizar el rendimiento en sistemas de radiodifusión AM profesionales.",
      en: "SENDER antenna systems offer high efficiency and superior bandwidth compared to series-fed antennas, and incorporate protection against atmospheric discharges. They are designed to optimize performance in professional AM broadcasting systems.",
    },
    specs: [
      {
        title: { es: "Construcción y materiales", en: "Construction and materials" },
        rows: [
          { k: { es: "Rango", en: "Range" }, v: { es: "510 kHz – 1700 kHz", en: "510 kHz – 1700 kHz" } },
          { k: { es: "Materiales", en: "Materials" }, v: { es: "Fibra de vidrio · Acero galvanizado · Aluminio reforzado", en: "Fibreglass · Galvanized steel · Reinforced aluminium" } },
          { k: { es: "Torre", en: "Tower" }, v: { es: "Aterrizada (protección contra rayos)", en: "Grounded (lightning protection)" } },
          { k: { es: "Multifrecuencia", en: "Multi-frequency" }, v: { es: "Hasta 3 frecuencias AM en una torre", en: "Up to 3 AM frequencies on one tower" } },
        ],
      },
    ],
    features: [
      { es: "Mejora el ancho de banda y la eficiencia de transmisión", en: "Improves transmission bandwidth and efficiency" },
      { es: "Simplifica el uso del acoplador de antena ATU", en: "Simplifies the use of the ATU antenna coupler" },
      { es: "Mantiene o mejora el patrón de irradiación", en: "Maintains or improves the radiation pattern" },
      { es: "Reduce los requerimientos de altura en la torre", en: "Reduces tower height requirements" },
      { es: "Permite integración con sistemas de TV, FM y enlaces sin aisladores especiales", en: "Allows integration with TV, FM and link systems without special insulators" },
      { es: "Torre aterrizada que mejora la protección contra rayos", en: "Grounded tower improving lightning protection" },
      { es: "Posibilidad de operación con hasta tres frecuencias AM en una misma torre", en: "Operation with up to three AM frequencies on the same tower" },
    ],
    applications: [
      { es: "Radiodifusión AM profesional", en: "Professional AM broadcasting" },
      { es: "Implementaciones en terreno", en: "Field deployments" },
      { es: "Plantas transmisoras", en: "Transmitter plants" },
    ],
    image: img.capTransmission.sm,
    alt: {
      es: "Base aislada de torre AM con línea de alimentación y unidad de sintonía",
      en: "Insulated AM tower base with feed line and tuning unit",
    },
    sourceUrl: "https://www.sender.cl/monopolo-plegado/",
  },
  {
    slug: "torres-contraventadas",
    categoryId: "rf",
    index: { es: "03", en: "03" },
    name: { es: "Torres Contraventadas Galvanizadas", en: "Galvanized Guyed Towers" },
    summary: {
      es: "Estructuras de soporte estabilizadas mediante cables de acero (tirantes) anclados al terreno a través de ganchos tensores. Permiten alcanzar grandes alturas con menor consumo de material, resultando en una solución más eficiente y de menor costo que las torres autosoportadas.",
      en: "Support structures stabilized by steel cables (guy wires) anchored to the ground through turnbuckles. They reach great heights with less material, resulting in a more efficient and lower-cost solution than self-supporting towers.",
    },
    specs: [
      {
        title: { es: "Características constructivas", en: "Construction characteristics" },
        rows: [
          { k: { es: "Estructura", en: "Structure" }, v: { es: "Celosía triangular", en: "Triangular lattice" } },
          { k: { es: "Tirantes", en: "Guys" }, v: { es: "Tres direcciones", en: "Three directions" } },
          { k: { es: "Radio de anclaje", en: "Anchor radius" }, v: { es: "≈ 1/2 de la altura (mín. 40%)", en: "≈ 1/2 of height (min. 40%)" } },
          { k: { es: "Secciones", en: "Sections" }, v: { es: "3 a 6 m de largo × 35 cm de ancho", en: "3 to 6 m long × 35 cm wide" } },
          { k: { es: "Anclaje", en: "Anchoring" }, v: { es: "Ganchos tensores", en: "Turnbuckles" } },
        ],
      },
    ],
    features: [
      { es: "Menor costo estructural", en: "Lower structural cost" },
      { es: "Mayor altura alcanzable", en: "Greater achievable height" },
      { es: "Alta estabilidad con bajo peso", en: "High stability at low weight" },
      { es: "Excelente relación entre resistencia mecánica, peso y facilidad de montaje", en: "Excellent ratio of mechanical strength, weight and ease of assembly" },
      { es: "Ideal para sistemas de telecomunicaciones críticos", en: "Ideal for critical telecommunications systems" },
    ],
    applications: [
      { es: "Estaciones de radiocomunicaciones", en: "Radiocommunication stations" },
      { es: "Enlaces HF, VHF y UHF", en: "HF, VHF and UHF links" },
      { es: "Sistemas marítimos", en: "Maritime systems" },
    ],
    image: img.capAntennas.sm,
    alt: {
      es: "Torre galvanizada con sistema de antenas y tirantes",
      en: "Galvanized tower with antenna system and guy wires",
    },
    sourceUrl: "https://www.sender.cl/equipos-usados-4/",
  },
  {
    slug: "cable-coaxial",
    categoryId: "rf",
    index: { es: "04", en: "04" },
    name: { es: "Cable Coaxial Heliax® 1/2\" Super Flex y LMR-400", en: "Heliax® 1/2\" Super Flex and LMR-400 Coaxial Cable" },
    summary: {
      es: "Líneas de transmisión de bajo pérdida para radiodifusión, telecomunicaciones, sistemas de comunicación profesional, enlaces RF y estaciones transmisoras, diseñadas para garantizar máxima eficiencia y confiabilidad en instalaciones de AM, FM, HF, VHF y UHF.",
      en: "Low-loss transmission lines for broadcasting, telecommunications, professional communication systems, RF links and transmitter stations, designed to guarantee maximum efficiency and reliability in AM, FM, HF, VHF and UHF installations.",
    },
    specs: [
      {
        title: { es: "Heliax® 1/2\" Super Flex", en: "Heliax® 1/2\" Super Flex" },
        rows: [
          { k: { es: "Impedancia", en: "Impedance" }, v: { es: "50 Ω", en: "50 Ω" } },
          { k: { es: "Conductor exterior", en: "Outer conductor" }, v: { es: "Cobre corrugado en espiral", en: "Spiral corrugated copper" } },
          { k: { es: "Conductor central", en: "Center conductor" }, v: { es: "Aluminio revestido en cobre", en: "Copper-clad aluminium" } },
          { k: { es: "Radio mínimo de curvatura", en: "Minimum bend radius" }, v: { es: "≈ 1.25 pulgadas", en: "≈ 1.25 inches" } },
        ],
      },
      {
        title: { es: "LMR-400", en: "LMR-400" },
        rows: [
          { k: { es: "Impedancia", en: "Impedance" }, v: { es: "50 Ω", en: "50 Ω" } },
          { k: { es: "Aplicación", en: "Application" }, v: { es: "Telecomunicaciones profesionales", en: "Professional telecommunications" } },
          { k: { es: "Instalación", en: "Installation" }, v: { es: "Tendidos en espacios reducidos", en: "Runs in confined spaces" } },
        ],
      },
    ],
    features: [
      { es: "Alta flexibilidad para instalaciones complejas", en: "High flexibility for complex installations" },
      { es: "Baja pérdida de transmisión", en: "Low transmission loss" },
      { es: "Gran resistencia a deformaciones", en: "Great resistance to deformation" },
      { es: "Excelente comportamiento en aplicaciones RF", en: "Excellent behaviour in RF applications" },
      { es: "Ideal para transmisores FM, enlaces STL y sistemas VHF/UHF", en: "Ideal for FM transmitters, STL links and VHF/UHF systems" },
    ],
    applications: [
      { es: "Radiodifusión AM y FM", en: "AM and FM broadcasting" },
      { es: "Enlaces STL", en: "STL links" },
      { es: "Sistemas VHF / UHF", en: "VHF / UHF systems" },
      { es: "Estaciones transmisoras", en: "Transmitter stations" },
    ],
    image: img.capTransmission.sm,
    alt: {
      es: "Línea de alimentación coaxial en base de torre AM",
      en: "Coaxial feed line at an AM tower base",
    },
    sourceUrl: "https://www.sender.cl/cable-coaxial/",
  },
  {
    slug: "condensadores-alta-potencia",
    categoryId: "rf",
    index: { es: "05", en: "05" },
    name: { es: "Condensadores de Alta Potencia para RF", en: "High-Power RF Capacitors" },
    summary: {
      es: "Condensadores de alta potencia diseñados para aplicaciones de radiofrecuencia, transmisión AM y sistemas de telecomunicaciones. Fabricados para soportar altos niveles de tensión y operación continua en entornos industriales y de radiodifusión profesional.",
      en: "High-power capacitors designed for radio-frequency applications, AM transmission and telecommunications systems. Manufactured to withstand high voltage levels and continuous operation in industrial and professional broadcasting environments.",
    },
    specs: [
      {
        title: { es: "Capacidades disponibles", en: "Available capacitances" },
        rows: [
          { k: { es: "Estándar", en: "Standard" }, v: { es: "100 · 400 · 500 · 1000 · 2000 pF", en: "100 · 400 · 500 · 1000 · 2000 pF" } },
          { k: { es: "Tolerancia ±20%", en: "±20% tolerance" }, v: { es: "4000 pF · 6000 pF", en: "4000 pF · 6000 pF" } },
        ],
      },
    ],
    features: [
      { es: "Soportan altos niveles de tensión", en: "Withstand high voltage levels" },
      { es: "Operación continua en entornos industriales", en: "Continuous operation in industrial environments" },
      { es: "Capacidades estándar y con tolerancia ±20%", en: "Standard and ±20% tolerance capacitances" },
    ],
    applications: [
      { es: "Sistemas de transmisión AM", en: "AM transmission systems" },
      { es: "Equipos de radiofrecuencia (RF)", en: "Radio-frequency (RF) equipment" },
      { es: "Acopladores de antena (ATU)", en: "Antenna tuning units (ATU)" },
      { es: "Filtros de potencia RF", en: "RF power filters" },
      { es: "Equipos industriales de telecomunicaciones", en: "Industrial telecommunications equipment" },
    ],
    image: img.capRf.sm,
    alt: {
      es: "Módulo RF de estado sólido con condensadores y bobinas de cobre",
      en: "Solid-state RF module with capacitors and copper coils",
    },
    sourceUrl: "https://www.sender.cl/capacitores-y-bobinas/",
  },
  {
    slug: "circuitos-integrados-rf",
    categoryId: "rf",
    index: { es: "06", en: "06" },
    name: { es: "Módulos y Circuitos Integrados para RF", en: "RF Modules and Integrated Circuits" },
    summary: {
      es: "Amplia gama de circuitos integrados utilizados en aplicaciones electrónicas, sistemas de control, amplificación, adquisición de señales y telecomunicaciones, ampliamente empleados en desarrollo de equipos industriales, RF y sistemas de alta confiabilidad.",
      en: "Wide range of integrated circuits used in electronic applications, control systems, amplification, signal acquisition and telecommunications, widely employed in the development of industrial and RF equipment and high-reliability systems.",
    },
    specs: [
      {
        title: { es: "Principales circuitos integrados disponibles", en: "Main integrated circuits available" },
        rows: [
          { k: { es: "Drivers / puertas", en: "Drivers / gates" }, v: { es: "TC4420 · TC4424 · 74HC86 · SN75452", en: "TC4420 · TC4424 · 74HC86 · SN75452" } },
          { k: { es: "Operacionales", en: "Op-amps" }, v: { es: "TL081 · LM741 · AD790", en: "TL081 · LM741 · AD790" } },
          { k: { es: "Instrumentación", en: "Instrumentation" }, v: { es: "AD620 · AD734 · ADG431", en: "AD620 · AD734 · ADG431" } },
          { k: { es: "Conversión / temporización", en: "Conversion / timing" }, v: { es: "ICL7667 · NE555", en: "ICL7667 · NE555" } },
        ],
      },
    ],
    features: [
      { es: "Componentes para desarrollo de equipos industriales y RF", en: "Components for industrial and RF equipment development" },
      { es: "Selección orientada a sistemas de alta confiabilidad", en: "Selection aimed at high-reliability systems" },
      { es: "Disponibilidad de componentes y asesoría técnica", en: "Component availability and technical advice" },
    ],
    applications: [
      { es: "Diseño de sistemas electrónicos", en: "Electronic system design" },
      { es: "Amplificación y procesamiento de señales", en: "Signal amplification and processing" },
      { es: "Equipos de telecomunicaciones", en: "Telecommunications equipment" },
      { es: "Automatización industrial", en: "Industrial automation" },
      { es: "Instrumentación electrónica", en: "Electronic instrumentation" },
    ],
    image: img.capRf.sm,
    alt: {
      es: "Circuitos y módulos RF de estado sólido",
      en: "Solid-state RF circuits and modules",
    },
    sourceUrl: "https://www.sender.cl/circuitos-integrados/",
  },

  /* -------------------- 07 Soluciones especiales ------------------ */
  {
    slug: "sistema-navtex-490-518",
    categoryId: "especiales",
    index: { es: "01", en: "01" },
    name: { es: "Sistema NAVTEX Profesional 490 / 518 kHz", en: "Professional NAVTEX System 490 / 518 kHz" },
    summary: {
      es: "Sistema completo de transmisión NAVTEX compuesto por unidad de potencia y control, software de automatización desarrollado por Sender, módulo de monitoreo y control remoto, y sistema radiante con torre y antena diseñadas específicamente para las frecuencias internacionales de 490 kHz y 518 kHz.",
      en: "Complete NAVTEX transmission system made up of a power and control unit, automation software developed by Sender, a remote monitoring and control module, and a radiating system with a tower and antenna designed specifically for the international 490 kHz and 518 kHz frequencies.",
    },
    specs: [
      {
        title: { es: "Frecuencias de operación", en: "Operating frequencies" },
        rows: [
          { k: { es: "Internacional", en: "International" }, v: { es: "518 kHz", en: "518 kHz" } },
          { k: { es: "Nacional", en: "National" }, v: { es: "490 kHz", en: "490 kHz" } },
          { k: { es: "Banda", en: "Band" }, v: { es: "MF", en: "MF" } },
        ],
      },
      {
        title: { es: "Monitoreo remoto", en: "Remote monitoring" },
        rows: [
          { k: { es: "Alimentación", en: "Supply" }, v: { es: "Tensión monitoreada", en: "Voltage monitored" } },
          { k: { es: "Transmisión", en: "Transmission" }, v: { es: "Potencia monitoreada", en: "Power monitored" } },
          { k: { es: "Térmico", en: "Thermal" }, v: { es: "Temperatura interna", en: "Internal temperature" } },
          { k: { es: "Alarmas", en: "Alarms" }, v: { es: "Automáticas en tiempo real", en: "Automatic, real time" } },
          { k: { es: "Protecciones", en: "Protections" }, v: { es: "Integradas de fábrica", en: "Factory integrated" } },
        ],
      },
    ],
    features: [
      { es: "Unidad de potencia y control: núcleo de comunicación entre el software de automatización y los transmisores NAVTEX", en: "Power and control unit: the communication core between the automation software and the NAVTEX transmitters" },
      { es: "Software de automatización desarrollado por Sender con interfaz centralizada", en: "Automation software developed by Sender with a centralized interface" },
      { es: "Módulos de monitoreo remoto con alarmas en tiempo real", en: "Remote monitoring modules with real-time alarms" },
      { es: "Sistema radiante compuesto por torre y antena diseñadas para 490 kHz y 518 kHz", en: "Radiating system made up of a tower and antenna designed for 490 kHz and 518 kHz" },
      { es: "Diseño optimizado para comunicaciones marítimas", en: "Design optimized for maritime communications" },
      { es: "Alta resistencia a condiciones ambientales exigentes", en: "High resistance to demanding environmental conditions" },
      { es: "Integración completa con transmisores NAVTEX Sender", en: "Full integration with Sender NAVTEX transmitters" },
    ],
    applications: [
      { es: "Seguridad marítima y avisos a la navegación", en: "Maritime safety and navigational warnings" },
      { es: "Estaciones costeras", en: "Coastal stations" },
      { es: "Apoyo a la navegación", en: "Navigation support" },
      { es: "Infraestructura de defensa", en: "Defense infrastructure" },
    ],
    image: img.capCritical.sm,
    alt: {
      es: "Estación costera de radio con mástil monopolo entre la niebla marina",
      en: "Coastal radio station with monopole mast in sea fog",
    },
    sourceUrl: "https://www.sender.cl/sistema-navtex-490-518-khz/",
  },
];

/* ==================================================================
   ÍNDICES DE BÚSQUEDA
   ================================================================== */

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
export const categoryById = new Map(categories.map((c) => [c.id, c]));
export const productBySlug = new Map(products.map((p) => [p.slug, p]));

export function productsOfCategory(slug: string): Product[] {
  const cat = categoryBySlug.get(slug);
  if (!cat) return [];
  return cat.productSlugs
    .map((s) => productBySlug.get(s))
    .filter((p): p is Product => Boolean(p));
}

export function relatedProducts(product: Product, limit = 3): Product[] {
  const sameCategory = products.filter(
    (p) => p.categoryId === product.categoryId && p.slug !== product.slug,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = products.filter(
    (p) => p.categoryId !== product.categoryId && p.slug !== product.slug,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
