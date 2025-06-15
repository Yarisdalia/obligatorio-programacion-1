function initDashboardCliente() {
    const cliente = sistema.userLogged;
    
    // Mostrar información del cliente
    document.querySelector("#nombreCliente").innerHTML = cliente.nombre;
    document.querySelector("#nombrePerro").innerHTML = cliente.perro.nombre;
    document.querySelector("#tamanoPerro").innerHTML = cliente.perro.tamano;
    
    // Configurar botón de logout
    document.querySelector("#btnLogoutCliente").addEventListener("click", function() {
        sistema.userLogged = null;
        navigateTo("login", initLogin);
    });
    
    document.querySelector("#btnContratarServicio").addEventListener("click", mostrarPanelContratarServicio);
    document.querySelector("#btnVerContratacion").addEventListener("click", mostrarPanelVerContratacion);
    document.querySelector("#btnInfoPaseadores").addEventListener("click", mostrarPanelInfoPaseadores);
    
    // Mostrar contratar servicio por defecto
    mostrarPanelContratarServicio();
}

function mostrarPanelContratarServicio() {
    const contenido = document.querySelector("#contenidoPanelCliente");
    const cliente = sistema.userLogged;
    
    // Verificar si ya tiene una contratación actual (pendiente o aprobada)
    const contratacionActual = sistema.getContratacionActual(cliente);
    
    if (contratacionActual) {
        // Usar template de estado de contratación
        const template = document.querySelector("#cliente-contratacion-estado");
        contenido.innerHTML = template.innerHTML;
        
        // Configurar clases y datos
        let estadoClass;
        let estadoBadge;
        if (contratacionActual.estado === "aprobada") {
            estadoClass = "bg-success";
            estadoBadge = "bg-success";
        } else {
            estadoClass = "bg-warning";
            estadoBadge = "bg-warning";
        }
        let mensaje;
        if (contratacionActual.estado === "aprobada") {
            mensaje = "¡Tu contratación ha sido aprobada! Tu perro ya está siendo paseado.";
        } else {
            mensaje = "Tienes una contratación pendiente. Debes esperar a que el paseador la apruebe o rechace.";
        }
        
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
    const template = document.querySelector("#cliente-contratar-servicio");
    contenido.innerHTML = template.innerHTML;
    
    // Obtener paseadores disponibles
    const paseadoresDisponibles = sistema.getPaseadoresDisponibles(cliente);
    const contenidoContratacion = document.querySelector("#contenidoContratacion");
    
    if (paseadoresDisponibles.length === 0) {
        // Usar template de sin paseadores
        const templateSin = document.querySelector("#cliente-sin-paseadores");
        contenidoContratacion.innerHTML = templateSin.innerHTML;
        document.querySelector("#tamanoPerroSin").innerHTML = cliente.perro.tamano;
    } else {
        // Usar template de formulario
        const templateForm = document.querySelector("#cliente-form-paseador");
        contenidoContratacion.innerHTML = templateForm.innerHTML;
        
        // Llenar el select con paseadores
        const select = document.querySelector("#selectPaseador");
        for (let i = 0; i < paseadoresDisponibles.length; i++) {
            const paseador = paseadoresDisponibles[i];
            const cuposOcupados = sistema.calcularCuposOcupados(paseador);
            const cuposDisponibles = paseador.cupoMaximo - cuposOcupados;
            const option = document.createElement("option");
            option.value = paseador.id;
            option.innerHTML = paseador.username + " (Cupos disponibles: " + cuposDisponibles + "/" + paseador.cupoMaximo + ")";
            select.appendChild(option);
        }
        
        // Configurar botón de solicitar contratación
        const btnSolicitar = document.querySelector("#btnSolicitarContratacion");
        btnSolicitar.addEventListener("click", function() {
            const selectPaseador = document.querySelector("#selectPaseador");
            const paseadorId = selectPaseador.value;
            const mensaje = document.querySelector("#mensajeContratacion");
            
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

function mostrarPanelVerContratacion() {
    const contenido = document.querySelector("#contenidoPanelCliente");
    const cliente = sistema.userLogged;
    
    // Usar template de ver contratación
    const template = document.querySelector("#cliente-ver-contratacion");
    contenido.innerHTML = template.innerHTML;
    
    // Buscar contratación actual (pendiente o aprobada)
    const contratacionActual = sistema.getContratacionActual(cliente);
    const contenidoMiContratacion = document.querySelector("#contenidoMiContratacion");
    
    if (!contratacionActual) {
        // Usar template sin contratación
        const templateSin = document.querySelector("#cliente-sin-contratacion");
        contenidoMiContratacion.innerHTML = templateSin.innerHTML;
    } else {
        // Usar template de detalles
        const templateDetalles = document.querySelector("#cliente-detalles-contratacion");
        contenidoMiContratacion.innerHTML = templateDetalles.innerHTML;
        
        let alertClass;
        let badgeClass;
        let titulo;
        if (contratacionActual.estado === "aprobada") {
            alertClass = "alert-success";
            badgeClass = "bg-success";
            titulo = "Contratación Aprobada";
        } else {
            alertClass = "alert-warning";
            badgeClass = "bg-warning";
            titulo = "Contratación Pendiente";
        }
        
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
        const botonesDiv = document.querySelector("#botonesContratacion");
        if (contratacionActual.estado === "pendiente") {
            botonesDiv.innerHTML = '<button id="btnCancelarContratacion" class="btn btn-danger">Cancelar Contratación</button>';
        } else {
            // Si está aprobada, completada, etc., no mostrar botones
            botonesDiv.innerHTML = '';
        }
        
        // Configurar eventos de botones (solo cancelar si está pendiente)
        const btnCancelar = document.querySelector("#btnCancelarContratacion");
        if (btnCancelar && contratacionActual.estado === "pendiente") {
            btnCancelar.addEventListener("click", function() {
                sistema.cancelarContratacion(contratacionActual);
                const mensaje = document.querySelector("#mensajeCancelacion");
                mostrarMensaje(mensaje, "success", "Contratación cancelada exitosamente.");
                
                // Recargar la vista inmediatamente
                mostrarVerContratacion();
            });
        }
    }
}

function mostrarPanelInfoPaseadores() {
    const contenido = document.querySelector("#contenidoPanelCliente");
    const infoPaseadores = sistema.getInfoPaseadores();
    
    // Usar template de información de paseadores
    const template = document.querySelector("#cliente-info-paseadores");
    contenido.innerHTML = template.innerHTML;
    
    // Llenar la tabla
    const tbody = document.querySelector("#tablaPaseadores");
    for (let i = 0; i < infoPaseadores.length; i++) {
        const info = infoPaseadores[i];
        const row = document.createElement("tr");
        row.innerHTML = '<td>' + info.nombre + '</td>' +
            '<td>' + info.cantidadPerros + '</td>';
        tbody.appendChild(row);
    }
} 