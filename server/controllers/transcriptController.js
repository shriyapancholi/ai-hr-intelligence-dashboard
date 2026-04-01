const Transcript = require("../models/Transcript");

exports.uploadTranscript = async (req, res) => {
    try {
        const { employeeId, meetingDate, transcriptText } = req.body;

        const transcript = new Transcript({
            employeeId,
            meetingDate,
            transcriptText,
            summary: "",
            sentiment: ""
        });

        await transcript.save();
        res.json(transcript);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeTranscripts = async (req, res) => {
    const transcripts = await Transcript.find({
        employeeId: req.params.employeeId
    });

    res.json(transcripts);
};