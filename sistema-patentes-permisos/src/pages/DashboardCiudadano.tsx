import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage, IonContent, IonGrid, IonRow, IonCol, IonCard,
    IonCardHeader, IonCardTitle, IonCardSubtitle, IonSearchbar,
    IonList, IonItem, IonLabel, IonBadge, IonText, IonIcon, IonButton, IonSpinner
} from "@ionic/react";
import {
    addCircleOutline, documentTextOutline, searchOutline,
    checkmarkCircleOutline, timeOutline, alertCircleOutline
} from "ionicons/icons";
import Navbar from "../components/Navbar";
import './DashboardCiudadano.scss';

import { SolicitudRaw, SolicitudFormateada} from '../types';

// Genera ID visual tipo SOL-2026-001
const formatearIdVisual = (idNumerico: number, fechaCreacion: string) => {
    const año = new Date(fechaCreacion).getFullYear();
    return `SOL-${año}-${String(idNumerico).padStart(3, '0')}`;
};

const DashboardCiudadano: React.FC = () => {
    const history = useHistory();
    const [searchTerm, setSearchTerm] = useState("");
    const [solicitudes, setSolicitudes] = useState<SolicitudFormateada[]>([]);
    const [loading, setLoading] = useState(true);
    const [nombreUsuario, setNombreUsuario] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('usuario');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    setNombreUsuario(user.nombre || "Usuario");
                }

                const respuesta = await fetch('http://localhost:3000/api/ciudadano/mis_solicitudes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    const solicitudesFormateadas: SolicitudFormateada[] = datos.map((sol: SolicitudRaw) => {
                        let color = "primary";
                        let icon = timeOutline;
                        const estadoTexto = sol.estado || "pendiente";

                        if (estadoTexto === 'aprobada') { color = 'success'; icon = checkmarkCircleOutline; }
                        else if (estadoTexto === 'observada') { color = 'warning'; icon = alertCircleOutline; }
                        else if (estadoTexto === 'rechazada') { color = 'danger'; icon = alertCircleOutline; }
                        else if (estadoTexto === 'revisión') { color = 'primary'; icon = timeOutline; }

                        return {
                            idReal: sol.id,
                            idVisual: formatearIdVisual(sol.id, sol.fecha_creacion),
                            negocio: sol.razon_social,
                            tipo: sol.tipo_patente,
                            fecha: new Date(sol.fecha_creacion).toLocaleDateString('es-CL'),
                            estado: estadoTexto.charAt(0).toUpperCase() + estadoTexto.slice(1),
                            color,
                            icon
                        };
                    });
                    setSolicitudes(solicitudesFormateadas);
                } else {
                    console.error("Error al obtener solicitudes");
                }
            } catch (error) {
                console.error("Error de red:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    const filteredSolicitudes = solicitudes.filter(
        (sol) =>
            sol.idVisual.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sol.negocio.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <IonPage>
            <Navbar tipoUsuario="ciudadano" />
            <IonContent fullscreen className="dashboard-bg">
                <div className="dashboard-container">
                    <div className="welcome-section">
                        <IonText color="dark">
                            <h2 className="welcome-title">Bienvenido, {nombreUsuario}</h2>
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
                                        <div className="icon-wrapper primary-bg"><IonIcon icon={addCircleOutline} /></div>
                                        <IonCardTitle>Nueva Solicitud</IonCardTitle>
                                        <IonCardSubtitle>Solicita una nueva patente</IonCardSubtitle>
                                    </IonCardHeader>
                                </IonCard>
                            </IonCol>
                            <IonCol size="12" sizeMd="4">
                                <IonCard className="action-card" button onClick={() => history.push("/ciudadano/solicitudes")}>
                                    <IonCardHeader>
                                        <div className="icon-wrapper success-bg"><IonIcon icon={documentTextOutline} /></div>
                                        <IonCardTitle>Mis Solicitudes</IonCardTitle>
                                        <IonCardSubtitle>Revisa el estado de tus trámites</IonCardSubtitle>
                                    </IonCardHeader>
                                </IonCard>
                            </IonCol>
                            <IonCol size="12" sizeMd="4">
                                <IonCard className="action-card" button onClick={() => document.getElementById('search-input')?.focus()}>
                                    <IonCardHeader>
                                        <div className="icon-wrapper tertiary-bg"><IonIcon icon={searchOutline} /></div>
                                        <IonCardTitle>Buscar Solicitud</IonCardTitle>
                                        <IonCardSubtitle>Encuentra una solicitud por ID</IonCardSubtitle>
                                    </IonCardHeader>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

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
                                animated
                                className="custom-searchbar"
                            />
                        </div>
                        {loading ? (
                            <div className="ion-text-center ion-padding"><IonSpinner /></div>
                        ) : (
                            <IonList lines="full" className="custom-list">
                                {filteredSolicitudes.length > 0 ? (
                                    filteredSolicitudes.map((solicitud) => (
                                        <IonItem
                                            key={solicitud.idReal}
                                            button
                                            detail
                                            className="solicitud-item"
                                            onClick={() => history.push(`/ciudadano/solicitudes/${solicitud.idReal}`)}
                                        >
                                            <div slot="start" className="item-icon-box"><IonIcon icon={documentTextOutline} /></div>
                                            <IonLabel className="item-label">
                                                <h2><strong>{solicitud.negocio}</strong></h2>
                                                <h3>{solicitud.idVisual} <span className="dot-separator">•</span> {solicitud.tipo}</h3>
                                                <p>Fecha de ingreso: {solicitud.fecha}</p>
                                            </IonLabel>
                                            <IonBadge color={solicitud.color} slot="end" className="status-badge">
                                                <IonIcon icon={solicitud.icon} className="badge-icon" /> {solicitud.estado}
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
                        )}
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