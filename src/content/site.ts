/**
 * SENDER — CONTENIDO DEL SITIO
 *
 * Un solo árbol donde cada texto es un par `{ es, en }`.
 * `LanguageContext` lo resuelve al idioma activo con `resolve()`.
 *
 * REGLA ABSOLUTA DE CONTENIDO: nada de lo que está aquí fue inventado.
 * Toda afirmación proviene del brief confirmado del proyecto o de
 * información publicada en sender.cl (verificada el 2026-09-20).
 * No hay clientes sin nombre, certificaciones, premios, cifras de
 * proyectos ni fechas de hitos: Sender no los publica, así que no están.
 *
 * REGLA ABSOLUTA DE IDIOMA: la nomenclatura técnica universal
 * (AM, FM, HF, VHF, UHF, NAVTEX, RF, STL, modelos, unidades) se escribe
 * idéntica en ambos idiomas porque es código técnico, no prosa.
 * Todo lo demás está traducido en los dos idiomas.
 */

import type { SiteContent } from "./types";

export const siteContent: SiteContent = {
  /* ---------------------------------------------------------------- */
  nav: {
    items: [
      { id: "productos", href: "/productos", label: { es: "Productos", en: "Products" } },
      { id: "soluciones", href: "/#soluciones", label: { es: "Soluciones", en: "Solutions" } },
      { id: "empresa", href: "/#empresa", label: { es: "Empresa", en: "Company" } },
      { id: "proyectos", href: "/#proyectos", label: { es: "Proyectos", en: "Projects" } },
      { id: "contacto", href: "/#contacto", label: { es: "Contacto", en: "Contact" } },
    ],
    cta: { es: "Consultar", en: "Consult" },
    language: { es: "Seleccionar idioma", en: "Select language" },
    openMenu: { es: "Abrir menú", en: "Open menu" },
    closeMenu: { es: "Cerrar menú", en: "Close menu" },
    location: { es: "Santiago · Chile", en: "Santiago · Chile" },
  },

  /* ---------------------------------------------------------------- */
  hero: {
    wordmark: { es: "SENDER", en: "SENDER" },
    claim: { es: "Tecnología que transmite.", en: "Technology that transmits." },
    sub: {
      es: "Más de 20 años desarrollando soluciones para Broadcasting y Telecomunicaciones.",
      en: "More than 20 years developing solutions for Broadcasting and Telecommunications.",
    },
    primary: { es: "Explorar", en: "Explore" },
    secondary: { es: "Consultar", en: "Consult" },
    scroll: { es: "Desliza para explorar", en: "Scroll to explore" },
    hint: {
      es: "Desliza o usa ↑ ↓ para controlar el transporte del video",
      en: "Scroll or use ↑ ↓ to control the video transport",
    },
    meta: [
      { es: "Santiago, Chile", en: "Santiago, Chile" },
      { es: "20+ años", en: "20+ years" },
      { es: "AM · FM · HF · VHF · UHF · NAVTEX", en: "AM · FM · HF · VHF · UHF · NAVTEX" },
    ],
  },

  /* ---------------------------------------------------------------- */
  signal: {
    kicker: { es: "01 — La señal", en: "01 — The signal" },
    title: [
      { es: "La señal", en: "The signal" },
      { es: "no se ve.", en: "is not seen." },
      { es: "Se experimenta.", en: "It is experienced." },
    ],
    body: [
      {
        es: "Desde hace más de 20 años desarrollamos tecnología para Broadcasting y Telecomunicaciones.",
        en: "For more than 20 years we have developed technology for Broadcasting and Telecommunications.",
      },
      {
        es: "Creamos soluciones adaptadas a las necesidades de nuestros clientes.",
        en: "We create solutions adapted to the needs of our clients.",
      },
      {
        es: "Diseñamos, fabricamos, implementamos y soportamos los sistemas que llevan la señal hasta su destino.",
        en: "We design, manufacture, deploy and support the systems that carry the signal to its destination.",
      },
    ],
    stages: [
      {
        index: { es: "A", en: "A" },
        name: { es: "ONDA", en: "WAVEFORM" },
        text: { es: "La señal de programa nace como onda.", en: "The program signal begins as a wave." },
      },
      {
        index: { es: "B", en: "B" },
        name: { es: "FRECUENCIA", en: "FREQUENCY" },
        text: { es: "Se le asigna un lugar en el espectro.", en: "It is assigned a place in the spectrum." },
      },
      {
        index: { es: "C", en: "C" },
        name: { es: "DATOS", en: "DATA" },
        text: { es: "Automatización y telemetría la supervisan.", en: "Automation and telemetry supervise it." },
      },
      {
        index: { es: "D", en: "D" },
        name: { es: "RF", en: "RF" },
        text: { es: "Se amplifica y acondiciona en radiofrecuencia.", en: "It is amplified and conditioned in radio frequency." },
      },
      {
        index: { es: "E", en: "E" },
        name: { es: "TRANSMISIÓN", en: "TRANSMISSION" },
        text: { es: "Se irradia hacia la audiencia.", en: "It is radiated toward the audience." },
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  experience: {
    kicker: { es: "02 — Experiencia", en: "02 — Experience" },
    value: { es: "+20", en: "+20" },
    valueLabel: { es: "Años de experiencia", en: "Years of experience" },
    domains: [
      {
        index: { es: "01", en: "01" },
        name: { es: "BROADCASTING", en: "BROADCASTING" },
        text: {
          es: "Transmisores AM y FM de estado sólido, procesamiento de audio y enlaces estudio–planta para radiodifusión profesional.",
          en: "Solid-state AM and FM transmitters, audio processing and studio–transmitter links for professional broadcasting.",
        },
      },
      {
        index: { es: "02", en: "02" },
        name: { es: "TELECOMUNICACIONES", en: "TELECOMMUNICATIONS" },
        text: {
          es: "Infraestructura de telecomunicaciones, torres, líneas de transmisión y estaciones para proyectos nacionales e internacionales.",
          en: "Telecommunications infrastructure, towers, transmission lines and stations for national and international projects.",
        },
      },
      {
        index: { es: "03", en: "03" },
        name: { es: "RF", en: "RF" },
        text: {
          es: "Ingeniería de radiofrecuencia: sistemas radiantes, antenas, acoplamiento, amplificación y componentes de alta potencia.",
          en: "Radio-frequency engineering: radiating systems, antennas, matching, amplification and high-power components.",
        },
      },
      {
        index: { es: "04", en: "04" },
        name: { es: "AUTOMATIZACIÓN", en: "AUTOMATION" },
        text: {
          es: "Software de automatización propio, monitoreo remoto, alarmas en tiempo real y control de operación continua.",
          en: "In-house automation software, remote monitoring, real-time alarms and continuous operation control.",
        },
      },
    ],
    eras: [
      {
        index: { es: "01", en: "01" },
        label: { es: "Origen", en: "Origin" },
        text: {
          es: "Empresa chilena especializada en telecomunicaciones y radiodifusión, con foco en ingeniería y equipamiento RF.",
          en: "Chilean company specialized in telecommunications and broadcasting, focused on engineering and RF equipment.",
        },
      },
      {
        index: { es: "02", en: "02" },
        label: { es: "Evolución", en: "Evolution" },
        text: {
          es: "Desarrollo de tecnología propia: transmisores AM de estado sólido, antenas y enlaces estudio–planta.",
          en: "Development of own technology: solid-state AM transmitters, antennas and studio–transmitter links.",
        },
      },
      {
        index: { es: "03", en: "03" },
        label: { es: "Innovación", en: "Innovation" },
        text: {
          es: "Software de automatización desarrollado por Sender, monitoreo remoto y sistemas NAVTEX 490 / 518 kHz.",
          en: "Automation software developed by Sender, remote monitoring and NAVTEX 490 / 518 kHz systems.",
        },
      },
      {
        index: { es: "04", en: "04" },
        label: { es: "Actualidad", en: "Present" },
        text: {
          es: "Más de 20 años de experiencia y proyectos en Chile y en el extranjero, en radiodifusión, defensa y seguridad marítima.",
          en: "More than 20 years of experience and projects in Chile and abroad, in broadcasting, defense and maritime safety.",
        },
      },
    ],
    reach: [
      { es: "CHILE", en: "CHILE" },
      { es: "INTERNACIONAL", en: "INTERNATIONAL" },
    ],
    note: {
      es: "Sender no publica cifras de proyectos ni fechas de hitos. Este sitio solo muestra información documentada.",
      en: "Sender does not publish project counts or milestone dates. This site only shows documented information.",
    },
  },

  /* ---------------------------------------------------------------- */
  solutions: {
    kicker: { es: "03 — Soluciones", en: "03 — Solutions" },
    title: [
      { es: "Siete estaciones", en: "Seven engineering" },
      { es: "de ingeniería", en: "stations" },
    ],
    intro: {
      es: "Del transmisor a la antena. Cada estación agrupa líneas de producto reales de Sender y abre su ficha técnica completa.",
      en: "From transmitter to antenna. Each station groups real Sender product lines and opens its full technical sheet.",
    },
    explore: { es: "Explorar", en: "Explore" },
    consult: { es: "Consultar", en: "Consult" },
    itemsCount: { es: "productos documentados", en: "documented products" },
    bandsNote: {
      es: "Rangos según las líneas de producto publicadas por Sender.",
      en: "Ranges according to the product lines published by Sender.",
    },
  },

  /* ---------------------------------------------------------------- */
  transmission: {
    kicker: { es: "04 — Transmisión", en: "04 — Transmission" },
    title: [
      { es: "La ruta", en: "The route" },
      { es: "de la señal", en: "of the signal" },
    ],
    intro: {
      es: "Un sistema de transmisión no es un equipo: es una cadena. Sender participa en cada etapa, desde el estudio hasta la audiencia.",
      en: "A transmission system is not a single device: it is a chain. Sender takes part in every stage, from the studio to the audience.",
    },
    stages: [
      {
        id: "studio",
        index: { es: "01", en: "01" },
        title: { es: "ESTUDIO", en: "STUDIO" },
        text: { es: "La señal de programa se origina y se controla.", en: "The program signal originates and is controlled." },
      },
      {
        id: "processing",
        index: { es: "02", en: "02" },
        title: { es: "PROCESAMIENTO", en: "PROCESSING" },
        text: { es: "AGC, control de peak, pre-énfasis y filtrado activo.", en: "AGC, peak control, pre-emphasis and active filtering." },
      },
      {
        id: "transmission",
        index: { es: "03", en: "03" },
        title: { es: "TRANSMISIÓN", en: "TRANSMISSION" },
        text: { es: "Amplificación Clase D y modulación PWM en el transmisor.", en: "Class D amplification and PWM modulation in the transmitter." },
      },
      {
        id: "rf-link",
        index: { es: "04", en: "04" },
        title: { es: "ENLACE RF", en: "RF LINK" },
        text: { es: "Transporte estudio–planta y líneas coaxiales de baja pérdida.", en: "Studio–transmitter transport and low-loss coaxial lines." },
      },
      {
        id: "antenna",
        index: { es: "05", en: "05" },
        title: { es: "ANTENA", en: "ANTENNA" },
        text: { es: "Sistema radiante, acoplamiento y torre aterrizada.", en: "Radiating system, matching and grounded tower." },
      },
      {
        id: "audience",
        index: { es: "06", en: "06" },
        title: { es: "AUDIENCIA", en: "AUDIENCE" },
        text: { es: "Cobertura entregada con operación continua 24/7.", en: "Coverage delivered with continuous 24/7 operation." },
      },
    ],
    note: {
      es: "Cada etapa tiene equipamiento, ingeniería y soporte asociados en el catálogo de Sender.",
      en: "Every stage has equipment, engineering and support associated in the Sender catalog.",
    },
  },

  /* ---------------------------------------------------------------- */
  engineering: {
    kicker: { es: "05 — Ingeniería", en: "05 — Engineering" },
    title: [
      { es: "No solo vendemos equipos.", en: "We do not just sell equipment." },
      { es: "Diseñamos soluciones.", en: "We design solutions." },
    ],
    intro: {
      es: "Sender no comercializa productos aislados: participa en cada etapa del sistema, desde el análisis del requerimiento hasta la continuidad operacional.",
      en: "Sender does not sell isolated products: it takes part in every stage of the system, from requirement analysis to operational continuity.",
    },
    disciplines: [
      {
        index: { es: "01", en: "01" },
        name: { es: "ENGINEERING", en: "ENGINEERING" },
        text: {
          es: "Ingeniería RF, cálculo de sistemas radiantes, acoplamiento y protecciones.",
          en: "RF engineering, radiating system calculation, matching and protections.",
        },
      },
      {
        index: { es: "02", en: "02" },
        name: { es: "DESIGN", en: "DESIGN" },
        text: {
          es: "Análisis de frecuencia, cobertura y entorno. Definición de arquitectura de sistema.",
          en: "Frequency, coverage and environment analysis. System architecture definition.",
        },
      },
      {
        index: { es: "03", en: "03" },
        name: { es: "RF", en: "RF" },
        text: {
          es: "Módulos y circuitos de radiofrecuencia, amplificación y componentes de alta potencia.",
          en: "Radio-frequency modules and circuits, amplification and high-power components.",
        },
      },
      {
        index: { es: "04", en: "04" },
        name: { es: "BROADCAST", en: "BROADCAST" },
        text: {
          es: "Radiodifusión AM y FM profesional, procesamiento de audio y operación continua.",
          en: "Professional AM and FM broadcasting, audio processing and continuous operation.",
        },
      },
      {
        index: { es: "05", en: "05" },
        name: { es: "AUTOMATION", en: "AUTOMATION" },
        text: {
          es: "Software propio de automatización, telemetría y monitoreo remoto.",
          en: "In-house automation software, telemetry and remote monitoring.",
        },
      },
      {
        index: { es: "06", en: "06" },
        name: { es: "INTEGRATION", en: "INTEGRATION" },
        text: {
          es: "Implementación en terreno, puesta en marcha y soporte técnico continuo.",
          en: "Field deployment, commissioning and continuous technical support.",
        },
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  featured: {
    kicker: { es: "06 — Productos destacados", en: "06 — Featured products" },
    title: [
      { es: "Tecnología", en: "Technology" },
      { es: "en terreno", en: "in the field" },
    ],
    intro: {
      es: "Equipos fabricados y suministrados por Sender, con especificaciones publicadas.",
      en: "Equipment manufactured and supplied by Sender, with published specifications.",
    },
    view: { es: "Ver producto", en: "View product" },
  },

  /* ---------------------------------------------------------------- */
  automation: {
    kicker: { es: "07 — Automatización", en: "07 — Automation" },
    title: [
      { es: "Centro de control", en: "Transmission" },
      { es: "de la transmisión", en: "control center" },
    ],
    intro: {
      es: "La plataforma de automatización desarrollada por Sender supervisa los parámetros críticos del sistema y entrega alarmas en tiempo real. Esta consola representa los canales de monitoreo documentados del sistema NAVTEX.",
      en: "The automation platform developed by Sender supervises the system's critical parameters and delivers real-time alarms. This console represents the documented monitoring channels of the NAVTEX system.",
    },
    modules: [
      {
        index: { es: "01", en: "01" },
        title: { es: "Unidad de potencia y control", en: "Power and control unit" },
        text: {
          es: "Núcleo de comunicación entre el software de automatización y los transmisores. Administra las transmisiones, supervisa estados operacionales y garantiza una distribución segura de la información.",
          en: "Communication core between the automation software and the transmitters. It manages transmissions, supervises operational states and guarantees secure information distribution.",
        },
      },
      {
        index: { es: "02", en: "02" },
        title: { es: "Software de automatización", en: "Automation software" },
        text: {
          es: "Plataforma desarrollada por Sender para programar, administrar y supervisar transmisiones desde una interfaz centralizada.",
          en: "Platform developed by Sender to schedule, manage and supervise transmissions from a centralized interface.",
        },
      },
      {
        index: { es: "03", en: "03" },
        title: { es: "Monitoreo y control remoto", en: "Remote monitoring and control" },
        text: {
          es: "Supervisión de parámetros críticos y recepción de alarmas en tiempo real, para mantenimiento preventivo y continuidad operacional.",
          en: "Supervision of critical parameters and real-time alarm reception, for preventive maintenance and operational continuity.",
        },
      },
      {
        index: { es: "04", en: "04" },
        title: { es: "Protecciones integradas", en: "Integrated protections" },
        text: {
          es: "Protecciones integradas de fábrica y control remoto de operación sobre el sistema completo.",
          en: "Factory-integrated protections and remote operation control over the whole system.",
        },
      },
    ],
    channels: [
      {
        id: "voltage",
        label: { es: "VOLTAJE", en: "VOLTAGE" },
        unit: { es: "VDC", en: "VDC" },
        range: { es: "Tensión de alimentación", en: "Supply voltage" },
        kind: "bar",
      },
      {
        id: "power",
        label: { es: "POTENCIA", en: "POWER" },
        unit: { es: "W", en: "W" },
        range: { es: "Potencia de transmisión", en: "Transmission power" },
        kind: "bar",
      },
      {
        id: "temperature",
        label: { es: "TEMPERATURA", en: "TEMPERATURE" },
        unit: { es: "°C", en: "°C" },
        range: { es: "Temperatura interna", en: "Internal temperature" },
        kind: "gauge",
      },
      {
        id: "audio",
        label: { es: "AUDIO", en: "AUDIO" },
        unit: { es: "dBu", en: "dBu" },
        range: { es: "Entrada balanceada –15 a +15 dBu", en: "Balanced input –15 to +15 dBu" },
        kind: "bar",
      },
      {
        id: "gprs",
        label: { es: "GPRS", en: "GPRS" },
        unit: { es: "ENLACE", en: "LINK" },
        range: { es: "Canal de telemetría", en: "Telemetry channel" },
        kind: "state",
      },
      {
        id: "remote",
        label: { es: "CONTROL REMOTO", en: "REMOTE CONTROL" },
        unit: { es: "ESTADO", en: "STATE" },
        range: { es: "Control remoto de operación", en: "Remote operation control" },
        kind: "state",
      },
      {
        id: "system",
        label: { es: "ESTADO DEL SISTEMA", en: "SYSTEM STATE" },
        unit: { es: "ALARMAS", en: "ALARMS" },
        range: { es: "Alarmas automáticas del sistema", en: "Automatic system alarms" },
        kind: "state",
      },
    ],
    note: {
      es: "Canales y rangos según la documentación publicada del sistema NAVTEX 490 / 518 kHz y del procesador BIS-AP735. Los valores en pantalla son una simulación de interfaz, no telemetría en vivo.",
      en: "Channels and ranges according to the published documentation of the NAVTEX 490 / 518 kHz system and the BIS-AP735 processor. On-screen values are an interface simulation, not live telemetry.",
    },
    statusOnline: { es: "Sistema en operación", en: "System operating" },
    statusSimulated: { es: "Interfaz demostrativa", en: "Demonstrative interface" },
  },

  /* ---------------------------------------------------------------- */
  reasons: {
    kicker: { es: "08 — Por qué Sender", en: "08 — Why Sender" },
    title: [
      { es: "Cuatro razones", en: "Four technical" },
      { es: "técnicas", en: "reasons" },
    ],
    items: [
      {
        index: { es: "01", en: "01" },
        word: { es: "EXPERIENCIA", en: "EXPERIENCE" },
        text: {
          es: "Más de 20 años en telecomunicaciones y radiodifusión, con proyectos en Chile y en el extranjero.",
          en: "More than 20 years in telecommunications and broadcasting, with projects in Chile and abroad.",
        },
      },
      {
        index: { es: "02", en: "02" },
        word: { es: "TECNOLOGÍA", en: "TECHNOLOGY" },
        text: {
          es: "Tecnología desarrollada y fabricada por Sender: transmisores de estado sólido, antenas y software de automatización propio.",
          en: "Technology developed and manufactured by Sender: solid-state transmitters, antennas and in-house automation software.",
        },
      },
      {
        index: { es: "03", en: "03" },
        word: { es: "CALIDAD", en: "QUALITY" },
        text: {
          es: "Equipos diseñados para operación continua 24/7 en entornos exigentes, incluidos ambientes costeros de alta salinidad.",
          en: "Equipment designed for continuous 24/7 operation in demanding environments, including high-salinity coastal settings.",
        },
      },
      {
        index: { es: "04", en: "04" },
        word: { es: "PERSONALIZACIÓN", en: "CUSTOMIZATION" },
        text: {
          es: "Soluciones adaptadas a las necesidades de cada cliente: configuraciones especiales, integración de planta y soporte en terreno.",
          en: "Solutions adapted to each client's needs: special configurations, plant integration and field support.",
        },
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  projects: {
    kicker: { es: "09 — Proyectos", en: "09 — Projects" },
    title: [
      { es: "Instalaciones", en: "Documented" },
      { es: "documentadas", en: "installations" },
    ],
    intro: {
      es: "Solo proyectos e instalaciones publicados por Sender o cubiertos por prensa especializada. No se listan clientes ni fechas que no estén documentados.",
      en: "Only projects and installations published by Sender or covered by trade press. No clients or dates that are not documented are listed.",
    },
    view: { es: "Ver fuente", en: "View source" },
    sourceLabel: { es: "Fuente", en: "Source" },
  },

  /* ---------------------------------------------------------------- */
  contact: {
    kicker: { es: "10 — Contacto", en: "10 — Contact" },
    title: { es: "¿Qué necesitas transmitir?", en: "What do you need to transmit?" },
    sub: { es: "Hablemos de tu próximo proyecto.", en: "Let's talk about your next project." },
    primary: { es: "Contactar", en: "Contact" },
    whatsapp: { es: "WhatsApp", en: "WhatsApp" },
    products: { es: "Ver productos", en: "View products" },
    labels: {
      address: { es: "Dirección", en: "Address" },
      phone: { es: "Teléfono", en: "Phone" },
      email: { es: "Correo", en: "Email" },
      salesEmail: { es: "Ventas", en: "Sales" },
      map: { es: "Abrir en mapas", en: "Open in maps" },
    },
    form: {
      title: { es: "Consulta técnica", en: "Technical enquiry" },
      name: { es: "Nombre", en: "Name" },
      company: { es: "Empresa", en: "Company" },
      email: { es: "Correo electrónico", en: "Email address" },
      type: { es: "Tipo de requerimiento", en: "Type of request" },
      message: { es: "Describe tu proyecto", en: "Describe your project" },
      submit: { es: "Preparar consulta", en: "Prepare enquiry" },
      preparing: { es: "Abriendo tu cliente de correo…", en: "Opening your email client…" },
      note: {
        es: "El formulario compone el mensaje en tu propio cliente de correo. Este sitio no almacena datos.",
        en: "The form composes the message in your own email client. This site stores no data.",
      },
      types: [
        { es: "Transmisores AM", en: "AM transmitters" },
        { es: "Transmisores FM", en: "FM transmitters" },
        { es: "Enlaces STL", en: "STL links" },
        { es: "Procesamiento de audio", en: "Audio processing" },
        { es: "Automatización y monitoreo", en: "Automation and monitoring" },
        { es: "Antenas y torres", en: "Antennas and towers" },
        { es: "Sistema NAVTEX", en: "NAVTEX system" },
        { es: "Componentes RF", en: "RF components" },
        { es: "Soporte técnico / asesoría", en: "Technical support / advice" },
        { es: "Otro", en: "Other" },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  footer: {
    claim: { es: "Tecnología que transmite.", en: "Technology that transmits." },
    nav: { es: "Navegación", en: "Navigation" },
    catalog: { es: "Catálogo", en: "Catalog" },
    reach: { es: "Alcance", en: "Reach" },
    channels: { es: "Canales", en: "Channels" },
    legal: {
      es: "Sender · Telecomunicaciones y radiodifusión · Santiago, Chile",
      en: "Sender · Telecommunications and broadcasting · Santiago, Chile",
    },
    back: { es: "Volver arriba", en: "Back to top" },
  },

  /* ---------------------------------------------------------------- */
  productPage: {
    back: { es: "Volver", en: "Back" },
    allCategories: { es: "Soluciones", en: "Solutions" },
    overview: { es: "Descripción", en: "Overview" },
    specs: { es: "Especificaciones técnicas", en: "Technical specifications" },
    features: { es: "Características", en: "Features" },
    applications: { es: "Aplicación", en: "Application" },
    variants: { es: "Modelos disponibles", en: "Available models" },
    documentation: { es: "Documentación", en: "Documentation" },
    docsPending: {
      es: "Ficha técnica descargable pendiente de publicación. Solicítala y te la enviamos directamente.",
      en: "Downloadable datasheet pending publication. Request it and we will send it to you directly.",
    },
    consult: { es: "Consultar por este equipo", en: "Enquire about this equipment" },
    quoteWhatsapp: { es: "Cotizar por WhatsApp", en: "Request a quote on WhatsApp" },
    related: { es: "Productos relacionados", en: "Related products" },
    category: { es: "Categoría", en: "Category" },
    source: { es: "Ficha publicada en sender.cl", en: "Sheet published on sender.cl" },
    notFound: { es: "Producto no encontrado", en: "Product not found" },
  },

  /* ---------------------------------------------------------------- */
  catalogPage: {
    kicker: { es: "Catálogo", en: "Catalog" },
    title: [
      { es: "Soluciones", en: "Solutions" },
      { es: "de transmisión", en: "for transmission" },
    ],
    intro: {
      es: "Siete estaciones de ingeniería. Cada una abre sus productos con especificaciones publicadas por Sender.",
      en: "Seven engineering stations. Each one opens its products with specifications published by Sender.",
    },
    products: { es: "Productos", en: "Products" },
    viewCategory: { es: "Ver categoría", en: "View category" },
    allProducts: { es: "Todos los productos", en: "All products" },
  },
};

export type SiteLanguage = "es" | "en";
