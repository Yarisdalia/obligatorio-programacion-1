class Sistema {
    constructor() {
        this.contrataciones = [];
        this.paseadores = [];
        this.clientes = [];
        this.userLogged = null;
    }

    // Registrar nuevo cliente (simplificado)
    registrarCliente(nombre, username, password, nombrePerro, tamanoPerro) {
        // Validaciones básicas
        if (!nombre || !username || !password || !nombrePerro || !tamanoPerro) {
            return "Todos los campos son obligatorios";
        }

        if (this.existeUsername(username)) {
            return "El nombre de usuario ya existe";
        }

        // Validar password
        const resultValidatePassword = this.validarPassword(password);
        if (resultValidatePassword !== "ok") {
            return resultValidatePassword;
        }

        // Crear perro y cliente
        const perro = new Perro(nombrePerro, tamanoPerro);
        const cliente = new Cliente(nombre, username, password, perro);

        this.clientes.push(cliente);
        return "ok";
    }

    // Login simplificado
    login(username, password) {
        this.userLogged = null;

        // Validar password
        const resultValidatePassword = this.validarPassword(password);
        if (resultValidatePassword !== "ok") {
            return resultValidatePassword;
        }

        // Buscar en paseadores
        for (let i = 0; i < this.paseadores.length; i++) {
            if (this.paseadores[i].username === username && this.paseadores[i].getPassword() === password) {
                this.userLogged = this.paseadores[i];
                return "ok";
            }
        }

        // Buscar en clientes
        for (let i = 0; i < this.clientes.length; i++) {
            if (this.clientes[i].username === username && this.clientes[i].getPassword() === password) {
                this.userLogged = this.clientes[i];
                return "ok";
            }
        }

        return "Usuario o contraseña incorrectos";
    }

    getPaseadoresDisponibles(cliente) {
        // Obtener todos los paseadores compatible con el perro del cliente y que tengan cupos disponibles para el tamaño del perro
        const paseadoresDisponibles = [];
        const tamanoPerro = cliente.perro.tamano;

        // Determinar cuántos cupos necesita el perro según su tamaño
        let cuposNecesarios = this.calcularCuposNecesarios(tamanoPerro);

        // Revisar cada paseador para ver si tiene cupos disponibles y es compatible
        for (let i = 0; i < this.paseadores.length; i++) {
            const paseador = this.paseadores[i];
            const cuposOcupados = this.calcularCuposOcupados(paseador);
            const cuposDisponibles = paseador.cupoMaximo - cuposOcupados;

            // Verificar si tiene suficientes cupos disponibles
            if (cuposDisponibles >= cuposNecesarios) {
                // Verificar compatibilidad con perros ya asignados
                const perrosAsignados = this.getPerrosAsignados(paseador);
                let esCompatible = true;

                for (let j = 0; j < perrosAsignados.length; j++) {
                    const tamanoAsignado = perrosAsignados[j].cliente.perro.tamano;

                    // Si el cliente tiene perro chico y el paseador ya tiene perros grandes, no es compatible
                    if (tamanoPerro === "chico" && tamanoAsignado === "grande") {
                        esCompatible = false;
                        break;
                    }

                    // Si el cliente tiene perro grande y el paseador ya tiene perros chicos, no es compatible
                    if (tamanoPerro === "grande" && tamanoAsignado === "chico") {
                        esCompatible = false;
                        break;
                    }
                }

                // Si el paseador es compatible, agregarlo a la lista
                if (esCompatible) {
                    paseadoresDisponibles.push(paseador);
                }
            }
        }

        return paseadoresDisponibles;
    }

    // Verificar si cliente tiene contratación activa
    getContratacionActual(cliente) {
        for (let i = 0; i < this.contrataciones.length; i++) {
            if (this.contrataciones[i].cliente.id === cliente.id &&
                (this.contrataciones[i].estado === "pendiente" || this.contrataciones[i].estado === "aprobada")) {
                return this.contrataciones[i];
            }
        }
        return null;
    }

    // Crear contratación
    crearContratacion(cliente, paseador) {
        const contratacion = new Contratacion(cliente, paseador);
        paseador.agregarContratacion(contratacion);
        this.contrataciones.push(contratacion);
    }

    // Cancelar contratación
    cancelarContratacion(contratacion) {
        contratacion.estado = "cancelada";
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

    // Validar si se puede aprobar una contratación
    puedeAprobarContratacion(contratacion) {
        const paseador = contratacion.paseador;
        const tamanoPerro = contratacion.cliente.perro.tamano;

        // Determinar cuántos cupos necesita el perro según su tamaño
        let cuposNecesarios = this.calcularCuposNecesarios(tamanoPerro);

        // Verificar cupos disponibles
        const cuposOcupados = this.calcularCuposOcupados(paseador);
        const cuposDisponibles = paseador.cupoMaximo - cuposOcupados;

        if (cuposDisponibles < cuposNecesarios) {
            return {
                puede: false,
                motivo: `No tienes suficientes cupos disponibles. Necesitas ${cuposNecesarios} cupos pero solo tienes ${cuposDisponibles} disponibles.`
            };
        }

        // Verificar compatibilidad con perros ya asignados
        const perrosAsignados = this.getPerrosAsignados(paseador);
        for (let i = 0; i < perrosAsignados.length; i++) {
            const tamanoAsignado = perrosAsignados[i].cliente.perro.tamano;

            // Si el cliente tiene perro chico y el paseador ya tiene perros grandes, no es compatible
            if (tamanoPerro === "chico" && tamanoAsignado === "grande") {
                return {
                    puede: false,
                    motivo: "No se puede aceptar: Los perros chicos no pueden estar con perros grandes por incompatibilidad de tamaños."
                };
            }

            // Si el cliente tiene perro grande y el paseador ya tiene perros chicos, no es compatible
            if (tamanoPerro === "grande" && tamanoAsignado === "chico") {
                return {
                    puede: false,
                    motivo: "No se puede aceptar: Los perros grandes no pueden estar con perros chicos por incompatibilidad de tamaños."
                };
            }
        }

        return {
            puede: true,
            motivo: "Contratación aprobada"
        };
    }

    // Aprobar contratación
    aprobarContratacion(contratacion) {
        contratacion.estado = "aprobada";
    }

    // Rechazar contratación
    rechazarContratacion(contratacion) {
        contratacion.estado = "rechazada";
    }

    // Obtener perros asignados a un paseador
    getPerrosAsignados(paseador) {
        const asignados = [];
        for (let i = 0; i < this.contrataciones.length; i++) {
            if (this.contrataciones[i].paseador.id === paseador.id && this.contrataciones[i].estado === "aprobada") {
                asignados.push(this.contrataciones[i]);
            }
        }
        return asignados;
    }

    // Información básica de paseadores
    getInfoPaseadores() {
        const info = [];
        for (let i = 0; i < this.paseadores.length; i++) {
            const paseador = this.paseadores[i];
            const perrosAsignados = this.getPerrosAsignados(paseador);
            info.push({
                nombre: paseador.nombre,
                cantidadPerros: perrosAsignados.length
            });
        }
        return info;
    }

    // -------------------------- funciones para agregar elementos al sistema ---------------------------------
    agregarPaseador(paseador) {
        this.paseadores.push(paseador);
    }

    agregarCliente(cliente) {
        this.clientes.push(cliente);
    }

    agregarContratacion(contratacion) {
        this.contrataciones.push(contratacion);
    }

    // --------------------------------- validaciones que se reutilizan ---------------------------------

    // Validar que el username no exista
    existeUsername(username) {
        // Verificar en paseadores
        for (let i = 0; i < this.paseadores.length; i++) {
            if (this.paseadores[i].username === username) {
                return true;
            }
        }

        // Verificar en clientes
        for (let i = 0; i < this.clientes.length; i++) {
            if (this.clientes[i].username === username) {
                return true;
            }
        }

        return false;
    }

    validarPassword(password) {
        if (password.length < 5) {
            return "La contraseña debe tener al menos 5 caracteres";
        }

        let tieneMayuscula = false;
        let tieneMinuscula = false;
        let tieneNumero = false;

        for (let i = 0; i < password.length; i++) {
            if (password[i] >= 'A' && password[i] <= 'Z') {
                tieneMayuscula = true;
            } else if (password[i] >= 'a' && password[i] <= 'z') {
                tieneMinuscula = true;
            } else if (password[i] >= '0' && password[i] <= '9') {
                tieneNumero = true;
            }
        }

        if (!tieneMayuscula || !tieneMinuscula || !tieneNumero) {
            return "La contraseña debe tener al menos una mayúscula, una minúscula y un número";
        }

        return "ok";
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

    // Calcular cupos necesarios para un perro según su tamaño
    calcularCuposNecesarios(tamanoPerro) {
        if (tamanoPerro === "grande") {
            return 4;
        } else if (tamanoPerro === "mediano") {
            return 2;
        } else if (tamanoPerro === "chico") {
            return 1;
        }
        return 0; // Por defecto
    }
}

