const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: String,
  employeeId: String,
  department: String,
  role: String,
  email: String,
  phone: String,
  notes: String,
  sentimentScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);