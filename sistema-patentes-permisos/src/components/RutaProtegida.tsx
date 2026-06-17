import { Route, Redirect, RouteProps } from 'react-router-dom';
import { estaAutenticado, obtenerUsuario } from '../auth/Usuario';

interface RutaProtegidaProps extends RouteProps {
    rol?: string;
    children?: React.ReactNode;
}

const RutaProtegida: React.FC<RutaProtegidaProps> = ({ children, rol, ...rest }) => {
    return (
        <Route {...rest}  render={({ location }) => {
                if (!estaAutenticado()) {
                    return (
                        <Redirect
                            to={{ pathname: '/ingresar', state: { from: location } }}
                        />
                    );
                }

                if (rol) {
                    const usuario = obtenerUsuario();
                    if (usuario?.rol !== rol) {
                        const destino = usuario?.rol === 'admin' ? '/funcionario/inicio' : '/ciudadano/inicio';
                        return <Redirect to={destino} />;
                    }
                }

                return children;
            }}
        />
    );
};

export default RutaProtegida;