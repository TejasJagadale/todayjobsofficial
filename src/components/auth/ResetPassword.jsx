import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils/auth";
import "../../styles/Auth.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw data;

      alert("Password reset successful!");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input type="password" name="password" placeholder="New Password" required onChange={handleChange} />
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
          />

          <button disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
