# Inventario de la información recolectada

Todo lo que se levantó durante el rediseño y la publicación del sitio SENDER,
dónde está y qué estado tiene. Pensado para poder cerrar la sesión y retomar el
trabajo sin perder nada.

Fecha: **2026-09-20**.

---

## 1. Documentos (esta carpeta)

| Archivo | Contenido |
| --- | --- |
| `LEEME.md` | Índice y cómo usar esta carpeta |
| `FLUJO-DE-TRABAJO.md` | El proceso completo: Arena AI + GitHub + Samsung S24, etapa por etapa, con la respuesta sobre el token |
| `SEGURIDAD.md` | Estado del token, qué puede ir a un repo privado y qué no, política de tokens, nota legal |
| `REPOS-ANALISIS.md` | Análisis de `freellmapi` y `scroll-craft` con hallazgos y recomendaciones (explicativo, no se modificó nada) |
| `PROYECTO-SOCIAL.md` | Contexto del proyecto mayor: artistas, espacios y clientes. Incluye las 10 preguntas sin respuesta |
| `CREDITOS.md` | Herramientas, bibliotecas, fuentes y atribuciones |
| `INVENTARIO.md` | Este archivo |

## 2. Documentación técnica del sitio (carpeta `docs/`)

| Archivo | Contenido |
| --- | --- |
| `docs/AUDITORIA-FASE1.md` | Auditoría inicial: qué había en el repo, qué se conservaba, qué se reemplazaba |
| `docs/IMPLEMENTACION.md` | Decisiones de implementación, incluido el descarte del prerender (con sus cuatro causas) y el arreglo de las rutas profundas de Pages |
| `README.md` | Estructura del proyecto, comandos, notas de SEO y de rutas profundas |

## 3. Código nuevo o modificado en esta última etapa

| Archivo | Qué cambió |
| --- | --- |
| `src/restorePagesPath.ts` | **Nuevo.** Repone la ruta profunda antes de que el router lea `location`. Debe ser el primer import de `main.tsx` |
| `src/main.tsx` | Fuera el IIFE de restauración; import de `restorePagesPath` en primer lugar |
| `index.html` | El preload del póster del hero ahora solo ocurre en la home (antes se descargaba en todas las rutas sin usarse) |
| `scripts/serve-dist.mjs` | Acepta `VITE_BASE_PATH` y recorta el prefijo, para poder probar el build de Pages en local |
| `qa/pages-base.mjs` | **Nuevo.** Arnés del flujo de rutas profundas con base `/sender/` |
| `tools/export-wordpress.mjs` | **Nuevo.** Exportador reproducible a WordPress |
| `package.json` | Scripts nuevos: `qa:pages`, `qa:all`, `export:wordpress` |
| `.github/workflows/datadog-synthetics.yml` | Cambiado a `workflow_dispatch`: fallaba en cada push por falta de secrets |
| `package-lock.json` | Regenerado: faltaba `playwright` y rompía `npm ci` en CI |

## 4. Entregables para WordPress

En `wordpress-export/` (no versionado por peso; se regenera con un comando):

- `contenido/catalogo.json` — 16 productos y 7 categorías, bilingüe
- `contenido/productos-woocommerce.csv` y `categorias-woocommerce.csv`
- `seo/` — JSON-LD (Organization + 16 Product) y sitemap de 25 URLs
- `medios/` — 20 WebP, 7 JPG, manifiesto con dimensiones y pesos, video del hero
- `build-spa/` — el sitio compilado con base `/sender/`, listo para subir
- `LEEME.md` — las tres rutas de instalación, con sus ventajas y límites

Regenerar:

```bash
npm run export:wordpress -- --sitio=https://www.sender.cl
VITE_BASE_PATH=/sender/ npm run build && rm -rf wordpress-export/build-spa && cp -r dist wordpress-export/build-spa
```

## 5. Estado del repositorio y de la publicación

