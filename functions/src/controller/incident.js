const {getIncidents, getIncident, getCompanyIncidents, getMineIncidents} = require("../services/incident");

const getIncidentsHandler = async (req, res) => {
  try {
    const incidents = await getIncidents();

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
    const incidents = await getCompanyIncidents(id);

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
    const incidents = await getMineIncidents(id);

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
    const incident = await getIncident(id);

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
