const {requireUser} = require("../middleware/requireUser");
const {getExports, getExport} = require("../services/export");
const logger = require("../utils/logger");
const {get} = require("lodash");

const getExportsHandler = async (req, res) => {
  const {user} = res.locals;
  try {
    const platform = get(req, `headers.x-platform`) || "3ts";
    const exports = await getExports(user, platform);
    logger.success(req.originalUrl, "Request to specified endpoint was successful", user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    res.send({
      success: true,
      exports,
      user,
    });
  } catch (err) {
    logger.success(req.originalUrl, err.message, user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getExportHandler = async (req, res) => {
  const {user} = res.locals;
  try {
    const {id} = req.params;
    const platform = get(req, `headers.x-platform`) || "3ts";
    const export_ = await getExport(id, platform);

    logger.success(req.originalUrl, "Request to specified endpoint was successful", user.email, req.header("x-forwarded-for") || req.socket.remoteAddress);
    res.send({
      success: true,
      export: export_,
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
  app.get(`/exports`, requireUser, getExportsHandler);
  app.get(`/exports/:id`, requireUser, getExportHandler);
};
