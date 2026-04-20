import { useState, useEffect } from "react";
import {
  Video,
  Users,
  Clock,
  Copy,
  ExternalLink,
  Plus,
  X,
  Check,
  Calendar,
} from "lucide-react";
import API from "../services/api";

/* ─── helpers ──────────────────────────────────────── */

function getStatus(datetime) {
  const diffMins = (new Date(datetime) - new Date()) / 60000;
  if (diffMins > 5) return "upcoming";
  if (diffMins >= -60) return "ongoing";
  return "completed";
}

function getTimeLabel(datetime) {
  const diffMins = Math.round((new Date(datetime) - new Date()) / 60000);
  if (diffMins > 0) return `Starts in ${diffMins}m`;
  if (diffMins >= -60) return `Started ${Math.abs(diffMins)}m ago`;
  return null;
}

function fmtDateTime(dt) {
  return new Date(dt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


/* ─── stat card ─────────────────────────────────────── */

function StatCard({ icon, label, value, bg, live }) {
  return (
    <div className="card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ fontSize: "28px", fontWeight: "700", fontFamily: "Sora, sans-serif" }}>
            {value}
          </div>
          {live && value > 0 && (
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#16A34A",
                display: "inline-block",
              }}
            />
          )}
        </div>
        <div className="text-muted">{label}</div>
      </div>
    </div>
  );
}

/* ─── meeting card ──────────────────────────────────── */

