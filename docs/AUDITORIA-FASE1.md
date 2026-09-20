# SENDER — FASE 1 · AUDITORÍA DEL REPOSITORIO

**Repo:** `cristianoleamiranda-dotcom/sender`
**Rama auditada:** `arena/01a0afb6-sender` → commit `2205a18` ("feat: align design and effects strictly with prompt-sender-cinematic.md")
**Fecha:** 2026-09-20
**Regla aplicada:** no se modificó código durante esta fase.

---

## 1. Veredicto en una línea

La base es **sólida en infraestructura y débil en ejecución**: Vite 7 + React 19 + TS + Tailwind v4 + Motion + Lenis bien montados, SEO de `index.html` notable, pero hay **dos capas de contenido y dos sistemas visales conviviendo sin conectarse**, ~1.000 líneas de código muerto, y un build que **oculta 25 errores de TypeScript**. Se conserva y evoluciona. No se reescribe desde cero.

---

## 2. Inventario real (verificado por comando, no de memoria)

### 2.1 Dependencias instaladas (`package.json`)

| Paquete | Versión | Estado real de uso |
|---|---|---|
| react / react-dom | 19.2.6 | ✅ En uso |
| motion | ^13.2.0 | ⚠️ **Solo en `src/ui/Reveal.tsx`, que nadie importa** → Motion está instalado pero **no se ejecuta en la página** |
| lenis | ^1.3.26 | ❌ **`useLenis()` nunca se invoca** en ningún componente → Lenis inactivo |
| lucide-react | ^1.47.0 | ✅ En uso (Navbar, Contact) |
| clsx + tailwind-merge | — | ✅ En uso vía `src/utils/cn.ts` |
| tailwindcss + @tailwindcss/vite | 4.1.17 | ✅ En uso (CSS-first, sin `tailwind.config.js`) |
| vite-plugin-singlefile | 2.3.0 | ⚠️ Activo y **perjudicial** (ver §4.1) |

### 2.2 Estructura existente

```
src/
  App.tsx                 53 lín   ✅ reutilizable (shell)
  main.tsx                10 lín   ✅ reutilizable
  index.css               77 lín   ⚠️ rediseñar (tema claro)
  components/
    Hero.tsx             267 lín   ⚠️ rediseñar (tema claro + nav duplicada embebida)
    Navbar.tsx           212 lín   ⚠️ rediseñar (tema claro + etiquetas duplicadas)
  sections/
    About.tsx             89 lín   ⚠️ rediseñar
    Process.tsx           50 lín   ⚠️ rediseñar
    Products.tsx          44 lín   ⚠️ rediseñar (grid de tarjetas plano: justo lo que el prompt prohíbe)
    Work.tsx              63 lín   ⚠️ rediseñar
    Quote.tsx             39 lín   ⚠️ reemplazar por "Por qué Sender"
    Contact.tsx          217 lín   ⚠️ rediseñar (formulario genérico como cierre)
    Footer.tsx            41 lín   ⚠️ rediseñar
  hooks/
    useVideoScrub.ts     325 lín   ✅ conservar (transporte scroll→video muy bien resuelto)
    useReducedMotion.ts   18 lín   ✅ conservar tal cual
    useLenis.ts           46 lín   ✅ conservar y **conectar** (hoy está muerto)
  ui/
    Primitives.tsx       115 lín   ❌ código muerto + usa tokens inexistentes
    Reveal.tsx           111 lín   ❌ código muerto (pero buen diseño: conectarlo)
  content/site.ts        226 lín   ⚠️ contenido ACTIVO, pobre y con datos sin verificar
  data/content.ts        454 lín   ⚠️ contenido MUERTO, rico y con convención anti-invención
  i18n/LanguageContext    54 lín   ✅ conservar (localStorage + navigator.language + <html lang>)
  utils/cn.ts              6 lín   ✅ conservar
```

### 2.3 Assets

