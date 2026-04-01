import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={sidebar}>
      <h2 style={{ marginBottom: 30 }}>HR AI</h2>

      <Link to="/dashboard" style={link}>Dashboard</Link>
      <Link to="/employees" style={link}>Employees</Link>
      <Link to="/upload" style={link}>Upload</Link>
      <Link to="/analytics" style={link}>Analytics</Link>
      <Link to="/reminders" style={link}>Reminders</Link>
      <Link to="/chat" style={link}>AI Chat</Link>
    </div>
  );
}

const sidebar = {
  width: 230,
  height: "100vh",
  background: "#020617",
  color: "white",
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 15
};

const link = {
  color: "#94a3b8",
  textDecoration: "none",
  fontSize: 16
};