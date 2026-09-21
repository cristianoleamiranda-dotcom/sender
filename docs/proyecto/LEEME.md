# Documentación del proyecto

Carpeta de proceso y contexto. No es documentación técnica del sitio —esa está en
`docs/AUDITORIA-FASE1.md`, `docs/IMPLEMENTACION.md` y el `README.md` de la raíz.

## Archivos

| Archivo | Para qué sirve | Cuándo leerlo |
| --- | --- | --- |
| [`FLUJO-DE-TRABAJO.md`](FLUJO-DE-TRABAJO.md) | El proceso completo: Arena AI + GitHub + Samsung Galaxy S24, etapa por etapa. Incluye la respuesta a si conviene integrar el token desde el inicio y los seis errores ya pagados | Antes de empezar otro sitio |
| [`SEGURIDAD.md`](SEGURIDAD.md) | Estado del token usado, qué puede guardarse en un repo privado y qué no, política de tokens, nota legal chilena | Antes de compartir credenciales o crear un repo nuevo |
| [`REPOS-ANALISIS.md`](REPOS-ANALISIS.md) | Análisis de `freellmapi` y `scroll-craft`: hallazgos con evidencia y recomendaciones priorizadas | Solo explicativo; no se modificó nada |
| [`PROYECTO-SOCIAL.md`](PROYECTO-SOCIAL.md) | Contexto del proyecto mayor (artistas, espacios y clientes): activos reutilizables, modelo de datos, fases, riesgos y **las 10 preguntas sin respuesta** | Antes de escribir código del proyecto social |
| [`CREDITOS.md`](CREDITOS.md) | Herramientas con su versión real, fuentes de los datos, atribuciones y lo que deliberadamente no se usó | Para atribuir y para no repetir caminos descartados |
| [`INVENTARIO.md`](INVENTARIO.md) | Todo lo recolectado, dónde está, mediciones, pendientes y cómo retomar | Al cerrar o retomar una sesión |

## Estado en una línea

El sitio está publicado y vivo, pero **con el build anterior al arreglo de rutas
profundas**: el commit `c373d13` está hecho y verificado en local, y no se ha
podido subir porque el token de GitHub dejó de ser válido. Todo lo demás está
cerrado.

Los dos pendientes que dependen solo de la persona: confirmar la revocación del
token viejo, y entregar uno nuevo (fine-grained, por variable de entorno) para
terminar la publicación.

## Regla de contenido de todo el portafolio

Nada se inventa. Cada dato del sitio trae su fuente; cada cifra de estos
documentos salió de una medición o de una consulta verificable, y cuando algo es
propuesta y no hecho, está marcado como propuesta.
