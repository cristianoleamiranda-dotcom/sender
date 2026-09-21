# Flujo de trabajo: Arena AI + GitHub + Samsung S24

Documento operativo. Describe el proceso completo que se usó para rediseñar y
publicar el sitio SENDER, con los tres actores pedidos: **GitHub y sus
repositorios**, **Arena AI (Agent Mode)** y **el celular Samsung Galaxy S24**.

Sirve para repetir el proceso en cualquier otro sitio del portafolio.

---

## 1. Los tres actores y qué hace cada uno

| Actor | Rol | Qué NO hace |
| --- | --- | --- |
| **Arena AI (Agent Mode)** | Lee el repo, audita, implementa, mide, hace commits atómicos, abre y fusiona PR, vigila el deploy. Tiene un workspace Linux con Node, Python, Playwright e ImageMagick. | No decide el concepto creativo ni aprueba la publicación: eso lo hace la persona. No guarda secretos propios. |
| **GitHub** | Fuente de verdad del código (`cristianoleamiranda-dotcom/sender`), revisión (PR), integración (Actions: `npm ci` → `tsc` → `vite build` → sitemap → fix-base) y publicación (Pages). | No ejecuta pruebas de navegador: no hay Playwright en el workflow de deploy. |
| **Samsung Galaxy S24** | Verificación final en dispositivo real: táctil, scroll, video del hero, peso percibido, WhatsApp/`tel:` y ruteo profundo desde un enlace compartido. | No sustituye la medición automatizada: es la última milla, no el control de calidad. |

Regla que sostuvo todo el proceso: **la persona aprueba, el agente ejecuta y
mide, GitHub decide si se publica.** Si CI está en rojo, no hay publicación por
más que el agente quiera fusionar.

---

## 2. Requisitos previos (una sola vez)

1. Repo en GitHub con `main` como rama por defecto.
2. GitHub Pages activo en **Deploy from a branch** ← rama `gh-pages`, o mejor:
   **GitHub Actions** (es lo que usa este proyecto).
3. Un **PAT de GitHub** con scope `repo` (ver `SEGURIDAD.md` §4 para cómo
   crearlo bien y por cuánto tiempo).
4. Node 20+ y `npm ci` funcionando en local.
5. En el S24: Chrome actualizado y la URL de previsualización a mano.

---

## 3. El flujo, etapa por etapa

```
 ┌──────────────┐   brief    ┌────────────────┐  auditoría  ┌──────────────┐
 │   Persona    │──────────►│   Arena AI     │───────────►│  Repo local  │
 │ (concepto)   │           │ (Agent Mode)   │            │  rama arena/ │
 └──────────────┘           └────────────────┘            └──────┬───────┘
                                                                 │ commits atómicos
                                                                 ▼
 ┌──────────────┐  merge    ┌────────────────┐   PR    ┌──────────────────┐
 │ GitHub Pages │◄──────────│  GitHub Actions │◄────────│  rama en GitHub  │
 │  (sitio vivo)│  deploy   │ ci + build+deploy│        └──────────────────┘
 └──────┬───────┘           └────────────────┘
        │ URL pública
        ▼
 ┌──────────────────────────────────────────────┐
 │ Samsung Galaxy S24: verificación en terreno  │
 │ (si algo falla → vuelve a la etapa de código)│
 └──────────────────────────────────────────────┘
```

### Etapa 1 — Brief y auditoría

La persona pega el brief (concepto, paleta, secciones, restricciones). El agente
**no empieza a escribir código**: primero audita y deja el resultado por escrito.

- Salida: `docs/AUDITORIA-FASE1.md`.
- Qué se audita: rutas, componentes duplicados, hooks reutilizables, peso de
  assets, estado de SEO, accesibilidad, y qué contenido del repo es verificable.
- Regla de contenido que se aplicó y conviene mantener: **nada se inventa**. Cada
  especificación del catálogo trae `sourceUrl` de la ficha pública de sender.cl.

### Etapa 2 — Implementación en rama propia

- Rama: `arena/<id>-sender` (la crea el agente, nunca trabaja sobre `main`).
- Commits **atómicos y con mensaje explicativo**: el mensaje cuenta el *por qué*,
  no el *qué* (`git log` ya muestra el qué).
