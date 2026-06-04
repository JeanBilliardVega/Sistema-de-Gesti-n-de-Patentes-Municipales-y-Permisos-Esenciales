# Sistema de Gestión de Patentes Municipales y Permisos Esenciales

## Integrantes del grupo
* Hans Silva
* Jean Billiard
* Zhiheng Lei

## Descripción del Proyecto

Aplicación móvil construida con **Ionic + React** (TypeScript) para reducir los tiempos de obtención de patentes municipales y permisos esenciales mediante la digitalización, seguimiento en tiempo real y comunicación directa entre ciudadanos (solicitantes) y la entidad municipal (administradores).

---
## Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Ionic CLI](https://ionicframework.com/docs/cli): `npm install -g @ionic/cli`
- IDE recomendado: [WebStorm](https://www.jetbrains.com/webstorm/) o [Visual Studio Code](https://code.visualstudio.com/)

---
## Pasos para ejecutar el proyecto

1. **Descargar el repositorio y extraerlo** en tu computadora.
2. **Cambiar la terminal de PowerShell a CMD (Command Prompt)**.
3. Abre dos terminales (Una para el backend y la base de datos, la otra para frontend) y ejecutar:

**Paso opcional (solo si no tienes Vite instalado):** 
Durante la ejecución, si te pregunta si deseas instalar Vite, selecciona **Yes** y espera a que termine la instalación.

### 1. Terminal 1: Base de datos (Docker) y Backend
Primero accede a la carpeta backend-patentes-permisos
```bash
cd backend-patentes-permisos
```
#### 1.1. Base de datos (Docker)
```bash
docker-compose up -d
node crearTablas.js
```
#### 1.2. Backend
```bash
npm install
node app.js
```

### 2. Terminal 2: Frontend
```bash
cd sistema-patentes-permisos
npm install
ionic serve
```
## Acceso al panel del administrador (Se puede crear y utilizar una terminal 3 para realizar operaciones en la BD)

Para crear un usuario administrador, registrar un usuario normal y luego
cambiar su rol directamente en la base de datos:

Primero accede a la base de datos
```bash
docker exec -it web_movil psql -U admin -d db_patentes_permisos
```
Luego cambia el rol del usuario X como admin
```sql
UPDATE usuarios SET rol = 'admin' WHERE rut = 'rut del usuario a cambiar';
```
---
## EP 1.1: Requerimientos funcionales (7) y no funcionales (3)

### Requerimientos funcionales (RF)

| ID | Requerimiento | Rol asociado |
|----|----------------|----------------|
| RF1 | **Solicitud de patente municipal** – El usuario puede iniciar una solicitud llenando un formulario digital con datos del negocio y ubicación. | Ciudadano |
| RF2 | **Subida de documentos obligatorios** – El solicitante puede adjuntar archivos (PDF, imagen) como croquis, identificación, etc. | Ciudadano |
| RF3 | **Seguimiento de estado del trámite** – El usuario puede ver en tiempo real si su solicitud está en "Revisión", "Observada", "Aprobada" o "Rechazada". | Ciudadano |
| RF4 | **Gestión de solicitudes (Admin)** – El administrador puede listar, filtrar y cambiar el estado de cada solicitud. | Admin |
| RF5 | **Comunicación asíncrona** – El administrador puede dejar observaciones o requerimientos adicionales en la solicitud, y el ciudadano recibe una notificación. | Ciudadano + Admin |
| RF6 | **Dashboard de indicadores** – El admin visualiza métricas como: tiempo promedio de respuesta, solicitudes por estado, solicitudes por mes. | Admin |
| RF7 | **Descarga de resolución digital** – Una vez aprobada la patente o permiso, el ciudadano puede descargar el documento oficial en PDF. | Ciudadano |

### Requerimientos no funcionales (RNF)

| ID | Tipo | Descripción |
|----|------|--------------|
| RNF1 | **Rendimiento** | La aplicación debe cargar el listado de solicitudes del usuario en menos de 2 segundos bajo condiciones normales de red (3G/4G). |
| RNF2 | **Seguridad** | Todos los archivos subidos por los ciudadanos deben ser almacenados con cifrado AES-256 en el backend y validados contra malware. |
| RNF3 | **Usabilidad** | La aplicación debe superar una puntuación ≥ 80 en el System Usability Scale (SUS) en pruebas con 10 ciudadanos reales. |

---

## EP 1.2: Justificación del problema y análisis del usuario objetivo

### Justificación del problema

En muchos municipios, la obtención de una patente municipal o permisos esenciales (como funcionamiento, construcción, sanitarios, etc.) implica:
- Largas filas presenciales.
- Procesos opacos sin trazabilidad.
- Pérdida de documentos físicos.
- Tiempos de espera de semanas o meses.
- Falta de notificaciones sobre el estado del trámite.

Esto afecta directamente la economía local, desincentiva el emprendimiento y genera estrés en los ciudadanos.

### Análisis del usuario objetivo

| Tipo de usuario | Características | Necesidades principales |
|----------------|----------------|--------------------------|
| **Ciudadano / Emprendedor** | Personas naturales o jurídicas que necesitan abrir un negocio o realizar una actividad comercial. Bajo-medio conocimiento técnico. | Rapidez, claridad del proceso, notificaciones, acceso desde casa. |
| **Funcionario municipal (Admin)** | Personal de la ventanilla única o departamento de rentas. Manejo de expedientes. | Gestión eficiente de solicitudes, validación de documentos, comunicación con solicitantes, estadísticas. |

---

## EP 2: Descripción de la entrega
Implementación del backend con Node.js + Express, base de datos PostgreSQL, 
autenticación JWT con diferenciación de roles, integración frontend-backend 
y pruebas funcionales con Postman.

---

## EP 2.3: API Endpoints

### Autenticación (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/registrar` | Registrar nuevo usuario |
| POST | `/api/iniciar_sesion` | Iniciar sesión, retorna JWT |
| GET | `/api/usuario/:rut` | Obtener datos de usuario por RUT |

### Ciudadano (requiere JWT)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/ciudadano/mis_solicitudes` | Listar mis solicitudes |
| GET | `/api/ciudadano/solicitud/:id` | Ver detalle de una solicitud |
| POST | `/api/ciudadano/crear_solicitud` | Crear nueva solicitud (multipart/form-data) |

### Funcionario Admin (requiere JWT + rol admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/funcionario/todas_solicitudes` | Listar todas las solicitudes |
| GET | `/api/funcionario/solicitud/:id` | Ver detalle de cualquier solicitud |
| PUT | `/api/funcionario/solicitud/:id/estado` | Actualizar estado de solicitud |
| DELETE | `/api/funcionario/solicitud/:id` | Eliminar solicitud |

### Mensajes (requiere JWT)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/solicitud/:id/mensajes` | Obtener mensajes de una solicitud |
| POST | `/api/solicitud/:id/mensaje` | Enviar mensaje en una solicitud |

---
## EP2.7: Capturas de pruebas con Postman y Modelo ER
Capturas de pruebas con Postman y el Modelo Entidad Relación se encuentra en la carpeta "otros".
