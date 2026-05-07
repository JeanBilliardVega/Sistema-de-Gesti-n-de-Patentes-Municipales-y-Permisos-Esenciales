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

        <Route exact path="/home">
          <Home />
        </Route>

        <Route exact path="/">
          <Redirect to="/ingresar" />
        </Route>

        <Route exact path="/ingresar">
          <Login />
        </Route>

        <Route exact path='/registrar'>
          <Register />
        </Route>

        <Route exact path="/dashCiudadano">
          <DashboardCiudadano />
        </Route>

        <Route exact path="/dashAdmin">
          <DashboardAdmin />
        </Route>

        <Route exact path="/solicitud/:id">
          <DetalleSolicitud />
        </Route>

        <Route exact path="/nueva-solicitud">
          <NuevaSolicitud />
        </Route>

        <Route exact path="/seguimiento">
          <SeguimientoSolicitudes />
        </Route>


      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
