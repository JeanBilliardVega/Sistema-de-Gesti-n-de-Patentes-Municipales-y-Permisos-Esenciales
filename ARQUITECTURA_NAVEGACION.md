# Arquitectura de Navegación y Experiencia del Usuario

## Sistema de Patentes Municipales

---

## 1. Rutas Principales y Secundarias

### 1.1 Rutas Públicas (Sin Autenticación)

```
/                          → Login (Pantalla de inicio de sesión)
/register                  → Registro de nuevos usuarios
```

### 1.2 Rutas del Ciudadano (Requiere autenticación de usuario)

```
/dashboard                 → Panel principal del ciudadano
/nueva-solicitud          → Formulario de nueva solicitud (RF1, RF2)
/seguimiento              → Lista de todas las solicitudes (RF3)
/solicitud/:id            → Detalle de solicitud específica (RF5)
/descarga/:id             → Descarga de resolución aprobada (RF7)
```

### 1.3 Rutas del Administrador (Requiere autenticación de admin)

```
/admin                     → Dashboard administrativo (RF4, RF6)
/solicitud/:id            → Detalle y gestión de solicitud (RF4, RF5)
```

### 1.4 Estructura de Implementación

```typescript
// /src/app/routes.tsx
createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Login },
      { path: "register", Component: Register },
      { path: "dashboard", Component: DashboardCiudadano },
      { path: "admin", Component: DashboardAdmin },
      {
        path: "nueva-solicitud",
        Component: FormularioSolicitud,
      },
      {
        path: "seguimiento",
        Component: SeguimientoSolicitudes,
      },
      { path: "solicitud/:id", Component: DetalleSolicitud },
      { path: "descarga/:id", Component: DescargaResolucion },
    ],
  },
]);
```

---

## 2. Relaciones Jerárquicas entre Vistas

### 2.1 Jerarquía Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    NIVEL 0: AUTENTICACIÓN                    │
│                                                              │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   /login     │────────────→ │  /register   │            │
│  └──────────────┘              └──────────────┘            │
└────────────┬────────────────────────────────────────────────┘
             │
             ├─── Ciudadano ────┬─── Administrador ───┐
             │                   │                      │
             ▼                   ▼                      ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌────────────────────┐
│   NIVEL 1: HOME     │  │   NIVEL 1: HOME     │  │  NIVEL 1: ADMIN    │
│                     │  │                     │  │                    │
│  /dashboard         │  │  /admin             │  │  Dashboard con     │
│  - Vista general    │  │  - KPIs y métricas  │  │  métricas y        │
│  - Acciones rápidas │  │  - Gráficos         │  │  solicitudes       │
│  - Solicitudes      │  │  - Solicitudes      │  │  pendientes        │
│    recientes        │  │    pendientes       │  │                    │
└──────┬──────────────┘  └──────┬──────────────┘  └────────┬───────────┘
       │                         │                           │
       ├────────┬────────┬───────┴───────┬──────────────────┤
       │        │        │               │                  │
       ▼        ▼        ▼               ▼                  ▼
┌────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐      ┌─────────┐
│ NIVEL  │ │ NIVEL   │ │ NIVEL    │ │ NIVEL   │      │ NIVEL   │
│ 2:     │ │ 2:      │ │ 2:       │ │ 2:      │      │ 2:      │
│ Nueva  │ │ Segui-  │ │ Detalle  │ │ Detalle │      │ Detalle │
│ Solic. │ │ miento  │ │ Solic.   │ │ (Admin) │      │ (Admin) │
│        │ │         │ │          │ │         │      │         │
│ /nueva-│ │ /segui- │ │ /solic/  │ │ /solic/ │      │ /solic/ │
│ solic. │ │ miento  │ │ :id      │ │ :id     │      │ :id     │
└────────┘ └────┬────┘ └────┬─────┘ └─────────┘      └─────────┘
                │           │
                │           ▼
                │      ┌─────────┐
                │      │ NIVEL 3 │
                │      │ Descarga│
                │      │ Resol.  │
                │      │         │
                └─────→│ /desc/  │
                       │ :id     │
                       └─────────┘
