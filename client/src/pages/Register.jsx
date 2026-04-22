import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import API from "../services/api";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await API.post("auth/register", { name, email, password });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || "Registration failed. Please try again.");
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
                <div className="text-muted">Create your account</div>
            </div>

            {/* Register Card */}
            <div className="card" style={{ width: "380px", padding: "28px" }}>
                <h3 style={{ marginBottom: "20px" }}>Create account</h3>

                <form onSubmit={handleRegister}>
                    {error && (
                        <div style={{ marginBottom: "14px", color: "#dc2626", fontSize: "13px", background: "#fef2f2", padding: "8px 12px", borderRadius: "6px" }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: "14px" }}>
                        <label>Full Name</label>
                        <input
                            className="form-input"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "14px" }}>
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-input"
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
                        {loading ? "Creating account..." : <>{`Create Account`} <ArrowRight size={16} /></>}
                    </button>
                </form>

                <div style={{ marginTop: "16px", textAlign: "center" }}>
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
}