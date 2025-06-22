let sistema = new Sistema();
navigateTo("login", initLogin);

console.log("INICIANDO SISTEMA...");

// ------------------------------ PASEADORES ------------------------------
//Nombre Paseador, Usuario, Contraseña, Cupo máximo
const paseador1 = new Paseador("Juan", "juan", "Juan123", 10);
const paseador2 = new Paseador("Lucas", "lucas", "Lucas123", 7);
const paseador3 = new Paseador("Sofia", "sofia", "Sofia123", 12);
const paseador4 = new Paseador("Mario", "mario", "Mario123", 9);
const paseador5 = new Paseador("Carla", "carla", "Carla123", 11);

sistema.agregarPaseador(paseador1);
sistema.agregarPaseador(paseador2);
sistema.agregarPaseador(paseador3);
sistema.agregarPaseador(paseador4);
sistema.agregarPaseador(paseador5);
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
const contratacion1 = new Contratacion(sistema.clientes[14], paseador2, "pendiente"); // nico - lola (mediano)
const contratacion2 = new Contratacion(sistema.clientes[5], paseador2, "rechazada"); // elena - toby (chico)
const contratacion3 = new Contratacion(sistema.clientes[19], paseador2, "aprobada"); // sara - lucky (mediano)
const contratacion4 = new Contratacion(sistema.clientes[10], paseador2, "rechazada"); // jose - kira (chico)
const contratacion5 = new Contratacion(sistema.clientes[8], paseador2, "pendiente"); // hector - nala (chico)
const contratacion6 = new Contratacion(sistema.clientes[2], paseador2, "aprobada"); // bruno - boby (mediano)
const contratacion7 = new Contratacion(sistema.clientes[3], paseador2, "pendiente"); // carla - rocky (grande)
const contratacion8 = new Contratacion(sistema.clientes[13], paseador2, "pendiente"); // mariana - zeus (grande)
const contratacion9 = new Contratacion(sistema.clientes[1], paseador2, "rechazada"); // ana - luna (grande)
const contratacion10 = new Contratacion(sistema.clientes[18], paseador2, "aprobada"); // raul - maya (chico)

// Agregar contrataciones al sistema y a los arreglos individuales de clientes y paseadores
sistema.agregarContratacion(contratacion1);
paseador2.agregarContratacion(contratacion1);

sistema.agregarContratacion(contratacion2);
paseador2.agregarContratacion(contratacion2);

sistema.agregarContratacion(contratacion3);
paseador2.agregarContratacion(contratacion3);

sistema.agregarContratacion(contratacion4);
paseador2.agregarContratacion(contratacion4);

sistema.agregarContratacion(contratacion5);
paseador2.agregarContratacion(contratacion5);

sistema.agregarContratacion(contratacion6);
paseador2.agregarContratacion(contratacion6);

sistema.agregarContratacion(contratacion7);
paseador2.agregarContratacion(contratacion7);

sistema.agregarContratacion(contratacion8);
paseador2.agregarContratacion(contratacion8);

sistema.agregarContratacion(contratacion9);
paseador2.agregarContratacion(contratacion9);

sistema.agregarContratacion(contratacion10);
paseador2.agregarContratacion(contratacion10);
// ------------------------------ CONTRATACIONES ------------------------------

console.log("PRECARGA COMPLETADA!");
console.log("Usuarios de prueba:");
console.log("Paseadores: juan/Juan123, lucas/Lucas123, sofia/Sofia123, mario/Mario123, carla/Carla123");
console.log("Clientes: tomas/Tomas123, ana/Ana123, bruno/Bruno123, etc.");
console.log(sistema);