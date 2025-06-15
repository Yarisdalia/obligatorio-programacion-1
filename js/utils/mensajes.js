// Función para mostrar mensajes en la interfaz
function mostrarMensaje(elemento, tipo, mensaje) {
    elemento.className = `alert alert-${tipo}`;
    elemento.innerHTML = mensaje;
    elemento.style.display = "block";
} 