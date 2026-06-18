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
---
## Pasos para ejecutar el proyecto

Para desplegar el proyecto completo con un solo comando necesitamos Docker

---

### Despliegue completo con Docker

Para levantar los **3 servicios** (base de datos PostgreSQL, backend/API y frontend), se
utilizara `docker-compose`, usando un único comando desde la **raíz del proyecto**.

**Requisito:** tener Docker Desktop instalado y en ejecución.

1. **Descargar el repositorio y extraerlo** en tu computadora.
2. Copiar el archivo de variables de entorno de ejemplo y renombrarlo a .env:
   ```bash
   copy .env.example .env
   ```
   (En Windows: `copy`, en Linux: `cp`). Puedes editar `.env` para cambiar
   credenciales de la base de datos, url, el `JWT_SECRET`, etc.
3. Desde la raíz del proyecto, se contruye y levanta todo con:
   ```bash
   docker compose up --build
   ```
4. Para acceder a la aplicación en local se utiliza:
   - **Frontend (app):** http://localhost:8100
   - **Backend (API):** http://localhost:3000
   - **Base de datos:** localhost:5432

Las tablas de la base de datos se crean automáticamente al iniciar el backend.

Para detener todo:
```bash
docker compose down
```
Para detener todo y eliminar la base de datos:
```bash
docker compose down -v
```

#### Servicios orquestados (docker-compose.yml en la raíz)

| Servicio   | Imagen / Build                         | Puerto host → contenedor |
|------------|----------------------------------------|--------------------------|
| `db`       | postgres:15.6                          | 5432 → 5432              |
| `backend`  | build `./backend-patentes-permisos`    | 3000 → 3000              |
| `frontend` | build `./sistema-patentes-permisos` | 8100 → 80           |

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

---
## EF3: Seguridad avanzada en la API

El backend implementa las siguientes medidas de seguridad:

| Medida | Implementación |
|--------|----------------|
| **CORS seguro** | Restringido a los orígenes definidos en `FRONTEND_ORIGIN` (no usa `*`). Solo se permiten los métodos y cabeceras necesarios. |
| **Cabeceras HTTP seguras** | `helmet` (Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options, etc.) para mitigar XSS y clickjacking. |
| **Rate limiting** | `express-rate-limit`: límite general por IP y un límite más estricto en `/api/registrar` e `/api/iniciar_sesion` contra ataques de fuerza bruta. |
| **Validación y sanitización de entradas** | `express-validator` valida formato (email, RUT, longitudes) y sanitiza (`trim`, `escape`) los campos de texto en registro, login, creación de solicitudes y mensajes. |
| **Sanitización global anti-XSS** | Middleware propio (`cleanXSS`) que aplica la librería `xss` a todos los strings del cuerpo de la petición, neutralizando scripts maliciosos. |
| **Protección contra inyección SQL** | Todas las consultas usan **queries parametrizadas** (`$1, $2, ...`) con el driver `pg`. |
| **Hash de contraseñas** | `bcrypt` (las contraseñas nunca se almacenan en texto plano). |
| **Autenticación JWT** | Tokens firmados con expiración (4h) y middleware `verificarToken` en las rutas protegidas. |
| **Diferenciación por roles** | Las rutas de funcionario validan `rol === 'admin'`. |
| **Manejo seguro de credenciales** | Secretos (credenciales de BD, `JWT_SECRET`) gestionados por variables de entorno, fuera del código fuente. |

---
## EF5: Integración con servicio externo (correo Gmail)

El sistema integra un **servicio externo de correo** mediante `nodemailer` y **Gmail**.
Cuando el funcionario (admin) **aprueba una solicitud**, el ciudadano recibe
automáticamente un **correo de notificación**. Esto implementa el requerimiento
funcional **RF5 (notificaciones)**.

**Características de la integración:**
- **Pertinente al problema:** notifica al ciudadano cuando su trámite municipal es aprobado.
- **Configuración por variables de entorno:** las credenciales (`EMAIL_USER`, `EMAIL_PASS`) nunca están en el código.
- **Manejo de errores:** el envío está protegido con `try/catch`; si falla, se registra el error y **no se interrumpe** la actualización de estado.

**Variables de entorno (en `.env`):**

| Variable | Descripción |
|----------|-------------|
| `EMAIL_USER` | Cuenta de Gmail desde la que se envían los correos (ej. `tucorreo@gmail.com`) |
| `EMAIL_PASS` | **Contraseña de aplicación** de Gmail (no la contraseña normal de la cuenta) |

**Cómo obtener la contraseña de aplicación de Gmail:**
1. Activar la **verificación en 2 pasos** en tu cuenta de Google (Seguridad → Verificación en 2 pasos).
2. Ir a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Generar una contraseña de aplicación (16 caracteres) y copiarla.
4. Poner tu correo en `EMAIL_USER` y la contraseña generada en `EMAIL_PASS` dentro del `.env`.
5. Reiniciar el backend: `docker compose up -d --build backend`.

> Si `EMAIL_USER` / `EMAIL_PASS` quedan vacías, la aplicación funciona igual: solo se registrará un error en consola al intentar enviar el correo, sin afectar la operación.
