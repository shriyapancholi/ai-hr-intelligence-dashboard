import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Users, Activity, Calendar } from "lucide-react";

export default function Dashboard() {
  return (
    <div style={{ display: "flex", background: "#f1f5f9" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "30px" }}>
          <h2 style={{ marginBottom: "20px", fontWeight: "600" }}>
            Dashboard Overview
          </h2>

          {/* Cards */}
          <div style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap"
          }}>

            {/* Card 1 */}
            <div style={cardStyle}>
              <div style={iconBox("#3b82f6")}>
                <Users color="white" size={20} />
              </div>
              <h4>Total Employees</h4>
              <h2>10</h2>
            </div>

            {/* Card 2 */}
            <div style={cardStyle}>
              <div style={iconBox("#22c55e")}>
                <Activity color="white" size={20} />
              </div>
              <h4>Avg Sentiment</h4>
              <h2>7.2</h2>
            </div>

            {/* Card 3 */}
            <div style={cardStyle}>
              <div style={iconBox("#f59e0b")}>
                <Calendar color="white" size={20} />
              </div>
              <h4>Meetings</h4>
              <h2>5</h2>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div style={{
            marginTop: "30px",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ marginBottom: "10px" }}>Recent Transcripts</h3>
            <p style={{ color: "gray" }}>
              No recent activity yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Styles */
const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  width: "220px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const iconBox = (color) => ({
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  background: color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});