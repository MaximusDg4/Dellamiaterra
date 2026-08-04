// =========================================================================
// CONFIGURACIÓN GLOBAL: Conexión con Google Sheets y WhatsApp
// =========================================================================
const SPREADSHEET_ID = "16V59XKXKq8wfFGBvxyPcL7i7fqf94tz0D04Ry-J_GUA"; 
const TAB_NAME = "Hoja 1"; // Asegurate de que tu pestaña se llame así
const TELEFONO_WHATSAPP = "5491155153397"; 

const PRODUCTOS_POR_PAGINA = 8; // Cuántos productos se ven por página
let paginaActual = 1;
let productosCompra = []; // Se va a rellenar dinámicamente desde Google Sheets

// Enlace que lee el Excel como datos estructurados JSON
const URL_GOOGLE_SHEETS = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(TAB_NAME)}`;

// NUEVA FUNCIÓN: Descarga los datos de Google antes de mostrar la tienda
async function conectarGoogleSheets() {
    try {
        const respuesta = await fetch(URL_GOOGLE_SHEETS);
        const texto = await respuesta.text();
        
        // Limpiamos el texto que devuelve Google para transformarlo en un JSON puro
        const jsonPuro = JSON.parse(texto.substr(47).slice(0, -2));
        const filas = jsonPuro.table.rows;

        // Mapeo automático adaptado a tu estructura (A=0, B=1, C=2, D=3...)
        productosCompra = filas.map((fila, index) => {
            return {
                id: fila.c[0] ? fila.c[0].v : (index + 1),
                titulo: fila.c[1] ? fila.c[1].v : "",
                precio: fila.c[2] ? fila.c[2].v : 0,
                imagen: fila.c[3] ? fila.c[3].v : "img/placeholder.jpg",
                categoria: fila.c[4] ? fila.c[4].v : "", // Por si usás categorías
                descripcion: fila.c[5] ? fila.c[5].v : ""
            };
        });

        // Una vez cargados los productos, arranca tu lógica normal de catálogo
        renderizarCatalogo();
        configurarPaginacion();

    } catch (error) {
        console.error("Error cargando el catálogo desde Google Sheets:", error);
        const contenedor = document.getElementById("catalogo-compra");
        if (contenedor) {
            contenedor.innerHTML = `<p style="text-align:center; color:#b05d48; font-weight:600; padding: 40px; grid-column: 1 / -1;">Hubo un problema al cargar los productos en tiempo real. Por favor, reintentá recargando la página.</p>`;
        }
    }
}

// TU FUNCIÓN ORIGINAL (Adaptada para soportar múltiples imágenes)
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

        // Separa las imágenes por comas si hay más de una en la celda
        const listaImagenes = prod.imagen 
            ? prod.imagen.split(',').map(url => url.trim()) 
            : ["img/placeholder.jpg"];
        
        const imagenPortada = listaImagenes[0];

        // Crea links ocultos para que baguetteBox arme la galería con las imágenes secundarias
        const imagenesAdicionalesHTML = listaImagenes.slice(1).map(url => `
            <a href="${url}" class="producto-imagen" title="${prod.titulo} - Dellamiaterra" style="display:none;"></a>
        `).join('');

        const tarjetaHTML = `
            <article class="producto-card">
                <a href="${imagenPortada}" class="producto-imagen" title="${prod.titulo} - Dellamiaterra">
                    <img src="${imagenPortada}" alt="${prod.titulo}">
                </a>
                ${imagenesAdicionalesHTML}
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

// TU FUNCIÓN ORIGINAL DE PAGINACIÓN
function configurarPaginacion() {
    const barraPaginacion = document.querySelector(".paginacion");
    if (!barraPaginacion) return;

    // Quitamos oyentes viejos para que no se dupliquen al cambiar de página
    barraPaginacion.replaceWith(barraPaginacion.cloneNode(true));
    
    // Volvemos a capturar el elemento clonado limpio
    const nuevaBarra = document.querySelector(".paginacion");
    
    nuevaBarra.addEventListener("click", function(e) {
        e.preventDefault(); 
        
        const objetivo = e.target;
        const totalPaginas = Math.ceil(productosCompra.length / PRODUCTOS_POR_PAGINA);

        if (objetivo.classList.contains("num-pag")) {
            paginaActual = parseInt(objetivo.textContent);
            renderizarCatalogo();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        if (objetivo.classList.contains("btn-pag") && objetivo.textContent.includes("Anterior")) {
            if (paginaActual > 1) {
                paginaActual--;
                renderizarCatalogo();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        if (objetivo.classList.contains("btn-pag") && objetivo.textContent.includes("Siguiente")) {
            if (paginaActual < totalPaginas) {
                paginaActual++;
                renderizarCatalogo();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
}

// TU FUNCIÓN ORIGINAL DE BOTONES ACTIVOS
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

// Inicializar conectando primero con Google Sheets
document.addEventListener("DOMContentLoaded", conectarGoogleSheets);
