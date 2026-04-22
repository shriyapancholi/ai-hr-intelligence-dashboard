import { useParams, useNavigate } from "react-router-dom";
import { Heart, Shield, Calendar, ArrowLeft, Pencil, X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import API from "../services/api";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DEPARTMENTS = ["Engineering", "Product", "Marketing", "Sales", "Operations", "HR", "Finance", "Design", "Data Science", "Customer Success"];

const ROLES_BY_DEPT = {
  Engineering: ["Software Engineer", "Senior Engineer", "Backend Developer", "Frontend Developer", "Full Stack Developer", "DevOps Engineer", "QA Engineer", "Engineering Manager", "Tech Lead"],
  Product: ["Product Manager", "Senior PM", "Associate PM", "Product Lead", "Director of Product", "Product Analyst"],
  Marketing: ["Marketing Manager", "Content Strategist", "SEO Specialist", "Growth Hacker", "Brand Manager", "Digital Marketer"],
  Sales: ["Sales Rep", "Account Executive", "Sales Manager", "SDR", "BDR", "VP of Sales", "Account Manager"],
  Operations: ["Operations Manager", "Operations Analyst", "Business Analyst", "Process Manager", "Operations Lead"],
  HR: ["HR Manager", "HR Business Partner", "Recruiter", "Talent Acquisition", "HR Coordinator", "People Ops"],
  Finance: ["Financial Analyst", "Accountant", "Finance Manager", "Controller", "FP&A Analyst"],
  Design: ["UI Designer", "UX Designer", "Product Designer", "Senior Designer", "Design Lead", "Creative Director"],
  "Data Science": ["Data Scientist", "ML Engineer", "Data Analyst", "Data Engineer", "AI Researcher"],
  "Customer Success": ["CSM", "Senior CSM", "CS Director", "Onboarding Specialist", "Support Lead"],
};

const inputStyle = (err) => ({
  width: "100%", padding: "8px 10px", borderRadius: "8px", fontSize: "13px",
  border: `1px solid ${err ? "#DC2626" : "var(--gray-300)"}`,
  outline: "none", boxSizing: "border-box", background: "#fff", fontFamily: "inherit",
});
const labelStyle = { fontSize: "13px", fontWeight: 500, color: "var(--gray-700)", display: "block", marginBottom: "5px" };
const fieldWrap = { marginBottom: "14px" };
const errMsg = { fontSize: "12px", color: "#DC2626", marginTop: "4px" };

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([API.get(`employees/${id}`), API.get(`transcripts/employee/${id}`)])
      .then(([empRes, tRes]) => {
        setEmployee(empRes.data);
        setTranscripts(tRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const openEdit = () => {
    setForm({
      name: employee.name || "",
      email: employee.email || "",
      department: employee.department || "",
      role: employee.role || "",
      sentimentScore: employee.sentimentScore ?? "",
      notes: employee.notes || "",
    });
    setErrors({});
    setEditOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Name is required";
    if (!form.email?.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (form.sentimentScore !== "" && (isNaN(form.sentimentScore) || form.sentimentScore < 0 || form.sentimentScore > 10))
      e.sentimentScore = "Must be 0–10";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const payload = { ...form, sentimentScore: form.sentimentScore !== "" ? parseFloat(form.sentimentScore) : undefined };
      const { data } = await API.put(`employees/${id}`, payload);
      setEmployee(data);
      setEditOpen(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Failed to save changes" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [field]: value, ...(field === "department" ? { role: "" } : {}) }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  if (loading) return <div className="text-muted" style={{ padding: "40px" }}>Loading employee profile...</div>;
  if (!employee) return <div className="text-muted" style={{ padding: "40px" }}>Employee not found.</div>;

  const score = employee.sentimentScore || 0;
  const riskLabel = score >= 7 ? "Low" : score >= 5 ? "Medium" : "High";
  const riskClass = score >= 7 ? "badge-success" : score >= 5 ? "badge-warning" : "badge-danger";

  const sentimentByMonth = transcripts.filter((t) => t.sentiment).reduce((acc, t) => {
    const d = new Date(t.meetingDate);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const val = t.sentiment?.toLowerCase() === "positive" ? 9 : t.sentiment?.toLowerCase() === "negative" ? 3 : 6;
    if (!acc[key]) acc[key] = { month: MONTH_NAMES[d.getMonth()], sum: 0, count: 0 };
    acc[key].sum += val;
    acc[key].count += 1;
    return acc;
  }, {});
  const trendData = Object.values(sentimentByMonth).map((e) => ({ month: e.month, value: parseFloat((e.sum / e.count).toFixed(1)) }));

  const lastMeeting = transcripts[0]
    ? new Date(transcripts[0].meetingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "N/A";

  const initials = employee.name?.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <div style={{ display: "flex" }}>
      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px", paddingRight: editOpen ? "390px" : "0", transition: "padding-right 0.25s ease" }}>

        {/* Save success toast */}
        {saveSuccess && (
          <div style={{ position: "fixed", top: "20px", right: "20px", background: "#16A34A", color: "#fff", padding: "12px 20px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", zIndex: 300, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            <Check size={16} /> Changes saved successfully
          </div>
        )}

        <button
          onClick={() => navigate("/employees")}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "var(--gray-500)", fontSize: "13px", fontWeight: 500, padding: 0, width: "fit-content" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--primary)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--gray-500)"}
        >
          <ArrowLeft size={16} /> Back to Employees
        </button>

        {/* Profile header */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ width: "90px", height: "90px", borderRadius: "16px", background: "linear-gradient(135deg,#4F46E5,#6366F1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "28px", fontWeight: "700", flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <h2 style={{ margin: 0 }}>{employee.name}</h2>
                <button
                  onClick={openEdit}
                  style={{ display: "flex", alignItems: "center", gap: "5px", background: "var(--gray-100)", border: "none", borderRadius: "6px", padding: "5px 10px", fontSize: "12px", fontWeight: 500, cursor: "pointer", color: "var(--gray-600)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#EEF2FF"; e.currentTarget.style.color = "#4F46E5"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--gray-100)"; e.currentTarget.style.color = "var(--gray-600)"; }}
                >
                  <Pencil size={13} /> Edit
                </button>
              </div>
              <div className="text-muted" style={{ marginTop: "4px" }}>
                {[employee.role, employee.department, employee.email].filter(Boolean).join(" • ")}
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
                <div className={`badge ${riskClass}`}><Heart size={14} /> Sentiment {score}/10</div>
                <div className={`badge ${riskClass}`}><Shield size={14} /> Risk {riskLabel}</div>
                <div className="badge badge-neutral"><Calendar size={14} /> Last Meeting {lastMeeting}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-3">
          <div className="card">
            <div className="card-header"><h3>Sentiment Trend</h3></div>
            <div style={{ height: "180px", padding: "10px 20px" }}>
              {trendData.length === 0 ? (
                <div className="text-muted" style={{ padding: "40px 0", textAlign: "center" }}>No transcript data yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <XAxis dataKey="month" /><YAxis domain={[0, 10]} /><Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#4F46E5" fill="#EEF2FF" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Employee Details</h3></div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Role", value: employee.role },
                { label: "Department", value: employee.department },
                { label: "Email", value: employee.email },
                { label: "Sentiment Score", value: score > 0 ? `${score}/10` : null },
              ].map(({ label, value }) => value ? (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span className="text-muted">{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ) : null)}
              {employee.notes && (
                <div className="card" style={{ padding: "10px", marginTop: "6px", fontSize: "13px" }}>{employee.notes}</div>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: "20px", background: "linear-gradient(135deg,#4F46E5,#6366F1)", color: "#fff" }}>
            <h3 style={{ color: "#fff" }}>AI Intel Insight</h3>
            <p style={{ marginTop: "10px", fontSize: "13px" }}>
              {score >= 7
                ? `${employee.name} is performing well. Continue monitoring for consistency.`
                : score >= 5
                ? `${employee.name} shows moderate sentiment. Consider a check-in.`
                : `${employee.name} is at high risk. Immediate HR intervention recommended.`}
            </p>
            <div style={{ marginTop: "12px", background: "rgba(255,255,255,0.15)", padding: "10px", borderRadius: "10px" }}>
              Risk of Burnout: {score >= 7 ? "Low" : score >= 5 ? "Moderate" : "High"}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Transcript Archive ({transcripts.length})</h3></div>
          {transcripts.length === 0 ? (
            <div className="text-muted" style={{ padding: "20px" }}>No transcripts yet for this employee.</div>
          ) : (
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {transcripts.map((t) => (
                <div key={t._id} className="card" style={{ padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <strong>{new Date(t.meetingDate).toLocaleDateString()}</strong>
                    {t.sentiment && (
                      <span className={`badge ${t.sentiment.toLowerCase() === "positive" ? "badge-success" : t.sentiment.toLowerCase() === "negative" ? "badge-danger" : "badge-neutral"}`}>
                        {t.sentiment}
                      </span>
                    )}
                  </div>
                  <p className="text-muted" style={{ fontStyle: t.summary ? "normal" : "italic" }}>
                    {t.summary || "No summary available."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit slide-out panel */}
      {editOpen && (
        <div style={{ position: "fixed", right: 0, top: 0, width: "380px", height: "100vh", background: "#fff", borderLeft: "1px solid var(--gray-200)", display: "flex", flexDirection: "column", zIndex: 200, boxShadow: "-4px 0 20px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--gray-200)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h3 style={{ margin: 0 }}>Edit Employee</h3>
              <div className="text-muted" style={{ fontSize: "13px", marginTop: "2px" }}>Update {employee.name}'s details</div>
            </div>
            <button onClick={() => setEditOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", padding: "4px" }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {errors.submit && (
              <div style={{ marginBottom: "14px", color: "#DC2626", fontSize: "13px", background: "#FEF2F2", padding: "10px 12px", borderRadius: "8px" }}>{errors.submit}</div>
            )}

            <div style={fieldWrap}>
              <label style={labelStyle}>Full Name *</label>
              <input style={inputStyle(errors.name)} value={form.name} onChange={handleChange("name")} placeholder="Full name" />
              {errors.name && <div style={errMsg}>{errors.name}</div>}
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Email Address *</label>
              <input style={inputStyle(errors.email)} type="email" value={form.email} onChange={handleChange("email")} placeholder="Email" />
              {errors.email && <div style={errMsg}>{errors.email}</div>}
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Department</label>
              <select style={inputStyle(false)} value={form.department} onChange={handleChange("department")}>
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Role</label>
              <select style={inputStyle(false)} value={form.role} onChange={handleChange("role")} disabled={!form.department}>
                <option value="">{form.department ? "Select role" : "Select department first"}</option>
                {(ROLES_BY_DEPT[form.department] || []).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Sentiment Score (0–10)</label>
              <input style={inputStyle(errors.sentimentScore)} type="number" min="0" max="10" step="0.1" value={form.sentimentScore} onChange={handleChange("sentimentScore")} placeholder="e.g. 7.5" />
              {errors.sentimentScore && <div style={errMsg}>{errors.sentimentScore}</div>}
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Notes</label>
              <textarea style={{ ...inputStyle(false), height: "100px", resize: "vertical" }} value={form.notes} onChange={handleChange("notes")} placeholder="HR notes..." />
            </div>
          </div>

          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--gray-200)", display: "flex", gap: "10px" }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditOpen(false)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
