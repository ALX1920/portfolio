# Documentación de cambios — Portafolio Alejandro Martínez

Este documento detalla todos los problemas encontrados y las correcciones aplicadas al portafolio, organizadas por archivo. Sirve como referencia para el historial de commits y para entender el porqué de cada cambio.

---

## 1. `index.html`

### 1.1 Bug: IDs del script de copiar correo no coincidían

**Problema:** El `<script>` inline buscaba `email-text`, `copy-email` y `copy-email-2`, pero esos IDs no existían en el HTML (los reales eran `email-gmail`, `copy-gmail`, `email-outlook`, `copy-outlook`).

**Efecto:** `document.getElementById()` devolvía `null`. Al llamar `.addEventListener()` sobre `null`, el script lanzaba un error y se detenía por completo — ni siquiera cargaba lo que venía después.

**Corrección:** Se unificó toda la lógica de copiado en `script.js`, usando los IDs reales del HTML.

### 1.2 Script inline duplicado

**Problema:** Existía un `<script>` dentro del HTML que hacía exactamente lo mismo que `script.js` (que se cargaba justo después).

**Efecto:** Dos listeners distintos escuchando el mismo clic. No rompía nada de forma visible, pero era código redundante y una fuente de confusión a futuro (¿cuál de los dos es el "real"?).

**Corrección:** Se eliminó el bloque inline. Ahora `script.js` es la única fuente de verdad para esa función.

### 1.3 Cinco hojas de estilo enlazadas por separado

**Problema:** El `<head>` tenía 5 `<link rel="stylesheet">` distintos.

**Efecto:** Cualquier cambio en el orden o adición de un nuevo archivo CSS requería tocar el HTML.

**Corrección:** Ahora solo hay un `<link>` a `styles/main.css`, que a su vez importa los demás archivos vía `@import` (ver sección 2).

### 1.4 Seguridad menor en enlaces externos

**Problema:** Los enlaces con `target="_blank"` (GitHub, LinkedIn, WhatsApp, CV) no tenían `rel="noopener"`.

**Efecto:** La pestaña nueva podía acceder a `window.opener` de la pestaña original (vulnerabilidad conocida como _tabnabbing_), y en navegadores antiguos también afectaba el rendimiento.

**Corrección:** Se agregó `rel="noopener"` a todos los enlaces externos.

### 1.5 Accesibilidad de los botones "Copiar correo"

**Problema:** Los botones de copiar eran `<span>` sin ningún atributo de accesibilidad, por lo que no eran alcanzables ni operables con teclado.

**Corrección:** Se agregó `role="button" tabindex="0"` a cada `<span>`, y en `script.js` se agregó soporte para activarlos con `Enter`/`Espacio` además del clic.

### 1.6 Falta de meta información para SEO / redes sociales

**Problema:** No había `<meta name="description">` ni etiquetas Open Graph.

**Efecto:** Si alguien compartía el link en redes sociales o WhatsApp, no se generaba una vista previa útil; los buscadores tampoco tenían un resumen claro de la página.

**Corrección:** Se agregaron `<meta name="description">`, `og:title`, `og:description` y `og:type`.

### 1.7 Sección "Formación" sin acceso desde el menú

**Problema:** La sección `#formacion` existía en el HTML pero no estaba enlazada en `.nav__menu`.

**Corrección:** Se agregó `<li><a href="#formacion">Formación</a></li>`.

### 1.8 Typo en el nombre de un proyecto

**Problema:** "ChonoCreatures" en vez de "ChronoCreatures" (título y descripción).

**Corrección:** Corregido en ambos lugares.

### 1.9 Rutas de imagen inconsistentes

**Problema:** La mayoría de las imágenes usaban `img/...`, pero el proyecto 3 usaba `assets/img/proyecto3.png`.

**Corrección:** Todas las rutas se unificaron bajo `img/`.

### 1.10 Selector frágil para "Ver más proyectos"

**Problema:** `script.js` seleccionaba el botón con `document.querySelector('.btn--secondary')`, es decir, "el primer elemento con esa clase". Funcionaba solo porque había un único botón con esa clase en toda la página.

**Efecto:** Si en el futuro se agrega otro `.btn--secondary` antes en el DOM, el script apuntaría al botón equivocado.

**Corrección:** Se le dio `id="btn-ver-mas-proyectos"` al botón y el script ahora usa `document.getElementById(...)`.

### 1.11 Sin fallback para navegadores sin JavaScript

**Problema:** El efecto de aparición al hacer scroll depende de que `script.js` agregue la clase `.visible`. Si el usuario tiene JS desactivado, las secciones se quedarían con `opacity: 0` para siempre (invisibles).

**Corrección:** Se agregó un bloque `<noscript>` que fuerza `opacity: 1 !important` en esos elementos cuando JS no está disponible.

### 1.12 Proyecto 3 incompleto

**Problema:** La tarjeta del proyecto 3 solo tenía `...` como contenido y una imagen que no existía (`proyecto3.png`).

**Corrección:** Se comentó el bloque completo (queda "pausado") con instrucciones para reactivarlo cuando exista el contenido real, evitando así una imagen rota o una tarjeta vacía visible al público.

---

## 2. CSS — de 5 archivos con duplicados a una estructura por responsabilidad

### Problema general

El proyecto tenía reglas repetidas (`.btn`, `.badge`, `.project-card`, `.chip`, etc.) definidas en 2, 3 y hasta 4 archivos distintos (`pallette.css`, un `styles.css` viejo, `cards.css`, y un archivo sin nombre que resultó ser la paleta real). Esto significaba que corregir un color o un padding requería buscar en varios archivos para no dejar una versión desactualizada suelta.

### Reorganización aplicada

