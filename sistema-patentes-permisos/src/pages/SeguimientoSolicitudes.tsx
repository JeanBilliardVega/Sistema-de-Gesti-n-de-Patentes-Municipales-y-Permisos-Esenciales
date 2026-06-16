import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage, IonContent, IonButton, IonIcon, IonGrid,
    IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonSelect, IonSelectOption, IonBadge, IonSpinner,
    IonInfiniteScroll, IonInfiniteScrollContent
} from "@ionic/react";
import {
    arrowBackOutline, documentTextOutline, timeOutline, checkmarkCircleOutline,
    alertCircleOutline, closeCircleOutline
} from "ionicons/icons";
import Navbar from "../components/Navbar";
import './SeguimientoSolicitudes.scss';

const SeguimientoSolicitudes: React.FC = () => {
    const history = useHistory();
    const [filtroEstado, setFiltroEstado] = useState<string>("todas");
    const [solicitudes, setSolicitudes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const obtenerMisSolicitudes = async (pagina: number = 1, append: boolean = false) => {
        try {
            if (pagina === 1) setLoading(true);
            const token = localStorage.getItem('token');
            const respuesta = await fetch(
                `http://localhost:3000/api/ciudadano/mis_solicitudes?page=${pagina}&limit=10`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (respuesta.ok) {
                const data = await respuesta.json(); // Espera { data: [], total, totalPages }
                const solicitudesFormateadas = data.data.map((sol: any) => {
                    let color = "primary";
                    let icon = timeOutline;
                    let estadoTexto = sol.estado || "pendiente";

                    if (estadoTexto === 'aprobada') { color = 'success'; icon = checkmarkCircleOutline; }
                    else if (estadoTexto === 'observada') { color = 'warning'; icon = alertCircleOutline; }
                    else if (estadoTexto === 'rechazada') { color = 'danger'; icon = closeCircleOutline; }

                    return {
                        ...sol,
                        idReal: sol.id,
                        negocio: sol.razon_social,
                        tipo: sol.tipo_patente,
                        fecha: new Date(sol.fecha_creacion).toLocaleDateString('es-CL'),
                        estado: estadoTexto,
                        color,
                        icon
                    };
                });

                if (append) {
                    setSolicitudes(prev => [...prev, ...solicitudesFormateadas]);
                } else {
                    setSolicitudes(solicitudesFormateadas);
                }
                setTotalPages(data.totalPages);
                setPage(data.page);
            }
        } catch (error) {
            console.error("Error al cargar las solicitudes:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        obtenerMisSolicitudes(1, false);
    }, []);

    const loadMore = (event: CustomEvent) => {
        if (page < totalPages && !loadingMore) {
            setLoadingMore(true);
            obtenerMisSolicitudes(page + 1, true).finally(() => event.detail.complete());
        } else {
            event.detail.complete();
        }
    };

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

                    {loading && solicitudes.length === 0 ? (
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
                                        <IonSelectOption value="pendiente">Pendiente</IonSelectOption>
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
                                        <div key={solicitud.idReal} className="request-card-item">
                                            <div className="req-info">
                                                <div className="req-icon-box"><IonIcon icon={documentTextOutline} /></div>
                                                <div className="req-text">
                                                    <h4>{solicitud.negocio}</h4>
                                                    <p>ID: {solicitud.idReal} • {solicitud.tipo}</p>
                                                </div>
                                            </div>
                                            <div className="req-actions">
                                                <IonBadge color={solicitud.color}>{solicitud.estado}</IonBadge>
                                                <IonButton fill="outline" size="small" onClick={() => history.push(`/ciudadano/solicitudes/${solicitud.idReal}`)}>
                                                    Ver Detalle
                                                </IonButton>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="ion-text-center">No hay solicitudes encontradas.</p>
                                )}

                                <IonInfiniteScroll threshold="100px" onIonInfinite={loadMore}>
                                    <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Cargando más..." />
                                </IonInfiniteScroll>
                            </IonCardContent>
                        </IonCard>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SeguimientoSolicitudes;