const Anthropic = require("@anthropic-ai/sdk");
const Employee = require("../models/Employee");
const Meeting = require("../models/Meeting");
const Transcript = require("../models/Transcript");

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    const client = getClient();

    const [employees, meetings, transcripts] = await Promise.all([
      Employee.find({}, "name department role sentimentScore").limit(50),
      Meeting.find({}, "title datetime participants").sort({ datetime: -1 }).limit(20),
      Transcript.find({}, "employeeId sentiment summary meetingDate").sort({ meetingDate: -1 }).limit(20),
    ]);

    const context = `
You are an AI HR Intelligence assistant. Here is the current HR data:

EMPLOYEES (${employees.length} total):
${employees.map((e) => `- ${e.name} (${e.department}, ${e.role}) — Sentiment: ${e.sentimentScore || "N/A"}/10`).join("\n")}

RECENT MEETINGS (${meetings.length}):
${meetings.map((m) => `- ${m.title} on ${new Date(m.datetime).toLocaleDateString()} with ${m.participants?.length || 0} participants`).join("\n")}

RECENT TRANSCRIPTS:
${transcripts.map((t) => `- Sentiment: ${t.sentiment || "N/A"}, Summary: ${t.summary || "No summary"}`).join("\n")}

Answer the HR manager's question concisely and helpfully based on this data.
    `.trim();

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: context,
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: response.content[0].text });
  } catch (err) {
    if (err.message.includes("ANTHROPIC_API_KEY")) {
      return res.status(503).json({ reply: "AI assistant is not configured. Please add ANTHROPIC_API_KEY to your .env file." });
    }
    res.status(500).json({ reply: "AI assistant is temporarily unavailable." });
  }
};

exports.analyzeTranscript = async (req, res) => {
  try {
    const { transcriptText } = req.body;
    if (!transcriptText) return res.status(400).json({ message: "Transcript text is required" });

    const client = getClient();

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `Analyze this HR meeting transcript and return a JSON object with these exact fields:
{
  "sentiment": "Positive" | "Neutral" | "Negative",
  "summary": "2-3 sentence summary",
  "topics": ["topic1", "topic2", "topic3"],
  "suggestedActions": ["action1", "action2"]
}

Transcript:
${transcriptText}

Return only valid JSON, no other text.`,
        },
      ],
    });

    const parsed = JSON.parse(response.content[0].text);
    res.json(parsed);
  } catch (err) {
    if (err.message.includes("ANTHROPIC_API_KEY")) {
      return res.status(503).json({ message: "AI analysis not configured. Add ANTHROPIC_API_KEY to .env." });
    }
    res.status(500).json({ message: "AI analysis failed" });
  }
};
