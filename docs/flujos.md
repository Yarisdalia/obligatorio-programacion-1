# 🔄 Flujos del Sistema Nubbi

Esta documentación describe los flujos principales del sistema con diagramas detallados.

## 📋 Índice de Flujos

1. [🔐 Flujo de Autenticación](#-flujo-de-autenticación)
2. [👥 Flujo de Registro de Cliente](#-flujo-de-registro-de-cliente)
3. [🐕 Flujo de Contratación de Servicio](#-flujo-de-contratación-de-servicio)
4. [👨‍💼 Flujo de Gestión de Paseador](#-flujo-de-gestión-de-paseador)
5. [⚙️ Flujo de Validación de Compatibilidad](#-flujo-de-validación-de-compatibilidad)

---

## 🔐 Flujo de Autenticación

**Objetivo**: Permitir que usuarios (clientes y paseadores) accedan al sistema de forma segura.

### 📊 Proceso

```mermaid
flowchart TD
    A["🚀 Usuario inicia aplicación"] --> B["📄 Carga index.html"]
    B --> C["🔐 Navega a Login"]
    C --> D["✍️ Usuario ingresa credenciales"]
    D --> E["📝 init-login.js captura datos"]
    E --> F["⚙️ Sistema.login(username, password)"]
    
    F --> G{"🔍 ¿Contraseña válida?"}
    G -->|❌ No| H["❌ Retorna error de formato"]
    H --> I["🚨 Muestra mensaje de error"]
    I --> C
    
    G -->|✅ Sí| J{"👨‍💼 ¿Es paseador?"}
    J -->|✅ Sí| K["✅ userLogged = paseador"]
    J -->|❌ No| L{"👥 ¿Es cliente?"}
    
    L -->|✅ Sí| M["✅ userLogged = cliente"]
    L -->|❌ No| N["❌ Usuario no encontrado"]
    N --> I
    
    K --> O["🚀 Navega a Dashboard Paseador"]
    M --> P["🚀 Navega a Dashboard Cliente"]
    
    O --> Q["🎯 Dashboard Paseador cargado"]
    P --> R["🎯 Dashboard Cliente cargado"]
```

### 🔑 Validaciones Aplicadas

1. **Formato de Contraseña**:
   - Mínimo 5 caracteres
   - Al menos 1 mayúscula
   - Al menos 1 minúscula
   - Al menos 1 número

2. **Búsqueda de Usuario**:
   - Primero busca en paseadores
   - Luego busca en clientes
   - Compara username y password

3. **Establecimiento de Sesión**:
   - `userLogged` se establece con el objeto usuario
   - Redirección según el rol (cliente/paseador)

### ❌ Casos de Error

- **Contraseña inválida**: Formato incorrecto
- **Usuario no encontrado**: Username/password incorrectos
- **Campos vacíos**: Validación en frontend

---

## 👥 Flujo de Registro de Cliente

**Objetivo**: Permitir que nuevos usuarios se registren como clientes con información de su perro.

### 📊 Proceso

```mermaid
flowchart TD
    A["👤 Usuario quiere registrarse"] --> B["📄 Navega a Registro"]
    B --> C["📝 Llena formulario"]
    C --> D["✍️ Ingresa datos del cliente"]
    D --> E["🐕 Ingresa datos del perro"]
    E --> F["📤 Envía formulario"]
    F --> G["⚙️ Sistema.registrarCliente()"]
    
    G --> H{"📋 ¿Campos completos?"}
    H -->|❌ No| I["❌ Campos obligatorios"]
    I --> J["🚨 Muestra error"]
    J --> C
    
    H -->|✅ Sí| K{"👤 ¿Username único?"}
    K -->|❌ No| L["❌ Username ya existe"]
    L --> J
    
    K -->|✅ Sí| M{"🔐 ¿Contraseña válida?"}
    M -->|❌ No| N["❌ Contraseña insegura"]
    N --> J
    
    M -->|✅ Sí| O["🐕 new Perro(nombre, tamaño)"]
    O --> P["👤 new Cliente(datos, perro)"]
    P --> Q["📋 clientes.push(cliente)"]
    Q --> R["✅ Registro exitoso"]
    R --> S["🔐 Redirige a Login"]
    S --> T["🎯 Cliente puede hacer login"]
```

### 📋 Datos Requeridos

**Cliente**:
- Nombre completo
- Username único
- Contraseña segura

**Perro**:
- Nombre del perro
- Tamaño (chico/mediano/grande)

### ✅ Validaciones Secuenciales

1. **Campos Obligatorios**: Todos los campos deben estar llenos
2. **Username Único**: No debe existir en clientes ni paseadores
3. **Contraseña Segura**: Debe cumplir políticas de seguridad
4. **Creación de Objetos**: Perro → Cliente → Almacenamiento

### 🎯 Resultado Exitoso

- Cliente registrado en `clientes[]`
- Redirección a login
- Usuario puede iniciar sesión inmediatamente

---

## 🐕 Flujo de Contratación de Servicio

**Objetivo**: Permitir que clientes contraten servicios de paseo con paseadores disponibles.

### 📊 Proceso

```mermaid
flowchart TD
    A["👥 Cliente logueado"] --> B["🐕 Quiere contratar servicio"]
    B --> C["⚙️ getContratacionActual()"]
    
    C --> D{"📋 ¿Ya tiene contratación?"}
    D -->|✅ Sí| E["🚨 Muestra contratación actual"]
    E --> F["❌ No puede contratar más"]
    
    D -->|❌ No| G["🔍 getPaseadoresDisponibles()"]
    G --> H["📊 Calcula cupos necesarios"]
    H --> I["🔄 Revisa cada paseador"]
    
    I --> J{"💺 ¿Tiene cupos?"}
    J -->|❌ No| K["⏭️ Siguiente paseador"]
    K --> I
    
    J -->|✅ Sí| L{"🐕 ¿Perros compatibles?"}
    L -->|❌ No| K
    L -->|✅ Sí| M["✅ Paseador disponible"]
    
    M --> N["📋 Lista paseadores"]
    N --> O["👤 Cliente selecciona"]
    O --> P["⚙️ crearContratacion()"]
    P --> Q["📄 new Contratacion()"]
    Q --> R["👨‍💼 paseador.agregarContratacion()"]
    R --> S["📋 contrataciones.push()"]
    S --> T["🟡 Estado: pendiente"]
    T --> U["✅ Contratación creada"]
```

### 🔒 Restricciones

1. **Una contratación por cliente**: No puede tener múltiples servicios activos
2. **Estados activos**: "pendiente" o "aprobada" bloquean nuevas contrataciones

### 🧮 Algoritmo de Compatibilidad

1. **Cálculo de Cupos**:
   - Perro grande: 4 cupos
   - Perro mediano: 2 cupos
   - Perro chico: 1 cupo

2. **Verificación de Disponibilidad**:
   - `cuposDisponibles = cupoMaximo - cuposOcupados`
   - Debe ser mayor o igual a cupos necesarios

3. **Compatibilidad de Tamaños**:
   - ❌ Grandes no con chicos
   - ✅ Medianos con cualquiera
   - ✅ Mismo tamaño siempre compatible

### 📋 Estados de Contratación

- **🟡 Pendiente**: Esperando respuesta del paseador
- **✅ Aprobada**: Servicio confirmado
- **❌ Rechazada**: Paseador rechazó
- **🚫 Cancelada**: Cliente canceló

---

## 👨‍💼 Flujo de Gestión de Paseador

**Objetivo**: Permitir que paseadores gestionen sus contrataciones y perros asignados.

### 📊 Proceso

```mermaid
flowchart TD
    A["👨‍💼 Paseador logueado"] --> B["📋 Ve contrataciones pendientes"]
    B --> C["⚙️ getContratacionesPendientes()"]
    C --> D["📊 Lista de solicitudes"]
    
    D --> E["👤 Selecciona una contratación"]
    E --> F{"🤔 ¿Qué decide?"}
    
    F -->|✅ Aprobar| G["⚙️ puedeAprobarContratacion()"]
    F -->|❌ Rechazar| H["⚙️ rechazarContratacion()"]
    
    G --> I{"💺 ¿Tiene cupos?"}
    I -->|❌ No| J["❌ Sin cupos disponibles"]
    J --> K["🚨 Muestra error"]
    
    I -->|✅ Sí| L{"🐕 ¿Compatibilidad OK?"}
    L -->|❌ No| M["❌ Perros incompatibles"]
    M --> K
    
    L -->|✅ Sí| N["⚙️ aprobarContratacion()"]
    N --> O["✅ Estado: aprobada"]
    
    H --> P["❌ Estado: rechazada"]
    
    O --> Q["🔄 Actualiza vista"]
    P --> Q
    K --> Q
    
    Q --> R["📊 Ve perros asignados"]
    R --> S["⚙️ getPerrosAsignados()"]
    S --> T["📋 Lista de perros actuales"]
```

### 🎯 Funcionalidades del Paseador

1. **Ver Contrataciones Pendientes**:
   - Lista filtrada por paseador
   - Solo estado "pendiente"

2. **Evaluar Solicitudes**:
   - Aprobar o rechazar
   - Validaciones automáticas de capacidad

3. **Gestionar Perros Asignados**:
   - Ver contrataciones aprobadas
   - Información de clientes y perros

### ⚡ Validaciones en Tiempo Real

- **Capacidad**: Verificación automática de cupos
- **Compatibilidad**: Evaluación de perros existentes
- **Feedback**: Mensajes específicos de por qué no puede aprobar

---

## ⚙️ Flujo de Validación de Compatibilidad

**Objetivo**: Asegurar que los perros asignados a un paseador sean compatibles entre sí.

### 📊 Proceso

```mermaid
flowchart TD
    A["🐕 Evaluar compatibilidad"] --> B["📏 Obtener tamaño perro nuevo"]
    B --> C["📊 calcularCuposNecesarios()"]
    
    C --> D{"🐕 ¿Tamaño del perro?"}
    D -->|🐕‍🦺 Grande| E["💺 Necesita 4 cupos"]
    D -->|🐕 Mediano| F["💺 Necesita 2 cupos"]
    D -->|🐕‍🦺 Chico| G["💺 Necesita 1 cupo"]
    
    E --> H["📊 calcularCuposOcupados()"]
    F --> H
    G --> H
    
    H --> I["🔢 cuposDisponibles = máximo - ocupados"]
    I --> J{"💺 ¿Cupos suficientes?"}
    
    J -->|❌ No| K["❌ Sin espacio"]
    J -->|✅ Sí| L["🐕 getPerrosAsignados()"]
    
    L --> M{"🐕 ¿Hay perros asignados?"}
    M -->|❌ No| N["✅ Compatible (primer perro)"]
    
    M -->|✅ Sí| O["🔄 Revisar cada perro"]
    O --> P{"🐕 Perro nuevo chico Y asignado grande?"}
    P -->|✅ Sí| Q["❌ Incompatible (tamaños)"]
    
    P -->|❌ No| R{"🐕 Perro nuevo grande Y asignado chico?"}
    R -->|✅ Sí| Q
    R -->|❌ No| S["✅ Compatible"]
    
    K --> T["📋 Retorna motivo rechazo"]
    Q --> T
    N --> U["📋 Retorna aprobación"]
    S --> U
```

### 🧮 Lógica de Cupos por Tamaño

```javascript
const cuposPorTamano = {
    "grande": 4,
    "mediano": 2,
    "chico": 1
};
```

### 🐕 Reglas de Compatibilidad

1. **Perros Grandes (4 cupos)**:
   - ✅ Pueden estar con otros grandes
   - ✅ Pueden estar con medianos
   - ❌ NO pueden estar con chicos

2. **Perros Medianos (2 cupos)**:
   - ✅ Pueden estar con cualquier tamaño
   - Son el "comodín" del sistema

3. **Perros Chicos (1 cupo)**:
   - ✅ Pueden estar con otros chicos
   - ✅ Pueden estar con medianos
   - ❌ NO pueden estar con grandes

### 🔍 Algoritmo de Validación

```javascript
function validarCompatibilidad(nuevoPerro, perrosAsignados) {
    // 1. Verificar cupos disponibles
    // 2. Si no hay perros asignados → Compatible
    // 3. Revisar cada perro asignado
    // 4. Aplicar reglas de incompatibilidad
    // 5. Retornar resultado con motivo
}
```

### 📊 Ejemplos de Compatibilidad

| Perros Actuales | Nuevo Perro | ¿Compatible? | Motivo |
|-----------------|-------------|--------------|--------|
| 2 Chicos | Grande | ❌ | Grandes no con chicos |
| 1 Grande | Chico | ❌ | Chicos no con grandes |
| 1 Mediano | Grande | ✅ | Medianos compatibles |
| 2 Grandes | Mediano | ✅ | Depende de cupos |
| Ninguno | Cualquiera | ✅ | Primer perro |

---
