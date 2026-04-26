
/* ============================================================
   ARCHIVO: script.js
   AUTOR: Alejandro Martínez
   DESCRIPCIÓN:
   Funciones ligeras para mejorar la experiencia de usuario (UX)
   sin saturar la página ni agregar complejidad innecesaria.
   ============================================================ */


/* ============================================================
   1. COPIAR CORREO AL PORTAPAPELES
   ------------------------------------------------------------
   - Permite copiar el correo con un clic.
   - Da retroalimentación visual al usuario.
   ============================================================ */

const gmailText = document.getElementById('email-gmail');
const outlookText = document.getElementById('email-outlook');

const copyGmail = document.getElementById('copy-gmail');
const copyOutlook = document.getElementById('copy-outlook');

// Función genérica para copiar
function copiarTexto(elementoTexto, elementoBoton) {
    navigator.clipboard.writeText(elementoTexto.textContent.trim())
        .then(() => {
            const original = elementoBoton.textContent;
            elementoBoton.textContent = 'Copiado';
            setTimeout(() => elementoBoton.textContent = original, 1500);
        })
        .catch(err => console.error('Error al copiar:', err));
}

// Eventos
copyGmail.addEventListener('click', () => copiarTexto(gmailText, copyGmail));
copyOutlook.addEventListener('click', () => copiarTexto(outlookText, copyOutlook));



/* ============================================================
   2. ANIMACIONES SUAVES AL HACER SCROLL
   ------------------------------------------------------------
   - Hace que las secciones aparezcan suavemente.
   - Mejora la experiencia sin afectar rendimiento.
   ============================================================ */

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.2 // Se activa cuando el 20% del elemento es visible
});

// Selecciona todas las secciones que queremos animar
document.querySelectorAll('.section, .project-card, .blog-card, .skills-block')
    .forEach(el => observer.observe(el));



/* ============================================================
   3. MOSTRAR MÁS PROYECTOS (DINÁMICO)
   ------------------------------------------------------------
   - Permite agregar más proyectos sin recargar la página.
   - Ideal para cuando vayas creando nuevos trabajos.
   ============================================================ */

// Botón "Ver más proyectos"
const verMasBtn = document.querySelector('.btn--secondary');

// Contenedor de proyectos
const projectsGrid = document.querySelector('.projects-grid');

// Proyectos adicionales (puedes agregar más luego)
const proyectosExtra = [
    {
        titulo: "Proyecto adicional 1",
        descripcion: "Descripción breve del proyecto.",
        tecnologias: ["HTML", "CSS", "JS"],
        imagen: "assets/img/proyecto-extra1.png",
        codigo: "#",
        demo: "#"
    },
    {
        titulo: "Proyecto adicional 2",
        descripcion: "Otro proyecto que puedes agregar.",
        tecnologias: ["Python", "Linux"],
        imagen: "assets/img/proyecto-extra2.png",
        codigo: "#",
        demo: "#"
    }
];

// Control para evitar duplicados
let proyectosAgregados = false;

if (verMasBtn && projectsGrid) {
    verMasBtn.addEventListener('click', () => {
        if (proyectosAgregados) return;

        proyectosExtra.forEach(proyecto => {
            const card = document.createElement('article');
            card.classList.add('project-card');

            card.innerHTML = `
                <div class="project-card__image-wrapper">
                    <img src="${proyecto.imagen}" class="project-card__image">
                </div>

                <div class="project-card__content">
                    <h3 class="project-card__title">${proyecto.titulo}</h3>
                    <p class="project-card__description">${proyecto.descripcion}</p>

                    <div class="project-card__tech">
                        ${proyecto.tecnologias.map(t => `<span class="badge">${t}</span>`).join('')}
                    </div>

                    <div class="project-card__links">
                        <a href="${proyecto.codigo}" class="project-card__link">Ver código</a>
                        <a href="${proyecto.demo}" class="project-card__link">Ver demo</a>
                    </div>
                </div>
            `;

            projectsGrid.appendChild(card);
        });

        proyectosAgregados = true;
        verMasBtn.textContent = "No hay más proyectos por ahora";
    });
}



/* ============================================================
   4. EFECTO SUAVE EN EL MENÚ AL HACER SCROLL
   ------------------------------------------------------------
   - Hace que el menú se vea más elegante al desplazarse.
   ============================================================ */

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
});