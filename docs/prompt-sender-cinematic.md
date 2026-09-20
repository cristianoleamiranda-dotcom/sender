# PROMPT — Copiar y pegar este bloque completo en tu IA (GitHub Copilot, ChatGPT, Claude, etc.)

---

## BLOQUE PROMPT (inicia aquí)

---

Eres un desarrollador front-end senior especializado en motion design e ingeniería web. Vas a implementar el sitio web **SENDER** — una empresa chilena de ingeniería RF, radiodifusión y sistemas de transmisión con más de 20 años de experiencia.

Tu tarea es transformar/buildar el sitio en una **landing page cinematográfica con scroll-driven hero video transport**, inspirada en el modelo de interacción de NOMAD BUILD CO., adaptada a la marca SENDER.

---

## CONTEXTO DE MARCA — SENDER

- **Nombre:** SENDER
- **Tagline:** Engineering the Signal / Ingeniería de la señal
- **Business:** Empresa chilena especializada en RF engineering, broadcasting, sistemas de transmisión, AM/FM transmitters, antenas, STL/links, audio processing, automation, NAVTEX, HF, VHF, UHF, comunicaciones críticas.
- **Experiencia:** 20+ años.
- **Ubicación:** Santiago, Chile · Latam
- **Colores de marca (OBLIGATORIOS — nada más):**
  - Blanco: `#ffffff`
  - Azul primario: `#1e73be`
  - Gris oscuro: `#494949`
  - Cyan / Signal Blue: `#0085b2`
- **Tipografía:** Helvetica Neue → Helvetica → Arial → sans-serif

**NO estás permitido inventar:** especificaciones técnicas, certificaciones, precios, marcas de productos, proyectos, imágenes de stock que no existan. Usa solo info real de SENDER.

**NO uses:** purple, violet, pink, orange, yellow, gold, green gradients, glassmorphism, AI gradients genéricas.

---

## LANGUAGE SYSTEM (ES / EN) — OBLIGATORIO

Toda la UI debe soportar español e inglés, centralizado en `src/content/site.ts`. No mezclar idiomas en la misma interfaz.

