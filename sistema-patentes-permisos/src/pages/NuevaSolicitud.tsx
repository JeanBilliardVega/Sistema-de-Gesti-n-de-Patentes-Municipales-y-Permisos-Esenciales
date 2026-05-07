import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonInput, IonSelect, IonSelectOption,
    IonTextarea, IonList, IonItem, IonLabel, useIonToast, IonText
} from "@ionic/react";
import {
    arrowBackOutline, cloudUploadOutline, checkmarkOutline, documentTextOutline,
    closeOutline
} from "ionicons/icons";
import './NuevaSolicitud.scss';

type ArchivoSubido = {
    id: string;
    nombre: string;
    tipo: string;
    tamano: string;
};

const NuevaSolicitud: React.FC = () => {
    const history = useHistory();
    const [presentToast] = useIonToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        nombreNegocio: "", tipoPatente: "", giro: "", direccion: "",
        comuna: "", superficie: "", telefono: "", descripcion: "",
    });
    const [archivos, setArchivos] = useState<ArchivoSubido[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const tiposPatente = [
        "Patente Comercial", "Patente de Alcoholes", "Permiso Municipal", "Patente Profesional",
    ];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const nuevosArchivos: ArchivoSubido[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Validar tipo de archivo
            if (!file.type.includes("pdf") && !file.type.includes("image")) {
                presentToast({ message: `${file.name} no es válido (solo PDF o imágenes)`, duration: 3000, color: 'danger' });
                continue;
            }
            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                presentToast({ message: `${file.name} excede el tamaño máximo de 5MB`, duration: 3000, color: 'danger' });
                continue;
            }
            nuevosArchivos.push({
                id: Math.random().toString(36).substr(2, 9),
                nombre: file.name,
                tipo: file.type,
                tamano: (file.size / 1024).toFixed(2) + " KB",
            });
        }
        setArchivos([...archivos, ...nuevosArchivos]);
        if (nuevosArchivos.length > 0) {
            presentToast({ message: `${nuevosArchivos.length} archivo(s) agregado(s)`, duration: 2000, color: 'success' });
        }
        // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeArchivo = (id: string) => {
        setArchivos(archivos.filter((a) => a.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.nombreNegocio) newErrors.nombreNegocio = "Requerido";
        if (!formData.tipoPatente) newErrors.tipoPatente = "Requerido";
        if (!formData.giro) newErrors.giro = "Requerido";
        if (!formData.direccion) newErrors.direccion = "Requerido";
        if (!formData.comuna) newErrors.comuna = "Requerido";
        if (!formData.superficie) newErrors.superficie = "Requerido";
        if (!formData.telefono) newErrors.telefono = "Requerido";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            presentToast({ message: "Complete todos los campos obligatorios", duration: 3000, color: 'danger' });
            return;
        }

        if (archivos.length === 0) {
            presentToast({ message: "Debe adjuntar al menos un documento obligatorio", duration: 3000, color: 'warning' });
            return;
        }

        // Simular éxito en el envío
        presentToast({ message: "Solicitud enviada exitosamente", duration: 2000, color: 'success' });
        setTimeout(() => {
            history.push("/seguimiento");
        }, 1500);
    };

    return (
        <IonPage>
            {/* Barra de navegación superior */}
            <IonHeader className="ion-no-border">
                <IonToolbar color="primary" className="solicitud-toolbar">
                    <IonButtons slot="start">
                        <IonButton onClick={() => history.push("/dashCiudadano")}>
                            <IonIcon icon={arrowBackOutline} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Nueva Solicitud</IonTitle>
                    <IonButtons slot="end">
                        <IonButton className="btn-cancelar-header" onClick={() => history.push("/dashCiudadano")}>
                            Cancelar
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding form-bg">
                <div className="form-wrapper">
                    <form onSubmit={handleSubmit}>

                        {/* Tarjeta 1: Información del Negocio */}
                        <IonCard className="form-card">
                            <IonCardHeader>
                                <IonCardTitle>Información del Negocio</IonCardTitle>
                                <IonCardSubtitle>Datos básicos de su establecimiento</IonCardSubtitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonGrid className="ion-no-padding custom-form-grid">
                                    <IonRow>
                                        <IonCol size="12">
                                            <div className="input-group">
                                                <IonInput label="Nombre del Negocio *" labelPlacement="stacked" fill="outline" placeholder="Ej: Almacén Don Juan" value={formData.nombreNegocio} onIonInput={e => setFormData({...formData, nombreNegocio: e.detail.value!})} className={errors.nombreNegocio ? 'ion-invalid ion-touched' : ''} errorText={errors.nombreNegocio} />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="6">
                                            <div className="input-group">
                                                <IonSelect label="Tipo de Patente *" labelPlacement="stacked" fill="outline" placeholder="Seleccione tipo" value={formData.tipoPatente} onIonChange={e => setFormData({...formData, tipoPatente: e.detail.value})} className={errors.tipoPatente ? 'ion-invalid ion-touched' : ''}>
                                                    {tiposPatente.map(tipo => <IonSelectOption key={tipo} value={tipo}>{tipo}</IonSelectOption>)}
                                                </IonSelect>
                                                {errors.tipoPatente && <IonText color="danger" className="error-msg">{errors.tipoPatente}</IonText>}
                                            </div>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="6">
                                            <div className="input-group">
                                                <IonInput label="Giro Comercial *" labelPlacement="stacked" fill="outline" placeholder="Ej: Almacén de abarrotes" value={formData.giro} onIonInput={e => setFormData({...formData, giro: e.detail.value!})} className={errors.giro ? 'ion-invalid ion-touched' : ''} errorText={errors.giro} />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="6">
                                            <div className="input-group">
                                                <IonInput label="Dirección *" labelPlacement="stacked" fill="outline" placeholder="Calle Principal #123" value={formData.direccion} onIonInput={e => setFormData({...formData, direccion: e.detail.value!})} className={errors.direccion ? 'ion-invalid ion-touched' : ''} errorText={errors.direccion} />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="6">
                                            <div className="input-group">
                                                <IonInput label="Comuna *" labelPlacement="stacked" fill="outline" placeholder="Santiago" value={formData.comuna} onIonInput={e => setFormData({...formData, comuna: e.detail.value!})} className={errors.comuna ? 'ion-invalid ion-touched' : ''} errorText={errors.comuna} />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="6">
                                            <div className="input-group">
                                                <IonInput type="number" label="Superficie (m²) *" labelPlacement="stacked" fill="outline" placeholder="50" value={formData.superficie} onIonInput={e => setFormData({...formData, superficie: e.detail.value!})} className={errors.superficie ? 'ion-invalid ion-touched' : ''} errorText={errors.superficie} />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="6">
                                            <div className="input-group">
                                                <IonInput type="tel" label="Teléfono de Contacto *" labelPlacement="stacked" fill="outline" placeholder="+56 9 1234 5678" value={formData.telefono} onIonInput={e => setFormData({...formData, telefono: e.detail.value!})} className={errors.telefono ? 'ion-invalid ion-touched' : ''} errorText={errors.telefono} />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12">
                                            <div className="input-group">
                                                <IonTextarea label="Descripción Adicional" labelPlacement="stacked" fill="outline" placeholder="Información adicional sobre su negocio..." rows={3} value={formData.descripcion} onIonInput={e => setFormData({...formData, descripcion: e.detail.value!})} />
                                            </div>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCardContent>
                        </IonCard>

                        {/* Tarjeta 2: Subida de Archivos */}
                        <IonCard className="form-card">
                            <IonCardHeader>
                                <IonCardTitle>Documentos Obligatorios</IonCardTitle>
                                <IonCardSubtitle>Adjunte los documentos requeridos (PDF o imágenes, máx. 5MB c/u)</IonCardSubtitle>
                            </IonCardHeader>
                            <IonCardContent>

                                {/* Zona de subida (drag & drop) */}
                                <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                                    <input type="file" multiple accept=".pdf,image/*" onChange={handleFileUpload} ref={fileInputRef} hidden />
                                    <div className="upload-icon-wrapper">
                                        <IonIcon icon={cloudUploadOutline} />
                                    </div>
                                    <p className="upload-text">
                                        <span className="text-blue">Haz clic para subir</span> o arrastra archivos aquí
                                    </p>
                                    <p className="upload-hint">PDF o imágenes (PNG, JPG) - Máximo 5MB por archivo</p>
                                </div>

                                {/* Lista de documentos requeridos */}
                                <div className="required-docs-box">
                                    <p className="docs-title">Documentos requeridos:</p>
                                    <ul className="docs-list">
                                        <li><IonIcon icon={checkmarkOutline} /> Cédula de identidad del solicitante</li>
                                        <li><IonIcon icon={checkmarkOutline} /> Croquis de ubicación del negocio</li>
                                        <li><IonIcon icon={checkmarkOutline} /> Certificado de dominio o contrato de arriendo</li>
                                    </ul>
                                </div>

                                {/* Lista de archivos adjuntados */}
                                {archivos.length > 0 && (
                                    <div className="uploaded-files-section">
                                        <IonLabel className="files-header">Archivos adjuntados ({archivos.length})</IonLabel>
                                        <IonList className="files-list">
                                            {archivos.map(archivo => (
                                                <IonItem key={archivo.id} lines="none" className="file-item">
                                                    <IonIcon icon={documentTextOutline} slot="start" className="file-icon" />
                                                    <IonLabel>
                                                        <h2>{archivo.nombre}</h2>
                                                        <p>{archivo.tamano}</p>
                                                    </IonLabel>
                                                    <IonButton fill="clear" slot="end" color="medium" onClick={() => removeArchivo(archivo.id)}>
                                                        <IonIcon icon={closeOutline} slot="icon-only" />
                                                    </IonButton>
                                                </IonItem>
                                            ))}
                                        </IonList>
                                    </div>
                                )}
                            </IonCardContent>
                        </IonCard>

                        {/* Botones inferiores */}
                        <div className="form-actions">
                            <IonButton fill="outline" color="medium" className="btn-action" onClick={() => history.push("/dashCiudadano")}>
                                Cancelar
                            </IonButton>
                            <IonButton type="submit" color="primary" className="btn-action">
                                Enviar Solicitud
                            </IonButton>
                        </div>

                    </form>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default NuevaSolicitud;