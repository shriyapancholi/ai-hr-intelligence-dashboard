const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    meetingDate: Date,
    transcriptText: String,
    summary: String,
    sentiment: String
}, { timestamps: true });

module.exports = mongoose.model("Transcript", transcriptSchema);