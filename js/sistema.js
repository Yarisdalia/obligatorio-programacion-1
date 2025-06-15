class Sistema {
    constructor() {
        this.contrataciones = [];
        this.paseadores = [];
        this.clientes = [];
        this.userLogged = null;
    }

    // Validar que el username no exista (case insensitive)
    existeUsername(username) {
        let existe = false;
        
        // Revisar en paseadores
        for (let i = 0; i < this.paseadores.length; i++) {
            if (this.paseadores[i].username.toLowerCase() === username.toLowerCase()) {
                existe = true;
                break;
            }
        }
        
        // Revisar en clientes
        for (let i = 0; i < this.clientes.length; i++) {
            if (this.clientes[i].username.toLowerCase() === username.toLowerCase()) {
                existe = true;
                break;
            }
        }
        
        return existe;
    }
    
    // Validar contraseña según requerimientos
    validarPassword(password) {
        if (password.length < 5) {
            return false;
        }
        
        let tieneMayuscula = false;
        let tieneMinuscula = false;
        let tieneNumero = false;
        
        for (let i = 0; i < password.length; i++) {
            let caracter = password[i];
            if (caracter >= 'A' && caracter <= 'Z') {
                tieneMayuscula = true;
            }
            if (caracter >= 'a' && caracter <= 'z') {
                tieneMinuscula = true;
            }
            if (caracter >= '0' && caracter <= '9') {
                tieneNumero = true;
            }
        }
        
        return tieneMayuscula && tieneMinuscula && tieneNumero;
    }
    
    // Registrar nuevo cliente
    registrarCliente(nombre, username, password, nombrePerro, tamanoPerro) {
        // Validar username único
        if (this.existeUsername(username)) {
            return "El nombre de usuario ya existe";
        }
        
        // Validar contraseña
        if (!this.validarPassword(password)) {
            return "La contraseña debe tener mínimo 5 caracteres, incluyendo al menos una mayúscula, una minúscula y un número";
        }
        
        // Validar campos vacíos
        if (nombre === "" || username === "" || password === "" || nombrePerro === "" || tamanoPerro === "") {
            return "Todos los campos son obligatorios";
        }
        
        // Crear perro y cliente
        let perro = new Perro(nombrePerro, tamanoPerro);
        let cliente = new Cliente(nombre, username, password, perro);
        this.clientes.push(cliente);
        
        return "ok";
    }
    
    // Login de usuarios
    login(username, password) {
        this.userLogged = null;
        
        // Buscar en paseadores (case-insensitive)
        for (let i = 0; i < this.paseadores.length; i++) {
            if (this.paseadores[i].username.toLowerCase() === username.toLowerCase() && this.paseadores[i].getPassword() === password) {
                this.userLogged = this.paseadores[i];
                return "ok";
            }
        }
        
        // Buscar en clientes (case-insensitive)
        for (let i = 0; i < this.clientes.length; i++) {
            if (this.clientes[i].username.toLowerCase() === username.toLowerCase() && this.clientes[i].getPassword() === password) {
                this.userLogged = this.clientes[i];
                return "ok";
            }
        }
        
        return "Usuario o contraseña incorrectos";
    }
    
    // Calcular cupos ocupados por un paseador
    calcularCuposOcupados(paseador) {
        let cuposOcupados = 0;
        
        for (let i = 0; i < this.contrataciones.length; i++) {
            if (this.contrataciones[i].paseador.id === paseador.id && this.contrataciones[i].estado === "aprobada") {
                let tamano = this.contrataciones[i].cliente.perro.tamano;
                if (tamano === "grande") {
                    cuposOcupados += 4;
                } else if (tamano === "mediano") {
                    cuposOcupados += 2;
                } else if (tamano === "chico") {
                    cuposOcupados += 1;
                }
            }
        }
        
        return cuposOcupados;
    }
    
    // Verificar si un paseador tiene perros grandes
    tienePerrosGrandes(paseador) {
        for (let i = 0; i < this.contrataciones.length; i++) {
            if (this.contrataciones[i].paseador.id === paseador.id && 
                this.contrataciones[i].estado === "aprobada" &&
                this.contrataciones[i].cliente.perro.tamano === "grande") {
                return true;
            }
        }
        return false;
    }
    
    // Verificar si un paseador tiene perros chicos
    tienePerrosChicos(paseador) {
        for (let i = 0; i < this.contrataciones.length; i++) {
            if (this.contrataciones[i].paseador.id === paseador.id && 
                this.contrataciones[i].estado === "aprobada" &&
                this.contrataciones[i].cliente.perro.tamano === "chico") {
                return true;
            }
        }
        return false;
    }
    
    // Obtener paseadores disponibles para un cliente
    getPaseadoresDisponibles(cliente) {
        let disponibles = [];
        let tamanoPerro = cliente.perro.tamano;
        let cuposNecesarios = tamanoPerro === "grande" ? 4 : (tamanoPerro === "mediano" ? 2 : 1);
        
        for (let i = 0; i < this.paseadores.length; i++) {
            let paseador = this.paseadores[i];
            let cuposOcupados = this.calcularCuposOcupados(paseador);
            let cuposDisponibles = paseador.cupoMaximo - cuposOcupados;
            
            // Verificar si tiene cupo suficiente
            if (cuposDisponibles >= cuposNecesarios) {
                // Verificar compatibilidad de tamaños
                let esCompatible = true;
                
                if (tamanoPerro === "chico" && this.tienePerrosGrandes(paseador)) {
                    esCompatible = false;
                }
                if (tamanoPerro === "grande" && this.tienePerrosChicos(paseador)) {
                    esCompatible = false;
                }
                
                if (esCompatible) {
                    disponibles.push(paseador);
                }
            }
        }
        
        return disponibles;
    }
    
    // Verificar si cliente tiene contratación pendiente
    tieneContratacionPendiente(cliente) {
        for (let i = 0; i < this.contrataciones.length; i++) {
            if (this.contrataciones[i].cliente.id === cliente.id && this.contrataciones[i].estado === "pendiente") {
                return this.contrataciones[i];
            }
        }
        return null;
    }
    
    // Obtener contratación actual del cliente (pendiente o aprobada)
    getContratacionActual(cliente) {
        // Usar el arreglo del cliente directamente
        for (let i = 0; i < cliente.contrataciones.length; i++) {
            if (cliente.contrataciones[i].estado === "pendiente" || cliente.contrataciones[i].estado === "aprobada") {
                return cliente.contrataciones[i];
            }
        }
        return null;
    }
    
    // Crear nueva contratación
    crearContratacion(cliente, paseador) {
        let contratacion = new Contratacion(cliente, paseador, "pendiente");
        this.contrataciones.push(contratacion);
        
        // Agregar la contratación a los arreglos individuales
        cliente.agregarContratacion(contratacion);
        paseador.agregarContratacion(contratacion);
        
        return contratacion;
    }
    
    // Cancelar contratación
    cancelarContratacion(contratacion) {
        contratacion.estado = "cancelada";
    }
    
    // Finalizar servicio (marcar como completado)
    finalizarServicio(contratacion) {
        contratacion.estado = "completada";
    }
    
    // Obtener contrataciones pendientes de un paseador
    getContratacionesPendientes(paseador) {
        let pendientes = [];
        for (let i = 0; i < this.contrataciones.length; i++) {
            if (this.contrataciones[i].paseador.id === paseador.id && this.contrataciones[i].estado === "pendiente") {
                pendientes.push(this.contrataciones[i]);
            }
        }
        return pendientes;
    }
    
    // Aprobar contratación específicamente
    aprobarContratacion(contratacion) {
        let paseador = contratacion.paseador;
        let cliente = contratacion.cliente;
        let tamanoPerro = cliente.perro.tamano;
        let cuposNecesarios = tamanoPerro === "grande" ? 4 : (tamanoPerro === "mediano" ? 2 : 1);
        
        // Verificar cupo disponible
        let cuposOcupados = this.calcularCuposOcupados(paseador);
        if (cuposOcupados + cuposNecesarios > paseador.cupoMaximo) {
            contratacion.estado = "rechazada";
            contratacion.motivoRechazo = "No hay cupo suficiente";
            return "No se puede aprobar: No hay cupo suficiente";
        }
        
        // Verificar compatibilidad de tamaños
        if (tamanoPerro === "chico" && this.tienePerrosGrandes(paseador)) {
            contratacion.estado = "rechazada";
            contratacion.motivoRechazo = "Incompatible con perros grandes existentes";
            return "No se puede aprobar: Incompatible con perros grandes existentes";
        }
        
        if (tamanoPerro === "grande" && this.tienePerrosChicos(paseador)) {
            contratacion.estado = "rechazada";
            contratacion.motivoRechazo = "Incompatible con perros chicos existentes";
            return "No se puede aprobar: Incompatible con perros chicos existentes";
        }
        
        // Aprobar contratación
        contratacion.estado = "aprobada";
        
        // Rechazar automáticamente otras contrataciones incompatibles
        this.rechazarContratacionesIncompatibles(paseador, tamanoPerro);
        
        return "Contratación aprobada exitosamente";
    }
    
    // Rechazar contratación específicamente
    rechazarContratacion(contratacion, motivo) {
        contratacion.estado = "rechazada";
        contratacion.motivoRechazo = motivo || "Rechazada por el paseador";
        return "Contratación rechazada";
    }
    
    // Rechazar contrataciones incompatibles automáticamente
    rechazarContratacionesIncompatibles(paseador, tamanoAprobado) {
        for (let i = 0; i < this.contrataciones.length; i++) {
            let contratacion = this.contrataciones[i];
            
            if (contratacion.paseador.id === paseador.id && contratacion.estado === "pendiente") {
                let tamanoContratacion = contratacion.cliente.perro.tamano;
                let cuposNecesarios = tamanoContratacion === "grande" ? 4 : (tamanoContratacion === "mediano" ? 2 : 1);
                
                // Verificar cupo
                let cuposOcupados = this.calcularCuposOcupados(paseador);
                if (cuposOcupados + cuposNecesarios > paseador.cupoMaximo) {
                    contratacion.estado = "rechazada";
                    contratacion.motivoRechazo = "No hay cupo suficiente";
                    continue;
                }
                
                // Verificar incompatibilidad de tamaños
                if ((tamanoAprobado === "grande" && tamanoContratacion === "chico") ||
                    (tamanoAprobado === "chico" && tamanoContratacion === "grande")) {
                    contratacion.estado = "rechazada";
                    contratacion.motivoRechazo = "Incompatible con perro " + tamanoAprobado + " aprobado";
                }
            }
        }
    }
    
    // Obtener perros asignados a un paseador
    getPerrosAsignados(paseador) {
        let perros = [];
        for (let i = 0; i < this.contrataciones.length; i++) {
            if (this.contrataciones[i].paseador.id === paseador.id && this.contrataciones[i].estado === "aprobada") {
                perros.push(this.contrataciones[i].cliente.perro);
            }
        }
        return perros;
    }
    
    // Obtener información de todos los paseadores para cliente
    getInfoPaseadores() {
        let info = [];
        for (let i = 0; i < this.paseadores.length; i++) {
            let paseador = this.paseadores[i];
            let perrosAsignados = this.getPerrosAsignados(paseador);
            info.push({
                nombre: paseador.username,
                cantidadPerros: perrosAsignados.length
            });
        }
        return info;
    }
    
    // Métodos para agregar elementos al sistema
    agregarContratacion(contratacion) {
        this.contrataciones.push(contratacion);
    }
    
    agregarPaseador(paseador) {
        this.paseadores.push(paseador);
    }
    
    agregarCliente(cliente) {
        this.clientes.push(cliente);
    }
}