# Análisis de los repositorios freellmapi y scroll-craft

**Alcance:** solo explicativo. No se modificó nada en ninguno de los dos
proyectos, ni en el sitio SENDER. Todo lo que sigue se obtuvo leyendo la API
pública de GitHub y los archivos publicados, el 2026-09-20.

---

## 0. Resumen

| | freellmapi | scroll-craft |
| --- | --- | --- |
| Qué es | Fork de `tashfeenahmed/freellmapi`: router OpenAI-compatible que agrega capas gratuitas de 34 proveedores | Sitio estático de una sola página, marca **OLEA Broadcast** |
| Origen | **Fork** (`fork: true`, padre `tashfeenahmed/freellmapi`) | **Original** (`fork: false`) |
| Licencia | MIT | MIT |
| Lenguaje principal | TypeScript (monorepo: `server`, `client`, `cli`, `shared`, `desktop`) | CSS + HTML + JS vainilla |
| Archivos | 1.049 | 24 |
| Creado / último push | 2026-09-17 / 2026-09-17 | 2026-09-15 / 2026-09-16 |
| Publicado en | freellmapi.co (dominio del proyecto original) | GitHub Pages, **vivo** (HTTP 200) |
| CI | 4 workflows heredados; los badges del README apuntan al repo original | Workflow de Jekyll por defecto |
| Riesgo principal | Confusión fork/upstream y peso del repo | **Datos de contacto falsos publicados en un sitio vivo** |

Prioridad si solo se hace una cosa de esta lista: **corregir los datos de
contacto de scroll-craft**. Es el único hallazgo con impacto inmediato sobre
terceros.

---

## 1. freellmapi

### 1.1 Qué es y por qué está bien

Un router que unifica capas gratuitas de muchos proveedores LLM detrás de un
solo endpoint `/v1` compatible con OpenAI, con enrutamiento inteligente,
failover cuando un proveedor limita la tasa, y control de uso por clave. La
descripción del repo habla de 7.400 millones de tokens al mes, 34 proveedores y
635 endpoints gratuitos.

Lo valioso del proyecto original, visible en el árbol:

- **Monorepo con workspaces** (`server`, `client`, `cli`, `shared`, `desktop`) y
  scripts de build, test y migraciones bien separados.
- **Migraciones de base de datos versionadas** en `server/src/db/migrations/`,
  incluida una línea base legada de 130 kB. Es la marca de un proyecto que piensa
  en evolución, no solo en funcionamiento.
- **Internacionalización seria**: más de 30 locales completos (`my`, `ta`, `ml`,
  `ka`, `kn`, `te`, `ne`, `or`, `km`, `hi`, `bn`, `th`, `si`, `pa`, `mr`, `gu`,
  `el`, `ru`, `uk`, `bg`, `sr`, `ur`, `fa`…), con README en inglés y chino.
- **Cuatro workflows de CI/CD**: `ci.yml`, `cli-release.yml`,
  `desktop-release.yml`, `docker.yml`, más `dependabot.yml`.
- **Distribución multicanal**: Docker en ghcr.io, escritorio (Electron, con
  `.icns`), Play Store y App Store.
- Catálogo de modelos que se **autoactualiza desde un feed firmado**, de modo que
  los cambios de cuotas y modelos nuevos llegan sin `git pull`. Detalle de diseño
  poco común y bien resuelto.

### 1.2 Hallazgos

**a) Es un fork y el README sigue apuntando al original.**
Los badges de CI, estrellas, contenedor Docker y DeepWiki, además de todos los
enlaces de descarga, llevan a `tashfeenahmed/freellmapi`. Consecuencias: el badge
de CI del fork no refleja el estado del fork; los enlaces de descarga llevan a las
releases del original; y quien llegue al repo no distingue de inmediato si es un
espejo, una copia de trabajo o una variante con cambios propios.

**b) Los workflows de release heredan rutas del original.**
`cli-release.yml`, `desktop-release.yml` y `docker.yml` están pensados para
publicar artefactos del proyecto original. En un fork, o fallan (por permisos o
por secrets ausentes) o, peor, intentarían publicar bajo nombres del original. Es
el mismo patrón que se encontró en SENDER con el workflow de Datadog Synthetics:
plantilla heredada que falla en cada push porque nadie configuró sus secretos.

