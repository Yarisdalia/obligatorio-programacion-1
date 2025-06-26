let sistema = new Sistema();
navigateTo("login", initLogin);

console.log("INICIANDO SISTEMA...");

// ------------------------------ PASEADORES ------------------------------
//Nombre Paseador, Usuario, Contraseña, Cupo máximo
sistema.agregarPaseador("Juan", "juan", "Juan123", 10);
sistema.agregarPaseador("Lucas", "lucas", "Lucas123", 7);
sistema.agregarPaseador("Sofia", "sofia", "Sofia123", 12);
sistema.agregarPaseador("Mario", "mario", "Mario123", 9);
sistema.agregarPaseador("Carla", "carla", "Carla123", 11);
// ------------------------------ PASEADORES ------------------------------

// ------------------------------ CLIENTES ------------------------------
// Nombre Cliente, Usuario del cliente, Contraseña, Nombre del perro, Tamaño
sistema.registrarCliente("Tomas", "tomas", "Tomas123", "lucky", "mediano");
sistema.registrarCliente("Ana", "ana", "Ana123", "luna", "grande");
sistema.registrarCliente("Bruno", "bruno", "Bruno123", "boby", "mediano");
sistema.registrarCliente("Eva", "eva", "Eva123", "marlo", "grande");
sistema.registrarCliente("Daniel", "daniel", "Daniel123", "bella", "chico");
sistema.registrarCliente("Elena", "elena", "Elena123", "toby", "chico");
sistema.registrarCliente("Fede", "fede", "Fede123", "sasha", "grande");
sistema.registrarCliente("Gabi", "gabi", "Gabi123", "duque", "mediano");
sistema.registrarCliente("Hector", "hector", "Hector123", "nala", "chico");
sistema.registrarCliente("Irene", "irene", "Irene123", "milo", "mediano");
sistema.registrarCliente("Jose", "jose", "Jose123", "kira", "chico");
sistema.registrarCliente("Karen", "karen", "Karen123", "thor", "grande");
sistema.registrarCliente("Leo", "leo", "Leo123", "coco", "chico");
sistema.registrarCliente("Mariana", "mariana", "Mariana123", "zeus", "grande");
sistema.registrarCliente("Nico", "nico", "Nico123", "lola", "mediano");
sistema.registrarCliente("Olga", "olga", "Olga123", "simon", "grande");
sistema.registrarCliente("Pablo", "pablo", "Pablo123", "daisy", "chico");
sistema.registrarCliente("Quimey", "quimey", "Quimey123", "ragnar", "grande");
sistema.registrarCliente("Raul", "raul", "Raul123", "maya", "chico");
sistema.registrarCliente("Sara", "sara", "Sara123", "lucky", "mediano");

// ------------------------------ CLIENTES ------------------------------

// ------------------------------ CONTRATACIONES ------------------------------
// Cliente, Paseador, Perro, Estado de la contratacion
sistema.agregarContratacion(sistema.clientes[14], sistema.paseadores[1], "pendiente");
sistema.agregarContratacion(sistema.clientes[5], sistema.paseadores[1], "rechazada");
sistema.agregarContratacion(sistema.clientes[19], sistema.paseadores[1], "aprobada");
sistema.agregarContratacion(sistema.clientes[10], sistema.paseadores[1], "rechazada");
sistema.agregarContratacion(sistema.clientes[8], sistema.paseadores[1], "pendiente");
sistema.agregarContratacion(sistema.clientes[2], sistema.paseadores[1], "aprobada");
sistema.agregarContratacion(sistema.clientes[3], sistema.paseadores[1], "pendiente");
sistema.agregarContratacion(sistema.clientes[13], sistema.paseadores[1], "pendiente");
sistema.agregarContratacion(sistema.clientes[1], sistema.paseadores[1], "rechazada");
sistema.agregarContratacion(sistema.clientes[18], sistema.paseadores[1], "aprobada");
// ------------------------------ CONTRATACIONES ------------------------------

console.log("PRECARGA COMPLETADA!");
console.log("Usuarios de prueba:");
console.log("Paseadores: juan/Juan123, lucas/Lucas123, sofia/Sofia123, mario/Mario123, carla/Carla123");
console.log("Clientes: tomas/Tomas123, ana/Ana123, bruno/Bruno123, etc.");
console.log(sistema);