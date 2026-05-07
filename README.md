# Sistema de Gestión de Patentes Municipales y Permisos Esenciales

## Descripción del Proyecto

Aplicación móvil construida con **Ionic + React** (TypeScript) para reducir los tiempos de obtención de patentes municipales y permisos esenciales mediante la digitalización, seguimiento en tiempo real y comunicación directa entre ciudadanos (solicitantes) y la entidad municipal (administradores).

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

# Sistema de Patentes y Permisos

## Requisitos

- Tener instalado [Node.js](https://nodejs.org/)
- Usar [WebStorm](https://www.jetbrains.com/webstorm/) o [Visual Studio Code](https://code.visualstudio.com/)

## Pasos para ejecutar la aplicación

1. **Descargar el repositorio y extraerlo** en tu computadora.
2. **Cambiar la terminal de PowerShell a CMD (Command Prompt)**.
3. Abrir la terminal y ejecutar:
```

cd sistema-patentes-permisos

```
4. Instalar Ionic CLI de manera global:
```

npm install -g @ionic/cli

```
5. Ejecutar la aplicación:
```

ionic serve

```
6. **Paso opcional (solo si no tienes Vite instalado):**  
Durante la ejecución, si te pregunta si deseas instalar Vite, selecciona **Yes** y espera a que termine la instalación.
7. ¡Listo! Ahora puedes usar la aplicación en tu navegador.
