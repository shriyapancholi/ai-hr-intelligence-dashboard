const express = require("express");
const router = express.Router();
const transcriptController = require("../controllers/transcriptController");
const auth = require("../middleware/auth");

router.post("/upload", auth, transcriptController.uploadTranscript);
router.get("/employee/:employeeId", auth, transcriptController.getEmployeeTranscripts);

module.exports = router;