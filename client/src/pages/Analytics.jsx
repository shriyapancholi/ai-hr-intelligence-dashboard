import {
  Star,
  Smile,
  AlertTriangle,
  
  Calendar
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

const engagementData = [
  { month: "Jan", value: 5 },
  { month: "Mar", value: 4 },
  { month: "May", value: 7 },
  { month: "Jul", value: 4 },
  { month: "Sep", value: 9 },
  { month: "Nov", value: 6 },
];

const sentimentData = [
  { name: "Positive", value: 65 },
  { name: "Neutral", value: 25 },
  { name: "Negative", value: 10 },
];

const riskData = [
  { name: "Low", value: 65 },
  { name: "Medium", value: 25 },
  { name: "High", value: 10 },
];

const COLORS = ["#4F46E5", "#CBD5F5", "#E5E7EB"];
const RISK_COLORS = ["#22C55E", "#F59E0B", "#DC2626"];

export default function Analytics() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Analytics Central</h1>
          <p>
            Comprehensive overview of workforce health and organizational
            performance.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <Star size={18} />
          <div style={{ fontSize: "26px", fontWeight: "700" }}>
            7.8 / 10
          </div>
          <div className="text-muted">Average Engagement Score</div>
        </div>

        <div className="stat-card">
          <Smile size={18} />
          <div style={{ fontSize: "26px", fontWeight: "700" }}>
            8.2 / 10
          </div>
          <div className="text-muted">Average Sentiment</div>
        </div>

        <div className="stat-card">
          <AlertTriangle size={18} />
          <div style={{ fontSize: "26px", fontWeight: "700" }}>
            12
          </div>
          <div className="text-muted">Employees At Risk</div>
        </div>

        <div className="stat-card">
          <Calendar size={18} />
          <div style={{ fontSize: "26px", fontWeight: "700" }}>
            342
          </div>
          <div className="text-muted">Meetings This Quarter</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2">

        {/* Engagement Trend */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Engagement Score Trend</h3>
              <p className="text-muted">
                Monthly velocity over the past year
              </p>
            </div>
          </div>

          <div style={{ height: "260px", padding: "10px 20px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
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

        {/* Sentiment Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Sentiment Distribution</h3>
              <p className="text-muted">
                AI-analyzed communication tone
              </p>
            </div>
          </div>

          <div style={{ height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ padding: "0 20px 20px" }}>
            {sentimentData.map((d) => (
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

      {/* Bottom Row */}
      <div className="grid-3">

        {/* Department Performance */}
        <div className="card">
          <div className="card-header">
            <h3>Department Performance</h3>
          </div>

          <div style={{ padding: "20px" }}>
            {[
              { name: "Engineering", value: 94 },
              { name: "Product", value: 88 },
              { name: "Marketing", value: 82 },
              { name: "Sales", value: 76 },
              { name: "Operations", value: 91 },
            ].map((dept) => (
              <div key={dept.name} style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                  }}
                >
                  <span>{dept.name}</span>
                  <span>{dept.value}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${dept.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meeting Frequency */}
        <div className="card">
          <div className="card-header">
            <h3>Meeting Frequency</h3>
          </div>

          <div style={{ padding: "20px", color: "var(--gray-500)" }}>
            May saw a 22% increase in cross-functional syncs.
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="card">
          <div className="card-header">
            <h3>Risk Distribution</h3>
          </div>

          <div style={{ height: "200px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={70}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={index} fill={RISK_COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ padding: "10px 20px 20px" }}>
            {riskData.map((d) => (
              <div key={d.name} style={{ marginBottom: "6px" }}>
                {d.name}: {d.value}%
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}