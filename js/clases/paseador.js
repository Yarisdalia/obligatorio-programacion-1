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
    
    agregarContratacion(contratacion) {
        this.contrataciones.push(contratacion);
    }
    
    getContratacionesPorEstado(estado) {
        let resultado = [];
        for (let i = 0; i < this.contrataciones.length; i++) {
            if (this.contrataciones[i].estado === estado) {
                resultado.push(this.contrataciones[i]);
            }
        }
        return resultado;
    }
    
    getContrataciones() {
        return this.contrataciones;
    }
}