**c) El repo pesa mucho para lo que entrega.**
13,4 MB declarados, de los cuales **3,8 MB son `repo-assets/`** (diez PNG de
entre 186 kB y 757 kB para el README) y hay tres `package-lock.json` (raíz 476 kB,
`desktop` 254 kB). Git conserva todo para siempre: esos binarios ya no se pueden
sacar sin reescribir historia.

**d) No hay rama de trabajo propia visible.**
Único push el mismo día de la creación. Si el fork existe para experimentar, está
bien; si existe para sostener algo propio, le falta una rama de desarrollo y un
registro de qué se cambió respecto del original.

**e) Aviso legal del propio proyecto: "Personal experimentation only".**
Agrega capas gratuitas de terceros. Si se llega a usar para algo productivo, hay
que leer los términos de cada proveedor: varios prohíben explícitamente la
reventa o el uso comercial del free tier.

### 1.3 Qué haría, en orden

1. **Definir para qué existe el fork** y escribirlo en las dos primeras líneas del
   README: "copia de trabajo personal del proyecto de @tashfeenahmed, sin
   cambios" o "variante con X e Y modificados". Esto resuelve (a) y (d) de un
   golpe y es gratis.
2. **Mantener la atribución explícita**: enlace al repo original y nota de que la
   licencia es MIT del autor original. Ya está la licencia; falta el enlace
   visible. MIT lo permite, pero la atribución es lo correcto además de lo legal.
3. **Desactivar los workflows de release en el fork** (`cli-release`,
   `desktop-release`, `docker`) o ponerlos en `workflow_dispatch`. Dejar solo `ci`
   si interesa correr pruebas. Es exactamente la corrección que se aplicó en
   SENDER a Datadog: lo que no se puede ejecutar, no debe ejecutarse en cada push.
4. **Sincronizar con el original de forma explícita** (`git remote add upstream`
   + `git fetch upstream`) y anotar la fecha del último sincronismo. Un fork sin
   política de sincronismo deriva en silencio.
5. **Si el fork se vuelve propio:** mover las imágenes del README a un CDN o
   comprimirlas a WebP (los 3,8 MB de PNG bajarían a ~400 kB, mismo resultado
   visual) y considerar Git LFS o un release adjunto para binarios. Para el
   `desktop/package-lock.json`, evaluar si `desktop` debería ser un workspace más
   en vez de tener su propio árbol de dependencias.
6. **Registrar el límite de uso.** Si la idea es apoyarse en esto para el proyecto
   social (que es gratuito y por tanto sensible al costo), conviene un archivo
   `docs/proveedores.md` con: proveedor, modelo, cuota mensual, prohibiciones
   comerciales y fecha de verificación. Sin eso, el día que un proveedor cambie
   sus términos no hay cómo saber qué se rompió.

---

## 2. scroll-craft

### 2.1 Qué es y por qué está bien

Un sitio de una página para **OLEA Broadcast** ("Ingeniería que se escucha",
ingeniería transmisora desde 1987), empaquetado como *agent skill* para construir
sitios inmersivos con scroll. Está publicado y vivo en GitHub Pages.

Lo destacable, y es más de lo que parece a primera vista:

- **Cero dependencias de runtime.** No hay GSAP ni Lenis ni Three ni ningún CDN de
  JS: `app.js` (26 kB) trabaja con `IntersectionObserver` (4 usos), `scrollY`
  (4), `touchstart` (2). El único `<script>` externo es un `@import` de Google
  Fonts dentro de un bloque `<style>`, con comentario explícito de fuente de
  respaldo. Para un sitio "premium scroll-driven", lograrlo sin librerías es una
  decisión técnica sólida y poco común.
- **Degradación pensada.** Hay un preloader con temporizador de 3 segundos que
  revela el contenido **aunque `app.js` falle**, con transiciones CSS de respaldo
  para el hero y los `.reveal`. Es exactamente el tipo de red de seguridad que
  suele faltar en sitios de este estilo.
- **Accesibilidad de base presente:** `lang="es"`, `viewport-fit=cover`,
  `aria-hidden` en el preloader, y restauración de `body.style.overflow`.
- **SEO mínimo correcto:** `<title>` y `meta description` específicos y en
  español.
- **Peso total razonable:** ~910 kB con imágenes (17 JPG de catálogo y proyecto,
  23–39 kB cada uno).

### 2.2 Hallazgos

**a) El sitio publicado tiene datos de contacto falsos. Es lo más urgente.**
En el sitio vivo aparecen:

