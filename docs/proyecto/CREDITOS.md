# Créditos

Herramientas, bibliotecas, fuentes de datos y proyectos de terceros usados en el
rediseño y la publicación del sitio SENDER. Las versiones son las realmente
instaladas y verificadas el 2026-09-20, no las declaradas en `package.json`.

---

## 1. Orquestación del trabajo

| Herramienta | Uso concreto |
| --- | --- |
| **Arena AI — Agent Mode** | Ejecución del proceso completo: auditoría del repo, implementación, sistema de contenido bilingüe, SEO, optimización de assets, arnés de QA, medición de rendimiento, commits atómicos, apertura y fusión de pull requests, vigilancia del deploy y verificación del sitio publicado. Los documentos de esta carpeta los escribió el agente a partir de lo que efectivamente hizo y midió. |
| **La persona a cargo (Cristian Olea Miranda)** | Brief y concepto ("TECNOLOGÍA QUE TRANSMITE"), paleta, decisiones de contenido (unificar `content.ts` + `site.ts`, usar las 7 categorías del brief), restricciones (no inventar información, no usar stock, no mezclar idiomas), y aprobación de cada publicación. |

---

## 2. Plataforma, código e integración

| Herramienta | Versión | Uso |
| --- | --- | --- |
| **GitHub** | — | Repositorio `cristianoleamiranda-dotcom/sender`, ramas, pull requests #7, #8 y revisión de checks |
| **GitHub Actions** | — | CI y deploy: `npm ci` → `tsc -b` → `vite build` con `VITE_BASE_PATH=/sender/` → sitemap → fix-base → publicación |
| **GitHub Pages** | — | Hospedaje del sitio en `https://cristianoleamiranda-dotcom.github.io/sender/` |
| **Node.js** | v20.20.2 | Runtime de build, del servidor de pruebas y de los arneses |
| **npm** | 10.8.2 | Gestión de dependencias; `npm ci` replicado en local antes de cada push |
| **React** | 19.2.6 | Biblioteca de interfaz |
| **React DOM** | 19.2.6 | Render con `createRoot` |
| **React Router** | 7.18.4 | Enrutado SPA con `basename` derivado del base de Vite |
| **TypeScript** | 5.9.3 | Tipado del sistema de contenido (`{ es, en }` con `Resolved<T>`) |
| **Vite** | 7.3.2 | Build, base configurable, hash de assets |
| **Tailwind CSS** | 4.1.17 | Sistema de diseño (vía `@tailwindcss/vite`) |
| **Motion** | 13.2.0 | Animaciones (`whileInView`, transiciones del hero) |
| **Lenis** | 1.3.26 | Scroll suave con respeto por `prefers-reduced-motion` |
| **Lucide React** | 1.47.0 | Iconografía |
| **clsx** / **tailwind-merge** | 2.1.1 / 3.4.0 | Composición de clases |
| **@vitejs/plugin-react** | 5.1.1 | Integración React en Vite |

---

## 3. Verificación y medición

| Herramienta | Versión | Uso |
| --- | --- | --- |
| **Playwright** | 1.63.0 | Arnés QA (`qa/qa.mjs`, `qa/pages-base.mjs`, `qa/contrast.mjs`, `qa/no-opacity-text.mjs`, `qa/probe-test.mjs`): navegación real, rutas, accesibilidad, contraste, desbordes |
| **Chromium headless shell** | 153.0.8010.12 | Navegador de las pruebas (v1243 de Playwright) |
| **Lighthouse CLI** | 12.8.2 | Medición de rendimiento, accesibilidad, buenas prácticas y SEO en móvil y escritorio |
| **WCAG 2.1 nivel AA** | — | Criterio de contraste aplicado (4.5:1 en texto normal) |
| **Samsung Galaxy S24** (perfil) | — | Verificación móvil con viewport CSS 360×780, DPR 3 y UA real del dispositivo |

El criterio de calidad no lo puso ninguna herramienta: los umbrales (móvil ≥ 78,
escritorio ≥ 95, QA verde sin excepciones, contraste AA en todo el texto) los fijó
la persona a cargo en el brief.

---

## 4. Assets y exportación

