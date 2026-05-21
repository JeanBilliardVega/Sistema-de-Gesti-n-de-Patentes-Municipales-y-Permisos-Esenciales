import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
    IonPage, IonContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, 
    IonTextarea, IonSelect, IonSelectOption, useIonToast, IonLabel, 
    IonItem, IonList
} from "@ionic/react";
import {
    arrowBackOutline, businessOutline, documentTextOutline, locationOutline,
    calendarOutline, personOutline, callOutline, chatbubbleEllipsesOutline,
    sendOutline, downloadOutline, checkmarkCircleOutline, closeCircleOutline,
    alertCircleOutline
} from "ionicons/icons";
import Navbar from "../components/Navbar";
import './DetalleSolicitud.scss';

const solicitudData = {
    id: "SOL-2026-012",
    negocio: "Cafetería Central",
    ciudadano: { nombre: "Juan Pérez", rut: "12.345.678-9", email: "juan.perez@email.cl", telefono: "+56 9 1234 5678" },
    tipo: "Patente Comercial", giro: "Cafetería y Pastelería",
    direccion: "Av. Principal #456, Santiago", comuna: "Santiago Centro",
    superficie: "80 m²", fecha: "14/04/2026", estado: "Revisión",
    documentos: [
        { nombre: "Cédula de identidad.pdf", tamano: "1.2 MB" },
        { nombre: "Croquis ubicación.pdf", tamano: "850 KB" },
        { nombre: "Contrato arriendo.pdf", tamano: "2.1 MB" },
    ],
    observaciones: [
        {
            id: 1, fecha: "15/04/2026 10:30", autor: "Admin - María González", tipo: "admin",
            mensaje: "Se requiere actualizar el croquis de ubicación. El documento adjunto no muestra claramente la entrada principal del local.",
        },
    ],
};

