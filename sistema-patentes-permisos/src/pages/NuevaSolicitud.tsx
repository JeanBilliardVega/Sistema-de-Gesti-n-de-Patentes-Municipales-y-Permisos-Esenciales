import React, { useState, useRef} from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage, IonContent, IonButton, IonIcon, IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonInput, IonSelect, IonSelectOption, IonTextarea, IonList, IonItem,
    IonLabel, useIonToast, IonText, IonSpinner
} from "@ionic/react";
import {
    cloudUploadOutline, checkmarkOutline, documentTextOutline,
    closeOutline, arrowBackOutline, businessOutline, searchOutline, personOutline
} from "ionicons/icons";
import Navbar from "../components/Navbar";
import './NuevaSolicitud.scss';

type ArchivoSubido = {
    id: string;
    nombre: string;
    tipo: string;
    tamano: string;
    file: File;
};

const NuevaSolicitud: React.FC = () => {
    const history = useHistory();
    const [presentToast] = useIonToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // NUEVO: Estado para datos del dueño
    const [rutDueno, setRutDueno] = useState("");
    const [duenoData, setDuenoData] = useState({ nombre: "", email: "" });
    const [buscando, setBuscando] = useState(false);
    const [duenoEncontrado, setDuenoEncontrado] = useState(false);

    const [formData, setFormData] = useState({
        razonSocial: "", rutComercial: "", tipoPatente: "", giro: "",
        direccion: "", rolAvaluo: "", superficie: "", telefono: "", descripcion: "",
    });

    const [archivos, setArchivos] = useState<ArchivoSubido[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const tiposPatente = [
        "Patente Comercial", "Patente Industrial", "Patente Profesional",
        "Patente de Alcoholes", "Microempresa Familiar (MEF)"
    ];

    // NUEVO: Función para buscar por RUT
    const buscarPorRut = async () => {
        if (!rutDueno.trim()) {
            presentToast({ message: "Ingrese un RUT válido", duration: 2000, color: 'warning' });
            return;
        }
        setBuscando(true);
        try {
            const res = await fetch(`http://localhost:3000/api/usuario/${rutDueno}`);
            const data = await res.json();
            if (!res.ok) {
                presentToast({ message: data.error || "Usuario no encontrado", duration: 2000, color: 'danger' });
                setDuenoEncontrado(false);
                setDuenoData({ nombre: "", email: "" });
            } else {
                setDuenoData({
                    nombre: data.nombre,
                    email: data.email,
                });
                setDuenoEncontrado(true);
                presentToast({ message: "Datos del dueño cargados", duration: 1500, color: 'success' });
            }
        } catch{
            presentToast({ message: "Error al buscar el RUT", duration: 2000, color: 'danger' });
        } finally {
            setBuscando(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const nuevosArchivos: ArchivoSubido[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!file.type.includes("pdf") && !file.type.includes("image")) {
                presentToast({ message: `${file.name} no es válido (solo PDF o imágenes)`, duration: 3000, color: 'danger' });
                continue;
            }
            if (file.size > 5 * 1024 * 1024) {
                presentToast({ message: `${file.name} excede el tamaño máximo de 5MB`, duration: 3000, color: 'danger' });
                continue;
            }

            nuevosArchivos.push({
                id: Math.random().toString(36).substring(2, 9),
                nombre: file.name,
                tipo: file.type,
                tamano: (file.size / 1024).toFixed(2) + " KB",
                file: file
            });
        }

        setArchivos([...archivos, ...nuevosArchivos]);
        if (nuevosArchivos.length > 0) {
            presentToast({ message: `${nuevosArchivos.length} archivo(s) agregado(s)`, duration: 2000, color: 'success' });
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeArchivo = (id: string) => {
        setArchivos(archivos.filter((a) => a.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        // NUEVO: Validar que se haya buscado un dueño válido
        if (!duenoEncontrado) {
            presentToast({ message: "Debe buscar un RUT válido del dueño primero", duration: 3000, color: 'warning' });
            return;
        }

        if (!formData.razonSocial) newErrors.razonSocial = "Requerido";
        if (!formData.rutComercial) newErrors.rutComercial = "Requerido";
        if (!formData.tipoPatente) newErrors.tipoPatente = "Requerido";
        if (!formData.giro) newErrors.giro = "Requerido";
        if (!formData.direccion) newErrors.direccion = "Requerido";
        if (!formData.rolAvaluo) newErrors.rolAvaluo = "Requerido";
        if (!formData.telefono) newErrors.telefono = "Requerido";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            presentToast({ message: "Complete todos los campos obligatorios", duration: 3000, color: 'danger' });
            return;
        }

        if (archivos.length === 0) {
            presentToast({ message: "Debe adjuntar al menos un documento", duration: 3000, color: 'warning' });
            return;
        }

        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => data.append(k, v));
        archivos.forEach(archivo => data.append('documentos', archivo.file));
        // NUEVO: Enviar el RUT del dueño
        data.append('rutDueno', rutDueno);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3000/api/ciudadano/crear_solicitud', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token },
                body: data
            });

            const respuesta = await res.json();
            if (!res.ok) {
                presentToast({ message: respuesta.error || 'Error al enviar la solicitud', duration: 3000, color: 'danger' });
                return;
            }
            presentToast({ message: 'Solicitud enviada exitosamente', duration: 2000, color: 'success' });
            setTimeout(() => history.push('/ciudadano/inicio'), 1500);
        } catch{
            presentToast({ message: 'No se pudo conectar con el servidor', duration: 3000, color: 'danger' });
        }
    };

    return (
        <IonPage>
            <Navbar tipoUsuario="ciudadano" />

            <IonContent className="form-bg">
                <div className="form-wrapper">

                    <div className="header-actions">
                        <IonButton fill="clear" color="medium" onClick={() => history.push("/ciudadano/inicio")} className="btn-volver">
                            <IonIcon slot="start" icon={arrowBackOutline} />
                            Volver al Inicio
                        </IonButton>
                        <h2 className="page-title">Nueva Solicitud de Patente</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* NUEVA SECCIÓN: Datos del Dueño (búsqueda por RUT) */}
                        <IonCard className="form-card">
                            <IonCardHeader className="card-header-flex">
                                <div className="card-icon">
                                    <IonIcon icon={personOutline} />
                                </div>
                                <div>
                                    <IonCardTitle>Datos del Dueño / Solicitante</IonCardTitle>
                                    <IonCardSubtitle>Ingrese el RUT del dueño para cargar sus datos automáticamente</IonCardSubtitle>
                                </div>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonGrid className="ion-no-padding custom-form-grid">
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <div className="input-group">
                                                <IonInput
                                                    label="RUT del Dueño *"
                                                    labelPlacement="stacked"
                                                    fill="outline"
                                                    placeholder="Ej: 12.345.678-9"
                                                    value={rutDueno}
                                                    onIonInput={e => setRutDueno(e.detail.value!)}
                                                />
                                            </div>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="2" className="ion-align-self-center">
                                            <IonButton expand="block" onClick={buscarPorRut} disabled={buscando}>
                                                {buscando ? <IonSpinner name="crescent" /> : <><IonIcon icon={searchOutline} /> Buscar</>}
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>
                                    {duenoEncontrado && (
                                        <IonRow>
                                            <IonCol size="12" sizeMd="6">
                                                <div className="input-group">
                                                    <IonInput label="Nombre Completo" labelPlacement="stacked" fill="outline" value={duenoData.nombre} readonly disabled />
                                                </div>
                                            </IonCol>
                                            <IonCol size="12" sizeMd="6">
                                                <div className="input-group">
                                                    <IonInput label="Correo Electrónico" labelPlacement="stacked" fill="outline" value={duenoData.email} readonly disabled />
                                                </div>
                                            </IonCol>
                                        </IonRow>
                                    )}
                                </IonGrid>
                            </IonCardContent>
                        </IonCard>

                        {/* TU SECCIÓN ORIGINAL: Información del Negocio (sin cambios) */}
                        <IonCard className="form-card">
                            <IonCardHeader className="card-header-flex">
                                <div className="card-icon">
                                    <IonIcon icon={businessOutline} />
                                </div>
                                <div>
                                    <IonCardTitle>Información del Negocio</IonCardTitle>
                                    <IonCardSubtitle>Datos básicos de su establecimiento</IonCardSubtitle>
                                </div>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonGrid className="ion-no-padding custom-form-grid">
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <div className="input-group">
                                                <IonInput label="Razón Social / Nombre *" labelPlacement="stacked" fill="outline" placeholder="Ej: Comercializadora SPA" value={formData.razonSocial} onIonInput={e => setFormData({...formData, razonSocial: e.detail.value!})} className={errors.razonSocial ? 'ion-invalid ion-touched' : ''} errorText={errors.razonSocial} />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="6">
                                            <div className="input-group">
                                                <IonInput label="RUT Empresa/Persona *" labelPlacement="stacked" fill="outline" placeholder="Ej: 76.123.456-7" value={formData.rutComercial} onIonInput={e => setFormData({...formData, rutComercial: e.detail.value!})} className={errors.rutComercial ? 'ion-invalid ion-touched' : ''} errorText={errors.rutComercial} />
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

                                        <IonCol size="12" sizeMd="8">
                                            <div className="input-group">
                                                <IonInput label="Dirección del Local *" labelPlacement="stacked" fill="outline" placeholder="Calle Principal #123" value={formData.direccion} onIonInput={e => setFormData({...formData, direccion: e.detail.value!})} className={errors.direccion ? 'ion-invalid ion-touched' : ''} errorText={errors.direccion} />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="4">
                                            <div className="input-group">
                                                <IonInput label="Rol de Avalúo (SII) *" labelPlacement="stacked" fill="outline" placeholder="Ej: 1234-5" value={formData.rolAvaluo} onIonInput={e => setFormData({...formData, rolAvaluo: e.detail.value!})} className={errors.rolAvaluo ? 'ion-invalid ion-touched' : ''} errorText={errors.rolAvaluo} />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="6">
                                            <div className="input-group">
                                                <IonInput type="number" label="Superficie (m²)" labelPlacement="stacked" fill="outline" placeholder="50" value={formData.superficie} onIonInput={e => setFormData({...formData, superficie: e.detail.value!})} />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="6">
                                            <div className="input-group">
                                                <IonInput type="tel" label="Teléfono de Contacto *" labelPlacement="stacked" fill="outline" placeholder="+56 9 1234 5678" value={formData.telefono} onIonInput={e => setFormData({...formData, telefono: e.detail.value!})} className={errors.telefono ? 'ion-invalid ion-touched' : ''} errorText={errors.telefono} />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12">
                                            <div className="input-group">
                                                <IonTextarea label="Descripción Adicional" labelPlacement="stacked" fill="outline" placeholder="Información extra para el evaluador..." rows={3} value={formData.descripcion} onIonInput={e => setFormData({...formData, descripcion: e.detail.value!})} />
                                            </div>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCardContent>
                        </IonCard>

                        {/* TU SECCIÓN ORIGINAL: Documentos Obligatorios (sin cambios) */}
                        <IonCard className="form-card">
                            <IonCardHeader>
                                <IonCardTitle>Documentos Obligatorios</IonCardTitle>
                                <IonCardSubtitle>Adjunte los documentos requeridos (PDF o imágenes, máx. 5MB c/u)</IonCardSubtitle>
                            </IonCardHeader>
                            <IonCardContent>

                                <div className="required-docs-box">
                                    <p className="docs-title">Requisitos a adjuntar:</p>
                                    <ul className="docs-list">
                                        <li><IonIcon icon={checkmarkOutline} /> Cédula de Identidad o RUT de la Empresa</li>
                                        <li><IonIcon icon={checkmarkOutline} /> Certificado de Iniciación de Actividades (SII)</li>
                                        <li><IonIcon icon={checkmarkOutline} /> Contrato de Arriendo o Certificado de Dominio</li>
                                        <li><IonIcon icon={checkmarkOutline} /> Recepción Definitiva (Emitido por DOM)</li>
                                    </ul>
                                </div>

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
                                                    <IonButton fill="clear" slot="end" color="danger" onClick={() => removeArchivo(archivo.id)}>
                                                        <IonIcon icon={closeOutline} slot="icon-only" />
                                                    </IonButton>
                                                </IonItem>
                                            ))}
                                        </IonList>
                                    </div>
                                )}
                            </IonCardContent>
                        </IonCard>

                        <div className="form-actions">
                            <IonButton fill="outline" color="medium" className="btn-action" onClick={() => history.push("/ciudadano/inicio")}>
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