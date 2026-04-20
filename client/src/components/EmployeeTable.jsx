import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';

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
];

/**
 * Reusable EmployeeTable component.
 * Props:
 *   - employees: array of employee objects
 *   - compact: boolean (optional) — reduces padding
 */
export default function EmployeeTable({ employees = [], compact = false }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {['Employee', 'Department', 'Status', 'Sentiment', 'Score', 'Risk', ''].map(h => (
              <th
                key={h}
                className={`text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider ${compact ? 'px-3 py-2.5' : 'px-5 py-3'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-light)]">
          {employees.map((emp, i) => (
            <tr
              key={emp.id || i}
              onClick={() => navigate(`/employee-profile/${emp.id}`)}
              className="hover:bg-[var(--surface-2)] cursor-pointer transition-colors group"
            >
              <td className={compact ? 'px-3 py-2.5' : 'px-5 py-3.5'}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-[11px] font-bold">
                      {emp.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13.5px] font-semibold text-[var(--text-primary)]">{emp.name}</p>
                    <p className="text-[11.5px] text-[var(--text-tertiary)]">{emp.role}</p>
                  </div>
                </div>
              </td>
              <td className={compact ? 'px-3 py-2.5' : 'px-5 py-3.5'}>
                <span className="text-[13px] text-[var(--text-secondary)]">{emp.dept}</span>
              </td>
              <td className={compact ? 'px-3 py-2.5' : 'px-5 py-3.5'}>
                <span className={`badge ${statusBadge[emp.status] || 'badge-neutral'}`}>{emp.status}</span>
              </td>
              <td className={compact ? 'px-3 py-2.5' : 'px-5 py-3.5'}>
                <span className={`badge ${sentimentBadge[emp.sentiment] || 'badge-neutral'}`}>{emp.sentiment}</span>
              </td>
              <td className={compact ? 'px-3 py-2.5' : 'px-5 py-3.5'}>
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-semibold text-[var(--text-primary)]">{emp.score}</span>
                  <div className="w-14 h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${emp.score * 10}%`,
                        background: emp.score >= 8 ? 'var(--success)' : emp.score >= 6 ? 'var(--warning)' : 'var(--danger)',
                      }}
                    />
                  </div>
                </div>
              </td>
              <td className={compact ? 'px-3 py-2.5' : 'px-5 py-3.5'}>
                <span className={`badge ${riskBadge[emp.risk] || 'badge-neutral'}`}>{emp.risk}</span>
              </td>
              <td className={compact ? 'px-3 py-2.5' : 'px-5 py-3.5'}>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-1 rounded">
                  <MoreHorizontal size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {employees.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p className="empty-state-text">No employees found</p>
        </div>
      )}
    </div>
  );
}