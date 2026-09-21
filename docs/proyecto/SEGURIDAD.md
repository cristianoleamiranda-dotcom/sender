# Seguridad y almacenamiento

Responde dos preguntas concretas: **¿esto se puede guardar de forma segura en un
repositorio privado?** y **qué hago con el token**.

---

## 1. Estado del token usado en esta sesión

| Punto | Estado |
| --- | --- |
| ¿Quedó algún token en el repositorio? | **No.** Búsqueda `git log --all -S "ghp_"` y `grep -rI "ghp_"` sobre el árbol: cero coincidencias. |
| ¿Quedó en `.git/config` o en credenciales? | **No.** Los push se hicieron con la URL inline, sin `git config credential` ni `~/.git-credentials`. |
| ¿Quedó en el código o en los documentos? | **No.** En estos documentos no se reproduce el valor en ningún lado. |
| ¿Dónde sí estuvo expuesto? | En el historial del chat y en la línea de comandos del agente (visible en logs de la sesión). |
| ¿Sigue siendo válido? | **No.** Al cierre de esta sesión devolvía `401 Bad credentials`. |

**Acción pendiente, y es la única realmente necesaria:** confirmar en GitHub que
ese token figure como revocado. Aunque ya responda `401`, hay que cerrarlo
formalmente para que no quede un secreto "vivo pero roto" en la lista.

Pasos:

1. GitHub → **Settings → Developer settings → Personal access tokens**.
2. Buscar el token usado (los fine-grained aparecen por nombre y por repositorio;
   los clásicos, por scope).
3. **Revoke / Delete**. Si no aparece, ya fue eliminado: no hay nada más que hacer.
4. Revisar **Settings → Security log** por actividad inesperada en la ventana en
   que el token estuvo activo (pushes, creación de tokens, cambios de settings).

---

## 2. ¿Se puede guardar todo esto en un repositorio privado?

**Sí, con una distinción importante:** no todo lo que se recolectó tiene el mismo
nivel de sensibilidad, y la visibilidad correcta depende de eso.

### Lo que puede ir a un repo privado sin problema

- Todo el código del sitio y su documentación (`docs/`, `README.md`).
- Estos documentos de proceso (`docs/proyecto/`), incluido el análisis de los
  otros dos repositorios.
- El contexto del proyecto social: modelo de datos, fases, hipótesis.
- La exportación a WordPress (`wordpress-export/`), que solo contiene datos
  públicos del catálogo.

### Lo que NO va a ningún repositorio, ni privado

| Tipo | Por qué | Dónde va en su lugar |
| --- | --- | --- |
| Tokens, PAT, claves de API, passwords | Un repo privado sigue siendo un sistema de terceros; basta un colaborador mal invitado o un fork accidental. Y el historial de git **conserva** lo borrado: eliminar un archivo en un commit no lo elimina del pasado. | Gestor de secretos (GitHub Secrets, 1Password, Bitwarden) o variable de entorno local |
| Datos personales de terceros (RUT, teléfonos, correos de clientes, direcciones de artistas) | Son datos personales protegidos por la Ley 19.628 de Chile. El repo no es lugar para eso, ni privado. | Base de datos con control de acceso y política de retención |
| Contratos, cotizaciones, acuerdos con espacios | Confidencialidad contractual | Carpeta con acceso por persona, no por repo |
| Copias de seguridad de bases de datos | Concentra todo el riesgo en un solo archivo | Almacenamiento cifrado con versionado |

### Regla práctica

> Un repositorio privado es un buen lugar para **código y decisiones**.
> No es un buen lugar para **secretos ni datos personales de terceros**.

Nota sobre el repo privado: GitHub permite repos privados ilimitados en el plan
gratuito. Para el proyecto social, privado es lo correcto mientras no haya
decisión de licenciar; si más adelante se quiere abrir, se abre —al revés no es
posible.

### Antes de hacer el repo privado, verificar

```bash
# ¿hay algún secreto versionado en el historial? (cero resultados = limpio)
git log --all -p -S "ghp_" --oneline
git log --all -p -S "sk-" --oneline
grep -rInE "(ghp|gho|github_pat)_[A-Za-z0-9]{20,}" . --exclude-dir=node_modules --exclude-dir=.git

# ¿el .gitignore cubre lo que no debe subir?
cat .gitignore
```

