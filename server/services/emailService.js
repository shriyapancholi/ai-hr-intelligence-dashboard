const nodemailer = require("nodemailer");

async function sendMeetingInvite({ title, datetime, meetingLink, participants }) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass || pass === "your_16_char_app_password") {
    console.warn("[EMAIL] Skipped — set GMAIL_USER and GMAIL_APP_PASSWORD in server/.env");
    return;
  }

  const emails = participants.filter((p) => p.includes("@"));
  if (emails.length === 0) return;

  const formattedDate = new Date(datetime).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1E293B;">
      <div style="background: #4F46E5; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <h2 style="color: white; margin: 0; font-size: 22px;">📅 Meeting Invitation</h2>
      </div>
      <div style="border: 1px solid #E2E8F0; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">
        <h3 style="margin: 0 0 20px; font-size: 20px; color: #1E293B;">${title}</h3>

        <div style="background: #F8FAFC; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px;"><strong>📆 Date &amp; Time:</strong> ${formattedDate}</p>
          ${meetingLink ? `<p style="margin: 0;"><strong>🔗 Meeting Link:</strong> <a href="${meetingLink}" style="color: #4F46E5;">${meetingLink}</a></p>` : ""}
        </div>

        ${
          meetingLink
            ? `<a href="${meetingLink}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">Join Google Meet</a>`
            : "<p style='color: #64748B;'>A meeting link will be shared shortly.</p>"
        }

        <p style="margin-top: 28px; font-size: 13px; color: #94A3B8;">
          This invitation was sent via HR Intelligence Dashboard.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"HR Intelligence" <${process.env.GMAIL_USER}>`,
    to: emails.join(", "),
    subject: `Meeting Invitation: ${title}`,
    html,
  });
}

module.exports = { sendMeetingInvite };
