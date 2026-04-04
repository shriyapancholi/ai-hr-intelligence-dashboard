import { useState, useEffect } from "react";

export default function Settings() {
  const [name, setName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [aiNotif, setAiNotif] = useState(true);

  // Load saved settings
  useEffect(() => {
    const savedName = localStorage.getItem("user_name") || "Alex Thompson";
    const savedDark = localStorage.getItem("dark_mode") === "true";

    setName(savedName);
    setDarkMode(savedDark);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.style.background = "#0f172a";
      document.body.style.color = "#fff";
    } else {
      document.body.style.background = "";
      document.body.style.color = "";
    }
  }, [darkMode]);

  // Save settings
  const handleSave = () => {
    localStorage.setItem("user_name", name);
    localStorage.setItem("dark_mode", darkMode);

    alert("Settings saved successfully!");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile, preferences and integrations.</p>
        </div>
      </div>

      {/* Profile */}
      <div className="card">
        <div className="card-header">
          <h3>Profile</h3>
        </div>

        <div style={{ padding: "20px" }}>
          <div className="text-muted">Name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              marginTop: "6px",
              padding: "8px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid var(--gray-300)"
            }}
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <div className="card-header">
          <h3>Preferences</h3>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* Dark Mode */}
          <label style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Dark Mode 🌙</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </label>

          {/* Notifications */}
          <label style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Email Alerts</span>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={() => setEmailNotif(!emailNotif)}
            />
          </label>

          <label style={{ display: "flex", justifyContent: "space-between" }}>
            <span>AI Insights Alerts</span>
            <input
              type="checkbox"
              checked={aiNotif}
              onChange={() => setAiNotif(!aiNotif)}
            />
          </label>

        </div>
      </div>

      {/* Integrations */}
      <div className="card">
        <div className="card-header">
          <h3>Integrations</h3>
        </div>

        <div style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
          <span>Zoho HRMS</span>
          <span style={{ color: "var(--success)", fontWeight: "600" }}>
            Connected
          </span>
        </div>

        <div style={{ padding: "0 20px 20px", display: "flex", justifyContent: "space-between" }}>
          <span>Slack</span>
          <button className="btn btn-outline">Connect</button>
        </div>
      </div>

      {/* Save Button */}
      <button className="btn btn-primary" onClick={handleSave}>
        Save Settings
      </button>

    </div>
  );
}

