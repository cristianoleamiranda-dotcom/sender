# Notas de implementación

Complemento del `README.md`. Aquí van las decisiones que no son obvias leyendo el
código, el resultado de las verificaciones y lo que queda abierto.

Rama de trabajo: `arena/01a0afb6-sender`. Auditoría de partida:
[`AUDITORIA-FASE1.md`](./AUDITORIA-FASE1.md).

---

## Decisiones

### La home no se difiere

`React.lazy()` sobre `HomePage` partía el sitio en dos y dejaba el código de la
ruta de entrada fuera del bundle principal. El coste no era teórico: el primer
pintado mostraba el fallback de 60vh y, al llegar el chunk, la página real
(19.800 px de alto) empujaba el footer 18.600 px hacia abajo. Lighthouse lo medía
como **CLS 0.40** en todas las rutas, home incluida.

La home se importa ahora de forma síncrona (60 kB sin comprimir sobre un bundle
principal de 324 kB) y el code splitting queda para catálogo, categoría, ficha y
404. El fallback de esas rutas reserva `min-h-screen` por la misma razón: en una
carga directa el usuario está arriba, así que si el interino ocupa el viewport
completo el footer queda fuera de pantalla y el salto deja de ser visible.

Resultado: CLS 0.013 en home desktop, 0.009 en móvil, 0 en catálogo y ficha.

### El texto no se anima por opacidad

Un fundido desde `opacity: 0` deja el texto por debajo de 4.5:1 durante toda la
transición. Y cuando el efecto va ligado al scroll, como en las etapas de
*La Señal*, ese estado bajo **no es transitorio**: es el reposo permanente de las
etapas que el usuario todavía no recorrió. Con un suelo de 0.3 el nombre de la
etapa medía 2.58:1 y su descripción 1.94:1.

La regla del sistema es que el texto entra por desplazamiento (`y`/`x`), por
máscara (`RevealLines`, que recorta con `overflow-hidden` y no toca el color) o
por interpolación entre dos tokens que ya cumplen AA. Los casos concretos:

| Antes | Ahora |
| --- | --- |
| `Reveal`: `{ opacity: 0, y }` → `{ opacity: 1, y: 0 }` | `{ y }` → `{ y: 0 }` |
| Etapas de `Signal`: `opacity` 0.3 → 1 ligado al scroll | `color` `#9ba3ab` → `#ffffff` y `#8a949b` → `#c7ced3` |
| Título fantasma de `Reasons`: `opacity` 0.15 → 1 (1.3:1) | `color` `#6f787e` → `#e4e8eb` |
| `RevealOnScroll`: `opacity` 0.14 → 1 | 0.56 → 1 (0.56 es el punto donde el blanco sobre tinta llega a 4.5:1) |
| Cifra gigante de `Experience`: `opacity` 0 → 1 | solo `y` |

Las capas que sí funden por opacidad no contienen texto y están marcadas con
`aria-hidden`: la cortina de `RevealImage`, la vista previa que sigue al puntero
en `Solutions`, el cruce de imágenes del visor de proyectos y los trazos SVG del
diagrama de ingeniería. Están listadas como excepciones justificadas en
`qa/no-opacity-text.mjs`.

### Tokens de color corregidos por contraste

- `--color-faint` pasó de `#61696f` (3.57:1 sobre `ink`) a `#8a949b` (6.96:1).
- El texto pequeño de marca usa `--color-signal-soft` `#4f9ad8` (6.59:1) en lugar
  de `--color-signal` `#1E73BE` (4.03:1). `signal` queda para superficies,
  bordes y texto grande, donde el mínimo es 3:1.
- Sobre fotografía, donde el fondo no es uniforme, el texto va a `/80` o más.
- El contador de categorías y los chips activos del explorador iban en
  `text-paper/70` sobre `bg-signal` (3.26:1): ahora van opacos (8:1).

### `base` absoluto, no relativo

`base: "./"` rompe las rutas profundas. En `/producto/x` el navegador resuelve
las URL relativas contra `/producto/`, así que `<script src="./assets/index.js">`
apunta a `/producto/assets/index.js`. El valor por defecto es `/` y GitHub Pages
fija `VITE_BASE_PATH=/sender/`.