| Archivo                  | Contenido                                                                                                                                  | Motivo                                                   |     |     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | --- | --- |
| `pallette.css`           | Solo variables `:root` (colores, radios, gradientes)                                                                                       | Única fuente de verdad del tema visual                   |
| `styles.css`             | Reset, `body`/`a`/`ul`, `.container`, fondos difuminados, header/nav, estructura de secciones, hero, footer, efectos de scroll, responsive | Estructura y layout global del sitio                     |
| `components/buttons.css` | `.btn`, `.social-link`, `.chip`, `.badge`, enlaces (`cv__link`, `project-card__link`, `contact__link`, etc.)                               | Todo lo interactivo/clicable en un solo lugar            |
| `components/cards.css`   | Tarjetas de contenido: CV, proyectos, reconocimientos, sobre mí, skills, stack, experiencia, educación, blog, contacto                     | Componentes de contenido, separados del layout puro      |
| `components/layout.css`  | Todos los `*-grid` (proyectos, skills, experiencia, educación, blog, reconocimientos)                                                      | Solo disposición espacial, sin mezclar con estilo visual |
| `main.css`               | `@import` de los 5 archivos anteriores, en ese orden                                                                                       | Punto de entrada único pedido explícitamente             |

**Por qué ese orden en \*\***`main.css`**:** `pallette.css` debe cargar primero porque los demás archivos usan `var(--accent-blue)`, `var(--radius-card)`, etc. Si se importara después, esas variables no existirían todavía cuando el navegador las necesita.

### CSS muerto eliminado

Reglas definidas pero que no correspondían a ninguna clase usada en el HTML:

- `.social-link--disabled`
- `.hero__photo-note`
- `.cv__hint`

### Estilos faltantes agregados

Clases usadas en el HTML pero sin ninguna regla CSS asociada:

- `.about__domain-value`
- `.contact__note`

### Estilos agregados para soportar el JavaScript

`script.js` agregaba las clases `.visible` y `.header--scrolled`, pero no existía CSS para ellas — el JavaScript funcionaba, pero no se veía ningún efecto. Se agregó:

- `.header--scrolled` → sombra sutil en el header al hacer scroll.
- `.section/.project-card/.blog-card/.skills-block` con `opacity: 0` + `transform: translateY(16px)` como estado inicial, y `.visible` que los regresa a su estado normal con una transición suave.

---

## 3. `script.js`

### 3.1 Duplicado con el HTML

Ver punto 1.2. La función de copiar correo ahora vive únicamente aquí.

### 3.2 Accesibilidad del copiado

Se agregó un listener de `keydown` (`Enter` / `Espacio`) además del de `click`, ya que los botones son `<span role="button">` y no `<button>` nativos (que sí responden a teclado automáticamente).

### 3.3 Animación de scroll sin manejo de navegadores antiguos

**Problema:** El `IntersectionObserver` se usaba directamente sin verificar si el navegador lo soporta.

**Corrección:** Se envolvió en `if ('IntersectionObserver' in window)`. Si no está disponible, se agrega `.visible` a todos los elementos de inmediato para no dejar contenido invisible.

**Mejora adicional:** Se agregó `observer.unobserve(entry.target)` después de que un elemento se hace visible, para que el navegador deje de vigilar algo que ya no necesita seguir observando.

### 3.4 Rutas de imagen inconsistentes en los "proyectos extra"

Las imágenes de `proyectosExtra` usaban `assets/img/proyecto-extra1.png` y `assets/img/proyecto-extra2.png`. Se cambiaron a `img/` para ser consistentes con el resto del sitio.

### 3.5 Imágenes generadas dinámicamente sin `alt`

Las tarjetas de proyecto que se crean con `innerHTML` no incluían el atributo `alt` en la imagen. Se agregó `alt="Captura de ${titulo}"`.

### 3.6 Selector frágil del botón "Ver más proyectos"

Ver punto 1.10. Se cambió de `querySelector('.btn--secondary')` a `getElementById('btn-ver-mas-proyectos')`.

### 3.7 Salto de página al hacer clic

**Problema:** El botón es un `<a href="#">`. Sin `preventDefault()`, cada clic hacía que la página saltara al inicio (`#`).

**Corrección:** Se agregó `e.preventDefault()` al inicio del handler de clic.

### 3.8 Efecto de scroll en el header sin verificación de existencia

**Problema:** `document.querySelector('.header')` podía devolver `null` si el elemento cambiaba de clase en el futuro, y el `addEventListener('scroll', ...)` se registraba sin comprobarlo.

**Corrección:** Se envolvió el registro del listener en `if (header) { ... }`.

---

## 4. Resumen de archivos afectados

| ArchivoTipo de cambio           |                                                  |
| ------------------------------- | ------------------------------------------------ |
| `index.html`                    | Corrección de bugs, accesibilidad, SEO, limpieza |
| `styles/main.css`               | Creado — punto de entrada único                  |
| `styles/pallette.css`           | Reducido a solo variables                        |
| `styles/styles.css`             | Reorganizado + nuevas reglas de scroll           |
| `styles/components/buttons.css` | Creado — elementos interactivos                  |
| `styles/components/cards.css`   | Creado — tarjetas de contenido                   |
| `styles/components/layout.css`  | Creado — grids                                   |
| `scripts/script.js`             | Corrección de bugs, accesibilidad, consistencia  |

---

## 5. Pendientes (no son errores, son contenido por completar)

- Reemplazar la imagen y el contenido del **proyecto 3** (actualmente comentado en `index.html`).
- Completar la sección **"Experiencia laboral"** (tiene un `...` como placeholder).
- Subir el **CV real** en `https://cv.alejandromtz.dev` (o cambiar el enlace por la ruta correcta).
- Considerar agregar un **favicon**.
