import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/sidebar.css";

const navItems = [
  { to: "/",                icon: "ti-home",         label: "Inicio" },
  { to: "/empleados",       icon: "ti-users",         label: "Consulta" },
  { to: "/empleados/nuevo", icon: "ti-plus",          label: "Crear registro" },
  { to: "/reporte",         icon: "ti-report-money",  label: "Reporte semanal" },
];

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="SIB Manager" />
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <i className={`ti ${item.icon}`} aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}

        {usuario?.rol === "Admin" && (
          <NavLink to="/usuarios"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
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
