import React, { useState } from 'react';
import {
    IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonGrid, IonRow, IonCol,
    IonInput, IonSelect, IonSelectOption, IonButton, IonIcon,
    IonCheckbox, IonText, IonNote
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Register.scss';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

const Register: React.FC = () => {
    const history = useHistory();
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        nombre: "",
        rut: "",
        email: "",
        region: "Valparaíso", // Valor por defecto corregido
        comuna: "Santo Domingo",
        password: "",
        confirmPassword: "",
        acceptTerms: false
    });

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

    /**
     * LÓGICA DE VALIDACIÓN DE RUT (Módulo 11 Oficial)
     * Soporta formatos: 12345678-9, 12.345.678-9, 123456789
     */
    const validateRUT = (rut: string): boolean => {
        const input = rut.trim();
        if (!input) return false;

        // Si tiene guion, verificar que esté bien puesto
        if (input.includes("-")) {
            const partes = input.split("-");
            if (partes.length !== 2 || partes[1].length !== 1) return false;
        }

        const cleaned = input.replace(/[.-]/g, "").toUpperCase();
        if (!/^[0-9K]{7,9}$/.test(cleaned)) return false;

        const cuerpo = cleaned.slice(0, -1);
        const dvIngresado = cleaned.slice(-1);

        let suma = 0;
        let multiplo = 2;
        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += multiplo * parseInt(cuerpo.charAt(i));
            multiplo = multiplo < 7 ? multiplo + 1 : 2;
        }
        const dvEsperadoDecimal = 11 - (suma % 11);
        let dvCalculado = dvEsperadoDecimal === 11 ? "0" : dvEsperadoDecimal === 10 ? "K" : dvEsperadoDecimal.toString();

        return dvIngresado === dvCalculado;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        // Validaciones mejoradas
        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
        if (!validateRUT(formData.rut)) newErrors.rut = "RUT inválido (ej: 12.345.678-9)";
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

        // REDIRECCIÓN CORREGIDA A TU RUTA REAL (/ingresar)
        console.log("Datos de registro:", formData);
        history.push("/ingresar");
    };

    return (
        <IonPage>
            <IonContent fullscreen className='register-background'>
                <div className='register-container'>
                    <IonCard className='register-card'>
                        <IonCardHeader className='register-card-header'>
                            <img src="/logo-municipalidad.webp" alt="Logo Municipalidad" className='logo-municipal' />
                            <IonCardTitle className="title-card">Registrar cuenta</IonCardTitle>
                            <IonCardSubtitle>Crea tu cuenta para el sistema municipal</IonCardSubtitle>
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
                                                    value={formData.nombre}
                                                    onIonInput={(e) => {
                                                        setFormData({ ...formData, nombre: e.target.value as string });
                                                        setErrors({...errors, nombre: ""});
                                                    }}
                                                    className={`input-gob ${errors.nombre ? 'ion-invalid ion-touched' : ''}`}
                                                    errorText={errors.nombre}
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
                                                    onIonInput={(e) => {
                                                        setFormData({ ...formData, rut: e.target.value as string });
                                                        setErrors({...errors, rut: ""});
                                                    }}
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
                                                    onIonInput={(e) => {
                                                        setFormData({ ...formData, email: e.target.value as string });
                                                        setErrors({...errors, email: ""});
                                                    }}
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
                                                    onIonInput={(e) => {
                                                        setFormData({ ...formData, password: e.target.value as string });
                                                        setErrors({...errors, password: ""});
                                                    }}
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
                                                    onIonInput={(e) => {
                                                        setFormData({ ...formData, confirmPassword: e.target.value as string });
                                                        setErrors({...errors, confirmPassword: ""});
                                                    }}
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
                                        <p style={{fontSize: '0.85rem', margin: 0}}>
                                            Acepto los <a href="https://www.portaltransparencia.cl/PortalPdT/directorio-de-organismos-regulados/?org=MU309" target="_blank" rel="noopener noreferrer" className="terms-link">términos y condiciones</a>.
                                        </p>
                                    </IonCheckbox>
                                    {errors.acceptTerms && <IonText color="danger" className="err-text" style={{fontSize: '0.75rem'}}>{errors.acceptTerms}</IonText>}
                                </div>

                                <IonButton type="submit" expand="block" className="btn-clave-unica ion-margin-top">
                                    Registrar mi cuenta
                                </IonButton>

                                <div className="form-links ion-text-center ion-margin-top">
                                    <small>¿Ya tienes una cuenta? </small>
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        history.push("/ingresar");
                                    }}>
                                        Inicia sesión aquí
                                    </a>
                                </div>
                            </form>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Register;