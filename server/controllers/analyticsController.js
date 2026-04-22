const Employee = require("../models/Employee");
const Meeting = require("../models/Meeting");
const Transcript = require("../models/Transcript");

exports.getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [employees, meetingsThisQuarter, transcripts, monthlyTranscripts, deptAgg] =
      await Promise.all([
        Employee.find({}, "sentimentScore department"),
        Meeting.countDocuments({ datetime: { $gte: startOfQuarter } }),
        Transcript.find({ sentiment: { $ne: "" } }, "sentiment"),
        Transcript.aggregate([
          { $match: { meetingDate: { $gte: sixMonthsAgo } } },
          {
            $addFields: {
              sentimentNum: {
                $switch: {
                  branches: [
                    { case: { $eq: [{ $toLower: "$sentiment" }, "positive"] }, then: 9 },
                    { case: { $eq: [{ $toLower: "$sentiment" }, "neutral"] }, then: 6 },
                    { case: { $eq: [{ $toLower: "$sentiment" }, "negative"] }, then: 3 },
                  ],
                  default: 6,
                },
              },
              month: { $month: "$meetingDate" },
              year: { $year: "$meetingDate" },
            },
          },
          { $group: { _id: { year: "$year", month: "$month" }, avg: { $avg: "$sentimentNum" } } },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
        Employee.aggregate([
          { $group: { _id: "$department", avgSentiment: { $avg: "$sentimentScore" }, count: { $sum: 1 } } },
          { $sort: { avgSentiment: -1 } },
        ]),
      ]);

    // Sentiment scores from employees
    const scores = employees.map((e) => e.sentimentScore || 0).filter((s) => s > 0);
    const avgEngagement = scores.length
      ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
      : 0;
    const avgSentiment = avgEngagement;

    // Risk breakdown
    const atRisk = employees.filter((e) => (e.sentimentScore || 0) < 5).length;
    const medium = employees.filter((e) => (e.sentimentScore || 0) >= 5 && (e.sentimentScore || 0) < 7).length;
    const low = employees.filter((e) => (e.sentimentScore || 0) >= 7).length;
    const total = employees.length || 1;

    const riskData = [
      { name: "Low Risk", value: Math.round((low / total) * 100) },
      { name: "Medium Risk", value: Math.round((medium / total) * 100) },
      { name: "High Risk", value: Math.round((atRisk / total) * 100) },
    ];

    // Sentiment distribution from transcripts
    const pos = transcripts.filter((t) => t.sentiment?.toLowerCase() === "positive").length;
    const neu = transcripts.filter((t) => t.sentiment?.toLowerCase() === "neutral").length;
    const neg = transcripts.filter((t) => t.sentiment?.toLowerCase() === "negative").length;
    const tTotal = transcripts.length || 1;
    const sentimentDist = [
      { name: "Positive", value: Math.round((pos / tTotal) * 100) },
      { name: "Neutral", value: Math.round((neu / tTotal) * 100) },
      { name: "Negative", value: Math.round((neg / tTotal) * 100) },
    ];

    // Engagement trend (from transcripts monthly)
    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const engagementTrend = monthlyTranscripts.map((m) => ({
      month: MONTH_NAMES[m._id.month - 1],
      value: parseFloat(m.avg.toFixed(1)),
    }));

    // Dept performance
    const deptPerformance = deptAgg
      .filter((d) => d._id)
      .map((d) => ({
        name: d._id,
        score: parseFloat((d.avgSentiment || 0).toFixed(1)),
        percent: Math.round(((d.avgSentiment || 0) / 10) * 100),
      }));

    res.json({
      avgEngagement,
      avgSentiment,
      atRisk,
      meetingsThisQuarter,
      engagementTrend,
      sentimentDist,
      riskData,
      deptPerformance,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
