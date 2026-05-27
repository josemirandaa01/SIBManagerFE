import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/pages.css";

const badgeClass = {
  "Asalariado":         "badge-asalariado",
  "PorHoras":           "badge-horas",
  "Comision":           "badge-comision",
  "AsalariadoComision": "badge-asal-com",
};

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: "", estado: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cargarEmpleados = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filtros.nombre) params.append("nombre", filtros.nombre);
    if (filtros.estado !== "") params.append("estado", filtros.estado);
    api.get(`/empleados?${params}`).then(setEmpleados).finally(() => setLoading(false));
  };

  useEffect(() => { cargarEmpleados(); }, []);

  const handleDesactivar = async (id) => {
    if (!confirm("Desactivar este empleado?")) return;
    await api.delete(`/empleados/${id}`);
    cargarEmpleados();
  };

  return (
    <div>
      <div className="filters-bar">
        <input value={filtros.nombre} placeholder="Buscar por nombre..."
          onChange={e => setFiltros({...filtros, nombre: e.target.value})}
        />
        <select value={filtros.estado} onChange={e => setFiltros({...filtros, estado: e.target.value})}>
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <button className="btn btn-dark" onClick={cargarEmpleados}>Buscar</button>
        <button className="btn btn-primary" onClick={() => navigate("/empleados/nuevo")}>+ Nuevo</button>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {["Nombre","Cedula","Tipo","Departamento","Pago","Estado","Acciones"].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {empleados.map(e => (
                <tr key={e.empleadoId}>
                  <td className="td-bold">{e.nombreCompleto}</td>
                  <td className="td-muted">{e.numeroSeguroSocial}</td>
                  <td><span className={`badge ${badgeClass[e.tipoEmpleado] || ""}`}>{e.tipoEmpleado}</span></td>
                  <td className="td-muted">{e.departamento || "-"}</td>
                  <td className="td-accent">RD${(e.pagoCalculado||0).toLocaleString("es-DO",{minimumFractionDigits:2})}</td>
                  <td><span className={`badge ${e.estado ? "badge-activo" : "badge-inactivo"}`}>{e.estado ? "Activo" : "Inactivo"}</span></td>
                  <td>
                    <button className="action-btn edit" onClick={() => navigate(`/empleados/${e.empleadoId}/editar`)}>
                      <i className="ti ti-edit" aria-hidden="true" />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDesactivar(e.empleadoId)}>
                      <i className="ti ti-trash" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
