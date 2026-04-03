import {
  Users,
  Calendar,
  Smile,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Download,
  Sparkles
} from "lucide-react";

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
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

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
          <button className="btn btn-outline">
            <Download size={16} /> Download Report
          </button>
          <button className="btn btn-primary">
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