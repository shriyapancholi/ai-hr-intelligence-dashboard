import { useState } from "react";
import { Upload } from "lucide-react";

export default function UploadTranscript() {
  const [transcriptText, setTranscriptText] = useState("");
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  // Handle analyze
  const handleAnalyze = () => {
    if (!file && !transcriptText) {
      alert("Please upload or paste transcript");
      return;
    }

    // Fake AI response (demo)
    setAnalysis({
      sentiment: "Positive",
      title: "Performance Review - Lydia Vance",
      summary:
        "Employee showed strong communication and satisfaction with projects.",
      topics: ["Career Growth", "Work-Life Balance", "Team Collaboration"],
      actions: [
        "Schedule follow-up meeting",
        "Review workload distribution",
      ],
    });
  };

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

        {/* Upload Button */}
        <button
          className="btn btn-primary"
          onClick={() => document.getElementById("fileInput").click()}
        >
          Upload Transcript
        </button>

        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* Main Grid */}
      <div className="grid-2">

        {/* LEFT SIDE */}
        <div className="card">
          <div className="card-header">
            <h3>Analysis Portal</h3>
          </div>

          <div style={{ padding: "20px" }}>

            {/* Employee */}
            <label>Select Employee</label>
            <select className="form-input" style={{ marginBottom: "12px" }}>
              <option>Marcus Aurelius - Senior Developer</option>
              <option>Lydia Vance - Product Designer</option>
            </select>

            {/* Date */}
            <label>Meeting Date</label>
            <input
              type="date"
              className="form-input"
              style={{ marginBottom: "12px" }}
            />

            {/* Upload Box */}
            <label>Transcript Content</label>
            <div
              onClick={() =>
                document.getElementById("fileInput").click()
              }
              style={{
                border: "2px dashed var(--gray-300)",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                marginBottom: "12px",
                background: "var(--gray-50)",
                cursor: "pointer",
              }}
            >
              <Upload size={28} />
              <div style={{ marginTop: "6px" }}>
                {file
                  ? file.name
                  : "Click or Drag file to upload"}
              </div>
            </div>

            {/* Text Area */}
            <textarea
              className="form-input"
              placeholder="Or paste transcript here..."
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              style={{ height: "120px", marginBottom: "12px" }}
            />

            {/* Analyze */}
            <button
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={handleAnalyze}
            >
              Analyze Transcript
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="card">
          <div className="card-header">
            <h3>Latest Analysis</h3>
          </div>

          <div style={{ padding: "20px" }}>

            {!analysis ? (
              <div className="text-muted">
                No analysis yet. Upload transcript to see insights.
              </div>
            ) : (
              <>
                <div className="badge badge-success">
                  {analysis.sentiment} Sentiment
                </div>

                <h3 style={{ marginTop: "10px" }}>
                  {analysis.title}
                </h3>

                <div
                  className="card"
                  style={{ padding: "12px", marginTop: "10px" }}
                >
                  {analysis.summary}
                </div>

                <div style={{ marginTop: "14px" }}>
                  <strong>Key Topics</strong>
                  <div
                    style={{
                      marginTop: "6px",
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    {analysis.topics.map((t, i) => (
                      <span key={i} className="badge">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: "14px" }}>
                  <strong>Suggested Actions</strong>
                  <ul>
                    {analysis.actions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card">
        <div className="card-header">
          <h3>Previous Transcripts History</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Sentiment</th>
              <th>Summary</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Lydia Vance</td>
              <td>Oct 05</td>
              <td>
                <span className="badge badge-success">Positive</span>
              </td>
              <td>Strong communication growth...</td>
              <td>View</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}