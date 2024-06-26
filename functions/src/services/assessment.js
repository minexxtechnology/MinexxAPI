const {sheets, spreadsheets} = require("../utils/connect");
const {getFile} = require("./file");

/**
 * @param {User} user - The making request to fetch assessments
 * @param {String} platform - The platform to fetch from
 */
const getAssessments = async (user, platform) => {
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[platform].assessment, range: "Assessment Form!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Mine/Concession Name")]);

  const assessments = [];

  rows.map((row)=>{
    const assessment = {
      general: row.slice(1, header.indexOf(`LEGITIMACY`)),
      legitimacy: row.slice(header.indexOf(`LEGITIMACY`)+1, header.indexOf(`HUMAN AND WORKERS RIGTHS`)),
      rights: row.slice(header.indexOf(`HUMAN AND WORKERS RIGTHS`)+1, header.indexOf(`SOCIETAL WELFARE / SECURITY`)),
      welfare: row.slice(header.indexOf(`SOCIETAL WELFARE / SECURITY`)+1, header.indexOf(`COMPANY GOVERNANCE`)),
      governance: row.slice(header.indexOf(`COMPANY GOVERNANCE`)+1, header.indexOf(`CHAIN OF CUSTODY/Traceability/Tracking`)),
      traceability: row.slice(header.indexOf(`CHAIN OF CUSTODY/Traceability/Tracking`)+1, header.indexOf(`ENVIRONMENT`)),
      environment: row.slice(header.indexOf(`ENVIRONMENT`)+1, header.indexOf(`COMMUNITY IMPACT (Beyond CSR: Minexx Category)`)),
      community: row.slice(header.indexOf(`COMMUNITY IMPACT (Beyond CSR: Minexx Category)`)+1),
    };
    if (user.type === `buyer` || user.type === `investor`) {
      if (user.companies.includes(row[header.length-3])) {
        assessments.push(assessment);
      }
    } else {
      assessments.push(assessment);
    }
  });

  return {assessments: assessments.reverse(), header};
};

/**
 *
 * @param {String} id - Unique identifier for assessment being fetched
 * @param {String} user - User object of the user making the request
 * @param {String} platform - The platform to fetch from
 */
const getMineAssessments = async (id, user, platform) => {
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[platform].assessment, range: "Assessment Form!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Mine/Concession Name")] && item[header.indexOf("Mine/Concession Name")] === id );

  const assessments = [];

  for await (const row of rows) {
    const single = row;
    for await (const x of row) {
      if (header[row.indexOf(x)].includes("Proof Details") || header[row.indexOf(x)].includes("Image") || header[row.indexOf(x)].includes("Pictures") || header[row.indexOf(x)].includes("Photo") || header[row.indexOf(x)].includes("Attachment")) {
        const image = await getFile(x.split("/")[1]);
        if (image.length>0) {
          single[row.indexOf(x)] = image;
        } else {
          single[row.indexOf(x)] = null;
        }
      }
    }
    const assessment = {
      general: single.slice(1, header.indexOf(`LEGITIMACY`)),
      legitimacy: single.slice(header.indexOf(`LEGITIMACY`)+1, header.indexOf(`HUMAN AND WORKERS RIGTHS`)),
      rights: single.slice(header.indexOf(`HUMAN AND WORKERS RIGTHS`)+1, header.indexOf(`SOCIETAL WELFARE / SECURITY`)),
      welfare: single.slice(header.indexOf(`SOCIETAL WELFARE / SECURITY`)+1, header.indexOf(`COMPANY GOVERNANCE`)),
      governance: single.slice(header.indexOf(`COMPANY GOVERNANCE`)+1, header.indexOf(`CHAIN OF CUSTODY/Traceability/Tracking`)),
      traceability: single.slice(header.indexOf(`CHAIN OF CUSTODY/Traceability/Tracking`)+1, header.indexOf(`ENVIRONMENT`)),
      environment: single.slice(header.indexOf(`ENVIRONMENT`)+1, header.indexOf(`COMMUNITY IMPACT (Beyond CSR: Minexx Category)`)),
      community: single.slice(header.indexOf(`COMMUNITY IMPACT (Beyond CSR: Minexx Category)`)+1),
    };
    assessments.push(assessment);
  }

  return {assessments: assessments.reverse(), header};
};

/**
 *
 * @param {String} id - Unique identifier for company whose assessments are being fetched
 * @param {String} platform - The platform to fetch from
 */
const getCompanyAssessments = async (id, platform) => {
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[platform].assessment, range: "Assessment Form!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Mine/Concession Name")]);

  const assessments = [];

  for await (const row of rows) {
    const single = row;
    for await (const x of row) {
      if (header[row.indexOf(x)].includes("Proof Details") || header[row.indexOf(x)].includes("Image") || header[row.indexOf(x)].includes("Pictures") || header[row.indexOf(x)].includes("Photo") || header[row.indexOf(x)].includes("Attachment")) {
        const image = await getFile(x.split("/")[1]);
        if (image.length>0) {
          single[row.indexOf(x)] = image;
        } else {
          single[row.indexOf(x)] = null;
        }
      }
    }
    const assessment = {
      general: single.slice(1, header.indexOf(`LEGITIMACY`)),
      legitimacy: single.slice(header.indexOf(`LEGITIMACY`)+1, header.indexOf(`HUMAN AND WORKERS RIGTHS`)),
      rights: single.slice(header.indexOf(`HUMAN AND WORKERS RIGTHS`)+1, header.indexOf(`SOCIETAL WELFARE / SECURITY`)),
      welfare: single.slice(header.indexOf(`SOCIETAL WELFARE / SECURITY`)+1, header.indexOf(`COMPANY GOVERNANCE`)),
      governance: single.slice(header.indexOf(`COMPANY GOVERNANCE`)+1, header.indexOf(`CHAIN OF CUSTODY/Traceability/Tracking`)),
      traceability: single.slice(header.indexOf(`CHAIN OF CUSTODY/Traceability/Tracking`)+1, header.indexOf(`ENVIRONMENT`)),
      environment: single.slice(header.indexOf(`ENVIRONMENT`)+1, header.indexOf(`COMMUNITY IMPACT (Beyond CSR: Minexx Category)`)),
      community: single.slice(header.indexOf(`COMMUNITY IMPACT (Beyond CSR: Minexx Category)`)+1),
    };
    if (assessment.community[15] === id) {
      assessments.push(assessment);
    }
  }

  return {assessments: assessments.reverse(), header};
};

module.exports = {
  getAssessments,
  getMineAssessments,
  getCompanyAssessments,
};
