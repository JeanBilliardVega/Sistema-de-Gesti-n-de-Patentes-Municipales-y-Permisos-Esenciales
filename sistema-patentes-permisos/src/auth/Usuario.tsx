interface Usuario {
    rut: string;
    nombre: string;
    email: string;
    rol: string;
}

export const obtenerToken = (): string | null => {
    return localStorage.getItem('token');
};

export const obtenerUsuario = (): Usuario | null => {
    const data = localStorage.getItem('usuario');

    if (!data) {
        return null;
    }
    try {
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
};

export const cerrarSesion = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
};

const tokenExpirado = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const estaAutenticado = (): boolean => {
    const token = obtenerToken();
    return !!token && !tokenExpirado(token);
};

export const tieneRolRequerido = (rolRequerido: string): boolean => {
    const usuario = obtenerUsuario();
    return usuario?.rol === rolRequerido;
};