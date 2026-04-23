const Meeting = require("../models/Meeting");
const { createGoogleMeetLink } = require("../services/googleMeet");
const { sendMeetingInvite } = require("../services/emailService");

function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function handleGoogleError(err, res) {
  if (err.code === "GOOGLE_CREDENTIALS_MISSING") {
    return res.status(503).json({
      message: err.message,
      setup: "See server/.env.example for required GOOGLE_* variables.",
    });
  }
  res.status(500).json({ message: "Google Calendar API error" });
}

// GET /api/meetings
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ datetime: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch meetings" });
  }
};

// POST /api/meetings
exports.createMeeting = async (req, res) => {
  try {
    const { title, datetime, participants, generateLink, meetingLink } = req.body;

    if (!title || !datetime) {
      return res.status(400).json({ message: "Title and datetime are required" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let link = meetingLink || "";
    let calendarEventId = "";

    if (generateLink) {
      try {
        const result = await createGoogleMeetLink(title, datetime, participants || []);
        link = result.link;
        calendarEventId = result.calendarEventId;
      } catch (googleErr) {
        if (googleErr.code !== "GOOGLE_CREDENTIALS_MISSING") throw googleErr;
        // Proceed without Meet link — email will still be sent without one
      }
    }

    const meeting = await Meeting.create({
      title,
      datetime,
      participants: participants || [],
      meetingLink: link,
      calendarEventId,
      createdBy: req.user.id,
    });

    // Always send email invite — fires immediately regardless of Meet link
    sendMeetingInvite({
      title,
      datetime,
      meetingLink: link,
      participants: participants || [],
    }).then(() => console.log("[EMAIL] Invite sent for:", title))
      .catch((e) => console.error("[EMAIL] Failed to send invite:", e.message));

    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ message: "Failed to create meeting" });
  }
};

// POST /api/meetings/:id/generate-link
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

    sendMeetingInvite({
      title: meeting.title,
      datetime: meeting.datetime,
      meetingLink: link,
      participants: meeting.participants,
    }).then(() => console.log("[EMAIL] Invite sent for:", meeting.title))
      .catch((e) => console.error("[EMAIL] Failed to send invite:", e.message));

    res.json(meeting);
  } catch (err) {
    if (err.code === "GOOGLE_CREDENTIALS_MISSING") return handleGoogleError(err, res);
    res.status(500).json({ message: "Failed to generate meeting link" });
  }
};

// PATCH /api/meetings/:id/status
exports.updateMeetingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["upcoming", "ongoing", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: "Failed to update meeting status" });
  }
};

// PATCH /api/meetings/:id/link
exports.updateMeetingLink = async (req, res) => {
  try {
    const { link } = req.body;

    if (!link || !isValidHttpUrl(link)) {
      return res.status(400).json({ message: "A valid URL is required" });
    }

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { meetingLink: link },
      { new: true }
    );
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: "Failed to update meeting link" });
  }
};
