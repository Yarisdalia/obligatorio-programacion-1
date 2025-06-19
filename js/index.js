let sistema = new Sistema();
navigateTo("login", initLogin);

console.log("INICIANDO SISTEMA...");

// ------------------------------ PASEADORES ------------------------------
// Según la tabla: Usuario, Contraseña, Cupo máximo
const paseador1 = new Paseador("Juan", "juan", "Juan123", 10);
const paseador2 = new Paseador("Lucas", "lucas", "Lucas123", 15);
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
// Según la tabla: Usuario, Contraseña, Nombre del perro, Tamaño
sistema.registrarCliente("Tomas", "tomas", "Tomas123", "lucky", "mediano");
sistema.registrarCliente("Ana", "ana", "Ana123", "luna", "grande");
sistema.registrarCliente("Bruno", "bruno", "Bruno123", "boby", "mediano");
sistema.registrarCliente("Carla", "carla", "Carla123", "rocky", "grande");
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
sistema.agregarCliente(cliente1);
sistema.agregarCliente(cliente2);
sistema.agregarCliente(cliente3);
sistema.agregarCliente(cliente4);
sistema.agregarCliente(cliente5);
sistema.agregarCliente(cliente6);
sistema.agregarCliente(cliente7);
sistema.agregarCliente(cliente8);
sistema.agregarCliente(cliente9);
sistema.agregarCliente(cliente10);
sistema.agregarCliente(cliente11);
sistema.agregarCliente(cliente12);
sistema.agregarCliente(cliente13);
sistema.agregarCliente(cliente14);
sistema.agregarCliente(cliente15);
sistema.agregarCliente(cliente16);
sistema.agregarCliente(cliente17);
sistema.agregarCliente(cliente18);
sistema.agregarCliente(cliente19);
sistema.agregarCliente(cliente20);
// ------------------------------ CLIENTES ------------------------------

// ------------------------------ CONTRATACIONES ------------------------------
// Según la tabla de contrataciones: Cliente, Paseador (p2), Perro, Estado

// Contrataciones con paseador2 (lucas) según la tabla
const contratacion1 = new Contratacion(cliente15, paseador2, "pendiente"); // nico - lola (mediano)
const contratacion2 = new Contratacion(cliente6, paseador2, "rechazada"); // elena - toby (chico)
const contratacion3 = new Contratacion(cliente20, paseador2, "aprobada"); // sara - lucky (mediano)
const contratacion4 = new Contratacion(cliente11, paseador2, "rechazada"); // jose - kira (chico)
const contratacion5 = new Contratacion(cliente9, paseador2, "pendiente"); // hector - nala (chico)
const contratacion6 = new Contratacion(cliente3, paseador2, "aprobada"); // bruno - boby (mediano)
const contratacion7 = new Contratacion(cliente4, paseador2, "pendiente"); // carla - rocky (grande)
const contratacion8 = new Contratacion(cliente14, paseador2, "pendiente"); // mariana - zeus (grande)
const contratacion9 = new Contratacion(cliente2, paseador2, "rechazada"); // ana - luna (grande)
const contratacion10 = new Contratacion(cliente19, paseador2, "aprobada"); // raul - maya (chico)

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
console.log("Sistema inicializado con:");
console.log("- 5 Paseadores: juan, lucas, sofia, mario, carla");
console.log("- 20 Clientes: tomas, ana, bruno, carla, daniel, elena, fede, gabi, hector, irene, jose, karen, leo, mariana, nico, olga, pablo, quimey, raul, sara");
console.log("- 10 Contrataciones (3 aprobadas, 4 pendientes, 3 rechazadas)");
console.log("Usuarios de prueba:");
console.log("Paseadores: juan/Juan123, lucas/Lucas123, sofia/Sofia123, mario/Mario123, carla/Carla123");
console.log("Clientes: tomas/Tomas123, ana/Ana123, bruno/Bruno123, etc.");
console.log(sistema);