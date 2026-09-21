# Proyecto social: plataforma para conectar artistas, espacios y clientes

**Naturaleza de este documento.** Es *contexto*, no un diseño aprobado. La persona
a cargo lo enunció así: una web que se enmarca en un proyecto mayor, de carácter
social y gratuito, que integre herramientas reales para conectar artistas, espacios
públicos o privados libres y clientes.

Por eso este archivo separa con cuidado tres cosas: lo que ya existe y se puede
reutilizar, lo que se propone como hipótesis de trabajo, y lo que **falta saber** y
solo la persona a cargo puede responder. La sección 6 es la importante: son las
preguntas sin respuesta.

Regla que se aplicó en el sitio SENDER y conviene heredar: **no inventar
información.** Todo lo que sigue como propuesta está marcado como propuesta.

---

## 1. El problema, en una frase

Hay artistas que necesitan lugares donde mostrar su trabajo, hay espacios (plazas,
centros culturales, cafés, galerías, juntas de vecinos, murallas privadas, escenarios
municipales) que están libres y no saben cómo ofrecerlos, y hay clientes
(municipios, marcas, productoras, particulares) que buscan artistas y no tienen
dónde buscar. Los tres existen por separado; lo que falta es el punto de encuentro,
y hoy ese punto de encuentro son grupos de WhatsApp y contactos personales.

## 2. Lo que ya existe y se puede reutilizar

No hace falta partir de cero. Hay tres activos concretos en los repositorios
analizados:

| Activo | Dónde está | Qué aporta |
| --- | --- | --- |
| Arquitectura de front madura | `sender` | React + TS + Vite + Tailwind + Motion + Lenis, con i18n ES/EN estructural, sistema de contenido `{ es, en }`, SEO por ruta con JSON-LD, arnés QA con Playwright y exportador a WordPress |
| Patrón de scroll sin dependencias | `scroll-craft` | 26 kB de JS vainilla con `IntersectionObserver` y degradación garantizada. Ideal para usuarios en datos móviles |
| Infraestructura de IA de costo cero | `freellmapi` | Router OpenAI-compatible con failover sobre capas gratuitas. Con la advertencia de sus propios términos: "personal experimentation only" |
| Método de trabajo | `docs/proyecto/FLUJO-DE-TRABAJO.md` | El flujo Arena AI + GitHub + dispositivo real, ya probado en una publicación real |

El activo más valioso no es el código: es **el método**. Un proyecto social sin
financiamiento no puede sostener un equipo; puede sostener un proceso donde una
persona dirige y un agente ejecuta y mide. Eso ya se demostró.

## 3. Hipótesis de trabajo sobre los tres actores

Se enuncia como hipótesis porque **no está validada con usuarios reales**.

**Artistas.** Necesitan: perfil con portafolio, disponibilidad, rango de precio (o
gratuidad), ficha técnica (qué necesitan del espacio: metros, potencia eléctrica,
acceso, horario). Les sobra: otro formulario más. El riesgo es construir un
directorio bonito que nadie actualiza.

**Espacios.** "Públicos o privados libres" son dos problemas distintos.
- *Públicos* (plazas, centros culturales, gimnasios municipales, bibliotecas): la
  disponibilidad depende de permisos municipales. No es un dato que el espacio
  publica: es un trámite. Integrarlo de verdad significa hablar con municipios, y
  cada uno tiene su propia ordenanza.
- *Privados* (cafés, galerías, oficinas, murallas, patios, teatros independientes):
  aquí sí hay un dueño que puede decidir y publicar disponibilidad. **Es el lugar
  por donde empezar**, porque no depende de terceros institucionales.

**Clientes.** Municipios, marcas, productoras, y particulares (matrimonios,
cumpleaños, eventos de empresa). Cada uno busca cosas distintas y tiene presupuestos
distintos. Intentar servir a los cuatro el primer día es la forma más rápida de no
servir a ninguno.

## 4. Modelo de datos mínimo

