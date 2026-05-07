import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonText
} from "@ionic/react";
import {
    logOutOutline,
    addCircleOutline,
    documentTextOutline,
    searchOutline,
    checkmarkCircleOutline,
    timeOutline,
    alertCircleOutline
} from "ionicons/icons";
import './DashboardCiudadano.scss';

// Datos simulados (Mock data)
const solicitudes = [
    { id: "SOL-2026-001", negocio: "Almacén Don Juan", tipo: "Patente Comercial", fecha: "10/04/2026", estado: "Aprobada", color: "success", icon: checkmarkCircleOutline },
    { id: "SOL-2026-012", negocio: "Cafetería Central", tipo: "Patente Comercial", fecha: "14/04/2026", estado: "Revisión", color: "primary", icon: timeOutline },
    { id: "SOL-2026-008", negocio: "Taller Mecánico", tipo: "Permiso Municipal", fecha: "05/04/2026", estado: "Observada", color: "warning", icon: alertCircleOutline },
];

const DashboardCiudadano: React.FC = () => {
    const history = useHistory();
    const [searchTerm, setSearchTerm] = useState("");

    // Lógica de filtrado y búsqueda
    const filteredSolicitudes = solicitudes.filter(
        (sol) =>
            sol.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sol.negocio.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLogout = () => {
        history.push("/ingresar");
    };

    return (
        <IonPage>
            {/* Barra de navegación superior */}
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Panel Ciudadano</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleLogout}>
                            <IonIcon slot="start" icon={logOutOutline} />
                            Salir
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding dashboard-bg">
                {/* Sección de bienvenida */}
                <div className="welcome-section ion-margin-bottom">
                    <IonText color="dark">
                        <h2>Bienvenido, Juan Pérez</h2>
                    </IonText>
                    <IonText color="medium">
                        <p>Gestiona tus solicitudes de patentes y permisos municipales</p>
                    </IonText>
                </div>

                {/* Sección de accesos rápidos (3 tarjetas) */}
                <IonGrid className="ion-no-padding ion-margin-bottom">
                    <IonRow>
                        {/* Tarjeta 1: Nueva solicitud */}
                        <IonCol size="12" sizeMd="4">
                            <IonCard className="action-card" button onClick={() => history.push("/nueva-solicitud")}>
                                <IonCardHeader>
                                    <div className="icon-wrapper icon-blue">
                                        <IonIcon icon={addCircleOutline} />
                                    </div>
                                    <IonCardTitle>Nueva Solicitud</IonCardTitle>
                                    <IonCardSubtitle>Solicita una nueva patente</IonCardSubtitle>
                                </IonCardHeader>
                            </IonCard>
                        </IonCol>

                        {/* Tarjeta 2: Mis solicitudes */}
                        <IonCol size="12" sizeMd="4">
                            <IonCard className="action-card" button onClick={() => history.push("/seguimiento")}>
                                <IonCardHeader>
                                    <div className="icon-wrapper icon-green">
                                        <IonIcon icon={documentTextOutline} />
                                    </div>
                                    <IonCardTitle>Mis Solicitudes</IonCardTitle>
                                    <IonCardSubtitle>Revisa el estado de tus trámites</IonCardSubtitle>
                                </IonCardHeader>
                            </IonCard>
                        </IonCol>

                        {/* Tarjeta 3: Buscar solicitud */}
                        <IonCol size="12" sizeMd="4">
                            <IonCard className="action-card" button onClick={() => document.getElementById('search-input')?.focus()}>
                                <IonCardHeader>
                                    <div className="icon-wrapper icon-purple">
                                        <IonIcon icon={searchOutline} />
                                    </div>
                                    <IonCardTitle>Buscar Solicitud</IonCardTitle>
                                    <IonCardSubtitle>Encuentra una solicitud por ID</IonCardSubtitle>
                                </IonCardHeader>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                {/* Sección de solicitudes recientes */}
                <IonCard className="list-card">
                    <IonCardHeader>
                        <IonCardTitle>Solicitudes Recientes</IonCardTitle>
                        <IonCardSubtitle>Últimas solicitudes realizadas</IonCardSubtitle>
                    </IonCardHeader>

                    <IonSearchbar
                        id="search-input"
                        value={searchTerm}
                        onIonInput={(e) => setSearchTerm(e.detail.value!)}
                        placeholder="Buscar por ID o Negocio..."
                        animated={true}
                    />

                    <IonList>
                        {filteredSolicitudes.length > 0 ? (
                            filteredSolicitudes.map((solicitud) => (
                                <IonItem
                                    key={solicitud.id}
                                    button
                                    detail={true}
                                    onClick={() => history.push(`/solicitud/${solicitud.id}`)}
                                >
                                    <IonIcon icon={documentTextOutline} slot="start" color="medium" />
                                    <IonLabel>
                                        <h2><strong>{solicitud.negocio}</strong></h2>
                                        <h3>{solicitud.id} • {solicitud.tipo}</h3>
                                        <p>Fecha: {solicitud.fecha}</p>
                                    </IonLabel>
                                    <IonBadge color={solicitud.color} slot="end" className="status-badge">
                                        <IonIcon icon={solicitud.icon} className="badge-icon"/>
                                        {solicitud.estado}
                                    </IonBadge>
                                </IonItem>
                            ))
                        ) : (
                            <IonItem>
                                <IonLabel className="ion-text-center">
                                    <p>No se encontraron solicitudes</p>
                                </IonLabel>
                            </IonItem>
                        )}
                    </IonList>

                    <div className="ion-padding">
                        <IonButton expand="block" fill="outline" onClick={() => history.push("/seguimiento")}>
                            Ver Todas las Solicitudes
                        </IonButton>
                    </div>
                </IonCard>

            </IonContent>
        </IonPage>
    );
};

export default DashboardCiudadano;