function MeetingCard({ meeting, copiedId, addLinkId, manualLink, generatingId, onCopy, onGenerate, onSetAddLink, onLinkChange, onSaveLink }) {
  const status = getStatus(meeting.datetime);
  const timeLabel = getTimeLabel(meeting.datetime);
  const hasLink = !!meeting.meetingLink;

  const statusMap = {
    upcoming: { label: "Upcoming", cls: "badge-warning" },
    ongoing: { label: "Live Now", cls: "badge-success" },
    completed: { label: "Completed", cls: "" },
  };
  const { label: statusLabel, cls } = statusMap[status];

  const cardBorder = status === "ongoing" ? "1px solid #86EFAC" : "1px solid var(--gray-200)";
  const cardBg = status === "ongoing" ? "#F0FDF4" : "white";
  const iconBg =
    status === "ongoing" ? "#DCFCE7" : status === "upcoming" ? "#EEF2FF" : "var(--gray-100)";
  const iconColor =
    status === "ongoing" ? "#16A34A" : status === "upcoming" ? "#4F46E5" : "#94A3B8";

  return (
    <div className="card" style={{ padding: "18px", border: cardBorder, background: cardBg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>

        {/* Left */}
        <div style={{ display: "flex", gap: "14px", flex: 1, minWidth: 0 }}>
          <div
            className="icon-box"
            style={{ background: iconBg, flexShrink: 0, width: "40px", height: "40px", borderRadius: "10px" }}
          >
            <Video size={18} color={iconColor} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: "600", marginBottom: "4px" }}>{meeting.title}</div>

            <div className="text-muted" style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={12} /> {fmtDateTime(meeting.datetime)}
              </span>
              {meeting.participants?.length > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Users size={12} /> {meeting.participants.join(", ")}
                </span>
              )}
            </div>

            {timeLabel && (
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: status === "ongoing" ? "#16A34A" : "#4F46E5",
                }}
              >
                {timeLabel}
              </div>
            )}

            {/* Inline add-link input */}
            {addLinkId === meeting._id && (
              <div style={{ marginTop: "10px", display: "flex", gap: "6px" }}>
                <input
                  className="form-input"
                  placeholder="https://meet.google.com/..."
                  value={manualLink}
                  onChange={(e) => onLinkChange(e.target.value)}
                  style={{ flex: 1, margin: 0 }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onSaveLink(meeting._id)}
                >
                  Save
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => onSetAddLink(null)}
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <span className={`badge ${cls}`}>{statusLabel}</span>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {hasLink ? (
              <>
                {status !== "completed" && (
                  <a
                    href={meeting.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ textDecoration: "none" }}
                  >
                    <ExternalLink size={13} /> Join Meet
                  </a>
                )}
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => onCopy(meeting.meetingLink, meeting._id)}
                >
                  {copiedId === meeting._id ? <Check size={13} /> : <Copy size={13} />}
                  {copiedId === meeting._id ? "Copied!" : "Copy"}
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onGenerate(meeting)}
                  disabled={generatingId === meeting._id}
                >
                  <Video size={13} />
                  {generatingId === meeting._id ? "Generating..." : "Generate Link"}
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => { onSetAddLink(meeting._id); onLinkChange(""); }}
                >
                  Add Link
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── main page ──────────────────────────────────────── */

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPanel, setOpenPanel] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [addLinkId, setAddLinkId] = useState(null);
  const [manualLink, setManualLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [generatingId, setGeneratingId] = useState(null);
  const [generateError, setGenerateError] = useState("");

  const [form, setForm] = useState({
    title: "",
    datetime: "",
    participants: "",
    generateLink: true,
    meetingLink: "",
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/meetings");
      setMeetings(data);
    } catch (err) {
      console.error("Failed to fetch meetings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        datetime: form.datetime,
        participants: form.participants
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        generateLink: form.generateLink,
        meetingLink: form.generateLink ? "" : form.meetingLink,
      };
      const { data } = await API.post("/meetings", payload);
      setMeetings((prev) => [data, ...prev]);
      setOpenPanel(false);
      setForm({ title: "", datetime: "", participants: "", generateLink: true, meetingLink: "" });
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create meeting.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerate = async (meeting) => {
    setGenerateError("");
    setGeneratingId(meeting._id);
    try {
      const { data } = await API.post(`/meetings/${meeting._id}/generate-link`);
      setMeetings((prev) => prev.map((m) => (m._id === data._id ? data : m)));
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to generate Google Meet link.";
      setGenerateError(msg);
    } finally {
      setGeneratingId(null);
    }
  };

  const handleSaveManualLink = async (meetingId) => {
    if (!manualLink.trim()) return;
    try {
      const { data } = await API.patch(`/meetings/${meetingId}/link`, { link: manualLink });
      setMeetings((prev) => prev.map((m) => (m._id === data._id ? data : m)));
      setAddLinkId(null);
      setManualLink("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (link, id) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const counts = meetings.reduce(
    (acc, m) => { acc[getStatus(m.datetime)]++; return acc; },
    { upcoming: 0, ongoing: 0, completed: 0 }
  );

  return (
    <div style={{ display: "flex" }}>
      {/* ── Main content ── */}
      <div style={{ flex: 1, paddingRight: openPanel ? "400px" : "0", transition: "padding 0.2s" }}>

        {/* Header */}
        <div className="page-header" style={{ marginBottom: "24px" }}>
          <div>
            <h1>Meetings</h1>
            <p className="text-muted">Schedule, join, and manage team meetings</p>
          </div>
          <button className="btn btn-primary" onClick={() => setOpenPanel(true)}>
            <Plus size={16} /> Create Meeting
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <StatCard
            icon={<Clock size={18} color="#4F46E5" />}
            label="Upcoming"
            value={counts.upcoming}
            bg="#EEF2FF"
          />
          <StatCard
            icon={<Video size={18} color="#16A34A" />}
            label="Ongoing"
            value={counts.ongoing}
            bg="#DCFCE7"
            live
          />
          <StatCard
            icon={<Check size={18} color="#64748B" />}
            label="Completed"
            value={counts.completed}
            bg="#F1F5F9"
          />
        </div>

        {/* Meeting list */}
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3>All Meetings</h3>
              <p className="text-muted" style={{ marginTop: "2px" }}>
                {meetings.length} total
              </p>
            </div>
            <Calendar size={18} color="var(--gray-400)" />
          </div>

          {generateError && (
            <div
              style={{
                margin: "16px 16px 0",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#fef2f2",
                color: "#dc2626",
                fontSize: "13px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{generateError}</span>
              <X size={14} style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => setGenerateError("")} />
            </div>
          )}

          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--gray-400)" }}>
              Loading meetings...
            </div>
          ) : meetings.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: "#EEF2FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <Video size={24} color="#4F46E5" />
              </div>
              <div style={{ fontWeight: "600", marginBottom: "6px" }}>No meetings yet</div>
              <div className="text-muted">Create your first meeting to get started.</div>
            </div>
          ) : (
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {meetings.map((m) => (
                <MeetingCard
                  key={m._id}
                  meeting={m}
                  copiedId={copiedId}
                  addLinkId={addLinkId}
                  manualLink={manualLink}
                  generatingId={generatingId}
                  onCopy={handleCopy}
                  onGenerate={handleGenerate}
                  onSetAddLink={setAddLinkId}
                  onLinkChange={setManualLink}
                  onSaveLink={handleSaveManualLink}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Create Meeting Panel ── */}
      {openPanel && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            width: "400px",
            height: "100vh",
            background: "#fff",
            borderLeft: "1px solid var(--gray-200)",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.06)",
            padding: "24px 22px",
            display: "flex",
            flexDirection: "column",
            zIndex: 100,
            overflowY: "auto",
          }}
        >
          {/* Panel header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" }}>
            <div>
              <h3>Create Meeting</h3>
              <div className="text-muted">Schedule a new team meeting</div>
            </div>
            <X style={{ cursor: "pointer", color: "var(--gray-500)", flexShrink: 0 }} onClick={() => setOpenPanel(false)} />
          </div>

          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {formError && (
              <div
                style={{
                  marginBottom: "14px",
                  color: "#dc2626",
                  fontSize: "13px",
                  background: "#fef2f2",
                  padding: "8px 12px",
                  borderRadius: "6px",
                }}
              >
                {formError}
              </div>
            )}

            <label style={{ fontSize: "13px", fontWeight: "500", color: "var(--gray-700)" }}>
              Meeting Title
            </label>
            <input
              className="form-input"
              placeholder="Q4 Planning Call"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <label style={{ fontSize: "13px", fontWeight: "500", color: "var(--gray-700)" }}>
              Date &amp; Time
            </label>
            <input
              type="datetime-local"
              className="form-input"
              value={form.datetime}
              onChange={(e) => setForm({ ...form, datetime: e.target.value })}
              required
            />

            <label style={{ fontSize: "13px", fontWeight: "500", color: "var(--gray-700)" }}>
              Participants
            </label>
            <input
              className="form-input"
              placeholder="alice@co.com, bob@co.com"
              value={form.participants}
              onChange={(e) => setForm({ ...form, participants: e.target.value })}
            />
            <div className="text-muted" style={{ marginTop: "-6px", marginBottom: "14px", fontSize: "12px" }}>
              Comma-separated names or emails
            </div>

            {/* Generate link toggle */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                cursor: "pointer",
                padding: "14px",
                borderRadius: "10px",
                border: `1px solid ${form.generateLink ? "#C7D2FE" : "var(--gray-200)"}`,
                background: form.generateLink ? "#EEF2FF" : "white",
                marginBottom: "14px",
                transition: "all 0.15s",
              }}
            >
              <input
                type="checkbox"
                checked={form.generateLink}
                onChange={(e) => setForm({ ...form, generateLink: e.target.checked })}
                style={{ accentColor: "#4F46E5", width: "16px", height: "16px", marginTop: "2px", flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600" }}>
                  Generate Google Meet link
                </div>
                <div className="text-muted" style={{ fontSize: "12px" }}>
                  Auto-create a meet.google.com link
                </div>
              </div>
            </label>

            {!form.generateLink && (
              <>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "var(--gray-700)" }}>
                  Meeting Link (optional)
                </label>
                <input
                  className="form-input"
                  placeholder="https://meet.google.com/..."
                  value={form.meetingLink}
                  onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                />
              </>
            )}

            <div style={{ marginTop: "auto", paddingTop: "16px", display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={() => setOpenPanel(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Meeting"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
