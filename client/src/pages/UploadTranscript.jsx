import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import API from "../services/api";

export default function UploadTranscript() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const [error, setError] = useState("");

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

      setAnalysis(aiResult);
      setTranscripts((prev) => [{ ...saved, sentiment: aiResult.sentiment, summary: aiResult.summary }, ...prev]);
    } catch {
      setError("Analysis failed. Please ensure ANTHROPIC_API_KEY is configured.");
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
      <div className="page-header">
        <div>
          <h1>Transcripts Management</h1>
          <p>Upload and analyze meeting discussions to extract HR insights.</p>
        </div>
        <button className="btn btn-primary" onClick={() => document.getElementById("fileInput").click()}>
          Upload Transcript
        </button>
        <input type="file" id="fileInput" accept=".txt,.doc,.docx" style={{ display: "none" }} onChange={handleFileChange} />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h3>Analysis Portal</h3></div>
          <div style={{ padding: "20px" }}>
            {error && <div style={{ marginBottom: "12px", color: "#dc2626", fontSize: "13px", background: "#fef2f2", padding: "8px 12px", borderRadius: "6px" }}>{error}</div>}

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
            <div onClick={() => document.getElementById("fileInput").click()} style={{ border: "2px dashed var(--gray-300)", borderRadius: "12px", padding: "20px", textAlign: "center", marginBottom: "12px", background: "var(--gray-50)", cursor: "pointer" }}>
              <Upload size={28} />
              <div style={{ marginTop: "6px" }}>{file ? file.name : "Click or drag file to upload"}</div>
            </div>

            <textarea className="form-input" placeholder="Or paste transcript here..." value={transcriptText} onChange={(e) => setTranscriptText(e.target.value)} style={{ height: "120px", marginBottom: "12px" }} />

            <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleAnalyze} disabled={analyzing}>
              {analyzing ? "Analyzing..." : "Analyze Transcript"}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Latest Analysis</h3></div>
          <div style={{ padding: "20px" }}>
            {!analysis ? (
              <div className="text-muted">No analysis yet. Upload a transcript to see insights.</div>
            ) : (
              <>
                <div className={`badge ${sentimentClass(analysis.sentiment)}`}>{analysis.sentiment} Sentiment</div>
                <div className="card" style={{ padding: "12px", marginTop: "10px" }}>{analysis.summary}</div>
                <div style={{ marginTop: "14px" }}>
                  <strong>Key Topics</strong>
                  <div style={{ marginTop: "6px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {analysis.topics?.map((t, i) => <span key={i} className="badge">{t}</span>)}
                  </div>
                </div>
                <div style={{ marginTop: "14px" }}>
                  <strong>Suggested Actions</strong>
                  <ul style={{ marginTop: "6px", paddingLeft: "18px" }}>
                    {analysis.suggestedActions?.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Transcript History ({transcripts.length})</h3></div>
        {transcripts.length === 0 ? (
          <div className="text-muted" style={{ padding: "20px" }}>No transcripts yet.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Employee</th><th>Date</th><th>Sentiment</th><th>Summary</th></tr>
            </thead>
            <tbody>
              {transcripts.map((t) => (
                <tr key={t._id}>
                  <td>{t.employeeName || t.employeeId}</td>
                  <td>{new Date(t.meetingDate).toLocaleDateString()}</td>
                  <td>{t.sentiment ? <span className={`badge ${sentimentClass(t.sentiment)}`}>{t.sentiment}</span> : "—"}</td>
                  <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.summary || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