```typescript
// src/content/site.ts
export const siteContent = {
  es: {
    nav: {
      home: "INICIO",
      about: "NOSOTROS",
      engineering: "INGENIERÍA",
      products: "PRODUCTOS",
      projects: "PROYECTOS",
      contact: "CONTACTO",
    },
    hero: {
      eyebrow: "ENGINEERING THE SIGNAL",
      title: "SENDER",
      description: "Ingeniería RF, radiodifusión y sistemas de transmisión.",
      location: "CHILE · LATAM",
      cta: "Solicitar asesoría",
    },
    about: {
      label: "NOSOTROS",
      title: "Ingeniería que entiende la señal.",
      body: "Somos una empresa chilena especializada en telecomunicaciones, radiodifusión e ingeniería RF, con más de 20 años de experiencia.",
      secondary: "Diseñamos, desarrollamos e implementamos soluciones para sistemas de transmisión y comunicaciones profesionales.",
    },
    process: {
      title: "De la necesidad al sistema.",
      note: "Cuatro etapas, una solución.",
    },
    processCards: [
      { num: "01", label: "DIAGNÓSTICO", desc: "Entender la necesidad técnica y operacional." },
      { num: "02", label: "INGENIERÍA", desc: "Diseñar la solución y sus componentes." },
      { num: "03", label: "IMPLEMENTACIÓN", desc: "Integrar, instalar y poner en operación." },
      { num: "04", label: "SOPORTE", desc: "Acompañar el sistema durante su operación." },
    ],
    products: {
      title: "Tecnología para transmitir con precisión.",
    },
    projects: {
      title: "Sistemas que llevan la señal más lejos.",
    },
    quote: {
      title: "¿Tienes un desafío técnico?",
      body: "Cuéntanos qué necesitas implementar, mejorar o transmitir.",
      cta: "Solicitar asesoría",
    },
    contact: {
      title: "Hablemos de tu próximo sistema.",
      address: "Blanco Viel 1108, 2º piso, San Miguel, Santiago, Chile",
      phone: "+56 9 8386 4148",
      email: "sender@sender.cl",
      secondaryEmail: "bis.ltda@gmail.com",
    },
  },
  en: {
    nav: {
      home: "HOME",
      about: "ABOUT",
      engineering: "ENGINEERING",
      products: "PRODUCTS",
      projects: "PROJECTS",
      contact: "CONTACT",
    },
    hero: {
      eyebrow: "ENGINEERING THE SIGNAL",
      title: "SENDER",
      description: "RF engineering, broadcasting and transmission systems.",
      location: "CHILE · LATAM",
      cta: "Request consultation",
    },
    about: {
      label: "ABOUT US",
      title: "Engineering that understands the signal.",
      body: "We are a Chilean company specialized in telecommunications, broadcasting and RF engineering, with more than 20 years of experience.",
      secondary: "We design, develop and implement solutions for professional transmission and communication systems.",
    },
    process: {
      title: "From the need to the system.",
      note: "Four stages, one solution.",
    },
    processCards: [
      { num: "01", label: "DIAGNOSIS", desc: "Understand the technical and operational requirement." },
      { num: "02", label: "ENGINEERING", desc: "Design the solution and its components." },
      { num: "03", label: "IMPLEMENTATION", desc: "Integrate, install and commission the system." },
      { num: "04", label: "SUPPORT", desc: "Support the system throughout its operation." },
    ],
    products: {
      title: "Technology built to transmit with precision.",
    },
    projects: {
      title: "Systems that carry the signal farther.",
    },
    quote: {
      title: "Have a technical challenge?",
      body: "Tell us what you need to implement, improve or transmit.",
      cta: "Request consultation",
    },
    contact: {
      title: "Let's talk about your next system.",
      address: "Blanco Viel 1108, 2º piso, San Miguel, Santiago, Chile",
      phone: "+56 9 8386 4148",
      email: "sender@sender.cl",
      secondaryEmail: "bis.ltda@gmail.com",
    },
  },
};
```

Nav mapping:
- INICIO / HOME → `#hero`
- NOSOTROS / ABOUT → `#about`
- INGENIERÍA / ENGINEERING → `#process`
- PRODUCTOS / PRODUCTS → `#products`
- PROYECTOS / PROJECTS → `#work`
- CONTACTO / CONTACT → `#contact`

---

## TECH STACK — OBLIGATORIO

- React + TypeScript
- Tailwind CSS
- shadcn/ui (`/components/ui`)
- lucide-react (íconos)
- framer-motion (solo para: mobile menu, hover, micro-interacciones, transiciones UI no-transport)

Instala:
```bash
npm install framer-motion lucide-react
```

Si falta Tailwind o shadcn/ui: proveer instrucciones de setup.

---

## ARCHITECTURE

```
src/
├── components/
│   ├── ui/
│   │   └── minimalist-hero.tsx
│   ├── Navbar.tsx
│   ├── MobileMenu.tsx
│   └── LanguageSwitcher.tsx
├── sections/
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Process.tsx
│   ├── Work.tsx
│   ├── Products.tsx
│   ├── Quote.tsx
│   └── Contact.tsx
├── hooks/
│   ├── useVideoScrub.ts
│   └── useReducedMotion.ts
├── content/
│   └── site.ts
├── lib/
│   └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## ⚠️ PARAQUÉS NO SEA UN GENERAL AI LANDING PAGE

Este no es un landing genérico. La característica definitoria es el **scroll-driven hero video transport**. El usuario debe sentir que la páginacontrola el video a través del wheel, trackpad, toque y teclado. No reemplaces esto con animaciones de scroll convencionales.

---

## HERO — ESTRUCTURA HTML

```tsx
<section id="hero" className="hero container-type-inline-size">
  {/* Hero top: nav + language switcher + CTA */}
  <div className="hero-top">
    <nav id="nav">
      {/* pills de navegación */}
    </nav>
    <LanguageSwitcher />
    <CTA>{t("hero.cta")}</CTA>
  </div>

  {/* Wordmark principal */}
  <h1 id="hero-word" className="hero-wordmark">
    SENDER
  </h1>

  {/* Video wrap */}
  <div id="hero-video-wrap">
    <video
      id="hero-video"
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src="/assets/sender-hero.mp4" type="video/mp4" />
    </video>
    <div id="hero-fade" />
    <div className="hero-foot">
      <div id="chips">
        {/* pills técnicos */}
      </div>
      <span id="loc">{t("hero.location")}</span>
    </div>
  </div>