### `__BASE_PATH__` y los archivos de `public/`

Vite reemplaza sus variables en los módulos JS (`import.meta.env.BASE_URL`), pero
no reescribe el contenido de los archivos copiados desde `public/`.
`public/404.html` y el script de precarga del póster necesitan el base real, así
que usan el marcador `__BASE_PATH__` y `scripts/fix-base.mjs` lo sustituye al
final del build. Verificado: no queda ningún marcador sin sustituir en `dist/`.

### El vídeo del hero no secuestra el scroll

El `useVideoScrub.ts` original ataba el scroll al fotograma del vídeo y anulaba
el desplazamiento nativo: sin teclado, sin barra espaciadora, sin forma de salir
de la sección. Se eliminó y se reemplazó por `useCinematicHero.ts`, que dirige el
vídeo con el progreso del scroll pero deja el scroll en manos del navegador y de
Lenis.

Degradación: en móvil no se solicita el MP4 (229 kB transferidos en total), con
`prefers-reduced-motion` tampoco, y si el dispositivo o la conexión no acompañan
se cae a loop o a póster estático. `navigator.connection` no es estándar, así que
se declara una interfaz `NetworkInfo` local y se consulta de forma defensiva.

### Contenido

Un único árbol `{ es, en }` por campo (`Loc` en `src/content/types.ts`) que se
resuelve con `resolve()` genérico. La alternativa anterior —clonar el árbol ES y
traducir encima— dejaba el inglés poblado de español y no era verificable.

No se inventó nada. Lo que no se pudo verificar contra el repositorio o
sender.cl se retiró: sin año de fundación, sin cifra de clientes, sin
certificaciones, sin testimonios. Los valores de la sección de automatización van
etiquetados como simulación y los proyectos citan su fuente (Radio World, Armada
de Chile, Isla de Pascua). Los nombres de producto, modelos, rangos de frecuencia
y tolerancias salen de las fichas reales.

---

## Verificación

### Lighthouse (build de producción, `vite preview` en :4173)

