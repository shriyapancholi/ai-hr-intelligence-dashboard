const OpenAI = require("openai");
const Anthropic = require("@anthropic-ai/sdk");
const Employee = require("../models/Employee");
const Meeting = require("../models/Meeting");
const Transcript = require("../models/Transcript");

/* ── pick whichever key is configured ── */
function getProvider() {
  if (process.env.OPENAI_API_KEY) {
    return { type: "openai", client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return { type: "anthropic", client: new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) };
  }
  throw new Error("No AI key configured. Add OPENAI_API_KEY or ANTHROPIC_API_KEY to .env");
}

async function callAI(systemPrompt, userMessage) {
  const { type, client } = getProvider();

  if (type === "openai") {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });
    return response.choices[0].message.content;
  }

  // anthropic
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });
  return response.content[0].text;
}

/* ── POST /api/ai/chat ── */
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    const [employees, meetings, transcripts] = await Promise.all([
      Employee.find({}, "name department role sentimentScore").limit(50),
      Meeting.find({}, "title datetime participants").sort({ datetime: -1 }).limit(20),
      Transcript.find({}, "employeeId sentiment summary meetingDate").sort({ meetingDate: -1 }).limit(20),
    ]);

    const systemPrompt = `
You are an AI HR Intelligence assistant. Here is the current HR data:

EMPLOYEES (${employees.length} total):
${employees.map((e) => `- ${e.name} (${e.department}, ${e.role}) — Sentiment: ${e.sentimentScore || "N/A"}/10`).join("\n")}

RECENT MEETINGS (${meetings.length}):
${meetings.map((m) => `- ${m.title} on ${new Date(m.datetime).toLocaleDateString()} with ${m.participants?.length || 0} participants`).join("\n")}

RECENT TRANSCRIPTS:
${transcripts.map((t) => `- Sentiment: ${t.sentiment || "N/A"}, Summary: ${t.summary || "No summary"}`).join("\n")}

Answer the HR manager's question concisely and helpfully based on this data.
    `.trim();

    const reply = await callAI(systemPrompt, message);
    res.json({ reply });
  } catch (err) {
    console.error("[AI chat]", err.message);
    res.status(503).json({ reply: "AI assistant is temporarily unavailable. Check your API key in .env." });
  }
};

/* ── POST /api/ai/analyze ── */
exports.analyzeTranscript = async (req, res) => {
  try {
    const { transcriptText } = req.body;
    if (!transcriptText) return res.status(400).json({ message: "Transcript text is required" });

    const systemPrompt = `You are a senior HR analyst specializing in employee wellbeing and engagement assessment. Return only valid JSON — no markdown, no extra text.`;

    const userMessage = `Analyze this HR meeting transcript from an employee wellbeing perspective and return a JSON object with exactly these fields:
{
  "sentiment": "Positive" | "Neutral" | "Negative",
  "summary": "2-3 sentence summary focusing on employee wellbeing and work dynamics",
  "topics": ["topic1", "topic2", "topic3"],
  "suggestedActions": ["action1", "action2"]
}

Sentiment classification rules (HR context):
- "Negative": employee shows signs of stress, frustration, burnout, disengagement, unresolved conflicts, workload issues, missed deadlines causing pressure, feeling unsupported, or communication breakdowns. Even if the employee is polite or willing to improve, underlying problems make it Negative.
- "Neutral": routine factual update, no strong signals either way, minor issues acknowledged and resolved, balanced feedback.
- "Positive": employee shows enthusiasm, feels supported, reports achievements, strong collaboration, growth mindset with no underlying stress signals.

When in doubt between Neutral and Negative, choose Negative if there are unresolved problems, delays, or employee stress signals present.

Transcript:
${transcriptText}`;

    const raw = await callAI(systemPrompt, userMessage);

    // strip any accidental markdown fences
    const clean = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error("[AI analyze]", err.message);
    res.status(500).json({ message: "AI analysis failed. Check your API key in .env." });
  }
};
