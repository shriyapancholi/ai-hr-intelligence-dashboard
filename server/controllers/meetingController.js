const Meeting = require("../models/Meeting");
const { createGoogleMeetLink } = require("../services/googleMeet");

// Shared error handler for Google credential errors
function handleGoogleError(err, res) {
  if (err.code === "GOOGLE_CREDENTIALS_MISSING") {
    return res.status(503).json({
      message: err.message,
      setup: "See server/.env.example for required GOOGLE_* variables.",
    });
  }
  console.error("Google Calendar API error:", err.message);
  res.status(500).json({ message: err.message });
}

// GET /api/meetings
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ datetime: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/meetings
exports.createMeeting = async (req, res) => {
  try {
    const { title, datetime, participants, generateLink, meetingLink } = req.body;

    if (!title || !datetime) {
      return res.status(400).json({ message: "Title and datetime are required" });
    }

    let link = meetingLink || "";
    let calendarEventId = "";

    if (generateLink) {
      const result = await createGoogleMeetLink(
        title,
        datetime,
        participants || []
      );
      link = result.link;
      calendarEventId = result.calendarEventId;
    }

    const meeting = await Meeting.create({
      title,
      datetime,
      participants: participants || [],
      meetingLink: link,
      calendarEventId,
      createdBy: req.user?.id || "unknown",
    });

    res.status(201).json(meeting);
  } catch (err) {
    if (err.code === "GOOGLE_CREDENTIALS_MISSING") return handleGoogleError(err, res);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/meetings/:id/generate-link
// Creates a real Google Meet event for an existing meeting that has no link yet
exports.generateMeetingLink = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    const { link, calendarEventId } = await createGoogleMeetLink(
      meeting.title,
      meeting.datetime,
      meeting.participants
    );

    meeting.meetingLink = link;
    meeting.calendarEventId = calendarEventId;
    await meeting.save();

    res.json(meeting);
  } catch (err) {
    if (err.code === "GOOGLE_CREDENTIALS_MISSING") return handleGoogleError(err, res);
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/meetings/:id/link — manually set a link
exports.updateMeetingLink = async (req, res) => {
  try {
    const { link } = req.body;
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { meetingLink: link },
      { new: true }
    );
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
