/**
 * Run this ONCE to get your Google OAuth2 refresh token.
 *
 * Steps:
 *  1. Fill in CLIENT_ID and CLIENT_SECRET below (from Google Cloud Console)
 *  2. Run:  node scripts/get-google-token.js
 *  3. Open the URL it prints, sign in with your Google account, approve Calendar access
 *  4. Paste the code it gives you back into the terminal
 *  5. Copy the refresh_token into server/.env as GOOGLE_REFRESH_TOKEN
 */

const { google } = require("googleapis");
const readline = require("readline");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "PASTE_YOUR_CLIENT_ID_HERE";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "PASTE_YOUR_CLIENT_SECRET_HERE";
const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/calendar"],
});

console.log("\n─────────────────────────────────────────────────");
console.log("Open this URL in your browser and sign in:\n");
console.log(authUrl);
console.log("─────────────────────────────────────────────────\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("Paste the authorization code here: ", async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    console.log("\n✅ Success! Add this to your server/.env:\n");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log("\n(Also make sure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set)\n");
  } catch (err) {
    console.error("Failed to get token:", err.message);
  }
});
