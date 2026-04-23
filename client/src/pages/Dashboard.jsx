import { Users, Calendar, Smile, AlertTriangle, FileText, Sparkles, X, Bell, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import API from "../services/api";

const DEPT_COLORS = [
  "#4F46E5", "#7C3AED", "#DB2777", "#EA580C", "#16A34A",
  "#0891B2", "#CA8A04", "#DC2626", "#9333EA", "#059669",
  "#0284C7", "#B45309",
];

const PRIORITY_COLOR = { High: "#DC2626", Normal: "#4F46E5", Low: "#64748B" };

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats]                           = useState(null);
  const [loading, setLoading]                       = useState(true);
  const [toast, setToast]                           = useState(null);
  const [isGenerating, setIsGenerating]             = useState(false);
  const [showInsightsModal, setShowInsightsModal]   = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [generatedInsights, setGeneratedInsights]   = useState(null);
  const [dueReminders, setDueReminders]             = useState([]);
  const [showReminderPopup, setShowReminderPopup]   = useState(false);

  useEffect(() => {
    API.get("stats")
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));

    // fetch pending reminders due today or tomorrow
    API.get("reminders").then(({ data }) => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);

      const due = data.filter((r) => {
        if (r.status === "Done") return false;
        const d = new Date(r.date); d.setHours(0, 0, 0, 0);
        return d >= today && d < dayAfter;
      });

      if (due.length > 0) {
        setDueReminders(due);
        setShowReminderPopup(true);
      }
    }).catch(() => {});
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const reportData = {
        id: Date.now().toString(),
        title: `HR Report - ${new Date().toLocaleString()}`,
        timestamp: new Date().toISOString(),
        kpi: {
          totalEmployees: stats?.totalEmployees ?? 0,
          meetingsThisMonth: stats?.meetingsThisMonth ?? 0,
          averageSentiment: stats?.avgSentiment ?? 0,
          employeesAtRisk: stats?.atRisk ?? 0,
        },
        sentimentData: stats?.sentimentTrend ?? [],
        deptData: stats?.departments ?? [],
      };
      const existing = JSON.parse(localStorage.getItem("hr_reports") || "[]");
      localStorage.setItem("hr_reports", JSON.stringify([reportData, ...existing]));
      setToast("Report Generated Successfully!");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    setShowInsightsModal(true);
    setGeneratedInsights(null);
    try {
      const { data } = await API.post("ai/chat", {
        message: "Give me 4 key HR insights about the organization based on the current employee data, sentiment scores, and meeting activity. Format each as a single concise sentence.",
      });
      const lines = data.reply.split("\n").filter((l) => l.trim());
      setGeneratedInsights(lines);
    } catch {
      setGeneratedInsights(["AI insights are unavailable. Please configure your ANTHROPIC_API_KEY."]);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const kpi = [
    { icon: <Users size={18} />, value: loading ? "..." : stats?.totalEmployees ?? 0, label: "Total Employees" },
    { icon: <Calendar size={18} />, value: loading ? "..." : stats?.meetingsThisMonth ?? 0, label: "Meetings This Month" },
    { icon: <Smile size={18} />, value: loading ? "..." : stats?.avgSentiment ?? 0, label: "Average Sentiment" },
    { icon: <AlertTriangle size={18} />, value: loading ? "..." : stats?.atRisk ?? 0, label: "Employees At Risk" },
  ];

  const sentimentTrend = stats?.sentimentTrend ?? [];
  const departments = stats?.departments ?? [];

  const dismissReminderPopup = () => {
    const ids = dueReminders.map((r) => r._id);
    const prev = JSON.parse(sessionStorage.getItem("dismissedReminders") || "[]");
    sessionStorage.setItem("dismissedReminders", JSON.stringify([...prev, ...ids]));
    setShowReminderPopup(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Reminder popup ── */}
      {showReminderPopup && dueReminders.length > 0 && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={dismissReminderPopup}
        >
          <div
            style={{ background: "white", borderRadius: "18px", width: "460px", maxWidth: "92vw", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", animation: "slideUp 0.25s ease", overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bell size={18} color="white" />
                </div>
                <div>
                  <div style={{ color: "white", fontWeight: "700", fontSize: "16px" }}>
                    {dueReminders.length === 1 ? "Upcoming Reminder" : `${dueReminders.length} Upcoming Reminders`}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px" }}>Due today or tomorrow</div>
                </div>
              </div>
              <button onClick={dismissReminderPopup} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "white", display: "flex" }}>
                <X size={16} />
              </button>
            </div>

            {/* reminder list */}
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "320px", overflowY: "auto" }}>
              {dueReminders.map((r) => {
                const rDate = new Date(r.date); rDate.setHours(0, 0, 0, 0);
                const today = new Date(); today.setHours(0, 0, 0, 0);
                const isToday = rDate.getTime() === today.getTime();
                return (
                  <div key={r._id} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "14px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: PRIORITY_COLOR[r.priority] || "#4F46E5", marginTop: "6px", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: "600", fontSize: "14px", color: "#0F172A" }}>{r.title}</div>
                      {r.employeeName && <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{r.employeeName}</div>}
                      {r.notes && <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.notes}</div>}
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "20px", background: isToday ? "#FEF2F2" : "#FFF7ED", color: isToday ? "#DC2626" : "#D97706" }}>
                        {isToday ? "Today" : "Tomorrow"}
                      </span>
                      <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>{r.priority} priority</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* footer */}
            <div style={{ padding: "14px 16px", borderTop: "1px solid #E2E8F0", display: "flex", gap: "8px" }}>
              <button
                onClick={() => { dismissReminderPopup(); navigate("/reminders"); }}
                style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "#4F46E5", color: "white", border: "none", fontWeight: "600", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                View Reminders <ChevronRight size={14} />
              </button>
              <button
                onClick={dismissReminderPopup}
                style={{ padding: "10px 16px", borderRadius: "10px", background: "white", color: "#64748B", border: "1px solid #E2E8F0", fontWeight: "500", fontSize: "13px", cursor: "pointer" }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", top: "20px", right: "20px", background: "var(--success)", color: "white", padding: "12px 24px", borderRadius: "8px", boxShadow: "var(--shadow-md)", zIndex: 1000, display: "flex", alignItems: "center", gap: "8px", animation: "fadeIn 0.3s ease" }}>
          <FileText size={18} /><span style={{ fontWeight: 500 }}>{toast}</span>
        </div>
      )}

      {showInsightsModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", width: "500px", maxWidth: "90%", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={20} color="var(--primary)" /> AI Insights
              </h2>
              <button onClick={() => setShowInsightsModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-500)" }}>
                <X size={20} />
              </button>
            </div>
            {isGeneratingInsights ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0", gap: "16px" }}>
                <div style={{ width: "30px", height: "30px", border: "3px solid var(--gray-200)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <p className="text-muted">Analyzing organizational data...</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {generatedInsights?.map((insight, i) => (
                  <div key={i} style={{ padding: "16px", background: "var(--primary-light)", borderLeft: "4px solid var(--primary)", borderRadius: "4px 8px 8px 4px", color: "var(--gray-800)" }}>
                    {insight}
                  </div>
                ))}
                <button onClick={() => setShowInsightsModal(false)} className="btn btn-primary" style={{ width: "100%", marginTop: "12px", justifyContent: "center" }}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1>Intelligence Overview</h1>
          <p>Monitor organizational health and real-time AI-driven sentiment markers.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-outline" onClick={handleGenerateReport} disabled={isGenerating || loading}>
            {isGenerating ? <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "14px", height: "14px", border: "2px solid #ccc", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />Generating...</span> : <><FileText size={16} /> Generate Report</>}
          </button>
          <button className="btn btn-primary" onClick={handleGenerateInsights}>
            <Sparkles size={16} /> Generate AI Insights
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {kpi.map((k, i) => (
          <div className="stat-card" key={i}>
            {k.icon}
            <div style={{ fontSize: "28px", fontWeight: "700" }}>{k.value}</div>
            <div className="text-muted">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Sentiment Trend</h3>
              <p className="text-muted">Monthly engagement from transcripts</p>
            </div>
          </div>
          <div style={{ height: "250px", padding: "10px 20px" }}>
            {sentimentTrend.length === 0 ? (
              <div className="text-muted" style={{ padding: "60px 0", textAlign: "center" }}>No transcript data yet. Upload transcripts to see trends.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sentimentTrend}>
                  <XAxis dataKey="month" /><YAxis domain={[0, 10]} /><Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#4F46E5" fill="#EEF2FF" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>By Department</h3></div>
          {departments.length === 0 ? (
            <div className="text-muted" style={{ padding: "60px 20px", textAlign: "center" }}>No employee data yet.</div>
          ) : (
            <>
              <div style={{ height: "200px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={departments} dataKey="value" innerRadius={60} outerRadius={80}>
                      {departments.map((_, index) => <Cell key={index} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ padding: "0 20px 20px" }}>
                {departments.map((d, index) => (
                  <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: DEPT_COLORS[index % DEPT_COLORS.length], flexShrink: 0 }} />
                      <span>{d.name}</span>
                    </div>
                    <span style={{ fontWeight: "600" }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Quick Stats</h3>
            <p className="text-muted">Live numbers from your database.</p>
          </div>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { title: "Total Employees", desc: `${stats?.totalEmployees ?? 0} employees currently in the system.`, color: "var(--accent)" },
            { title: "At-Risk Employees", desc: `${stats?.atRisk ?? 0} employees with sentiment score below 5.`, color: "var(--danger)" },
            { title: "Meetings This Month", desc: `${stats?.meetingsThisMonth ?? 0} meetings scheduled this month.`, color: "var(--success)" },
          ].map((item, i) => (
            <div key={i} style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--gray-200)", background: "var(--gray-50)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <strong>{item.title}</strong>
              </div>
              <div className="text-muted">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
