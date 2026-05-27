import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/pages.css";

const badgeClass = {
  "Asalariado":         "badge-asalariado",
  "PorHoras":           "badge-horas",
  "Comision":           "badge-comision",
  "AsalariadoComision": "badge-asal-com",
};

export default function Inicio() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/empleados").then(setEmpleados).finally(() => setLoading(false));
  }, []);

  const totalNomina = empleados.reduce((sum, e) => sum + (e.pagoCalculado || 0), 0);
  const activos = empleados.filter(e => e.estado).length;

  const stats = [
    { label: "Total empleados", value: empleados.length,  icon: "ti-users",      accent: false },
    { label: "Activos",         value: activos,            icon: "ti-user-check", accent: false },
    { label: "Nomina semanal",  value: `RD$${totalNomina.toLocaleString("es-DO",{minimumFractionDigits:2})}`, icon: "ti-cash", accent: true },
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
              <div className={`stat-value ${s.accent ? "accent" : ""}`}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <span className="table-card-title">Empleados recientes</span>
        </div>
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {["Nombre","Cedula","Tipo","Pago semanal","Estado"].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {empleados.slice(0,5).map(e => (
                <tr key={e.empleadoId}>
                  <td className="td-bold">{e.nombreCompleto}</td>
                  <td className="td-muted">{e.numeroSeguroSocial}</td>
                  <td><span className={`badge ${badgeClass[e.tipoEmpleado] || ""}`}>{e.tipoEmpleado}</span></td>
                  <td className="td-accent">RD${(e.pagoCalculado||0).toLocaleString("es-DO",{minimumFractionDigits:2})}</td>
                  <td><span className={`badge ${e.estado ? "badge-activo" : "badge-inactivo"}`}>{e.estado ? "Activo" : "Inactivo"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