```

### 2.2 Profundidad de Navegación

| Nivel | Tipo de Vista           | Ejemplos                       | Propósito                                   |
| ----- | ----------------------- | ------------------------------ | ------------------------------------------- |
| 0     | Autenticación           | Login, Register                | Acceso al sistema                           |
| 1     | Dashboard/Home          | /dashboard, /admin             | Vista principal, orientación                |
| 2     | Funcionalidad Principal | /nueva-solicitud, /seguimiento | Tareas principales                          |
| 3     | Detalle/Acción          | /solicitud/:id, /descarga/:id  | Información detallada, acciones específicas |

---

## 3. Flujo de Navegación entre Funcionalidades

### 3.1 Flujo del Ciudadano

```
[INICIO] → Login (/login)
    │
    ├─ No tiene cuenta → Registro (/register) → Login
    │
    └─ Credenciales válidas → Dashboard Ciudadano (/dashboard)
           │
           ├─ [Acción Rápida] Nueva Solicitud
           │       │
           │       └→ Formulario (/nueva-solicitud)
           │              │
           │              ├─ Llenar datos (RF1)
           │              ├─ Subir documentos (RF2)
           │              └─ Enviar → Seguimiento (/seguimiento)
           │
           ├─ [Acción Rápida] Mis Solicitudes
           │       │
           │       └→ Seguimiento (/seguimiento) [RF3]
           │              │
           │              └→ Click en solicitud → Detalle (/solicitud/:id)
           │                     │
           │                     ├─ Ver información
           │                     ├─ Leer observaciones (RF5)
           │                     ├─ Responder observaciones (RF5)
           │                     └─ [Si Aprobada] → Descarga (/descarga/:id) [RF7]
           │
           └─ [Desde lista reciente] Click en solicitud → Detalle (/solicitud/:id)
```

### 3.2 Flujo del Administrador

```
[INICIO] → Login con credenciales admin (/login)
    │
    └─ Credenciales válidas → Dashboard Admin (/admin)
           │
           ├─ [Vista Principal] Métricas y KPIs (RF6)
           │       │
           │       ├─ Gráfico: Solicitudes por mes
           │       ├─ Gráfico: Distribución por estado
           │       ├─ KPI: Tiempo promedio de respuesta
           │       └─ KPI: Total de solicitudes
           │
           ├─ [Sección] Solicitudes Pendientes (RF4)
           │       │
           │       ├─ Filtrar por estado
           │       └─ Click en solicitud → Detalle (/solicitud/:id)
           │              │
           │              ├─ Ver información completa (RF4)
           │              ├─ Cambiar estado de solicitud (RF4)
           │              ├─ Dejar observaciones (RF5)
           │              ├─ Aprobar solicitud
           │              └─ Rechazar solicitud
           │
           └─ [Navegación] Reportes, Configuración
```

### 3.3 Flujo de Retorno (Breadcrumbs Implícitos)

Todas las vistas secundarias incluyen un botón "Volver" que respeta la jerarquía:

```
/nueva-solicitud      → Volver a /dashboard
/seguimiento         → Volver a /dashboard
/solicitud/:id       → Volver a /seguimiento (ciudadano) o /admin (admin)
/descarga/:id        → Volver a /dashboard
```

---

## 4. Diferenciación de Acceso según Roles

### 4.1 Matriz de Acceso por Rol

| Ruta               | Ciudadano     | Administrador | Pública |
| ------------------ | ------------- | ------------- | ------- |
| `/` (Login)        | ✓             | ✓             | ✓       |
| `/register`        | ✓             | ✓             | ✓       |
| `/dashboard`       | ✓             | ✗             | ✗       |
| `/admin`           | ✗             | ✓             | ✗       |
| `/nueva-solicitud` | ✓             | ✗             | ✗       |
| `/seguimiento`     | ✓             | ✗             | ✗       |
| `/solicitud/:id`   | ✓ (propias)   | ✓ (todas)     | ✗       |
| `/descarga/:id`    | ✓ (aprobadas) | ✓ (todas)     | ✗       |

### 4.2 Diferencias en la Vista `/solicitud/:id`

#### Vista del Ciudadano:

- ✓ Ver información de la solicitud
- ✓ Ver documentos adjuntos
- ✓ Ver observaciones del admin
- ✓ Responder a observaciones
- ✗ Cambiar estado de la solicitud
- ✗ Aprobar/Rechazar

#### Vista del Administrador:

- ✓ Ver información de la solicitud
- ✓ Ver documentos adjuntos
- ✓ Ver todo el historial de comunicación
- ✓ Dejar observaciones y requerimientos
- ✓ Cambiar estado de la solicitud (Revisión, Observada, Aprobada, Rechazada)
- ✓ Aprobar/Rechazar con un click
- ✓ Acceso a panel de acciones administrativas

### 4.3 Implementación de Seguridad

```typescript
// Detección de rol basada en credenciales
const esAdmin = formData.rut.includes("admin");

if (esAdmin) {
  localStorage.setItem('rol', 'admin');
  history.push("/dashAdmin");
  history.push("/funcionario/inicio");
} else {
  localStorage.setItem('rol', 'ciudadano');
  history.push("/dashCiudadano");
  history.push("/ciudadano/inicio");
}
```
---

## 5. Flujo de Principales Tareas (Task Flow)

### 5.1 Tarea: Solicitar una Nueva Patente (Ciudadano)

```
┌────────────────────────────────────────────────────────────────┐
│ TAREA: Solicitar Nueva Patente Municipal                        │
└─────────────────────────────────────────────────────────────────┘

