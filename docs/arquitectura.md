# 📐 Arquitectura del Sistema Nubbi

## 🏗️ Visión General

El sistema Nubbi está diseñado siguiendo el patrón **MVC (Modelo-Vista-Controlador)** con una arquitectura orientada a objetos que separa claramente las responsabilidades.

## 🔧 Componentes Principales

### 📊 Modelo (Clases de Datos)
- **Sistema**: Controlador principal que gestiona toda la lógica de negocio
- **Cliente**: Representa a los dueños de perros
- **Paseador**: Representa a los cuidadores de perros
- **Perro**: Información de las mascotas
- **Contratacion**: Relación entre cliente y paseador

### 🖥️ Vista (Templates HTML)
- **Templates**: Componentes reutilizables en HTML
- **CSS**: Estilos específicos para cada vista
- **Bootstrap**: Framework CSS para responsividad

### 🎮 Controlador (JavaScript)
- **Sistema.js**: Lógica de negocio principal
- **Pages**: Controladores específicos para cada vista
- **Utils**: Funciones auxiliares y navegación

## 📋 Diagrama de Arquitectura General
```mermaid
graph TB
    subgraph "🖥️ CAPA DE PRESENTACIÓN"
        HTML["📄 index.html<br/>Templates HTML"]
        CSS["🎨 CSS Files<br/>Estilos"]
        Bootstrap["🎯 Bootstrap<br/>Framework UI"]
    end

    subgraph "🎮 CAPA DE CONTROLADOR"
        Navigation["🧭 navigation.js<br/>Navegación"]
        InitLogin["🔐 init-login.js<br/>Login Controller"]
        InitRegister["📝 init-register.js<br/>Register Controller"]
        InitDashCliente["👥 init-dashboard-cliente.js<br/>Cliente Controller"]
        InitDashPaseador["👨‍💼 init-dashboard-paseador.js<br/>Paseador Controller"]
        IndexJS["🚀 index.js<br/>Entry Point"]
    end

    subgraph "🧠 CAPA DE LÓGICA DE NEGOCIO"
        Sistema["⚙️ Sistema.js<br/>Core Business Logic"]
    end

    subgraph "📊 CAPA DE MODELO"
        Cliente["👤 Cliente.js<br/>Client Model"]
        Paseador["👨‍💼 Paseador.js<br/>Walker Model"]
        Perro["🐕 Perro.js<br/>Dog Model"]
        Contratacion["📋 Contratacion.js<br/>Contract Model"]
    end

    %% Relaciones principales
    HTML --> Navigation
    Navigation --> InitLogin
    Navigation --> InitRegister
    Navigation --> InitDashCliente
    Navigation --> InitDashPaseador
    IndexJS --> Navigation

    InitLogin --> Sistema
    InitRegister --> Sistema
    InitDashCliente --> Sistema
    InitDashPaseador --> Sistema

    Sistema --> Cliente
    Sistema --> Paseador
    Sistema --> Perro
    Sistema --> Contratacion

    Cliente --> Perro
    Contratacion --> Cliente
    Contratacion --> Paseador

    CSS --> HTML
    Bootstrap --> HTML
```

## 🔗 Relaciones entre Clases
```mermaid
classDiagram
    class Sistema {
        -contrataciones[]
        -paseadores[]
        -clientes[]
        -userLogged
        +registrarCliente()
        +login()
        +getPaseadoresDisponibles()
        +crearContratacion()
        +aprobarContratacion()
        +calcularCuposOcupados()
    }

    class Cliente {
        -id
        -nombre
        -username
        -password
        -perro
        -rol
        +getPassword()
    }

    class Paseador {
        -id
        -nombre
        -username
        -password
        -cupoMaximo
        -rol
        -contrataciones[]
        +getPassword()
        +agregarContratacion()
    }

    class Perro {
        -id
        -nombre
        -tamano
    }

    class Contratacion {
        -id
        -cliente
        -paseador
        -estado
    }

    %% Relaciones
    Sistema "1" --> "*" Cliente : gestiona
    Sistema "1" --> "*" Paseador : gestiona
    Sistema "1" --> "*" Contratacion : gestiona
    Cliente "1" --> "1" Perro : tiene
    Contratacion "*" --> "1" Cliente : involucra
    Contratacion "*" --> "1" Paseador : involucra
    Paseador "1" --> "*" Contratacion : recibe
```

## 🔄 Flujo de Datos

### Registro de Cliente
```
Usuario → Formulario → init-register.js → Sistema.registrarCliente() → new Cliente() → Array clientes[]
```

### Login
```
Usuario → Formulario → init-login.js → Sistema.login() → Validación → Dashboard
```

### Contratación
```
Cliente → Dashboard → init-dashboard-cliente.js → Sistema.getPaseadoresDisponibles() → Sistema.crearContratacion()
```

### Gestión de Paseador
```
Paseador → Dashboard → init-dashboard-paseador.js → Sistema.getContratacionesPendientes() → Sistema.aprobarContratacion()
```

## 🏛️ Arquitectura de Archivos

### Separación por Responsabilidades

```
js/
├── clases/          # MODELO - Entidades de datos
│   ├── sistema.js   # Lógica de negocio central
│   ├── cliente.js   # Entidad Cliente
│   ├── paseador.js  # Entidad Paseador
│   ├── perro.js     # Entidad Perro
│   └── contratacion.js # Entidad Contratación
├── pages/           # CONTROLADOR - Lógica de vistas
│   ├── init-login.js
│   ├── init-register.js
│   ├── init-dashboard-cliente.js
│   └── init-dashboard-paseador.js
├── utils/           # UTILIDADES - Funciones auxiliares
│   ├── navigation.js # Navegación entre vistas
│   └── mensajes.js   # Sistema de mensajes
└── index.js         # PUNTO DE ENTRADA
```

## 🔐 Seguridad y Validaciones

### Validaciones del Sistema
- **Contraseñas**: Mínimo 5 caracteres, mayúscula, minúscula, número
- **Usernames**: Únicos en todo el sistema
- **Campos**: Validación de campos obligatorios
- **Compatibilidad**: Reglas de negocio para perros

### Encapsulación
- Propiedades privadas con `#password`
- Métodos privados con `#validarPassword()`, `#existeUsername()`
- Getters para acceso controlado: `getPassword()`
