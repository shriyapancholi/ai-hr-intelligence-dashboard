import {
  Heart,
  Shield,
  Calendar,
  Plus,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const sentimentData = [
  { month: "May", value: 7 },
  { month: "Jun", value: 7.5 },
  { month: "Jul", value: 8 },
  { month: "Aug", value: 8.2 },
  { month: "Sep", value: 8.4 },
  { month: "Oct", value: 8.6 },
];

export default function EmployeeProfile() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Profile Header */}
      <div className="card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>

          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="employee"
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "16px",
              objectFit: "cover",
            }}
          />

          <div style={{ flex: 1 }}>
            <h2>Sarah Jenkins</h2>
            <div className="text-muted">
              Product Design • sarah.j@fluid.ai • +1-555-0123
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "12px",
              }}
            >
              <div className="badge badge-success">
                <Heart size={14} /> Sentiment 8.4
              </div>

              <div className="badge badge-info">
                <Shield size={14} /> Risk Low
              </div>

              <div className="badge badge-neutral">
                <Calendar size={14} /> Last Meeting Oct 24
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="grid-3">

        {/* Sentiment Trend */}
        <div className="card">
          <div className="card-header">
            <h3>Sentiment Trend</h3>
          </div>

          <div style={{ height: "180px", padding: "10px 20px" }}>
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

        {/* HR Notes */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>HR Notes</h3>
              <Plus size={16} />
            </div>
          </div>

          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="card" style={{ padding: "12px" }}>
              Discussed career trajectory and potential promotion by 2024.
            </div>

            <div className="card" style={{ padding: "12px" }}>
              Performance was stellar during Fluid rollout.
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div
          className="card"
          style={{
            padding: "20px",
            background: "linear-gradient(135deg,#4F46E5,#6366F1)",
            color: "#fff",
          }}
        >
          <h3 style={{ color: "#fff" }}>AI Intel Insight</h3>

          <p style={{ marginTop: "10px", fontSize: "13px" }}>
            Sarah continues to be a top performer, yet analysis shows a rise in
            stress markers. High project load is the primary driver.
          </p>

          <div
            style={{
              marginTop: "12px",
              background: "rgba(255,255,255,0.15)",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            Risk of Burnout: Moderate-Low
          </div>

          <button
            className="btn"
            style={{
              marginTop: "14px",
              background: "#fff",
              color: "#4F46E5",
            }}
          >
            Deep-Dive Risk Analysis
          </button>
        </div>
      </div>

      {/* Intelligence Archive */}
      <div className="card">
        <div className="card-header">
          <h3>Intelligence Archive</h3>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div className="card" style={{ padding: "14px" }}>
            <strong>Monthly Performance Pulse</strong>
            <p className="text-muted">
              Sarah reported high satisfaction but mentioned long hours.
            </p>
          </div>

          <div className="card" style={{ padding: "14px" }}>
            <strong>Q3 Strategy Alignment</strong>
            <p className="text-muted">
              Sarah advocated streamlined hand-off process.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        <div className="card-header">
          <h3>Timeline</h3>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <strong>Sep 2023</strong>
            <div className="text-muted">
              Work-life balance concerns flagged.
            </div>
          </div>

          <div>
            <strong>Dec 2022</strong>
            <div className="text-muted">
              Performance review exceeded expectations.
            </div>
          </div>

          <div>
            <strong>Jun 2022</strong>
            <div className="text-muted">
              Promotion to Senior Lead UI Designer.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}