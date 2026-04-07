const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: String,
  date: Date,
});

module.exports = mongoose.model("Meeting", meetingSchema);