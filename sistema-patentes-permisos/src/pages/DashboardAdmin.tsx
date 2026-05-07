import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonSelect, IonSelectOption, IonList, IonItem,
    IonLabel, IonBadge, IonText
} from "@ionic/react";
import {
    logOutOutline, documentTextOutline, timeOutline, statsChartOutline,
    peopleOutline, trendingUpOutline,
    alertCircleOutline
} from "ionicons/icons";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import './DashboardAdmin.scss';

// Datos simulados (Mock data)
const solicitudes = [
    { id: "SOL-2026-015", negocio: "Peluquería Stylo", ciudadano: "María González", tipo: "Patente Profesional", fecha: "15/04/2026", estado: "Revisión", color: "primary", icon: timeOutline, prioridad: "Normal" },
    { id: "SOL-2026-014", negocio: "Minimarket Express", ciudadano: "Carlos Ruiz", tipo: "Patente Comercial", fecha: "14/04/2026", estado: "Revisión", color: "primary", icon: timeOutline, prioridad: "Alta" },
    { id: "SOL-2026-013", negocio: "Restaurant La Buena Mesa", ciudadano: "Ana Martínez", tipo: "Patente de Alcoholes", fecha: "13/04/2026", estado: "Observada", color: "warning", icon: alertCircleOutline, prioridad: "Alta" },
];

const datosMensuales = [
    { mes: "Oct", solicitudes: 45 }, { mes: "Nov", solicitudes: 52 },
    { mes: "Dic", solicitudes: 38 }, { mes: "Ene", solicitudes: 61 },
    { mes: "Feb", solicitudes: 55 }, { mes: "Mar", solicitudes: 67 },
    { mes: "Abr", solicitudes: 43 },
];

const datosEstados = [
    { name: "Aprobadas", value: 124, color: "#10b981" },
    { name: "En Revisión", value: 45, color: "#3b82f6" },
    { name: "Observadas", value: 28, color: "#f59e0b" },
    { name: "Rechazadas", value: 12, color: "#ef4444" },
];