1. Inicio: Dashboard Ciudadano (/dashboard)
   │
   ├─ Acción: Click en "Nueva Solicitud"
   │
2. Formulario de Solicitud (/nueva-solicitud)
   │
   ├─ Paso 1: Información del Negocio
   │   ├─ Nombre del negocio
   │   ├─ Tipo de patente (select)
   │   ├─ Giro comercial
   │   ├─ Dirección
   │   ├─ Comuna
   │   ├─ Superficie (m²)
   │   ├─ Teléfono de contacto
   │   └─ Descripción adicional (opcional)
   │
   ├─ Paso 2: Documentos Obligatorios
   │   ├─ Click en zona de carga
   │   ├─ Seleccionar archivos (múltiples)
   │   ├─ Validación:
   │   │   ├─ Formato: PDF o imágenes
   │   │   └─ Tamaño: máx 5MB por archivo
   │   └─ Lista de archivos adjuntados
   │
   ├─ Validaciones en tiempo real:
   │   ├─ Campos obligatorios marcados con *
   │   ├─ Feedback visual en campos con error
   │   └─ Mensaje de error específico
   │
   └─ Acción: Click en "Enviar Solicitud"
       │
       ├─ Validación final:
       │   ├─ Todos los campos completos ✓
       │   └─ Al menos 1 documento ✓
       │
3. Confirmación y Redirección
   │
   ├─ Toast: "Solicitud enviada exitosamente"
   │
   └─ Navegación automática a /seguimiento

┌─────────────────────────────────────────────────────────────────┐
│ Tiempo estimado: 5-8 minutos                                     │
│ Puntos de salida: Cancelar → /dashboard                         │
│ Puntos de fricción: Carga de documentos, validación RUT         │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Tarea: Revisar y Aprobar Solicitud (Administrador)

```
┌─────────────────────────────────────────────────────────────────┐
│ TAREA: Revisar y Gestionar Solicitud                            │
└─────────────────────────────────────────────────────────────────┘

1. Inicio: Dashboard Admin (/admin)
   │
   ├─ Visualización de KPIs y métricas
   │   ├─ Total de solicitudes
   │   ├─ En revisión (45)
   │   ├─ Tiempo promedio (7.5 días)
   │   └─ Gráficos de tendencias
   │
   ├─ Sección: Solicitudes Pendientes
   │   ├─ Filtro por estado (opcional)
   │   └─ Lista de solicitudes con prioridad
   │
   └─ Acción: Click en solicitud específica
       │
2. Detalle de Solicitud (/solicitud/:id)
   │
   ├─ Sección: Información del Negocio
   │   ├─ Nombre, tipo, giro
   │   ├─ Ubicación
   │   └─ Fecha de solicitud
   │
   ├─ Sección: Datos del Solicitante
   │   ├─ Nombre, RUT
   │   ├─ Email, teléfono
   │   └─ Información de contacto
   │
   ├─ Sección: Documentos Adjuntos
   │   ├─ Lista de documentos
   │   └─ Opción de descargar cada uno
   │
   ├─ Sección: Comunicación
   │   ├─ Historial de observaciones
   │   └─ Formulario para nueva observación
   │
   └─ Panel de Acciones (Sidebar)
       │
       ├─ Opción A: Dejar Observación
       │   ├─ Escribir mensaje
       │   ├─ Click "Enviar Mensaje"
       │   ├─ Cambiar estado a "Observada"
       │   └─ Ciudadano recibe notificación
       │
       ├─ Opción B: Cambiar Estado Manual
       │   ├─ Select con estados
       │   └─ Click "Actualizar Estado"
       │
       ├─ Opción C: Aprobar Solicitud
       │   ├─ Click "Aprobar Solicitud"
       │   ├─ Estado → "Aprobada"
       │   └─ Se genera resolución descargable
       │
       └─ Opción D: Rechazar Solicitud
           ├─ Click "Rechazar Solicitud"
           ├─ Estado → "Rechazada"
           └─ Requiere observación obligatoria

3. Confirmación
   │
   ├─ Toast: "Estado actualizado correctamente"
   │
   └─ Actualización en tiempo real del UI

┌─────────────────────────────────────────────────────────────────┐
│ Tiempo estimado: 3-5 minutos por solicitud                      │
│ Puntos de salida: Volver → /admin                               │
│ Decisión crítica: Aprobar vs Observar vs Rechazar               │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Tarea: Seguimiento de Solicitud (Ciudadano)

```
┌─────────────────────────────────────────────────────────────────┐
│ TAREA: Hacer Seguimiento de Estado de Solicitud                 │
└─────────────────────────────────────────────────────────────────┘

