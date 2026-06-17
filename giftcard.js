// Configuración: Teléfono de Dellamiaterra para recibir los pedidos
const TELEFONO_WHATSAPP = "5491155153397";

// Base de datos de tus Vouchers / GiftCards
const listaGiftCards = [
    {
        id: 1,
        titulo: "Taller de Cerámica 🏺",
        slogan: "4 clases para crear, conectar y transformar.",
        clases: [
            { nro: "CLASE 1: Construcción 👐", desc: "Modelado manual de tu primer cuenco y taza." },
            { nro: "CLASE 2: Identidad ✨", desc: "Diseño de texturas, sellos y aplicación de color (engobes)." },
            { nro: "CLASE 3: Preparación 🧽", desc: "Terminaciones, lijado y limpieza de las piezas bizcochadas." },
            { nro: "CLASE 4: Esmaltado 🎨", desc: "Baño de color y brillo final para impermeabilizar." }
        ],
        incluye: "Arcilla, engobes, esmalte y herramientas.",
        duracion: "2 horas por sesión.",
        resultado: "Te llevás tus piezas terminadas listas para usar.",
        validez: "Válido por un ciclo completo de 4 clases.",
        aclaracion: "* Los horneados de las piezas no están incluidos en el valor de la gift card."
    },
    {
        id: 2,
        titulo: "Seminario Intensivo ☕",
        slogan: "Un encuentro único para modelar tu propio set de café.",
        clases: [
            { nro: "PARTE 1: Modelado Práctico 🥣", desc: "Técnicas de pellizco y placas para tazas y portafiltro." },
            { nro: "PARTE 2: Decoración 🖌️", desc: "Esmaltado directo y texturas rústicas de taller." }
        ],
        incluye: "Todos los materiales de gres, café de especialidad y pastelería incluidos.",
        duracion: "1 jornada de 4 horas.",
        resultado: "Set de café horneado listo para retirar a las 2 semanas.",
        validez: "Válido únicamente para la fecha del seminario seleccionado.",
        aclaracion: "* Horneados y esmaltado final incluidos en este formato."
    }
];

function renderizarGiftCards() {
    const contenedor = document.getElementById("contenedor-giftcards");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    listaGiftCards.forEach(card => {
        let clasesHTML = "";
        card.clases.forEach(c => {
            clasesHTML += `
                <div class="class-item">
                    <span class="class-title">${c.nro}</span>
                    ${c.desc}
                </div>
            `;
        });

        const textoMensaje = `¡Hola Della Mia Terra! Me interesa consultar para comprar la GiftCard: "${card.titulo}". ¿Me pasarías los costos y medios de pago?`;
        const urlWhatsApp = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(textoMensaje)}`;

        const giftCardHTML = `
            <div class="gift-card">
                <div class="card-header">
                    <span class="v-label">Voucher de Regalo</span>
                    <h2 class="v-title">${card.titulo}</h2>
                </div>

                <div class="dedicatoria-voucher">
                    <p><strong>Para:</strong> <span class="text-para">___________</span></p>
                    <p><strong>De:</strong> <span class="text-de">___________</span></p>
                </div>

                <div class="card-body">
                    <p class="slogan">${card.slogan}</p>
                    
                    <div class="program">
                        ${clasesHTML}
                    </div>

                    <div class="details">
                        <p><strong>Incluye:</strong> ${card.incluye}</p>
                        <p><strong>Duración:</strong> ${card.duracion}</p>
                        <p><strong>Resultado:</strong> ${card.resultado}</p>
                    </div>

                    <div style="text-align: center; margin-top: 25px;">
                        <a href="${urlWhatsApp}" data-id="${card.id}" target="_blank" class="btn-comprar-gc">
                            <i class="fab fa-whatsapp"></i> Comprar esta GiftCard
                        </a>
                    </div>
                </div>

                <div class="card-footer">
                    <p>${card.validez}</p>
                    <p class="price-disclaimer">${card.aclaracion}</p>
                </div>
            </div>
        `;

        contenedor.innerHTML += giftCardHTML;
    });

    inicializarFormulario();
}

function inicializarFormulario() {
    const inputPara = document.getElementById('input-para');
    const inputDe = document.getElementById('input-de');

    if (inputPara && inputDe) {
        inputPara.addEventListener('input', (e) => {
            const nombresPara = document.querySelectorAll('.text-para');
            nombresPara.forEach(el => el.textContent = e.target.value || '___________');
            actualizarLinksWhatsApp();
        });

        inputDe.addEventListener('input', (e) => {
            const nombresDe = document.querySelectorAll('.text-de');
            nombresDe.forEach(el => el.textContent = e.target.value || '___________');
            actualizarLinksWhatsApp();
        });
    }
}

function actualizarLinksWhatsApp() {
    const para = document.getElementById('input-para').value;
    const de = document.getElementById('input-de').value;
    
    listaGiftCards.forEach(card => {
        const boton = document.querySelector(`.btn-comprar-gc[data-id="${card.id}"]`);
        if (boton) {
            let mensaje = `¡Hola Della Mia Terra! Me interesa comprar la GiftCard: "${card.titulo}".`;
            if (para) mensaje += ` Es un regalo para: ${para}.`;
            if (de) mensaje += ` De parte de: ${de}.`;
            mensaje += ` ¿Me pasarías los costos y medios de pago?`;
            
            boton.href = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
        }
    });
}

document.addEventListener("DOMContentLoaded", renderizarGiftCards);