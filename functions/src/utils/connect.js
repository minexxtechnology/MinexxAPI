const {google} = require("googleapis");
const spreadsheets = require("./sheets.json");
const admin = require("firebase-admin");
const account = require(`./minexx-dashboard-firebase-adminsdk-7c5hv-16967b9a45.json`);

const firebase = admin.initializeApp({
  credential: admin.credential.cert(account),
});

// auth client object creation
const oauth2client = new google.auth.OAuth2({
  clientId: `426415920655-jf58li8rpbb4c750c0s8mq2mhcpjctvp.apps.googleusercontent.com`,
  clientSecret: `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`,
  redirectUri: `http://localhost:3000/auth`,
});

oauth2client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly",
  token_type: "Bearer",
  id_token: process.env.GOOGLE_ID_TOKEN,
});

// create reusable object for accessing sheets
const sheets = google.sheets({
  version: `v4`,
  auth: oauth2client,
});

// create reusable object for accessing google drive
const drive = google.drive({
  version: `v3`,
  auth: oauth2client,
});

module.exports = {
  oauth2client,
  spreadsheets,
  firebase,
  sheets,
  drive,
};
