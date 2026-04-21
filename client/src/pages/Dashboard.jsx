import {
  Users,
  Calendar,
  Smile,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Download,
  Sparkles,
  FileText,
  X
} from "lucide-react";

import { useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const sentimentData = [
  { month: "Jan", value: 6 },
  { month: "Feb", value: 6.2 },
  { month: "Mar", value: 7.5 },
  { month: "Apr", value: 8.4 },
  { month: "May", value: 7.8 },
  { month: "Jun", value: 8.2 },
];

const deptData = [
  { name: "Engineering", value: 42 },
  { name: "Product", value: 28 },
  { name: "Marketing", value: 18 },
  { name: "Others", value: 12 },
];

const COLORS = ["#4F46E5", "#818CF8", "#94A3B8", "#CBD5F5"];

const insights = [
  {
    title: "Engineering Burnout Risk",
    tag: "HIGH PRIORITY",
    color: "var(--danger)",
    desc:
      "High meeting density detected in the Backend Team. Collaborative overhead exceeded 35 hours per week per engineer.",
  },
  {
    title: "Positive Sentiment Peak",
    tag: "POSITIVE",
    color: "var(--success)",
    desc:
      "Marketing team sentiment reached a 12-month high after the recent Spring Launch.",
  },
  {
    title: "Transcript Summary Ready",
    tag: "INFORMATION",
    color: "var(--accent)",
    desc:
      "AI has summarized the Q4 Strategic Planning meeting. Action items extracted.",
  },
];

export default function Dashboard() {
  const [toast, setToast] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [generatedInsights, setGeneratedInsights] = useState(null);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      const reportData = {
        id: Date.now().toString(),
        title: `HR Report - ${new Date().toLocaleString()}`,
        timestamp: new Date().toISOString(),
        kpi: {
          totalEmployees: 450,
          meetingsThisMonth: 124,
          averageSentiment: 8.2,
          employeesAtRisk: 12
        },
        sentimentData,
        deptData,
        insights
      };

      const existingReports = JSON.parse(localStorage.getItem("hr_reports") || "[]");
      localStorage.setItem("hr_reports", JSON.stringify([reportData, ...existingReports]));

      setIsGenerating(false);
      setToast("Report Generated Successfully!");
      setTimeout(() => setToast(null), 3000);
    }, 1000);
  };

  const handleGenerateInsights = () => {
    setIsGeneratingInsights(true);
    setShowInsightsModal(true);
    setGeneratedInsights(null);

    // Simulate AI generation
    setTimeout(() => {
      setGeneratedInsights([
        "Employee sentiment is steadily improving, specifically in Marketing after the Spring Launch.",
        "Engineering team shows higher burnout risk due to a 20% increase in meeting density.",
        "Product team engagement remains stable, with minor fluctuations.",
        "Overall collaborative overhead has increased, suggesting a need for a \"no-meeting\" day."
      ]);
      setIsGeneratingInsights(false);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative" }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "var(--success)",
          color: "white",
          padding: "12px 24px",
          borderRadius: "8px",
          boxShadow: "var(--shadow-md)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          animation: "fadeIn 0.3s ease"
        }}>
          <FileText size={18} />
          <span style={{ fontWeight: 500 }}>{toast}</span>
        </div>
      )}

      {/* AI Insights Modal */}
      {showInsightsModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            background: "white",
            width: "500px",
            maxWidth: "90%",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            boxShadow: "var(--shadow-lg)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={20} color="var(--primary)" /> API Insights
              </h2>
              <button 
                onClick={() => setShowInsightsModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-500)" }}
              >
                <X size={20} />
              </button>
            </div>

            {isGeneratingInsights ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0", gap: "16px" }}>
                <div style={{ 
                  width: "30px", height: "30px", 
                  border: "3px solid var(--gray-200)", 
                  borderTopColor: "var(--primary)", 
                  borderRadius: "50%", 
                  animation: "spin 1s linear infinite" 
                }} />
                <p className="text-muted">Analyzing organizational data...</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {generatedInsights?.map((insight, index) => (
                  <div key={index} style={{
                    padding: "16px",
                    background: "var(--primary-light)",
                    borderLeft: "4px solid var(--primary)",
                    borderRadius: "4px 8px 8px 4px",
                    color: "var(--gray-800)"
                  }}>
                    {insight}
                  </div>
                ))}
                <button 
                  onClick={() => setShowInsightsModal(false)}
                  className="btn btn-primary" 
                  style={{ width: "100%", marginTop: "12px", justifyContent: "center" }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inline styles for simple animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>


      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Intelligence Overview</h1>
          <p>
            Monitor organizational health and real-time AI-driven sentiment
            markers.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            className="btn btn-outline" 
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "14px", height: "14px", border: "2px solid #ccc", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                Generating...
              </span>
            ) : (
              <><FileText size={16} /> Generate Report</>
            )}
          </button>
          <button className="btn btn-primary" onClick={handleGenerateInsights}>
            <Sparkles size={16} /> Generate AI Insights
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <Users size={18} />
          <div style={{ fontSize: "28px", fontWeight: "700" }}>450</div>
          <div className="text-muted">Total Employees</div>
        </div>

        <div className="stat-card">
          <Calendar size={18} />
          <div style={{ fontSize: "28px", fontWeight: "700" }}>124</div>
          <div className="text-muted">Meetings This Month</div>
        </div>

        <div className="stat-card">
          <Smile size={18} />
          <div style={{ fontSize: "28px", fontWeight: "700" }}>8.2</div>
          <div className="text-muted">Average Sentiment</div>
        </div>

        <div className="stat-card">
          <AlertTriangle size={18} />
          <div style={{ fontSize: "28px", fontWeight: "700" }}>12</div>
          <div className="text-muted">Employees At Risk</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2">
        {/* Sentiment Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Sentiment Trend</h3>
              <p className="text-muted">
                Monthly engagement fluctuations
              </p>
            </div>
          </div>

          <div style={{ height: "250px", padding: "10px 20px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  fill="#EEF2FF"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Pie */}
        <div className="card">
          <div className="card-header">
            <h3>By Department</h3>
          </div>

          <div style={{ height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                >
                  {deptData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ padding: "0 20px 20px" }}>
            {deptData.map((d) => (
              <div
                key={d.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <span>{d.name}</span>
                <span>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Insights */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3>Recent Insights</h3>
            <p className="text-muted">
              Automated intelligence summaries from the last 24 hours.
            </p>
          </div>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {insights.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid var(--gray-200)",
                background: "var(--gray-50)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <strong>{item.title}</strong>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "999px",
                    background: item.color,
                    color: "#fff",
                  }}
                >
                  {item.tag}
                </span>
              </div>
              <div className="text-muted">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}