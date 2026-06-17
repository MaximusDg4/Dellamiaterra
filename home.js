// home.js - Funcionalidades de la Página de Inicio

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Menú con cambio de diseño al hacer scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
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
        const seccionHeight = seccion.clientHeight;
        // Detecta si el scroll está sobre la sección
        if (window.scrollY >= (seccionTop - 150)) {
            seccionActual = seccion.getAttribute('id');
        }
    });

    linksMenu.forEach(link => {
        link.classList.remove('active'); // Nota: podés cambiar 'active' por la clase que uses para marcar el link actual
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
    // LÓGICA INTERACTIVA PARA LA SECCIÓN DE CURSOS
    // ==========================================================================
    
    // Teléfono unificado del taller para inscripciones
    const TELEFONO_INSCRIPCIONES = "5491155153397";
    const itemsCursosHome = document.querySelectorAll('#Cursos .curso-item');

    itemsCursosHome.forEach(curso => {
        // Obtenemos el precio base del atributo data-precio
        const precioBase = parseInt(curso.getAttribute('data-precio'));
        const precioSpan = curso.querySelector('.precio-curso');
        const selectoresPago = curso.querySelectorAll('.pago-selector input');

        // 1. Escuchar cambios en los botones de opción (Lista vs Efectivo)
        selectoresPago.forEach(radio => {
            radio.addEventListener('change', (e) => {
                let precioFinal = precioBase;

                // Si selecciona efectivo, aplica un 10% de descuento automático
                if (e.target.value === 'efectivo') {
                    precioFinal = precioBase * 0.9;
                }

                // Formateamos el número a pesos argentinos de forma limpia ($ 28.000)
                const formatoMoneda = new Intl.NumberFormat('es-AR', {
                    style: 'currency', currency: 'ARS', maximumFractionDigits: 0
                }).format(precioFinal);

                precioSpan.textContent = `Precio: ${formatoMoneda}`;
            });
        });

        // 2. Control del botón de inscripción por WhatsApp
        const btnInscribir = curso.querySelector('.btn-inscribir');
        if (btnInscribir) {
            btnInscribir.addEventListener('click', () => {
                const nombreCurso = curso.querySelector('h3').textContent;
                const modalidadSeleccionada = curso.querySelector('.pago-selector input:checked').value;
                const textoModalidad = modalidadSeleccionada === 'efectivo' ? 'Efectivo / Transferencia (con descuento)' : 'Tarjeta / Lista';
                const precioActual = precioSpan.textContent.replace('Precio: ', '');

                // Armamos el mensaje automático súper claro para el taller
                const mensajeWhatsApp = `¡Hola Della Mia Terra! Me interesa inscribirme en la propuesta: "${nombreCurso}". Vi en la web que seleccionando la opción de pago en "${textoModalidad}" queda en ${precioActual}. ¿Tienen cupos o me podrían indicar cómo reservar?`;

                // Creamos y abrimos el link seguro de WhatsApp
                const urlWhatsApp = `https://wa.me/${TELEFONO_INSCRIPCIONES}?text=${encodeURIComponent(mensajeWhatsApp)}`;
                window.open(urlWhatsApp, '_blank');
            });
        }
    });