- Capa de contenido única: `src/content/` con textos `{ es, en }` en el mismo
  sitio. Esto hace estructuralmente imposible mezclar idiomas.

### Etapa 3 — Medición antes de subir

| Qué | Con qué | Umbral de este proyecto |
| --- | --- | --- |
| Funcional + accesibilidad | `npm run qa` (Playwright) | verde, sin excepciones |
| Rutas profundas con base de Pages | `npm run qa:pages` | verde |
| Rendimiento | Lighthouse CLI sobre `vite preview` | móvil ≥ 78, desktop ≥ 95 |
| Contraste | `qa/contrast.mjs` | WCAG AA en todo texto |

**Lección cara de este proyecto:** todo el QA corría con base `/`, así que el
bug de rutas profundas de Pages (todas caían en la home) pasó desapercibido hasta
verificar el sitio ya publicado. De ahí nace `qa:pages`. Regla: *lo que depende
del base se prueba con el base puesto.*

### Etapa 4 — Push, PR y revisión

```bash
git push -u origin arena/<id>-sender
gh pr create --base main        # o por API con el PAT
```

Antes de fusionar se revisa:
- `mergeable_state: clean`.
- Estado de los check-runs. Si un workflow ajeno al cambio está roto (pasó con
  Datadog Synthetics, que fallaba por falta de secrets desde antes), se arregla
  o se desactiva en un commit aparte y explícito —nunca se fusiona con rojo
  "porque ya estaba rojo".

### Etapa 5 — CI y publicación

`npm ci` → `tsc -b` → `vite build` con `VITE_BASE_PATH=/sender/` → sitemap →
fix-base → upload a Pages. Dos trampas documentadas en `docs/IMPLEMENTACION.md`:

1. `npm ci` es más estricto que `npm install`: si se edita `package.json` a mano
   sin regenerar el lock, CI se rompe y local no. Regenerar siempre con
   `npm install --package-lock-only` y probar `npm ci`.
2. El contexto `env` en `jobs.<id>.if` no es fiable y puede romper el parseo del
   workflow completo (el run falla sin crear jobs).

### Etapa 6 — Verificación en el Samsung Galaxy S24

Aquí el celular entra de verdad. Dos modalidades:

**A. Emulación fiel del S24 (lo que puede hacer el agente).** Perfil medido y
usado en este proyecto:

| Parámetro | Valor |
| --- | --- |
| Viewport CSS | **360 × 780 px** |
| Device pixel ratio | **3** |
| Resolución física | 1080 × 2340 px, 6.2" Dynamic AMOLED 2X, 120 Hz (1–120 LTPO) |
| Chip | Exynos 2400 (internacional) / Snapdragon 8 Gen 3 (EE.UU., China) |
| User-Agent | `Mozilla/5.0 (Linux; Android 16; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36` |

