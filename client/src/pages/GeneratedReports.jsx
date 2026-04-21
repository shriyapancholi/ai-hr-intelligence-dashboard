import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Users, 
  Smile, 
  AlertTriangle,
  ArrowLeft,
  X 
} from "lucide-react";
import html2pdf from "html2pdf.js";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#4F46E5", "#818CF8", "#94A3B8", "#CBD5F5"];

export default function GeneratedReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const reportRef = useRef();

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem("hr_reports") || "[]");
    setReports(savedReports);
  }, []);

  const handleDownload = async (report) => {
    setIsDownloading(true);
    setSelectedReport(report);
    
    // We need a short delay for React to render the report component to the DOM
    setTimeout(async () => {
      if (reportRef.current) {
        const opt = {
          margin:       0.5,
          filename:     `${report.title.replace(/\s+/g, "_")}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        await html2pdf().set(opt).from(reportRef.current).save();
      }
      setSelectedReport(null);
      setIsDownloading(false);
    }, 500);
  };

  const handleView = (report) => {
    setSelectedReport(report);
  };

  if (selectedReport && !isDownloading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button 
            className="btn btn-outline"
            onClick={() => setSelectedReport(null)}
          >
            <ArrowLeft size={16} /> Back to Reports
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => handleDownload(selectedReport)}
          >
            <Download size={16} /> Download PDF
          </button>
        </div>

        <ReportContentView report={selectedReport} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative" }}>
      <div className="page-header">
        <div>
          <h1>Generated Reports</h1>
          <p>View and download historical HR intelligence reports.</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--gray-200)" }}>
          <FileText size={48} color="var(--gray-300)" style={{ margin: "0 auto 16px" }} />
          <h3>No reports generated</h3>
          <p className="text-muted">Go to the Dashboard and click "Generate Report" to create your first report.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
          {reports.map((report) => (
            <div key={report.id} className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                  <FileText size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>{report.title}</h3>
                  <div className="text-muted" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={12} /> {new Date(report.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "12px", borderTop: "1px solid var(--gray-100)", paddingTop: "16px" }}>
                <div style={{ flex: 1 }}>
                  <div className="text-muted" style={{ fontSize: "11px" }}>Total Employees</div>
                  <div style={{ fontWeight: "600", color: "var(--gray-800)" }}>{report.kpi.totalEmployees}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="text-muted" style={{ fontSize: "11px" }}>Avg Sentiment</div>
                  <div style={{ fontWeight: "600", color: "var(--success)" }}>{report.kpi.averageSentiment}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => handleView(report)}
                >
                  <Eye size={16} /> View
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => handleDownload(report)}
                  disabled={isDownloading}
                >
                  {isDownloading && selectedReport?.id === report.id ? 'Loading...' : <><Download size={16} /> Download</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden container for PDF generation */}
      {isDownloading && selectedReport && (
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          <div ref={reportRef} style={{ width: "800px", background: "white", padding: "40px", color: "#333" }}>
            <ReportContentView report={selectedReport} isPdf={true} />
          </div>
        </div>
      )}
    </div>
  );
}

// Separate component for the report content that is rendered both on screen and in PDF
function ReportContentView({ report, isPdf = false }) {
  if (!report) return null;
  
  return (
    <div style={{ 
      background: isPdf ? "transparent" : "var(--bg-card)", 
      borderRadius: isPdf ? "0" : "var(--radius-lg)", 
      border: isPdf ? "none" : "1px solid var(--gray-200)",
      padding: isPdf ? "0" : "32px",
      display: "flex",
      flexDirection: "column",
      gap: "32px",
      color: "var(--gray-800)",
      fontFamily: isPdf ? "sans-serif" : "inherit"
    }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid var(--primary)", paddingBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", color: "var(--primary-dark)", margin: "0 0 8px 0" }}>HR Intelligence Report</h1>
        <div style={{ fontSize: "14px", color: "var(--gray-500)", display: "flex", justifyContent: "space-between" }}>
          <span>Generated: {new Date(report.timestamp).toLocaleString()}</span>
          <span>ID: {report.id}</span>
        </div>
      </div>

      {/* KPIs */}
      <div>
        <h2 style={{ fontSize: "18px", marginBottom: "16px", borderBottom: "1px solid var(--gray-200)", paddingBottom: "8px" }}>Key Performance Indicators</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          <div style={{ background: "var(--gray-50)", padding: "16px", borderRadius: "8px", border: "1px solid var(--gray-200)" }}>
            <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "4px" }}>Total Employees</div>
            <div style={{ fontSize: "24px", fontWeight: "700" }}>{report.kpi.totalEmployees}</div>
          </div>
          <div style={{ background: "var(--gray-50)", padding: "16px", borderRadius: "8px", border: "1px solid var(--gray-200)" }}>
            <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "4px" }}>Meetings This Month</div>
            <div style={{ fontSize: "24px", fontWeight: "700" }}>{report.kpi.meetingsThisMonth}</div>
          </div>
          <div style={{ background: "var(--gray-50)", padding: "16px", borderRadius: "8px", border: "1px solid var(--gray-200)" }}>
            <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "4px" }}>Average Sentiment</div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--success)" }}>{report.kpi.averageSentiment}</div>
          </div>
          <div style={{ background: "var(--gray-50)", padding: "16px", borderRadius: "8px", border: "1px solid var(--gray-200)" }}>
            <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "4px" }}>Employees At Risk</div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--danger)" }}>{report.kpi.employeesAtRisk}</div>
          </div>
        </div>
      </div>

      {/* Text Breakdown (since recharts might be tricky in PDF without canvas waiting, we show a table for PDF, chart for UI) */}
      <div>
         <h2 style={{ fontSize: "18px", marginBottom: "16px", borderBottom: "1px solid var(--gray-200)", paddingBottom: "8px" }}>Department Breakdown</h2>
         <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {report.deptData?.map((dept, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "var(--gray-50)", borderRadius: "6px" }}>
                <strong style={{ color: "var(--gray-700)" }}>{dept.name}</strong>
                <span>{dept.value}% of workforce</span>
              </div>
            ))}
         </div>
      </div>

      <div style={{ pageBreakInside: "avoid" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "16px", borderBottom: "1px solid var(--gray-200)", paddingBottom: "8px" }}>Key AI Insights</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {report.insights?.map((insight, index) => (
            <div key={index} style={{
              padding: "16px",
              borderLeft: `4px solid ${insight.color || 'var(--primary)'}`,
              background: "var(--gray-50)",
              borderRadius: "4px 8px 8px 4px"
            }}>
              <div style={{ fontWeight: "600", marginBottom: "6px" }}>{insight.title}</div>
              <div style={{ fontSize: "14px", color: "var(--gray-600)" }}>{insight.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "32px", paddingTop: "16px", borderTop: "1px solid var(--gray-200)", textAlign: "center", color: "var(--gray-500)", fontSize: "12px" }}>
        Generated automatically via AI HR Intelligence Dashboard. Confidential and internal use only.
      </div>
    </div>
  );
}