</section>
```

Video requirements:
- `/assets/sender-hero.mp4` (o el asset real que exista en el proyecto)
- NUNCA usar el video de la plantilla NOMAD (`media.kolpusites.com`)
- muted, playsInline, preload="auto"
- NO autoplay, NO loop, NO controls
- Initial: `currentTime = 0`, `paused`
- La primera imagen decodificada debe permanecer visible

---

## CORE FEATURE — HERO VIDEO TRANSPORT (el feature principal)

### Concepto

Cuando el usuario está en el top de la página (`scrollY === 0`):

- **Wheel down / trackpad down / touch down / ArrowDown / PageDown / Space** → avanza el video (no hace scroll)
- **Wheel up / trackpad up / touch up / ArrowUp / PageUp** → rebobina el video
- La UI del hero (nav, CTA, wordmark, chips, location) se escapa del frame a medida que el video avanza
- Cuando el video llega al final → se libera el scroll → el usuario continúa naturalmente hacia ABOUT, ENGINEERING, etc.

Esto debe sentirse como **una transición cinematográfica continua**.

### Transport State Machine

```typescript
type TransportState = "armed" | "released";

// Refs (NO React state para estos valores — usar refs para performance)
const transportStateRef = useRef<TransportState>("armed");
const transportProgressRef = useRef(0);    // 0 → 1
const currentTimeRef = useRef(0);
const targetTimeRef = useRef(0);
const navigationInProgressRef = useRef(false);
const playbackRateRef = useRef(1);
```

### WHEEL TRANSPORT

```typescript
window.addEventListener("wheel", handleWheel, { passive: false });

function handleWheel(e: WheelEvent) {
  if (transportStateRef.current !== "armed") return;
  e.preventDefault();
  window.scrollTo(0, 0);

  const delta = Math.abs(e.deltaY) * 0.00045;
  if (e.deltaY > 0) {
    transportProgressRef.current = Math.min(1, transportProgressRef.current + delta);
  } else {
    transportProgressRef.current = Math.max(0, transportProgressRef.current - delta);
  }
}
```

### TOUCH TRANSPORT

```typescript
let touchStartY = 0;

element.addEventListener("touchstart", (e) => {
  if (transportStateRef.current !== "armed") return;
  touchStartY = e.touches[0].clientY;
});