Seis entidades. Nada más; todo lo demás es derivable.

```
Artista       id, nombre, disciplina[], zona, portafolio[{url,tipo}],
              fichaTecnica{necesita}, disponibilidad, contacto, verificado
Espacio       id, nombre, tipo(publico|privado), direccion, zona, aforo,
              metros2, potenciaElectrica, acceso, fotos[], duenoId, verificado
Disponibilidad espacioId, fecha, franjaHoraria, estado(libre|reservado|bloqueado)
Solicitud     id, clienteId, artistaId?, espacioId?, fecha, mensaje, estado
Usuario       id, rol(artista|espacio|cliente), email, telefono?, consentimiento
Registro      id, tipo, actorId, fecha, detalle        ← trazabilidad mínima
```

Decisiones de diseño que importan más que el esquema:

- **`verificado` en Artista y Espacio.** Sin verificación, la plataforma se llena
  de fichas abandonadas y de espacios que no existen. Verificar a mano al principio
  es lento y es lo correcto: es un proyecto social, la confianza es el producto.
- **`consentimiento` en Usuario.** Obligatorio desde el día uno por la Ley 21.719
  (ver §7). No es un campo decorativo: hay que guardar qué se aceptó y cuándo.
- **Zona antes que mapa.** Un mapa con geocodificación es caro de mantener y de
  usar en móvil. Empezar por comuna/región resuelve el 90 % de las búsquedas.
- **Disponibilidad por franja, no por calendario completo.** Pedirle a un dueño de
  café que cargue un calendario mensual es pedirle que abandone la plataforma.

## 5. Fases propuestas

**Fase 0 — Validación (sin código).** 15 conversaciones: 5 artistas, 5 dueños de
espacios privados, 5 clientes. Objetivo: descubrir si el problema es "no encuentro
dónde mostrar mi trabajo" u otro distinto. *Sin esta fase, todo lo demás es
suposición.* Salida: una página de decisión, no un plan.

**Fase 1 — Directorio mínimo.** Solo artistas y espacios privados, solo una
comuna, solo ficha + contacto directo (la plataforma no intermedia). Stack: el de
SENDER. Entrega: sitio público con fichas verificadas a mano. Costo: cero.
Criterio de éxito: 20 fichas reales y 5 contactos que se hayan concretado por la
plataforma.

**Fase 2 — Disponibilidad y solicitud.** Alta de espacios por su dueño, franjas
libres, formulario de solicitud, notificación por correo. Aquí aparece la primera
necesidad de backend y de base de datos.

**Fase 3 — Espacios públicos.** Convenios con municipios. Es la fase más lenta y la
de mayor impacto social. No empezar antes de tener la Fase 2 funcionando: sin
tracción demostrable, ningún municipio firma nada.

**Fase 4 — Herramientas.** Aquí, y solo aquí, entra la IA: redacción asistida de
fichas, traducción ES/EN de portafolios, sugerencia de emparejamiento
artista-espacio. Con `freellmapi` como proveedor de costo cero y **degradación
obligatoria**: si el router cae, la plataforma sigue funcionando sin IA.

## 6. Lo que falta saber (preguntas para la persona a cargo)

Estas respuestas cambian el diseño. Sin ellas, cualquier plan detallado es
ficción.

**Sobre el alcance**
1. ¿Qué disciplina o disciplinas primero? (música en vivo, muralismo, teatro,
   danza, artes visuales, todas) — define la ficha técnica y el portafolio.
2. ¿Qué territorio primero? (una comuna, la Región Metropolitana, todo Chile)
3. ¿Los espacios públicos son meta real o aspiracional? Si es real, ¿hay algún
   contacto municipal hoy?

**Sobre el modelo**
4. ¿Gratuito para siempre, o gratuito con algo de pago más adelante? (El modelo
   cambia todo: si hay pago, hay medio de pago, boletas, SII.)
5. ¿La plataforma intermedia el acuerdo o solo conecta? Intermediar implica
   responsabilidad contractual y tributaria.