| Dato publicado | Problema |
| --- | --- |
| `+56 2 2234 5678` | Número con patrón de relleno (`234 5678`) |
| `+56 41 234 8900` | Ídem |
| `wa.me/56912345678` | WhatsApp de relleno: el enlace **abre un chat con un número que no es de la empresa** |
| `contacto@oleabroadcast.cl` | Sin verificar; si el dominio no existe, el correo rebota |
| `tucorreo@radio.cl` | **Texto de marcador de posición literal** ("tucorreo") visible en la página |

Un visitante real que pinche el botón de WhatsApp escribe a un desconocido. Esto
no es un detalle cosmético: es un canal de contacto roto publicado en internet, y
además puede derivar mensajes a quien sea dueño de ese número.

**b) El nombre del repo no describe el contenido.**
`scroll-craft` se anuncia como "an agent skill for building premium, immersive,
scroll-driven websites", pero en el árbol **no hay ningún `SKILL.md`, ni prompts,
ni instrucciones para agentes**: hay un sitio concreto de una marca concreta. El
README completo son dos líneas. Quien busque la skill no la encuentra; quien
encuentre el sitio no sabe que pretendía ser una skill.

**c) Un binario de 325 kB commiteado en git.**
`scroll-craft.zip` pesa casi tanto como todo el sitio (HTML+CSS+JS suman 74 kB).
Un ZIP del propio repo dentro del repo es redundante —GitHub ya entrega ZIP de
cualquier commit— y queda en la historia para siempre.

**d) Las imágenes son JPG donde el sitio SENDER ya resolvió WebP.**
17 imágenes por ~500 kB. Las mismas imágenes en WebP a calidad equivalente
quedarían en torno a la mitad. En un sitio cuyo argumento es la experiencia
premium, el peso de la primera carga se nota.

**e) El workflow es la plantilla por defecto de Jekyll.**
`jekyll-gh-pages.yml` corre `actions/jekyll-build-pages` sobre un sitio que no es
Jekyll (no hay `_config.yml` ni front matter). Funciona porque Jekyll en modo
básico copia los archivos, pero es un paso de build que no construye nada: añade
tiempo y superficie de fallo sin aportar.

**f) Fuente externa con bloqueo de render.**
El `@import` de Google Fonts dentro de `<style>` es la forma más lenta de cargar
tipografías: bloquea el CSS hasta resolver la petición. Con `preconnect` +
`<link rel="stylesheet">`, o mejor aún fuentes autoalojadas en `woff2`, se gana
tiempo de primer render. El comentario de respaldo muestra que el riesgo ya se
identificó; falta dar el paso.

**g) Marca y propiedad.**
OLEA Broadcast aparece como marca con "desde 1987", pero el repositorio no dice si
es un cliente real, un proyecto propio o una pieza de demostración. Si es
demostración, debería decirlo en la primera pantalla; si es real, los datos de
contacto de (a) son un error de producción.

### 2.3 Qué haría, en orden

1. **Datos de contacto reales o sitio en modo demostración.** Dos salidas válidas:
   poner teléfono, correo y `wa.me` verdaderos, o añadir una banda visible que
   diga "Sitio de demostración — los datos de contacto son ficticios" y desactivar
   los enlaces `wa.me`/`tel:`. Lo que no puede quedar es como está.
2. **Alinear nombre, README y contenido.** Si la intención es que sea una skill
   reutilizable: extraer el patrón a un `SKILL.md` con las instrucciones para el
   agente (estructura de secciones, sistema de reveal, reglas de degradación) y
   dejar el sitio OLEA como ejemplo en `examples/`. Si la intención es que sea el
   sitio OLEA: renombrar el repo a `olea-broadcast` y escribir un README de sitio.
   Cualquiera de las dos sirve; la ambigüedad actual no.
3. **Borrar `scroll-craft.zip`** del árbol y añadir `*.zip` al `.gitignore`.
   (Borrarlo del historial exigiría reescribirlo; no vale la pena por 325 kB, pero
   que no crezca.)
4. **Convertir las 17 imágenes a WebP** con variantes 640/960/1280, igual que en
   SENDER. El script `scripts/optimize-assets.py` de SENDER hace exactamente esto y
   es reusable tal cual: es el mismo problema ya resuelto.
5. **Sustituir el workflow de Jekyll por uno de subida directa** con
   `actions/upload-pages-artifact` sobre la raíz, sin paso de build. Menos tiempo,
   menos puntos de fallo.
