export interface SolicitudRaw {
    id: number;
    estado: string;
    razon_social: string;
    tipo_patente: string;
    fecha_creacion: string;
    fecha_actualizacion?: string;
    ciudadano_nombre: string;
    ciudadano_rut: string;
    ciudadano_email: string;
    ciudadano_comuna: string;
    giro: string;
    direccion: string;
    superficie?: number;
    telefono: string;
    documentos?: Documento[];
    comuna: string;
}

export interface SolicitudFormateada {
    idReal: number;
    idVisual: string;
    negocio: string;
    ciudadano: string;
    rutCiudadano: string;
    tipo: string;
    fecha: string;
    estado: string;
    estadoCapitalizado: string;
    color: string;
    icon: string;
}

export interface Documento {
    id: number;
    nombre: string;
    tipo: string;
    ruta: string;
}

export interface DatoEstado {
    name: string;
    value: number;
    color: string;
}

export interface DatoMensual {
    mes: string;
    year: number;
    mesNum: number;
    solicitudes: number;
}

export interface MesData {
    mes: string;
    year: number;
    mesNum: number;
    solicitudes: number;
}

export interface SolicitudSeguimiento {
    id: number;
    negocio: string;
    tipo: string;
    fecha: string;
    estado: string;
    color: string;
    icon: string;
    progreso: number;
    ultimaActualizacion: string;
}

export interface LocationState {
    solicitud?: SolicitudRaw;
}

export interface Mensaje {
    id: number;
    contenido: string;
    autor_nombre: string;
    autor_rol: string;
    fecha_envio: string;
}