| Ruta | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | Peso |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` desktop | 99 | 100 | 100 | 100 | 0.7 s | 0.8 s | 20 ms | 0.013 | 305 KiB |
| `/` móvil | 78 | 100 | 100 | 100 | 3.0 s | 3.3 s | 360 ms | 0.009 | 307 KiB |
| `/productos` móvil | 84 | 98 | 100 | 100 | 3.2 s | 3.5 s | 70 ms | 0 | 390 KiB |
| `/producto/serie-sender-ss` desktop | 99 | 100 | 100 | 100 | 0.7 s | 0.8 s | 30 ms | 0 | 427 KiB |

Sin errores de consola en ninguna ruta (antes: 404 de `/favicon.ico`).

### QA en Chromium (`npm run qa`)

0 errores de consola, 0 excepciones, 0 peticiones fallidas, 0 respuestas 4xx.
Un H1 por ruta y el esperado. Lenis activo. Móvil sin descargar el MP4.
Reduced motion respetado. Primer foco en el skip link. La barra espaciadora
scrolle. Formulario con `label` en todos los campos. Contraste AA en las 12
rutas recorridas de arriba abajo.

### Por qué hicieron falta tres capas de verificación

El auditor de contraste en navegador mide el DOM **en reposo**, con las
animaciones ya terminadas, así que los fundidos le pasaban desapercibidos y
daba verde mientras Lighthouse contaba 52 elementos ilegibles. Y el primer
auditor no entendía `oklab()`, que es lo que Tailwind v4 genera para
`text-paper/70`, así que resolvía el color a negro y daba falsos positivos.

De ahí las tres capas, cada una con su control:

1. `qa/contrast.mjs` — contraste en reposo, en las 12 rutas, con conversión
   propia de `oklab()` a sRGB y composición de fondos alfa apilados.
2. `qa/probe-test.mjs` — **control positivo**: inyecta colores ilegibles a
   propósito y exige que el auditor los detecte. 7 casos, incluido texto grande
   (umbral 3:1) y `oklab()`. Si esto falla, el verde de la capa 1 no vale nada.
3. `qa/no-opacity-text.mjs` — **control estático** en cada build: ninguna
   animación de opacidad por debajo de 0.56 sobre texto. Verificado con una
   violación deliberada (la detecta y sale con código 1).

---

## El render delay móvil: prerender intentado y descartado

El 86 % del LCP móvil es *render delay*: al ser una SPA, el H1 no se pinta hasta
que React monta. Desktop no lo sufre porque la CPU no va estrangulada.

Se implementó el prerender completo y se midió. **Se descartó.** Conviene dejar
escrito por qué, para no repetirlo.

### Lo que se hizo

`scripts/prerender.mjs` levantaba un servidor estático sobre `dist/`, recorría
las 25 rutas del sitemap en Chromium y guardaba el DOM resultante dentro del
HTML de cada ruta. Llegó a funcionar: 25/25 rutas con HTML estático, H1 correcto
y contenido real sin ejecutar JavaScript.

### Por qué no se quedó

El obstáculo es la hidratación. `hydrateRoot` exige que el HTML capturado y el
primer render del cliente coincidan **nodo a nodo**, y en este sitio eso no es
estable. Se fueron encontrando y corrigiendo causas, una detrás de otra:

1. El límite `<Suspense>` del router. React lo delimita con comentarios
   `<!--$-->` / `<!--/$-->` que pone el renderizador de servidor; `innerHTML` no
   los incluye, así que React no encontraba el límite y abortaba. Se inyectaron a
   mano.
2. El texto partido en varios nodos por mezclar literales y expresiones
   (`{a} · {b}`, `{texto} ↗`). Se fusionaron a template literal en seis sitios.
   Esas fusiones **sí se conservaron**: son correctas con o sin prerender.
3. El panel de Automatización, que es un reloj de 140 ms. Se congeló durante la
   captura con un flag `?prerender`.
4. Los revelados: la captura guardaba el estado *final* de las animaciones del
   primer pliegue (`transform: none`) mientras el cliente arranca en el inicial
   (`translateY(28px)`). Se añadió `revealOnView()` para capturar el estado
   inicial.

Tras todo eso el desajuste quedó reducido a un único nodo, y localizarlo exige
congelar la página con el depurador de V8 justo antes de hidratar, que es frágil
de automatizar. Y el fallo es silencioso: React regenera el árbol y deja un aviso
en consola, así que puede volver a romperse con cualquier sección nueva sin que
nadie se entere.

Medido además el efecto de la alternativa sin hidratación (`createRoot` sobre el
HTML prerrenderizado, que no puede desajustarse): **PERF móvil cayó de 78 a 53**
y el FCP de 3.0 s a 5.3 s. El navegador parsea y pinta 134 kB de HTML y 1.288
elementos para que React los descarte y los vuelva a construir. Es coste puro.

### Conclusión

Prerender e hidratación van juntos: sin hidratación el prerender resta, y con
hidratación hace falta que el mismo renderizador produzca ambos lados. El camino
correcto es el **modo framework de React Router** (antiguo Remix), que tiene
`prerender` y usa un único renderizador en el build y en el cliente. Es un cambio
de arquitectura —`vite.config.ts` pasa a configurar el plugin de RR y el router
deja de crearse a mano— y por eso se dejó fuera: la instrucción del proyecto era
trabajar sobre la arquitectura existente.

Nota sobre el SEO: la decisión no deja el sitio sin indexar. Googlebot ejecuta
JavaScript, y el sitio ya sirve `title`, `description`, canonical, Open Graph y
JSON-LD por ruta, más `sitemap.xml` con las 25 URLs. Lo que no tiene es contenido
para un rastreador que no ejecute JS.

Las cifras del estado final están en la tabla de la sección «Verificación».

---

## Limpieza

Se eliminaron de la raíz diez JPG que eran duplicados byte a byte de
`src/assets/`, que es de donde lee `scripts/optimize-assets.py`. Los prompts de
autor y el diagrama se movieron a `docs/`, y los dos generadores de vídeo a
`scripts/`.
