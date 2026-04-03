import { useState } from "react";
import { Calendar, FileText, Shield, X } from "lucide-react";

export default function Reminders() {
  const [openPanel, setOpenPanel] = useState(false);

  const remindersData = [
    {
      title: "Send Offer Letter",
      person: "Marcus Chen",
      date: "Oct 24, 2023",
      status: "Pending",
      icon: <FileText size={18} />,
    },
    {
      title: "Performance Review Check-in",
      person: "Elena Rodriguez",
      date: "Oct 22, 2023",
      status: "Completed",
      icon: <Calendar size={18} />,
    },
    {
      title: "Compliance Training Audit",
      person: "Team Marketing",
      date: "Oct 25, 2023",
      status: "Pending",
      icon: <Shield size={18} />,
    },
  ];

  return (
    <div style={{ display: "flex" }}>

      {/* Left Content */}
      <div style={{ flex: 1, paddingRight: openPanel ? "360px" : "0" }}>
        <div style={{ marginBottom: "20px" }}>
          <h1>Reminders</h1>
          <p className="text-muted">
            Active editorial tasks requiring attention today
          </p>
        </div>

        {/* Reminder Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {remindersData.map((rem, i) => (
            <div className="card" key={i} style={{ padding: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", gap: "12px" }}>
                  <div className="icon-box">{rem.icon}</div>

                  <div>
                    <div style={{ fontWeight: "600" }}>{rem.title}</div>
                    <div className="text-muted">
                      {rem.person} • {rem.date}
                    </div>
                  </div>
                </div>

                <span
                  className={`badge ${rem.status === "Completed"
                      ? "badge-success"
                      : "badge-warning"
                    }`}
                >
                  {rem.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Reminder Button */}
        <button
          className="btn btn-primary"
          style={{ marginTop: "20px" }}
          onClick={() => setOpenPanel(true)}
        >
          Add Reminder
        </button>
      </div>

      {/* Right Slide Panel */}
      {openPanel && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            width: "360px",
            height: "100vh",
            background: "#fff",
            borderLeft: "1px solid var(--gray-200)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div>
              <h3>Add Reminder</h3>
              <div className="text-muted">
                Schedule a new intelligence task
              </div>
            </div>
            <X
              style={{ cursor: "pointer" }}
              onClick={() => setOpenPanel(false)}
            />
          </div>

          {/* Form */}
          <input
            className="form-input"
            placeholder="Reminder Title"
            style={{ marginBottom: "12px" }}
          />

          <select className="form-input" style={{ marginBottom: "12px" }}>
            <option>Select an employee</option>
            <option>Sarah Jenkins</option>
            <option>Marcus Chen</option>
            <option>Elena Rodriguez</option>
          </select>

          <input
            type="date"
            className="form-input"
            style={{ marginBottom: "12px" }}
          />

          <select className="form-input" style={{ marginBottom: "12px" }}>
            <option>Normal</option>
            <option>High</option>
            <option>Low</option>
          </select>

          <textarea
            className="form-input"
            placeholder="Notes..."
            style={{ height: "100px", marginBottom: "12px" }}
          />

          <div style={{ marginTop: "auto", display: "flex", gap: "10px" }}>
            <button
              className="btn btn-outline"
              style={{ flex: 1 }}
              onClick={() => setOpenPanel(false)}
            >
              Discard
            </button>

            <button className="btn btn-primary" style={{ flex: 1 }}>
              Create Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}