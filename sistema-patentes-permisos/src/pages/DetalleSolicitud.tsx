import React, { useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import {
    IonPage, IonContent, IonButton, IonIcon, IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge,
    IonTextarea, IonSelect, IonSelectOption, useIonToast, IonLabel,
    IonItem, IonList, IonSpinner
} from "@ionic/react";
import {
    arrowBackOutline, businessOutline, documentTextOutline, locationOutline,
    calendarOutline, personOutline, callOutline, chatbubbleEllipsesOutline,
    sendOutline, downloadOutline, checkmarkCircleOutline, closeCircleOutline,
    alertCircleOutline
} from "ionicons/icons";
import Navbar from "../components/Navbar";
import './DetalleSolicitud.scss';

interface LocationState {
    solicitud?: any;
}

const formatearIdVisual = (idNumerico: number, fechaCreacion: string) => {
    const año = new Date(fechaCreacion).getFullYear();
    return `SOL-${año}-${String(idNumerico).padStart(3, '0')}`;
};

const DetalleSolicitud: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const location = useLocation<LocationState>();
    const [presentToast] = useIonToast();
    const [loading, setLoading] = useState(true);
    const [solicitud, setSolicitud] = useState<any>(null);

    // ✅ OBTENER ROL DESDE EL OBJETO USER (más seguro)
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const esAdmin = userData.rol === 'admin';

    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [nuevoEstado, setNuevoEstado] = useState("");

    useEffect(() => {
        const cargarDetalle = async () => {
            if (location.state?.solicitud) {
                setSolicitud(location.state.solicitud);
                setNuevoEstado(location.state.solicitud.estado || 'pendiente');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const respuesta = await fetch('http://localhost:3000/api/ciudadano/mis_solicitudes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (respuesta.ok) {
                    const todas = await respuesta.json();
                    const encontrada = todas.find((s: any) => s.id === parseInt(id));
                    if (encontrada) {
                        setSolicitud(encontrada);
                        setNuevoEstado(encontrada.estado || 'pendiente');
                    } else {
                        presentToast({ message: 'Solicitud no encontrada', duration: 2000, color: 'danger' });
                        history.goBack();
                    }
                } else {
                    presentToast({ message: 'Error al cargar la solicitud', duration: 2000, color: 'danger' });
                    history.goBack();
                }
            } catch (error) {
                console.error(error);
                presentToast({ message: 'Error de conexión', duration: 2000, color: 'danger' });
                history.goBack();
            } finally {
                setLoading(false);
            }
        };
        cargarDetalle();
    }, [id, history, presentToast, location.state]);

    const handleEnviarMensaje = () => {
        presentToast({ message: 'Funcionalidad en desarrollo (requiere backend)', duration: 2000, color: 'warning' });
    };

    const handleCambiarEstado = () => {
        presentToast({ message: 'Funcionalidad en desarrollo (requiere backend)', duration: 2000, color: 'warning' });
    };

    if (loading || !solicitud) {
        return (
            <IonPage>
                <Navbar tipoUsuario={esAdmin ? 'funcionario' : 'ciudadano'} />
                <IonContent className="ion-text-center ion-padding">
                    <IonSpinner name="crescent" />
                    <p>Cargando solicitud...</p>
                </IonContent>
            </IonPage>
        );
    }

    const idVisual = formatearIdVisual(solicitud.id, solicitud.fecha_creacion);
    const estadoTexto = solicitud.estado || 'pendiente';
    const estadoCapitalizado = estadoTexto.charAt(0).toUpperCase() + estadoTexto.slice(1);
    const badgeColor =
        estadoTexto === 'aprobada' ? 'success' :
            estadoTexto === 'rechazada' ? 'danger' :
                estadoTexto === 'observada' ? 'warning' : 'primary';

    const ciudadanoNombre = solicitud.ciudadano_nombre || userData.nombre || 'No disponible';
    const ciudadanoRut = solicitud.ciudadano_rut || userData.rut || 'No disponible';
    const ciudadanoEmail = solicitud.ciudadano_email || userData.email || 'No disponible';
    const ciudadanoTelefono = solicitud.telefono || userData.telefono || 'No disponible';
    const documentos = solicitud.documentos || [];

    return (
        <IonPage>
            <Navbar tipoUsuario={esAdmin ? 'funcionario' : 'ciudadano'} />
            <IonContent className="detalle-bg">
                <div className="detalle-wrapper">
                    <div className="header-actions">
                        <IonButton fill="clear" color="medium" onClick={() => history.goBack()} className="btn-volver">
                            <IonIcon slot="start" icon={arrowBackOutline} />
                            Volver
                        </IonButton>
                        <h2 className="page-title">Detalle de Solicitud {idVisual}</h2>
                    </div>

                    <IonGrid className="ion-no-padding custom-grid">
                        <IonRow>
                            <IonCol size="12" sizeLg="8" className="col-main">
                                {/* Información principal */}
                                <IonCard className="detalle-card main-info-card">
                                    <IonCardHeader className="card-header-flex">
                                        <div>
                                            <IonCardTitle>{solicitud.razon_social}</IonCardTitle>
                                            <p className="subtitle">{solicitud.tipo_patente}</p>
                                        </div>
                                        <IonBadge color={badgeColor}>{estadoCapitalizado}</IonBadge>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonGrid className="ion-no-padding inner-grid">
                                            <IonRow>
                                                <IonCol size="12" sizeMd="6" className="info-item">
                                                    <IonIcon icon={documentTextOutline} className="info-icon" />
                                                    <div><span className="info-label">Giro Comercial</span><span className="info-value">{solicitud.giro}</span></div>
                                                </IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item">
                                                    <IonIcon icon={calendarOutline} className="info-icon" />
                                                    <div><span className="info-label">Fecha de Solicitud</span><span className="info-value">{new Date(solicitud.fecha_creacion).toLocaleDateString('es-CL')}</span></div>
                                                </IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item">
                                                    <IonIcon icon={locationOutline} className="info-icon" />
                                                    <div><span className="info-label">Ubicación</span><span className="info-value">{solicitud.direccion}</span><span className="info-sub-value">{solicitud.comuna || 'Comuna no especificada'}</span></div>
                                                </IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item">
                                                    <IonIcon icon={businessOutline} className="info-icon" />
                                                    <div><span className="info-label">Superficie</span><span className="info-value">{solicitud.superficie ? `${solicitud.superficie} m²` : 'No indicada'}</span></div>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonCardContent>
                                </IonCard>

                                {/* Datos del solicitante */}
                                <IonCard className="detalle-card">
                                    <IonCardHeader><IonCardTitle className="title-with-icon"><div className="icon-box"><IonIcon icon={personOutline} /></div> Datos del Solicitante</IonCardTitle></IonCardHeader>
                                    <IonCardContent>
                                        <IonGrid className="ion-no-padding inner-grid">
                                            <IonRow>
                                                <IonCol size="12" sizeMd="6" className="info-item-simple"><span className="info-label">Nombre Completo</span><span className="info-value">{ciudadanoNombre}</span></IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item-simple"><span className="info-label">RUT</span><span className="info-value">{ciudadanoRut}</span></IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item-simple"><span className="info-label">Email</span><span className="info-value">{ciudadanoEmail}</span></IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item-simple"><span className="info-label">Teléfono</span><span className="info-value flex-align"><IonIcon icon={callOutline} className="mini-icon" /> {ciudadanoTelefono}</span></IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonCardContent>
                                </IonCard>

                                {/* Documentos */}
                                <IonCard className="detalle-card">
                                    <IonCardHeader><IonCardTitle className="title-with-icon"><div className="icon-box"><IonIcon icon={documentTextOutline} /></div> Documentos Adjuntos</IonCardTitle></IonCardHeader>
                                    <IonCardContent>
                                        {documentos.length > 0 ? (
                                            <IonList className="doc-list">
                                                {documentos.map((doc: any, idx: number) => (
                                                    <IonItem key={idx} className="doc-item" lines="none">
                                                        <div slot="start" className="doc-icon-wrapper"><IonIcon icon={documentTextOutline} className="doc-icon" /></div>
                                                        <IonLabel><h2>{doc.nombre}</h2><p>{doc.tipo?.split('/')[1]?.toUpperCase() || 'DOC'}</p></IonLabel>
                                                        {doc.ruta && <IonButton fill="clear" slot="end" className="btn-download" onClick={() => window.open(`http://localhost:3000/${doc.ruta}`, '_blank')}><IonIcon icon={downloadOutline} slot="icon-only" /></IonButton>}
                                                    </IonItem>
                                                ))}
                                            </IonList>
                                        ) : <p className="ion-text-center">No hay documentos adjuntos</p>}
                                    </IonCardContent>
                                </IonCard>

                                {/* Mensajes (deshabilitado) */}
                                <IonCard className="detalle-card">
                                    <IonCardHeader><IonCardTitle className="title-with-icon"><div className="icon-box"><IonIcon icon={chatbubbleEllipsesOutline} /></div> Observaciones y Comunicación</IonCardTitle><p className="subtitle">Próximamente disponible</p></IonCardHeader>
                                    <IonCardContent>
                                        <div className="messages-container"><p className="ion-text-center ion-padding">Esta funcionalidad estará disponible en una próxima versión.</p></div>
                                        <div className="divider"></div>
                                        <div className="new-message-box">
                                            <p className="reply-label">{esAdmin ? "Enviar observación al ciudadano:" : "Responder al administrador:"}</p>
                                            <IonTextarea placeholder="Funcionalidad en desarrollo..." fill="outline" rows={4} value={nuevoMensaje} disabled={true} className="chat-textarea" />
                                            <div className="chat-action"><IonButton onClick={handleEnviarMensaje} className="btn-send" color="primary" disabled={true}><IonIcon icon={sendOutline} slot="start" /> Enviar Mensaje</IonButton></div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            {/* Sidebar */}
                            <IonCol size="12" sizeLg="4" className="col-sidebar">
                                {/* ⚠️ IMPORTANTE: Solo se renderiza si esAdmin === true */}
                                {esAdmin && (
                                    <IonCard className="detalle-card admin-actions-card">
                                        <IonCardHeader><IonCardTitle>Acciones de Administrador</IonCardTitle></IonCardHeader>
                                        <IonCardContent>
                                            <div className="action-group"><label>Cambiar Estado de Solicitud</label><IonSelect fill="outline" value={nuevoEstado} onIonChange={e => setNuevoEstado(e.detail.value)} disabled={true}><IonSelectOption value="pendiente">Pendiente</IonSelectOption><IonSelectOption value="revisión">En Revisión</IonSelectOption><IonSelectOption value="observada">Observada</IonSelectOption><IonSelectOption value="aprobada">Aprobada</IonSelectOption><IonSelectOption value="rechazada">Rechazada</IonSelectOption></IonSelect></div>
                                            <IonButton expand="block" className="btn-actualizar" onClick={handleCambiarEstado} color="tertiary" disabled={true}>Actualizar Estado</IonButton>
                                            <div className="divider"></div>
                                            <IonButton expand="block" fill="outline" color="success" className="btn-approve" disabled={true}><IonIcon icon={checkmarkCircleOutline} slot="start" /> Aprobar Solicitud</IonButton>
                                            <IonButton expand="block" fill="outline" color="danger" className="btn-reject mt-2" disabled={true}><IonIcon icon={closeCircleOutline} slot="start" /> Rechazar Solicitud</IonButton>
                                            <p className="ion-text-center ion-margin-top" style={{ fontSize: '0.8rem', color: 'var(--ion-color-medium)' }}>⚙️ Solo visible para administradores</p>
                                        </IonCardContent>
                                    </IonCard>
                                )}

                                <IonCard className="detalle-card">
                                    <IonCardHeader><IonCardTitle>Estado del Trámite</IonCardTitle></IonCardHeader>
                                    <IonCardContent>
                                        <div className="timeline">
                                            <div className="timeline-item"><div className={`timeline-icon ${estadoTexto !== 'pendiente' ? 'bg-green' : 'bg-gray'}`}><IonIcon icon={checkmarkCircleOutline} /></div><div className="timeline-content"><h4>Solicitud Recibida</h4><p>{new Date(solicitud.fecha_creacion).toLocaleString('es-CL')}</p></div></div>
                                            <div className="timeline-item"><div className={`timeline-icon ${['revisión', 'observada', 'aprobada', 'rechazada'].includes(estadoTexto) ? 'bg-blue' : 'bg-gray'}`}><IonIcon icon={alertCircleOutline} /></div><div className="timeline-content"><h4>En Revisión</h4><p>{solicitud.fecha_actualizacion ? new Date(solicitud.fecha_actualizacion).toLocaleString('es-CL') : '--'}</p></div></div>
                                            <div className="timeline-item"><div className={`timeline-icon ${estadoTexto === 'aprobada' ? 'bg-green' : 'bg-gray'}`}><IonIcon icon={checkmarkCircleOutline} /></div><div className="timeline-content"><h4>Resultado Final</h4><p>{estadoCapitalizado}</p></div></div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>

                                <IonCard className="detalle-card">
                                    <IonCardHeader><IonCardTitle>Resumen</IonCardTitle></IonCardHeader>
                                    <IonCardContent>
                                        <div className="quick-info-list"><div className="qi-row"><span>ID Interno:</span> <strong>{solicitud.id}</strong></div><div className="qi-row"><span>Tipo:</span> <strong>{solicitud.tipo_patente}</strong></div><div className="qi-row"><span>Documentos:</span> <strong>{documentos.length}</strong></div><div className="qi-row"><span>Estado:</span> <strong>{estadoCapitalizado}</strong></div></div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default DetalleSolicitud;