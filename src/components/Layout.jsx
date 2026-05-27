import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/layout.css";

const getTitle = (pathname) => {
  if (pathname === "/")                     return "Inicio";
  if (pathname === "/empleados")            return "Consulta de empleados";
  if (pathname === "/empleados/nuevo")      return "Crear registro";
  if (pathname.includes("/editar"))         return "Editar empleado";
  if (pathname === "/reporte")              return "Reporte semanal";
  return "SIB Manager";
};

export default function Layout() {
  const location = useLocation();

  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-main">
        <div className="layout-topbar">
          <h1>{getTitle(location.pathname)}</h1>
        </div>
        <div className="layout-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
