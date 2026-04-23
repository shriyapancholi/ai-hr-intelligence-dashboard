import { useState, useEffect } from "react";
import {
  User, Mail, Shield, Moon, Sun, Bell, Sparkles,
  LogOut, Save, Check, Info, Cpu, Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── toggle switch ───────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="toggle-switch"
      style={{ background: checked ? "var(--primary)" : "var(--gray-300)" }}
    >
      <div
        className="thumb"
        style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

/* ── setting row ─────────────────────────────────── */
function SettingRow({ icon, title, desc, control, last }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "18px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "var(--gray-100)", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
            color: "var(--gray-500)",
          }}>
            {icon}
          </div>
          <div>
            <div style={{ fontWeight: "600", fontSize: "14px", color: "var(--gray-800)" }}>{title}</div>
            <div style={{ fontSize: "12px", color: "var(--gray-500)", marginTop: "2px" }}>{desc}</div>
          </div>
        </div>
        {control}
      </div>
      {!last && <div style={{ height: "1px", background: "var(--gray-100)" }} />}
    </>
  );
}

/* ── status pill ─────────────────────────────────── */
function StatusPill({ color, bg, label }) {
  return (
    <span style={{
      fontSize: "12px", fontWeight: "600", padding: "4px 12px",
      borderRadius: "20px", background: bg, color,
      display: "inline-flex", alignItems: "center", gap: "6px",
    }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

/* ── main page ───────────────────────────────────── */
export default function Settings() {
  const navigate = useNavigate();

  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [darkMode, setDarkMode]     = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [aiNotif, setAiNotif]       = useState(true);
  const [saved, setSaved]           = useState(false);
  const [nameError, setNameError]   = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("hr_intel_user") || "{}");
    setName(user.name || "");
    setEmail(user.email || "");
    setDarkMode(localStorage.getItem("dark_mode") === "true");
    setEmailNotif(localStorage.getItem("notif_email") !== "false");
    setAiNotif(localStorage.getItem("notif_ai") !== "false");
  }, []);

  const applyDarkMode = (on) => {
    setDarkMode(on);
    if (on) document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("dark_mode", on);
  };

  const handleSave = () => {
    if (!name.trim()) { setNameError("Name cannot be empty."); return; }
    setNameError("");
    const user = JSON.parse(localStorage.getItem("hr_intel_user") || "{}");
    localStorage.setItem("hr_intel_user", JSON.stringify({ ...user, name: name.trim() }));
    localStorage.setItem("dark_mode", darkMode);
    localStorage.setItem("notif_email", emailNotif);
    localStorage.setItem("notif_ai", aiNotif);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hr_intel_user");
    navigate("/login");
  };

  const initials = name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "HR";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* page header */}
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="text-muted">Manage your profile, appearance, and preferences.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} style={{ minWidth: "140px", justifyContent: "center" }}>
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      {/* two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Profile card */}
          <div className="card">
            <div className="card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "15px" }}>Profile</h3>
              <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 9px", borderRadius: "20px", background: "var(--primary-light)", color: "var(--primary)" }}>
                Account
              </span>
            </div>

            {/* avatar strip */}
            <div style={{ padding: "22px", display: "flex", alignItems: "center", gap: "18px", borderBottom: "1px solid var(--gray-100)" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "20px", flexShrink: 0,
                background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: "700", fontSize: "24px", fontFamily: "Sora, sans-serif",
                boxShadow: "0 6px 20px rgba(79,70,229,0.4)",
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "18px", color: "var(--gray-800)" }}>{name || "—"}</div>
                <div style={{ fontSize: "13px", color: "var(--gray-500)", marginTop: "3px" }}>{email || "No email set"}</div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "8px",
                  fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px",
                  background: "var(--primary-light)", color: "var(--primary)",
                }}>
                  <Shield size={11} /> HR Manager
                </div>
              </div>
            </div>

            {/* fields */}
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--gray-700)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <User size={13} /> Display Name
                </label>
                <input
                  className="form-input"
                  style={{ marginTop: 0, marginBottom: 0 }}
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(""); }}
                  placeholder="Your full name"
                />
                {nameError && <div style={{ fontSize: "12px", color: "var(--danger)", marginTop: "5px" }}>{nameError}</div>}
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--gray-700)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <Mail size={13} /> Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    className="form-input"
                    style={{ marginTop: 0, marginBottom: 0, paddingRight: "96px" }}
                    value={email}
                    disabled
                  />
                  <span style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    fontSize: "11px", fontWeight: "600", color: "var(--gray-400)",
                    display: "flex", alignItems: "center", gap: "4px",
                  }}>
                    <Lock size={10} /> Read-only
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--gray-400)", marginTop: "5px" }}>
                  Email is set at registration and cannot be changed.
                </div>
              </div>
            </div>
          </div>

          {/* System info card */}
          <div className="card">
            <div className="card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "15px" }}>System</h3>
              <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 9px", borderRadius: "20px", background: "var(--gray-100)", color: "var(--gray-500)" }}>
                Info
              </span>
            </div>
            <div style={{ padding: "8px 22px 20px", display: "flex", flexDirection: "column", gap: "0" }}>
              <SettingRow
                icon={<Info size={16} />}
                title="App Version"
                desc="Current build of HR Intelligence"
                control={<span style={{ fontSize: "13px", fontWeight: "700", color: "var(--gray-700)", whiteSpace: "nowrap" }}>v1.0.0</span>}
              />
              <SettingRow
                icon={<Cpu size={16} />}
                title="AI Provider"
                desc="Model powering analysis and chat"
                control={<StatusPill color="#16A34A" bg="#F0FDF4" label="OpenAI gpt-4o-mini" />}
              />
              <SettingRow
                icon={<Shield size={16} />}
                title="Database"
                desc="Cloud-hosted MongoDB Atlas cluster"
                control={<StatusPill color="#16A34A" bg="#F0FDF4" label="Connected" />}
                last
              />
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Appearance card */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: "15px" }}>Appearance</h3>
            </div>
            <div style={{ padding: "8px 22px 20px" }}>
              <SettingRow
                icon={darkMode ? <Moon size={17} /> : <Sun size={17} />}
                title="Dark Mode"
                desc={darkMode ? "Currently using the dark theme" : "Currently using the light theme"}
                control={<Toggle checked={darkMode} onChange={() => applyDarkMode(!darkMode)} />}
                last
              />
            </div>
          </div>

          {/* Notifications card */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: "15px" }}>Notifications</h3>
            </div>
            <div style={{ padding: "8px 22px 20px" }}>
              <SettingRow
                icon={<Bell size={17} />}
                title="Email Alerts"
                desc="Receive meeting invites and HR updates via email"
                control={<Toggle checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />}
              />
              <SettingRow
                icon={<Sparkles size={17} />}
                title="AI Insight Alerts"
                desc="Get notified when AI detects at-risk employees"
                control={<Toggle checked={aiNotif} onChange={() => setAiNotif(!aiNotif)} />}
                last
              />
            </div>
          </div>

          {/* Danger zone card */}
          <div className="card" style={{ borderColor: "#FCA5A5" }}>
            <div className="card-header" style={{ borderColor: "#FCA5A5" }}>
              <h3 style={{ fontSize: "15px", color: "var(--danger)" }}>Danger Zone</h3>
            </div>
            <div style={{ padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "14px", color: "var(--gray-800)" }}>Sign out of your account</div>
                  <div style={{ fontSize: "12px", color: "var(--gray-500)", marginTop: "3px" }}>
                    You will be returned to the login screen.
                  </div>
                </div>
                <button
                  onClick={logout}
                  style={{
                    display: "flex", alignItems: "center", gap: "7px",
                    padding: "10px 18px", borderRadius: "10px",
                    border: "1px solid #FCA5A5", background: "#FEF2F2",
                    color: "var(--danger)", fontWeight: "600", fontSize: "13px",
                    cursor: "pointer", flexShrink: 0,
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
