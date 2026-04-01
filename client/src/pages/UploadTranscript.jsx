import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

export default function UploadTranscript() {
    const [employees, setEmployees] = useState([]);
    const [employeeId, setEmployeeId] = useState("");
    const [transcript, setTranscript] = useState("");

    useEffect(() => {
        API.get("/employees").then((res) => {
            setEmployees(res.data);
        });
    }, []);

    const handleUpload = async () => {
        try {
            await API.post("/transcripts", {
                employeeId,
                transcriptText: transcript,
            });

            alert("Transcript uploaded");
            setTranscript("");
        } catch (err) {
            alert("Upload failed");
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ flex: 1 }}>
                <Navbar />

                <div style={{ padding: 20 }}>
                    <h2>Upload Meeting Transcript</h2>

                    <select
                        onChange={(e) => setEmployeeId(e.target.value)}
                        style={{ padding: 10, marginTop: 10 }}
                    >
                        <option>Select Employee</option>
                        {employees.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                                {emp.name}
                            </option>
                        ))}
                    </select>

                    <br /><br />

                    <textarea
                        placeholder="Paste meeting transcript here..."
                        rows="8"
                        cols="60"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                    />

                    <br /><br />

                    <button onClick={handleUpload}>Upload Transcript</button>
                </div>
            </div>
        </div>
    );
}