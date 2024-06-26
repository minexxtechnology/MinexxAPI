const {getPurchases, getDailyReport, getBalanceReport, getPurchaseReport} = require("../services/purchase");
const {requireUser} = require("../middleware/requireUser");

const getPurchasesHandler = async (req, res) => {
  try {
    const {user} = res.locals;
    const purchases = await getPurchases(user);

    res.send({
      success: true,
      purchases,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getDailyReportHandler = async (req, res) => {
  try {
    const {user} = res.locals;
    const report = await getDailyReport(user);

    res.send({
      success: true,
      ...report,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getBalanceReportHandler = async (req, res) => {
  try {
    const {user} = res.locals;
    const report = await getBalanceReport(user);

    res.send({
      success: true,
      ...report,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getPurchaseReportHandler = async (req, res) => {
  try {
    const {user} = res.locals;
    const report = await getPurchaseReport(user);

    res.send({
      success: true,
      ...report,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = (app)=>{
  app.get(`/purchases`, requireUser, getPurchasesHandler);
  app.get(`/report/daily`, requireUser, getDailyReportHandler);
  app.get(`/report/mtd`, requireUser, getBalanceReportHandler);
  app.get(`/report/deliveries`, requireUser, getPurchaseReportHandler);
};
