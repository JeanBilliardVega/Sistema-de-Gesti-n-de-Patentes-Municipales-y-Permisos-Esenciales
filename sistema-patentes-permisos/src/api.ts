const url_base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const rutas_api = {
    registrarse: `${url_base}/registrar`,
    login: `${url_base}/iniciar_sesion`
}