element.addEventListener("touchmove", (e) => {
  if (transportStateRef.current !== "armed") return;
  e.preventDefault();
  const deltaY = touchStartY - e.touches[0].clientY;
  const delta = Math.abs(deltaY) * 0.00045;
  if (deltaY > 0) {
    transportProgressRef.current = Math.min(1, transportProgressRef.current + delta);
  } else {
    transportProgressRef.current = Math.max(0, transportProgressRef.current - delta);
  }
  touchStartY = e.touches[0].clientY;
});
```

### KEYBOARD TRANSPORT

```typescript
window.addEventListener("keydown", (e) => {
  if (transportStateRef.current !== "armed") return;
  // No interceptar Tab
  if (e.key === "Tab") return;

  const step = 0.00045;
  if (e.key === "ArrowDown") { transportProgressRef.current = Math.min(1, transportProgressRef.current + 0.025); e.preventDefault(); }
  if (e.key === "ArrowUp")   { transportProgressRef.current = Math.max(0, transportProgressRef.current - 0.025); e.preventDefault(); }
  if (e.key === "PageDown")  { transportProgressRef.current = Math.min(1, transportProgressRef.current + 0.12);  e.preventDefault(); }
  if (e.key === "PageUp")    { transportProgressRef.current = Math.max(0, transportProgressRef.current - 0.12);  e.preventDefault(); }
  if (e.key === " " || e.key === "Spacebar") { transportProgressRef.current = Math.min(1, transportProgressRef.current + 0.12); e.preventDefault(); }
});
```

### VIDEO TIME CONTROL — LERP

```typescript
const LERP_TAU = 8;

// Cada frame del RAF:
const targetTime = transportProgressRef.current * videoRef.current.duration;
const dt = deltaTimeEnSegundos;

currentTimeRef.current += (targetTime - currentTimeRef.current) * (1 - Math.exp(-dt * LERP_TAU));

// Aplicar al video:
videoRef.current.currentTime = currentTimeRef.current;
```

### FORWARD PLAYBACK

Cuando el usuario scrollea hacia abajo, usar playback real del video:

```typescript
if (e.deltaY > 0) {
  videoRef.current.play();
  playbackRateRef.current = Math.min(3, playbackRateRef.current + Math.min(0.5, Math.abs(e.deltaY) * 0.006));
}

// Decay del playback rate cada ~120ms:
if (playbackRateRef.current > 1) {
  playbackRateRef.current = Math.max(1, playbackRateRef.current - 0.12);
}
videoRef.current.playbackRate = playbackRateRef.current;
```

### REVERSE PLAYBACK — CRÍTICO

Los navegadores NO soportan `playbackRate = -1` de forma confiable. REVERSE usa seeks controlados:

```typescript
const REVERSE_FPS = 12;
const lastReverseSeekRef = useRef(0);

function handleReverseSeek(video: HTMLVideoElement, step: number) {
  if (video.seeking) return; // CRÍTICO: nunca hacer otro seek mientras está seeking
  const now = performance.now();
  if (now - lastReverseSeekRef.current < 1000 / REVERSE_FPS) return;
  lastReverseSeekRef.current = now;

  const newTime = Math.max(0.02, video.currentTime - step * playbackRateRef.current);
  video.currentTime = newTime;
  if (newTime <= 0.02) video.currentTime = 0;
}
```

### RELEASE (cuando el video termina)

```typescript
if (transportProgressRef.current >= 0.999) {
  transportProgressRef.current = 1;
  targetTimeRef.current = videoRef.current.duration;
  // Esperar ~2 rAF
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      transportStateRef.current = "released";
    });
  });
}
```

Cuando `released`: el próximo wheel gesture hace scroll natural del documento. Sin snap. Sin `scrollTo(section)`.

### RE-ARM (cuando el usuario vuelve arriba)

```typescript
if (
  transportStateRef.current === "released" &&
  window.scrollY <= 2 &&
  navigationInProgressRef.current === false
) {
  transportStateRef.current = "armed";
  transportProgressRef.current = 0;
  targetTimeRef.current = 0;
  currentTimeRef.current = 0;
  videoRef.current.currentTime = 0;
  videoRef.current.playbackRate = 1;
}
```

### NAVIGATION GUARD (click en nav mientras hero está armado)

```typescript
function navigateToSection(id: string) {
  navigationInProgressRef.current = true;
  transportStateRef.current = "released";
  history.replaceState(null, "", `#${id}`);
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  // Prevenir re-arm durante smooth scroll:
  setTimeout(() => { navigationInProgressRef.current = false; }, 800);
}
```

---

## HERO UI DISPLACEMENT — driven por video.currentTime (NO scrollY)

```typescript
const ease = (x: number) => x * x * (3 - 2 * x);
const k = ease(Math.min(1, Math.max(0, (currentTimeRef.current - 0.2) / 2.4)));

