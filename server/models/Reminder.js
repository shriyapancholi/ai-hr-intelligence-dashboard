const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  employeeName: String,
  date: { type: Date, required: true },
  priority: { type: String, enum: ["Low", "Normal", "High"], default: "Normal" },
  notes: String,
  status: { type: String, enum: ["Pending", "Done"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Reminder", reminderSchema);