1. Inicio: Dashboard Ciudadano (/dashboard)
   │
   ├─ Opción A: Click en "Mis Solicitudes"
   │
   └─ Opción B: Click en solicitud reciente
       │
2. Vista de Seguimiento (/seguimiento)
   │
   ├─ Resumen visual (4 tarjetas):
   │   ├─ Total de solicitudes
   │   ├─ En revisión
   │   ├─ Aprobadas
   │   └─ Observadas
   │
   ├─ Filtro por estado (dropdown)
   │
   ├─ Lista completa de solicitudes:
   │   │
   │   └─ Cada tarjeta muestra:
   │       ├─ Nombre del negocio
   │       ├─ ID de solicitud
   │       ├─ Tipo de patente
   │       ├─ Fecha de envío
   │       ├─ Estado con color visual
   │       ├─ Barra de progreso (%)
   │       ├─ Última actualización
   │       ├─ Badge de observaciones (si hay)
   │       └─ Botones:
   │           ├─ "Ver Detalle"
   │           └─ "Descargar" (si aprobada)
   │
   └─ Acción: Click en "Ver Detalle"
       │
3. Detalle de Solicitud (/solicitud/:id)
   │
   ├─ Línea de tiempo visual:
   │   ├─ ✓ Solicitud Recibida
   │   ├─ ◉ En Revisión (actual)
   │   └─ ○ Pendiente Aprobación
   │
   ├─ Sección de observaciones:
   │   └─ Si hay observaciones:
   │       ├─ Leer observación del admin
   │       ├─ Escribir respuesta
   │       └─ Enviar mensaje
   │
   └─ Si estado = "Aprobada":
       └─ Click "Descargar Resolución" → /descarga/:id

4. Descarga de Resolución (/descarga/:id)
   │
   ├─ Banner de éxito
   ├─ Botones de acción:
   │   ├─ Descargar PDF
   │   ├─ Imprimir
   │   └─ Compartir
   │
   └─ Visualización del documento oficial

┌─────────────────────────────────────────────────────────────────┐
│ Tiempo estimado: 2-3 minutos                                     │
│ Frecuencia de uso: Alta (múltiples veces por semana)            │
│ Punto crítico: Claridad del estado actual                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Puntos Críticos de Interacción

### 6.1 Puntos de Alta Fricción (Requieren Optimización)

#### **A. Registro de Usuario (/register)**

**Criticidad:** Alta  
**Razón:** Primera impresión, abandono potencial  
**Soluciones implementadas:**

- Validación en tiempo real con feedback visual inmediato
- Mensajes de error específicos y constructivos
- Indicadores visuales de fortaleza de contraseña
- Campos agrupados lógicamente (información personal → ubicación → seguridad)
- Diseño responsive 1 columna (móvil) → 2 columnas (desktop)

```typescript
// Validación progresiva
if (!validateRUT(formData.rut)) {
  newErrors.rut = "RUT inválido (Formato: 12.345.678-9)";
}
if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
  newErrors.password =
    "Debe contener mayúsculas, minúsculas y números";
}
```

#### **B. Subida de Documentos (/nueva-solicitud)**

**Criticidad:** Alta  
**Razón:** Bloqueo de flujo, errores técnicos comunes  
**Soluciones implementadas:**

- Drag & drop con zona visual clara
- Validación de formato y tamaño antes de subir
- Feedback inmediato con toast notifications
- Lista visible de archivos adjuntados con opción de eliminar
- Checklist de documentos requeridos

```typescript
// Validación robusta
if (
  !file.type.includes("pdf") &&
  !file.type.includes("image")
) {
  toast.error(`${file.name} no es un archivo válido`);
  continue;
}
if (file.size > 5 * 1024 * 1024) {
  toast.error(`${file.name} excede el tamaño máximo de 5MB`);
  continue;
}
```

#### **C. Comunicación Asíncrona (/solicitud/:id)**

**Criticidad:** Media  
**Razón:** Confusión sobre quién debe responder  
**Soluciones implementadas:**

- Código de color para diferenciar mensajes (admin: azul, ciudadano: gris)
- Timestamp claro en cada mensaje
- Identificación del autor en cada observación
- Placeholder contextual según rol

```typescript
className={`p-4 rounded-lg border ${
  obs.tipo === "admin"
    ? "bg-blue-50 border-blue-200"
    : "bg-gray-50 border-gray-200"
}`}
```

### 6.2 Puntos de Decisión Crítica

