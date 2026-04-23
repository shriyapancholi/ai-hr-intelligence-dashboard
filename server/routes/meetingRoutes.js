const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");
const auth = require("../middleware/auth");

router.get("/", auth, meetingController.getMeetings);
router.post("/", auth, meetingController.createMeeting);
router.post("/:id/generate-link", auth, meetingController.generateMeetingLink);
router.patch("/:id/status", auth, meetingController.updateMeetingStatus);
router.patch("/:id/link", auth, meetingController.updateMeetingLink);

module.exports = router;