| Asset | Peso | Estado |
|---|---|---|
| `public/assets/sender-hero.mp4` | **4.82 MB** | ✅ Existe y se usa (`./assets/sender-hero.mp4`). `preload="auto"` en móvil = crítico |
| `public/assets/sender-hero-frame1.png` | **2.54 MB** | ❌ **Huérfano**: no se referencia en ningún lado. Debería ser el `poster` — pero a 2.5 MB PNG es inutilizable tal cual |
| `src/assets/*.jpg` (10 imágenes reales) | ~2.5 MB total | ✅ Fotografía real de Sender: `cap-rf`, `cap-broadcast`, `cap-antennas`, `cap-transmission`, `cap-critical`, `proj-am`, `proj-stl`, `about`, `hero`, `hero-wide` |
| 10 `.jpg` + `.png` **duplicados en la raíz** | ~2.5 MB | ❌ Copias idénticas de `src/assets` tiradas en `/`. Basura de repo |
| `gen-hero-video.py`, `generate_hero_video.py` | — | ⚠️ Scripts de generación del hero. Mover a `scripts/` |
| `prompt-sender-cinematic.md`, `prompt-landing-page-ia.md`, `diagrama-landing-github-ia.{md,png}` | — | ⚠️ Documentos de trabajo en la raíz del repo público |

**Conclusión assets:** hay fotografía real suficiente para Productos Destacados y Soluciones. **No hace falta generar ni importar imágenes nuevas.** Cumplida la regla de prioridad de assets.

---

## 3. Lo que YA está bien y se conserva

1. **`useVideoScrub.ts` (325 lín)** — transporte de video scrub reactivo a scroll, touch y teclado, con máquina de estados `armed`/`released`, lerp exponencial, guarda de 12 fps para seek inverso, `playbackRate` decay y re-arm al volver al tope. Es la pieza de mayor valor técnico del repo. **Se conserva y se re-sintoniza** para el nuevo hero oscuro.
2. **`useReducedMotion.ts`** — correcto, con listener de cambio. Se conserva.
3. **`useLenis.ts`** — buena implementación (easing, `touchMultiplier`, respeta reduced-motion, expone `scrollToId`). Solo falta **llamarla**.
4. **`ui/Reveal.tsx`** — `Reveal`, `RevealLines` (masked line reveal con stagger) y `RevealImage` (curtain + scale settle). Es exactamente el motion system que pide el prompt §7. Estaba muerto; **se conecta**.
5. **`i18n/LanguageContext.tsx`** — detección de idioma, persistencia, `<html lang>` sincronizado. Correcto.
6. **SEO de `index.html`** — canonical, OG completo, `og:locale` + alternate, twitter card, JSON-LD `Organization` con dirección, teléfono y `knowsAbout`. Muy por encima del promedio. **Se conserva y se amplía** (falta `sitemap.xml`, `robots.txt`, schema por producto y meta por ruta).
7. **`data/content.ts`** — contenido bilingüe tipado con interfaces explícitas (`Capability`, `Project`, `Band`, `ProcessStep`, `Stat`) y, lo más importante, **convención `[UBICACIÓN]` / `[AÑO]` / `[XX]` + campo `verified: boolean` + footnote**. Es exactamente la disciplina "no inventar" que exige el prompt §3. **Se adopta como base** (decisión confirmada).
8. **`.github/workflows/deploy.yml`** — build + `actions/deploy-pages` correcto. Se conserva con un ajuste (§4.6).
9. **`vite.config.ts`** — ya tiene `host: 0.0.0.0`, `allowedHosts: true` y alias `@`. Bien para desarrollo y preview.

---

## 4. Defectos encontrados (todos verificados, con evidencia)

### 4.1 CRÍTICO · `vite-plugin-singlefile` produce un HTML de 2.76 MB

```
dist/index.html  2,762.90 kB │ gzip: 1,950.31 kB
[vite:singlefile] Inlining: index-BfJmwYNe.js
[vite:singlefile] Inlining: style-Eq5C-k3k.css
```

Todo el JS y CSS se inlinen en un solo HTML, y las 10 imágenes de `src/assets` se convierten a base64 dentro de él. Consecuencias directas contra el prompt §24 (performance):

- **1.95 MB gzip de un solo request bloqueante**, sin caché granular: cualquier cambio de texto invalida todo.
- **Imposible hacer code splitting ni lazy loading** → bloquea las rutas `/productos/*` del §13.
- **Imposible servir imágenes responsive** (`srcset`): cada JPG va inflado ~33% por base64.
- El LCP del hero queda detrás de 2 MB de JS+CSS inline.

**Decisión (autorizada como "decide tú"):** se retira `vite-plugin-singlefile`. Es un plugin de scaffolding para previews de un archivo, no para producción en dominio propio. Sin él, `dist/` vuelve a ser JS/CSS/imagenes cacheables por separado y el routing del §13 es viable.

### 4.2 CRÍTICO · `npm run build` no ejecuta TypeScript → 25 errores ocultos

`"build": "vite build"`. Vite/esbuild **transpila sin verificar tipos**. Al correr `npx tsc --noEmit`:

