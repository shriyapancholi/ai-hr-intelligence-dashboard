import { useState, useEffect } from "react";
import { Bell, ChevronDown, Clock, Users, BarChart2, Cpu, CalendarDays, FileText, AlarmClock, Settings, Upload } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

function Greeting({ name }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hour = time.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--gray-800)" }}>
        {greeting}, {name?.split(" ")[0]} 👋
      </div>
      <div style={{ fontSize: "12px", color: "var(--gray-400)", display: "flex", alignItems: "center", gap: "6px" }}>
        <Clock size={12} /> {dateStr} — {timeStr}
      </div>
    </div>
  );
}

function EmployeeStats() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    API.get("stats").then(({ data }) => setStats(data)).catch(() => {});
  }, []);
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#EEF2FF", borderRadius: "999px", padding: "5px 12px", fontSize: "13px", color: "#4F46E5", fontWeight: 600 }}>
        <Users size={14} /> {stats ? `${stats.totalEmployees} Employees` : "Loading..."}
      </div>
      {stats && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#FEF2F2", borderRadius: "999px", padding: "5px 12px", fontSize: "13px", color: "#DC2626", fontWeight: 600 }}>
          {stats.atRisk} At Risk
        </div>
      )}
    </div>
  );
}

function MeetingContext() {
  const [count, setCount] = useState(null);
  useEffect(() => {
    API.get("stats").then(({ data }) => setCount(data.meetingsThisMonth)).catch(() => {});
  }, []);
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#F0FDF4", borderRadius: "999px", padding: "5px 12px", fontSize: "13px", color: "#16A34A", fontWeight: 600 }}>
        <CalendarDays size={14} /> {today}
      </div>
      {count !== null && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#EEF2FF", borderRadius: "999px", padding: "5px 12px", fontSize: "13px", color: "#4F46E5", fontWeight: 600 }}>
          {count} meetings this month
        </div>
      )}
    </div>
  );
}

function AnalyticsContext() {
  const [refreshed, setRefreshed] = useState(new Date());
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#EEF2FF", borderRadius: "999px", padding: "5px 12px", fontSize: "13px", color: "#4F46E5", fontWeight: 600 }}>
        <BarChart2 size={14} /> Live Analytics
      </div>
      <div style={{ fontSize: "12px", color: "var(--gray-400)" }}>
        Refreshed at {refreshed.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}

function AIChatContext() {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F0FDF4", borderRadius: "999px", padding: "5px 14px", fontSize: "13px", color: "#16A34A", fontWeight: 600 }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16A34A" }} />
        <Cpu size={14} /> GPT-4o Mini — Online
      </div>
      <div style={{ fontSize: "12px", color: "var(--gray-400)" }}>
        Powered by gpt-4o-mini
      </div>
    </div>
  );
}

function TranscriptContext() {
  const [count, setCount] = useState(null);
  useEffect(() => {
    API.get("transcripts/all").then(({ data }) => setCount(data.length)).catch(() => {});
  }, []);
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#EEF2FF", borderRadius: "999px", padding: "5px 12px", fontSize: "13px", color: "#4F46E5", fontWeight: 600 }}>
        <Upload size={14} /> {count !== null ? `${count} transcripts analyzed` : "Upload & analyze"}
      </div>
      <div style={{ fontSize: "12px", color: "var(--gray-400)" }}>Supports .txt files</div>
    </div>
  );
}

function RemindersContext() {
  const [pending, setPending] = useState(null);
  useEffect(() => {
    API.get("reminders").then(({ data }) => setPending(data.filter((r) => r.status === "Pending").length)).catch(() => {});
  }, []);
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      {pending !== null && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: pending > 0 ? "#FFF7ED" : "#F0FDF4", borderRadius: "999px", padding: "5px 12px", fontSize: "13px", color: pending > 0 ? "#D97706" : "#16A34A", fontWeight: 600 }}>
          <AlarmClock size={14} /> {pending} pending {pending === 1 ? "reminder" : "reminders"}
        </div>
      )}
      <div style={{ fontSize: "12px", color: "var(--gray-400)" }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </div>
    </div>
  );
}

function ReportsContext() {
  const count = JSON.parse(localStorage.getItem("hr_reports") || "[]").length;
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#EEF2FF", borderRadius: "999px", padding: "5px 12px", fontSize: "13px", color: "#4F46E5", fontWeight: 600 }}>
        <FileText size={14} /> {count} {count === 1 ? "report" : "reports"} generated
      </div>
    </div>
  );
}

function SettingsContext({ email }) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--gray-100)", borderRadius: "999px", padding: "5px 12px", fontSize: "13px", color: "var(--gray-600)", fontWeight: 500 }}>
        <Settings size={14} /> {email || "Account & preferences"}
      </div>
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("hr_intel_user")) || { name: "HR User", email: "" };

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hr_intel_user");
    navigate("/login");
  };

  const renderPageWidget = () => {
    const path = location.pathname;
    if (path === "/dashboard") return <Greeting name={user.name} />;
    if (path === "/employees") return <EmployeeStats />;
    if (path === "/meetings") return <MeetingContext />;
    if (path === "/analytics") return <AnalyticsContext />;
    if (path === "/ai-chat") return <AIChatContext />;
    if (path === "/upload-transcript") return <TranscriptContext />;
    if (path === "/reminders") return <RemindersContext />;
    if (path === "/reports") return <ReportsContext />;
    if (path === "/settings") return <SettingsContext email={user.email} />;
    return null;
  };

  return (
    <header className="navbar">
      <div style={{ flex: 1 }}>{renderPageWidget()}</div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button className="btn-icon"><Bell size={18} /></button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", position: "relative" }} onClick={() => setOpen(!open)}>
          <div className="avatar avatar-sm">{initials}</div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: "11px", color: "var(--gray-400)" }}>HR Manager</div>
          </div>
          <ChevronDown size={14} />

          {open && (
            <div style={{ position: "absolute", top: "44px", right: 0, background: "white", border: "1px solid #eee", borderRadius: "8px", padding: "10px", width: "160px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", zIndex: 100 }}>
              <div style={{ padding: "6px 8px", fontSize: "12px", color: "var(--gray-400)", borderBottom: "1px solid #eee", marginBottom: "6px" }}>
                {user.email}
              </div>
              <div onClick={logout} style={{ padding: "6px 8px", cursor: "pointer", color: "#DC2626", fontSize: "13px", borderRadius: "6px" }}
                onMouseEnter={(e) => e.target.style.background = "#FEF2F2"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
