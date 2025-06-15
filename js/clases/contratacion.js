let idCounter = 1;

class Contratacion {
    constructor(cliente, paseador, estado = "pendiente") {
        this.id = idCounter++;
        this.cliente = cliente;
        this.paseador = paseador;
        this.estado = estado; // pendiente, aprobada, rechazada, cancelada
        this.motivoRechazo = "";
    }
}