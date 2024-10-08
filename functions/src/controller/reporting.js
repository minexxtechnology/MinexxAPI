const {getPurchases, getDailyReport, getBalanceReport, getPurchaseReport, getSystemLogs, getTraceProduction, getAdminDaily, getTraceBagsProduced, getTraceBagsProcessed, getTraceProcessing, getTraceDrums, getTraceBlending, getTracePurchase} = require("../services/reporting");
const {requireUser} = require("../middleware/requireUser");
const {requireAdmin} = require("../middleware/requireAdmin");
const logger = require("../utils/logger");
const {getSessions} = require("../services/session");
const {getCompanyExports} = require("../services/export");
const {get} = require("lodash");

const getPurchasesHandler = async (req, res) => {
  const {user} = res.locals;
  try {
    const {user} = res.locals;
    const purchases = await getPurchases();
    logger.success(req.originalUrl, "Request to specified endpoint was successful", user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);

    res.send({
      success: true,
      purchases,
    });
  } catch (err) {
    logger.success(req.originalUrl, err.message, user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getDailyReportHandler = async (req, res) => {
  const {user} = res.locals;
  try {
    const {user} = res.locals;
    const report = await getDailyReport(user);
    logger.success(req.originalUrl, "Request to specified endpoint was successful", user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);

    res.send({
      success: true,
      ...report,
    });
  } catch (err) {
    logger.success(req.originalUrl, err.message, user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getAdminDailyReportHandler = async (req, res) => {
  const {user} = res.locals;
  try {
    const {user} = res.locals;
    const {selection} = req.params;
    const platform = get(req, `headers.x-platform`);
    const report = await getAdminDaily(selection, platform || "3ts");
    logger.success(req.originalUrl, "Request to specified endpoint was successful", user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);

    res.send({
      success: true,
      ...report,
    });
  } catch (err) {
    logger.success(req.originalUrl, err.message, user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getBalanceReportHandler = async (req, res) => {
  const {user} = res.locals;
  try {
    const {user} = res.locals;
    const report = await getBalanceReport(user);
    logger.success(req.originalUrl, "Request to specified endpoint was successful", user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);

    res.send({
      success: true,
      ...report,
    });
  } catch (err) {
    logger.success(req.originalUrl, err.message, user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getPurchaseReportHandler = async (req, res) => {
  const {user} = res.locals;
  try {
    const {user} = res.locals;
    const report = await getPurchaseReport(user);
    logger.success(req.originalUrl, "Request to specified endpoint was successful", user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);

    res.send({
      success: true,
      ...report,
    });
  } catch (err) {
    logger.success(req.originalUrl, err.message, user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getSystemLogsHandler = async (req, res) => {
  const {user} = res.locals;
  try {
    const logs = await getSystemLogs();
    logger.success(req.originalUrl, "Request to specified endpoint was successful", user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    return res.send({
      success: true,
      logs,
    });
  } catch (err) {
    logger.success(req.originalUrl, err.message, user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getSessionsHandler = async (req, res) => {
  const {user} = res.locals;
  try {
    const sessions = await getSessions();
    logger.success(req.originalUrl, "Request to specified endpoint was successful", user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    return res.send({
      success: true,
      sessions,
    });
  } catch (err) {
    logger.success(req.originalUrl, err.message, user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getTraceReport = async (req, res) => {
  const {user} = res.locals;
  try {
    const {id} = req.params;
    const platform = get(req, `headers.x-platform`) || `3ts`;
    const production = await getTraceProduction(id, platform);
    const bags = await getTraceBagsProduced(id);
    const processing = await getTraceProcessing(id);
    const bagsProc = await getTraceBagsProcessed(id);
    const purchases = await getTracePurchase(id);
    const blending = await getTraceBlending(id);
    const drums = await getTraceDrums(id);
    const exports = await getCompanyExports(id, platform || `3ts`);
    logger.success(req.originalUrl, "Request to specified endpoint was successful", user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    return res.send({
      success: true,
      trace: {
        production,
        bags,
        blending,
        processing,
        bags_proc: bagsProc,
        drums,
        exports,
        purchases,
      },
    });
  } catch (err) {
    logger.success(req.originalUrl, err.message, user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = (app)=>{
  app.get(`/logs`, requireAdmin, getSystemLogsHandler);
  app.get(`/admin/:selection`, requireAdmin, getAdminDailyReportHandler);
  app.get(`/sessions`, requireAdmin, getSessionsHandler);
  app.get(`/purchases`, requireUser, getPurchasesHandler);
  app.get(`/report/daily`, requireUser, getDailyReportHandler);
  app.get(`/report/mtd`, requireUser, getBalanceReportHandler);
  app.get(`/report/deliveries`, requireUser, getPurchaseReportHandler);
  app.get(`/report/trace/:id`, requireUser, getTraceReport);
};
