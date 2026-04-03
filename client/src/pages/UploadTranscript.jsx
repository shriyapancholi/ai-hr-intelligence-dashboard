import { useState } from "react";
import { Upload, FileText } from "lucide-react";

export default function UploadTranscript() {
  const [transcriptText, setTranscriptText] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Transcripts Management</h1>
          <p>
            Upload and analyze meeting discussions to extract HR insights.
          </p>
        </div>

        <button className="btn btn-primary">Upload Transcript</button>
      </div>

      {/* Top Section */}
      <div className="grid-2">

        {/* Analysis Portal */}
        <div className="card">
          <div className="card-header">
            <h3>Analysis Portal</h3>
          </div>

          <div style={{ padding: "20px" }}>
            <label>Select Employee</label>
            <select className="form-input" style={{ marginBottom: "12px" }}>
              <option>Marcus Aurelius - Senior Developer</option>
              <option>Lydia Vance - Product Designer</option>
            </select>

            <label>Meeting Date</label>
            <input
              type="date"
              className="form-input"
              style={{ marginBottom: "12px" }}
            />

            <label>Transcript Content</label>

            {/* Upload Box */}
            <div
              style={{
                border: "2px dashed var(--gray-300)",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                marginBottom: "12px",
                background: "var(--gray-50)",
              }}
            >
              <Upload size={28} />
              <div>Drag audio file here or Browse files</div>
            </div>

            <textarea
              className="form-input"
              placeholder="Or paste the raw transcript text here..."
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              style={{ height: "120px", marginBottom: "12px" }}
            />

            <button className="btn btn-primary" style={{ width: "100%" }}>
              Analyze Transcript
            </button>
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="card">
          <div className="card-header">
            <h3>Latest Analysis</h3>
          </div>

          <div style={{ padding: "20px" }}>
            <div className="badge badge-success">
              Positive Sentiment
            </div>

            <h3 style={{ marginTop: "10px" }}>
              Performance Review - Lydia Vance
            </h3>

            <div className="card" style={{ padding: "12px", marginTop: "10px" }}>
              Lydia demonstrated significant growth in communication this
              quarter and expressed high satisfaction with recent projects.
            </div>

            <div style={{ marginTop: "14px" }}>
              <strong>Key Topics Discussed</strong>
              <div style={{ marginTop: "6px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span className="badge">Career Pathing</span>
                <span className="badge">Work-Life Balance</span>
                <span className="badge">Mentorship</span>
              </div>
            </div>

            <div style={{ marginTop: "14px" }}>
              <strong>Suggested HR Follow-ups</strong>
              <ul>
                <li>Schedule mentorship discussion</li>
                <li>Review workload capacity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript History */}
      <div className="card">
        <div className="card-header">
          <h3>Previous Transcripts History</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Meeting Date</th>
              <th>Sentiment</th>
              <th>Key Summary</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Julian Chen</td>
              <td>Oct 12, 2023</td>
              <td>
                <span className="badge">Neutral</span>
              </td>
              <td>Discussed technical debt...</td>
              <td>View Details</td>
            </tr>

            <tr>
              <td>Marcus Aurelius</td>
              <td>Oct 10, 2023</td>
              <td>
                <span className="badge badge-danger">Negative</span>
              </td>
              <td>Expressed frustration regarding deadlines...</td>
              <td>View Details</td>
            </tr>

            <tr>
              <td>Lydia Vance</td>
              <td>Oct 05, 2023</td>
              <td>
                <span className="badge badge-success">Positive</span>
              </td>
              <td>Great feedback on design system...</td>
              <td>View Details</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}