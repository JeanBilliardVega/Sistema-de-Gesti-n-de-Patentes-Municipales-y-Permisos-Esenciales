import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonSelect, IonSelectOption, IonBadge,
    IonProgressBar
} from "@ionic/react";
import {
    arrowBackOutline, documentTextOutline, timeOutline, checkmarkCircleOutline,
    alertCircleOutline, closeCircleOutline, downloadOutline, filterOutline
} from "ionicons/icons";
import './SeguimientoSolicitudes.scss';

// Datos simulados (Mock data)
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
            {/* Barra de navegación superior: Utiliza el tono azul principal según el diseño de Figma */}
            <IonHeader className="ion-no-border">
                <IonToolbar color="primary" className="seguimiento-toolbar">
                    <IonButtons slot="start">
                        <IonButton onClick={() => history.push("/dashCiudadano")}>
                            <IonIcon icon={arrowBackOutline} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Mis Solicitudes</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding seguimiento-bg">

                {/* Tarjetas de resumen estadístico */}
                <IonGrid className="ion-no-padding ion-margin-bottom">
                    <IonRow>
                        <IonCol size="6" sizeMd="3">
                            <IonCard className="stat-card">
                                <IonCardContent>
                                    <p className="stat-label">Total</p>
                                    <div className="stat-value-row">
                                        <h2>{solicitudes.length}</h2>
                                        <IonIcon icon={documentTextOutline} className="icon-gray" />
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size="6" sizeMd="3">
                            <IonCard className="stat-card">
                                <IonCardContent>
                                    <p className="stat-label">En Revisión</p>
                                    <div className="stat-value-row">
                                        <h2 className="text-blue">{solicitudes.filter(s => s.estado === "Revisión").length}</h2>
                                        <IonIcon icon={timeOutline} className="icon-blue" />
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size="6" sizeMd="3">
                            <IonCard className="stat-card">
                                <IonCardContent>
                                    <p className="stat-label">Aprobadas</p>
                                    <div className="stat-value-row">
                                        <h2 className="text-green">{solicitudes.filter(s => s.estado === "Aprobada").length}</h2>
                                        <IonIcon icon={checkmarkCircleOutline} className="icon-green" />
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size="6" sizeMd="3">
                            <IonCard className="stat-card">
                                <IonCardContent>
                                    <p className="stat-label">Observadas</p>
                                    <div className="stat-value-row">
                                        <h2 className="text-orange">{solicitudes.filter(s => s.estado === "Observada").length}</h2>
                                        <IonIcon icon={alertCircleOutline} className="icon-orange" />
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                {/* Cuerpo principal de la lista de solicitudes */}
                <IonCard className="list-container-card">
                    <IonCardHeader className="list-header-flex">
                        <div>
                            <IonCardTitle>Todas las Solicitudes</IonCardTitle>
                            <IonCardSubtitle>Historial completo de tus trámites municipales</IonCardSubtitle>
                        </div>

                        {/* Filtro de estado */}
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

                                    {/* Izquierda: Información básica */}
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

                                    {/* Centro: Barra de progreso */}
                                    <div className="req-progress">
                                        <div className="progress-labels">
                                            <span>Progreso</span>
                                            <strong>{solicitud.progreso}%</strong>
                                        </div>
                                        {/* El rango de valores de la barra de progreso en Ionic es de 0 a 1 */}
                                        <IonProgressBar value={solicitud.progreso / 100} color={solicitud.color}></IonProgressBar>
                                        <small>Actualizado: {solicitud.ultimaActualizacion}</small>
                                    </div>

                                    {/* Derecha: Etiquetas de estado y botones de acción */}
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
                                            <IonButton fill="outline" size="small" className="btn-detalle">
                                                Ver Detalle
                                            </IonButton>
                                            {solicitud.estado === "Aprobada" && (
                                                <IonButton color="success" size="small" className="btn-descargar">
                                                    <IonIcon icon={downloadOutline} slot="start" />
                                                    Descargar
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

            </IonContent>
        </IonPage>
    );
};

export default SeguimientoSolicitudes;