| Error | Causa raíz |
|---|---|
| `TS2307` ×19 — `Cannot find module '@/assets/*.jpg'` y `'../assets/*.jpg'` | `vite-env.d.ts` (que contiene `/// <reference types="vite/client" />`) está **en la raíz**, pero `tsconfig.json` tiene `"include": ["src", "vite.config.ts"]` → **el archivo de tipos nunca se incluye** |
| `TS2322` `Hero.tsx:242` — `RefObject<HTMLSpanElement>` no asignable a `Ref<HTMLDivElement>` | `locRef` tipado como span y aplicado a un `<div>` |
| `TS2322` `Contact.tsx:171` — `string` no asignable a `"Transmisores AM / FM"` | `siteContent` está declarado `as const` → `t.contact.form.types` es una **tupla de literales**, no `string[]` |
| `TS6133` ×7 — `React` / `useEffect` declarados y sin usar | Con `jsx: react-jsx` el import de React sobra; `noUnusedLocals: true` lo castiga |

El prompt §29 FASE 8 exige "corregir TODOS los errores de TypeScript" y "no terminar mientras el build esté roto". **Hoy el build pasa verde con 25 errores.** Se corrige la causa y se agrega `tsc -b` al script de build para que el CI lo bloquee.

### 4.3 ALTO · Dos fuentes de contenido en conflicto

- `src/content/site.ts` (226 lín) → **es el que se renderiza**. Shape: `nav/hero/about/process/processCards/products/projects/quote/contact/footer`.
- `src/data/content.ts` (454 lín) → **nadie lo importa** (`grep` confirmado: cero imports). Shape distinto e incompatible: `nav/hero/manifesto/capabilities/projects/technology/process/experience/about/contact/footer`, con `title: [string, string]`, specs reales por capacidad, bandas de frecuencia y `verified: boolean`.

Resultado: 454 líneas del mejor contenido del repo están muertas, y la página muestra la versión pobre. **Decisión confirmada: unificar en `data/content.ts` como base**, rellenando con lo que aporte `site.ts`, y eliminar el archivo duplicado.

### 4.4 ALTO · Dos sistemas visales conviviendo (migración a medias)

- `App.tsx`, `Hero.tsx`, `Navbar.tsx`, `sections/*` → **tema claro**: `bg-white text-[#494949]`, hexadecimales hardcodeados por todas partes (0 usos de tokens).
- `ui/Primitives.tsx` y `ui/Reveal.tsx` → **tema oscuro**: usan `bg-paper`, `text-ink`, `bg-signal`, `text-signal-soft`, `border-paper/25`, `bg-graphite`, `outline-signal-soft`.

**Ninguno de esos tokens existe.** `index.css` `@theme` solo define `brand-white`, `brand-blue`, `brand-gray`, `brand-cyan`. Además usan clases utilitarias `.mono`, `.label`, `.display` que tampoco están definidas (`.label` aparece 42 veces en el código). Tailwind v4 **no da error: simplemente no genera la clase**. Es decir, el design system oscuro estaba escrito pero jamás compiló.

→ Se resuelve en FASE 2 definiendo un único `@theme` con tokens semánticos oscuros y las utilidades tipográficas faltantes.

### 4.5 ALTO · Navegación duplicada y CTA no permanente

`Hero.tsx` lleva **su propia barra superior** (marca + 6 pills de nav + switch ES/EN + CTA) que además se desvanece con el scroll (`onUiUpdate` la traduce y le baja la opacidad). `Navbar.tsx` es una segunda barra, `fixed`, que aparece al pasar `innerHeight * 0.65`.

Consecuencias: dos implementaciones del mismo nav, etiquetas duplicadas, y el CTA **desaparece** durante el hero — justo lo contrario del §21 "CTA permanente: CONSULTAR". Además el CTA usa `t.hero.cta` ("Solicitar asesoría") en vez de una etiqueta de nav propia.

→ Se unifica en un solo `Navbar` con estado de scroll, CTA `CONSULTAR` permanente, y el hero queda libre de chrome.

### 4.6 MEDIO · Deploy: dos ramas publican al mismo GitHub Pages

```yaml
on:
  push:
    branches: ['main', 'arena/01a0afb6-sender']
```

Ambas ramas despliegan al mismo entorno `github-pages`, así que **el último push gana**: un push a la rama arena pisa la producción de `main`. Se acota el trigger a `main` + `workflow_dispatch`, de modo que la rama de trabajo se puede verificar sin tocar producción.

