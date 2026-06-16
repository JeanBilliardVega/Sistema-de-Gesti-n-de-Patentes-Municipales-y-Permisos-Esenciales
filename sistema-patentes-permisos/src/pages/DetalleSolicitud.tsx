import React, { useState, useEffect } from "react";
import { useHistory, useParams} from "react-router-dom";
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
    alertCircleOutline, trashOutline
} from "ionicons/icons";
import jsPDF from 'jspdf';
import Navbar from "../components/Navbar";
import './DetalleSolicitud.scss';

import { SolicitudRaw, Documento, Mensaje} from '../types';

const formatearIdVisual = (idNumerico: number, fechaCreacion: string) => {
    const año = new Date(fechaCreacion).getFullYear();
    return `SOL-${año}-${String(idNumerico).padStart(3, '0')}`;
};

const DetalleSolicitud: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const [presentToast] = useIonToast();
    const [loading, setLoading] = useState(true);
    const [solicitud, setSolicitud] = useState<SolicitudRaw | null>(null);
    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [loadingMensajes, setLoadingMensajes] = useState(false);
    const [enviandoMensaje, setEnviandoMensaje] = useState(false);
    const [actualizandoEstado, setActualizandoEstado] = useState(false);

    const userData = JSON.parse(localStorage.getItem('usuario') || '{}');
    const esAdmin = userData.rol === 'admin';

    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [nuevoEstado, setNuevoEstado] = useState("");

    // Cargar solicitud
    useEffect(() => {
        const cargarDesdeApi = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const url = esAdmin
                    ? `http://localhost:3000/api/funcionario/solicitud/${id}`
                    : `http://localhost:3000/api/ciudadano/solicitud/${id}`;

                const respuesta = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (respuesta.ok) {
                    const data = await respuesta.json();
                    setSolicitud(data);
                    setNuevoEstado(data.estado || 'pendiente');
                } else {
                    presentToast({ message: 'Error al cargar la solicitud', duration: 2000, color: 'danger' });
                }
            } finally {
                setLoading(false);
            }
        };
        cargarDesdeApi();
    }, [id, esAdmin, presentToast]);

    // Cargar mensajes con polling cada 5 segundos
    useEffect(() => {
        if (!id) return;
        let cargando = false;
        const cargarMensajes = async () => {
            if (cargando) return;
            cargando = true;
            setLoadingMensajes(true);
            try {
                const token = localStorage.getItem('token');
                const respuesta = await fetch(`http://localhost:3000/api/solicitud/${id}/mensajes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (respuesta.ok) {
                    const data = await respuesta.json();
                    setMensajes(data);
                }
            } catch (error) {
                console.error('Error al cargar mensajes:', error);
            } finally {
                setLoadingMensajes(false);
                cargando = false;
            }
        };

        cargarMensajes();
        const intervalo = setInterval(cargarMensajes, 5000); // cada 5 segundos
        return () => clearInterval(intervalo);
    }, [id]);

    // Enviar mensaje
    const handleEnviarMensaje = async () => {
        if (!nuevoMensaje.trim()) {
            presentToast({ message: 'El mensaje no puede estar vacío', duration: 2000, color: 'warning' });
            return;
        }
        try {
            setEnviandoMensaje(true);
            const token = localStorage.getItem('token');
            const respuesta = await fetch(`http://localhost:3000/api/solicitud/${id}/mensaje`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contenido: nuevoMensaje })
            });
            if (respuesta.ok) {
                const data = await respuesta.json();
                setMensajes(prev => [...prev, {
                    id: data.data.id,
                    contenido: nuevoMensaje,
                    autor_nombre: userData.nombre,
                    autor_rol: userData.rol,
                    fecha_envio: new Date().toISOString()
                }]);
                setNuevoMensaje("");
                presentToast({ message: 'Mensaje enviado', duration: 2000, color: 'success' });
            } else {
                presentToast({ message: 'Error al enviar el mensaje', duration: 2000, color: 'danger' });
            }
        } finally {
            setEnviandoMensaje(false);
        }
    };

    // Cambiar estado (desde select)
    const handleCambiarEstado = async () => {
        try {
            setActualizandoEstado(true);
            const token = localStorage.getItem('token');
            const respuesta = await fetch(`http://localhost:3000/api/funcionario/solicitud/${id}/estado`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (respuesta.ok) {
                setSolicitud((prev: SolicitudRaw | null) => prev ? { ...prev, estado: nuevoEstado } : null);
                presentToast({ message: 'Estado actualizado correctamente', duration: 2000, color: 'success' });
            } else {
                presentToast({ message: 'Error al actualizar el estado', duration: 2000, color: 'danger' });
            }
        } finally {
            setActualizandoEstado(false);
        }
    };

    // Aprobar directamente
    const handleAprobar = async () => {
        setNuevoEstado('aprobada');
        await handleCambiarEstadoDirecto('aprobada');
    };

    // Rechazar directamente
    const handleRechazar = async () => {
        setNuevoEstado('rechazada');
        await handleCambiarEstadoDirecto('rechazada');
    };

    // Cambiar estado directo (para aprobar/rechazar)
    const handleCambiarEstadoDirecto = async (estado: string) => {
        try {
            setActualizandoEstado(true);
            const token = localStorage.getItem('token');
            const respuesta = await fetch(`http://localhost:3000/api/funcionario/solicitud/${id}/estado`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado })
            });
            if (respuesta.ok) {
                setSolicitud((prev: SolicitudRaw | null) => prev ? { ...prev, estado } : null);
                setNuevoEstado(estado);
                presentToast({ message: `Solicitud ${estado} correctamente`, duration: 2000, color: 'success' });
            } else {
                presentToast({ message: 'Error al actualizar el estado', duration: 2000, color: 'danger' });
            }
        } finally {
            setActualizandoEstado(false);
        }
    };

    // ✅ NUEVO: Descargar Resolución en PDF (RF7)
    const descargarResolucion = () => {
        if (!solicitud || solicitud.estado !== 'aprobada') {
            presentToast({ message: 'Solo se puede descargar resolución para solicitudes aprobadas', duration: 2000, color: 'warning' });
            return;
        }

        try {
            const doc = new jsPDF();
            const idVisual = formatearIdVisual(solicitud.id, solicitud.fecha_creacion);

            doc.setFontSize(18);
            doc.text('RESOLUCIÓN DE PATENTE MUNICIPAL', 20, 20);
            doc.setFontSize(12);
            doc.text(`ID Solicitud: ${idVisual}`, 20, 40);
            doc.text(`Negocio: ${solicitud.razon_social || 'No especificado'}`, 20, 50);
            doc.text(`Tipo: ${solicitud.tipo_patente || 'No especificado'}`, 20, 60);
            doc.text(`Giro: ${solicitud.giro || 'No especificado'}`, 20, 70);
            doc.text(`Dirección: ${solicitud.direccion || 'No especificada'}`, 20, 80);

            // ✅ VALIDAR que rut_comercial exista
            const rut_comercial = solicitud.rut_comercial || 'No especificado';
            doc.text(`RUT Comercial: ${rut_comercial}`, 20, 90);

            doc.text(`Fecha Solicitud: ${new Date(solicitud.fecha_creacion).toLocaleDateString('es-CL')}`, 20, 100);
            doc.text(`Estado: APROBADA`, 20, 110);

            const ciudadanoNombre = solicitud.ciudadano_nombre || 'No disponible';
            const ciudadanoRut = solicitud.ciudadano_rut || 'No disponible';
            doc.text(`Solicitante: ${ciudadanoNombre} - RUT: ${ciudadanoRut}`, 20, 120);

            const ciudadanoEmail = solicitud.ciudadano_email || 'No disponible';
            doc.text(`Email: ${ciudadanoEmail}`, 20, 130);
            doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-CL')}`, 20, 150);
            doc.text('Esta resolución es válida por 1 año a partir de la fecha de emisión.', 20, 170);
            doc.save(`resolucion_${idVisual}.pdf`);

            presentToast({ message: 'PDF descargado correctamente', duration: 2000, color: 'success' });
        } catch (error) {
            console.error('Error al generar PDF:', error);
            presentToast({ message: 'Error al generar el PDF', duration: 2000, color: 'danger' });
        }
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

    const ciudadanoNombre  = solicitud.ciudadano_nombre || 'No disponible';
    const ciudadanoRut     = solicitud.ciudadano_rut    || 'No disponible';
    const ciudadanoEmail   = solicitud.ciudadano_email  || 'No disponible';
    const ciudadanoTelefono = solicitud.telefono        || 'No disponible';
    const documentos = solicitud.documentos || [];

    return (
        <IonPage>
            <Navbar tipoUsuario={esAdmin ? 'funcionario' : 'ciudadano'} />
            <IonContent className="detalle-bg">
                <div className="detalle-wrapper">
                    <div className="header-actions">
                        <IonButton fill="clear" color="medium" onClick={() => history.goBack()} className="btn-volver">
                            <IonIcon slot="start" icon={arrowBackOutline} /> Volver
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
                                                    <div><span className="info-label">Ubicación</span><span className="info-value">{solicitud.direccion}</span></div>
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
                                    <IonCardHeader>
                                        <IonCardTitle className="title-with-icon">
                                            <div className="icon-box"><IonIcon icon={personOutline} /></div>
                                            Datos del Solicitante
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonGrid className="ion-no-padding inner-grid">
                                            <IonRow>
                                                <IonCol size="12" sizeMd="6" className="info-item-simple"><span className="info-label">Nombre Completo</span><span className="info-value">{ciudadanoNombre}</span></IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item-simple"><span className="info-label">RUT</span><span className="info-value">{ciudadanoRut}</span></IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item-simple"><span className="info-label">Email</span><span className="info-value">{ciudadanoEmail}</span></IonCol>
                                                <IonCol size="12" sizeMd="6" className="info-item-simple"><span className="info-label">Teléfono</span><span className="info-value"><IonIcon icon={callOutline} className="mini-icon" /> {ciudadanoTelefono}</span></IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonCardContent>
                                </IonCard>

                                {/* Documentos */}
                                <IonCard className="detalle-card">
                                    <IonCardHeader>
                                        <IonCardTitle className="title-with-icon">
                                            <div className="icon-box"><IonIcon icon={documentTextOutline} /></div>
                                            Documentos Adjuntos
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        {documentos.length > 0 ? (
                                            <IonList className="doc-list">
                                                {documentos.map((doc: Documento, idx: number) => (
                                                    <IonItem key={idx} className="doc-item" lines="none">
                                                        <div slot="start" className="doc-icon-wrapper"><IonIcon icon={documentTextOutline} className="doc-icon" /></div>
                                                        <IonLabel><h2>{doc.nombre}</h2><p>{doc.tipo?.split('/')[1]?.toUpperCase() || 'DOC'}</p></IonLabel>
                                                        {doc.ruta && (
                                                            <IonButton fill="clear" slot="end" onClick={() => window.open(`http://localhost:3000/${doc.ruta}`, '_blank')}>
                                                                <IonIcon icon={downloadOutline} slot="icon-only" />
                                                            </IonButton>
                                                        )}
                                                    </IonItem>
                                                ))}
                                            </IonList>
                                        ) : <p className="ion-text-center">No hay documentos adjuntos</p>}
                                    </IonCardContent>
                                </IonCard>

                                {/* Mensajes - AHORA FUNCIONAL */}
                                <IonCard className="detalle-card">
                                    <IonCardHeader>
                                        <IonCardTitle className="title-with-icon">
                                            <div className="icon-box"><IonIcon icon={chatbubbleEllipsesOutline} /></div>
                                            Observaciones y Comunicación
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <div className="messages-container">
                                            {loadingMensajes ? (
                                                <div className="ion-text-center"><IonSpinner /></div>
                                            ) : mensajes.length === 0 ? (
                                                <p className="ion-text-center ion-padding">No hay mensajes aún.</p>
                                            ) : (
                                                mensajes.map((msg) => {
                                                    const esMio = msg.autor_rol === userData.rol;
                                                    return (
                                                        <div key={msg.id} className={`mensaje-bubble ${esMio ? 'mensaje-propio' : 'mensaje-otro'}`}>
                                                            <div className="mensaje-header">
                                                                <strong>{msg.autor_nombre}</strong>
                                                                <span className="mensaje-rol">{msg.autor_rol === 'admin' ? ' (Funcionario)' : ' (Ciudadano)'}</span>
                                                            </div>
                                                            <p className="mensaje-contenido">{msg.contenido}</p>
                                                            <span className="mensaje-fecha">
                                                                {new Date(msg.fecha_envio).toLocaleString('es-CL')}
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>

                                        <div className="divider"></div>
                                        <div className="new-message-box">
                                            <p className="reply-label">
                                                {esAdmin ? 'Enviar observación al ciudadano:' : 'Responder al administrador:'}
                                            </p>
                                            <IonTextarea
                                                placeholder="Escribe tu mensaje aquí..."
                                                fill="outline"
                                                rows={4}
                                                value={nuevoMensaje}
                                                onIonInput={e => setNuevoMensaje(e.detail.value!)}
                                                className="chat-textarea"
                                            />
                                            <div className="chat-action">
                                                <IonButton
                                                    onClick={handleEnviarMensaje}
                                                    className="btn-send"
                                                    color="primary"
                                                    disabled={enviandoMensaje}
                                                >
                                                    {enviandoMensaje
                                                        ? <IonSpinner name="crescent" />
                                                        : <><IonIcon icon={sendOutline} slot="start" /> Enviar Mensaje</>
                                                    }
                                                </IonButton>
                                            </div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>

                            </IonCol>

                            {/* Sidebar */}
                            <IonCol size="12" sizeLg="4" className="col-sidebar">

                                {/* Panel admin - FUNCIONAL */}
                                {esAdmin && (
                                    <IonCard className="detalle-card admin-actions-card">
                                        <IonCardHeader><IonCardTitle>Acciones de Administrador</IonCardTitle></IonCardHeader>
                                        <IonCardContent>
                                            <div className="action-group">
                                                <label>Cambiar Estado de Solicitud</label>
                                                <IonSelect
                                                    fill="outline"
                                                    value={nuevoEstado}
                                                    onIonChange={e => setNuevoEstado(e.detail.value)}
                                                >
                                                    <IonSelectOption value="pendiente">Pendiente</IonSelectOption>
                                                    <IonSelectOption value="revisión">En Revisión</IonSelectOption>
                                                    <IonSelectOption value="observada">Observada</IonSelectOption>
                                                    <IonSelectOption value="aprobada">Aprobada</IonSelectOption>
                                                    <IonSelectOption value="rechazada">Rechazada</IonSelectOption>
                                                </IonSelect>
                                            </div>
                                            <IonButton
                                                expand="block"
                                                className="btn-actualizar"
                                                onClick={handleCambiarEstado}
                                                color="tertiary"
                                                disabled={actualizandoEstado}
                                            >
                                                {actualizandoEstado ? <IonSpinner name="crescent" /> : 'Actualizar Estado'}
                                            </IonButton>
                                            <div className="divider"></div>
                                            <IonButton expand="block" fill="outline" color="success" onClick={handleAprobar} disabled={actualizandoEstado}>
                                                <IonIcon icon={checkmarkCircleOutline} slot="start" /> Aprobar Solicitud
                                            </IonButton>
                                            <IonButton expand="block" fill="outline" color="danger" className="mt-2" onClick={handleRechazar} disabled={actualizandoEstado}>
                                                <IonIcon icon={closeCircleOutline} slot="start" /> Rechazar Solicitud
                                            </IonButton>
                                            <IonButton expand="block" fill="outline" color="danger" className="mt-2" onClick={async () => {
                                                if (!window.confirm('¿Estás seguro de eliminar esta solicitud?')) return;
                                                const token = localStorage.getItem('token');
                                                const res = await fetch(`http://localhost:3000/api/funcionario/solicitud/${id}`, {
                                                    method: 'DELETE',
                                                    headers: { 'Authorization': `Bearer ${token}` }
                                                });
                                                if (res.ok) {
                                                    history.goBack();
                                                } else {
                                                    presentToast({ message: 'Error al eliminar la solicitud', duration: 2000, color: 'danger' });
                                                }
                                            }}>
                                                <IonIcon icon={trashOutline} slot="start" /> Eliminar Solicitud
                                            </IonButton>
                                            {/* ✅ NUEVO: Botón de descarga PDF (RF7) - solo si aprobada */}
                                            {solicitud.estado === 'aprobada' && (
                                                <IonButton expand="block" fill="outline" color="success" className="mt-2" onClick={descargarResolucion}>
                                                    <IonIcon icon={downloadOutline} slot="start" /> Descargar Resolución (PDF)
                                                </IonButton>
                                            )}
                                        </IonCardContent>
                                    </IonCard>
                                )}

                                {/* Si el ciudadano ve la solicitud y está aprobada, también puede descargar PDF */}
                                {!esAdmin && solicitud.estado === 'aprobada' && (
                                    <IonCard className="detalle-card">
                                        <IonCardHeader><IonCardTitle>Resolución</IonCardTitle></IonCardHeader>
                                        <IonCardContent>
                                            <IonButton expand="block" fill="outline" color="success" onClick={descargarResolucion}>
                                                <IonIcon icon={downloadOutline} slot="start" /> Descargar Resolución (PDF)
                                            </IonButton>
                                        </IonCardContent>
                                    </IonCard>
                                )}

                                {/* Timeline */}
                                <IonCard className="detalle-card">
                                    <IonCardHeader><IonCardTitle>Estado del Trámite</IonCardTitle></IonCardHeader>
                                    <IonCardContent>
                                        <div className="timeline">
                                            <div className="timeline-item">
                                                <div className="timeline-icon bg-green"><IonIcon icon={checkmarkCircleOutline} /></div>
                                                <div className="timeline-content"><h4>Solicitud Recibida</h4><p>{new Date(solicitud.fecha_creacion).toLocaleString('es-CL')}</p></div>
                                            </div>
                                            <div className="timeline-item">
                                                <div className={`timeline-icon ${['revisión', 'observada', 'aprobada', 'rechazada'].includes(estadoTexto) ? 'bg-blue' : 'bg-gray'}`}>
                                                    <IonIcon icon={alertCircleOutline} />
                                                </div>
                                                <div className="timeline-content"><h4>En Revisión</h4><p>{solicitud.fecha_actualizacion ? new Date(solicitud.fecha_actualizacion).toLocaleString('es-CL') : '--'}</p></div>
                                            </div>
                                            <div className="timeline-item">
                                                <div className={`timeline-icon ${estadoTexto === 'aprobada' ? 'bg-green' : estadoTexto === 'rechazada' ? 'bg-red' : 'bg-gray'}`}>
                                                    <IonIcon icon={checkmarkCircleOutline} />
                                                </div>
                                                <div className="timeline-content"><h4>Resultado Final</h4><p>{estadoCapitalizado}</p></div>
                                            </div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>

                                {/* Resumen */}
                                <IonCard className="detalle-card">
                                    <IonCardHeader><IonCardTitle>Resumen</IonCardTitle></IonCardHeader>
                                    <IonCardContent>
                                        <div className="quick-info-list">
                                            <div className="qi-row"><span>ID Interno:</span><strong>{solicitud.id}</strong></div>
                                            <div className="qi-row"><span>Tipo:</span><strong>{solicitud.tipo_patente}</strong></div>
                                            <div className="qi-row"><span>Documentos:</span><strong>{documentos.length}</strong></div>
                                            <div className="qi-row"><span>Mensajes:</span><strong>{mensajes.length}</strong></div>
                                            <div className="qi-row"><span>Estado:</span><strong>{estadoCapitalizado}</strong></div>
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