const DashboardAdmin: React.FC = () => {
    const history = useHistory();
    const [filtroEstado, setFiltroEstado] = useState<string>("todas");

    const solicitudesFiltradas = filtroEstado === "todas"
        ? solicitudes
        : solicitudes.filter((s) => s.estado.toLowerCase() === filtroEstado);

    return (
        <IonPage>
            {/* Barra de navegación superior - Uso de color gris oscuro */}
            <IonHeader>
                <IonToolbar color="dark">
                    <IonTitle>Panel Administrador</IonTitle>
                    <IonButtons slot="end">
                        <IonButton className="nav-btn">Dashboard</IonButton>
                        <IonButton className="nav-btn">Solicitudes</IonButton>
                        <IonButton className="nav-btn">Reportes</IonButton>
                        <IonButton onClick={() => history.push("/ingresar")}>
                            <IonIcon slot="start" icon={logOutOutline} />
                            Salir
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding admin-dashboard-bg">
                <div className="welcome-section ion-margin-bottom">
                    <IonText color="dark"><h2>Panel de Control</h2></IonText>
                    <IonText color="medium"><p>Indicadores y métricas del sistema de patentes municipales</p></IonText>
                </div>

                {/* Primera fila: 4 tarjetas de indicadores KPI */}
                <IonGrid className="ion-no-padding ion-margin-bottom">
                    <IonRow>
                        <IonCol size="12" sizeMd="6" sizeLg="3">
                            <IonCard className="kpi-card">
                                <IonCardContent>
                                    <div className="kpi-header">
                                        <div>
                                            <p className="kpi-label">Total Solicitudes</p>
                                            <h3 className="kpi-value">209</h3>
                                            <p className="kpi-trend success"><IonIcon icon={trendingUpOutline}/> +12% vs mes anterior</p>
                                        </div>
                                        <div className="kpi-icon icon-gray"><IonIcon icon={documentTextOutline} /></div>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>

                        <IonCol size="12" sizeMd="6" sizeLg="3">
                            <IonCard className="kpi-card">
                                <IonCardContent>
                                    <div className="kpi-header">
                                        <div>
                                            <p className="kpi-label">En Revisión</p>
                                            <h3 className="kpi-value text-blue">45</h3>
                                            <p className="kpi-trend">Requieren atención</p>
                                        </div>
                                        <div className="kpi-icon icon-blue"><IonIcon icon={timeOutline} /></div>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>

                        <IonCol size="12" sizeMd="6" sizeLg="3">
                            <IonCard className="kpi-card">
                                <IonCardContent>
                                    <div className="kpi-header">
                                        <div>
                                            <p className="kpi-label">Tiempo Promedio</p>
                                            <h3 className="kpi-value">7.5</h3>
                                            <p className="kpi-trend">días de respuesta</p>
                                        </div>
                                        <div className="kpi-icon icon-purple"><IonIcon icon={statsChartOutline} /></div>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>

                        <IonCol size="12" sizeMd="6" sizeLg="3">
                            <IonCard className="kpi-card">
                                <IonCardContent>
                                    <div className="kpi-header">
                                        <div>
                                            <p className="kpi-label">Ciudadanos</p>
                                            <h3 className="kpi-value">156</h3>
                                            <p className="kpi-trend">Usuarios registrados</p>
                                        </div>
                                        <div className="kpi-icon icon-orange"><IonIcon icon={peopleOutline} /></div>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                {/* Segunda fila: Dos gráficos */}
                <IonGrid className="ion-no-padding ion-margin-bottom">
                    <IonRow>
                        {/* Gráfico de barras */}
                        <IonCol size="12" sizeLg="6">
                            <IonCard className="chart-card">
                                <IonCardHeader>
                                    <IonCardTitle>Solicitudes por Mes</IonCardTitle>
                                    <IonCardSubtitle>Últimos 7 meses</IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent className="chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={datosMensuales}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="mes" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip cursor={{fill: '#f4f7f9'}} />
                                            <Bar dataKey="solicitudes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>

                        {/* Gráfico circular */}
                        <IonCol size="12" sizeLg="6">
                            <IonCard className="chart-card">
                                <IonCardHeader>
                                    <IonCardTitle>Distribución por Estado</IonCardTitle>
                                    <IonCardSubtitle>Total de solicitudes actuales</IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent className="chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={datosEstados} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                                                {datosEstados.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                {/* Tercera fila: Lista de solicitudes pendientes */}
                <IonCard className="list-card">
                    <IonCardHeader className="list-header-flex">
                        <div>
                            <IonCardTitle>Solicitudes Pendientes</IonCardTitle>
                            <IonCardSubtitle>Requieren revisión o acción</IonCardSubtitle>
                        </div>
                        <IonSelect
                            interface="popover"
                            value={filtroEstado}
                            onIonChange={e => setFiltroEstado(e.detail.value)}
                            className="status-filter"
                        >
                            <IonSelectOption value="todas">Todas</IonSelectOption>
                            <IonSelectOption value="revisión">En Revisión</IonSelectOption>
                            <IonSelectOption value="observada">Observadas</IonSelectOption>
                        </IonSelect>
                    </IonCardHeader>

                    <IonList>
                        {solicitudesFiltradas.map((solicitud) => (
                            <IonItem
                                key={solicitud.id}
                                className="request-item"
                                button
                                onClick={() => history.push(`/solicitud/${solicitud.id}`)}
                            >
                                <IonIcon icon={documentTextOutline} slot="start" className="item-icon" />
                                <IonLabel>
                                    <h2><strong>{solicitud.negocio}</strong></h2>
                                    <p>Ciudadano: {solicitud.ciudadano}</p>
                                    <p className="item-meta">{solicitud.id} • {solicitud.tipo} • {solicitud.fecha}</p>
                                </IonLabel>

                                <div slot="end" className="badges-container">
                                    {solicitud.prioridad === "Alta" && (
                                        <IonBadge color="danger" className="status-badge priority">Prioridad Alta</IonBadge>
                                    )}
                                    <IonBadge color={solicitud.color} className="status-badge">
                                        <IonIcon icon={solicitud.icon} className="badge-icon"/>
                                        {solicitud.estado}
                                    </IonBadge>
                                    <IonButton
                                        fill="outline"
                                        size="small"
                                        className="btn-gestionar"
                                        onClick={(e) => {
                                            e.stopPropagation(); {/* Detiene la propagación del evento (Event bubbling) para evitar la doble navegación */}
                                            history.push(`/solicitud/${solicitud.id}`);
                                        }}
                                    >
                                        Gestionar
                                    </IonButton>
                                </div>
                            </IonItem>
                        ))}
                    </IonList>
                </IonCard>

            </IonContent>
        </IonPage>
    );
};

export default DashboardAdmin;