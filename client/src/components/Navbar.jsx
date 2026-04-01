export default function Navbar() {
  return (
    <div style={nav}>
      <h3>AI HR Dashboard</h3>
      <button style={logout}>Logout</button>
    </div>
  );
}

const nav = {
  height: 60,
  background: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
};

const logout = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: 6
};