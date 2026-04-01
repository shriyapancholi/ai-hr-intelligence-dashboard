const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  role: String,
  sentimentScore: Number,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);