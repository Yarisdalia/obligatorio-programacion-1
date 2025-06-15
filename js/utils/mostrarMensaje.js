function mostrarMensaje(contenedor, tipo, mensaje) {
    contenedor.innerHTML = '<div class="alert alert-' + tipo + '">' + mensaje + '</div>';
}