| Ítem | Estado |
| --- | --- |
| Rama de trabajo | `arena/01a0afb6-sender` |
| Commits en la rama | 11 por delante de `main` al cierre (los 10 primeros ya están fusionados vía PR #7 y #8; falta el último) |
| Commit pendiente de push | `c373d13` — *fix(routing): las rutas profundas publicadas mostraban la home* |
| PR fusionados | #7 (rediseño completo, 8 commits, +9992/−2141) y #8 (fix de CI) |
| Sitio publicado | `https://cristianoleamiranda-dotcom.github.io/sender/` — **vivo, pero con el build anterior al arreglo de rutas** |
| Bug conocido en producción | Las rutas profundas (`/productos/`, `/producto/...`) muestran la home. Arreglado y verificado en local; **falta publicar** |
| Token de GitHub | Expirado o revocado (`401 Bad credentials`). Nunca quedó versionado. Bloquea el push |

**Para destrabar:** un fine-grained PAT nuevo con `Contents: Read and write` y
`Pull requests: Read and write` sobre `cristianoleamiranda-dotcom/sender`,
entregado como variable de entorno. Con eso: push, PR, merge, y verificar
`/sender/productos/` en vivo.

## 6. Mediciones registradas

Sobre `vite preview`, antes del arreglo de rutas (que no afecta rendimiento):

| Ruta | Dispositivo | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | Peso |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | escritorio | 99 | 100 | 100 | 100 | 0.7 s | 0.8 s | 20 ms | 0.013 | 305 KiB |
| `/` | móvil | 78 | 100 | 100 | 100 | 3.0 s | 3.3 s | 360 ms | 0.009 | 307 KiB |
| `/productos` | móvil | 84 | 98 | 100 | 100 | — | — | — | — | — |
| `/producto/serie-sender-ss` | escritorio | 99 | — | — | — | — | — | — | — | — |

Assets: 4,69 MB → 1,08 MB en WebP (24 imágenes).

Verificación en perfil Samsung Galaxy S24 (viewport 360×780, DPR 3), con el
arreglo aplicado en local:

| Ruta | Desborde horizontal | H1 |
| --- | --- | --- |
| `/` | no (360/360) | SENDER |
| `/productos/` | no | SOLUCIONES DE TRANSMISIÓN |
| `/producto/serie-sender-ss/` | no | TRANSMISORES AM SERIE SENDER SS |

QA (`npm run qa`) y QA de Pages (`npm run qa:pages`): ambos en verde.

## 7. Datos verificados del negocio

| Dato | Valor | Fuente |
| --- | --- | --- |
| Teléfono | +56 9 8386 4148 | sender.cl |
| Correo | sender@sender.cl | sender.cl |
| Correo comercial | bis.ltda@gmail.com | repo |
| Dirección | Blanco Viel 1108, 2º piso, San Miguel, Santiago | sender.cl |
| Experiencia | +20 años en defensa, radiodifusión y sector marítimo | sender.cl/quienes-somos |
| Catálogo | 16 productos en 7 categorías, cada uno con `sourceUrl` | fichas públicas |

Proyectos reales documentados: Radio Colosal Ambato (Radio World), desmontaje de
torre de 60 m para la Armada en Valparaíso, HF en Isla de Pascua, NAVTEX marítimo.

Regla de contenido que se mantuvo: **lo que no está documentado, no está.** Sin
cifras de ventas, sin clientes sin nombre, sin certificaciones, sin premios, sin
fechas de hitos.

## 8. Pendientes

| # | Pendiente | Quién | Bloqueado por |
| --- | --- | --- | --- |
| 1 | Publicar el arreglo de rutas profundas (push + PR + merge + deploy) | Agente | PAT válido |
| 2 | Verificar las rutas profundas en el sitio vivo | Agente | ítem 1 |
| 3 | Confirmar en GitHub que el token viejo está revocado | Persona | — |
| 4 | Revisar el security log de GitHub del período en que el token estuvo activo | Persona | — |
| 5 | Decidir si `wordpress-export/` se versiona o se entrega por fuera | Persona | — |
| 6 | Crear el repo privado del proyecto social y mover `PROYECTO-SOCIAL.md` | Persona | — |
| 7 | Responder las 10 preguntas de `PROYECTO-SOCIAL.md` §6 | Persona | — |
| 8 | Decidir si se actúa sobre `scroll-craft` (datos de contacto falsos publicados) y `freellmapi` (README del fork) | Persona | — |
| 9 | Si se quiere Datadog Synthetics activo: secrets `DD_API_KEY`/`DD_APP_KEY`, tests con tag `e2e-tests` y restaurar los triggers | Persona | — |

## 9. Procesos y archivos temporales de la sesión

No persisten entre sesiones y no hace falta conservarlos:

- Servidores estáticos de prueba en los puertos 4173, 4180, 4321 y 5173.
- `/home/user/qacheck/` y `/home/user/lh/`: sondas Playwright y JSON de
  Lighthouse. Lo que valía la pena conservar ya está en `qa/` del repo.
- `s24.mjs` en la raíz del repo: sonda del perfil S24. **Conviene moverla a `qa/`**
  o borrarla antes de commitear; es el único archivo suelto que quedó.

Nota sobre el entorno: `node_modules/` y `dist/` no persisten entre sesiones. Se
reinstalan con `npm ci` (6 s con caché) y el navegador de Playwright con
`npx playwright install chromium` seguido de `npx playwright install-deps chromium`.
