import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardCiudadano from "./pages/DashboardCiudadano";
import DashboardAdmin from "./pages/DashboardAdmin";
import DetalleSolicitud from "./pages/DetalleSolicitud";
import NuevaSolicitud from "./pages/NuevaSolicitud";
import SeguimientoSolicitudes from "./pages/SeguimientoSolicitudes";
import RutaProtegida from "./components/RutaProtegida";

/* CSS básico requerido para que los componentes de Ionic funcionen correctamente */
import '@ionic/react/css/core.css';
/* CSS básico para aplicaciones construidas con Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Utilidades CSS opcionales que pueden ser comentadas */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';



setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* PÚBLICO */}
        <Route exact path="/">
          <Redirect to="/ingresar" />
        </Route>
        <Route exact path="/ingresar">
          <Login />
        </Route>
        <Route exact path='/registrar'>
          <Register />
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>

        {/* CIUDADANO */}
        <RutaProtegida exact path="/ciudadano">
          <Redirect to="/ciudadano/inicio" />
        </RutaProtegida>
        <RutaProtegida exact path="/ciudadano/inicio" rol="ciudadano">
          <DashboardCiudadano />
        </RutaProtegida>
        <RutaProtegida exact path="/ciudadano/solicitudes" rol="ciudadano">
          <SeguimientoSolicitudes />
        </RutaProtegida>
        <RutaProtegida exact path="/ciudadano/nueva-solicitud" rol="ciudadano">
          <NuevaSolicitud />
        </RutaProtegida>
        <RutaProtegida exact path="/ciudadano/solicitudes/:id" rol="ciudadano">
          <DetalleSolicitud />
        </RutaProtegida>

        {/* FUNCIONARIO */}
        <RutaProtegida exact path="/funcionario">
          <Redirect to="/funcionario/inicio" />
        </RutaProtegida>
        <RutaProtegida exact path="/funcionario/inicio" rol="admin">
          <DashboardAdmin />
        </RutaProtegida>
        <RutaProtegida exact path="/funcionario/solicitudes/:id" rol="admin">
          <DetalleSolicitud />
        </RutaProtegida>

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
