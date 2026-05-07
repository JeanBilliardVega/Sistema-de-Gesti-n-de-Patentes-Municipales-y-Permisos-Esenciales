import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage, IonContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, 
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
    IonSelect, IonSelectOption, IonList, IonItem, IonLabel, IonBadge, IonText
} from "@ionic/react";
import {
    documentTextOutline, timeOutline, statsChartOutline, peopleOutline, 
    trendingUpOutline, alertCircleOutline
} from "ionicons/icons";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";

import Navbar from "../components/Navbar";
import './DashboardAdmin.scss';

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
    { name: "Aprobadas", value: 124, color: "var(--ion-color-success)" },
    { name: "En Revisión", value: 45, color: "var(--ion-color-primary)" },
    { name: "Observadas", value: 28, color: "var(--ion-color-warning)" },
    { name: "Rechazadas", value: 12, color: "var(--ion-color-danger)" },
];

const DashboardAdmin: React.FC = () => {
    const history = useHistory();
    const [filtroEstado, setFiltroEstado] = useState<string>("todas");

    const solicitudesFiltradas = filtroEstado === "todas"
        ? solicitudes
        : solicitudes.filter((s) => s.estado.toLowerCase() === filtroEstado);

    return (
        <IonPage>
            <Navbar tipoUsuario="funcionario" />

            <IonContent className="admin-dashboard-bg">
                <div className="admin-dashboard-container">

                    <div className="welcome-section ion-margin-bottom">
                        <IonText color="dark">
                            <h2 className="welcome-title">Panel de Control</h2>
                        </IonText>
                        <IonText color="medium">
                            <p className="welcome-subtitle">Indicadores y métricas del sistema de patentes municipales</p>
                        </IonText>
                    </div>

                    <IonGrid className="ion-no-padding action-grid">
                        <IonRow>
                            <IonCol size="12" sizeMd="6" sizeLg="3">
                                <IonCard className="kpi-card">
                                    <IonCardContent>
                                        <div className="kpi-header">
                                            <div>
                                                <p className="kpi-label">Total Solicitudes</p>
                                                <h3 className="kpi-value">209</h3>
                                                <p className="kpi-trend text-success">
                                                    <IonIcon icon={trendingUpOutline}/> +12% vs mes anterior
                                                </p>
                                            </div>
                                            <div className="kpi-icon icon-gray">
                                                <IonIcon icon={documentTextOutline} />
                                            </div>
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
                                                <h3 className="kpi-value text-primary">45</h3>
                                                <p className="kpi-trend text-medium">Requieren atención</p>
                                            </div>
                                            <div className="kpi-icon icon-blue">
                                                <IonIcon icon={timeOutline} />
                                            </div>
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
                                                <p className="kpi-trend text-medium">Días de respuesta</p>
                                            </div>
                                            <div className="kpi-icon icon-purple">
                                                <IonIcon icon={statsChartOutline} />
                                            </div>
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
                                                <p className="kpi-trend text-medium">Usuarios registrados</p>
                                            </div>
                                            <div className="kpi-icon icon-orange">
                                                <IonIcon icon={peopleOutline} />
                                            </div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    <IonGrid className="ion-no-padding action-grid">
                        <IonRow>
                            <IonCol size="12" sizeLg="6">
                                <IonCard className="chart-card">
                                    <IonCardHeader>
                                        <IonCardTitle>Solicitudes por Mes</IonCardTitle>
                                        <IonCardSubtitle>Últimos 7 meses</IonCardSubtitle>
                                    </IonCardHeader>
                                    <IonCardContent className="chart-container">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={datosMensuales}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                                                <Bar dataKey="solicitudes" fill="var(--ion-color-primary)" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

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
                                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}/>
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '13px', color: '#475569'}}/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    <IonCard className="list-card">
                        <IonCardHeader className="list-header-flex">
                            <div>
                                <IonCardTitle>Solicitudes Pendientes</IonCardTitle>
                                <IonCardSubtitle>Requieren revisión o acción de un funcionario</IonCardSubtitle>
                            </div>
                            
                            <div className="filter-wrapper">
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
                            </div>
                        </IonCardHeader>

                        <IonList lines="none" className="custom-list">
                            {solicitudesFiltradas.map((solicitud) => (
                                <IonItem
                                    key={solicitud.id}
                                    className="request-item"
                                    button
                                    onClick={() => history.push(`/funcionario/solicitudes/${solicitud.id}`)}
                                >
                                    <div slot="start" className="item-icon-box">
                                        <IonIcon icon={documentTextOutline} />
                                    </div>
                                    <IonLabel className="item-label">
                                        <h2><strong>{solicitud.negocio}</strong></h2>
                                        <p className="citizen-name">Ciudadano: {solicitud.ciudadano}</p>
                                        <p className="item-meta">{solicitud.id} <span className="dot-separator">•</span> {solicitud.tipo} <span className="dot-separator">•</span> {solicitud.fecha}</p>
                                    </IonLabel>

                                    <div slot="end" className="badges-container">
                                        {solicitud.prioridad === "Alta" && (
                                            <IonBadge color="danger" className="status-badge outline-danger">Prioridad Alta</IonBadge>
                                        )}
                                        <IonBadge color={solicitud.color} className="status-badge">
                                            <IonIcon icon={solicitud.icon} className="badge-icon"/>
                                            {solicitud.estado}
                                        </IonBadge>
                                        <IonButton
                                            fill="outline"
                                            size="small"
                                            className="btn-gestionar"
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                history.push(`/funcionario/solicitudes/${solicitud.id}`);
                                            }}
                                        >
                                            Gestionar
                                        </IonButton>
                                    </div>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonCard>

                </div>
            </IonContent>
        </IonPage>
    );
};

export default DashboardAdmin;