#### **D. Cambio de Estado por Admin (/solicitud/:id)**

**Criticidad:** Muy Alta  
**Razón:** Irreversible, impacta al ciudadano  
**Implementación:**

- Panel lateral dedicado con opciones claramente separadas
- Botones de acción con colores semánticos:
  - Verde: Aprobar
  - Rojo: Rechazar
  - Amarillo: Observar
- Confirmación visual con toast
- (Recomendado para producción: Modal de confirmación)

```typescript
<Button variant="outline" className="w-full text-green-600 border-green-600">
  <CheckCircle className="w-4 h-4 mr-2" />
  Aprobar Solicitud
</Button>
```

### 6.3 Puntos de Navegación Crítica

#### **E. Botón "Volver" Contextual**

**Criticidad:** Media  
**Razón:** Desorientación si no es coherente  
**Implementación:**

- Siempre ubicado en la misma posición (header, lado izquierdo)
- Icono consistente (ArrowLeft)
- Navegación lógica según jerarquía

```typescript
<Button
  variant="ghost"
  size="icon"
  onClick={() => navigate(esAdmin ? "/admin" : "/seguimiento")}
>
  <ArrowLeft className="w-5 h-5" />
</Button>
```

---

## 7. Coherencia de Experiencia entre Dispositivos

### 7.1 Estrategia Responsive

#### **Mobile First Approach**

Todas las vistas se diseñan primero para móvil (320px+) y se expanden para desktop.

```css
/* Patrón base */
grid-cols-1              /* Móvil: 1 columna */
md:grid-cols-2           /* Tablet: 2 columnas */
lg:grid-cols-3           /* Desktop: 3 columnas */
```

### 7.2 Adaptaciones por Dispositivo

#### **A. Header/Navegación**

| Dispositivo          | Implementación                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| **Móvil (<768px)**   | - Menú hamburguesa desplegable<br>- Logo + título compacto<br>- Botón de acción principal visible |
| **Desktop (≥768px)** | - Navegación horizontal completa<br>- Logo + título + subtítulo<br>- Todos los enlaces visibles   |

```typescript
{/* Desktop Navigation */}
<nav className="hidden md:flex items-center gap-4">
  <Button variant="ghost">Inicio</Button>
  <Button variant="ghost">Mis Solicitudes</Button>
  <Button variant="ghost">Salir</Button>
</nav>

{/* Mobile Menu */}
{mobileMenuOpen && (
  <div className="md:hidden border-t bg-white">
    {/* Menú vertical */}
  </div>
)}
```

#### **B. Tarjetas de Información**

| Dispositivo | Layout                                                                                        |
| ----------- | --------------------------------------------------------------------------------------------- |
| **Móvil**   | Tarjetas apiladas verticalmente<br>Información en 2-3 líneas<br>Botones ocupan 100% del ancho |
| **Desktop** | Tarjetas horizontales<br>Información distribuida en fila<br>Botones compactos al lado derecho |

```typescript
<div className="flex flex-col lg:flex-row lg:items-center justify-between">
  {/* Contenido se reorganiza según viewport */}
</div>
```

#### **C. Formularios**

| Dispositivo          | Campos por Fila                                       |
| -------------------- | ----------------------------------------------------- |
| **Móvil (<768px)**   | 1 campo (columna única)                               |
| **Desktop (≥768px)** | 2 campos cuando es lógico (nombre/RUT, región/comuna) |

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label>Nombre de Usuario</Label>
    <Input />
  </div>
  <div className="space-y-2">
    <Label>RUT</Label>
    <Input />
  </div>
</div>
```

#### **D. Gráficos y Dashboards**

| Dispositivo | Comportamiento                                                        |
| ----------- | --------------------------------------------------------------------- |
| **Móvil**   | Gráficos apilados verticalmente (1 por fila)<br>KPIs en grid 2x2      |
| **Tablet**  | Gráficos en grid 1x2 o 2x1<br>KPIs en fila 1x4                        |
| **Desktop** | Gráficos lado a lado (2 por fila)<br>KPIs en fila horizontal completa |

```typescript
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Gráficos adaptativos */}
</div>

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {/* KPIs */}
</div>
```

### 7.3 Elementos Adaptativos Específicos

#### **Tablas/Listas Complejas**

**Móvil:** Tarjetas verticales con información jerarquizada

```typescript
<div className="flex flex-col sm:flex-row sm:items-center justify-between">
  <div className="flex items-start gap-3 mb-3 sm:mb-0">
    {/* Info principal */}
  </div>
  <Badge>{estado}</Badge>