| Herramienta | Versión | Uso |
| --- | --- | --- |
| **ImageMagick** | 7.1.1-43 Q16 | Conversión a WebP, redimensionado por ancho (640/960/1280) y conversión WebP→JPG para la exportación a WordPress |
| **Pillow** | 12.3.0 | Lectura de dimensiones y verificación de imágenes |
| **esbuild** | 0.27.7 | Compilación del catálogo TypeScript para la exportación (`tools/export-wordpress.mjs`) |

Las 24 fotografías WebP del sitio se derivan de los JPG originales que **ya estaban
en el repositorio**. No se generaron imágenes, no se usaron bancos de imágenes y no
se descargó material de terceros: fue una restricción explícita del brief y se
respetó. El video del hero (`sender-hero.mp4`) también es material existente.

---

## 5. Fuentes de los datos del sitio

Todo el contenido del catálogo proviene de las fichas públicas de
**[sender.cl](https://www.sender.cl/)**, verificadas el 2026-09-20. Cada producto
conserva su `sourceUrl` en `src/content/catalog.ts` para que sea trazable.

Páginas consultadas: transmisores AM serie SS, transmisores FM, enlaces STL
(STAL-200 / AL-100), sistema NAVTEX 490-518 kHz, antena HF 2-30 MHz, unidad de
sintonía USA-XX-ST, amplificador MF 1000 W, procesador BIS-AP735, circuitos
integrados, monopolo plegado, cable coaxial, condensadores y bobinas, torres
contraventadas, equipos usados y "quiénes somos".

Datos de contacto verificados en el mismo sitio: `+56 9 8386 4148`,
`sender@sender.cl`, Blanco Viel 1108, 2º piso, San Miguel, Santiago.

Para el documento de proceso se consultaron además:
[Wikipedia — Samsung Galaxy S24](https://en.wikipedia.org/wiki/Samsung_Galaxy_S24)
y [webmobilefirst — viewport CSS del S24](https://www.webmobilefirst.com/en/devices/samsung-galaxy-s24-2024/)
(especificaciones del dispositivo), y
[Lawwwing](https://lawwwing.com/la-nueva-era-de-la-proteccion-de-datos-en-chile-que-cambia-con-la-ley-21-719/),
[XMS Latam](https://xmslatam.com/ley-21719-proteccion-datos-chile/) y
[TIC Chile](https://www.tichile.cl/ley-21-719-el-nuevo-desafio-de-chile/) para las
fechas de la Ley 21.719.

---

## 6. Proyectos de terceros del mismo autor

| Proyecto | Relación | Licencia |
| --- | --- | --- |
| **scroll-craft** (`cristianoleamiranda-dotcom/scroll-craft`) | Sitio OLEA Broadcast, usado como referencia del patrón de scroll sin dependencias. **No se copió código al sitio SENDER.** | MIT |
| **freellmapi** (`cristianoleamiranda-dotcom/freellmapi`) | Fork de trabajo; no interviene en el sitio SENDER. Se analiza en `REPOS-ANALISIS.md` como posible infraestructura del proyecto social. | MIT |

**Atribución aguas arriba:** `freellmapi` es un fork de
**[tashfeenahmed/freellmapi](https://github.com/tashfeenahmed/freellmapi)**,
proyecto MIT de Tashfeen Ahmed. El trabajo original es suyo; el fork es una copia
de trabajo y no contiene cambios que se estén distribuyendo.

**Sobre Vertex3D:** se mencionó en el brief únicamente como referencia de
*dirección creativa*. No se copió diseño, código ni textos de ese proyecto, tal
como se pidió explícitamente.

---

## 7. Lo que no se usó, y por qué importa decirlo

- **Bancos de imágenes** (Unsplash, Pexels y similares): prohibido por el brief.
- **Generación de imágenes por IA**: no se generó ninguna imagen. Las 24 WebP salen
  de fotografías reales del repositorio.
- **Frameworks meta** (Next.js, Astro, Remix): se evaluó el prerender con React
  Router en modo framework y se **descartó** por empeorar el rendimiento móvil en
  las mediciones. La decisión y sus cuatro causas están documentadas en
  `docs/IMPLEMENTACION.md`.
- **Librerías de scroll adicionales**: se usa Lenis, ya presente y bien afinado en
  el repo.

Decir qué no se usó es parte del crédito: evita que quien retome el proyecto
vuelva a intentar caminos ya medidos y descartados.
