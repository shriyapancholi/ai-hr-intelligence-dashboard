const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { chat, analyzeTranscript } = require("../controllers/aiController");

router.post("/chat", auth, chat);
router.post("/analyze", auth, analyzeTranscript);

module.exports = router;