Fuentes: [Wikipedia — Samsung Galaxy S24](https://en.wikipedia.org/wiki/Samsung_Galaxy_S24) y
[webmobilefirst — viewport CSS del S24](https://www.webmobilefirst.com/en/devices/samsung-galaxy-s24-2024/).

Ojo con el detalle que casi se pasa por alto: el viewport del S24 es **360 px**,
no 390–412 px como los perfiles genéricos de Lighthouse y DevTools. Probar a 360
px es más exigente y es lo que ve el usuario real.

**B. Dispositivo físico (lo que solo puede hacer la persona).** Lista de chequeo:

- [ ] Home: el video del hero arranca, se ve el póster antes y no hay salto (CLS).
- [ ] Scroll con Lenis: se siente suave, no "resbaloso"; la barra espaciadora y el
      scroll nativo siguen funcionando.
- [ ] Menú móvil: abre, cierra, atrapa el foco, y el fondo no hace scroll detrás.
- [ ] Cambio ES/EN: no queda ni una palabra mezclada; la preferencia persiste al
      recargar.
- [ ] Enlace profundo compartido por WhatsApp (`/sender/producto/serie-sender-ss/`):
      **debe abrir la ficha, no la home**. Este era exactamente el bug detectado.
- [ ] Botón WhatsApp y `tel:+56983864148`: abren la app correcta.
- [ ] Formularios: el teclado no tapa el campo enfocado.
- [ ] Con datos móviles (no Wi-Fi): la home es usable antes de 4 s.
- [ ] Brillo bajo y modo oscuro del sistema: el texto sigue legible.
- [ ] Lector de pantalla (TalkBack): los encabezados tienen sentido en orden.

### Etapa 7 — Cierre

- Deploy en verde + rutas profundas verificadas en vivo.
- Documentación actualizada en el mismo PR que el código (no después).
- **Rotación del PAT** si se usó en línea de comandos. Ver `SEGURIDAD.md`.

---

## 4. ¿Integrar el token desde el inicio hace el proceso más eficiente?

Sí, y la diferencia es grande — pero "integrar" no significa "pegarlo en el chat".

**Lo que pasó en este proyecto (token a mitad de camino).** El agente trabajó
todas las fases sin credenciales. Cuando llegó la hora de publicar, hizo falta el
PAT; se usó en línea de comandos y en llamadas a la API; y al final del proceso
el token dejó de servir (`Bad credentials`), con el arreglo de rutas commiteado
pero sin poder subirse. Costo real: dos intentos de push fallidos, una
verificación que no se pudo completar en vivo y una interrupción para pedir
credenciales nuevas.

**Lo que cambia si el token está desde el inicio:**

| Aspecto | Sin token al inicio | Con token integrado bien |
| --- | --- | --- |
| Publicación | Se detiene el flujo a pedir credenciales | Continua |
| Comprobaciones en vivo | Se postergan | Se hacen en cada etapa |
| Exposición del secreto | Alta (se tipea en el chat, queda en el historial) | Baja (viaja como variable de entorno) |
| Trazabilidad | Commits sin autoría verificable | Igual, pero con PR y checks asociados |

**La forma correcta de integrarlo** (esto es lo que de verdad da eficiencia, no el
simple hecho de tenerlo antes):

1. Crear un **fine-grained PAT** limitado a UN repositorio, con permisos
   `Contents: Read and write` y `Pull requests: Read and write`, y expiración
   corta (7–30 días). Nada de tokens clásicos con scope `repo` global.
2. Entregarlo como **variable de entorno del workspace**, no como texto en el
   chat. Así no queda en el historial de la conversación ni en los mensajes de
   commit.
3. Para CI, **no usar PAT**: usar `GITHUB_TOKEN` del propio workflow, que ya está
   en `.github/workflows/deploy.yml` y no caduca ni se filtra.
4. Rotarlo al terminar, siempre.

En una frase: **token sí, desde el inicio, pero como variable de entorno y de
alcance mínimo.** Pegarlo en el chat es lo único que no mejora nada: solo añade
riesgo.

---

## 5. Comandos de referencia

```bash
# desarrollo
npm run dev

# calidad
npm run qa              # funcional + a11y, base "/"
npm run qa:pages        # rutas profundas con base "/sender/"
npm run qa:all
npm run qa:control      # sonda: verifica que el arnés DETECTA un fallo

# build y servir
npm run build                                   # base "/"
VITE_BASE_PATH=/sender/ npm run build            # base de Pages
npm run serve                                   # servir dist/
VITE_BASE_PATH=/sender/ PORT=4321 npm run serve  # servir dist/ bajo /sender/

# exportación
npm run export:wordpress                        # ver wordpress-export/LEEME.md
npm run export:wordpress -- --sitio=https://www.sender.cl
```

---

## 6. Errores que ya están pagados (no repetirlos)

| Error | Síntoma | Regla |
| --- | --- | --- |
| QA solo con base `/` | Rutas profundas publicadas caían en la home | Probar con el base real de producción |
| `replaceState` después de crear el router | La URL se veía bien pero el contenido era la home | La URL debe estar repuesta **antes** de que el router lea `location` (por eso `src/restorePagesPath.ts` es el primer import) |
| Editar `package.json` a mano | `npm ci` rojo en CI, verde en local | `npm install --package-lock-only` + probar `npm ci` |
| `env` en `jobs.<id>.if` | El workflow fallaba sin crear ningún job | No usar contextos no garantizados en condiciones de job |
| Prerender + `createRoot` | Empeoraba el móvil en vez de mejorarlo | SPA plana; el camino a prerender real es el modo framework de React Router |
| Token en el chat | `Bad credentials` al final del proceso | Variable de entorno + fine-grained + rotación |
