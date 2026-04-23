const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    datetime: { type: Date, required: true },
    participants: [String],
    meetingLink: { type: String, default: "" },
    calendarEventId: { type: String, default: "" },
    createdBy: { type: String, default: "HR Manager" },
    status: { type: String, enum: ["upcoming", "ongoing", "completed"], default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
