<script>
    const contenedor = document.getElementById('juego-contenedor');
    const arbol = document.getElementById('arbol');
    const basura = document.getElementById('basura');
    const puntuacionSpan = document.getElementById('puntuacion');
    let puntuacion = 0;
    let juegoActivo = true;
    let objetosMalos = ['🚬', '🏭', '🗑️']; // Lista de objetos a esquivar

    // Función de movimiento para pantallas táctiles y mouse
    function moverArbol(event) {
        if (!juegoActivo) return;
        
        // Obtiene la posición X del toque o del mouse
        let posicionX;
        if (event.touches) {
            posicionX = event.touches[0].clientX; // Tocar pantalla
        } else {
            posicionX = event.clientX; // Usar mouse
        }

        const rectContenedor = contenedor.getBoundingClientRect();
        let relativeX = posicionX - rectContenedor.left;
        
        // Limita el movimiento para que el árbol no se salga
        const anchoArbol = arbol.offsetWidth;
        relativeX = Math.max(anchoArbol / 2, Math.min(rectContenedor.width - anchoArbol / 2, relativeX));

        // Actualiza la posición del árbol
        arbol.style.left = `${relativeX}px`;
    }

    // Event listeners para el movimiento
    contenedor.addEventListener('touchmove', moverArbol, { passive: false });
    contenedor.addEventListener('mousemove', moverArbol);

    // Detección de colisiones y actualización del juego
    basura.addEventListener('animationiteration', () => {
        if (!juegoActivo) return;

        // Subir puntuación cada vez que pasa un objeto
        puntuacion++;
        puntuacionSpan.innerText = puntuacion;

        // Cambiar el objeto aleatoriamente
        const objAleatorio = objetosMalos[Math.floor(Math.random() * objetosMalos.length)];
        basura.innerText = objAleatorio;

        // Acelerar un poco la caída cada 5 puntos
        if (puntuacion % 5 === 0) {
            const velocidadActual = parseFloat(getComputedStyle(basura).animationDuration);
            const nuevaVelocidad = Math.max(0.5, velocidadActual - 0.2);
            basura.style.animationDuration = `${nuevaVelocidad}s`;
        }
    });

    // Bucle principal para verificar colisiones ( Game Over )
    function verificarColision() {
        if (!juegoActivo) return;

        const arbolRect = arbol.getBoundingClientRect();
        const basuraRect = basura.getBoundingClientRect();

        // Comprobar si los rectángulos se superponen
        if (
            arbolRect.left < basuraRect.right &&
            arbolRect.right > basuraRect.left &&
            arbolRect.top < basuraRect.bottom &&
            arbolRect.bottom > basuraRect.top
        ) {
            juegoActivo = false;
            alert(`¡Oh no! El árbol absorbió demasiada contaminación. Puntuación final: ${puntuacion}. Recarga la página para intentarlo de nuevo.`);
            basura.style.animationPlayState = 'paused'; // Detener animación
        }
        
        requestAnimationFrame(verificarColision); // Repetir
    }

    verificarColision(); // Iniciar detección
</script>
