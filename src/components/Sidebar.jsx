import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/sidebar.css";

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const esAdmin = usuario?.rol === "Admin";

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="SIB Manager" />
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          <i className="ti ti-home" aria-hidden="true" />
          Inicio
        </NavLink>

        <NavLink to="/empleados"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          <i className="ti ti-users" aria-hidden="true" />
          Consulta
        </NavLink>

        {esAdmin && (
          <NavLink to="/empleados/nuevo"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            <i className="ti ti-plus" aria-hidden="true" />
            Crear registro
          </NavLink>
        )}

        <NavLink to="/reporte"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          <i className="ti ti-report-money" aria-hidden="true" />
          Reporte semanal
        </NavLink>

        {esAdmin && (
          <NavLink to="/usuarios"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            <i className="ti ti-user-cog" aria-hidden="true" />
            Usuarios
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-username">{usuario?.nombreUsuario || "Usuario"}</div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <i className="ti ti-logout" aria-hidden="true" />
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}
