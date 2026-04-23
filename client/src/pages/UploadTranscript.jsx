import { useState, useEffect } from "react";
import { Upload, X, ChevronRight, Trash2 } from "lucide-react";
import API from "../services/api";

/* ── analysis detail modal ─────────────────────────────── */
function AnalysisModal({ transcript, fullAnalysis, onClose }) {
  const sentimentClass = (s) => {
    if (!s) return "";
    const l = s.toLowerCase();
    return l === "positive" ? "badge-success" : l === "negative" ? "badge-danger" : "badge-neutral";
  };

  const sentiment = fullAnalysis?.sentiment || transcript.sentiment;
  const summary   = fullAnalysis?.summary   || transcript.summary;
  const topics    = fullAnalysis?.topics;
  const actions   = fullAnalysis?.suggestedActions;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{ background: "white", borderRadius: "16px", width: "520px", maxWidth: "92vw", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #E2E8F0" }}>
          <div>
            <div style={{ fontWeight: "700", fontSize: "16px", color: "#0F172A" }}>
              {transcript.employeeName || "Employee"}
            </div>
            <div style={{ fontSize: "13px", color: "#64748B", marginTop: "2px" }}>
              {new Date(transcript.meetingDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: "4px" }}>
            <X size={20} />
          </button>
        </div>

        {/* body */}
        <div style={{ padding: "24px" }}>
          {/* sentiment */}
          {sentiment && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Sentiment</div>
              <span className={`badge ${sentimentClass(sentiment)}`}>{sentiment}</span>
            </div>
          )}

          {/* summary */}
          {summary && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Summary</div>
              <div style={{ fontSize: "14px", color: "#1E293B", lineHeight: "1.7", background: "#F8FAFC", padding: "14px 16px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                {summary}
              </div>
            </div>
          )}

          {/* topics */}
          {topics?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Key Topics</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {topics.map((t, i) => (
                  <span key={i} style={{ background: "#EEF2FF", color: "#4F46E5", fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "20px" }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* suggested actions */}
          {actions?.length > 0 && (
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Suggested Actions</div>
              <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {actions.map((a, i) => (
                  <li key={i} style={{ fontSize: "14px", color: "#1E293B", lineHeight: "1.6" }}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── main page ─────────────────────────────────────────── */
export default function UploadTranscript() {

  const [employees, setEmployees]               = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [meetingDate, setMeetingDate]           = useState("");
  const [transcriptText, setTranscriptText]     = useState("");
  const [file, setFile]                         = useState(null);
  const [analyzing, setAnalyzing]               = useState(false);
  const [transcripts, setTranscripts]           = useState([]);
  const [error, setError]                       = useState("");
  const [analysisCache, setAnalysisCache]           = useState({});
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId]       = useState(null);
  const [deletingId, setDeletingId]                 = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await API.delete(`transcripts/${id}`);
      setTranscripts((prev) => prev.filter((t) => t._id !== id));
      setAnalysisCache((prev) => { const c = { ...prev }; delete c[id]; return c; });
      if (selectedTranscript?._id === id) setSelectedTranscript(null);
    } catch {
      // row stays if delete fails
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  useEffect(() => {
    API.get("employees")
      .then(({ data }) => setEmployees(data.employees || []))
      .catch(() => {});
    API.get("transcripts/all")
      .then(({ data }) => setTranscripts(data))
      .catch(() => {});
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setTranscriptText(ev.target.result);
    reader.readAsText(f);
  };

  const handleAnalyze = async () => {
    if (!selectedEmployee || !meetingDate || !transcriptText.trim()) {
      setError("Please select an employee, date, and provide transcript text.");
      return;
    }
    setError("");
    setAnalyzing(true);
    try {
      const { data: aiResult } = await API.post("ai/analyze", { transcriptText });

      const { data: saved } = await API.post("transcripts/upload", {
        employeeId: selectedEmployee,
        meetingDate,
        transcriptText,
      });

      await API.patch(`transcripts/${saved._id}/analysis`, {
        sentiment: aiResult.sentiment,
        summary: aiResult.summary,
      });

      const employeeObj = employees.find((e) => e._id === selectedEmployee);
      const enriched = {
        ...saved,
        sentiment: aiResult.sentiment,
        summary: aiResult.summary,
        employeeName: employeeObj?.name || "",
      };
      setTranscripts((prev) => [enriched, ...prev]);
      setAnalysisCache((prev) => ({ ...prev, [saved._id]: aiResult }));

      // clear form
      setTranscriptText("");
      setFile(null);
      setSelectedEmployee("");
      setMeetingDate("");
    } catch {
      setError("Analysis failed. Please check your API key in .env.");
    } finally {
      setAnalyzing(false);
    }
  };

  const sentimentClass = (s) => {
    if (!s) return "";
    const l = s.toLowerCase();
    return l === "positive" ? "badge-success" : l === "negative" ? "badge-danger" : "badge-neutral";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {selectedTranscript && (
        <AnalysisModal
          transcript={selectedTranscript}
          fullAnalysis={analysisCache[selectedTranscript._id]}
          onClose={() => setSelectedTranscript(null)}
        />
      )}

      {/* header */}
      <div className="page-header">
        <div>
          <h1>Transcripts Management</h1>
          <p>Upload and analyze meeting discussions to extract HR insights.</p>
        </div>
        <button className="btn btn-primary" onClick={() => document.getElementById("fileInput").click()}>
          <Upload size={15} /> Upload Transcript
        </button>
        <input type="file" id="fileInput" accept=".txt,.doc,.docx" style={{ display: "none" }} onChange={handleFileChange} />
      </div>

      {/* analysis portal — full width now */}
      <div className="card">
        <div className="card-header"><h3>Analysis Portal</h3></div>
        <div style={{ padding: "20px" }}>
          {error && (
            <div style={{ marginBottom: "12px", color: "#dc2626", fontSize: "13px", background: "#fef2f2", padding: "8px 12px", borderRadius: "6px" }}>
              {error}
            </div>
          )}

          <label>Select Employee</label>
          <select className="form-input" style={{ marginBottom: "12px" }} value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
            <option value="">-- Select an employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>{emp.name} — {emp.role || emp.department}</option>
            ))}
          </select>

          <label>Meeting Date</label>
          <input type="date" className="form-input" style={{ marginBottom: "12px" }} value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />

          <label>Transcript Content</label>
          <div
            onClick={() => document.getElementById("fileInput").click()}
            style={{ border: "2px dashed var(--gray-300)", borderRadius: "12px", padding: "20px", textAlign: "center", marginBottom: "12px", background: "var(--gray-50)", cursor: "pointer" }}
          >
            <Upload size={28} />
            <div style={{ marginTop: "6px" }}>{file ? file.name : "Click or drag file to upload"}</div>
          </div>

          <textarea
            className="form-input"
            placeholder="Or paste transcript here..."
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            style={{ height: "120px", marginBottom: "12px" }}
          />

          <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? "Analyzing..." : "Analyze Transcript"}
          </button>
        </div>
      </div>

      {/* transcript history */}
      <div className="card">
        <div className="card-header"><h3>Transcript History ({transcripts.length})</h3></div>
        {transcripts.length === 0 ? (
          <div className="text-muted" style={{ padding: "20px" }}>No transcripts yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Sentiment</th>
                <th>Summary</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transcripts.map((t) => (
                <tr
                  key={t._id}
                  onClick={() => confirmDeleteId !== t._id && setSelectedTranscript(t)}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
                  onMouseLeave={(e) => e.currentTarget.style.background = ""}
                >
                  <td style={{ fontWeight: "500" }}>{t.employeeName || "Unknown Employee"}</td>
                  <td>{new Date(t.meetingDate).toLocaleDateString()}</td>
                  <td>{t.sentiment ? <span className={`badge ${sentimentClass(t.sentiment)}`}>{t.sentiment}</span> : "—"}</td>
                  <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#64748B" }}>{t.summary || "—"}</td>
                  <td style={{ width: "120px", textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                    {confirmDeleteId === t._id ? (
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "#64748B" }}>Delete?</span>
                        <button
                          onClick={() => handleDelete(t._id)}
                          disabled={deletingId === t._id}
                          style={{ fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "6px", border: "none", background: "#DC2626", color: "white", cursor: "pointer" }}
                        >
                          {deletingId === t._id ? "..." : "Yes"}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          style={{ fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "6px", border: "1px solid #E2E8F0", background: "white", color: "#64748B", cursor: "pointer" }}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                        <ChevronRight size={16} color="#94A3B8" />
                        <button
                          onClick={() => setConfirmDeleteId(t._id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: "2px", display: "flex", alignItems: "center" }}
                          title="Delete transcript"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
