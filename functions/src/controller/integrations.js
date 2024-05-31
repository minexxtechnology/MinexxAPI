const {requireUser} = require("../middleware/requireUser");
const {metalsAPI} = require("../services/integrations");

const metalsAPIHandler = async (req, res) => {
  try {
    // const {user} = res.locals;
    const rates = await metalsAPI();
    res.send({
      success: false,
      rates,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = (app) => {
  app.get("/metals-api", requireUser, metalsAPIHandler);
};
