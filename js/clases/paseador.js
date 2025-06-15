let idPaseador = 1;

class Paseador {
    #password;
    
    constructor(nombre, username, password, cupoMaximo) {
        this.id = idPaseador++;
        this.nombre = nombre;
        this.username = username;
        this.#password = password;
        this.cupoMaximo = cupoMaximo;
        this.rol = "paseador";
        this.contrataciones = [];
    }
    
    getPassword() {
        return this.#password;
    }

    // --- funciones para agregar elementos al sistema ---
    agregarContratacion(contratacion) {
        this.contrataciones.push(contratacion);
    }
}