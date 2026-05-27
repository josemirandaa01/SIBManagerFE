import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/forms.css";
import "../styles/pages.css";

export default function EditarEmpleado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [deptos, setDeptos] = useState([]);
  const [pagoActual, setPagoActual] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/empleados/${id}`),
      api.get("/empleados/departamentos"),
    ]).then(([emp, deps]) => {
      setForm({
        primerNombre:       emp.primerNombre       || "",
        apellidoPaterno:    emp.apellidoPaterno     || "",
        numeroSeguroSocial: emp.numeroSeguroSocial  || "",
        tipoEmpleadoId:     emp.tipoEmpleadoId      || 1,
        departamentoId:     emp.departamentoId      || "",
        estado:             emp.estado              ?? true,
        salarioSemanal:     emp.salarioSemanal      ?? "",
        sueldoPorHora:      emp.sueldoPorHora       ?? "",
        horasTrabajadas:    emp.horasTrabajadas     ?? "",
        ventasBrutas:       emp.ventasBrutas        ?? "",
        tarifaComision:     emp.tarifaComision      ?? "",
        salarioBase:        emp.salarioBase         ?? "",
      });
      setPagoActual(emp.pagoCalculado);
      setDeptos(deps);
    }).catch(() => setError("Error al cargar el empleado."))
    .finally(() => setLoadingData(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    const body = {
      primerNombre:       form.primerNombre       || null,
      apellidoPaterno:    form.apellidoPaterno,
      numeroSeguroSocial: form.numeroSeguroSocial,
      tipoEmpleadoId:     parseInt(form.tipoEmpleadoId),
      departamentoId:     form.departamentoId ? parseInt(form.departamentoId) : null,
      estado:             form.estado,
      salarioSemanal:     form.salarioSemanal  ? parseFloat(form.salarioSemanal)  : null,
      sueldoPorHora:      form.sueldoPorHora   ? parseFloat(form.sueldoPorHora)   : null,
      horasTrabajadas:    form.horasTrabajadas ? parseFloat(form.horasTrabajadas) : null,
      ventasBrutas:       form.ventasBrutas    ? parseFloat(form.ventasBrutas)    : null,
      tarifaComision:     form.tarifaComision  ? parseFloat(form.tarifaComision)  : null,
      salarioBase:        form.salarioBase     ? parseFloat(form.salarioBase)     : null,
    };
    try {
      const resultado = await api.put(`/empleados/${id}`, body);
      setPagoActual(resultado.pagoRecalculado);
      navigate("/empleados");
    } catch {
      setError("Error al actualizar el empleado. Verifica los datos.");
    } finally { setLoading(false); }
  };

  if (loadingData) return <div className="loading">Cargando datos del empleado...</div>;
  if (!form) return <div className="loading">Empleado no encontrado.</div>;

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon default">
            <i className="ti ti-user" aria-hidden="true" />
          </div>
          <div>
            <div className="stat-label">Empleado</div>
            <div className="stat-value" style={{ fontSize: 15 }}>
              {form.primerNombre} {form.apellidoPaterno}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent">
            <i className="ti ti-cash" aria-hidden="true" />
          </div>
          <div>
            <div className="stat-label">Pago calculado actual</div>
            <div className="stat-value accent">
              RD${(pagoActual||0).toLocaleString("es-DO",{minimumFractionDigits:2})}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon default">
            <i className="ti ti-info-circle" aria-hidden="true" />
          </div>
          <div>
            <div className="stat-label">Estado</div>
            <div className="stat-value" style={{ fontSize: 14 }}>
              <span className={`badge ${form.estado ? "badge-activo" : "badge-inactivo"}`}>
                {form.estado ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-card">
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo de empleado</label>
              <select value={form.tipoEmpleadoId}
                onChange={e => setForm({...form, tipoEmpleadoId: parseInt(e.target.value)})}>
                <option value={1}>Asalariado</option>
                <option value={2}>Por Horas</option>
                <option value={3}>Por Comision</option>
                <option value={4}>Asalariado por Comision</option>
              </select>
            </div>
            <div className="form-group">
              <label>Departamento</label>
              <select value={form.departamentoId}
                onChange={e => setForm({...form, departamentoId: e.target.value})}>
                <option value="">Sin departamento</option>
                {deptos.map(d => (
                  <option key={d.departamentoId} value={d.departamentoId}>{d.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Primer nombre</label>
              <input value={form.primerNombre} placeholder="Carlos"
                onChange={e => setForm({...form, primerNombre: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Apellido paterno</label>
              <input value={form.apellidoPaterno} placeholder="Perez" required
                onChange={e => setForm({...form, apellidoPaterno: e.target.value})} />
            </div>
            <div className="form-group form-grid-full">
              <label>Cedula (000-0000000-0)</label>
              <input value={form.numeroSeguroSocial} placeholder="001-1234567-1" required
                onChange={e => setForm({...form, numeroSeguroSocial: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select value={form.estado.toString()}
                onChange={e => setForm({...form, estado: e.target.value === "true"})}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <p className="form-section-title">Datos de pago</p>
            <div className="form-grid">

              {form.tipoEmpleadoId === 1 && (
                <div className="form-group">
                  <label>Salario semanal (RD$)</label>
                  <input type="number" step="any" value={form.salarioSemanal}
                    onChange={e => setForm({...form, salarioSemanal: e.target.value})} />
                </div>
              )}

              {form.tipoEmpleadoId === 2 && (
                <>
                  <div className="form-group">
                    <label>Sueldo por hora (RD$)</label>
                    <input type="number" step="any" value={form.sueldoPorHora}
                      onChange={e => setForm({...form, sueldoPorHora: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Horas trabajadas</label>
                    <input type="number" step="any" value={form.horasTrabajadas}
                      onChange={e => setForm({...form, horasTrabajadas: e.target.value})} />
                  </div>
                </>
              )}

              {form.tipoEmpleadoId === 3 && (
                <>
                  <div className="form-group">
                    <label>Ventas brutas (RD$)</label>
                    <input type="number" step="any" value={form.ventasBrutas}
                      onChange={e => setForm({...form, ventasBrutas: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Tarifa de comision (ej: 0.06 = 6%)</label>
                    <input type="number" step="any" value={form.tarifaComision}
                      onChange={e => setForm({...form, tarifaComision: e.target.value})} />
                  </div>
                </>
              )}

              {form.tipoEmpleadoId === 4 && (
                <>
                  <div className="form-group">
                    <label>Ventas brutas (RD$)</label>
                    <input type="number" step="any" value={form.ventasBrutas}
                      onChange={e => setForm({...form, ventasBrutas: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Tarifa de comision (ej: 0.06 = 6%)</label>
                    <input type="number" step="any" value={form.tarifaComision}
                      onChange={e => setForm({...form, tarifaComision: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Salario base (RD$)</label>
                    <input type="number" step="any" value={form.salarioBase}
                      onChange={e => setForm({...form, salarioBase: e.target.value})} />
                  </div>
                </>
              )}

            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
            <button type="button" className="btn btn-secondary"
              onClick={() => navigate("/empleados")}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}