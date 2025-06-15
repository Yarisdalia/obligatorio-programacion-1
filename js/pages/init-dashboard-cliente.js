function initDashboardCliente() {
    let cliente = sistema.userLogged;
    
    // Mostrar información del cliente y su perro
    document.querySelector("#nombreCliente").innerHTML = cliente.nombre;
    document.querySelector("#nombrePerro").innerHTML = cliente.perro.nombre;
    document.querySelector("#tamanoPerro").innerHTML = cliente.perro.tamano;
    
    // Configurar botones de navegación
    document.querySelector("#btnLogoutCliente").addEventListener("click", function() {
        sistema.userLogged = null;
        navigateTo("login", initLogin);
    });
    
    document.querySelector("#btnContratarServicio").addEventListener("click", mostrarContratarServicio);
    document.querySelector("#btnVerContratacion").addEventListener("click", mostrarVerContratacion);
    document.querySelector("#btnInfoPaseadores").addEventListener("click", mostrarInfoPaseadores);
    
    // Mostrar contratar servicio por defecto
    mostrarContratarServicio();
}

function mostrarContratarServicio() {
    let contenido = document.querySelector("#contenidoCliente");
    let cliente = sistema.userLogged;
    
    // Verificar si ya tiene una contratación actual (pendiente o aprobada)
    let contratacionActual = sistema.getContratacionActual(cliente);
    
    if (contratacionActual) {
        // Usar template de estado de contratación
        let template = document.querySelector("#cliente-contratacion-estado");
        contenido.innerHTML = template.innerHTML;
        
        // Configurar clases y datos
        let estadoClass = contratacionActual.estado === "aprobada" ? "bg-success" : "bg-warning";
        let estadoBadge = contratacionActual.estado === "aprobada" ? "bg-success" : "bg-warning";
        let mensaje = contratacionActual.estado === "aprobada" ? 
            "¡Tu contratación ha sido aprobada! Tu perro ya está siendo paseado." :
            "Tienes una contratación pendiente. Debes esperar a que el paseador la apruebe o rechace.";
        
        document.querySelector("#estadoClass").className = "card-header " + estadoClass;
        document.querySelector("#nombrePaseadorContrato").innerHTML = contratacionActual.paseador.nombre;
        document.querySelector("#usernamePaseadorContrato").innerHTML = contratacionActual.paseador.username;
        document.querySelector("#estadoBadge").className = "badge " + estadoBadge;
        document.querySelector("#estadoBadge").innerHTML = contratacionActual.estado;
        document.querySelector("#nombrePerroContrato").innerHTML = contratacionActual.cliente.perro.nombre;
        document.querySelector("#tamanoPerroContrato").innerHTML = contratacionActual.cliente.perro.tamano;
        document.querySelector("#mensajeEstado").innerHTML = mensaje;
        
        if (contratacionActual.estado === "pendiente") {
            document.querySelector("#mensajeCancelacion").style.display = "block";
            document.querySelector("#mensajeCancelacion").innerHTML = 'Puedes cancelar esta contratación desde la sección "Ver Mi Contratación".';
        }
        
        return;
    }
    
    // Usar template de contratar servicio
    let template = document.querySelector("#cliente-contratar-servicio");
    contenido.innerHTML = template.innerHTML;
    
    // Obtener paseadores disponibles
    let paseadoresDisponibles = sistema.getPaseadoresDisponibles(cliente);
    let contenidoContratacion = document.querySelector("#contenidoContratacion");
    
    if (paseadoresDisponibles.length === 0) {
        // Usar template de sin paseadores
        let templateSin = document.querySelector("#cliente-sin-paseadores");
        contenidoContratacion.innerHTML = templateSin.innerHTML;
        document.querySelector("#tamanoPerroSin").innerHTML = cliente.perro.tamano;
    } else {
        // Usar template de formulario
        let templateForm = document.querySelector("#cliente-form-paseador");
        contenidoContratacion.innerHTML = templateForm.innerHTML;
        
        // Llenar el select con paseadores
        let select = document.querySelector("#selectPaseador");
        for (let i = 0; i < paseadoresDisponibles.length; i++) {
            let paseador = paseadoresDisponibles[i];
            let cuposOcupados = sistema.calcularCuposOcupados(paseador);
            let cuposDisponibles = paseador.cupoMaximo - cuposOcupados;
            let option = document.createElement("option");
            option.value = paseador.id;
            option.innerHTML = paseador.username + " (Cupos disponibles: " + cuposDisponibles + "/" + paseador.cupoMaximo + ")";
            select.appendChild(option);
        }
        
        // Configurar botón de solicitar contratación
        let btnSolicitar = document.querySelector("#btnSolicitarContratacion");
        btnSolicitar.addEventListener("click", function() {
            let selectPaseador = document.querySelector("#selectPaseador");
            let paseadorId = selectPaseador.value;
            let mensaje = document.querySelector("#mensajeContratacion");
            
            if (paseadorId === "") {
                mostrarMensaje(mensaje, "danger", "Por favor selecciona un paseador");
                return;
            }
            
            // Buscar el paseador seleccionado
            let paseadorSeleccionado = null;
            for (let i = 0; i < sistema.paseadores.length; i++) {
                if (sistema.paseadores[i].id == paseadorId) {
                    paseadorSeleccionado = sistema.paseadores[i];
                    break;
                }
            }
            
            if (paseadorSeleccionado) {
                // Crear la contratación
                sistema.crearContratacion(cliente, paseadorSeleccionado);
                mostrarMensaje(mensaje, "success", "Contratación solicitada exitosamente. El paseador debe aprobarla.");
                
                // Recargar la vista inmediatamente
                mostrarContratarServicio();
            }
        });
    }
}

