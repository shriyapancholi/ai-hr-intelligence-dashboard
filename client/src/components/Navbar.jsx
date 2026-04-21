import { useState } from "react";
import { Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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

        {/* Profile */}
        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    position: "relative"
  }}
  onClick={() => setOpen(!open)}
>
  <div className="avatar avatar-sm">{initials}</div>
  <ChevronDown size={14} />

  {open && (
    <div
      style={{
        position: "absolute",
        top: "40px",
        right: 0,
        background: "white",
        border: "1px solid #eee",
        borderRadius: "8px",
        padding: "10px",
        width: "150px"
      }}
    >
      <div onClick={() => navigate("/profile")} style={{ padding: "5px", cursor: "pointer" }}>
        Profile
      </div>

      <div onClick={logout} style={{ padding: "5px", cursor: "pointer", color: "red" }}>
        Logout
      </div>
    </div>
  )}
</div>
      </div>
    </header>
  );
}