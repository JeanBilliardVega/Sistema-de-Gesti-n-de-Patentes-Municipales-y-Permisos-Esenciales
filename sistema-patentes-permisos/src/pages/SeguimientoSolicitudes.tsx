import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage, IonContent, IonButton, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonSelect, IonSelectOption, IonBadge, IonSpinner
} from "@ionic/react";
import {
    arrowBackOutline, documentTextOutline, timeOutline, checkmarkCircleOutline,
    alertCircleOutline, closeCircleOutline
} from "ionicons/icons";
import Navbar from "../components/Navbar";
import './SeguimientoSolicitudes.scss';

import { SolicitudRaw, SolicitudSeguimiento } from '../types';

const SeguimientoSolicitudes: React.FC = () => {
    const history = useHistory();
    const [filtroEstado, setFiltroEstado] = useState<string>("todas");
    const [solicitudes, setSolicitudes] = useState<SolicitudSeguimiento[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerMisSolicitudes = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                // Petición al backend con el token de autenticación
                const respuesta = await fetch('http://localhost:3000/api/ciudadano/mis_solicitudes', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (respuesta.ok) {
                    const datosBD = await respuesta.json();

                    // Mapeo de los datos reales de la BD al formato del componente
                    const solicitudesFormateadas: SolicitudSeguimiento[] = datosBD.map((sol: SolicitudRaw) => {
                        let color = "primary";
                        let icon = timeOutline;
                        let progreso = 30; // Valor base
                        const estadoTexto = sol.estado || "Revisión";

                        // Lógica de colores y estados basada en el campo 'estado' de la BD
                        if (estadoTexto === 'Aprobada') { color = 'success'; icon = checkmarkCircleOutline; progreso = 100; }
                        else if (estadoTexto === 'Observada') { color = 'warning'; icon = alertCircleOutline; progreso = 40; }
                        else if (estadoTexto === 'Rechazada') { color = 'danger'; icon = closeCircleOutline; progreso = 100; }

                        return {
                            id: sol.id, // ID numérico puro de Postgres
                            negocio: sol.razon_social,
                            tipo: sol.tipo_patente,
                            fecha: new Date(sol.fecha_creacion).toLocaleDateString('es-CL'),
                            estado: estadoTexto,
                            color: color,
                            icon: icon,
                            progreso: progreso,
                            ultimaActualizacion: new Date(sol.fecha_actualizacion || sol.fecha_creacion).toLocaleString('es-CL'),
                        };
                    });

                    setSolicitudes(solicitudesFormateadas);
                }
            } catch (error) {
                console.error("Error al cargar las solicitudes:", error);
            } finally {
                setLoading(false);
            }
        };

        obtenerMisSolicitudes();
    }, []);

    const solicitudesFiltradas = filtroEstado === "todas"
        ? solicitudes
        : solicitudes.filter((s) => s.estado.toLowerCase() === filtroEstado.toLowerCase());

    return (
        <IonPage>
            <Navbar tipoUsuario="ciudadano" />
            <IonContent className="seguimiento-bg">
                <div className="seguimiento-container">
                    <div className="header-actions">
                        <IonButton fill="clear" color="medium" onClick={() => history.push("/ciudadano/inicio")} className="btn-volver">
                            <IonIcon slot="start" icon={arrowBackOutline} /> Volver
                        </IonButton>
                        <h2 className="page-title">Seguimiento de Solicitudes</h2>
                    </div>

                    {loading ? (
                        <div className="ion-text-center"><IonSpinner /></div>
                    ) : (
                        <IonCard className="list-container-card">
                            <IonCardHeader className="list-header-flex">
                                <div>
                                    <IonCardTitle>Historial de Trámites</IonCardTitle>
                                    <IonCardSubtitle>Tus solicitudes reales desde la base de datos</IonCardSubtitle>
                                </div>
                                <div className="filter-wrapper">
                                    <IonSelect interface="popover" value={filtroEstado} onIonChange={e => setFiltroEstado(e.detail.value)}>
                                        <IonSelectOption value="todas">Todas</IonSelectOption>
                                        <IonSelectOption value="revisión">En Revisión</IonSelectOption>
                                        <IonSelectOption value="aprobada">Aprobadas</IonSelectOption>
                                        <IonSelectOption value="observada">Observadas</IonSelectOption>
                                    </IonSelect>
                                </div>
                            </IonCardHeader>

                            <IonCardContent className="requests-list">
                                {solicitudesFiltradas.length > 0 ? (
                                    solicitudesFiltradas.map((solicitud) => (
                                        <div key={solicitud.id} className="request-card-item">
                                            <div className="req-info">
                                                <div className="req-icon-box"><IonIcon icon={documentTextOutline} /></div>
                                                <div className="req-text">
                                                    <h4>{solicitud.negocio}</h4>
                                                    <p>ID: {solicitud.id} • {solicitud.tipo}</p>
                                                </div>
                                            </div>
                                            <div className="req-actions">
                                                <IonBadge color={solicitud.color}>{solicitud.estado}</IonBadge>
                                                <IonButton fill="outline" size="small" onClick={() => history.push(`/ciudadano/solicitudes/${solicitud.id}`)}>
                                                    Ver Detalle
                                                </IonButton>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="ion-text-center">No hay solicitudes encontradas.</p>
                                )}
                            </IonCardContent>
                        </IonCard>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SeguimientoSolicitudes;