# SENDER — Tecnología que transmite

Sitio corporativo y catálogo técnico de **Sender Chile**: ingeniería RF, radiodifusión
AM/FM, enlaces STL, automatización y telecomunicaciones críticas.

React 19 · TypeScript · Vite 7 · Tailwind CSS v4 · Motion · Lenis · React Router 7.

- **GitHub Pages:** <https://cristianoleamiranda-dotcom.github.io/sender/>
- **Dominio:** <https://www.sender.cl/>

---

## Puesta en marcha

```bash
npm ci            # dependencias
npm run dev       # desarrollo en http://localhost:5173
npm run build     # guard + tsc + vite + sitemap + fix-base  ->  dist/
npm run preview   # sirve dist/ en http://localhost:4173
```

`npm run build` necesita Python 3 (genera el sitemap) y Node 20+.

### QA

```bash
npm run qa           # auditoría completa en Chromium real (requiere Playwright)
npm run qa:control   # control positivo: verifica que el auditor de contraste detecta fallos
npm run guard        # control estático: ningún texto animado por opacidad bajo 0.56
npm run serve        # sirve dist/ con índices de directorio, como un hosting real
```

`npm run serve` existe porque `vite preview` resuelve cualquier ruta a
`dist/index.html`, así que no sirve para comprobar el HTML de una ruta
profunda.

