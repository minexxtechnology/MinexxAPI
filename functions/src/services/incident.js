const Incident = require("../model/incident");
const {sheets, spreadsheets} = require("../utils/connect");
const {getFile} = require("./file");

const getIncidents = async () => {
  const incidents = [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.incident, range: "Incident Form!A:ZZ"});

  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Incident number/ID")]);

  rows.map((single)=>{
    const incident = new Incident({
      id: single[header.indexOf("Incident number/ID")],
      date: new Date(single[header.indexOf("Incident date")]),
      reportedOn: new Date(single[header.indexOf("Date of reporting")]),
      reportedBy: single[header.indexOf("Reporter name")],
      location: single[header.indexOf("Incident Location ")],
      riskCategory: single[header.indexOf("Minexx risk category")],
      indicator: single[header.indexOf("Incident indicator ")],
      proof: single[header.indexOf("Proof")],
      image: single[header.indexOf("Image")],
      description: single[header.indexOf("Incident description ")],
      score: single[header.indexOf("Incident score")],
      level: single[header.indexOf("Incident level")],
      source: single[header.indexOf("Source of information")],
      detailedDescription: single[header.indexOf("Detailed description of the incident below")],
      company: single[header.indexOf("Company Name")],
    });
    incidents.push(incident);
  });

  return incidents;
};

{/**
 *
 * @param {String} id - Unique identifier for incident being fetched
*/}
const getIncident = async (id) => {
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.incident, range: "Incident Form!A2:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0);

  const single = rows.filter((one)=>one[header.indexOf("Incident number/ID")] === id);

  if (single.length == 0) {
    throw new Error("The incident with the unique identifier was not found on our records.");
  }

  const incident = new Incident({
    id: single[0][header.indexOf("Incident number/ID")],
    date: new Date(single[0][header.indexOf("Incident date")]),
    reportedOn: new Date(single[0][header.indexOf("Date of reporting")]),
    reportedBy: single[0][header.indexOf("Reporter name")],
    location: single[0][header.indexOf("Incident Location ")],
    riskCategory: single[0][header.indexOf("Minexx risk category")],
    indicator: single[0][header.indexOf("Incident indicator ")],
    proof: single[0][header.indexOf("Proof")],
    image: single[0][header.indexOf("Image")],
    description: single[0][header.indexOf("Incident description ")],
    score: single[0][header.indexOf("Incident score")],
    level: single[0][header.indexOf("Incident level")],
    source: single[0][header.indexOf("Source of information")],
    detailedDescription: single[0][header.indexOf("Detailed description of the incident below")],
    company: single[0][header.indexOf("Company Name")],
  });

  return incident;
};

{/**
 *
 * @param {String} id - Uniquie identifier of mine whose incidents are being fetched
 * @returns
*/}
const getMineIncidents = async (id) => {
  const incidents = [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.incident, range: "Incident Form!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Incident number/ID")] && item[header.indexOf("Incident Location ")] === id);

  for (const single of rows) {
    const proof = await getFile(single[header.indexOf("Proof")].split("/")[1]);
    const image = await getFile(single[header.indexOf("Image")].split("/")[1]);
    const incident = new Incident({
      id: single[header.indexOf("Incident number/ID")],
      date: new Date(single[header.indexOf("Incident date")]),
      reportedOn: new Date(single[header.indexOf("Date of reporting")]),
      reportedBy: single[header.indexOf("Reporter name")],
      location: single[header.indexOf("Incident Location ")],
      riskCategory: single[header.indexOf("Minexx risk category")],
      indicator: single[header.indexOf("Incident indicator ")],
      proof: proof || null,
      image: image || null,
      description: single[header.indexOf("Incident description ")],
      score: single[header.indexOf("Incident score")],
      level: single[header.indexOf("Incident level")],
      source: single[header.indexOf("Source of information")],
      detailedDescription: single[header.indexOf("Detailed description of the incident below")],
      company: single[header.indexOf("Company Name")],
    });
    incidents.push(incident);
  }

  return incidents;
};

{/**
 *
 * @param {String} id - Uniquie identifier of company whose incidents are being fetched
 * @returns
*/}
const getCompanyIncidents = async (id) => {
  const incidents = [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.incident, range: "Incident Form!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Incident number/ID")]);

  for await (const single of rows) {
    const proof = await getFile(single[header.indexOf("Proof")].split("/")[1]);
    const image = await getFile(single[header.indexOf("Image")].split("/")[1]);
    const incident = new Incident({
      id: single[header.indexOf("Incident number/ID")],
      date: new Date(single[header.indexOf("Incident date")]),
      reportedOn: new Date(single[header.indexOf("Date of reporting")]),
      reportedBy: single[header.indexOf("Reporter name")],
      location: single[header.indexOf("Incident Location ")],
      riskCategory: single[header.indexOf("Minexx risk category")],
      indicator: single[header.indexOf("Incident indicator ")],
      proof: proof,
      image: image,
      description: single[header.indexOf("Incident description ")],
      score: single[header.indexOf("Incident score")],
      level: single[header.indexOf("Incident level")],
      source: single[header.indexOf("Source of information")],
      detailedDescription: single[header.indexOf("Detailed description of the incident below")],
      company: single[header.indexOf("Company Name")],
    });
    if (incident.company === id) {
      incidents.push(incident);
    }
  }

  return incidents;
};

module.exports = {
  getIncidents,
  getIncident,
  getMineIncidents,
  getCompanyIncidents,
};
