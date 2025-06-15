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
    
    // Configurar navegación entre secciones
    document.querySelector("#btnContratarServicio").addEventListener("click", function() {
        setActiveButton("btnContratarServicio");
        mostrarPanelContratacion();
    });
    document.querySelector("#btnInfoPaseadores").addEventListener("click", function() {
        setActiveButton("btnInfoPaseadores");
        mostrarPanelInfoPaseadores();
    });
    
    // Mostrar contratación por defecto y marcar botón activo
    setActiveButton("btnContratarServicio");
    mostrarPanelContratacion();
}

function setActiveButton(activeButtonId) {
    // Remover clase activa de todos los botones
    document.querySelectorAll(".btn-nav").forEach(btn => {
        if (btn.id !== "btnLogoutCliente") {
            btn.classList.remove("active");
        }
    });
    
    // Agregar clase activa al botón seleccionado
    document.querySelector("#" + activeButtonId).classList.add("active");
}

function mostrarPanelContratacion() {
    const contenido = document.querySelector("#contenidoPanelCliente");
    const cliente = sistema.userLogged;
    
    // Verificar si ya tiene una contratación actual (pendiente o aprobada)
    const contratacionActual = sistema.getContratacionActual(cliente);
    
    if (contratacionActual) {
        // Mostrar detalles de la contratación existente
        const template = document.querySelector("#cliente-contratacion-detalles");
        contenido.innerHTML = template.innerHTML;
        
        // Configurar clases y datos según el estado
        let alertClass, badgeClass, titulo, mensaje;
        if (contratacionActual.estado === "aprobada") {
            alertClass = "alert-success";
            badgeClass = "bg-success";
            titulo = "Contratación Aprobada";
            mensaje = "¡Tu contratación ha sido aprobada! Tu perro ya está siendo paseado.";
        } else {
            alertClass = "alert-warning";
            badgeClass = "bg-warning";
            titulo = "Contratación Pendiente";
            mensaje = "Tienes una contratación pendiente. Debes esperar a que el paseador la apruebe o rechace.";
        }
        
        // Llenar los datos
        document.querySelector("#alertContratacion").className = "alert " + alertClass;
        document.querySelector("#tituloContratacion").innerHTML = titulo;
        document.querySelector("#nombrePaseadorDetalle").innerHTML = contratacionActual.paseador.nombre;
        document.querySelector("#usernamePaseadorDetalle").innerHTML = contratacionActual.paseador.username;
        document.querySelector("#estadoContratacionDetalle").className = "badge " + badgeClass;
        document.querySelector("#estadoContratacionDetalle").innerHTML = contratacionActual.estado;
        document.querySelector("#nombrePerroDetalle").innerHTML = contratacionActual.cliente.perro.nombre;
        document.querySelector("#tamanoPerroDetalle").innerHTML = contratacionActual.cliente.perro.tamano;
        document.querySelector("#idContratacionDetalle").innerHTML = contratacionActual.id;
        document.querySelector("#mensajeEstado").innerHTML = mensaje;
        
        // Mostrar mensaje de felicitación si está aprobada
        if (contratacionActual.estado === "aprobada") {
            document.querySelector("#mensajeFelicitacion").style.display = "block";
        }
        
        // Configurar botón de cancelar si está pendiente
        const botonesDiv = document.querySelector("#botonesContratacion");
        if (contratacionActual.estado === "pendiente") {
            botonesDiv.innerHTML = '<button id="btnCancelarContratacion" class="btn btn-danger">Cancelar Contratación</button>';
            
            document.querySelector("#btnCancelarContratacion").addEventListener("click", function() {
                sistema.cancelarContratacion(contratacionActual);
                const mensaje = document.querySelector("#mensajeCancelacion");
                mostrarMensaje(mensaje, "success", "Contratación cancelada exitosamente.");
                
                // Recargar la vista
                mostrarPanelContratacion();
            });
        } else {
            botonesDiv.innerHTML = '';
        }
        
        return;
    }
    
    // No hay contratación actual - mostrar formulario para contratar
    const template = document.querySelector("#cliente-contratar-servicio");
    contenido.innerHTML = template.innerHTML;
    
    // Obtener paseadores disponibles
    const paseadoresDisponibles = sistema.getPaseadoresDisponibles(cliente);
    const contenidoContratacion = document.querySelector("#contenidoContratacion");
    
    if (paseadoresDisponibles.length === 0) {
        // Sin paseadores disponibles
        const templateSin = document.querySelector("#cliente-sin-paseadores");
        contenidoContratacion.innerHTML = templateSin.innerHTML;
        document.querySelector("#tamanoPerroSin").innerHTML = cliente.perro.tamano;
    } else {
        // Mostrar formulario
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
                
                // Recargar la vista
                mostrarPanelContratacion();
            }
        });
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