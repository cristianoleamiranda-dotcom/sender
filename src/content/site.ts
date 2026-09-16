export type Lang = "es" | "en";

export interface NavLink {
  label: string;
  href: string;
}

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

export interface ProductCategory {
  title: string;
}

export interface ProjectCategory {
  title: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  emailSecondary: string;
}

export interface SiteContent {
  nav: NavLink[];
  hero: {
    tagline: string;
    wordmark: string;
    sub: string;
    location: string;
    cta: string;
    chips: string[];
  };
  about: {
    id: string;
    eyebrow: string;
    title: string;
    p1: string;
    p2: string;
  };
  process: {
    id: string;
    title: string;
    note: string;
    steps: ProcessStep[];
  };
  products: {
    id: string;
    title: string;
    categories: ProductCategory[];
  };
  work: {
    id: string;
    title: string;
    categories: ProjectCategory[];
  };
  quote: {
    title: string;
    body: string;
    cta: string;
  };
  contact: {
    id: string;
    title: string;
    info: ContactInfo;
  };
}

export const content: Record<Lang, SiteContent> = {
  es: {
    nav: [
      { label: "INICIO", href: "#hero" },
      { label: "NOSOTROS", href: "#about" },
      { label: "INGENIERÍA", href: "#process" },
      { label: "PRODUCTOS", href: "#products" },
      { label: "PROYECTOS", href: "#work" },
      { label: "CONTACTO", href: "#contact" },
    ],
    hero: {
      tagline: "ENGINEERING THE SIGNAL",
      wordmark: "SENDER",
      sub: "Ingeniería RF, radiodifusión y sistemas de transmisión.",
      location: "CHILE · LATAM",
      cta: "Solicitar asesoría",
      chips: ["RF ENGINEERING", "BROADCASTING", "TRANSMISSION"],
    },
    about: {
      id: "about",
      eyebrow: "NOSOTROS",
      title: "Ingeniería que entiende la señal.",
      p1: "Somos una empresa chilena especializada en telecomunicaciones, radiodifusión e ingeniería RF, con más de 20 años de experiencia.",
      p2: "Diseñamos, desarrollamos e implementamos soluciones para sistemas de transmisión y comunicaciones profesionales.",
    },
    process: {
      id: "process",
      title: "De la necesidad al sistema.",
      note: "Cuatro etapas, una solución.",
      steps: [
        { num: "01", title: "DIAGNÓSTICO", desc: "Entender la necesidad técnica y operacional." },
        { num: "02", title: "INGENIERÍA", desc: "Diseñar la solución y sus componentes." },
        { num: "03", title: "IMPLEMENTACIÓN", desc: "Integrar, instalar y poner en operación." },
        { num: "04", title: "SOPORTE", desc: "Acompañar el sistema durante su operación." },
      ],
    },
    products: {
      id: "products",
      title: "Tecnología para transmitir con precisión.",
      categories: [
        { title: "TRANSMISORES AM" },
        { title: "TRANSMISORES FM" },
        { title: "STL / ENLACES" },
        { title: "PROCESAMIENTO DE AUDIO" },
        { title: "ANTENAS" },
        { title: "AUTOMATIZACIÓN" },
        { title: "HF/VHF/UHF" },
        { title: "NAVTEX" },
      ],
    },
    work: {
      id: "work",
      title: "Sistemas que llevan la señal más lejos.",
      categories: [
        { title: "STL / ENLACES" },
        { title: "TRANSMISIÓN" },
        { title: "RADIODIFUSIÓN" },
        { title: "AUTOMATIZACIÓN" },
        { title: "COMUNICACIONES" },
        { title: "RF" },
      ],
    },
    quote: {
      title: "¿Tienes un desafío técnico?",
      body: "Cuéntanos qué necesitas implementar, mejorar o transmitir.",
      cta: "Solicitar asesoría",
    },
    contact: {
      id: "contact",
      title: "Hablemos de tu próximo sistema.",
      info: {
        address: "Blanco Viel 1108, 2º piso, San Miguel, Santiago, Chile",
        phone: "+56 9 8386 4148",
        email: "sender@sender.cl",
        emailSecondary: "bis.ltda@gmail.com",
      },
    },
  },
  en: {
    nav: [
      { label: "HOME", href: "#hero" },
      { label: "ABOUT", href: "#about" },
      { label: "ENGINEERING", href: "#process" },
      { label: "PRODUCTS", href: "#products" },
      { label: "PROJECTS", href: "#work" },
      { label: "CONTACT", href: "#contact" },
    ],
    hero: {
      tagline: "ENGINEERING THE SIGNAL",
      wordmark: "SENDER",
      sub: "RF engineering, broadcasting and transmission systems.",
      location: "CHILE · LATAM",
      cta: "Request consultation",
      chips: ["RF ENGINEERING", "BROADCASTING", "TRANSMISSION"],
    },
    about: {
      id: "about",
      eyebrow: "ABOUT US",
      title: "Engineering that understands the signal.",
      p1: "We are a Chilean company specialized in telecommunications, broadcasting and RF engineering, with more than 20 years of experience.",
      p2: "We design, develop and implement solutions for professional transmission and communication systems.",
    },
    process: {
      id: "process",
      title: "From the need to the system.",
      note: "Four stages, one solution.",
      steps: [
        { num: "01", title: "DIAGNOSIS", desc: "Understand the technical and operational need." },
        { num: "02", title: "ENGINEERING", desc: "Design the solution and its components." },
        { num: "03", title: "IMPLEMENTATION", desc: "Integrate, install and put into operation." },
        { num: "04", title: "SUPPORT", desc: "Support the system throughout its operation." },
      ],
    },
    products: {
      id: "products",
      title: "Technology built to transmit with precision.",
      categories: [
        { title: "AM TRANSMITTERS" },
        { title: "FM TRANSMITTERS" },
        { title: "STL / LINKS" },
        { title: "AUDIO PROCESSING" },
        { title: "ANTENNAS" },
        { title: "AUTOMATION" },
        { title: "HF/VHF/UHF" },
        { title: "NAVTEX" },
      ],
    },
    work: {
      id: "work",
      title: "Systems that carry the signal farther.",
      categories: [
        { title: "STL / LINKS" },
        { title: "TRANSMISSION" },
        { title: "BROADCASTING" },
        { title: "AUTOMATION" },
        { title: "COMMUNICATIONS" },
        { title: "RF" },
      ],
    },
    quote: {
      title: "Have a technical challenge?",
      body: "Tell us what you need to implement, improve or transmit.",
      cta: "Request consultation",
    },
    contact: {
      id: "contact",
      title: "Let's talk about your next system.",
      info: {
        address: "Blanco Viel 1108, 2nd floor, San Miguel, Santiago, Chile",
        phone: "+56 9 8386 4148",
        email: "sender@sender.cl",
        emailSecondary: "bis.ltda@gmail.com",
      },
    },
  },
};
