const Employee = require("../models/Employee");
const Transcript = require("../models/Transcript");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    const transcripts = await Transcript.find();

    const meetingsThisMonth = transcripts.length;

    const avgSentiment =
      transcripts.reduce((acc, t) => acc + (t.sentiment || 0), 0) /
      (transcripts.length || 1);

    res.json({
      totalEmployees,
      meetingsThisMonth,
      avgSentiment: avgSentiment.toFixed(1),
      employeesAtRisk: 12 // temp
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};