// Función auxiliar para mostrar mensajes
function mostrarMensaje(contenedor, tipo, mensaje) {
    contenedor.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;
}

function initDashboardPaseador() {
    let paseador = sistema.userLogged;
    
    // Mostrar información del paseador
    document.querySelector("#nombrePaseador").innerHTML = paseador.nombre;
    
    // Configurar botón de logout
    document.querySelector("#btnLogoutPaseador").addEventListener("click", function() {
        sistema.userLogged = null;
        navigateTo("login", initLogin);
    });
    
    // Configurar botones de navegación
    document.querySelector("#btnContratacionesPendientes").addEventListener("click", mostrarContratacionesPendientes);
    document.querySelector("#btnPerrosAsignados").addEventListener("click", mostrarPerrosAsignados);
    
    // Mostrar contrataciones pendientes por defecto
    mostrarContratacionesPendientes();
}

function mostrarContratacionesPendientes() {
    let contenido = document.querySelector("#contenidoPaseador");
    let paseador = sistema.userLogged;
    
    // Usar template de contrataciones pendientes
    let template = document.querySelector("#paseador-contrataciones-pendientes");
    contenido.innerHTML = template.innerHTML;
    
    // Obtener contrataciones pendientes
    let contratacionesPendientes = sistema.getContratacionesPendientes(paseador);
    let contenidoContratacionesPendientes = document.querySelector("#contenidoContratacionesPendientes");
    
    if (contratacionesPendientes.length === 0) {
        // Usar template sin contrataciones pendientes
        let templateSin = document.querySelector("#paseador-sin-pendientes");
        contenidoContratacionesPendientes.innerHTML = templateSin.innerHTML;
    } else {
        // Usar template de tabla de contrataciones pendientes
        let templateTabla = document.querySelector("#paseador-tabla-pendientes");
        contenidoContratacionesPendientes.innerHTML = templateTabla.innerHTML;
        
        // Llenar la tabla
        let tbody = document.querySelector("#tablaContratacionesPendientes");
        for (let i = 0; i < contratacionesPendientes.length; i++) {
            let contratacion = contratacionesPendientes[i];
            let cuposNecesarios = contratacion.cliente.perro.tamano === "grande" ? 4 : 
                                (contratacion.cliente.perro.tamano === "mediano" ? 2 : 1);
            
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${contratacion.id}</td>
                <td>${contratacion.cliente.username}</td>
                <td>${contratacion.cliente.perro.nombre}</td>
                <td>${contratacion.cliente.perro.tamano}</td>
                <td>${cuposNecesarios}</td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="aprobarContratacion(${contratacion.id})">
                        Aprobar
                    </button>
                    <button class="btn btn-danger btn-sm ms-1" onclick="rechazarContratacion(${contratacion.id})">
                        Rechazar
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        }
    }
}

function aprobarContratacion(contratacionId) {
    let mensaje = document.querySelector("#mensajeProcesamiento");
    
    // Buscar la contratación
    let contratacion = null;
    for (let i = 0; i < sistema.contrataciones.length; i++) {
        if (sistema.contrataciones[i].id === contratacionId) {
            contratacion = sistema.contrataciones[i];
            break;
        }
    }
    
    if (!contratacion) {
        mostrarMensaje(mensaje, "danger", "Contratación no encontrada");
        return;
    }
    
    // Aprobar la contratación
    let resultado = sistema.aprobarContratacion(contratacion);
    
    if (contratacion.estado === "aprobada") {
        mostrarMensaje(mensaje, "success", resultado + ". Se han rechazado automáticamente las contrataciones incompatibles.");
    } else {
        mostrarMensaje(mensaje, "warning", resultado);
    }
    
    // Recargar la vista inmediatamente
    mostrarContratacionesPendientes();
}

function rechazarContratacion(contratacionId) {
    let mensaje = document.querySelector("#mensajeProcesamiento");
    
    // Buscar la contratación
    let contratacion = null;
    for (let i = 0; i < sistema.contrataciones.length; i++) {
        if (sistema.contrataciones[i].id === contratacionId) {
            contratacion = sistema.contrataciones[i];
            break;
        }
    }
    
    if (!contratacion) {
        mostrarMensaje(mensaje, "danger", "Contratación no encontrada");
        return;
    }
    
    // Rechazar la contratación con motivo genérico
    let motivo = "Rechazada por el paseador";
    let resultado = sistema.rechazarContratacion(contratacion, motivo);
    
    mostrarMensaje(mensaje, "info", resultado + ". Motivo: " + (contratacion.motivoRechazo || 'No especificado'));
    
    // Recargar la vista inmediatamente
    mostrarContratacionesPendientes();
}

function mostrarPerrosAsignados() {
    let contenido = document.querySelector("#contenidoPaseador");
    let paseador = sistema.userLogged;
    
    // Usar template de perros asignados
    let template = document.querySelector("#paseador-perros-asignados");
    contenido.innerHTML = template.innerHTML;
    
    // Obtener datos del paseador
    let perrosAsignados = sistema.getPerrosAsignados(paseador);
    let cuposOcupados = sistema.calcularCuposOcupados(paseador);
    let porcentajeOcupacion = ((cuposOcupados / paseador.cupoMaximo) * 100).toFixed(1);
    
    // Actualizar estadísticas
    document.querySelector("#cuposOcupados").innerHTML = cuposOcupados;
    document.querySelector("#cuposMaximos").innerHTML = paseador.cupoMaximo;
    document.querySelector("#porcentajeOcupacion").innerHTML = porcentajeOcupacion + "%";
    
    // Mostrar contenido de perros
    let contenidoPerros = document.querySelector("#contenidoPerros");
    
    if (perrosAsignados.length === 0) {
        // Usar template sin perros
        let templateSin = document.querySelector("#paseador-sin-perros");
        contenidoPerros.innerHTML = templateSin.innerHTML;
    } else {
        // Usar template de tabla de perros
        let templateTabla = document.querySelector("#paseador-tabla-perros");
        contenidoPerros.innerHTML = templateTabla.innerHTML;
        
        // Llenar la tabla
        let tbody = document.querySelector("#tablaPerrosAsignados");
        for (let i = 0; i < perrosAsignados.length; i++) {
            let perro = perrosAsignados[i];
            let cuposPerro = perro.tamano === "grande" ? 4 : (perro.tamano === "mediano" ? 2 : 1);
            
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${perro.nombre}</td>
                <td>${perro.tamano}</td>
                <td>${cuposPerro}</td>
            `;
            tbody.appendChild(row);
        }
    }
} 