const express = require("express");
const router = express.Router();
const transcriptController = require("../controllers/transcriptController");
const auth = require("../middleware/auth");

router.get("/all", auth, transcriptController.getAllTranscripts);
router.post("/upload", auth, transcriptController.uploadTranscript);
router.get("/employee/:employeeId", auth, transcriptController.getEmployeeTranscripts);
router.patch("/:id/analysis", auth, transcriptController.updateTranscriptAnalysis);

module.exports = router;