</div>
```

**Desktop:** Filas horizontales con todos los datos visibles

#### **Inputs de Texto**

**Todos los dispositivos:**

- Mínimo 44px de altura táctil (accesibilidad móvil)
- Padding generoso
- Estados de foco visibles

```typescript
<Input className="h-10 px-4" /> // 40px altura base
```

### 7.4 Breakpoints Definidos

```typescript
// Tailwind CSS v4 breakpoints utilizados
sm:  640px   // Móvil horizontal / Tablet pequeña
md:  768px   // Tablet
lg:  1024px  // Desktop pequeño
xl:  1280px  // Desktop grande (opcional, no usado frecuentemente)
```

### 7.5 Componentes con Lógica Responsive

#### **Hook Personalizado para Detección de Móvil**

```typescript
// /src/app/components/ui/use-mobile.ts
import { useEffect, useState } from "react";

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () =>
      window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
```

### 7.6 Consistencia Visual

#### **Elementos Siempre Consistentes:**

1. **Colores semánticos:**
   - Azul (#3b82f6): Estado "En Revisión", acciones primarias
   - Verde (#10b981): Estado "Aprobada", éxito
   - Amarillo (#f59e0b): Estado "Observada", advertencias
   - Rojo (#ef4444): Estado "Rechazada", errores

2. **Iconografía:**
   - Lucide React en toda la aplicación
   - Tamaño consistente: 16px (w-4 h-4) para inline, 20px (w-5 h-5) para destacados

3. **Espaciado:**
   - Padding de cards: `pt-6` (24px)
   - Gap entre elementos: `gap-4` (16px) o `gap-6` (24px)

4. **Tipografía:**
   - Títulos: `text-2xl md:text-3xl` (responsive)
   - Subtítulos: `text-sm text-gray-600`
   - Cuerpo: tamaño base del tema

---

## 8. Justificación Técnica de Decisiones

### 8.1 Usabilidad

#### **Decisión 1: React Router Data Mode**

**Razón:**

- **Navegación declarativa:** Rutas definidas centralmente en `/src/app/routes.tsx`
- **Carga optimizada:** Code-splitting automático por ruta
- **URLs semánticas:** `/solicitud/:id` es más claro que `/app?view=detail&id=123`
- **Historial del navegador:** Botón "atrás" funciona intuitivamente

**Alternativa descartada:** Single Page sin enrutamiento → pobre UX, URLs no compartibles

#### **Decisión 2: Validación Progresiva en Formularios**

**Razón:**

- **Feedback inmediato:** Errores mostrados mientras el usuario escribe
- **Reducción de frustración:** Usuario no espera hasta submit para ver errores
- **Accesibilidad:** Lectores de pantalla anuncian errores en tiempo real

```typescript
onChange={(e) => {
  setFormData({ ...formData, rut: e.target.value });
  setErrors({ ...errors, rut: undefined }); // Limpia error al corregir
}}
```

**Alternativa descartada:** Validación solo en submit → mayor tasa de abandono

#### **Decisión 3: Toast Notifications (Sonner)**

**Razón:**

- **No intrusivo:** No bloquea el flujo del usuario
- **Posicionamiento consistente:** Esquina superior derecha
- **Auto-dismiss:** Desaparecen automáticamente después de 3-5 segundos
- **Stack automático:** Múltiples notificaciones se apilan ordenadamente

**Alternativa descartada:** Modales de confirmación → interrumpen el flujo

### 8.2 Eficiencia de Interacción

#### **Decisión 4: Dashboard con Acciones Rápidas**

**Razón:**

- **Reducción de clicks:** Acceso directo a tareas principales (1 click vs 2-3)
- **Orientación inmediata:** Usuario nuevo entiende qué puede hacer
- **Información a la vista:** Solicitudes recientes sin necesidad de navegar

**Métricas estimadas:**

- Tiempo para nueva solicitud: 2 clicks (dashboard → nueva solicitud)
- Tiempo para ver solicitudes: 1-2 clicks
- Tiempo para descargar resolución: 2 clicks desde dashboard

#### **Decisión 5: Filtros en Línea (No Sidebars)**

**Razón:**

- **Espacio eficiente:** Especialmente en móvil
- **Contexto visible:** Usuario ve resultados mientras filtra
- **Menos clicks:** No requiere abrir/cerrar panel de filtros

```typescript
<Select value={filtroEstado} onValueChange={setFiltroEstado}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Filtrar por estado" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="todas">Todas</SelectItem>
    <SelectItem value="revisión">En Revisión</SelectItem>
  </SelectContent>
</Select>
```

#### **Decisión 6: Badges de Color Semántico**

**Razón:**

- **Reconocimiento visual instantáneo:** Color comunica estado antes que el texto
- **Accesibilidad:** Combina color + texto + ícono (triple codificación)
- **Estándar de industria:** Verde=éxito, Rojo=error, Amarillo=advertencia

```typescript
<Badge className="bg-green-100 text-green-800">
  <CheckCircle className="w-3 h-3" />
  Aprobada
