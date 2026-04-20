const { google } = require("googleapis");

/**
 * Creates a real Google Calendar event with a Google Meet link.
 *
 * Requirements:
 *  - GOOGLE_CLIENT_EMAIL  : service account email
 *  - GOOGLE_PRIVATE_KEY   : service account private key (newlines as \n in .env)
 *  - GOOGLE_SUBJECT_EMAIL : a Google Workspace user to impersonate (domain-wide delegation)
 *  - GOOGLE_CALENDAR_ID   : calendar to create events on (default: "primary")
 *
 * @param {string}   title        Meeting title
 * @param {string}   datetime     ISO date-time string
 * @param {string[]} participants Array of emails/names
 * @returns {{ link: string, calendarEventId: string }}
 */
async function createGoogleMeetLink(title, datetime, participants = []) {
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SUBJECT_EMAIL } =
    process.env;

  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    const err = new Error(
      "Google credentials not configured. Add GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY to .env"
    );
    err.code = "GOOGLE_CREDENTIALS_MISSING";
    throw err;
  }

  // JWT auth — supports domain-wide delegation via subject
  const auth = new google.auth.JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    subject: GOOGLE_SUBJECT_EMAIL || undefined,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const calendar = google.calendar({ version: "v3", auth });

  const startTime = new Date(datetime);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour default

  // Only real email addresses become attendees (names without @ are skipped)
  const attendees = participants
    .filter((p) => p.includes("@"))
    .map((email) => ({ email: email.trim() }));

  const { data } = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    conferenceDataVersion: 1,
    sendUpdates: attendees.length > 0 ? "all" : "none",
    requestBody: {
      summary: title,
      start: { dateTime: startTime.toISOString() },
      end: { dateTime: endTime.toISOString() },
      attendees,
      conferenceData: {
        createRequest: {
          // Must be unique per request
          requestId: `hr-intel-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  // Google returns hangoutLink at top level; fall back to entryPoints
  const link =
    data.hangoutLink ||
    data.conferenceData?.entryPoints?.find(
      (e) => e.entryPointType === "video"
    )?.uri;

  if (!link) {
    throw new Error(
      "Google Meet link was not returned. Ensure your account is Google Workspace and " +
        "the service account has domain-wide delegation enabled."
    );
  }

  return { link, calendarEventId: data.id };
}

module.exports = { createGoogleMeetLink };
