import { useState } from "react";
import { API_BASE } from "../../utils/auth";
import "../../styles/Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw data;

      alert("Password reset email sent!");
    } catch (err) {
      alert(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Registered Email" required onChange={(e) => setEmail(e.target.value)} />
          <button disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