Falta además `public/.nojekyll` (sin él, Pages ignora rutas con `_` y puede interferir con el fallback SPA de `/productos/*`).

### 4.7 MEDIO · Mezcla de idiomas en la interfaz (viola §28 "REGLA ABSOLUTA")

Ejemplos literales encontrados:

- `Contact.tsx`: `Dirección / Office`, `Teléfono / Phone` — español e inglés en la misma etiqueta, **hardcodeado**, sin pasar por i18n.
- `data/content.ts` en `lang: es`: títulos `["ENGINEERING","THE SIGNAL"]`, `"WHAT WE ENGINEER"`, `"THE TECHNOLOGY BEHIND THE SIGNAL"`, `"FROM IDEA TO SIGNAL"`, `"PROVEN IN THE FIELD"`, subtítulo `"Technology in the field."`, y pasos `DESIGN / ENGINEERING / MANUFACTURING / INSTALLATION / SUPPORT` — **todo en inglés dentro de la variante española**.
- `site.ts` en `es`: `footer.tagline: "Engineering the Signal"`.
- `Hero.tsx`: chips `RF ENGINEERING / BROADCASTING / TRANSMISSION` hardcodeados.

→ Se separa en dos capas explícitas: **display en el idioma activo** (traducido) y **código técnico universal** (AM, FM, HF, VHF, UHF, NAVTEX, RF, kW, MHz, modelos) que sí permanece idéntico en ambos idiomas porque es nomenclatura, no prosa.

### 4.8 MEDIO · Contenido no verificado publicado (viola §3)

- `site.ts`: `stats` con `"100%" / "Cobertura nacional"`, `"24/7" / "Operación crítica"`, `"RF" / "Precisión técnica"` → **afirmaciones sin fuente**.
- `Contact.tsx`: `"Respuesta técnica garantizada para proyectos de radiodifusión, enlaces e ingeniería de misión crítica."` → **promesa comercial hardcodeada**, no verificable, y fuera de i18n.
- `data/content.ts`: `"[XX]+ Proyectos"` y `"[XX]+ Sistemas implementados"` con `verified: false` → correcto como placeholder, pero **no debe llegar a producción visible**. Se ocultan hasta tener el dato.

### 4.9 MEDIO · Hero pesado en móvil

`<video preload="auto">` con un MP4 de **4.82 MB**, sin `poster`, sin `<source>` alternativo, y un PNG huérfano de 2.54 MB que podría servir de poster pero no está optimizado. En 4G esto es el LCP. El §24 y §25 exigen fallback móvil y optimización de video.

→ Poster WebP/JPEG derivado del frame real existente, `preload="metadata"` + fuente diferida por breakpoint, y fallback estático con reduced-motion.

### 4.10 BAJO · Accesibilidad

- Los `<label>` del formulario de contacto **no tienen `htmlFor`** y los inputs no tienen `id` → inaccesibles para lector de pantalla y click-to-focus.
- El menú móvil usa `role="dialog" aria-modal="true"` pero **sin focus trap ni cierre con `Escape`**.
- `Navbar` fijo usa `aria-hidden={!visible}` con `-translate-y-full` pero **los enlaces siguen focuseables por teclado** cuando está oculto (focus fantasma).
- `index.css` define `@keyframes ping-signal` que **no se usa en ningún lado**; `Hero.tsx` usa `animate-ping` de Tailwind en su lugar.
- `scroll-behavior: smooth` en `html` **convive con Lenis**: cuando Lenis se active, ambos compiten. Se debe delegar el scroll a Lenis.

### 4.11 BAJO · Higiene de repo

- 10 imágenes duplicadas en la raíz (`about.jpg`, `cap-*.jpg`, `hero*.jpg`, `proj-*.jpg`, `diagrama-*.png`).
- Dos scripts Python de generación de video en la raíz.
- Tres documentos de prompt/diagrama en la raíz de un repo público.
- `README.md` describe "scroll-driven video transport" y bilingüe — correcto — pero no documenta la arquitectura ni el sistema de contenido.
- Sin ESLint configurado (el prompt §29 lo contempla como "si está configurado": no lo está).

---

## 5. Contenido real verificado desde `sender.cl` (para NO inventar)

Extraído del sitemap y de las fichas de producto del sitio en producción. Esto reemplaza los placeholders `[UBICACIÓN]` / `[AÑO]` del repo con datos documentados.

### 5.1 Catálogo publicado (12 fichas en `wp-sitemap-posts-post-1.xml`)

