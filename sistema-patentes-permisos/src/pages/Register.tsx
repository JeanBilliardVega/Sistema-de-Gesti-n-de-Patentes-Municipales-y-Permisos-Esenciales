import React, {useState} from 'react';
import {IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonGrid, IonRow, IonCol, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton, IonIcon, IonCheckbox, IonText} from '@ionic/react';
import { useHistory } from 'react-router';
import './Register.scss';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

const Register: React.FC = () => {
    const regionesChile = [
        "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", 
        "Valparaíso", "Metropolitana de Santiago", "O'Higgins", "Maule", 
        "Ñuble", "Biobío", "La Araucanía", "Los Ríos", "Los Lagos", 
        "Aysén", "Magallanes"
    ];

    const comunasPorRegion: Record<string, string[]> = {
        "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
        "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte"],
        "Antofagasta": ["Antofagasta", "Calama", "Tocopilla"],
        "Atacama": ["Copiapó", "Vallenar", "Caldera"],
        "Coquimbo": ["La Serena", "Coquimbo", "Illapel"],
        "Valparaíso": ["Santo Domingo", "San Antonio", "Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón", "Quillota", "Los Andes", "San Felipe"],
        "Metropolitana de Santiago": ["Santiago", "Providencia", "Las Condes", "Maipú", "Ñuñoa", "La Florida", "Puente Alto"],
        "O'Higgins": ["Rancagua", "Machalí", "Pichilemu"],
        "Maule": ["Talca", "Curicó", "Linares"],
        "Ñuble": ["Chillán", "San Carlos"],
        "Biobío": ["Concepción", "Talcahuano", "Los Ángeles"],
        "La Araucanía": ["Temuco", "Pucón", "Villarrica"],
        "Los Ríos": ["Valdivia", "La Unión"],
        "Los Lagos": ["Puerto Montt", "Osorno", "Castro"],
        "Aysén": ["Coyhaique", "Puerto Aysén"],
        "Magallanes": ["Punta Arenas", "Puerto Natales"]
    };
    const history = useHistory();
    const [formData, setFormData] = useState({
        nombreUsuario: "",
        rut: "",
        email: "",
        region: "Región de Valparaíso", 
        comuna: "Santo Domingo",
        password: "",
        confirmPassword: "",
        acceptTerms: false
    })
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validarRut = (rut: string) => {
        const cleaned = rut.replace(/[.-]/g, "");
        if (cleaned.length < 8) return false;
        return /^\d{7,8}[0-9kK]$/.test(cleaned);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.nombreUsuario) newErrors.nombreUsuario = "El nombre es obligatorio";
        if (!validarRut(formData.rut)) newErrors.rut = "RUT inválido";
        if (!formData.email.includes("@")) newErrors.email = "Email inválido";
        if (!formData.region) newErrors.region = "Seleccione región";
        if (!formData.comuna) newErrors.comuna = "Seleccione comuna";
        if (formData.password.length < 8) newErrors.password = "Mínimo 8 caracteres";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las claves no coinciden";
        if (!formData.acceptTerms) newErrors.acceptTerms = "Debe aceptar los términos";

        if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
        }

        history.push("/login");
    };

    return (
        <IonPage>
            <IonContent fullscreen className='register-background'>
                
                <div className='register-container'>
                    <IonCard className='register-card'>
                        <IonCardHeader className='register-card-header'>
                            <img src="/logo-municipalidad.webp" alt="Logo Municipalidad de Santo Domingo" className='logo-municipal' />
                            <IonCardTitle className="title-card">Registrar cuenta</IonCardTitle>
                            <IonCardSubtitle>Crea tu cuenta para usar el sistema de patentes y permisos municipales</IonCardSubtitle>
                        </IonCardHeader>

                        <IonCardContent>
                            <form onSubmit={handleSubmit}>
                                <IonGrid className='no-padding'>

                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <div className='form-group'>
                                                <IonInput
                                                    label="Nombre completo"
                                                    labelPlacement='stacked'
                                                    fill='outline'
                                                    value={formData.nombreUsuario}
                                                    onIonInput={(e) => setFormData({ ...formData, nombreUsuario: e.target.value as string })}
                                                    className={`input-gob ${errors.nombreUsuario ? 'ion-invalid ion-touched' : ''}`}
                                                    errorText={errors.nombreUsuario}
                                                />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="6">
                                            <div className='form-group'>
                                                <IonInput
                                                    label="RUT *"
                                                    labelPlacement="stacked"
                                                    fill='outline'
                                                    placeholder='12.345.678-9'
                                                    value={formData.rut}
                                                    onIonInput={(e) => setFormData({ ...formData, rut: e.target.value as string })}
                                                    className={`input-gob ${errors.rut ? 'ion-invalid ion-touched' : ''}`}
                                                    errorText={errors.rut}
                                                />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12">
                                            <div className="form-group">
                                                <IonInput
                                                    label="Correo Electrónico *"
                                                    labelPlacement="stacked"
                                                    fill="outline"
                                                    type="email"
                                                    placeholder="correo@ejemplo.cl"
                                                    value={formData.email}
                                                    onIonInput={(e) => setFormData({ ...formData, email: e.target.value as string })}
                                                    className={`input-gob ${errors.email ? 'ion-invalid ion-touched' : ''}`}
                                                    errorText={errors.email}
                                                />
                                            </div>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="6">
                                            <div className="form-group">
                                                <IonSelect 
                                                    label="Región *"
                                                    labelPlacement="stacked"
                                                    fill="outline"
                                                    value={formData.region}
                                                    placeholder="Seleccione región"
                                                    onIonChange={e => setFormData({...formData, region: e.detail.value, comuna: ""})}
                                                    className="select-gob"
                                                >
                                                  {regionesChile.map(r => <IonSelectOption key={r} value={r}>{r}</IonSelectOption>)}
                                                </IonSelect>
                                            </div>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="6">
                                            <div className="form-group">
                                                <IonSelect 
                                                    label="Comuna *"
                                                    labelPlacement="stacked"
                                                    fill="outline"
                                                    value={formData.comuna}
                                                    placeholder="Seleccione comuna"
                                                    disabled={!formData.region}
                                                    onIonChange={e => setFormData({...formData, comuna: e.detail.value})}
                                                    className="select-gob"
                                                >
                                                  {(comunasPorRegion[formData.region] || []).map(c => (
                                                      <IonSelectOption key={c} value={c}>{c}</IonSelectOption>
                                                  ))}
                                                </IonSelect>
                                            </div>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="6">
                                            <div className='form-group'>
                                                <IonInput
                                                    label="Contraseña *"
                                                    labelPlacement="stacked"
                                                    fill='outline'
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onIonInput={(e) => setFormData({ ...formData, password: e.target.value as string })}
                                                    className={`input-gob ${errors.password ? 'ion-invalid ion-touched' : ''}`}
                                                    errorText={errors.password}
                                                >
                                                    <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword)}>
                                                        <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} slot="icon-only" color="medium" />
                                                    </IonButton>
                                                </IonInput>
                                            </div>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="6">
                                            <div className='form-group'>
                                                <IonInput
                                                    label="Confirmar Contraseña *"
                                                    labelPlacement="stacked"
                                                    fill='outline'
                                                    type="password"
                                                    value={formData.confirmPassword}
                                                    onIonInput={(e) => setFormData({ ...formData, confirmPassword: e.target.value as string })}
                                                    className={`input-gob ${errors.confirmPassword ? 'ion-invalid ion-touched' : ''}`}
                                                    errorText={errors.confirmPassword}
                                                />
                                            </div>
                                        </IonCol>
                                    </IonRow>

                                </IonGrid>

                                <div className="terms-container">
                                    <IonCheckbox 
                                        justify="start" 
                                        labelPlacement="end"
                                        checked={formData.acceptTerms}
                                        onIonChange={e => setFormData({...formData, acceptTerms: e.detail.checked})}
                                        className="checkbox-santodomingo"
                                    >
                                        <p>
                                            Acepto los <a href="https://www.portaltransparencia.cl/PortalPdT/directorio-de-organismos-regulados/?org=MU309" target="_blank" rel="noopener noreferrer" className="terms-link">términos y condiciones</a> y las políticas de privacidad municipal.
                                        </p>
                                    </IonCheckbox>
                                    {errors.acceptTerms && <IonText color="danger" className="err-text">{errors.acceptTerms}</IonText>}
                                </div>

                                <IonButton type="submit" expand="block" className="btn-clave-unica">
                                    Registrar mi cuenta
                                </IonButton>

                                <div className="form-links">
                                    <small>¿Ya tienes una cuenta? </small>
                                    <a href="#" onClick={(e) => { e.preventDefault(); history.push("/ingresar"); }}>
                                        Inicia sesión aquí
                                    </a>
                                </div>
                            </form>
                        </IonCardContent>
                    </IonCard>
                </div>

            </IonContent>
        </IonPage>
    )
}

export default Register;