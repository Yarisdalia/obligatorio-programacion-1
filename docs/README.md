# 🐕 Nubbi - Sistema de Paseadores de Perros

## 📋 Descripción General

Nubbi es una aplicación web que conecta a dueños de perros con paseadores profesionales. El sistema permite a los clientes contratar servicios de paseo para sus mascotas y a los paseadores gestionar sus servicios y clientes.

## 🎯 Objetivos del Proyecto

- **Para Clientes**: Encontrar paseadores confiables para sus perros
- **Para Paseadores**: Gestionar contrataciones y optimizar su capacidad de trabajo
- **Para el Sistema**: Asegurar compatibilidad entre perros y disponibilidad de paseadores

## ✨ Funcionalidades Principales

### 👥 Para Clientes
- ✅ Registro con información del perro
- ✅ Login seguro
- ✅ Búsqueda de paseadores disponibles
- ✅ Contratación de servicios
- ✅ Visualización de información de paseadores

### 👨‍💼 Para Paseadores  
- ✅ Gestión de contrataciones pendientes
- ✅ Aprobación/rechazo de solicitudes
- ✅ Visualización de perros asignados
- ✅ Control de capacidad máxima

### 🧠 Sistema Inteligente
- ✅ Validación de compatibilidad entre perros
- ✅ Gestión automática de cupos
- ✅ Validaciones de seguridad
- ✅ Estados de contratación

## 🐕 Reglas de Negocio

### Tamaños de Perros y Cupos
- **Perro Grande**: Ocupa 4 cupos
- **Perro Mediano**: Ocupa 2 cupos  
- **Perro Chico**: Ocupa 1 cupo

### Compatibilidad
- ❌ **Perros grandes NO pueden estar con perros chicos**
- ✅ **Perros medianos pueden estar con cualquier tamaño**
- ✅ **Perros del mismo tamaño siempre son compatibles**

### Estados de Contratación
- 🟡 **Pendiente**: Esperando respuesta del paseador
- ✅ **Aprobada**: Paseador aceptó el servicio
- ❌ **Rechazada**: Paseador rechazó el servicio
- 🚫 **Cancelada**: Cliente canceló el servicio

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework CSS**: Bootstrap 5.3.0
- **Arquitectura**: Programación Orientada a Objetos
- **Patrón**: MVC (Modelo-Vista-Controlador)

## 📁 Estructura del Proyecto

```
entrega-nubbi-obligatorio/
├── index.html              # Archivo principal
├── css/                    # Estilos
│   ├── dashboard-cliente.css
│   ├── dashboard-paseador.css
│   ├── login.css
│   └── register.css
├── js/                     # Lógica de la aplicación
│   ├── clases/            # Modelos de datos
│   │   ├── cliente.js
│   │   ├── paseador.js
│   │   ├── perro.js
│   │   └── contratacion.js
│   ├── pages/             # Controladores de vistas
│   │   ├── init-login.js
│   │   ├── init-register.js
│   │   ├── init-dashboard-cliente.js
│   │   └── init-dashboard-paseador.js
│   ├── utils/             # Utilidades
│   │   ├── navigation.js
│   │   └── mensajes.js
│   ├── sistema.js         # Controlador principal
│   └── index.js           # Punto de entrada
├── img/                   # Recursos gráficos
└── docs/                  # Documentación
```

## 🚀 Cómo Usar la Aplicación

### Para Clientes
1. **Registro**: Crear cuenta con datos del perro
2. **Login**: Iniciar sesión
3. **Contratar**: Seleccionar paseador disponible
4. **Monitorear**: Ver estado de la contratación

### Para Paseadores
1. **Login**: Iniciar sesión (los paseadores se pre-cargan en el sistema)
2. **Revisar**: Ver contrataciones pendientes
3. **Decidir**: Aprobar o rechazar solicitudes
4. **Gestionar**: Ver perros asignados

## 📖 Documentación Adicional

- 📐 [**Arquitectura del Sistema**](./arquitectura.md) - Diagramas y estructura técnica
- 🏗️ [**Documentación de Clases**](./clases.md) - Todas las clases y sus métodos
- 🔄 [**Flujos del Sistema**](./flujos.md) - Diagramas de procesos
- 📚 [**API del Sistema**](./api.md) - Documentación de funciones

## 👨‍💻 Autor

**Proyecto desarrollado para el curso de Programación**

---

*¿Tienes preguntas? Revisa la documentación técnica en los archivos mencionados arriba.* 