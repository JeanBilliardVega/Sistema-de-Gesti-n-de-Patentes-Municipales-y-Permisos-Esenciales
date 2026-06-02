// src/components/Navbar.tsx
import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { homeOutline, documentTextOutline, logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Navbar.scss';

interface NavbarProps {
    tipoUsuario: 'ciudadano' | 'funcionario';
}

const Navbar: React.FC<NavbarProps> = ({ tipoUsuario }) => {
    const history = useHistory();

    const baseUrl = tipoUsuario === 'ciudadano' ? '/ciudadano' : '/funcionario';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('user');

        window.location.replace('/ingresar');
    };

    return (
        <IonHeader className="custom-navbar ion-no-border">
            <IonToolbar>
                <div slot="start" className="logo-container" onClick={() => history.push(`${baseUrl}/inicio`)}>
                    <img src="logo-municipalidad.webp" alt="Logo Municipalidad" className="navbar-logo" />
                    
                    <div className="logo-text-container">
                        <span className="muni-name">Santo Domingo</span>
                        <span className="muni-tagline">Municipalidad</span>
                    </div>
                </div>

                <IonButtons slot="end" className="navbar-buttons">
                    <IonButton onClick={() => history.push(`${baseUrl}/inicio`)} className="nav-link">
                        <IonIcon slot="start" icon={homeOutline} />
                        <span className="nav-text">Inicio</span>
                    </IonButton>

                    {tipoUsuario === 'ciudadano' && (
                        <IonButton onClick={() => history.push(`${baseUrl}/solicitudes`)} className="nav-link">
                            <IonIcon slot="start" icon={documentTextOutline} />
                            <span className="nav-text">Solicitudes</span>
                        </IonButton>
                    )}

                    <IonButton onClick={handleLogout} className="nav-link logout-btn">
                        <IonIcon slot="start" icon={logOutOutline} />
                        <span className="nav-text">Cerrar Sesión</span>
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    );
};

export default Navbar;