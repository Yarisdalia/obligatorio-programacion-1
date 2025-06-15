function initDashboardPaseador() {
    const paseador = sistema.userLogged;
    
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
    const contenido = document.querySelector("#contenidoPanelPaseador");
    const paseador = sistema.userLogged;
    
    // Usar template de contrataciones pendientes
    const template = document.querySelector("#paseador-contrataciones-pendientes");
    contenido.innerHTML = template.innerHTML;
    
    // Obtener contrataciones pendientes
    const contratacionesPendientes = sistema.getContratacionesPendientes(paseador);
    const contenidoContratacionesPendientes = document.querySelector("#contenidoContratacionesPendientes");
    
    if (contratacionesPendientes.length === 0) {
        // Usar template sin contrataciones pendientes
        const templateSin = document.querySelector("#paseador-sin-pendientes");
        contenidoContratacionesPendientes.innerHTML = templateSin.innerHTML;
    } else {
        // Usar template de tabla de contrataciones pendientes
        const templateTabla = document.querySelector("#paseador-tabla-pendientes");
        contenidoContratacionesPendientes.innerHTML = templateTabla.innerHTML;
        
        // Llenar la tabla
        const tbody = document.querySelector("#tablaContratacionesPendientes");
        for (let i = 0; i < contratacionesPendientes.length; i++) {
            const contratacion = contratacionesPendientes[i];
            let cuposNecesarios;
            if (contratacion.cliente.perro.tamano === "grande") {
                cuposNecesarios = 4;
            } else if (contratacion.cliente.perro.tamano === "mediano") {
                cuposNecesarios = 2;
            } else {
                cuposNecesarios = 1;
            }
            
            const row = document.createElement("tr");
            row.innerHTML = '<td>' + contratacion.id + '</td>' +
                '<td>' + contratacion.cliente.username + '</td>' +
                '<td>' + contratacion.cliente.perro.nombre + '</td>' +
                '<td>' + contratacion.cliente.perro.tamano + '</td>' +
                '<td>' + cuposNecesarios + '</td>' +
                '<td>' +
                    '<button class="btn btn-success btn-sm" onclick="aprobarContratacion(' + contratacion.id + ')">' +
                        'Aprobar' +
                    '</button>' +
                    '<button class="btn btn-danger btn-sm ms-1" onclick="rechazarContratacion(' + contratacion.id + ')">' +
                        'Rechazar' +
                    '</button>' +
                '</td>';
            tbody.appendChild(row);
        }
    }
}

function aprobarContratacion(contratacionId) {
    const mensaje = document.querySelector("#mensajeProcesamiento");
    
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
    const resultado = sistema.aprobarContratacion(contratacion);
    
    if (contratacion.estado === "aprobada") {
        mostrarMensaje(mensaje, "success", resultado + ". Se han rechazado automáticamente las contrataciones incompatibles.");
    } else {
        mostrarMensaje(mensaje, "warning", resultado);
    }
    
    // Recargar la vista inmediatamente
    mostrarContratacionesPendientes();
}

function rechazarContratacion(contratacionId) {
    const mensaje = document.querySelector("#mensajeProcesamiento");
    
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
    
    sistema.rechazarContratacion(contratacion);
    
    // Recargar la vista inmediatamente
    mostrarContratacionesPendientes();
}

function mostrarPerrosAsignados() {
    const contenido = document.querySelector("#contenidoPanelPaseador");
    const paseador = sistema.userLogged;
    
    // Usar template de perros asignados
    const template = document.querySelector("#paseador-perros-asignados");
    contenido.innerHTML = template.innerHTML;
    
    // Obtener datos del paseador
    const perrosAsignados = sistema.getPerrosAsignados(paseador);
    const cuposOcupados = sistema.calcularCuposOcupados(paseador);
    const porcentajeOcupacion = ((cuposOcupados / paseador.cupoMaximo) * 100).toFixed(1);
    
    // Actualizar estadísticas
    document.querySelector("#cuposOcupados").innerHTML = cuposOcupados;
    document.querySelector("#cuposMaximos").innerHTML = paseador.cupoMaximo;
    document.querySelector("#porcentajeOcupacion").innerHTML = porcentajeOcupacion + "%";
    
    // Mostrar contenido de perros
    const contenidoPerros = document.querySelector("#contenidoPerros");
    
    if (perrosAsignados.length === 0) {
        // Usar template sin perros
        const templateSin = document.querySelector("#paseador-sin-perros");
        contenidoPerros.innerHTML = templateSin.innerHTML;
    } else {
        // Usar template de tabla de perros
        const templateTabla = document.querySelector("#paseador-tabla-perros");
        contenidoPerros.innerHTML = templateTabla.innerHTML;
        
        // Llenar la tabla
        const tbody = document.querySelector("#tablaPerrosAsignados");
        for (let i = 0; i < perrosAsignados.length; i++) {
            const perro = perrosAsignados[i];
            let cuposPerro;
            if (perro.tamano === "grande") {
                cuposPerro = 4;
            } else if (perro.tamano === "mediano") {
                cuposPerro = 2;
            } else {
                cuposPerro = 1;
            }
            
            const row = document.createElement("tr");
            row.innerHTML = '<td>' + perro.nombre + '</td>' +
                '<td>' + perro.tamano + '</td>' +
                '<td>' + cuposPerro + '</td>';
            tbody.appendChild(row);
        }
    }
} 