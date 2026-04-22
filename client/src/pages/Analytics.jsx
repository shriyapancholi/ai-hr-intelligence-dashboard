import { Star, Smile, AlertTriangle, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import API from "../services/api";

const COLORS = ["#4F46E5", "#CBD5F5", "#E5E7EB"];
const RISK_COLORS = ["#22C55E", "#F59E0B", "#DC2626"];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("analytics")
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpi = [
    { icon: <Star size={18} />, value: loading ? "..." : `${data?.avgEngagement ?? 0} / 10`, label: "Avg Engagement Score" },
    { icon: <Smile size={18} />, value: loading ? "..." : `${data?.avgSentiment ?? 0} / 10`, label: "Average Sentiment" },
    { icon: <AlertTriangle size={18} />, value: loading ? "..." : data?.atRisk ?? 0, label: "Employees At Risk" },
    { icon: <Calendar size={18} />, value: loading ? "..." : data?.meetingsThisQuarter ?? 0, label: "Meetings This Quarter" },
  ];

  const engagementTrend = data?.engagementTrend ?? [];
  const sentimentDist = data?.sentimentDist ?? [];
  const riskData = data?.riskData ?? [];
  const deptPerformance = data?.deptPerformance ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="page-header">
        <div>
          <h1>Analytics Central</h1>
          <p>Comprehensive overview of workforce health and organizational performance.</p>
        </div>
      </div>

      <div className="stats-grid">
        {kpi.map((k, i) => (
          <div className="stat-card" key={i}>
            {k.icon}
            <div style={{ fontSize: "26px", fontWeight: "700" }}>{k.value}</div>
            <div className="text-muted">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Engagement Score Trend</h3>
              <p className="text-muted">Monthly sentiment from transcripts</p>
            </div>
          </div>
          <div style={{ height: "260px", padding: "10px 20px" }}>
            {engagementTrend.length === 0 ? (
              <div className="text-muted" style={{ padding: "80px 0", textAlign: "center" }}>No transcript data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementTrend}>
                  <XAxis dataKey="month" /><YAxis domain={[0, 10]} /><Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#4F46E5" fill="#EEF2FF" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3>Sentiment Distribution</h3>
              <p className="text-muted">AI-analyzed communication tone</p>
            </div>
          </div>
          <div style={{ height: "200px" }}>
            {sentimentDist.length === 0 ? (
              <div className="text-muted" style={{ padding: "60px 20px", textAlign: "center" }}>No transcript data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sentimentDist} dataKey="value" innerRadius={60} outerRadius={80}>
                    {sentimentDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div style={{ padding: "0 20px 20px" }}>
            {sentimentDist.map((d) => (
              <div key={d.name} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span>{d.name}</span><span>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="card-header"><h3>Department Performance</h3></div>
          <div style={{ padding: "20px" }}>
            {deptPerformance.length === 0 ? (
              <div className="text-muted">No department data yet.</div>
            ) : deptPerformance.map((dept) => (
              <div key={dept.name} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span>{dept.name}</span><span>{dept.percent}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${dept.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>At-Risk Summary</h3></div>
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ padding: "12px", background: "#FEF2F2", borderRadius: "8px", color: "#DC2626" }}>
              <strong>{data?.atRisk ?? 0}</strong> employees have sentiment score below 5
            </div>
            <div style={{ padding: "12px", background: "#FFF7ED", borderRadius: "8px", color: "#D97706" }}>
              Consider scheduling 1-on-1 check-ins with at-risk employees.
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Risk Distribution</h3></div>
          <div style={{ height: "160px" }}>
            {riskData.length === 0 ? (
              <div className="text-muted" style={{ padding: "40px 20px", textAlign: "center" }}>No data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskData} dataKey="value" innerRadius={45} outerRadius={65}>
                    {riskData.map((_, i) => <Cell key={i} fill={RISK_COLORS[i % RISK_COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div style={{ padding: "10px 20px 20px" }}>
            {riskData.map((d, i) => (
              <div key={d.name} style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: RISK_COLORS[i] }} />
                {d.name}: {d.value}%
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
