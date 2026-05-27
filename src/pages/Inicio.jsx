import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import TablaEmpleados from "../components/TablaEmpleados";
import "../styles/pages.css";

const formatRD = (n) =>
  `RD$${(n || 0).toLocaleString("es-DO", { minimumFractionDigits: 2 })}`;

export default function Inicio() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/empleados").then(setEmpleados).finally(() => setLoading(false));
  }, []);

  const totalNomina = empleados.reduce((sum, e) => sum + (e.pagoCalculado || 0), 0);
  const activos     = empleados.filter(e => e.estado).length;

  const stats = [
    { label: "Total empleados", value: empleados.length,     icon: "ti-users",      accent: false },
    { label: "Activos",         value: activos,               icon: "ti-user-check", accent: false },
    { label: "Nomina semanal",  value: formatRD(totalNomina), icon: "ti-cash",       accent: true  },
  ];

  const handleDesactivar = async (id) => {
    if (!confirm("Desactivar este empleado?")) return;
    await api.delete(`/empleados/${id}`);
    api.get("/empleados").then(setEmpleados);
  };

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
          <TablaEmpleados
            empleados={empleados}
            onEditar={id => navigate(`/empleados/${id}/editar`)}
            onDesactivar={handleDesactivar}
          />
        )}
      </div>
    </div>
  );
}
