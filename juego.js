// Lógica del Minijuego: ¡Protege al Arbolito!
const contenedor = document.getElementById('juego-contenedor');
const arbol = document.getElementById('arbol');
const basura = document.getElementById('basura');
const puntuacionSpan = document.getElementById('puntuacion');

let puntuacion = 0;
let juegoActivo = true;
let objetosMalos = ['🚬', '🏭', '🗑️'];

// Posición horizontal del árbol (porcentaje o píxeles)
let arbolX = contenedor.clientWidth / 2 - 24; // centrado inicial
arbol.style.left = `${arbolX}px`;

// Control de movimiento táctil y del ratón
function moverArbol(event) {
    if (!juegoActivo) return;
    
    // Evita que la página haga scroll o zoom al tocar el juego
    event.preventDefault();

    let posicionX;
    if (event.touches) {
        posicionX = event.touches[0].clientX; // Toco pantalla en móvil
    } else {
        posicionX = event.clientX; // Mouse en PC
    }

    const rectContenedor = contenedor.getBoundingClientRect();
    let relativeX = posicionX - rectContenedor.left;
    
    // Limitar para que el árbol no salga del contenedor
    const anchoArbol = arbol.offsetWidth;
    arbolX = Math.max(0, Math.min(rectContenedor.width - anchoArbol, relativeX - (anchoArbol / 2)));

    arbol.style.left = `${arbolX}px`;
}

// IMPORTANTE: { passive: false } permite usar event.preventDefault() en celulares
contenedor.addEventListener('touchmove', moverArbol, { passive: false });
contenedor.addEventListener('touchstart', moverArbol, { passive: false });
contenedor.addEventListener('mousemove', moverArbol);

// Coordenadas y velocidad de la basura manejadas por JavaScript para colisión perfecta
let basuraY = -50;
let basuraX = Math.random() * (contenedor.clientWidth - 40);
let velocidadCaida = 3; 

basura.style.position = 'absolute';

function reiniciarBasura() {
    basuraY = -50;
    basuraX = Math.random() * (contenedor.clientWidth - 40);
    basura.style.left = `${basuraX}px`;
    
    // Cambiar objeto aleatorio
    const objAleatorio = objetosMalos[Math.floor(Math.random() * objetosMalos.length)];
    basura.innerText = objAleatorio;
}

// Bucle principal del juego (Animación y Colisiones)
function actualizarJuego() {
    if (!juegoActivo) return;

    // Mover la basura hacia abajo
    basuraY += velocidadCaida;
    basura.style.top = `${basuraY}px`;
    basura.style.left = `${basuraX}px`;

    // Si la basura llega al fondo, suma punto y se reinicia arriba
    if (basuraY > contenedor.clientHeight) {
        puntuacion++;
        puntuacionSpan.innerText = puntuacion;
        reiniciarBasura();

        // Aumentar dificultad cada 5 puntos
        if (puntuacion % 5 === 0) {
            velocidadCaida += 0.5;
        }
    }

    // --- DETECCIÓN DE COLISIÓN EXACTA ---
    const arbolRect = arbol.getBoundingClientRect();
    const basuraRect = basura.getBoundingClientRect();

    if (
        arbolRect.left < basuraRect.right &&
        arbolRect.right > basuraRect.left &&
        arbolRect.top < basuraRect.bottom &&
        arbolRect.bottom > basuraRect.top
    ) {
        juegoActivo = false;
        alert(`¡Oh no! El árbol absorbió demasiada contaminación. Puntuación final: ${puntuacion}. Recarga la página para intentarlo de nuevo.`);
        return; // Detiene el bucle
    }

    requestAnimationFrame(actualizarJuego);
}

// Iniciar juego
reiniciarBasura();
requestAnimationFrame(actualizarJuego);
