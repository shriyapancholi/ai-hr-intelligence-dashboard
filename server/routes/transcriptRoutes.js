const express = require("express");
const router = express.Router();
const transcriptController = require("../controllers/transcriptController");

router.post("/upload", transcriptController.uploadTranscript);
router.get("/employee/:employeeId", transcriptController.getEmployeeTranscripts);

module.exports = router;
exports.getAllTranscripts = async (req, res) => {
  const data = await Transcript.find().populate("employeeId");
  res.json(data);
};