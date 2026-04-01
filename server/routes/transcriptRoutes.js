const express = require("express");
const router = express.Router();
const transcriptController = require("../controllers/transcriptController");

router.post("/upload", transcriptController.uploadTranscript);
router.get("/employee/:employeeId", transcriptController.getEmployeeTranscripts);

module.exports = router;