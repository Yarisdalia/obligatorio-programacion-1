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
        
        // Verificar en paseadores
        for (let i = 0; i < this.paseadores.length; i++) {
            if (this.paseadores[i].username === username) {
                existe = true;
                break;
            }
        }
        
        // Verificar en clientes
        for (let i = 0; i < this.clientes.length; i++) {
            if (this.clientes[i].username === username) {
                existe = true;
                break;
            }
        }
        
        return existe;
    }
    
    // Validar contraseña según requerimientos
    validarPassword(password) {
        if (password.length < 8) {
            return "La contraseña debe tener al menos 8 caracteres";
        }
        
        let tieneMayuscula = false;
        let tieneMinuscula = false;
        let tieneNumero = false;
        
        for (let i = 0; i < password.length; i++) {
            const caracter = password[i];
            if (caracter >= 'A' && caracter <= 'Z') {
                tieneMayuscula = true;
            } else if (caracter >= 'a' && caracter <= 'z') {
                tieneMinuscula = true;
            } else if (caracter >= '0' && caracter <= '9') {
                tieneNumero = true;
            }
        }
        
        if (!tieneMayuscula) {
            return "La contraseña debe tener al menos una mayúscula";
        }
        if (!tieneMinuscula) {
            return "La contraseña debe tener al menos una minúscula";
        }
        if (!tieneNumero) {
            return "La contraseña debe tener al menos un número";
        }
        
        return "valida";
    }
    
    // Registrar nuevo cliente
    registrarCliente(nombre, username, password, nombrePerro, tamanoPerro) {
        // Validar campos vacíos
        if (nombre === "" || username === "" || password === "" || nombrePerro === "" || tamanoPerro === "") {
            return "Todos los campos son obligatorios";
        }
        
        // Validar username único
        if (this.existeUsername(username)) {
            return "El nombre de usuario ya existe";
        }
        
        // Validar contraseña
        if (this.validarPassword(password) !== "valida") {
            return this.validarPassword(password);
        }
        
        // Crear perro y cliente
        const perro = new Perro(nombrePerro, tamanoPerro);
        const cliente = new Cliente(nombre, username, password, perro);
        
        // Agregar cliente al sistema
        this.clientes.push(cliente);
        
        return "ok";
    }
    
    // Login de usuarios
    login(username, password) {
        this.userLogged = null;
        
        // Buscar en paseadores
        for (let i = 0; i < this.paseadores.length; i++) {
            if (this.paseadores[i].username === username) {
                if (this.paseadores[i].getPassword() === password) {
                    this.userLogged = this.paseadores[i];
                    return "ok";
                } else {
                    return "Contraseña incorrecta";
                }
            }
        }
        
        // Buscar en clientes
        for (let i = 0; i < this.clientes.length; i++) {
            if (this.clientes[i].username === username) {
                if (this.clientes[i].getPassword() === password) {
                    this.userLogged = this.clientes[i];
                    return "ok";
                } else {
                    return "Contraseña incorrecta";
                }
            }
        }
        
        return "Usuario no encontrado";
    }
    
    // Calcular cupos ocupados por un paseador
    calcularCuposOcupados(paseador) {
        let cuposOcupados = 0;
        
        for (let i = 0; i < this.contrataciones.length; i++) {
            if (this.contrataciones[i].paseador.id === paseador.id && this.contrataciones[i].estado === "aprobada") {
                const tamano = this.contrataciones[i].cliente.perro.tamano;
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
        const disponibles = [];
        const tamanoPerro = cliente.perro.tamano;
        let cuposNecesarios;
        if (tamanoPerro === "grande") {
            cuposNecesarios = 4;
        } else if (tamanoPerro === "mediano") {
            cuposNecesarios = 2;
        } else {
            cuposNecesarios = 1;
        }
        
        for (let i = 0; i < this.paseadores.length; i++) {
            const paseador = this.paseadores[i];
            const cuposOcupados = this.calcularCuposOcupados(paseador);
            const cuposDisponibles = paseador.cupoMaximo - cuposOcupados;
            
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
        const contratacion = new Contratacion(cliente, paseador, "pendiente");
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
        const pendientes = [];
        for (let i = 0; i < this.contrataciones.length; i++) {
            if (this.contrataciones[i].paseador.id === paseador.id && this.contrataciones[i].estado === "pendiente") {
                pendientes.push(this.contrataciones[i]);
            }
        }
        return pendientes;
    }
    
    // Aprobar contratación específicamente
    aprobarContratacion(contratacion) {
        const paseador = contratacion.paseador;
        const cliente = contratacion.cliente;
        const tamanoPerro = cliente.perro.tamano;
        let cuposNecesarios;
        if (tamanoPerro === "grande") {
            cuposNecesarios = 4;
        } else if (tamanoPerro === "mediano") {
            cuposNecesarios = 2;
        } else {
            cuposNecesarios = 1;
        }
        
        // Verificar cupo disponible
        const cuposOcupados = this.calcularCuposOcupados(paseador);
        if (cuposOcupados + cuposNecesarios > paseador.cupoMaximo) {
            contratacion.estado = "rechazada";
            return "No se puede aprobar: No hay cupo suficiente";
        }
        
        // Verificar compatibilidad de tamaños
        if (tamanoPerro === "chico" && this.tienePerrosGrandes(paseador)) {
            contratacion.estado = "rechazada";
            return "No se puede aprobar: Incompatible con perros grandes existentes";
        }
        
        if (tamanoPerro === "grande" && this.tienePerrosChicos(paseador)) {
            contratacion.estado = "rechazada";
            return "No se puede aprobar: Incompatible con perros chicos existentes";
        }
        
        // Aprobar contratación
        contratacion.estado = "aprobada";
        
        // Rechazar automáticamente otras contrataciones incompatibles
        this.rechazarContratacionesIncompatibles(paseador, tamanoPerro);
        
        return "Contratación aprobada exitosamente";
    }
    
    // Rechazar contratación específicamente
    rechazarContratacion(contratacion) {
        contratacion.estado = "rechazada";
        return "Contratación rechazada";
    }
    
    // Rechazar contrataciones incompatibles automáticamente
    rechazarContratacionesIncompatibles(paseador, tamanoAprobado) {
        for (let i = 0; i < this.contrataciones.length; i++) {
            const contratacion = this.contrataciones[i];
            
            if (contratacion.paseador.id === paseador.id && contratacion.estado === "pendiente") {
                const tamanoContratacion = contratacion.cliente.perro.tamano;
                let cuposNecesarios;
                if (tamanoContratacion === "grande") {
                    cuposNecesarios = 4;
                } else if (tamanoContratacion === "mediano") {
                    cuposNecesarios = 2;
                } else {
                    cuposNecesarios = 1;
                }
                
                // Verificar cupo
                const cuposOcupados = this.calcularCuposOcupados(paseador);
                if (cuposOcupados + cuposNecesarios > paseador.cupoMaximo) {
                    contratacion.estado = "rechazada";
                    continue;
                }
                
                // Verificar incompatibilidad de tamaños
                if ((tamanoAprobado === "grande" && tamanoContratacion === "chico") ||
                    (tamanoAprobado === "chico" && tamanoContratacion === "grande")) {
                    contratacion.estado = "rechazada";
                }
            }
        }
    }
    
    // Obtener perros asignados a un paseador
    getPerrosAsignados(paseador) {
        const perros = [];
        for (let i = 0; i < this.contrataciones.length; i++) {
            if (this.contrataciones[i].paseador.id === paseador.id && this.contrataciones[i].estado === "aprobada") {
                perros.push(this.contrataciones[i].cliente.perro);
            }
        }
        return perros;
    }
    
    // Obtener información de todos los paseadores para cliente
    getInfoPaseadores() {
        const info = [];
        for (let i = 0; i < this.paseadores.length; i++) {
            const paseador = this.paseadores[i];
            const perrosAsignados = this.getPerrosAsignados(paseador);
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