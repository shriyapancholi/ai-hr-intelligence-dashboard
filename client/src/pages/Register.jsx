import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();

        // Fake register
        localStorage.setItem("hr_intel_auth", "true");
        localStorage.setItem(
            "hr_intel_user",
            JSON.stringify({
                name: name,
                role: "HR Manager",
            })
        );

        navigate("/");
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
                    <div style={{ marginBottom: "14px" }}>
                        <label>Full Name</label>
                        <input
                            className="form-input"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div style={{ marginBottom: "14px" }}>
                        <label>Email</label>
                        <input
                            className="form-input"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%", justifyContent: "center" }}
                    >
                        Create Account <ArrowRight size={16} />
                    </button>
                </form>

                <div style={{ marginTop: "16px", textAlign: "center" }}>
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
}