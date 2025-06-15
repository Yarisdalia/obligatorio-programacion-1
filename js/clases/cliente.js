let idCliente = 1;

class Cliente {
    #password;
    constructor(nombre, username, password, perro) {
        this.id = idCliente++;
        this.nombre = nombre;
        this.username = username;
        this.#password = password;
        this.perro = perro;
        this.rol = "cliente";
    }
    
    getPassword() {
        return this.#password;
    }
}