const DetalleSolicitud: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const [presentToast] = useIonToast();

    const esAdmin = localStorage.getItem('rol') === 'admin';

    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [nuevoEstado, setNuevoEstado] = useState(solicitudData.estado);

    const handleEnviarMensaje = () => {
        if (!nuevoMensaje.trim()) {
            presentToast({ message: "Escribe un mensaje antes de enviar", duration: 2000, color: 'warning' });
            return;
        }
        presentToast({ message: "Mensaje enviado correctamente", duration: 2000, color: 'success' });
        setNuevoMensaje("");
    };

    const handleCambiarEstado = () => {
        presentToast({ message: `Estado actualizado a: ${nuevoEstado}`, duration: 2000, color: 'success' });
    };

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
                        <h2 className="page-title">Detalle de Solicitud {id}</h2>
                    </div>

                    <IonGrid className="ion-no-padding custom-grid">
                        <IonRow>
                            <IonCol size="12" sizeLg="8" className="col-main">
                                
                                <IonCard className="detalle-card main-info-card">
                                    <IonCardHeader className="card-header-flex">
                                        <div>
                                            <IonCardTitle>{solicitudData.negocio}</IonCardTitle>
                                            <p className="subtitle">{solicitudData.tipo}</p>
                                        </div>
                                        <IonBadge className={solicitudData.estado === "Revisión" ? "badge-blue" : "badge-green"}>
                                            {solicitudData.estado}
                                        </IonBadge>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonGrid className="ion-no-padding inner-grid">
                                            <IonRow>
                                                <IonCol size="12" sizeMd="6" className="info-item">
                                                    <IonIcon icon={documentTextOutline} className="info-icon" />
                                                    <div>
                                                        <span className="info-label">Giro Comercial</span>
                                                        <span className="info-value">{solicitudData.giro}</span>
                                                    </div>
                                                </IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item">
                                                    <IonIcon icon={calendarOutline} className="info-icon" />
                                                    <div>
                                                        <span className="info-label">Fecha de Solicitud</span>
                                                        <span className="info-value">{solicitudData.fecha}</span>
                                                    </div>
                                                </IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item">
                                                    <IonIcon icon={locationOutline} className="info-icon" />
                                                    <div>
                                                        <span className="info-label">Ubicación</span>
                                                        <span className="info-value">{solicitudData.direccion}</span>
                                                        <span className="info-sub-value">{solicitudData.comuna}</span>
                                                    </div>
                                                </IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item">
                                                    <IonIcon icon={businessOutline} className="info-icon" />
                                                    <div>
                                                        <span className="info-label">Superficie</span>
                                                        <span className="info-value">{solicitudData.superficie}</span>
                                                    </div>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonCardContent>
                                </IonCard>

                                <IonCard className="detalle-card">
                                    <IonCardHeader>
                                        <IonCardTitle className="title-with-icon">
                                            <div className="icon-box"><IonIcon icon={personOutline} /></div> 
                                            Datos del Solicitante
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonGrid className="ion-no-padding inner-grid">
                                            <IonRow>
                                                <IonCol size="12" sizeMd="6" className="info-item-simple">
                                                    <span className="info-label">Nombre Completo</span>
                                                    <span className="info-value">{solicitudData.ciudadano.nombre}</span>
                                                </IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item-simple">
                                                    <span className="info-label">RUT</span>
                                                    <span className="info-value">{solicitudData.ciudadano.rut}</span>
                                                </IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item-simple">
                                                    <span className="info-label">Email</span>
                                                    <span className="info-value">{solicitudData.ciudadano.email}</span>
                                                </IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item-simple">
                                                    <span className="info-label">Teléfono</span>
                                                    <span className="info-value flex-align">
                                                        <IonIcon icon={callOutline} className="mini-icon" /> {solicitudData.ciudadano.telefono}
                                                    </span>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonCardContent>
                                </IonCard>

                                <IonCard className="detalle-card">
                                    <IonCardHeader>
                                        <IonCardTitle className="title-with-icon">
                                            <div className="icon-box"><IonIcon icon={documentTextOutline} /></div> 
                                            Documentos Adjuntos
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonList className="doc-list">
                                            {solicitudData.documentos.map((doc, idx) => (
                                                <IonItem key={idx} className="doc-item" lines="none">
                                                    <div slot="start" className="doc-icon-wrapper">
                                                        <IonIcon icon={documentTextOutline} className="doc-icon" />
                                                    </div>
                                                    <IonLabel>
                                                        <h2>{doc.nombre}</h2>
                                                        <p>{doc.tamano}</p>
                                                    </IonLabel>
                                                    <IonButton fill="clear" slot="end" className="btn-download">
                                                        <IonIcon icon={downloadOutline} slot="icon-only" />
                                                    </IonButton>
                                                </IonItem>
                                            ))}
                                        </IonList>
                                    </IonCardContent>
                                </IonCard>

                                <IonCard className="detalle-card">
                                    <IonCardHeader>
                                        <IonCardTitle className="title-with-icon">
                                            <div className="icon-box"><IonIcon icon={chatbubbleEllipsesOutline} /></div> 
                                            Observaciones y Comunicación
                                        </IonCardTitle>
                                        <p className="subtitle">Historial de mensajes y requerimientos</p>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <div className="messages-container">
                                            {solicitudData.observaciones.map(obs => (
                                                <div key={obs.id} className={`message-bubble ${obs.tipo === 'admin' ? 'admin-bubble' : 'user-bubble'}`}>
                                                    <div className="bubble-header">
                                                        <strong>{obs.autor}</strong>
                                                        <span>{obs.fecha}</span>
                                                    </div>
                                                    <p>{obs.mensaje}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="divider"></div>

                                        <div className="new-message-box">
                                            <p className="reply-label">{esAdmin ? "Enviar observación al ciudadano:" : "Responder al administrador:"}</p>
                                            <IonTextarea
                                                placeholder="Escribe tu mensaje aquí..."
                                                fill="outline"
                                                rows={4}
                                                value={nuevoMensaje}
                                                onIonInput={e => setNuevoMensaje(e.detail.value!)}
                                                className="chat-textarea"
                                            />
                                            <div className="chat-action">
                                                <IonButton onClick={handleEnviarMensaje} className="btn-send" color="primary">
                                                    <IonIcon icon={sendOutline} slot="start" /> Enviar Mensaje
                                                </IonButton>
                                            </div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            {/* COLUMNA LATERAL (SIDEBAR) */}
                            <IonCol size="12" sizeLg="4" className="col-sidebar">
                                
                                {/* Panel de Administrador (Solo visible para Admin) */}
                                {esAdmin && (
                                    <IonCard className="detalle-card admin-actions-card">
                                        <IonCardHeader>
                                            <IonCardTitle>Acciones de Administrador</IonCardTitle>
                                        </IonCardHeader>
                                        <IonCardContent>
                                            <div className="action-group">
                                                <label>Cambiar Estado de Solicitud</label>
                                                <IonSelect fill="outline" value={nuevoEstado} onIonChange={e => setNuevoEstado(e.detail.value)}>
                                                    <IonSelectOption value="Revisión">En Revisión</IonSelectOption>
                                                    <IonSelectOption value="Observada">Observada</IonSelectOption>
                                                    <IonSelectOption value="Aprobada">Aprobada</IonSelectOption>
                                                    <IonSelectOption value="Rechazada">Rechazada</IonSelectOption>
                                                </IonSelect>
                                            </div>
                                            <IonButton expand="block" className="btn-actualizar" onClick={handleCambiarEstado} color="tertiary">
                                                Actualizar Estado
                                            </IonButton>

                                            <div className="divider"></div>

                                            <IonButton expand="block" fill="outline" color="success" className="btn-approve">
                                                <IonIcon icon={checkmarkCircleOutline} slot="start" /> Aprobar Solicitud
                                            </IonButton>
                                            <IonButton expand="block" fill="outline" color="danger" className="btn-reject mt-2">
                                                <IonIcon icon={closeCircleOutline} slot="start" /> Rechazar Solicitud
                                            </IonButton>
                                        </IonCardContent>
                                    </IonCard>
                                )}

                                <IonCard className="detalle-card">
                                    <IonCardHeader>
                                        <IonCardTitle>Estado del Trámite</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <div className="timeline">
                                            <div className="timeline-item">
                                                <div className="timeline-icon bg-green"><IonIcon icon={checkmarkCircleOutline} /></div>
                                                <div className="timeline-content">
                                                    <h4>Solicitud Recibida</h4>
                                                    <p>14/04/2026 09:30</p>
                                                </div>
                                            </div>
                                            <div className="timeline-item">
                                                <div className="timeline-icon bg-blue"><IonIcon icon={alertCircleOutline} /></div>
                                                <div className="timeline-content">
                                                    <h4>En Revisión</h4>
                                                    <p>14/04/2026 14:00</p>
                                                </div>
                                            </div>
                                            <div className="timeline-item pending">
                                                <div className="timeline-icon bg-gray"><IonIcon icon={checkmarkCircleOutline} /></div>
                                                <div className="timeline-content">
                                                    <h4>Pendiente Aprobación</h4>
                                                    <p>--</p>
                                                </div>
                                            </div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>

                                <IonCard className="detalle-card">
                                    <IonCardHeader>
                                        <IonCardTitle>Resumen</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <div className="quick-info-list">
                                            <div className="qi-row"><span>ID Solicitud:</span> <strong>{solicitudData.id}</strong></div>
                                            <div className="qi-row"><span>Tipo:</span> <strong>{solicitudData.tipo}</strong></div>
                                            <div className="qi-row"><span>Documentos:</span> <strong>{solicitudData.documentos.length}</strong></div>
                                            <div className="qi-row"><span>Observaciones:</span> <strong>{solicitudData.observaciones.length}</strong></div>
                                        </div>
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