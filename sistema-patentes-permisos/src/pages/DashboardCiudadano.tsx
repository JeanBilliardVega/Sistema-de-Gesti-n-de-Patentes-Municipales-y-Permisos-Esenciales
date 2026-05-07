// src/pages/DashboardCiudadano.tsx
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage, IonContent, IonGrid, IonRow, IonCol, IonCard,
    IonCardHeader, IonCardTitle, IonCardSubtitle, IonSearchbar,
    IonList, IonItem, IonLabel, IonBadge, IonText, IonIcon, IonButton
} from "@ionic/react";
import {
    addCircleOutline, documentTextOutline, searchOutline,
    checkmarkCircleOutline, timeOutline, alertCircleOutline
} from "ionicons/icons";

import Navbar from "../components/Navbar";
import './DashboardCiudadano.scss';

// Mock data
const solicitudes = [
    { id: "SOL-2026-001", negocio: "Almacén Don Juan", tipo: "Patente Comercial", fecha: "10/04/2026", estado: "Aprobada", color: "success", icon: checkmarkCircleOutline },
    { id: "SOL-2026-012", negocio: "Cafetería Central", tipo: "Patente Comercial", fecha: "14/04/2026", estado: "Revisión", color: "primary", icon: timeOutline },
    { id: "SOL-2026-008", negocio: "Taller Mecánico", tipo: "Permiso Municipal", fecha: "05/04/2026", estado: "Observada", color: "warning", icon: alertCircleOutline },
];

const DashboardCiudadano: React.FC = () => {
    const history = useHistory();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSolicitudes = solicitudes.filter(
        (sol) =>
            sol.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sol.negocio.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <IonPage>
            <Navbar tipoUsuario="ciudadano" />

            <IonContent fullscreen className="dashboard-bg">
                <div className="dashboard-container">
                    
                    <div className="welcome-section">
                        <IonText color="dark">
                            <h2 className="welcome-title">Bienvenido, Juan Pérez</h2>
                        </IonText>
                        <IonText color="medium">
                            <p className="welcome-subtitle">Gestiona tus solicitudes de patentes y permisos municipales</p>
                        </IonText>
                    </div>

                    <IonGrid className="ion-no-padding action-grid">
                        <IonRow>
                            <IonCol size="12" sizeMd="4">
                                <IonCard className="action-card new-request-card" button onClick={() => history.push("/ciudadano/nueva-solicitud")}>
                                    <IonCardHeader>
                                        <div className="icon-wrapper primary-bg">
                                            <IonIcon icon={addCircleOutline} />
                                        </div>
                                        <IonCardTitle>Nueva Solicitud</IonCardTitle>
                                        <IonCardSubtitle>Solicita una nueva patente</IonCardSubtitle>
                                    </IonCardHeader>
                                </IonCard>
                            </IonCol>

                            <IonCol size="12" sizeMd="4">
                                <IonCard className="action-card" button onClick={() => history.push("/ciudadano/solicitudes")}>
                                    <IonCardHeader>
                                        <div className="icon-wrapper success-bg">
                                            <IonIcon icon={documentTextOutline} />
                                        </div>
                                        <IonCardTitle>Mis Solicitudes</IonCardTitle>
                                        <IonCardSubtitle>Revisa el estado de tus trámites</IonCardSubtitle>
                                    </IonCardHeader>
                                </IonCard>
                            </IonCol>

                            <IonCol size="12" sizeMd="4">
                                <IonCard className="action-card" button onClick={() => document.getElementById('search-input')?.focus()}>
                                    <IonCardHeader>
                                        <div className="icon-wrapper tertiary-bg">
                                            <IonIcon icon={searchOutline} />
                                        </div>
                                        <IonCardTitle>Buscar Solicitud</IonCardTitle>
                                        <IonCardSubtitle>Encuentra una solicitud por ID</IonCardSubtitle>
                                    </IonCardHeader>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    {/* LISTA DE SOLICITUDES RECIENTES */}
                    <IonCard className="list-card custom-card">
                        <IonCardHeader className="list-header">
                            <div>
                                <IonCardTitle>Solicitudes Recientes</IonCardTitle>
                                <IonCardSubtitle>Últimos trámites realizados</IonCardSubtitle>
                            </div>
                        </IonCardHeader>

                        <div className="search-container">
                            <IonSearchbar
                                id="search-input"
                                value={searchTerm}
                                onIonInput={(e) => setSearchTerm(e.detail.value!)}
                                placeholder="Buscar por ID o Negocio..."
                                animated={true}
                                className="custom-searchbar"
                            />
                        </div>

                        <IonList lines="full" className="custom-list">
                            {filteredSolicitudes.length > 0 ? (
                                filteredSolicitudes.map((solicitud) => (
                                    <IonItem
                                        key={solicitud.id}
                                        button
                                        detail={true}
                                        className="solicitud-item"
                                        onClick={() => history.push(`/ciudadano/solicitudes/${solicitud.id}`)}
                                    >
                                        <div slot="start" className="item-icon-box">
                                            <IonIcon icon={documentTextOutline} />
                                        </div>
                                        <IonLabel className="item-label">
                                            <h2><strong>{solicitud.negocio}</strong></h2>
                                            <h3>{solicitud.id} <span className="dot-separator">•</span> {solicitud.tipo}</h3>
                                            <p>Fecha de ingreso: {solicitud.fecha}</p>
                                        </IonLabel>
                                        <IonBadge color={solicitud.color} slot="end" className="status-badge">
                                            <IonIcon icon={solicitud.icon} className="badge-icon"/>
                                            {solicitud.estado}
                                        </IonBadge>
                                    </IonItem>
                                ))
                            ) : (
                                <IonItem className="empty-state">
                                    <IonLabel className="ion-text-center">
                                        <IonIcon icon={documentTextOutline} className="empty-icon" />
                                        <p>No se encontraron solicitudes con ese criterio.</p>
                                    </IonLabel>
                                </IonItem>
                            )}
                        </IonList>

                        <div className="list-footer">
                            <IonButton expand="block" fill="outline" className="btn-view-all" onClick={() => history.push("/ciudadano/solicitudes")}>
                                Ver Todas las Solicitudes
                            </IonButton>
                        </div>
                    </IonCard>

                </div>
            </IonContent>
        </IonPage>
    );
};

export default DashboardCiudadano;