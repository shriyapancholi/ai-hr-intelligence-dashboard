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
        <div className="animate-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Employees</h1>
                    <p className="page-subtitle">Manage and monitor your workforce intelligence.</p>
                </div>

                <div className="flex gap-3">
                    
                    {/* ✅ EXPORT FIXED */}
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                            const csv = [
                                ["Name", "Role", "Department", "Status", "Sentiment", "Score", "Risk"],
                                ...employees.map(e => [
                                    e.name,
                                    e.role,
                                    e.dept,
                                    e.status,
                                    e.sentiment,
                                    e.score,
                                    e.risk
                                ])
                            ].map(e => e.join(",")).join("\n");

                            const blob = new Blob([csv], { type: "text/csv" });
                            const url = URL.createObjectURL(blob);

                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "employees.csv";
                            a.click();
                        }}
                    >
                        <Download size={14} /> Export
                    </button>

                    {/* ✅ ADD EMPLOYEE FIXED */}
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => alert("Add Employee feature coming soon")}
                    >
                        <Plus size={14} /> Add Employee
                    </button>

                </div>
            </div>

            {/* Quick stats */}
            <div className=" mt-2 grid grid-cols-4 gap-4 mb-6 items-stretch">
                {[
                    { label: 'Total Employees', value: '450', delta: '+5%', up: true },
                    { label: 'Active Today', value: '421', delta: '+2%', up: true },
                    { label: 'At Risk', value: '12', delta: '-3%', up: true },
                    { label: 'Avg Sentiment', value: '8.2', delta: '+1%', up: true },
                ].map(s => (
                    <div key={s.label} className="card px-6 py-5 flex flex-col justify-between h-full">
                        <div className="px-2" >
                            <p className="mt-2 text-[12px] text-[var(--text-secondary)] font-medium">{s.label}</p>
                            <p className="mt-2 text-[22px] font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
                        </div>
                        <span className={`mt-2 text-[12px] font-semibold ${s.up ? 'stat-delta-up' : 'stat-delta-down'}`}>
                            {s.up ? <TrendingUp size={12} className="mt-2 inline mr-0.5" /> : <TrendingDown size={12} className="inline mr-0.5" />}
                            {s.delta}
                        </span>
                    </div>
                ))}
            </div>

            {/* REST OF YOUR CODE SAME (TABLE, FILTER, ETC) */}

            {/* Table */}
            <div className="card overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
                    <div className="relative flex-1 max-w-xs">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-[var(--surface-2)] border border-transparent rounded-lg text-[13px] focus:bg-white focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.08)] transition-all"
                        />
                    </div>
                    <div className="flex gap-1.5 ml-2">
                        {depts.map(d => (
                            <button
                                key={d}
                                onClick={() => setDeptFilter(d)}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${deptFilter === d ? 'bg-[var(--primary-xlight)] text-[var(--primary)]' : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-2)]'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                    <span className="ml-auto text-[12px] text-[var(--text-tertiary)]">{filtered.length} results</span>
                </div>

                {/* Table head */}
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--border)]">
                            {['Employee', 'Department', 'Status', 'Sentiment', 'Score', 'Risk Level', ''].map(h => (
                                <th
                                    key={h}
                                    className="px-5 py-3 text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                        {filtered.map((emp, i) => (
                            <tr
                                key={emp.id}
                                className="hover:bg-[var(--surface-2)] cursor-pointer transition-colors group"
                                onClick={() => navigate(`/employee-profile/${emp.id}`)}
                            >
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center flex-shrink-0`}>
                                            <span className="text-white text-[11px] font-bold">{emp.avatar}</span>
                                        </div>
                                        <div>
                                            <p className="text-[13.5px] font-semibold text-[var(--text-primary)]">{emp.name}</p>
                                            <p className="text-[11.5px] text-[var(--text-tertiary)]">{emp.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className="text-[13px] text-[var(--text-secondary)]">{emp.dept}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className={`badge ${statusBadge[emp.status]}`}>{emp.status}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className={`badge ${sentimentBadge[emp.sentiment]}`}>{emp.sentiment}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13.5px] font-semibold text-[var(--text-primary)]">{emp.score}</span>
                                        <div className="w-16 h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${emp.score * 10}%`, background: emp.score >= 8 ? 'var(--success)' : emp.score >= 6 ? 'var(--warning)' : 'var(--danger)' }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className={`badge ${riskBadge[emp.risk]}`}>{emp.risk}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-1 rounded">
                                        <MoreHorizontal size={15} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-3.5 border-t border-[var(--border)]">
                    <p className="text-[12px] text-[var(--text-tertiary)]">Showing {filtered.length} of {employees.length} employees</p>
                    <div className="flex items-center gap-1.5">
                        <button className="btn btn-ghost btn-icon btn-sm"><ChevronLeft size={14} /></button>
                        {[1, 2, 3].map(p => (
                            <button
                                key={p}
                                className={`w-7 h-7 rounded-lg text-[12px] font-semibold transition-all ${p === 1 ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'}`}
                            >
                                {p}
                            </button>
                        ))}
                        <button className="btn btn-ghost btn-icon btn-sm"><ChevronRight size={14} /></button>
                    </div>
                </div>
            </div>
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