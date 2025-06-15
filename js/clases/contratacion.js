let idCounter = 1;

class Contratacion {
    constructor(cliente, paseador, estado) {
        this.id = idCounter++;
        this.cliente = cliente;
        this.paseador = paseador;
        this.estado = estado || "pendiente"; // pendiente, aprobada, rechazada, cancelada
    }
}