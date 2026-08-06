// home.js - Funcionalidades de la Página de Inicio

// home.js - Funcionalidades de la Página de Inicio

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Menú con cambio de diseño al hacer scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // 2. Desplazamiento suave para los links internos del menú (#)
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. Efecto acordeón inteligente (cierra los otros al abrir uno)
    const todosLosDetails = document.querySelectorAll('.acordeon-container details');
    todosLosDetails.forEach(details => {
        details.addEventListener('toggle', function() {
            if (this.open) {
                todosLosDetails.forEach(otroDetails => {
                    if (otroDetails !== this) {
                        otroDetails.removeAttribute('open');
                    }
                });
            }
        });
    });

});

// Efecto de aparición suave al hacer scroll
const secciones = document.querySelectorAll('.curso-item, #Horarios table, .Taller\\*info, .acordeon-container');

const aparecerAlScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Deja de observarlo una vez que apareció
        }
    });
}, { threshold: 0.15 }); // Se activa cuando se ve el 15% del elemento

secciones.forEach(sec => {
    sec.classList.add('efecto-oculto'); // Le damos el estado inicial por JS
    aparecerAlScroll.observe(sec);
});

// Resaltar el menú según la sección visible
const linksMenu = document.querySelectorAll('nav ul li a');
const seccionesHome = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let seccionActual = '';
    
    seccionesHome.forEach(seccion => {
        const seccionTop = seccion.offsetTop;
        if (window.scrollY >= (seccionTop - 150)) {
            seccionActual = seccion.getAttribute('id');
        }
    });

    linksMenu.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${seccionActual}` || (seccionActual === 'Inicio' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// Botón Volver Arriba dinámico
const botonSubir = document.createElement('button');
botonSubir.innerHTML = '<i class="fas fa-arrow-up"></i>';
botonSubir.className = 'btn-back-to-top';
document.body.appendChild(botonSubir);

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        botonSubir.classList.add('mostrar');
    } else {
        botonSubir.classList.remove('mostrar');
    }
});

botonSubir.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==========================================================================
// LÓGICA INTERACTIVA PARA LA SECCIÓN DE CURSOS (PRECIOS FIJOS Y WHATSAPP)
// ==========================================================================

const TELEFONO_INSCRIPCIONES = "5491155153397";
const itemsCursosHome = document.querySelectorAll('#Cursos .curso-item');

itemsCursosHome.forEach(curso => {
    const btnInscribir = curso.querySelector('.btn-inscribir');
    
    if (btnInscribir) {
        btnInscribir.addEventListener('click', () => {
            const nombreCurso = curso.querySelector('h3') ? curso.querySelector('h3').textContent : 'Curso';
            const precioSpan = curso.querySelector('.precio-curso');
            const precioTexto = precioSpan ? precioSpan.textContent : '';

            // Armamos el mensaje automático para WhatsApp
            const mensajeWhatsApp = `¡Hola Della Mia Terra! Me interesa inscribirme en la propuesta: "${nombreCurso}" (${precioTexto}). ¿Tienen cupos o me podrían indicar cómo reservar?`;

            // Abrimos el enlace de WhatsApp
            const urlWhatsApp = `https://wa.me/${TELEFONO_INSCRIPCIONES}?text=${encodeURIComponent(mensajeWhatsApp)}`;
            window.open(urlWhatsApp, '_blank');
        });
    }
});
            });
        }
    });
