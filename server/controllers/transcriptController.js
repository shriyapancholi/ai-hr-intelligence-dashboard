const Transcript = require("../models/Transcript");

exports.uploadTranscript = async (req, res) => {
  try {
    const { employeeId, meetingDate, transcriptText } = req.body;

    if (!employeeId || !meetingDate || !transcriptText) {
      return res.status(400).json({ message: "employeeId, meetingDate, and transcriptText are required" });
    }

    const transcript = new Transcript({
      employeeId,
      meetingDate,
      transcriptText,
      summary: "",
      sentiment: "",
    });

    await transcript.save();
    res.status(201).json(transcript);
  } catch (err) {
    res.status(500).json({ message: "Failed to upload transcript" });
  }
};

exports.getEmployeeTranscripts = async (req, res) => {
  try {
    const transcripts = await Transcript.find({ employeeId: req.params.employeeId })
      .sort({ meetingDate: -1 });
    res.json(transcripts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transcripts" });
  }
};

exports.getAllTranscripts = async (req, res) => {
  try {
    const transcripts = await Transcript.find()
      .populate("employeeId", "name")
      .sort({ meetingDate: -1 })
      .limit(100);
    const result = transcripts.map((t) => ({
      ...t.toObject(),
      employeeName: t.employeeId?.name || "",
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transcripts" });
  }
};

exports.updateTranscriptAnalysis = async (req, res) => {
  try {
    const { sentiment, summary } = req.body;
    const transcript = await Transcript.findByIdAndUpdate(
      req.params.id,
      { sentiment, summary },
      { new: true }
    );
    if (!transcript) return res.status(404).json({ message: "Transcript not found" });
    res.json(transcript);
  } catch (err) {
    res.status(500).json({ message: "Failed to update transcript" });
  }
};