`npm run qa` y `npm run qa:control` usan [Playwright](https://playwright.dev).
La primera vez: `npx playwright install chromium`. Ambos esperan un servidor en
`http://127.0.0.1:4173`, o el que se indique con `BASE_URL=... npm run qa`.

El script `build` ejecuta `guard` primero: falla rápido y sin navegador.

---

## Estructura

```
index.html              SEO base, fuentes asíncronas, precarga del póster, JSON-LD
vite.config.ts          base dinámico según VITE_BASE_PATH
public/
  404.html              fallback SPA para GitHub Pages (rutas profundas)
  robots.txt            sitemap.xml
  favicon.svg
  assets/               pósters WebP del hero + sender-hero.mp4
scripts/
  optimize-assets.py    JPG originales -> WebP 640/960/1280 en src/assets/gen/
  build-sitemap.py      sitemap.xml desde el catálogo (25 URLs)
  fix-base.mjs          sustituye __BASE_PATH__ en el HTML de dist/
qa/                     arnés de QA (ver más abajo)
docs/                   auditoría de fase 1 y material de referencia
src/
  content/              capa de contenido: tipos, sitio, catálogo, imágenes, empresa
  data/                 bandas RF y proyectos documentados
  i18n/                 LanguageContext + resolve()
  seo/                  useDocumentMeta + JSON-LD por ruta
  hooks/                Lenis, scroll restore, anclas, hero cinematográfico, reduced motion
  ui/                   primitivas: Reveal, SectionHeading, SignalWave, SkipLink, RouteProgress
  components/           Navbar, Hero, products/ (5 componentes)
  sections/             11 secciones de la home
  pages/                HomePage, CatalogPage, CategoryPage, ProductPage, NotFoundPage
```

---

## Contenido

Todo el texto vive en `src/content/`, con un único árbol `{ es, en }` por campo
(`Loc`) que se resuelve con `resolve()` según el idioma activo. No hay cadenas
literal en los componentes.

**Regla del proyecto:** no se inventa información. Cada dato del sitio proviene
del repositorio o de sender.cl. Lo que no se pudo verificar se retiró en vez de
rellenarse: no hay años de fundación, cifras de clientes, certificaciones ni
testimonios fabricados. Los valores de la sección de automatización están
etiquetados como simulación, y los proyectos citan su fuente.

Los datos de contacto verificados están en `src/content/company.ts`
(`+56 9 8386 4148`, `sender@sender.cl`, Blanco Viel 1108, San Miguel).

### Idiomas

ES por defecto, EN completo. `LanguageContext` fija `<html lang>` y persiste la
elección en `localStorage`. La interfaz nunca mezcla idiomas: el QA lo verifica
buscando textos en español dentro de la vista EN y viceversa.

---

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Home (11 secciones) |
| `/productos` | Catálogo: 7 categorías, 16 productos |
| `/productos/:categorySlug` | Categoría |
| `/producto/:productSlug` | Ficha de producto |
| `/soluciones`, `/soluciones/:slug` | Redirección de compatibilidad a `/productos` |
| `*` | 404 |

`basename` se deriva de `import.meta.env.BASE_URL`, así que el mismo código de
rutas sirve en la raíz de un dominio y bajo `/sender/` en GitHub Pages.

---

## Sistema de diseño

Tailwind v4 en modo CSS-first: los tokens están en `@theme` dentro de
`src/index.css`, no hay `tailwind.config.js`.

**Paleta.** Superficies de negro a grafito (`void #050708` → `steel #2a2f35`),
texto en `paper #ffffff` / `mute #9ba3ab` / `faint #8a949b`, y la marca en
`signal #1E73BE`, `signal-soft #4f9ad8`, `signal-deep #0085B2`.

**Tipografía.** Space Grotesk para display y texto, IBM Plex Mono para datos
técnicos. El contraste buscado es tipográfico: display enorme y compacta contra
mono pequeña y muy espaciada. Ambas se cargan de forma asíncrona con fallbacks
de métrica compatible, así que sin red el sitio se ve correcto.

### Accesibilidad

Reglas que el QA hace cumplir, no solo recomendaciones:

- **El texto nunca se anima por opacidad.** Un fundido desde `opacity: 0` deja el
  contenido por debajo de 4.5:1 durante la transición, y cuando el efecto va
  ligado al scroll ese estado bajo no es transitorio sino el reposo de lo que aún
  no se recorrió. Los revelados usan desplazamiento (`y`/`x`), máscara
  (`RevealLines`) o interpolación de color entre dos tokens que ya cumplen AA.
  `npm run guard` hace fallar el build si vuelve a aparecer.
- **Suelo de opacidad 0.56** para el único fundido de texto que queda
  (`RevealOnScroll`): es el punto donde el blanco sobre tinta llega a 4.5:1.
- Un H1 por ruta, skip link como primer foco, drawer móvil con focus trap,
  `prefers-reduced-motion` respetado en Lenis, hero y revelados, y campos de
  formulario con `label` asociado.

---

## Rendimiento

- **Home en el bundle principal.** `HomePage` se importa de forma síncrona; el
  resto de rutas va con `lazy()`. Con la home diferida el primer pintado mostraba
  un fallback de 60vh y al llegar el chunk la página real (19.800 px) empujaba el
  footer fuera del viewport: CLS 0.40 medido con Lighthouse. El fallback de las
  rutas secundarias reserva 100vh por la misma razón.
- **Imágenes.** Los JPG originales de `src/assets/` se convierten con
  `npm run assets` en WebP de 640/960/1280 y se sirven con `srcset`/`sizes`.
  El vídeo del hero (4.8 MB) no se precarga y en móvil ni se solicita: se sirve
  el póster. Total transferido en móvil: 229 kB.
- **Vídeo.** `useCinematicHero` dirige el vídeo con el scroll sin secuestrarlo
  (el scroll nativo y la barra espaciadora siguen funcionando) y degrada a loop
  o a póster según dispositivo, conexión y `prefers-reduced-motion`.

Lighthouse sobre el build de producción:

| | Perf | A11y | Best Practices | SEO | CLS |
| --- | --- | --- | --- | --- | --- |
| Home desktop | 99 | 100 | 100 | 100 | 0.013 |
| Home móvil | 78 | 100 | 100 | 100 | 0.009 |
| Catálogo móvil | 84 | 98 | 100 | 100 | 0 |
| Ficha desktop | 99 | 100 | 100 | 100 | 0 |

Sin errores de consola en ninguna ruta. El rendimiento móvil está limitado por
el *render delay* propio de una SPA: el H1 no se pinta hasta que React monta.
Se intentó cerrarlo prerrenderizando el HTML en el build; el intento, sus
mediciones y por qué se descartó están en `docs/IMPLEMENTACION.md`.

---

## SEO

`useDocumentMeta` fija por ruta `title`, `description`, canonical, Open Graph y
Twitter. `src/seo/jsonLd.ts` inyecta `Organization` + `WebSite` en el sitio y
`Product`/`BreadcrumbList` en el catálogo, y los retira al cambiar de ruta.
`sitemap.xml` se genera desde el catálogo con `scripts/build-sitemap.py`
(25 URLs) y apunta al dominio propio, no a GitHub Pages.

---

## Despliegue

`.github/workflows/deploy.yml` publica en GitHub Pages solo desde `main` o
disparo manual: `npm ci` → `typecheck` → `build` con `VITE_BASE_PATH: '/sender/'`
→ Pages. La rama de trabajo no despliega.

### El detalle de `__BASE_PATH__`

Vite reemplaza sus variables dentro de los módulos JS, pero **no reescribe los
archivos copiados desde `public/`**. `public/404.html` y el script de precarga
del `index.html` necesitan conocer el base real, así que usan el marcador
`__BASE_PATH__` y `scripts/fix-base.mjs` lo sustituye al final del build. Si se
añade otro HTML a `public/`, puede usar el mismo marcador.

---

## QA

`qa/qa.mjs` levanta Chromium y recorre el sitio real. Comprueba:

- errores de consola, excepciones no capturadas y peticiones fallidas o 4xx
- exactamente un H1 por ruta, y el esperado
- contenido verificable presente en el DOM (datos de contacto, modelos, rangos)
- ausencia de texto no verificado que se retiró a propósito
- cambio ES → EN sin mezclar idiomas, `<html lang>` y persistencia
- `title`, canonical y JSON-LD por ruta; redirects de compatibilidad; 404
- móvil: que no descargue el MP4 y cuánto transfiere
- `prefers-reduced-motion`: que no se descargue el vídeo
- teclado: primer foco en el skip link y que la barra espaciadora scrolle
- contraste WCAG AA en las 12 rutas, recorriendo cada página completa

`qa/contrast.mjs` es el auditor de contraste. Resuelve `oklab()`, que es lo que
Tailwind v4 genera para las utilidades de opacidad (`text-paper/70`), y compone
el fondo efectivo subiendo por el árbol y apilando alfas.

`qa/probe-test.mjs` es el control positivo: inyecta colores ilegibles a
propósito y verifica que el auditor los detecta. Sin esto, un resultado verde no
significaría nada. Cubre 7 casos, incluido texto grande (umbral 3:1) y `oklab()`.

`qa/no-opacity-text.mjs` es el control estático que corre en cada build.