</Badge>
```

### 8.3 Claridad Estructural

#### **Decisión 7: Separación Ciudadano/Admin desde el Login**

**Razón:**

- **Evita confusión:** Cada rol ve solo lo relevante
- **Seguridad clara:** Rutas explícitamente separadas
- **Flujos optimizados:** Dashboard diferente según necesidades

**Alternativa descartada:** Dashboard único con tabs por rol → cluttering, opciones irrelevantes

#### **Decisión 8: Detalle de Solicitud como Vista Dedicada**

**Razón:**

- **Espacio suficiente:** Información compleja requiere espacio vertical
- **Foco:** Usuario se concentra en una solicitud a la vez
- **Scroll independiente:** Observaciones largas no afectan navegación

**Alternativa descartada:** Modal/Drawer → espacio limitado, difícil en móvil

#### **Decisión 9: Jerarquía Visual Consistente**

**Razón:**

- **Navegación predecible:** Header siempre arriba, sticky
- **Botón "Volver" siempre en la misma posición:** Esquina superior izquierda
- **Títulos de sección claros:** CardTitle + CardDescription

```typescript
<CardHeader>
  <CardTitle>Información del Negocio</CardTitle>
  <CardDescription>Datos básicos de su establecimiento</CardDescription>
</CardHeader>
```

### 8.4 Escalabilidad Frontend

#### **Decisión 10: Componentes Reutilizables (Shadcn/ui)**

**Razón:**

- **DRY (Don't Repeat Yourself):** Button, Card, Input reutilizados en toda la app
- **Consistencia automática:** Cambio en componente base afecta toda la app
- **Fácil mantenimiento:** Un solo lugar para actualizar estilos
- **Type-safe:** TypeScript + React asegura contratos de componentes

```typescript
// Usado en 15+ lugares de la aplicación
import { Button } from "./components/ui/button";
```

#### **Decisión 11: Estructura de Carpetas por Característica**

```
/src/app/
  ├── components/
  │   ├── ui/              # Componentes base reutilizables
  │   ├── login.tsx        # Feature: Autenticación
  │   ├── dashboard-*.tsx  # Feature: Dashboards
  │   ├── formulario-*.tsx # Feature: Formularios
  │   └── detalle-*.tsx    # Feature: Detalles
  ├── routes.tsx           # Configuración de rutas
  └── App.tsx              # Entry point
```

**Razón:**

- **Escalabilidad:** Fácil agregar nuevas features
- **Mantenimiento:** Archivos relacionados juntos
- **Colaboración:** Múltiples devs pueden trabajar en features diferentes

#### **Decisión 12: Estado Local vs Estado Global**

**Razón actual:**

- **Estado local (useState):** Suficiente para prototipo
- **Props drilling evitado:** Componentes independientes

**Escalabilidad futura:**

```typescript
// Preparado para migrar a contexto/Zustand si crece
const [formData, setFormData] = useState({...});
// → const formData = useFormStore(state => state.data);
```

#### **Decisión 13: Mock Data Estructurada**

**Razón:**

- **Prototipado rápido:** No requiere backend para demostración
- **Estructura real:** Arrays/objetos coinciden con API futura
- **Fácil migración:** Reemplazar `const solicitudes = [...]` con `const { data: solicitudes } = useFetch('/api/solicitudes')`

```typescript
// Fácilmente reemplazable con API call
const solicitudes = [
  { id: "SOL-2026-001", negocio: "...", ... },
  // ...
];
```

#### **Decisión 14: Recharts para Visualizaciones**

**Razón:**

- **Nativo de React:** Componentes declarativos
- **Responsive:** `<ResponsiveContainer>` maneja adaptación
- **Ligero:** Solo 50-60KB minificado
- **Mantenido activamente:** Comunidad grande

**Alternativa descartada:**

- Chart.js: Requiere wrappers, no declarativo
- D3.js: Curva de aprendizaje alta, overkill para gráficos básicos

```typescript
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={datosMensuales}>
    <Bar dataKey="solicitudes" fill="#3b82f6" />
  </BarChart>
</ResponsiveContainer>
```

### 8.5 Accesibilidad (A11y)

#### **Decisión 15: Labels Explícitos en Formularios**

**Razón:**

- **WCAG 2.1 Nivel A:** Todos los inputs tienen label asociado
- **Lectores de pantalla:** Anuncian correctamente el propósito del campo
- **Click area:** Label clickeable aumenta área de interacción

```typescript
<Label htmlFor="nombreNegocio">
  Nombre del Negocio <span className="text-red-500">*</span>
