import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../../utils/auth";
import "../../styles/Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    dob: "",
    location: "",
    role: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw data;

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Full Name" required onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input name="mobile" placeholder="Phone Number" required onChange={handleChange} />
          <input type="date" name="dob" required onChange={handleChange} />
          <input name="location" placeholder="Location" required onChange={handleChange} />

          <select name="role" required onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="candidate">Candidate</option>
            <option value="hr">HR</option>
          </select>

          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />

          <button disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </form>

        <div className="auth-links">
          <Link to="/login">Already have an account?</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
