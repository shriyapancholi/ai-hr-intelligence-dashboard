import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function Reminders() {
  const [reminders, setReminders] = useState([
    { text: "Schedule meeting with HR team", date: "2026-04-02" }
  ]);

  const [task, setTask] = useState("");
  const [date, setDate] = useState("");

  const addReminder = () => {
    if (!task || !date) return;

    setReminders([...reminders, { text: task, date }]);
    setTask("");
    setDate("");
  };

  return (
    <div style={{ display: "flex", background: "#f1f5f9" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: 30 }}>
          <h2 style={{ marginBottom: 20 }}>Reminders ⏰</h2>

          {/* Add Reminder Card */}
          <div style={card}>
            <h3>Add Reminder</h3>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <input
                placeholder="Enter task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                style={input}
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={input}
              />

              <button onClick={addReminder} style={btn}>
                Add
              </button>
            </div>
          </div>

          {/* Reminder List */}
          <div style={{ marginTop: 20 }}>
            {reminders.map((r, i) => (
              <div key={i} style={reminderCard}>
                <div>
                  <h4 style={{ margin: 0 }}>{r.text}</h4>
                  <p style={{ margin: 0, color: "#64748b" }}>{r.date}</p>
                </div>

                <button
                  onClick={() =>
                    setReminders(reminders.filter((_, idx) => idx !== i))
                  }
                  style={deleteBtn}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

/* Styles */

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};

const reminderCard = {
  background: "white",
  padding: 15,
  borderRadius: 10,
  marginBottom: 10,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
};

const input = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #cbd5e1"
};

const btn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: 8
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6
};