import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE, saveAuth } from "../../utils/auth";
import "../../styles/Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw data;

      saveAuth(data);
      navigate("/home");
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link><br />
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