Si alguna vez se sube un secreto por error, **rotarlo es obligatorio**: borrarlo
del historial con `git filter-repo` no lo invalida, y GitHub además lo detecta y
lo revoca automáticamente en muchos casos (push protection).

---

## 3. Dónde guardar la información recolectada (recomendación concreta)

| Contenido | Lugar | Visibilidad |
| --- | --- | --- |
| Sitio SENDER (código + docs + proceso) | `cristianoleamiranda-dotcom/sender` | Privado, o público si se quiere mostrar el trabajo |
| Proyecto social (contexto, modelo de datos, fases) | Repo nuevo, p. ej. `red-artistas` | **Privado** |
| Exportación WordPress | Fuera de git si pesa; si va, en `wordpress-export/` del repo del sitio | Igual que el repo |
| Secretos (PAT, claves de proveedores) | GitHub Secrets para CI; gestor de contraseñas para lo manual | Nunca en git |
| Datos de artistas, espacios y clientes | Base de datos del proyecto social | Con control de acceso |

Los archivos de contexto del proyecto social están en
`docs/proyecto/PROYECTO-SOCIAL.md` y son portables: se pueden mover tal cual a un
repo nuevo sin referencias rotas al sitio SENDER.

---

## 4. Política de tokens para las próximas veces

1. **Fine-grained PAT**, no clásico:
   - Repository access: *Only select repositories* → el repo exacto.
   - Permissions: `Contents: Read and write`, `Pull requests: Read and write`.
     Nada más. Ni `Administration`, ni `Delete`, ni `Workflows` salvo que haga
     falta editar workflows.
   - Expiration: 7 días si es para una sesión de trabajo; 30 como máximo.
2. **Entrega por variable de entorno**, nunca pegado en el chat.
3. **En CI, `GITHUB_TOKEN`**: ya viene firmado por el run, tiene permisos
   acotados y no hay que rotarlo. Es lo que usa `deploy.yml`.
4. **Un token por tarea.** Si se usa el mismo token para el sitio y para otro
   repo, una filtración compromete los dos.
5. **Rotación al cerrar**, aunque haya funcionado todo bien.
6. **Verificación posterior**: `git log -S` y revisión del security log.

---

## 5. Nota legal breve (proyecto social)

El proyecto social maneja datos personales de artistas y clientes. Tres cosas
mínimas antes de recoger datos de personas reales:

- **Aviso de privacidad** en el formulario: qué se recoge, para qué, por cuánto
  tiempo, quién es el responsable.
- **Consentimiento explícito** para datos sensibles y para publicar fotos, obras
  o ubicaciones de espacios privados.
- **Derechos ARCO** (acceso, rectificación, cancelación, oposición): un canal
  de contacto y un procedimiento, aunque sea manual al principio.

**Marco aplicable en Chile, y con fecha encima.** La Ley 21.719 se publicó en el
Diario Oficial el 13 de diciembre de 2024 y entra en **plena vigencia el 1 de
diciembre de 2026**: a unas diez semanas de la fecha de este documento. Crea la
Agencia de Protección de Datos Personales (APDP) como autoridad de control, eleva
el estándar hacia el modelo GDPR, añade portabilidad e impugnación de decisiones
automatizadas a los derechos ARCO, y fija multas de hasta 20.000 UTM. La Ley
19.628 sigue siendo la referencia previa.

Consecuencia práctica para el proyecto social: **no dejar el aviso de privacidad
y el consentimiento para el final.** Si el sitio levanta datos de artistas y
espacios antes de diciembre de 2026, conviene que nazca ya conforme a la ley
nueva en vez de migrar después.

Fuentes: [Lawwwing — Ley 21.719](https://lawwwing.com/la-nueva-era-de-la-proteccion-de-datos-en-chile-que-cambia-con-la-ley-21-719/),
[XMS Latam — guía de la Ley 21.719](https://xmslatam.com/ley-21719-proteccion-datos-chile/),
[TIC Chile — Ley 21.719](https://www.tichile.cl/ley-21-719-el-nuevo-desafio-de-chile/).

Esto no es asesoría legal: es la lista de lo que hay que revisar con quien
corresponda antes de lanzar.