6. ¿Quién verifica las fichas y con qué criterio?

**Sobre la operación**
7. ¿Quién responde cuando un artista escribe que su ficha está mal? Sin esa
   persona, el proyecto muere en tres meses aunque el código funcione.
8. ¿Hay organización detrás (fundación, colectiva, municipio) o es personal?
   Define si se pueden recibir fondos y firmar convenios.
9. ¿Existe algo parecido en Chile que se haya intentado? (Vale la pena buscarlo
   antes de construir: si existe y fracasó, entender por qué es más útil que
   competir.)

**Sobre el financiamiento**
10. ¿Se postulará a fondos? En Chile, las líneas relevantes para esto suelen ser
    Fondart / Fondo Nacional de Desarrollo Cultural y las Artes, fondos regionales
    del 2 % cultural (FNDR), y programas municipales de cultura. Cada uno tiene
    ventanillas anuales y exige personalidad jurídica en la mayoría de los casos.

## 7. Privacidad: fecha límite real

La **Ley 21.719** entra en plena vigencia el **1 de diciembre de 2026** y crea la
Agencia de Protección de Datos Personales, con multas de hasta 20.000 UTM. Una
plataforma que recoge datos de artistas y clientes es exactamente el tipo de
sistema alcanzado.

Tres consecuencias de diseño, y son baratas si se hacen al principio:

1. **Consentimiento explícito y registrado**: qué se recoge, para qué, por cuánto
   tiempo, quién es responsable. Guardar la fecha y la versión del texto aceptado.
2. **Derechos ARCO + portabilidad**: un canal para pedir los datos propios,
   corregirlos, borrarlos o llevárselos. Al principio puede ser un correo atendido
   a mano; lo que no puede faltar es el canal.
3. **Minimización**: no pedir RUT, no pedir dirección completa de espacios privados
   (solo comuna y referencia hasta que se confirme la solicitud), no pedir fotos de
   documentos. Cada dato que no se recoge es un dato que no se puede filtrar.

Detalle que se suele pasar: **la dirección exacta de un espacio privado puede ser
un dato sensible para su dueño**. Publicarla sin control convierte la plataforma en
un mapa de domicilios disponibles. Mejor: comuna visible, dirección exacta solo
tras una solicitud aceptada.

## 8. Riesgos, ordenados por probabilidad de matar el proyecto

| Riesgo | Por qué es probable | Mitigación |
| --- | --- | --- |
| Directorio vacío al lanzar | Es el fallo clásico de los marketplaces de dos lados | Fase 1 con 20 fichas cargadas a mano por el propio equipo, en una sola comuna |
| Nadie mantiene las fichas | Los artistas no vuelven a entrar a actualizar | Contacto directo y nada más; sin calendarios que se desactualicen solos |
| Depender de municipios temprano | Los plazos municipales son de años | Fase 3 explícitamente después de tener tracción |
| Costo de infraestructura | Un proyecto gratuito no puede pagar servidores | Front estático en GitHub Pages (costo cero), backend mínimo, y IA solo vía capas gratuitas con degradación |
| Que lo construya un agente y nadie lo gobierne | Es lo que pasó en varios proyectos de este portafolio | La persona a cargo responde las preguntas de §6 antes de escribir más código |

## 9. Qué haría a continuación, en concreto

1. Responder las 10 preguntas de §6. Media hora de respuestas evita meses de código
   equivocado.
2. Decidir disciplina y comuna de la Fase 1.
3. Crear el repo privado del proyecto social y mover este archivo allí (es
   portable: no referencia código de SENDER).
4. Hacer las 15 conversaciones de la Fase 0 antes de escribir una línea.
5. Recién entonces: reutilizar `src/content/` como patrón de datos, el arnés QA
   como patrón de verificación, y el flujo de trabajo ya documentado.

---

*Documento de contexto, versión 1, 2026-09-20. Las propuestas de este archivo no
han sido validadas por la persona a cargo del proyecto.*
