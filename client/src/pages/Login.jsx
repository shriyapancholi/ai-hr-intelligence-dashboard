import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("hr_intel_user", JSON.stringify({
        name: data.user.name,
        role: "HR Manager",
      }));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg,#EEF2FF,#F8FAFC)",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            margin: "auto",
            borderRadius: "12px",
            background: "linear-gradient(135deg,#4F46E5,#6366F1)",
          }}
        ></div>
        <h2 style={{ marginTop: "10px" }}>HR Intel</h2>
        <div className="text-muted">Editorial Analytics Dashboard</div>
      </div>

      {/* Login Card */}
      <div className="card" style={{ width: "380px", padding: "28px" }}>
        <h3 style={{ marginBottom: "20px" }}>Sign in to your account</h3>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ marginBottom: "14px", color: "#dc2626", fontSize: "13px", background: "#fef2f2", padding: "8px 12px", borderRadius: "6px" }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: "14px" }}>
            <label>Email address</label>
            <input
              className="form-input"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : <>{`Sign in`} <ArrowRight size={16} /></>}
          </button>
        </form>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          Don't have an account? <Link to="/register">Signup</Link>
        </div>
      </div>
    </div>
  );
}