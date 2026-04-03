import { useState } from "react";
import { Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const user =
    JSON.parse(localStorage.getItem("hr_intel_user")) ||
    { name: "Alex Thompson", role: "HR Director" };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const logout = () => {
    localStorage.removeItem("hr_intel_auth");
    localStorage.removeItem("hr_intel_user");
    navigate("/login");
  };

  return (
    <header className="navbar">
      {/* Search */}
      <div style={{ flex: 1, maxWidth: "520px" }}>
        <div className="search-bar">
          <Search size={16} />
          <input
            placeholder="Search analytics, employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button className="btn-icon">
          <Bell size={18} />
        </button>

        <button className="btn btn-primary">
          Generate Report
        </button>

        {/* Profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
          onClick={logout}
        >
          <div className="avatar avatar-sm">{initials}</div>
          <ChevronDown size={14} />
        </div>
      </div>
    </header>
  );
}