const {requireUser} = require("../middleware/requireUser");
const {assessmentsOverview, exportsOverview, incidentsOverview, incidentRisks} = require("../services/overview");
const {get} = require("lodash");

const getAssessmentsOverview = async (req, res) => {
  try {
    const {user} = res.locals;
    const platform = get(req, `headers.x-platform`);
    const assessments = await assessmentsOverview(user, platform || `3ts`);
    res.send({
      success: false,
      ...assessments,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getExportsOverview = async (req, res) => {
  try {
    const {user} = res.locals;
    const platform = get(req, `headers.x-platform`);
    const exports = await exportsOverview(user, platform || `3ts`);
    res.send({
      success: false,
      ...exports,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getIncidentsOverview = async (req, res) => {
  try {
    const {user} = res.locals;
    const platform = get(req, `headers.x-platform`);
    const incidents = await incidentsOverview(user, platform || `3ts`);
    res.send({
      success: false,
      ...incidents,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getIncidentRisks = async (req, res) => {
  try {
    const {user} = res.locals;
    const platform = get(req, `headers.x-platform`);
    const risks = await incidentRisks(user, platform || `3ts`);
    res.send({
      success: false,
      risks,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = (app)=>{
  app.get(`/overview/assessments`, requireUser, getAssessmentsOverview);
  app.get(`/overview/incidents`, requireUser, getIncidentsOverview);
  app.get(`/overview/exports`, requireUser, getExportsOverview);
  app.get(`/overview/risks`, requireUser, getIncidentRisks);
};
