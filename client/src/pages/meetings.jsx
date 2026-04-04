import { useState, useEffect } from "react";
import { Calendar, Sparkles } from "lucide-react";

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const [newMeeting, setNewMeeting] = useState({
    name: "",
    date: "",
    time: "",
  });

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("meetings")) || [];
    setMeetings(saved);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("meetings", JSON.stringify(meetings));
  }, [meetings]);

  // Add meeting
  const handleAddMeeting = () => {
    if (!newMeeting.name || !newMeeting.date) {
      alert("Please fill all fields");
      return;
    }

    const newEntry = {
      ...newMeeting,
      status: "Upcoming",
    };

    setMeetings([...meetings, newEntry]);

    setNewMeeting({ name: "", date: "", time: "" });
    setShowForm(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Meetings</h1>
          <p>Manage and prepare employee conversations.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Schedule Meeting
        </button>
      </div>

      {/* Grid */}
      <div className="grid-2">

        {/* Upcoming */}
        <div className="card">
          <div className="card-header">
            <h3>Upcoming Meetings</h3>
          </div>

          <div style={{ padding: "20px" }}>
            {meetings.filter(m => m.status === "Upcoming").length === 0 && (
              <div className="text-muted">No meetings scheduled</div>
            )}

            {meetings
              .filter((m) => m.status === "Upcoming")
              .map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid var(--gray-200)",
                  }}
                >
                  <strong>{m.name}</strong>

                  <div className="text-muted" style={{ marginTop: "4px" }}>
                    <Calendar size={14} /> {m.date} {m.time}
                  </div>

                  <button
                    className="btn btn-outline"
                    style={{ marginTop: "10px" }}
                    onClick={() => setSelected(m)}
                  >
                    Prepare
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Past / AI */}
        <div className="card">
          <div className="card-header">
            <h3>AI Insights</h3>
          </div>

          <div style={{ padding: "20px" }}>
            {meetings.length === 0 && (
              <div className="text-muted">No data yet</div>
            )}

            {meetings.map((m, i) => (
              <div key={i} style={{ marginBottom: "15px" }}>
                <strong>{m.name}</strong>

                <div className="text-muted" style={{ marginTop: "4px" }}>
                  <Calendar size={14} /> {m.date}
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid var(--gray-200)",
                    background: "var(--gray-50)",
                  }}
                >
                  <Sparkles size={14} /> <strong>AI Suggestion</strong>

                  <div className="text-muted" style={{ marginTop: "6px" }}>
                    Discuss workload, career growth and team alignment.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 🔥 Schedule Form */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="card" style={{ width: "350px", padding: "20px" }}>
            <h3>Schedule Meeting</h3>

            <input
              placeholder="Employee Name"
              value={newMeeting.name}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, name: e.target.value })
              }
              style={{ width: "100%", marginTop: "10px", padding: "8px" }}
            />

            <input
              type="date"
              value={newMeeting.date}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, date: e.target.value })
              }
              style={{ width: "100%", marginTop: "10px", padding: "8px" }}
            />

            <input
              type="time"
              value={newMeeting.time}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, time: e.target.value })
              }
              style={{ width: "100%", marginTop: "10px", padding: "8px" }}
            />

            <button
              className="btn btn-primary"
              style={{ marginTop: "15px" }}
              onClick={handleAddMeeting}
            >
              Save Meeting
            </button>

            <button
              className="btn btn-outline"
              style={{ marginTop: "10px" }}
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 🔥 Prepare Popup */}
      {selected && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="card" style={{ width: "400px", padding: "20px" }}>
            <h3>Prepare for {selected.name}</h3>

            <ul style={{ marginTop: "10px", paddingLeft: "18px" }}>
              <li>Ask about workload</li>
              <li>Discuss career goals</li>
              <li>Check team issues</li>
            </ul>

            <button
              className="btn btn-primary"
              style={{ marginTop: "15px" }}
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}