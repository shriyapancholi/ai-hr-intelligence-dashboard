import { useState, useEffect } from "react";
import { Search, UserPlus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

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

const EMPTY_FORM = { name: "", email: "", department: "", role: "", sentimentScore: "", notes: "" };

const riskColor = (score) => score >= 7 ? "badge-success" : score >= 5 ? "badge-warning" : "badge-danger";
const riskLabel = (score) => score >= 7 ? "Low" : score >= 5 ? "Medium" : "High";
const initials = (name) => name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openPanel, setOpenPanel] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("employees")
      .then(({ data }) => setEmployees(data.employees || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.department) e.department = "Department is required";
    if (!form.role) e.role = "Role is required";
    if (form.sentimentScore !== "" && (isNaN(form.sentimentScore) || form.sentimentScore < 0 || form.sentimentScore > 10))
      e.sentimentScore = "Must be between 0 and 10";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const payload = { ...form, sentimentScore: form.sentimentScore !== "" ? parseFloat(form.sentimentScore) : undefined };
      const { data } = await API.post("employees", payload);
      setEmployees((prev) => [data, ...prev]);
      setOpenPanel(false);
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Failed to add employee" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [field]: value, ...(field === "department" ? { role: "" } : {}) }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const closePanel = () => { setOpenPanel(false); setForm(EMPTY_FORM); setErrors({}); };

  const filtered = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(search.toLowerCase()) ||
    emp.department?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = (hasError) => ({
    width: "100%", padding: "8px 10px", borderRadius: "8px", fontSize: "13px",
    border: `1px solid ${hasError ? "#DC2626" : "var(--gray-300)"}`,
    outline: "none", boxSizing: "border-box", background: "#fff", fontFamily: "inherit",
  });

  const labelStyle = { fontSize: "13px", fontWeight: 500, color: "var(--gray-700)", display: "block", marginBottom: "5px" };
  const fieldWrap = { marginBottom: "14px" };
  const errorMsg = { fontSize: "12px", color: "#DC2626", marginTop: "4px" };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px", paddingRight: openPanel ? "380px" : "0", transition: "padding-right 0.25s ease" }}>
        <div className="page-header">
          <h1>Employees</h1>
          <button className="btn btn-primary" onClick={() => setOpenPanel(true)}>
            <UserPlus size={16} /> Add Employee
          </button>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <div className="search-bar" style={{ width: "300px" }}>
            <Search size={16} />
            <input placeholder="Search by name or department..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="card">
          <div className="table-wrapper">
            {loading ? (
              <div className="text-muted" style={{ padding: "40px", textAlign: "center" }}>Loading employees...</div>
            ) : filtered.length === 0 ? (
              <div className="text-muted" style={{ padding: "40px", textAlign: "center" }}>
                {employees.length === 0 ? "No employees yet. Add one to get started." : "No employees match your search."}
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Employee</th><th>Department</th><th>Role</th><th>Sentiment</th><th>Notes</th><th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp) => (
                    <tr key={emp._id} onClick={() => navigate(`/employee-profile/${emp._id}`)} style={{ cursor: "pointer" }}>
                      <td>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#4F46E5,#6366F1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>
                            {initials(emp.name)}
                          </div>
                          <div>
                            <div>{emp.name}</div>
                            <div className="text-muted">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{emp.department || "—"}</td>
                      <td>{emp.role || "—"}</td>
                      <td>
                        <div className="score-bar">
                          <span>{emp.sentimentScore ?? "—"}</span>
                          <div className="bar"><div className="fill" style={{ width: `${(emp.sentimentScore || 0) * 10}%` }} /></div>
                        </div>
                      </td>
                      <td style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.notes || "—"}</td>
                      <td><span className={`badge ${riskColor(emp.sentimentScore)}`}>{riskLabel(emp.sentimentScore)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div style={{ padding: "16px", color: "var(--gray-400)", fontSize: "13px" }}>
            Showing {filtered.length} of {employees.length} employees
          </div>
        </div>
      </div>

      {openPanel && (
        <div style={{ position: "fixed", right: 0, top: 0, width: "370px", height: "100vh", background: "#fff", borderLeft: "1px solid var(--gray-200)", display: "flex", flexDirection: "column", zIndex: 200, boxShadow: "-4px 0 20px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--gray-200)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h3 style={{ margin: 0 }}>Add Employee</h3>
              <div className="text-muted" style={{ fontSize: "13px", marginTop: "2px" }}>Fill in the employee's details</div>
            </div>
            <button onClick={closePanel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", padding: "4px" }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {errors.submit && (
              <div style={{ marginBottom: "14px", color: "#DC2626", fontSize: "13px", background: "#FEF2F2", padding: "10px 12px", borderRadius: "8px" }}>{errors.submit}</div>
            )}

            <div style={fieldWrap}>
              <label style={labelStyle}>Full Name *</label>
              <input style={inputStyle(errors.name)} placeholder="e.g. Jane Smith" value={form.name} onChange={handleChange("name")} />
              {errors.name && <div style={errorMsg}>{errors.name}</div>}
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Email Address *</label>
              <input style={inputStyle(errors.email)} type="email" placeholder="e.g. jane@company.com" value={form.email} onChange={handleChange("email")} />
              {errors.email && <div style={errorMsg}>{errors.email}</div>}
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Department *</label>
              <select style={inputStyle(errors.department)} value={form.department} onChange={handleChange("department")}>
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <div style={errorMsg}>{errors.department}</div>}
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Role *</label>
              <select style={inputStyle(errors.role)} value={form.role} onChange={handleChange("role")} disabled={!form.department}>
                <option value="">{form.department ? "Select role" : "Select department first"}</option>
                {(ROLES_BY_DEPT[form.department] || []).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.role && <div style={errorMsg}>{errors.role}</div>}
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Sentiment Score (0–10)</label>
              <input style={inputStyle(errors.sentimentScore)} type="number" min="0" max="10" step="0.1" placeholder="e.g. 7.5  (optional)" value={form.sentimentScore} onChange={handleChange("sentimentScore")} />
              {errors.sentimentScore && <div style={errorMsg}>{errors.sentimentScore}</div>}
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Notes</label>
              <textarea style={{ ...inputStyle(false), height: "90px", resize: "vertical" }} placeholder="Any HR notes about this employee..." value={form.notes} onChange={handleChange("notes")} />
            </div>
          </div>

          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--gray-200)", display: "flex", gap: "10px" }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={closePanel}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={saving}>
              {saving ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
