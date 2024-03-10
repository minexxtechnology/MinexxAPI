const {assessmentsOverview, exportsOverview, incidentsOverview, incidentRisks} = require("../services/overview");

const getAssessmentsOverview = async (req, res) => {
  try {
    const assessments = await assessmentsOverview();
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
    const exports = await exportsOverview();
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
    const incidents = await incidentsOverview();
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
    const risks = await incidentRisks();
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
  app.get(`/overview/assessments`, getAssessmentsOverview);
  app.get(`/overview/incidents`, getIncidentsOverview);
  app.get(`/overview/exports`, getExportsOverview);
  app.get(`/overview/risks`, getIncidentRisks);
};
