import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Video,
  FileText,
  BarChart2,
  Bot,
  Bell,
  Settings,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("hr_intel_user")) ||
    { name: "Alex Thompson", role: "HR Director" };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hr_intel_user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-brand">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg,#4F46E5,#6366F1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarChart2 size={18} color="#fff" />
          </div>

          <div>
            <div style={{ fontWeight: "700", color: "#fff" }}>
              HR Intelligence
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
              EDITORIAL INSIGHTS
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavLink to="/" end className="nav-item">
          <LayoutDashboard size={17} /> Dashboard
        </NavLink>

        <NavLink to="/employees" className="nav-item">
          <Users size={17} /> Employees
        </NavLink>

        <NavLink to="/meetings" className="nav-item">
          <Video size={17} /> Meetings
        </NavLink>

        <NavLink to="/upload-transcript" className="nav-item">
          <FileText size={17} /> Transcripts
        </NavLink>

        <NavLink to="/analytics" className="nav-item">
          <BarChart2 size={17} /> Analytics
        </NavLink>

        <NavLink to="/ai-chat" className="nav-item">
          <Bot size={17} /> AI Assistant
        </NavLink>

        <NavLink to="/reports" className="nav-item">
          <FileText size={17} /> Generated Reports
        </NavLink>

        <NavLink to="/reminders" className="nav-item">
          <Bell size={17} /> Reminders
        </NavLink>

        <NavLink to="/settings" className="nav-item">
          <Settings size={17} /> Settings
        </NavLink>
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#fff",
          }}
        >
          <div className="avatar">{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px" }}>{user.name}</div>
            <div style={{ fontSize: "11px", opacity: 0.6 }}>
              {user.role}
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}