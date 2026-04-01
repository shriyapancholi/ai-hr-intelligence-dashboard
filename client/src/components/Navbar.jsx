export default function Navbar() {
    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div style={{
            height: "60px",
            background: "#f3f4f6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px"
        }}>
            <h3>AI HR Intelligence Dashboard</h3>
            <button onClick={logout}>Logout</button>
        </div>
    );
}