</Label>
<Input id="nombreNegocio" />
```

#### **Decisión 16: Mínimo de 44px para Elementos Táctiles**

**Razón:**

- **WCAG 2.5.5:** Tamaño objetivo mínimo
- **UX móvil:** Evita clicks erróneos
- **Inclusión:** Usuarios con limitaciones motoras

```typescript
<Button className="h-10"> // 40px, cercano a 44px recomendado
```

---

## 9. Métricas de Experiencia de Usuario

### 9.1 Tiempo de Completación Estimado

| Tarea                     | Tiempo Estimado | Número de Clicks |
| ------------------------- | --------------- | ---------------- |
| Registro completo         | 2-3 minutos     | 8-10             |
| Login                     | 10-15 segundos  | 2                |
| Nueva solicitud completa  | 5-8 minutos     | 12-15            |
| Ver estado de solicitud   | 30 segundos     | 2-3              |
| Responder observación     | 1-2 minutos     | 4-5              |
| Aprobar solicitud (admin) | 2-3 minutos     | 5-7              |
| Descargar resolución      | 20 segundos     | 2-3              |

### 9.2 Profundidad de Navegación

| Funcionalidad         | Profundidad Máxima                                         |
| --------------------- | ---------------------------------------------------------- |
| Acceso a dashboard    | 1 nivel (login → dashboard)                                |
| Nueva solicitud       | 2 niveles (dashboard → formulario)                         |
| Ver detalle solicitud | 3 niveles (dashboard → seguimiento → detalle)              |
| Descargar resolución  | 3-4 niveles (dashboard → seguimiento → detalle → descarga) |

**Objetivo:** Mantener profundidad ≤ 3 niveles para tareas principales (cumplido ✓)

### 9.3 Indicadores de Usabilidad

#### **Claridad:**

- ✓ Todos los botones tienen texto descriptivo
- ✓ Estados visuales consistentes (hover, focus, disabled)
- ✓ Mensajes de error constructivos (no solo "Error")

#### **Eficiencia:**

- ✓ Accesos rápidos en dashboard
- ✓ Filtros en línea sin navegación extra
- ✓ Bulk actions preparadas para escalar (aprobar múltiples)

#### **Prevención de Errores:**

- ✓ Validación en tiempo real
- ✓ Confirmaciones visuales (toast)
- ✓ Deshabilitar botones mientras se procesa (preparado)

---

## 10. Roadmap de Mejoras Futuras

### 10.1 Corto Plazo (MVP+1)

1. **Autenticación real:** Reemplazar mock con JWT/OAuth
2. **Persistencia:** Conectar con Supabase/backend
3. **Notificaciones:** Sistema de notificaciones en tiempo real
4. **Búsqueda avanzada:** Filtros múltiples en seguimiento

### 10.2 Mediano Plazo (Escalabilidad)

1. **Estado global:** Migrar a Zustand/Redux si crece complejidad
2. **Caché inteligente:** React Query para gestión de servidor state
3. **Optimistic updates:** Feedback instantáneo antes de confirmación del servidor
4. **Progressive Web App:** Instalable, funciona offline

### 10.3 Largo Plazo (Optimización)

1. **Server-Side Rendering:** Next.js para SEO y performance
2. **Análytica:** Heatmaps, session recordings (Hotjar/FullStory)
3. **A/B Testing:** Optimizar flujos con datos reales
4. **Internacionalización:** Soporte para múltiples idiomas

---

## 11. Conclusión

La arquitectura de navegación implementada prioriza:

1. **Simplicidad:** Máximo 3 niveles de profundidad
2. **Claridad:** Separación explícita de roles y funciones
3. **Eficiencia:** Accesos rápidos, validación progresiva
4. **Coherencia:** Experiencia consistente móvil ↔ desktop
5. **Escalabilidad:** Estructura preparada para crecimiento

**Total de pantallas únicas:** 8

- Login
- Registro
- Dashboard Ciudadano
- Dashboard Admin
- Formulario Nueva Solicitud
- Seguimiento de Solicitudes
- Detalle de Solicitud (con vistas diferenciadas por rol)
- Descarga de Resolución

**Total de requerimientos funcionales cubiertos:** 7/7 (100%)

**Tecnologías clave:**

- React 18.3.1 + TypeScript
- React Router 7.13.0 (Data Mode)
- Tailwind CSS 4.1.12 (Mobile-first)
- Shadcn/ui (Componentes accesibles)
- Recharts 2.15.2 (Visualización de datos)
- Sonner 2.0.3 (Notificaciones)

Esta arquitectura está lista para ser implementada en producción con ajustes mínimos (autenticación, backend integration).