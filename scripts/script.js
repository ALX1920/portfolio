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
   - Permite copiar el correo con clic o con teclado (Enter/Espacio),
     ya que los botones usan role="button" en vez de <button>.
   - Da retroalimentación visual al usuario.
   ============================================================ */

function copiarTexto(elementoTexto, elementoBoton) {
    navigator.clipboard.writeText(elementoTexto.textContent.trim())
        .then(() => {
            const original = elementoBoton.textContent;
            elementoBoton.textContent = 'Copiado';
            setTimeout(() => { elementoBoton.textContent = original; }, 1500);
        })
        .catch(err => console.error('Error al copiar:', err));
}

function activarCopiado(idTexto, idBoton) {
    const texto = document.getElementById(idTexto);
    const boton = document.getElementById(idBoton);
    if (!texto || !boton) return;

    boton.addEventListener('click', () => copiarTexto(texto, boton));
    boton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            copiarTexto(texto, boton);
        }
    });
}

activarCopiado('email-gmail', 'copy-gmail');
activarCopiado('email-outlook', 'copy-outlook');


/* ============================================================
   2. ANIMACIONES SUAVES AL HACER SCROLL
   ------------------------------------------------------------
   - Hace que las secciones aparezcan suavemente.
   - Si el navegador no soporta IntersectionObserver, se muestra
     todo de inmediato (sin animación) para no dejar contenido oculto.
   ============================================================ */

const elementosAnimados = document.querySelectorAll('.section, .project-card, .blog-card, .skills-block');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // ya no hace falta seguir observando
            }
        });
    }, {
        threshold: 0.2
    });

    elementosAnimados.forEach(el => observer.observe(el));
} else {
    elementosAnimados.forEach(el => el.classList.add('visible'));
}


/* ============================================================
   3. MOSTRAR MÁS PROYECTOS (DINÁMICO)
   ------------------------------------------------------------
   - Permite agregar más proyectos sin recargar la página.
   - Ideal para cuando se creen nuevos trabajos.
   ============================================================ */

const verMasBtn = document.getElementById('btn-ver-mas-proyectos');
const projectsGrid = document.querySelector('.projects-grid');

const proyectosExtra = [
    {
        titulo: "Proyecto adicional 1",
        descripcion: "Descripción breve del proyecto.",
        tecnologias: ["HTML", "CSS", "JS"],
        imagen: "img/proyecto-extra1.png",
        codigo: "#",
        demo: "#"
    },
    {
        titulo: "Proyecto adicional 2",
        descripcion: "Otro proyecto que puedes agregar.",
        tecnologias: ["Python", "Linux"],
        imagen: "img/proyecto-extra2.png",
        codigo: "#",
        demo: "#"
    }
];

let proyectosAgregados = false;

if (verMasBtn && projectsGrid) {
    verMasBtn.addEventListener('click', (e) => {
        e.preventDefault(); // es un <a href="#">, evita saltar al inicio
        if (proyectosAgregados) return;

        proyectosExtra.forEach(proyecto => {
            const card = document.createElement('article');
            card.classList.add('project-card');

            card.innerHTML = `
                <div class="project-card__image-wrapper">
                    <img src="${proyecto.imagen}" alt="Captura de ${proyecto.titulo}" class="project-card__image">
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

if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('header--scrolled', window.scrollY > 20);
    });
}
