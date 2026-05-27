import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/pages.css";

const badgeClass = {
  "Asalariado":         "badge-asalariado",
  "PorHoras":           "badge-horas",
  "Comision":           "badge-comision",
  "AsalariadoComision": "badge-asal-com",
};

const formatRD = (n) => `RD$${(n||0).toLocaleString("es-DO",{minimumFractionDigits:2})}`;

const detalleTexto = (emp) => {
  const d = emp.detalle;
  switch(emp.tipoEmpleado) {
    case "Asalariado":         return `Salario fijo: ${formatRD(d.salarioSemanal)}`;
    case "PorHoras":           return `${d.horasNormales}h normales + ${d.horasExtra}h extra x1.5`;
    case "Comision":           return `${formatRD(d.ventasBrutas)} x ${d.tarifaPorcentaje}`;
    case "AsalariadoComision": return `Base ${formatRD(d.salarioBase)} + comision + bonif. 10%`;
    default: return "-";
  }
};

export default function ReporteSemanal() {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/empleados/reporte-semanal").then(setReporte).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Cargando reporte...</div>;
  if (!reporte) return null;

  const stats = [
    { label: "Semana",           value: reporte.semanaActual,   icon: "ti-calendar", accent: false, sm: true },
    { label: "Empleados pagados",value: reporte.totalEmpleados, icon: "ti-users",    accent: false },
    { label: "Total nomina",     value: formatRD(reporte.totalNomina), icon: "ti-cash", accent: true },
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
              <div className={`stat-value ${s.accent ? "accent" : ""} ${s.sm ? "sm" : ""}`}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <span className="table-card-title">Detalle por empleado</span>
          <span className="td-muted" style={{fontSize:12}}>
            Generado: {new Date(reporte.fechaGeneracion).toLocaleString("es-DO")}
          </span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              {["Nombre","Cedula","Tipo","Detalle calculo","Pago semanal"].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {reporte.empleados.map(e => (
              <tr key={e.empleadoId}>
                <td className="td-bold">{e.nombre}</td>
                <td className="td-muted">{e.numeroSeguroSocial}</td>
                <td><span className={`badge ${badgeClass[e.tipoEmpleado] || ""}`}>{e.tipoEmpleado}</span></td>
                <td className="td-muted">{detalleTexto(e)}</td>
                <td className="td-accent">{formatRD(e.pagoSemanal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
