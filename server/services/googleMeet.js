const { google } = require("googleapis");

async function createGoogleMeetLink(title, datetime, participants = []) {
  const {
    GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN,
    GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SUBJECT_EMAIL,
  } = process.env;

  let auth;

  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN) {
    // OAuth2 path — works with a personal Google account
    const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
    oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
    auth = oauth2Client;
  } else if (GOOGLE_CLIENT_EMAIL && GOOGLE_PRIVATE_KEY) {
    // Service account path — requires Google Workspace with domain-wide delegation
    auth = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      subject: GOOGLE_SUBJECT_EMAIL || undefined,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });
  } else {
    const err = new Error(
      "Google credentials not configured. Add GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY to .env"
    );
    err.code = "GOOGLE_CREDENTIALS_MISSING";
    throw err;
  }

  const calendar = google.calendar({ version: "v3", auth });

  const startTime = new Date(datetime);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

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
          requestId: `hr-intel-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  const link =
    data.hangoutLink ||
    data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri;

  if (!link) {
    throw new Error(
      "Google Meet link was not returned. Ensure your Google account supports Meet and the Calendar API is enabled."
    );
  }

  return { link, calendarEventId: data.id };
}

module.exports = { createGoogleMeetLink };
