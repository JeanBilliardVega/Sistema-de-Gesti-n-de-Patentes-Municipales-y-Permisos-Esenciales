import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage, IonContent, IonButton, IonIcon, IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonSelect, IonSelectOption, IonList, IonItem, IonLabel, IonBadge, IonText, IonSpinner
} from "@ionic/react";
import {
    documentTextOutline, timeOutline, peopleOutline,
    trendingUpOutline, alertCircleOutline, checkmarkCircleOutline, closeCircleOutline
} from "ionicons/icons";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";

import Navbar from "../components/Navbar";
import './DashboardAdmin.scss';

import { SolicitudRaw, SolicitudFormateada, DatoEstado, DatoMensual, MesData} from '../types';

// Genera ID visual tipo SOL-2026-001
const formatearIdVisual = (idNumerico: number, fechaCreacion: string) => {
    const año = new Date(fechaCreacion).getFullYear();
    return `SOL-${año}-${String(idNumerico).padStart(3, '0')}`;
};

const DashboardAdmin: React.FC = () => {
    const history = useHistory();
    const [filtroEstado, setFiltroEstado] = useState<string>("todas");
    const [solicitudes, setSolicitudes] = useState<SolicitudFormateada[]>([]);
    const [loading, setLoading] = useState(true);

    // Métricas dinámicas calculadas a partir de los datos reales
    const [metricas, setMetricas] = useState({ total: 0, enRevision: 0, ciudadanosUnicos: 0 });
    const [datosEstados, setDatosEstados] = useState<DatoEstado[]>([]);
    const [datosMensuales, setDatosMensuales] = useState<DatoMensual[]>([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const token = localStorage.getItem('token');
                const respuesta = await fetch('http://localhost:3000/api/funcionario/todas_solicitudes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (respuesta.ok) {
                    const datos = await respuesta.json();

                    // 1. Formatear solicitudes para la lista
                    const solicitudesFormateadas: SolicitudFormateada[] = datos.map((sol: SolicitudRaw) => {
                        let color = "primary";
                        let icon = timeOutline;
                        const estadoTexto = sol.estado || "pendiente";

                        if (estadoTexto === 'aprobada') { color = 'success'; icon = checkmarkCircleOutline; }
                        else if (estadoTexto === 'observada') { color = 'warning'; icon = alertCircleOutline; }
                        else if (estadoTexto === 'rechazada') { color = 'danger'; icon = closeCircleOutline; }
                        else if (estadoTexto === 'revisión') { color = 'tertiary'; icon = alertCircleOutline; }

                        return {
                            idReal: sol.id,
                            idVisual: formatearIdVisual(sol.id, sol.fecha_creacion),
                            negocio: sol.razon_social,
                            ciudadano: sol.ciudadano_nombre,
                            rutCiudadano: sol.ciudadano_rut,
                            tipo: sol.tipo_patente,
                            fecha: new Date(sol.fecha_creacion).toLocaleDateString('es-CL'),
                            estado: estadoTexto,
                            estadoCapitalizado: estadoTexto.charAt(0).toUpperCase() + estadoTexto.slice(1),
                            color,
                            icon
                        };
                    });

                    setSolicitudes(solicitudesFormateadas);

                    // 2. Calcular Métricas dinámicas
                    const total = solicitudesFormateadas.length;
                    const enRevision = solicitudesFormateadas.filter((s: SolicitudFormateada) => s.estado === 'pendiente' || s.estado === 'revisión').length;
                    const ciudadanosUnicos = new Set(solicitudesFormateadas.map((s: SolicitudFormateada) => s.rutCiudadano)).size;

                    setMetricas({ total, enRevision, ciudadanosUnicos });

                    // 3. Calcular datos dinámicos para el Gráfico Circular (PieChart)
                    const conteoEstados = { aprobada: 0, revisión: 0, pendiente: 0, observada: 0, rechazada: 0 };
                    solicitudesFormateadas.forEach((s: SolicitudFormateada) => {
                        const est = s.estado as keyof typeof conteoEstados;
                        if (conteoEstados[est] !== undefined) conteoEstados[est]++;
                    });

                    setDatosEstados([
                        { name: "Aprobadas", value: conteoEstados.aprobada, color: "var(--ion-color-success)" },
                        { name: "Pendientes/Revisión", value: conteoEstados.pendiente + conteoEstados.revisión, color: "var(--ion-color-primary)" },
                        { name: "Observadas", value: conteoEstados.observada, color: "var(--ion-color-warning)" },
                        { name: "Rechazadas", value: conteoEstados.rechazada, color: "var(--ion-color-danger)" },
                    ].filter(d => d.value > 0)); // Solo mostrar los que tienen más de 0

                    const mesesAbreviados = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
                    const ultimosMeses: MesData[] = [];
                    const fechaActual = new Date();

                    for (let i = 6; i >= 0; i--) {
                        const d = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - i, 1);
                        ultimosMeses.push({
                            mes: mesesAbreviados[d.getMonth()],
                            year: d.getFullYear(),
                            mesNum: d.getMonth(),
                            solicitudes: 0 // 初始值设为 0
                        });
                    }

                    datos.forEach((sol: SolicitudRaw) => {
                        const fechaSol = new Date(sol.fecha_creacion);
                        const mesSol = fechaSol.getMonth();
                        const yearSol = fechaSol.getFullYear();

                        const index = ultimosMeses.findIndex(m => m.mesNum === mesSol && m.year === yearSol);
                        if (index !== -1) {
                            ultimosMeses[index].solicitudes++;
                        }
                    });

                    setDatosMensuales(ultimosMeses);

                }
            } catch (error) {
                console.error("Error al cargar solicitudes admin:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    const solicitudesFiltradas = filtroEstado === "todas"
        ? solicitudes
        : solicitudes.filter((s) => s.estado === filtroEstado || (filtroEstado === 'revisión' && s.estado === 'pendiente'));

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
                            <p className="welcome-subtitle">Indicadores y métricas reales del sistema</p>
                        </IonText>
                    </div>

                    {loading ? (
                        <div className="ion-text-center ion-padding"><IonSpinner name="crescent" /></div>
                    ) : (
                        <>
                            {/* Tarjetas de KPI */}
                            <IonGrid className="ion-no-padding action-grid">
                                <IonRow>
                                    <IonCol size="12" sizeMd="6" sizeLg="4">
                                        <IonCard className="kpi-card">
                                            <IonCardContent>
                                                <div className="kpi-header">
                                                    <div>
                                                        <p className="kpi-label">Total Solicitudes</p>
                                                        <h3 className="kpi-value">{metricas.total}</h3>
                                                        <p className="kpi-trend text-success"><IonIcon icon={trendingUpOutline}/> Registradas</p>
                                                    </div>
                                                    <div className="kpi-icon icon-gray"><IonIcon icon={documentTextOutline} /></div>
                                                </div>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>

                                    <IonCol size="12" sizeMd="6" sizeLg="4">
                                        <IonCard className="kpi-card">
                                            <IonCardContent>
                                                <div className="kpi-header">
                                                    <div>
                                                        <p className="kpi-label">Pendientes / Revisión</p>
                                                        <h3 className="kpi-value text-primary">{metricas.enRevision}</h3>
                                                        <p className="kpi-trend text-medium">Requieren atención</p>
                                                    </div>
                                                    <div className="kpi-icon icon-blue"><IonIcon icon={timeOutline} /></div>
                                                </div>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>

                                    <IonCol size="12" sizeMd="12" sizeLg="4">
                                        <IonCard className="kpi-card">
                                            <IonCardContent>
                                                <div className="kpi-header">
                                                    <div>
                                                        <p className="kpi-label">Ciudadanos Activos</p>
                                                        <h3 className="kpi-value">{metricas.ciudadanosUnicos}</h3>
                                                        <p className="kpi-trend text-medium">Han hecho trámites</p>
                                                    </div>
                                                    <div className="kpi-icon icon-orange"><IonIcon icon={peopleOutline} /></div>
                                                </div>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>

                            {/* Gráficos */}
                            <IonGrid className="ion-no-padding action-grid">
                                <IonRow>
                                    <IonCol size="12" sizeLg="6">
                                        <IonCard className="chart-card">
                                            <IonCardHeader>
                                                <IonCardTitle>Solicitudes por Mes</IonCardTitle>
                                                <IonCardSubtitle>Tendencia histórica</IonCardSubtitle>
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
                                                <IonCardTitle>Estado Actual</IonCardTitle>
                                                <IonCardSubtitle>Distribución de trámites (En tiempo real)</IonCardSubtitle>
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

                            {/* Lista Real de Solicitudes */}
                            <IonCard className="list-card">
                                <IonCardHeader className="list-header-flex">
                                    <div>
                                        <IonCardTitle>Gestión de Solicitudes</IonCardTitle>
                                        <IonCardSubtitle>Revisa y actualiza los trámites ingresados</IonCardSubtitle>
                                    </div>
                                    <div className="filter-wrapper">
                                        <IonSelect
                                            interface="popover"
                                            value={filtroEstado}
                                            onIonChange={e => setFiltroEstado(e.detail.value)}
                                            className="status-filter"
                                        >
                                            <IonSelectOption value="todas">Todas</IonSelectOption>
                                            <IonSelectOption value="pendiente">Pendientes</IonSelectOption>
                                            <IonSelectOption value="revisión">En Revisión</IonSelectOption>
                                            <IonSelectOption value="observada">Observadas</IonSelectOption>
                                            <IonSelectOption value="aprobada">Aprobadas</IonSelectOption>
                                        </IonSelect>
                                    </div>
                                </IonCardHeader>

                                <IonList lines="none" className="custom-list">
                                    {solicitudesFiltradas.length > 0 ? (
                                        solicitudesFiltradas.map((solicitud) => (
                                            <IonItem
                                                key={solicitud.idReal}
                                                className="request-item"
                                                button
                                                onClick={() => history.push(`/funcionario/solicitudes/${solicitud.idReal}`)}
                                            >
                                                <div slot="start" className="item-icon-box">
                                                    <IonIcon icon={documentTextOutline} />
                                                </div>
                                                <IonLabel className="item-label">
                                                    <h2><strong>{solicitud.negocio}</strong></h2>
                                                    <p className="citizen-name">Ciudadano: {solicitud.ciudadano} ({solicitud.rutCiudadano})</p>
                                                    <p className="item-meta">{solicitud.idVisual} <span className="dot-separator">•</span> {solicitud.tipo} <span className="dot-separator">•</span> {solicitud.fecha}</p>
                                                </IonLabel>

                                                <div slot="end" className="badges-container">
                                                    <IonBadge color={solicitud.color} className="status-badge">
                                                        <IonIcon icon={solicitud.icon} className="badge-icon"/>
                                                        {solicitud.estadoCapitalizado}
                                                    </IonBadge>
                                                    <IonButton
                                                        fill="outline"
                                                        size="small"
                                                        className="btn-gestionar"
                                                        color="primary"
                                                    >
                                                        Gestionar
                                                    </IonButton>
                                                    <IonButton
                                                        fill="outline"
                                                        size="small"
                                                        color="danger"
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            if (!window.confirm('¿Estás seguro de eliminar esta solicitud?')) return;
                                                            const token = localStorage.getItem('token');
                                                            const res = await fetch(`http://localhost:3000/api/funcionario/solicitud/${solicitud.idReal}`, {
                                                                method: 'DELETE',
                                                                headers: { 'Authorization': `Bearer ${token}` }
                                                            });
                                                            if (res.ok) {
                                                                setSolicitudes(prev => prev.filter(s => s.idReal !== solicitud.idReal));
                                                            } else {
                                                                alert('Error al eliminar la solicitud');
                                                            }
                                                        }}
                                                    >
                                                        Eliminar
                                                    </IonButton>
                                                </div>
                                            </IonItem>
                                        ))
                                    ) : (
                                        <div className="ion-text-center ion-padding">
                                            <p>No hay solicitudes que coincidan con el filtro.</p>
                                        </div>
                                    )}
                                </IonList>
                            </IonCard>
                        </>
                    )}

                </div>
            </IonContent>
        </IonPage>
    );
};

export default DashboardAdmin;