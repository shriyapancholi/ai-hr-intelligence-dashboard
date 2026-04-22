import { useState, useEffect } from "react";
import { Calendar, FileText, Shield, X, Check } from "lucide-react";
import API from "../services/api";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [openPanel, setOpenPanel] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", employeeId: "", date: "", priority: "Normal", notes: "" });

  useEffect(() => {
    API.get("reminders").then(({ data }) => setReminders(data)).catch(() => {});
    API.get("employees").then(({ data }) => setEmployees(data.employees || [])).catch(() => {});
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.date) return;
    setSaving(true);
    try {
      const emp = employees.find((e) => e._id === form.employeeId);
      const { data } = await API.post("reminders", { ...form, employeeName: emp?.name || "" });
      setReminders((prev) => [data, ...prev]);
      setOpenPanel(false);
      setForm({ title: "", employeeId: "", date: "", priority: "Normal", notes: "" });
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const toggleDone = async (reminder) => {
    const newStatus = reminder.status === "Done" ? "Pending" : "Done";
    try {
      const { data } = await API.put(`reminders/${reminder._id}`, { status: newStatus });
      setReminders((prev) => prev.map((r) => r._id === reminder._id ? data : r));
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`reminders/${id}`);
      setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch {}
  };

  const iconFor = (title) => {
    const t = title?.toLowerCase() || "";
    if (t.includes("review") || t.includes("performance")) return <Calendar size={18} />;
    if (t.includes("compliance") || t.includes("audit")) return <Shield size={18} />;
    return <FileText size={18} />;
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, paddingRight: openPanel ? "360px" : "0" }}>
        <div style={{ marginBottom: "20px" }}>
          <h1>Reminders</h1>
          <p className="text-muted">Active HR tasks requiring attention</p>
        </div>

        {reminders.length === 0 ? (
          <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--gray-400)" }}>
            No reminders yet. Add one to get started.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {reminders.map((rem) => (
              <div className="card" key={rem._id} style={{ padding: "16px", opacity: rem.status === "Done" ? 0.6 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div className="icon-box">{iconFor(rem.title)}</div>
                    <div>
                      <div style={{ fontWeight: "600", textDecoration: rem.status === "Done" ? "line-through" : "none" }}>{rem.title}</div>
                      <div className="text-muted">
                        {rem.employeeName || "General"} • {new Date(rem.date).toLocaleDateString()} • {rem.priority}
                      </div>
                      {rem.notes && <div className="text-muted" style={{ fontSize: "12px", marginTop: "4px" }}>{rem.notes}</div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span className={`badge ${rem.status === "Done" ? "badge-success" : "badge-warning"}`}>{rem.status}</span>
                    <button onClick={() => toggleDone(rem)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--success)" }} title="Toggle done">
                      <Check size={16} />
                    </button>
                    <button onClick={() => handleDelete(rem._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)" }} title="Delete">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="btn btn-primary" style={{ marginTop: "20px" }} onClick={() => setOpenPanel(true)}>
          Add Reminder
        </button>
      </div>

      {openPanel && (
        <div style={{ position: "fixed", right: 0, top: 0, width: "360px", height: "100vh", background: "#fff", borderLeft: "1px solid var(--gray-200)", padding: "20px", display: "flex", flexDirection: "column", zIndex: 100 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h3>Add Reminder</h3>
              <div className="text-muted">Schedule a new HR task</div>
            </div>
            <X style={{ cursor: "pointer" }} onClick={() => setOpenPanel(false)} />
          </div>

          <input className="form-input" placeholder="Reminder Title *" style={{ marginBottom: "12px" }} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <select className="form-input" style={{ marginBottom: "12px" }} value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
            <option value="">Select an employee (optional)</option>
            {employees.map((emp) => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
          </select>

          <input type="date" className="form-input" style={{ marginBottom: "12px" }} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />

          <select className="form-input" style={{ marginBottom: "12px" }} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option>Normal</option>
            <option>High</option>
            <option>Low</option>
          </select>

          <textarea className="form-input" placeholder="Notes..." style={{ height: "100px", marginBottom: "12px" }} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

          <div style={{ marginTop: "auto", display: "flex", gap: "10px" }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setOpenPanel(false)}>Discard</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreate} disabled={saving}>
              {saving ? "Saving..." : "Create Task"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
