const {getIncidents, getIncident, getCompanyIncidents, getMineIncidents} = require("../services/incident");
const {get} = require("lodash");

const getIncidentsHandler = async (req, res) => {
  try {
    const {user} = res.locals;
    const platform = get(req, `headers.x-platform`);
    const incidents = await getIncidents(user, platform || "3ts");

    res.send({
      success: true,
      incidents,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getCompanyIncidentsHandler = async (req, res) => {
  try {
    const {id} = req.params;
    const platform = get(req, `headers.x-platform`);
    const incidents = await getCompanyIncidents(id, platform || "3ts");

    res.send({
      success: true,
      incidents,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getMineIncidentsHandler = async (req, res) => {
  try {
    const {id} = req.params;
    const platform = get(req, `headers.x-platform`);
    const incidents = await getMineIncidents(id, platform || "3ts");

    res.send({
      success: true,
      incidents,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getIncidentHandler = async (req, res) => {
  try {
    const {id} = req.params;
    const platform = get(req, `headers.x-platform`);
    const incident = await getIncident(id, platform || "3ts");

    res.send({
      success: true,
      incident,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = (app)=>{
  app.get(`/incidents`, getIncidentsHandler);
  app.get(`/incidents/:id`, getIncidentHandler);
  app.get(`/incidents/company/:id`, getCompanyIncidentsHandler);
  app.get(`/incidents/mine/:id`, getMineIncidentsHandler);
};
