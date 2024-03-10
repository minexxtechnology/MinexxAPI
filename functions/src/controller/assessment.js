const {getAssessments, getMineAssessments} = require("../services/assessment");

const getAssessmentsHandler = async (req, res) => {
  try {
    const {assessments, header} = await getAssessments();

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
    const {assessments, header} = await getMineAssessments(id);

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
  app.get(`/assessments`, getAssessmentsHandler);
  app.get(`/assessments/mine/:id`, getMineAssessmentHandler);
};
