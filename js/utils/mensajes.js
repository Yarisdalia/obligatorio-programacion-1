// Función para mostrar mensajes en la interfaz
function mostrarMensaje(elemento, tipo, mensaje) {
    elemento.className = `alert alert-${tipo}`; // alert-success, alert-danger, alert-warning, alert-info
    elemento.innerHTML = mensaje;
} 