6. **Tipografías con `preconnect` y `display=swap`**, o autoalojadas en `woff2`
   subset. Cuatro familias tipográficas (Cormorant Garamond, Inter, JetBrains Mono,
   Instrument Serif) es mucho para un sitio de una página: con dos alcanza y se
   gana medio segundo.
7. **Añadir las piezas que a un sitio B2B le faltan** y que SENDER sí tiene:
   `sitemap.xml`, `robots.txt`, `favicon.svg`, JSON-LD (`Organization` +
   `LocalBusiness`), `og:image` y canonical. Hoy no aparece ninguna.

---

## 3. Lectura conjunta: qué tienen estos repos que le sirve a lo demás

Hay tres activos aprovechables, y conviene nombrarlos porque están dispersos:

**El sistema de scroll de scroll-craft, sin dependencias.** Es el mismo problema
que SENDER resuelve con Lenis + Motion. La versión sin librerías de scroll-craft
(`IntersectionObserver` + `requestAnimationFrame` implícito en el scroll) pesa
26 kB contra el costo de dos dependencias, y degrada mejor en móviles lentos. No
se trata de reescribir SENDER —su Lenis está bien afinado y documentado— sino de
guardar el patrón de scroll-craft como referencia para el proyecto social, donde
cada kilo byte cuenta porque el público puede estar en datos móviles.

**El router de LLM de freellmapi, como infraestructura de costo cero.** Un
proyecto social y gratuito no puede sostener una cuenta de API de pago. Un router
con failover sobre capas gratuitas es exactamente la pieza que falta, con una
advertencia grande: hay que leer los términos de cada proveedor y el propio repo
dice "personal experimentation only". Si se usa, se usa sabiendo que puede dejar
de funcionar cualquier día y que el diseño debe tolerarlo (degradación a
funcionalidad sin IA, no a sitio caído).

**El exportador de contenido de SENDER, como patrón.** `src/content/` con textos
`{ es, en }` entrelazados y `resolve()` hace imposible mezclar idiomas. Ese mismo
patrón sirve para el proyecto social, que probablemente necesite ES/EN y quizá
más idiomas.

### Lo que falta en los tres

Ninguno de los dos repos tiene pruebas. SENDER sí (arnés QA con Playwright, sonda
de control, verificación de rutas con base de Pages). Es la diferencia más
relevante entre los tres proyectos, y es la razón por la que el bug de rutas
profundas de SENDER se encontró y se pudo corregir con evidencia en vez de con
suposiciones.

---

## 4. Plan sugerido si se decide actuar (nada de esto está hecho)

| Prioridad | Acción | Repo | Esfuerzo | Impacto |
| --- | --- | --- | --- | --- |
| 1 | Corregir o marcar como demostración los datos de contacto | scroll-craft | 15 min | Alto: canal roto en producción |
| 2 | README que diga qué es el fork y enlace al original | freellmapi | 10 min | Alto: evita malentendidos |
| 3 | Desactivar workflows de release en el fork | freellmapi | 10 min | Medio: elimina fallos recurrentes |
| 4 | Alinear nombre/README/contenido de la skill | scroll-craft | 1 h | Medio |
| 5 | Imágenes a WebP con el script de SENDER | scroll-craft | 30 min | Medio: ~50 % menos peso |
| 6 | SEO básico (sitemap, robots, JSON-LD, favicon, og) | scroll-craft | 1 h | Medio |
| 7 | Quitar el ZIP y simplificar el workflow de Pages | scroll-craft | 15 min | Bajo |
| 8 | Documento de proveedores y cuotas del router | freellmapi | 2 h | Bajo hoy, alto si se usa en el proyecto social |

---

## 5. Cómo se obtuvo esta información

Todo por lectura, sin autenticación y sin escribir en ninguno de los dos repos:

- API de GitHub: metadatos del repo (`fork`, `parent`, licencia, tamaño, fechas),
  árbol completo recursivo y últimos commits.
- `raw.githubusercontent.com`: `README.md`, `package.json`, `index.html`, `app.js`
  y el workflow de Pages.
- `curl -I` sobre los sitios publicados para confirmar que están vivos.

Ninguna credencial fue necesaria. Es un buen recordatorio de que casi todo el
análisis de un repo público se puede hacer de forma anónima, y de que solo hace
falta un token cuando se va a **escribir**.
