import { useState } from "react";
import API from "../services/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await API.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            window.location.href = "/dashboard";
        } catch (err) {
            alert("Login failed");
        }
    };

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#111827"
        }}>
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "10px",
                width: "350px",
                textAlign: "center"
            }}>
                <h2>AI HR Intelligence</h2>
                <p>Login to your dashboard</p>

                <input
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: 10, marginTop: 10 }}
                />

                <input
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", padding: 10, marginTop: 10 }}
                />

                <button
                    onClick={handleLogin}
                    style={{
                        width: "100%",
                        padding: 10,
                        marginTop: 15,
                        background: "#2563eb",
                        color: "white",
                        border: "none"
                    }}
                >
                    Login
                </button>

                <p style={{ marginTop: 15 }}>
                    Don't have an account? <a href="/register">Sign up</a>
                </p>
            </div>
        </div>
    );
}