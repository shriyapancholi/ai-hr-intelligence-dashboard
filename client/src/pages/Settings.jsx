import { useState, useEffect } from "react";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [aiNotif, setAiNotif] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("hr_intel_user") || "{}");
    setName(user.name || "");
    setEmail(user.email || "");
    const savedDark = localStorage.getItem("dark_mode") === "true";
    setDarkMode(savedDark);
  }, []);

  useEffect(() => {
    document.body.style.background = darkMode ? "#0f172a" : "";
    document.body.style.color = darkMode ? "#fff" : "";
  }, [darkMode]);

  const handleSave = () => {
    const user = JSON.parse(localStorage.getItem("hr_intel_user") || "{}");
    localStorage.setItem("hr_intel_user", JSON.stringify({ ...user, name }));
    localStorage.setItem("dark_mode", darkMode);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile, preferences and integrations.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Profile</h3></div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <div className="text-muted" style={{ marginBottom: "6px" }}>Name</div>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          {email && (
            <div>
              <div className="text-muted" style={{ marginBottom: "6px" }}>Email</div>
              <input className="form-input" value={email} disabled style={{ background: "var(--gray-50)", color: "var(--gray-500)" }} />
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Preferences</h3></div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Dark Mode</span>
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </label>
          <label style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Email Alerts</span>
            <input type="checkbox" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
          </label>
          <label style={{ display: "flex", justifyContent: "space-between" }}>
            <span>AI Insights Alerts</span>
            <input type="checkbox" checked={aiNotif} onChange={() => setAiNotif(!aiNotif)} />
          </label>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Integrations</h3></div>
        <div style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
          <span>Zoho HRMS</span>
          <span style={{ color: "var(--gray-400)" }}>Not connected</span>
        </div>
        <div style={{ padding: "0 20px 20px", display: "flex", justifyContent: "space-between" }}>
          <span>Slack</span>
          <button className="btn btn-outline">Connect</button>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave} style={{ alignSelf: "flex-start" }}>
        {saved ? "Saved!" : "Save Settings"}
      </button>
    </div>
  );
}