// Aplicar como CSS transforms / variables CSS:
nav:      translateX(-130% * k)
CTA:      translateX(160% * k)
wordmark: translateY(-300% * k)
chips:    translateX(-140% * k)
location: translateX(200% * k)
opacity:  1 - k * 1.15  // la UI desaparece cerca del final
```

La UI debe desaparecer completamente cerca del final del transporte.

---

## HERO GRADIENT

```css
.hero-fade {
  background: linear-gradient(
    to bottom,
    #ffffff 0%,
    rgba(255,255,255,.82) 28%,
    rgba(255,255,255,.42) 60%,
    rgba(255,255,255,0) 100%
  );
}
```

El gradiente debe desvanecerse a medida que avanza el video (opacity = 1 - k * 1.15).

---

## HERO WORDMARK

```css
.hero-wordmark {
  font-size: 16cqw;        /* container query units — NO vw */
  line-height: .78;
  letter-spacing: -.055em;
  font-weight: 500;
  white-space: nowrap;
  color: #494949;
}
```

Contenedor padre: `container-type: inline-size`.

---

## HERO CHIPS

Pills técnicos (pueden ser iguales en ambos idiomas — son terminología técnica internacional):

- RF ENGINEERING / RF ENGINEERING
- BROADCASTING / BROADCASTING
- TRANSMISSION / TRANSMISSION

Estilo: texto blanco, borde blanco, pill shape. Uno solido: fondo blanco, texto `#494949`.

---

## NAVIGATION — PILLS

Nav pills de 6 ítems. Estilo pill (pill-shaped). Colores: `#494949` texto, `#1e73be` active/accent.

Desktop: horizontal. Mobile: hamburger → menú fullscreen con `lucide-react` Menu y X.

---

## LANGUAGE SWITCHER

Compacto. ES | EN. `#494949` = inactivo, `#1e73be` = activo. No recargar la página. No dominar visualmente la nav.

---

## SECCIONES (todo estático, sin animación de scroll)

### ABOUT — `#about`

Contenido del `siteContent.about`. Columna media cinematográfica con video real de SENDER si existe. Video: muted, loop, playsInline, preload="auto". IntersectionObserver para play/pause (rootMargin: -15% 0px -15% 0px). **NO animar el texto — no reveal, no fade-up, no stagger.**

### PROCESS — `#process`

Título + nota del `siteContent.process`. 4 tarjetas estáticas (01 DIAGNÓSTICO ... 04 SOPORTE). No animation.

### PRODUCTS — `#products`

Título del `siteContent.products`. Categorías:
- TRANSMISORES AM
- TRANSMISORES FM
- STL / ENLACES
- PROCESAMIENTO DE AUDIO
- ANTENAS
- AUTOMATIZACIÓN
- HF / VHF / UHF
- NAVTEX

No inventar precios, potencias, marcas, certificaciones.

### PROJECTS / WORK — `#work`

Título del `siteContent.projects`. Categorías:
- STL / ENLACES
- TRANSMISIÓN
- RADIODIFUSIÓN
- AUTOMATIZACIÓN
- COMUNICACIONES
- RF

Usar imágenes reales de SENDER si existen. No inventar proyectos. No Unsplash si hay assets reales.

### QUOTE — sección de cita

`siteContent.quote`. CTA → `#contact`.

### CONTACT — `#contact`

`siteContent.contact`. Info real:
- Dirección: Blanco Viel 1108, 2º piso, San Miguel, Santiago, Chile
- Teléfono: +56 9 8386 4148
- Email: sender@sender.cl (mailto)
- Email secundario: bis.ltda@gmail.com (mailto)
- No inventar números de WhatsApp.

