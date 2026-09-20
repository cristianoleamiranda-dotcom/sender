# PROMPT — Copiar y pegar este bloque completo en tu IA favorita

---

## CONTEXTO

Eres un desarrollador front-end senior y diseñador web con experiencia en motion design. Tu tarea es crear una **landing page completa, moderna y profesional** sobre un tutorial de animaciones de scroll para desarrolladores web y diseñadores.

---

## CONTENIDO DE LA LANDING (no traduzcas, usa estos textos exactos)

**Hero / H1 principal:**
> Learn how to build engaging scroll animations for your projects. This tutorial covers the techniques used by top design studios.

**Subheadline:**
> Every prompt from this video is now free in my Skool, copy-paste ready, plus the design references I used.

**CTA principal (botón):**
> Grab them here → https://www.skool.com

**Sección "Quick links":**
> Quick links — / zosoborrego

**Sección de contexto / pitch:**
> Creating professional scroll animations can elevate the user experience on any website. This guide breaks down the process of implementing these effects, using examples from sites like motionsites.ai and 21firstdesigns to illustrate how motion design enhances visual storytelling.

**Sección secundaria (audiencia):**
> This video is designed for web developers and designers looking to improve their skills. By following these steps, you will be able to create unique web animation experiences for your clients, ensuring your work stands out while maintaining a focus on original design principles.

**Cierre / suscripción:**
> Subscribe for weekly web design tutorials and comment below with which animation technique you want to master next.

**Nota de eficiencia:**
> Creating engaging scroll animations does not have to be a time-consuming process. This guide shows you how to use resources like motionsites.ai and 21firstdesigns to build high-quality motion effects efficiently. Whether you are building sites for clients or improving your portfolio, these tools provide a solid foundation to get you started quickly.

**Tercera sección (beneficio):**
> By leveraging these design resources, you can produce complex scroll animations without starting from scratch. This approach is ideal for designers who need to deliver work for clients while maintaining a fast project turnaround. You will see how to properly integrate these assets into your workflow to save hours of development time.

**CTA final:**
> Subscribe for weekly web design tutorials and leave a comment telling me which animation tool you want to see covered next.

---

## INICIO DEL TRABAJO

```text
Eres un desarrollador web senior y diseñador de motion design. Vas a construir una landing page completa, moderna, con animaciones de scroll de alto nivel, inspirada en motionsites.ai y 21firstdesigns. El resultado debe ser un archivo único HTML (index.html) con CSS y JS embebidos, listo para desplegar en GitHub Pages, Vercel o Netlify.

USO DEL CONTENIDO:
- Usa los textos exactos provistos en esta brief.
- El tono es profesional, inspirador, orientado a desarrolladores/diseñadores.
- El público objetivo son devs y designers que quieren mejorar sus habilidades de animación web.

DISEÑO VISUAL:
- Estilo moderno, dark mode opcional o estilo limpio con gradientes suaves.
- Tipografía grande y impactante en el hero (clamp() para responsive).
- Paleta de colores profesional: puede incluir neón/cyberpunk sutil, o estilo minimalista premium tipo Awwwards.
- Espaciado generoso, sections con padding grande (scroll-driven).
- Hero con animación de entrada (fade-up o similar al hacer scroll).
- Secciones con reveal animations (Intersection Observer).
- Al menos 2 técnicas de animación distintas: fade-in + slide, o parallax sutil, o blur reveal.
- No uses librerías pesadas: Intersection Observer API nativa preferible, o GSAP si se justifica.

ESTRUCTURA DE SECCIONES:
1. Nav bar superior minimal (logo / nombre + smooth scroll links)
2. Hero con headline, subheadline y CTA principal
3. Sección "Why / Context" con el párrafo de motion design
4. Sección "Audience" con el párrafo de desarrolladores y diseñadores
5. Sección "Efficiency" con el párrafo de motionsites.ai y 21firstdesigns
6. Sección "Benefit / Workflow" con el párrafo de ahorro de tiempo
7. CTA final de suscripción + comentario
8. Footer minimal

REQUISITOS TÉCNICOS:
- Un solo archivo index.html con todo embebido (CSS en <style>, JS en <script>).
- Animaciones con Intersection Observer API (no jQuery, no librerías externas si se puede).
- Smooth scroll nativo con CSS scroll-behavior: smooth.
- 100% responsive (mobile-first).
- Velocidad de carga optimizada (sin assets externos innecesarios; usa CSS puro para efectos visuales).
- Código limpio, comentado y bien estructurado.
- Accesibilidad básica: semantic HTML, alt en imágenes, roles si hay componentes interactivos.

ENTREGABLE FINAL:
- Solo el archivo index.html completo.
- Ningún otro archivo.
- El código debe funcionar copiando y pegando en un archivo .html y abriéndolo en el navegador.
```

---

## INSTRUCCIONES ADICIONALES PARA EL USUARIO (no incluir en el prompt para la IA)

1. **Copia el bloque de prompt** de arriba (desde "Eres un desarrollador web senior..." hasta el final del código).
2. **Pégalo en ChatGPT, Claude, Copilot, o tu IA favorita.**
3. La IA te entregará un `index.html` completo.
4. **Para publicarlo en GitHub:**
   ```bash
   mkdir landing-scroll-animations
   cd landing-scroll-animations
   # pega el archivo index.html que te generó la IA
   git init
   git add .
   git commit -m "feat: landing page con animaciones de scroll"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/landing-scroll-animations.git
   git push -u origin main
   ```
5. **Activa GitHub Pages** en Settings → Pages → Branch: main → `/ (root)`.
6. **O usa Vercel/Netlify:** conecta el repo y se hace deploy automático.

---

## VARIACIÓN RÁPIDA: Si quieres cambiar el tema

Reemplaza el bloque de "CONTENIDO DE LA LANDING" con tu propio texto y mantén las instrucciones de diseño y técnicas iguales. La IA adaptará el diseño al nuevo contenido.
