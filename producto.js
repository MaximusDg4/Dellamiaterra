// Configuración global
const TELEFONO_WHATSAPP = "5491155153397"; 
const PRODUCTOS_POR_PAGINA = 6; // Definí cuántos productos querés ver por página
let paginaActual = 1;

// Base de datos completa (Aquí podés seguir agregando el producto 13, 14, 15, etc.)
const productosCompra = [
    {
        id: 1,
        titulo: "Jarra de Cerámica",
        descripcion: "Pieza de gres con esmalte reactivo en tonos turquesa y azul marino.",
        precio: 18500,
        imagen: "img/jarran1.jpeg"
    },
    {
        id: 2,
        titulo: "Dúo de jarrones",
        descripcion: "Par de jarrones de cerámica con esmalte de blanco hueso y con textura esmaltada en tonos ocre y marrón oscuro moteado.",
        precio: 32000,
        imagen: "img/producto 1.jpeg"
    },
    {
        id: 3,
        titulo: "Fuente de Cerámica",
        descripcion: "Fuente única de cerámica modelada a mano con un esmalte reactivo texturizado con tonos vibrantes de verde oliva y ocre.",
        precio: 24000,
        imagen: "img/producto2.jpeg"
    },
    {
        id: 4,
        titulo: "Colección de cerámica artesanal",
        descripcion: "La Colección incluye tazas, tazones, jarras, macetas y objetos decorativos modelados a mano.",
        precio: 45000,
        imagen: "img/productos2.jpeg"
    },
    {
        id: 5,
        titulo: "Taza de Cerámica",
        descripcion: "Taza artesanal de cerámica blanca con una distintiva superficie alveolada.",
        precio: 8500,
        imagen: "img/productos3.jpeg"
    },
    {
        id: 6,
        titulo: "Set de Tazones de Cerámica",
        descripcion: "Par de tazones de cerámica artesanales pintados a mano con franjas en tonos amarillo, naranja, y lila en la base.",
        precio: 16000,
        imagen: "img/productos4.jpeg"
    },
    {
        id: 7,
        titulo: "Bandeja Altiplano",
        descripcion: "Una pieza de gres de gran formato que combina la fuerza del ocre volcánico con la pureza del blanco tiza.",
        precio: 27500,
        imagen: "img/plato3.jpeg"
    },
    {
        id: 8,
        titulo: "Tetera abismo marino",
        descripcion: "Tetera modelada a mano con un esmalte reactivo que evoca la profundidad y las mareas del océano con tonos turquesas y negros profundos.",
        precio: 35000,
        imagen: "img/tetera.jpeg"
    },
    {
        id: 9,
        titulo: "Set Dúo de Tazas",
        descripcion: "Dúo de tazas modelados a mano con esmaltes en variante turquesa y óxido.",
        precio: 15500,
        imagen: "img/tazas1.jpeg"
    },
    {
        id: 10,
        titulo: "Dúo de Tazas con orejas de conejo",
        descripcion: "Pareja de tazas con tapa modeladas a mano con esmalte blanco cremoso. Una presenta un delicado lazo celeste, y la otra, un ramillete de rosas con color rosa.",
        precio: 19000,
        imagen: "img/tazasconejos.jpeg"
    },
    {
        id: 11,
        titulo: "Set de cuencos",
        descripcion: "Cuencos en gres con esmaltes de reducción y saturación metálica. Cada cuenco presenta un tratamiento de superficie diferenciado.",
        precio: 22000,
        imagen: "img/tazas.jpeg"
    },
    {
        id: 12,
        titulo: "Fuente de gres Orgánico",
        descripcion: "Pieza única modelada a mano con bordes irregulares. Presenta una composición cromática mediante la superposición de esmaltes reactivos.",
        precio: 26000,
        imagen: "img/plato.jpeg"
    }
    // Podés meter más objetos acá abajo siguiendo la misma estructura y se van a ir acomodando solos en la página 3, 4, etc.
];

// Función principal para mostrar los productos de la página activa
function renderizarCatalogo() {
    const contenedor = document.getElementById("catalogo-compra");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    // Lógica matemática para saber qué productos recortar según la página
    const indiceInicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const indiceFin = indiceInicio + PRODUCTOS_POR_PAGINA;
    const productosFiltrados = productosCompra.slice(indiceInicio, indiceFin);

    productosFiltrados.forEach(prod => {
        const precioFormateado = new Intl.NumberFormat('es-AR', { 
            style: 'currency', 
            currency: 'ARS', 
            maximumFractionDigits: 0 
        }).format(prod.precio);
        
        const textoMensaje = `Hola Della Mia Terra! Me interesa consultar por la compra de: ${prod.titulo} (${precioFormateado}). ¿Está disponible?`;
        const urlWhatsApp = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(textoMensaje)}`;

        const tarjetaHTML = `
            <article class="producto-card">
                <a href="${prod.imagen}" class="producto-imagen" title="${prod.titulo} - Dellamiaterra">
                    <img src="${prod.imagen}" alt="${prod.titulo}">
                </a>
                <div class="producto-info">
                    <div>
                        <h3>${prod.titulo}</h3>
                        <p>${prod.descripcion}</p>
                    </div>
                    
                    <div class="producto-meta">
                        <span class="precio">${precioFormateado}</span>
                        <a href="${urlWhatsApp}" target="_blank" class="btn-consulta">
                            <i class="fab fa-whatsapp"></i> Consultar
                        </a>
                    </div>
                </div>
            </article>
        `;
        
        contenedor.innerHTML += tarjetaHTML;
    });

    // Reactivar la galería de imágenes flotantes para el grupo visible
    if (typeof baguetteBox !== 'undefined') {
        baguetteBox.run('.baguetteBoxGaleria', {
            animation: 'slideIn',
            buttons: true,
            noScrollbars: true
        });
    }

    // Actualizar el diseño visual de la botonera de paginación abajo
    actualizarBotonesPaginacion();
}

// Función para manejar los clics de la barra de paginación
function configurarPaginacion() {
    const barraPaginacion = document.querySelector(".paginacion");
    if (!barraPaginacion) return;

    barraPaginacion.addEventListener("click", function(e) {
        e.preventDefault(); // Evita que la página salte para arriba al hacer click
        
        const objetivo = e.target;
        const totalPaginas = Math.ceil(productosCompra.length / PRODUCTOS_POR_PAGINA);

        // Si tocó un número de página específico
        if (objetivo.classList.contains("num-pag")) {
            paginaActual = parseInt(objetivo.textContent);
            renderizarCatalogo();
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube suavemente al inicio del catálogo
        }
        
        // Si tocó el botón "Anterior"
        if (objetivo.classList.contains("btn-pag") && objetivo.textContent.includes("Anterior")) {
            if (paginaActual > 1) {
                paginaActual--;
                renderizarCatalogo();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        // Si tocó el botón "Siguiente"
        if (objetivo.classList.contains("btn-pag") && objetivo.textContent.includes("Siguiente")) {
            if (paginaActual < totalPaginas) {
                paginaActual++;
                renderizarCatalogo();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
}

// Función interna para prender/apagar la clase "activa" en el número correspondiente
function actualizarBotonesPaginacion() {
    const numerosPagina = document.querySelectorAll(".num-pag");
    numerosPagina.forEach(boton => {
        if (parseInt(boton.textContent) === paginaActual) {
            boton.classList.add("activa");
        } else {
            boton.classList.remove("activa");
        }
    });
}

// Inicializar todo al cargar la web
document.addEventListener("DOMContentLoaded", () => {
    renderizarCatalogo();
    configurarPaginacion();
});