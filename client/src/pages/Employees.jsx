import { useState } from "react";
import { Search, UserPlus } from "lucide-react";

const employeesData = [
  {
    name: "Sarah Jenkins",
    email: "sarah.j@fluid.ai",
    dept: "Product Design",
    role: "Senior Lead UI",
    sentiment: 8.4,
    meeting: "Oct 24, 2023",
    risk: "Low",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Marcus Chen",
    email: "m.chen@fluid.ai",
    dept: "Engineering",
    role: "Backend Architect",
    sentiment: 4.2,
    meeting: "Oct 26, 2023",
    risk: "High",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Elena Rodriguez",
    email: "elena.r@fluid.ai",
    dept: "Marketing",
    role: "Content Strategy",
    sentiment: 7.1,
    meeting: "Oct 20, 2023",
    risk: "Medium",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "David Kim",
    email: "d.kim@fluid.ai",
    dept: "Engineering",
    role: "Fullstack Engineer",
    sentiment: 9.0,
    meeting: "Oct 28, 2023",
    risk: "Low",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
  },
];

export default function Employees() {
  const [search, setSearch] = useState("");

  const filteredEmployees = employeesData.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const riskColor = (risk) => {
    if (risk === "Low") return "badge-success";
    if (risk === "Medium") return "badge-warning";
    return "badge-danger";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div className="page-header">
        <h1>Employees</h1>

        <button className="btn btn-primary">
          <UserPlus size={16} /> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px" }}>
        <div className="search-bar" style={{ width: "300px" }}>
          <Search size={16} />
          <input
            placeholder="Search employees by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="form-input" style={{ width: "180px" }}>
          <option>All Departments</option>
          <option>Engineering</option>
          <option>Marketing</option>
          <option>Product</option>
        </select>

        <select className="form-input" style={{ width: "140px" }}>
          <option>Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Employee Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Role</th>
                <th>Sentiment</th>
                <th>Last Meeting</th>
                <th>Risk Level</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <img
                        src={emp.avatar}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                        }}
                      />
                      <div>
                        <div>{emp.name}</div>
                        <div className="text-muted">{emp.email}</div>
                      </div>
                    </div>
                  </td>

                  <td>{emp.dept}</td>
                  <td>{emp.role}</td>

                  <td>
                    <div className="score-bar">
                      <span>{emp.sentiment}</span>
                      <div className="bar">
                        <div
                          className="fill"
                          style={{ width: `${emp.sentiment * 10}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td>{emp.meeting}</td>

                  <td>
                    <span className={`badge ${riskColor(emp.risk)}`}>
                      {emp.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          style={{
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className="text-muted">
            Showing {filteredEmployees.length} employees
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            <button className="btn btn-outline btn-sm">1</button>
            <button className="btn btn-outline btn-sm">2</button>
            <button className="btn btn-outline btn-sm">3</button>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid-3">
        {/* Department Density */}
        <div className="card">
          <div className="card-header">
            <h3>Department Density</h3>
          </div>
          <div style={{ padding: "20px" }}>
            <div className="score-bar">
              <span>Engineering</span>
              <div className="bar">
                <div className="fill" style={{ width: "42%" }} />
              </div>
              <span>42%</span>
            </div>

            <div className="score-bar">
              <span>Marketing</span>
              <div className="bar">
                <div className="fill" style={{ width: "28%" }} />
              </div>
              <span>28%</span>
            </div>
          </div>
        </div>

        {/* Overall Sentiment */}
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg,#4F46E5,#6366F1)",
            color: "#fff",
          }}
        >
          <div style={{ padding: "20px" }}>
            <h3 style={{ color: "#fff" }}>Overall Sentiment</h3>
            <div style={{ fontSize: "40px", fontWeight: "700" }}>7.8</div>
            <div>Increased 4% from last month</div>
          </div>
        </div>

        {/* Predictive Retention */}
        <div className="card">
          <div className="card-header">
            <h3>Predictive Retention</h3>
          </div>
          <div style={{ padding: "20px" }}>
            Based on sentiment scores, 92% of your workforce is at low risk of
            turnover.
          </div>
        </div>
      </div>
    </div>
  );
}