const {requireUser} = require("../middleware/requireUser");
const {getAssessments, getMineAssessments} = require("../services/assessment");
const {get} = require("lodash");

const getAssessmentsHandler = async (req, res) => {
  try {
    const {user} = res.locals;
    const platform = get(req, `headers.x-platform`) || "3ts";
    const {assessments, header} = await getAssessments(user, platform);

    res.send({
      success: true,
      assessments,
      header,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getMineAssessmentHandler = async (req, res) => {
  try {
    const {id} = req.params;
    const {user} = res.locals;
    const platform = get(req, `headers.x-platform`) || "3ts";
    const {assessments, header} = await getMineAssessments(id, user, platform);

    res.send({
      success: true,
      assessments,
      header,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = (app)=>{
  app.get(`/assessments`, requireUser, getAssessmentsHandler);
  app.get(`/assessments/mine/:id`, requireUser, getMineAssessmentHandler);
};
