import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "20px"
    }}>
      <h2>HR AI</h2>
      <hr />

      <p><Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link></p>
      <p><Link to="/employees" style={{ color: "white" }}>Employees</Link></p>
      <p><Link to="/upload" style={{ color: "white" }}>Upload Transcript</Link></p>
    </div>
  );
}