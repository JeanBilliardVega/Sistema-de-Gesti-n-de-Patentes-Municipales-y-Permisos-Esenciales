import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonInput, IonButton, IonIcon
} from "@ionic/react";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import './Login.scss';

const Login: React.FC = () => {
    const history = useHistory();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ rut: "", password: "" });
    const [errors, setErrors] = useState<{ rut?: string; password?: string }>({});

    /**
     * VALIDACIÓN DE RUT INTEGRAL
     */
    const validateRUT = (rut: string): boolean => {
        const input = rut.trim();
        if (!input) return false;

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
        const newErrors: { rut?: string; password?: string } = {};

        const rutInput = formData.rut.trim().toLowerCase();
        const esAdmin = rutInput === "admin" || rutInput.includes("admin");

        if (!formData.rut) {
            newErrors.rut = "El RUT es obligatorio";
        } else if (!esAdmin && !validateRUT(formData.rut)) {
            newErrors.rut = "RUT inválido (ej: 12.345.678-9)";
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es obligatoria";
        } else if (formData.password.length < 8) { // ACTUALIZADO: Ahora pide 8 caracteres igual que el registro
            newErrors.password = "La contraseña debe tener al menos 8 caracteres";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (esAdmin) {
            localStorage.setItem('rol', 'admin');
            history.push("/dashAdmin");
            history.push("/funcionario/inicio");
        } else {
            localStorage.setItem('rol', 'ciudadano');
            history.push("/dashCiudadano");
            history.push("/ciudadano/inicio");
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen className="login-background">
                <div className="login-container">
                    <IonCard className="login-card">
                        <IonCardHeader className="login-card-header">
                            <img src="logo-municipalidad.webp" alt="Logo Municipalidad de Santo Domingo" className="logo-municipal" />
                            <IonCardTitle className="title-card">Iniciar Sesión</IonCardTitle>
                            <IonCardSubtitle>Sistema de patentes y permisos municipales</IonCardSubtitle>
                        </IonCardHeader>

                        <IonCardContent className="login-card-content">
                            <form onSubmit={handleSubmit} className="form-login">
                                <div className="form-group">
                                    <IonInput
                                        label="RUT"
                                        labelPlacement="stacked"
                                        fill="outline"
                                        placeholder="Ej: 12.345.678-9"
                                        value={formData.rut}
                                        onIonInput={(e) => {
                                            setFormData({ ...formData, rut: e.target.value as string });
                                            setErrors({ ...errors, rut: undefined });
                                        }}
                                        className={`input-gob ${errors.rut ? 'ion-invalid ion-touched' : ''}`}
                                        errorText={errors.rut}
                                    />
                                </div>

                                <div className="form-group">
                                    <IonInput
                                        label="Contraseña"
                                        labelPlacement="stacked"
                                        fill="outline"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onIonInput={(e) => {
                                            setFormData({ ...formData, password: e.target.value as string });
                                            setErrors({ ...errors, password: undefined });
                                        }}
                                        className={`input-gob ${errors.password ? 'ion-invalid ion-touched' : ''}`}
                                        errorText={errors.password}
                                    >
                                        <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword)}>
                                            <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} slot="icon-only" color="medium" />
                                        </IonButton>
                                    </IonInput>
                                </div>

                                <IonButton type="submit" expand="block" className="btn-clave-unica ion-margin-top">
                                    Iniciar sesión
                                </IonButton>

                                <div className="form-links ion-text-center ion-margin-top">
                                    <small>¿No estás registrado? </small>
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        history.push("/registrar");
                                    }}>
                                        Haz click aquí
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

export default Login;