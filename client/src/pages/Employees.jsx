import { useState, useEffect } from "react";
import { Search, UserPlus } from "lucide-react";

// ✅ KEEP YOUR DUMMY DATA
const employeesData = [
  {
    name: "Sarah Jenkins",
    email: "sarah.j@fluid.ai",
    department: "Product Design",
    role: "Senior Lead UI",
    sentimentScore: 8.4,
    notes: "Design lead",
  },
  {
    name: "Marcus Chen",
    email: "m.chen@fluid.ai",
    department: "Engineering",
    role: "Backend Architect",
    sentimentScore: 4.2,
    notes: "Needs attention",
  },
];

export default function Employees() {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);

  // ✅ Fetch backend employees
  useEffect(() => {
    fetch("http://localhost:5004/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  }, []);

  // ✅ MERGE dummy + backend
  const allEmployees = [...employeesData, ...employees];

  const filteredEmployees = allEmployees.filter((emp) =>
    emp.name?.toLowerCase().includes(search.toLowerCase())
  );

  const riskColor = (score) => {
    if (score >= 7) return "badge-success";
    if (score >= 5) return "badge-warning";
    return "badge-danger";
  };

  const addEmployee = async () => {
  try {
    console.log("Clicked");

    const res = await fetch("http://localhost:5004/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@gmail.com",
        department: "Engineering",
        role: "Dev",
        sentimentScore: 6,
        notes: "Testing"
      }),
    });

    console.log("Response:", res);

  } catch (err) {
    console.error("Error:", err);
  }
};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Header */}
      <div className="page-header">
        <h1>Employees</h1>

        <button className="btn btn-primary" onClick={addEmployee}>
          <UserPlus size={16} /> Add Employee
        </button>
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: "12px" }}>
        <div className="search-bar" style={{ width: "300px" }}>
          <Search size={16} />
          <input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Role</th>
                <th>Sentiment</th>
                <th>Notes</th>
                <th>Risk</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <img
                        src="https://randomuser.me/api/portraits/men/1.jpg"
                        alt=""
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

                  <td>{emp.department}</td>
                  <td>{emp.role}</td>

                  <td>
                    <div className="score-bar">
                      <span>{emp.sentimentScore}</span>
                      <div className="bar">
                        <div
                          className="fill"
                          style={{
                            width: `${(emp.sentimentScore || 0) * 10}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td>{emp.notes}</td>

                  <td>
                    <span className={`badge ${riskColor(emp.sentimentScore)}`}>
                      {emp.sentimentScore >= 7
                        ? "Low"
                        : emp.sentimentScore >= 5
                        ? "Medium"
                        : "High"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "16px" }}>
          Showing {filteredEmployees.length} employees
        </div>
      </div>
    </div>
  );
}