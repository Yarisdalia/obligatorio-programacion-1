function initDashboardCliente() {
    const cliente = sistema.userLogged;
    
    // Mostrar información del cliente
    document.querySelector("#nombreCliente").innerHTML = cliente.nombre;
    document.querySelector("#nombrePerro").innerHTML = cliente.perro.nombre;
    document.querySelector("#tamanoPerro").innerHTML = cliente.perro.tamano;
    
    // Configurar logout
    document.querySelector("#btnLogoutCliente").addEventListener("click", function() {
        sistema.userLogged = null;
        navigateTo("login", initLogin);
    });
    
    // Configurar navegación
    document.querySelector("#btnContratarServicio").addEventListener("click", function() {
        setActiveButton("btnContratarServicio");
        mostrarPanelContratacion();
    });
    document.querySelector("#btnInfoPaseadores").addEventListener("click", function() {
        setActiveButton("btnInfoPaseadores");
        mostrarPanelInfoPaseadores();
    });
    
    // Mostrar contratación por defecto
    setActiveButton("btnContratarServicio");
    mostrarPanelContratacion();
}

function setActiveButton(activeButtonId) {
    document.querySelectorAll(".btn-nav").forEach(btn => {
        if (btn.id !== "btnLogoutCliente") {
            btn.classList.remove("active");
        }
    });
    document.querySelector("#" + activeButtonId).classList.add("active");
}

function mostrarPanelContratacion() {
    const contenido = document.querySelector("#contenidoPanelCliente");
    const cliente = sistema.userLogged;
    const contratacionActual = sistema.getContratacionActual(cliente);
    
    if (contratacionActual) {
        // Mostrar estado de contratación
        contenido.innerHTML = `
            <div class="content-title">Mi Contratación</div>
            <div id="mensajeContratacion"></div>
            <div class="alert alert-info">
                <h5>Estado: ${contratacionActual.estado}</h5>
                <p><strong>Paseador:</strong> ${contratacionActual.paseador.nombre}</p>
                <p><strong>Tu perro:</strong> ${contratacionActual.cliente.perro.nombre} (${contratacionActual.cliente.perro.tamano})</p>
                ${contratacionActual.estado === "pendiente" ? 
                    '<button id="btnCancelar" class="btn btn-danger">Cancelar</button>' : 
                    ''}
            </div>
        `;
        
        // Configurar botón cancelar
        const btnCancelar = document.querySelector("#btnCancelar");
        if (btnCancelar) {
            btnCancelar.addEventListener("click", function() {
                sistema.cancelarContratacion(contratacionActual);
                const mensaje = document.querySelector("#mensajeContratacion");
                mostrarMensaje(mensaje, "success", "Contratación cancelada");
                mostrarPanelContratacion();
            });
        }
    } else {
        // Mostrar formulario de contratación
        contenido.innerHTML = `
            <div class="content-title">Contratar Paseador</div>
            <div id="mensajeContratacion"></div>
            <div class="form-group mb-3">
                <label>Selecciona un paseador:</label>
                <select id="selectPaseador" class="form-control">
                    <option value="">Seleccione un paseador</option>
                </select>
            </div>
            <button id="btnSolicitar" class="btn btn-primary">Solicitar Contratación</button>
        `;
        
        // Llenar select con paseadores
        const select = document.querySelector("#selectPaseador");
        const paseadores = sistema.getPaseadoresDisponibles(cliente);
        for (let i = 0; i < paseadores.length; i++) {
            const option = document.createElement("option");
            option.value = paseadores[i].id;
            option.innerHTML = paseadores[i].nombre;
            select.appendChild(option);
        }
        
        // Configurar botón solicitar
        document.querySelector("#btnSolicitar").addEventListener("click", function() {
            const paseadorId = document.querySelector("#selectPaseador").value;
            const mensaje = document.querySelector("#mensajeContratacion");
            
            if (!paseadorId) {
                mostrarMensaje(mensaje, "danger", "Selecciona un paseador");
                return;
            }
            
            // Buscar paseador
            let paseador = null;
            for (let i = 0; i < sistema.paseadores.length; i++) {
                if (sistema.paseadores[i].id == paseadorId) {
                    paseador = sistema.paseadores[i];
                    break;
                }
            }
            
            if (paseador) {
                sistema.crearContratacion(cliente, paseador);
                mostrarMensaje(mensaje, "success", "Contratación solicitada");
                mostrarPanelContratacion();
            }
        });
    }
}

function mostrarPanelInfoPaseadores() {
    const contenido = document.querySelector("#contenidoPanelCliente");
    const infoPaseadores = sistema.getInfoPaseadores();
    
    let tabla = `
        <div class="content-title">Información de Paseadores</div>
        <table class="table">
            <thead>
                <tr>
                    <th>Paseador</th>
                    <th>Perros Asignados</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (let i = 0; i < infoPaseadores.length; i++) {
        tabla += `<tr>
            <td>${infoPaseadores[i].nombre}</td>
            <td>${infoPaseadores[i].cantidadPerros}</td>
        </tr>`;
    }
    
    tabla += `</tbody></table>`;
    contenido.innerHTML = tabla;
} 