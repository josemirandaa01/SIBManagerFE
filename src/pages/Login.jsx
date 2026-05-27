import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const data = await api.post("/auth/login", form);
      login(data.token, data.usuario);
      navigate("/");
    } catch {
      setError("Credenciales invalidas. Verifica tu email y contraseña.");
    } finally { setLoading(false); }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <img src="/logo.png" alt="SIB Manager" />
          <p>Sistema de Gestion de Empleados SIB</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input type="email" value={form.email} required
              placeholder="correo"
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          <div>
            <label>Contraseña</label>
            <input type="password" value={form.password} required
              placeholder="contraseña"
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Iniciando sesion..." : "Iniciar sesion"}
          </button>
        </form>
      </div>
    </div>
  );
}
