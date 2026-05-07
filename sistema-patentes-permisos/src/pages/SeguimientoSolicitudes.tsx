import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage, IonContent, IonButtons, IonButton, IonIcon, IonGrid, 
    IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
    IonCardContent, IonSelect, IonSelectOption, IonBadge, IonProgressBar
} from "@ionic/react";
import {
    arrowBackOutline, documentTextOutline, timeOutline, checkmarkCircleOutline,
    alertCircleOutline, closeCircleOutline, downloadOutline, filterOutline
} from "ionicons/icons";
import Navbar from "../components/Navbar"; // IMPORTAMOS LA NAVBAR
import './SeguimientoSolicitudes.scss';

const solicitudes = [
    { id: "SOL-2026-001", negocio: "Almacén Don Juan", tipo: "Patente Comercial", fecha: "10/04/2026", estado: "Aprobada", color: "success", icon: checkmarkCircleOutline, progreso: 100, ultimaActualizacion: "15/04/2026 14:30", observaciones: 0 },
    { id: "SOL-2026-012", negocio: "Cafetería Central", tipo: "Patente Comercial", fecha: "14/04/2026", estado: "Revisión", color: "primary", icon: timeOutline, progreso: 60, ultimaActualizacion: "15/04/2026 10:15", observaciones: 0 },
    { id: "SOL-2026-008", negocio: "Taller Mecánico", tipo: "Permiso Municipal", fecha: "05/04/2026", estado: "Observada", color: "warning", icon: alertCircleOutline, progreso: 40, ultimaActualizacion: "12/04/2026 16:45", observaciones: 2 },
    { id: "SOL-2026-003", negocio: "Restaurant El Buen Sabor", tipo: "Patente de Alcoholes", fecha: "01/04/2026", estado: "Rechazada", color: "danger", icon: closeCircleOutline, progreso: 100, ultimaActualizacion: "08/04/2026 09:20", observaciones: 1 },
    { id: "SOL-2026-015", negocio: "Peluquería Stylo", tipo: "Patente Profesional", fecha: "15/04/2026", estado: "Revisión", color: "primary", icon: timeOutline, progreso: 30, ultimaActualizacion: "15/04/2026 15:00", observaciones: 0 },
];