---

## REGLAS DE MOTION — IMPORTANTE

**El hero es cinematográfico. El resto del sitio es estático.**

NO añadir bajo el hero:
- scroll reveal
- fade-up
- stagger
- parallax
- count-up
- scroll scale / rotation
- text gradient fill
- image parallax
- card animation

La única motion fuera del hero: video de ABOUT loop mientras es visible.

---

## RESPONSIVE

Funciona en: 320px, 375px, 480px, 768px, 1024px, 1440px, 1920px, 2560px. Sin horizontal overflow. Wordmark usa `16cqw` (container query units), NO `16vw`.

---

## REDUCED MOTION

```typescript
// useReducedMotion.ts
export function useReducedMotion(): boolean {
  const ref = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => { ref.current = mq.matches; };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return ref.current;
}
```

Cuando `prefers-reduced-motion: reduce` está activo:
- NO registrar listeners de hero transport
- NO pinear el documento
- NO correr RAF de hero
- NO autoplay del video de ABOUT
- NO animar UI
- El page se comporta como sitio estático normal
- Hero permanece en su primer frame

---

## RAF LOOP — UNO SOLO

```typescript
// useVideoScrub.ts — hook principal
useEffect(() => {
  if (reducedMotion) return;

  let rafId: number;
  let lastTime = performance.now();

  function loop(now: number) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    // 1. Mantener documento pinhead mientras armed (scrollTo(0, 0) en wheel handler)
    // 2. Calcular target video time
    // 3. Interpolar current time con LERP
    // 4. Renderizar/update hero UI (CSS variables o DOM transforms)
    // 5. Handle release conditions

    rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(rafId);
}, []);
```

NO usar `window.addEventListener("scroll", ...)` para controlar el video. El scroll event solo para observación pasiva de estado si es necesario. El transporte lo controlan: wheel, touch, keyboard.

---

## PERFORMANCE

- Usar `useRef` para valores de transporte que cambian rápido (currentTime, transportProgress, playbackRate).
- NO trigger re-render de React en cada evento de wheel.
- Preferir CSS variables o DOM transforms directos para la UI del hero.
- `will-change: transform` solo en elementos animados activamente.

---

## SEO

- Title ES: `Sender — Engineering the Signal | Ingeniería RF, Radiodifusión y Telecomunicaciones en Chile`
- Title EN: `Sender — Engineering the Signal | RF Engineering, Broadcasting & Telecommunications in Chile`
- Canonical: `https://www.sender.cl/`
- Preservar JSON-LD de Organization existente si hay.

---

## TEST DE ACCEPTANCE — HUVEN (verificar después de implementar)

**H1**: Recargar. Hero visible inmediatamente. Sin entrance animation, splash, flash.

**H2**: En `scrollY = 0`, wheel down NO mueve el documento. El video avanza.

**H3**: Mientras avanza: nav → izquierda, CTA → derecha, wordmark → arriba, chips → izquierda, location → derecha.

**H4**: Wheel up → video rebobinas. UI regresa.

**H5**: Wheel rápido → playback rate sube hacia 3. Decay hacia 1.

**H6**: Reverse → nunca multiple seeks simultáneos. `if (video.seeking) return;` presente.

**H7**: Video llega al final → transport release. Próximo wheel → scroll natural al About. Sin snap.

**H8**: Scroll arriba → re-arm. Video retorna a frame 0.

**H9**: Click en nav desde hero → navegación funciona. Sin re-arm accidental.

**H10**: Mobile touch → controla video mientras armado.

**H11**: ArrowDown/ArrowUp funcionan mientras armado.

**H12**: Reduced motion → scroll nativo normal. Sin transport. Sin autoplay. Sin RAF.

---

## TEST DE ACCEPTANCE — LANGUAGE

