let idCliente = 1;

class Cliente {
    #password;
    constructor(nombre, username, password, perro) {
        this.id = idCliente++;
        this.nombre = nombre;
        this.username = username;
        this.#password = password;
        this.perro = perro; // Asumiendo que perro es un objeto de la clase Perro
        this.contrataciones = []; // Arreglo de contrataciones del cliente
        this.rol = "cliente";
    }
    getPassword() {
        return this.#password;
    }
    
    // Método para agregar una contratación al cliente
    agregarContratacion(contratacion) {
        this.contrataciones.push(contratacion);
    }
    
    // Método para obtener contrataciones por estado
    getContratacionesPorEstado(estado) {
        let resultado = [];
        for (let i = 0; i < this.contrataciones.length; i++) {
            if (this.contrataciones[i].estado === estado) {
                resultado.push(this.contrataciones[i]);
            }
        }
        return resultado;
    }
    
    // Método para obtener todas las contrataciones
    getContrataciones() {
        return this.contrataciones;
    }
}