**Transmisores AM — Serie SENDER SS** (estado sólido, arquitectura modular, Clase D, modulación PWM, 490–1700 kHz, 50 Ω, estabilidad ±5 Hz, operación 24/7):

| Modelo | Potencia | Datos publicados |
|---|---|---|
| AM-1000SS | 1000 W | 490 kHz – 1700 kHz · 50 Ω · ±5 Hz |
| AM-2500SS | 2000 W | Alimentación monofásica 220 V 50/60 Hz |
| AM-5000SS | 5000 W | Trifásica 220 V / 380 V 50/60 Hz · 50 Ω |
| AM-10000SS | 10.000 W | 490 kHz – 1700 kHz · ±5 Hz · sintetizador digital de frecuencia |

**Transmisores FM** (estado sólido, 87.5–108 MHz): 50 W (0–50 W ajustable, PLL digital, comunitaria) · 150 W (locales y repetidoras) · 350 W (ventilación forzada) · 600 W (50 Ω RF, regionales) · 1 kW (modular).

**Enlaces Estudio–Planta** — marca **DHE**: `STAL-200` (encendido remoto del transmisor, programación de frecuencia y memorias desde panel frontal, Mono/MPX, preénfasis configurable, hasta 10 W, display ES/EN, clave de acceso) y `AL-100` (selección de frecuencia por DIP switch, Mono/MPX, hasta 10 W, indicación de modulación por LEDs).

**Antenas Yagi VHF** — serie 134–174 MHz, 3 a 7 elementos, aluminio 6162, boom 25×25×1,5 mm, elementos de 12,7 mm, soportes de aluminio fundido, herrajes galvanizados, adaptador gamma ajustable.

**Procesador de audio BIS-AP735** — gabinete único 19" × 1U; entrada balanceada –15 dBu a +15 dBu con AGC; modulación PWM en controles de peak y pre-emphasis adaptable; filtro activo pasa-bajo de 4 pasos; filtros RF en entrada y salida; salida balanceada 600 Ω; controles e indicación digitales en panel frontal.

**Sistema NAVTEX 490/518 kHz** — cuatro componentes: unidad de potencia y control, **software de automatización desarrollado por Sender**, módulo de monitoreo y control remoto (tensión de alimentación, potencia de transmisión, temperatura interna, alarmas automáticas, protecciones integradas de fábrica) y sistema radiante (torre + antena para 490 y 518 kHz).

**Amplificador MF 1000 W** — Clase D, 490 kHz – 1700 kHz, 300 VDC, 2,9 kg, protecciones electrónicas internas, para AM / NAVTEX / banda MF.

**Antena HF profesional** — 2–30 MHz, 1 kW, servicio continuo 24/7, construcción para exteriores y ambientes costeros con alta salinidad, baja pérdida y alta eficiencia de radiación. Aplicaciones: marítimas, estaciones costeras, NAVTEX, redes HF gubernamentales, emergencia.

**Antenas AM monopolo** — 510–1700 kHz. Ventajas publicadas: mayor ancho de banda y eficiencia que antenas alimentadas en serie, simplifica el uso del ATU, mantiene o mejora el patrón de irradiación, reduce la altura de torre requerida, permite integración con TV/FM/enlaces sin aisladores especiales, **torre aterrizada** con mejor protección contra rayos, y **hasta tres frecuencias AM en una misma torre**. Materiales: fibra de vidrio, acero galvanizado, aluminio reforzado.

**Circuitos integrados / RF** — TC4420, TL081, ICL7667, 74HC86, AD620, NE555, AD734, LM741, AD790, ADG431, TC4424, SN75452.

**Condensadores de alta potencia** — 100 pF, 400 pF, 500 pF, 1000 pF, 2000 pF, 4000 pF (±20%), 6000 pF (±20%). Aplicaciones: transmisión AM, RF, acopladores ATU, filtros de potencia.

**Cable coaxial** — Heliax® 1/2" Super Flex (50 Ω, conductor exterior corrugado de cobre en espiral, conductor central de aluminio revestido en cobre, radio mínimo de curvatura ≈1,25") y LMR-400 (50 Ω).

**Torres contraventadas galvanizadas** — estabilizadas con tirantes de acero anclados mediante ganchos tensores; tirantes en tres direcciones con radio de anclaje ≈1/2 de la altura (no inferior al 40%); celosía triangular; secciones de 3 a 6 m de largo por 35 cm de ancho.

