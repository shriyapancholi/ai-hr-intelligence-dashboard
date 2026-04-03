import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Filter, Plus, MoreHorizontal,
    TrendingUp, TrendingDown, ChevronLeft, ChevronRight,
    Download, Users
} from 'lucide-react';

const employees = [
    { id: 1, name: 'Marcus Chen', role: 'QA Engineer', dept: 'Engineering', status: 'Active', sentiment: 'Neutral', score: 7.2, risk: 'Low', avatar: 'MC', joined: 'Mar 2021' },
    { id: 2, name: 'Lydia Vance', role: 'Product Designer', dept: 'Product', status: 'Active', sentiment: 'Positive', score: 8.9, risk: 'Low', avatar: 'LV', joined: 'Jan 2022' },
    { id: 3, name: 'Sarah Jenkins', role: 'HR Director', dept: 'HR', status: 'Active', sentiment: 'Positive', score: 9.1, risk: 'Low', avatar: 'SJ', joined: 'Jun 2020' },
    { id: 4, name: 'Marcus Aurelius', role: 'Senior Developer', dept: 'Engineering', status: 'Active', sentiment: 'Negative', score: 5.4, risk: 'High', avatar: 'MA', joined: 'Sep 2019' },
    { id: 5, name: 'Elena Rodriguez', role: 'Marketing Lead', dept: 'Marketing', status: 'On Leave', sentiment: 'Positive', score: 8.1, risk: 'Low', avatar: 'ER', joined: 'Feb 2021' },
    { id: 6, name: 'Julian Park', role: 'Data Analyst', dept: 'Engineering', status: 'Active', sentiment: 'Neutral', score: 7.5, risk: 'Medium', avatar: 'JP', joined: 'Nov 2022' },
    { id: 7, name: 'Aisha Thompson', role: 'Recruiter', dept: 'HR', status: 'Active', sentiment: 'Positive', score: 8.4, risk: 'Low', avatar: 'AT', joined: 'Aug 2023' },
    { id: 8, name: 'Ravi Patel', role: 'Frontend Engineer', dept: 'Engineering', status: 'Active', sentiment: 'Neutral', score: 7.8, risk: 'Low', avatar: 'RP', joined: 'Apr 2022' },
];

const sentimentBadge = {
    Positive: 'badge-success',
    Neutral: 'badge-neutral',
    Negative: 'badge-danger',
};

const riskBadge = {
    Low: 'badge-success',
    Medium: 'badge-warning',
    High: 'badge-danger',
};

const statusBadge = {
    Active: 'badge-success',
    'On Leave': 'badge-warning',
};

const avatarColors = [
    'from-indigo-400 to-indigo-600', 'from-violet-400 to-violet-600',
    'from-emerald-400 to-emerald-600', 'from-amber-400 to-amber-600',
    'from-rose-400 to-rose-600', 'from-cyan-400 to-cyan-600',
    'from-fuchsia-400 to-fuchsia-600', 'from-teal-400 to-teal-600',
];

export default function Employees() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');

    const depts = ['All', 'Engineering', 'Product', 'Marketing', 'HR'];

    const filtered = employees.filter(e => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase());
        const matchDept = deptFilter === 'All' || e.dept === deptFilter;
        return matchSearch && matchDept;
    });

    return (
        <div className="animate-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Employees</h1>
                    <p className="page-subtitle">Manage and monitor your workforce intelligence.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-outline btn-sm"><Download size={14} /> Export</button>
                    <button className="btn btn-primary btn-sm"><Plus size={14} /> Add Employee</button>
                </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Employees', value: '450', delta: '+5%', up: true },
                    { label: 'Active Today', value: '421', delta: '+2%', up: true },
                    { label: 'At Risk', value: '12', delta: '-3%', up: true },
                    { label: 'Avg Sentiment', value: '8.2', delta: '+1%', up: true },
                ].map(s => (
                    <div key={s.label} className="card p-4 flex items-center gap-4">
                        <div className="flex-1">
                            <p className="text-[12px] text-[var(--text-secondary)] font-medium">{s.label}</p>
                            <p className="text-[22px] font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
                        </div>
                        <span className={`text-[12px] font-semibold ${s.up ? 'stat-delta-up' : 'stat-delta-down'}`}>
                            {s.up ? <TrendingUp size={12} className="inline mr-0.5" /> : <TrendingDown size={12} className="inline mr-0.5" />}
                            {s.delta}
                        </span>
                    </div>
                ))}
            </div>

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
        </div>
    );
}