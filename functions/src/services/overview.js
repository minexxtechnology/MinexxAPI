const {getAssessments} = require("./assessment");
const {getExports} = require("./export");
const {getIncidents} = require("./incident");
const moment = require("moment");

/**
 *
 * @param {User} user - The user making the request to fetch assessment overview information
 * @param {String} platform - The platform to fetch from
 */
const assessmentsOverview = async (user, platform)=>{
  let response = (await getAssessments(user, platform));
  const header = response.header;
  response = response.assessments;

  let count = 0;
  const months = [
    moment().subtract(6, "months").toDate(),
    moment().subtract(5, "months").toDate(),
    moment().subtract(4, "months").toDate(),
    moment().subtract(3, "months").toDate(),
    moment().subtract(2, "months").toDate(),
    moment().subtract(1, "months").toDate(),
    new Date(),
  ];
  const assessments = [0, 0, 0, 0, 0, 0];

  response.map((assessment)=>{
    months.map((month, i)=>{
      if (moment(new Date(assessment.general[header.indexOf("Assessment Period (start date)")])).isBetween(month, months[i+1]) && i < 7) {
        assessments[i] += 1;
        count += 1;
      }
    });
  });

  return {assessments, count};
};

/**
 *
 * @param {User} user - The user making the request to fetch the exports overview information
 * @param {String} platform - The platform to fetch from
 */
const exportsOverview = async (user, platform)=> {
  const response = (await getExports(user, platform));

  const exports = [0, 0, 0, 0, 0, 0];
  let count = 0;
  let volume = 0;
  const months = [
    moment().subtract(6, "months").toDate(),
    moment().subtract(5, "months").toDate(),
    moment().subtract(4, "months").toDate(),
    moment().subtract(3, "months").toDate(),
    moment().subtract(2, "months").toDate(),
    moment().subtract(1, "months").toDate(),
    new Date(),
  ];
  response.map((single)=>{
    volume += Number(single.netWeight);
    months.map((month, i)=>{
      if (moment(single.date).isBetween(month, months[i+1]) && i < 7) {
        exports[i] += 1;
        count += 1;
      }
    });
  });

  return {exports, volume, count};
};

/**
 *
 * @param {User} user - The user making the request to fetch incidents overview information
 * @param {String} platform - The platform to fetch from
 */
const incidentsOverview = async (user, platform)=> {
  const response = (await getIncidents(user, platform));

  const incidents = [0, 0, 0, 0, 0, 0];
  let count = 0;
  const months = [
    moment().subtract(6, "months").toDate(),
    moment().subtract(5, "months").toDate(),
    moment().subtract(4, "months").toDate(),
    moment().subtract(3, "months").toDate(),
    moment().subtract(2, "months").toDate(),
    moment().subtract(1, "months").toDate(),
    new Date(),
  ];

  response.map((single)=>{
    months.map((month, i)=>{
      if (moment(single.date).isBetween(month, months[i+1]) && i < 7) {
        incidents[i] += 1;
        count += 1;
      }
    });
  });

  return {incidents, count};
};

/**
 *
 * @param {User} user - The user making the request to fetch incident risks information
 * @param {String} platform - The platform to fetch from
 */
const incidentRisks = async (user, platform)=> {
  const incidents = (await getIncidents(user, platform));
  const risks = [0, 0, 0, 0, 0, 0, 0];
  incidents.map((single)=>{
    if (single.riskCategory.toLowerCase().includes("legitimacy")) {
      risks[0] += 1;
    } else if (single.riskCategory.toLowerCase().includes("rights")) {
      risks[1] += 1;
    } else if (single.riskCategory.toLowerCase().includes("welfare")) {
      risks[2] += 1;
    } else if (single.riskCategory.toLowerCase().includes("governance")) {
      risks[3] += 1;
    } else if (single.riskCategory.toLowerCase().includes("traceability")) {
      risks[4] += 1;
    } else if (single.riskCategory.toLowerCase().includes("environment")) {
      risks[5] += 1;
    } else if (single.riskCategory.toLowerCase().includes("impact")) {
      risks[6] += 1;
    }
  });
  return risks;
};

module.exports = {
  incidentRisks,
  incidentsOverview,
  exportsOverview,
  assessmentsOverview,
};