function mostrarVerContratacion() {
    let contenido = document.querySelector("#contenidoCliente");
    let cliente = sistema.userLogged;
    
    // Usar template de ver contratación
    let template = document.querySelector("#cliente-ver-contratacion");
    contenido.innerHTML = template.innerHTML;
    
    // Buscar contratación actual (pendiente o aprobada)
    let contratacionActual = sistema.getContratacionActual(cliente);
    let contenidoMiContratacion = document.querySelector("#contenidoMiContratacion");
    
    if (!contratacionActual) {
        // Usar template sin contratación
        let templateSin = document.querySelector("#cliente-sin-contratacion");
        contenidoMiContratacion.innerHTML = templateSin.innerHTML;
    } else {
        // Usar template de detalles
        let templateDetalles = document.querySelector("#cliente-detalles-contratacion");
        contenidoMiContratacion.innerHTML = templateDetalles.innerHTML;
        
        let alertClass = contratacionActual.estado === "aprobada" ? "alert-success" : "alert-warning";
        let badgeClass = contratacionActual.estado === "aprobada" ? "bg-success" : "bg-warning";
        let titulo = contratacionActual.estado === "aprobada" ? "Contratación Aprobada" : "Contratación Pendiente";
        
        document.querySelector("#alertContratacion").className = "alert " + alertClass;
        document.querySelector("#tituloContratacion").innerHTML = titulo;
        document.querySelector("#nombrePaseadorDetalle").innerHTML = contratacionActual.paseador.nombre;
        document.querySelector("#usernamePaseadorDetalle").innerHTML = contratacionActual.paseador.username;
        document.querySelector("#estadoContratacionDetalle").className = "badge " + badgeClass;
        document.querySelector("#estadoContratacionDetalle").innerHTML = contratacionActual.estado;
        document.querySelector("#nombrePerroDetalle").innerHTML = contratacionActual.cliente.perro.nombre;
        document.querySelector("#tamanoPerroDetalle").innerHTML = contratacionActual.cliente.perro.tamano;
        document.querySelector("#idContratacionDetalle").innerHTML = contratacionActual.id;
        
        if (contratacionActual.estado === "aprobada") {
            document.querySelector("#mensajeFelicitacion").style.display = "block";
        }
        
        // Configurar botones según el estado usando la función auxiliar
        let botonesDiv = document.querySelector("#botonesContratacion");
        if (contratacionActual.estado === "pendiente") {
            botonesDiv.innerHTML = '<button id="btnCancelarContratacion" class="btn btn-danger">Cancelar Contratación</button>';
        } else {
            // Si está aprobada, completada, etc., no mostrar botones
            botonesDiv.innerHTML = '';
        }
        
        // Configurar eventos de botones (solo cancelar si está pendiente)
        let btnCancelar = document.querySelector("#btnCancelarContratacion");
        if (btnCancelar && contratacionActual.estado === "pendiente") {
            btnCancelar.addEventListener("click", function() {
                sistema.cancelarContratacion(contratacionActual);
                let mensaje = document.querySelector("#mensajeCancelacion");
                mostrarMensaje(mensaje, "success", "Contratación cancelada exitosamente.");
                
                // Recargar la vista inmediatamente
                mostrarVerContratacion();
            });
        }
    }
}

function mostrarInfoPaseadores() {
    let contenido = document.querySelector("#contenidoCliente");
    let infoPaseadores = sistema.getInfoPaseadores();
    
    // Usar template de información de paseadores
    let template = document.querySelector("#cliente-info-paseadores");
    contenido.innerHTML = template.innerHTML;
    
    // Llenar la tabla
    let tbody = document.querySelector("#tablaPaseadores");
    for (let i = 0; i < infoPaseadores.length; i++) {
        let info = infoPaseadores[i];
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${info.nombre}</td>
            <td>${info.cantidadPerros}</td>
        `;
        tbody.appendChild(row);
    }
} 