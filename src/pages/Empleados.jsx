import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import TablaEmpleados from "../components/TablaEmpleados";
import "../styles/pages.css";

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cargarEmpleados = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filtroEstado !== "") params.append("estado", filtroEstado);
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
        <select value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <button className="btn btn-dark" onClick={cargarEmpleados}>Filtrar</button>
        <button className="btn btn-primary" onClick={() => navigate("/empleados/nuevo")}>
          + Nuevo empleado
        </button>
      </div>

      <div className="table-card">
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
