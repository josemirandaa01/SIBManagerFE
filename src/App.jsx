import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import Empleados from "./pages/Empleados";
import CrearEmpleado from "./pages/CrearEmpleado";
import EditarEmpleado from "./pages/EditarEmpleado";
import ReporteSemanal from "./pages/ReporteSemanal";

const PrivateRoute = ({ children }) => {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Inicio />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="empleados/nuevo" element={<CrearEmpleado />} />
          <Route path="empleados/:id/editar" element={<EditarEmpleado />} />
          <Route path="reporte" element={<ReporteSemanal />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>;
}
