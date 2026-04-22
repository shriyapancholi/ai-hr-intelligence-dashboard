const Employee = require("../models/Employee");
const Meeting = require("../models/Meeting");
const Transcript = require("../models/Transcript");

exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalEmployees, meetingsThisMonth, sentimentAgg, atRisk, deptAgg, monthlyTrend] =
      await Promise.all([
        Employee.countDocuments(),
        Meeting.countDocuments({ datetime: { $gte: startOfMonth } }),
        Employee.aggregate([{ $group: { _id: null, avg: { $avg: "$sentimentScore" } } }]),
        Employee.countDocuments({ sentimentScore: { $lt: 5 } }),
        Employee.aggregate([
          { $group: { _id: "$department", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        // Monthly avg sentiment from transcripts over last 6 months
        Transcript.aggregate([
          {
            $match: {
              meetingDate: {
                $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
              },
              sentiment: { $ne: "" },
            },
          },
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
          {
            $group: {
              _id: { year: "$year", month: "$month" },
              avgSentiment: { $avg: "$sentimentNum" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
      ]);

    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const sentimentTrend = monthlyTrend.map((m) => ({
      month: MONTH_NAMES[m._id.month - 1],
      value: parseFloat(m.avgSentiment.toFixed(1)),
    }));

    const totalDeptCount = deptAgg.reduce((s, d) => s + d.count, 0);
    const departments = deptAgg.map((d) => ({
      name: d._id || "Unknown",
      value: totalDeptCount > 0 ? Math.round((d.count / totalDeptCount) * 100) : 0,
    }));

    res.json({
      totalEmployees,
      meetingsThisMonth,
      avgSentiment: sentimentAgg[0]?.avg ? parseFloat(sentimentAgg[0].avg.toFixed(1)) : 0,
      atRisk,
      departments,
      sentimentTrend,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