**Otros:** equipos usados (URL `equipos-usados-4`).

### 5.2 Proyectos e instalaciones documentados (fuente: `sender.cl/quienes-somos/` y home)

| Proyecto | Dato publicado |
|---|---|
| **Radio Colosal, Ambato** — instalación de transmisor Sender | Cubierto por **Radio World** (enlace externo en la home de sender.cl) → único caso con fecha y medio verificables |
| **Desmontaje de torre autosoportada de 60 m** | Armada de Chile, Playa Ancha, Valparaíso |
| **Comunicaciones HF de largo alcance** | Instalación y operación en **Isla de Pascua**, entornos estratégicos |
| **Antenas HF de alto rendimiento** | Proyectos de defensa y radiodifusión |
| **Antena MF para sistema NAVTEX** | Entornos marítimos y defensa |
| **Sistema NAVTEX 490/518 kHz** | Seguridad marítima |

### 5.3 Contacto confirmado (coincide con el prompt §4 y con el sitio)

`+56 9 8386 4148` · WhatsApp `+56983864148` · `sender@sender.cl` · `bis.ltda@gmail.com` (ventas, publicado en el sitio) · Blanco Viel 1108, 2º piso, San Miguel, Santiago, Chile.

> **Nota:** el prompt §4 solo autoriza `sender@sender.cl`. `bis.ltda@gmail.com` está publicado en el sitio real como correo de ventas. Se conserva en la capa de datos marcado como secundario; si prefieres ocultarlo se elimina de un solo lugar.

### 5.4 Diferencia clave vs. el prompt

El prompt §12 lista 7 categorías. El sitio real publica **NAVTEX, HF, torres, coaxial, condensadores e integrados** como líneas de producto propias. Decisión confirmada por el usuario: **se usan exactamente las 7 del prompt**, y las líneas reales restantes se **absorben dentro de `06 — RF Y COMPONENTES` y `07 — SOLUCIONES ESPECIALES`**, de modo que no se pierde catálogo verificado pero se respeta la numeración pedida.

---

## 6. Plan de ejecución derivado (FASES 2–8)

| Fase | Qué se hace | Riesgo |
|---|---|---|
| **2 · FOUNDATION** | `@theme` oscuro con tokens semánticos + escala tipográfica display/mono; utilidades `.label`, `.mono`, `.display`; activar Lenis; conectar `ui/Reveal`; retirar `singlefile`; `build = tsc -b && vite build`; arreglar `vite-env.d.ts`; router + `basename` para Pages; limpiar raíz | Bajo |
| **3 · HERO** | Hero oscuro con video real + poster optimizado; wordmark SENDER; "TECNOLOGÍA QUE TRANSMITE"; CTA EXPLORAR/CONSULTAR; SCROLL TO EXPLORE; fallback móvil y reduced-motion | Medio |
| **4 · NARRATIVA** | La Señal (waveform SVG animado por scroll) · Experiencia (+20 y módulos conectados) · Soluciones (7 estaciones) · Transmisión (STUDIO→AUDIENCE) · Ingeniería | Medio |
| **5 · PRODUCTOS** | `ProductExplorer` / `ProductCard` / `ProductDetail` / `ProductTechnicalSpecs` / `ProductCTA`; rutas `/productos/:slug` con datos reales del §5.1; schema `Product` | Medio |
| **6 · CIERRE** | Automatización (consola industrial con telemetría NAVTEX real) · Historia sin eventos inventados · Por qué Sender · Contacto · Footer | Bajo |
| **7 · SEO/PERF** | `sitemap.xml`, `robots.txt`, meta por ruta, OG, canonical, lazy loading, `srcset`, preload crítico, contraste, focus, a11y del formulario | Bajo |
| **8 · QA** | `npm ci`, `tsc -b`, `npm run build` en verde; verificación responsive y reduced-motion | — |

---

## 7. Qué NO se toca

- `useVideoScrub.ts` (lógica de transporte) — solo se re-sintonizan constantes.
- `useReducedMotion.ts`, `useLenis.ts`, `utils/cn.ts`, `i18n/LanguageContext.tsx` — se conservan.
- Stack: React + TS + Vite + Tailwind + Motion + Lenis + Lucide. **Sin Three.js/WebGL**: el prompt §24 lo prohíbe salvo que mejore la experiencia, y aquí la señal, el espectro y la telemetría se resuelven mejor y más liviano con SVG/Canvas.
- Fotografía real de `src/assets` — no se reemplaza por nada generado ni de stock.
