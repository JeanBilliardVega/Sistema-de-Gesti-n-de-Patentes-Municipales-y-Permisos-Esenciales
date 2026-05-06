import { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonInput, IonButton, IonIcon} from "@ionic/react";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import './Login.scss';

const Login: React.FC = () => {
    const history = useHistory();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ rut: "", password: "" });
    const [errors, setErrors] = useState<{ rut?: string; password?: string }>({});

    const validateRUT = (rut: string) => {
        const cleaned = rut.replace(/[.-]/g, "");
        if (cleaned.length < 8) return false;
        return /^\d{7,8}[0-9kK]$/.test(cleaned);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { rut?: string; password?: string } = {};

        if (!formData.rut) {
        newErrors.rut = "El RUT es obligatorio";
        } else if (!validateRUT(formData.rut)) {
        newErrors.rut = "RUT inválido";
        }

        if (!formData.password) {
        newErrors.password = "La contraseña es obligatoria";
        } else if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
        }

        if (formData.rut.includes("admin")) {
        history.push("/admin");
        } else {
        history.push("/home");
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen className="login-background">
            
                <div className="login-container">
                    {/*Tarjeta para iniciar sesion */}
                    <IonCard className="login-card">
                        <IonCardHeader className="login-card-header">
                            <img src="/logo-municipalidad.webp" alt="Logo Municipalidad de Santo Domingo" className="logo-municipal" />
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
                                    <a href="#" onClick={(e) => { e.preventDefault(); history.push("/registrar"); }}>
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