- Switch a español: TODO el texto visible en español.
- Switch a inglés: TODO el texto visible en inglés.
- Sin textos mezclados. Términos técnicos pueden ser idénticos en ambos idiomas.

---

## TEST DE ACCEPTANCE — DESIGN

- Colores: solo `#ffffff`, `#1e73be`, `#494949`, `#0085b2`.
- Sin purple, yellow, orange, gold, green gradients, glassmorphism.
- Sin sombras excesivas. Sin tarjetas redondeadas.
- Pills OK para navegación y CTA.

---

## TEST DE ACCEPTANCE — RESPONSIVE

Probar en: 320, 375, 480, 768, 1024, 1440, 1920, 2560. Sin scrollbar horizontal. Sin nav recortada. Sin wordmark roto. Sin video roto. Sin CTA inaccesible. Sin language selector superponiéndose.

---

## IMPLEMENTACIÓN — PASOS

1. **Inspeccionar codebase existente** (si hay): routing, language provider, Tailwind, shadcn/ui, componentes existentes, assets de SENDER, hooks existentes, SEO.
2. **Crear/reusar `src/content/site.ts`** con el content de ES/EN provisto.
3. **Crear LanguageProvider** si no existe. Reusar si existe `useLang`.
4. **Crear `src/hooks/useReducedMotion.ts`**.
5. **Crear `src/hooks/useVideoScrub.ts`** — el hook principal del transporte.
6. **Crear `src/components/ui/minimalist-hero.tsx`** adaptado a SENDER.
7. **Crear `src/components/Navbar.tsx`**, `MobileMenu.tsx`, `LanguageSwitcher.tsx`.
8. **Crear secciones**: Hero, About, Process, Work, Products, Quote, Contact.
9. **Crear `src/App.tsx`** ensamblando todo.
10. **CSS global** en `index.css` con CSS variables de marca y estilos base.
11. **Depurar**: correr tests de acceptance H1-H12.
12. **Depurar**: correr tests de language y design.

---

## PRINCIPIO FINAL

La experiencia debe sentirse así:

```
STATIC EDITORIAL HERO  ↓
USER SCROLLS (wheel/touch/keyboard)  ↓
SCROLL BECOMES VIDEO TRANSPORT  ↓
VIDEO MOVES  ↓
UI EXITS THE FRAME  ↓
VIDEO REACHES FINAL FRAME  ↓
DOCUMENT SCROLL IS RELEASED  ↓
ABOUT → ENGINEERING → PROJECTS → PRODUCTS → CONTACT  ↓

Volver arriba:
NATIVE SCROLL  ↓
TOP OF PAGE  ↓
TRANSPORT RE-ARMS  ↓
VIDEO RETURNS TO FRAME 0  ↓
SENDER HERO READY AGAIN
```

**NO reemplaces esto con animación de scroll convencional. NO lo simplifiques. NO lo borres por ser complejo. Implementa correctamente.**

---

## BLOQUE PROMPT (termina aquí)

---

## Instrucciones para el usuario (no incluir en el prompt para la IA)

### Cómo usar este prompt

1. **Abre GitHub Copilot Chat**, ChatGPT, Claude o tu IA favorita.
2. **Copia todo el bloque desde "Eres un desarrollador front-end senior..." hasta el final del bloque.**
3. **Pega el bloque completo** y envíalo.
4. La IA debe generarte/modificar los archivos del proyecto SENDER.

### Si no hay proyecto existente (desde cero)

```bash
npm create vite@latest sender-web -- --template react-ts
cd sender-web
npm install
npx tailwindcss init -p
npx shadcn@latest init
npm install framer-motion lucide-react
npx shadcn@latest add button
```

Luego pega el prompt en tu IA para que genere todos los archivos.

### Para añadir el video hero

Coloca un video real de SENDER en `public/assets/sender-hero.mp4`. Si no tienes uno, deja un placeholder comentado y la IA usará un video placeholder temporal.