const SeguimientoSolicitudes: React.FC = () => {
    const history = useHistory();
    const [filtroEstado, setFiltroEstado] = useState<string>("todas");

    const solicitudesFiltradas = filtroEstado === "todas"
        ? solicitudes
        : solicitudes.filter((s) => s.estado.toLowerCase() === filtroEstado);

    return (
        <IonPage>
            <Navbar tipoUsuario="ciudadano" />

            <IonContent className="seguimiento-bg">
                <div className="seguimiento-container">

                    <div className="header-actions">
                        <IonButton fill="clear" color="medium" onClick={() => history.push("/ciudadano/inicio")} className="btn-volver">
                            <IonIcon slot="start" icon={arrowBackOutline} />
                            Volver al Inicio
                        </IonButton>
                        <h2 className="page-title">Seguimiento de Solicitudes</h2>
                    </div>

                    <IonGrid className="ion-no-padding ion-margin-bottom">
                        <IonRow>
                            <IonCol size="6" sizeMd="3">
                                <IonCard className="stat-card">
                                    <IonCardContent>
                                        <p className="stat-label">Total Ingresadas</p>
                                        <div className="stat-value-row">
                                            <h2>{solicitudes.length}</h2>
                                            <IonIcon icon={documentTextOutline} color="medium" />
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                            <IonCol size="6" sizeMd="3">
                                <IonCard className="stat-card">
                                    <IonCardContent>
                                        <p className="stat-label">En Revisión</p>
                                        <div className="stat-value-row">
                                            <h2 className="text-primary">{solicitudes.filter(s => s.estado === "Revisión").length}</h2>
                                            <IonIcon icon={timeOutline} color="primary" />
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                            <IonCol size="6" sizeMd="3">
                                <IonCard className="stat-card">
                                    <IonCardContent>
                                        <p className="stat-label">Aprobadas</p>
                                        <div className="stat-value-row">
                                            <h2 className="text-success">{solicitudes.filter(s => s.estado === "Aprobada").length}</h2>
                                            <IonIcon icon={checkmarkCircleOutline} color="success" />
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                            <IonCol size="6" sizeMd="3">
                                <IonCard className="stat-card">
                                    <IonCardContent>
                                        <p className="stat-label">Observadas</p>
                                        <div className="stat-value-row">
                                            <h2 className="text-warning">{solicitudes.filter(s => s.estado === "Observada").length}</h2>
                                            <IonIcon icon={alertCircleOutline} color="warning" />
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    <IonCard className="list-container-card">
                        <IonCardHeader className="list-header-flex">
                            <div>
                                <IonCardTitle>Historial de Trámites</IonCardTitle>
                                <IonCardSubtitle>Revisa el progreso de tus patentes y permisos</IonCardSubtitle>
                            </div>

                            <div className="filter-wrapper">
                                <IonIcon icon={filterOutline} className="filter-icon" />
                                <IonSelect
                                    interface="popover"
                                    value={filtroEstado}
                                    onIonChange={e => setFiltroEstado(e.detail.value)}
                                    className="status-filter"
                                >
                                    <IonSelectOption value="todas">Todas</IonSelectOption>
                                    <IonSelectOption value="revisión">En Revisión</IonSelectOption>
                                    <IonSelectOption value="aprobada">Aprobadas</IonSelectOption>
                                    <IonSelectOption value="observada">Observadas</IonSelectOption>
                                    <IonSelectOption value="rechazada">Rechazadas</IonSelectOption>
                                </IonSelect>
                            </div>
                        </IonCardHeader>

                        <IonCardContent className="requests-list">
                            {solicitudesFiltradas.length > 0 ? (
                                solicitudesFiltradas.map((solicitud) => (
                                    <div key={solicitud.id} className="request-card-item">
                                        
                                        <div className="req-info">
                                            <div className="req-icon-box">
                                                <IonIcon icon={documentTextOutline} />
                                            </div>
                                            <div className="req-text">
                                                <h4>{solicitud.negocio}</h4>
                                                <p>{solicitud.id} • {solicitud.tipo}</p>
                                                <small>Enviada: {solicitud.fecha}</small>
                                            </div>
                                        </div>

                                        <div className="req-progress">
                                            <div className="progress-labels">
                                                <span>Progreso de evaluación</span>
                                                <strong>{solicitud.progreso}%</strong>
                                            </div>
                                            <IonProgressBar value={solicitud.progreso / 100} color={solicitud.color}></IonProgressBar>
                                            <small>Actualizado: {solicitud.ultimaActualizacion}</small>
                                        </div>

                                        <div className="req-actions">
                                            <div className="badge-group">
                                                <IonBadge color={solicitud.color} className="status-badge">
                                                    <IonIcon icon={solicitud.icon} />
                                                    {solicitud.estado}
                                                </IonBadge>
                                                {solicitud.observaciones > 0 && (
                                                    <IonBadge color="warning" className="obs-badge outline-badge">
                                                        {solicitud.observaciones} Observación(es)
                                                    </IonBadge>
                                                )}
                                            </div>

                                            <div className="btn-group">
                                                <IonButton 
                                                    fill="outline" 
                                                    size="small" 
                                                    color="primary"
                                                    className="btn-detalle"
                                                    onClick={() => history.push(`/ciudadano/solicitudes/${solicitud.id}`)}
                                                >
                                                    Ver Detalle
                                                </IonButton>
                                                {solicitud.estado === "Aprobada" && (
                                                    <IonButton color="success" size="small" className="btn-descargar">
                                                        <IonIcon icon={downloadOutline} slot="start" />
                                                        Certificado
                                                    </IonButton>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <IonIcon icon={alertCircleOutline} />
                                    <p>No se encontraron solicitudes con este filtro</p>
                                </div>
                            )}
                        </IonCardContent>
                    </IonCard>

                </div>
            </IonContent>
        </IonPage>
    );
};

export default SeguimientoSolicitudes;