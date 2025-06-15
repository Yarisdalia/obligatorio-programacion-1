function initDashboardPaseador() {
    const paseador = sistema.userLogged;
    
    // Mostrar información del paseador
    document.querySelector("#nombrePaseador").innerHTML = paseador.nombre;
    
    // Configurar logout
    document.querySelector("#btnLogoutPaseador").addEventListener("click", function() {
        sistema.userLogged = null;
        navigateTo("login", initLogin);
    });
    
    // Configurar navegación
    document.querySelector("#btnContratacionesPendientes").addEventListener("click", function() {
        setActiveButton("btnContratacionesPendientes");
        mostrarContratacionesPendientes();
    });
    document.querySelector("#btnPerrosAsignados").addEventListener("click", function() {
        setActiveButton("btnPerrosAsignados");
        mostrarPerrosAsignados();
    });
    
    // Mostrar pendientes por defecto
    setActiveButton("btnContratacionesPendientes");
    mostrarContratacionesPendientes();
}

function setActiveButton(activeButtonId) {
    document.querySelectorAll(".btn-nav").forEach(btn => {
        if (btn.id !== "btnLogoutPaseador") {
            btn.classList.remove("active");
        }
    });
    document.querySelector("#" + activeButtonId).classList.add("active");
}

function mostrarContratacionesPendientes() {
    const contenido = document.querySelector("#contenidoPanelPaseador");
    const paseador = sistema.userLogged;
    const pendientes = sistema.getContratacionesPendientes(paseador);
    
    // Calcular estadísticas de cupos
    const cuposOcupados = sistema.calcularCuposOcupados(paseador);
    const cuposMaximos = paseador.cupoMaximo;
    const porcentajeOcupacion = cuposMaximos > 0 ? ((cuposOcupados / cuposMaximos) * 100).toFixed(1) : 0;
    
    let html = `
        <div class="content-title">Contrataciones Pendientes</div>
        
        <!-- Estadísticas de Cupos -->
        <div class="stats-container" style="display: flex; gap: 20px; margin-bottom: 20px;">
            <div class="stat-card" style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; flex: 1;">
                <h5>Cupos Ocupados</h5>
                <p style="font-size: 24px; font-weight: bold; color: #dc3545; margin: 0;">${cuposOcupados}</p>
            </div>
            <div class="stat-card" style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; flex: 1;">
                <h5>Cupos Máximos</h5>
                <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 0;">${cuposMaximos}</p>
            </div>
            <div class="stat-card" style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; flex: 1;">
                <h5>% Ocupación</h5>
                <p style="font-size: 24px; font-weight: bold; color: #28a745; margin: 0;">${porcentajeOcupacion}%</p>
            </div>
        </div>
        
        <div id="mensajeProcesamiento"></div>
    `;
    
    if (pendientes.length === 0) {
        html += '<div class="alert alert-info">No tienes contrataciones pendientes.</div>';
    } else {
        html += `
            <table class="table">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Perro</th>
                        <th>Tamaño</th>
                        <th>Cupos Necesarios</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (let i = 0; i < pendientes.length; i++) {
            const contratacion = pendientes[i];
            const tamano = contratacion.cliente.perro.tamano;
            let cuposNecesarios;
            if (tamano === "grande") {
                cuposNecesarios = 4;
            } else if (tamano === "mediano") {
                cuposNecesarios = 2;
            } else {
                cuposNecesarios = 1;
            }
            
            html += `
                <tr>
                    <td>${contratacion.cliente.nombre}</td>
                    <td>${contratacion.cliente.perro.nombre}</td>
                    <td>${tamano}</td>
                    <td>${cuposNecesarios}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="aprobarContratacion(${contratacion.id})">Aprobar</button>
                        <button class="btn btn-danger btn-sm" onclick="rechazarContratacion(${contratacion.id})">Rechazar</button>
                    </td>
                </tr>
            `;
        }
        
        html += '</tbody></table>';
    }
    
    contenido.innerHTML = html;
}

function aprobarContratacion(contratacionId) {
    const contratacion = encontrarContratacion(contratacionId);
    if (contratacion) {
        // Validar si se puede aprobar la contratación
        const validacion = sistema.puedeAprobarContratacion(contratacion);
        
        if (validacion.puede) {
            // Se puede aprobar - proceder normalmente
            sistema.aprobarContratacion(contratacion);
        } else {
            // No se puede aprobar - rechazar automáticamente
            sistema.rechazarContratacion(contratacion);
        }
        
        // Actualizar la lista primero
        mostrarContratacionesPendientes();
        
        // Luego mostrar el mensaje
        const mensaje = document.querySelector("#mensajeProcesamiento");
        if (validacion.puede) {
            mostrarMensaje(mensaje, "success", validacion.motivo);
        } else {
            mostrarMensaje(mensaje, "warning", validacion.motivo);
        }
    }
}

function rechazarContratacion(contratacionId) {
    const contratacion = encontrarContratacion(contratacionId);
    if (contratacion) {
        sistema.rechazarContratacion(contratacion);
        
        // Actualizar la lista primero
        mostrarContratacionesPendientes();
        
        // Luego mostrar el mensaje
        const mensaje = document.querySelector("#mensajeProcesamiento");
        mostrarMensaje(mensaje, "info", "Contratación rechazada");
    }
}

function encontrarContratacion(id) {
    for (let i = 0; i < sistema.contrataciones.length; i++) {
        if (sistema.contrataciones[i].id == id) {
            return sistema.contrataciones[i];
        }
    }
    return null;
}

function mostrarPerrosAsignados() {
    const contenido = document.querySelector("#contenidoPanelPaseador");
    const paseador = sistema.userLogged;
    const asignados = sistema.getPerrosAsignados(paseador);
    
    // Calcular estadísticas de cupos
    const cuposOcupados = sistema.calcularCuposOcupados(paseador);
    const cuposMaximos = paseador.cupoMaximo;
    const porcentajeOcupacion = cuposMaximos > 0 ? ((cuposOcupados / cuposMaximos) * 100).toFixed(1) : 0;
    
    let html = `
        <div class="content-title">Mis Perros Asignados</div>
        
        <!-- Estadísticas de Cupos -->
        <div class="stats-container" style="display: flex; gap: 20px; margin-bottom: 20px;">
            <div class="stat-card" style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; flex: 1;">
                <h5>Cupos Ocupados</h5>
                <p style="font-size: 24px; font-weight: bold; color: #dc3545; margin: 0;">${cuposOcupados}</p>
            </div>
            <div class="stat-card" style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; flex: 1;">
                <h5>Cupos Máximos</h5>
                <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 0;">${cuposMaximos}</p>
            </div>
            <div class="stat-card" style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; flex: 1;">
                <h5>% Ocupación</h5>
                <p style="font-size: 24px; font-weight: bold; color: #28a745; margin: 0;">${porcentajeOcupacion}%</p>
            </div>
        </div>
        
        <div class="alert alert-info">Total de perros: ${asignados.length}</div>
    `;
    
    if (asignados.length === 0) {
        html += '<div class="alert alert-info">No tienes perros asignados actualmente.</div>';
    } else {
        html += `
            <table class="table">
                <thead>
                    <tr>
                        <th>Perro</th>
                        <th>Tamaño</th>
                        <th>Cupos que Ocupa</th>
                        <th>Dueño</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (let i = 0; i < asignados.length; i++) {
            const contratacion = asignados[i];
            const tamano = contratacion.cliente.perro.tamano;
            let cuposPerro;
            if (tamano === "grande") {
                cuposPerro = 4;
            } else if (tamano === "mediano") {
                cuposPerro = 2;
            } else {
                cuposPerro = 1;
            }
            
            html += `
                <tr>
                    <td>${contratacion.cliente.perro.nombre}</td>
                    <td>${tamano}</td>
                    <td>${cuposPerro}</td>
                    <td>${contratacion.cliente.nombre}</td>
                </tr>
            `;
        }
        
        html += '</tbody></table>';
    }
    
    contenido.innerHTML = html;
} 