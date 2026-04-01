import { useState } from "react";
import API from "../services/api";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            await API.post("/auth/register", { name, email, password });
            alert("Registered successfully");
            window.location.href = "/";
        }
        catch (err) {
            alert(err.response?.data || "Registration failed");
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
                <h2>Create Account</h2>

                <input
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: "100%", padding: 10, marginTop: 10 }}
                />

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
                    onClick={handleRegister}
                    style={{
                        width: "100%",
                        padding: 10,
                        marginTop: 15,
                        background: "#2563eb",
                        color: "white",
                        border: "none"
                    }}
                >
                    Register
                </button>
            </div>
        </div>
    );
}