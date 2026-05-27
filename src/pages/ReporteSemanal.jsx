import { useEffect, useState } from "react";
import api from "../services/api";
import TablaReporte from "../components/TablaReporte";
import "../styles/pages.css";

const formatRD = (n) =>
  `RD$${(n || 0).toLocaleString("es-DO", { minimumFractionDigits: 2 })}`;

export default function ReporteSemanal() {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/empleados/reporte-semanal").then(setReporte).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Cargando reporte...</div>;
  if (!reporte) return null;

  const stats = [
    { label: "Semana",            value: reporte.semanaActual,          icon: "ti-calendar", accent: false, sm: true },
    { label: "Empleados pagados", value: reporte.totalEmpleados,        icon: "ti-users",    accent: false },
    { label: "Total nomina",      value: formatRD(reporte.totalNomina), icon: "ti-cash",     accent: true  },
  ];

  return (
    <div>
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.accent ? "accent" : "default"}`}>
              <i className={`ti ${s.icon}`} aria-hidden="true" />
            </div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-value ${s.accent ? "accent" : ""} ${s.sm ? "sm" : ""}`}>
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <span className="table-card-title">Detalle por empleado</span>
          <span className="td-muted" style={{ fontSize: 12 }}>
            Generado: {new Date(reporte.fechaGeneracion).toLocaleString("es-DO")}
          </span>
        </div>
        <TablaReporte empleados={reporte.empleados} />
      </div>
    </div>
  );
}
