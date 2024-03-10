const {getExports, getExport} = require("../services/export");

const getExportsHandler = async (req, res) => {
  try {
    const exports = await getExports();

    res.send({
      success: true,
      exports,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getExportHandler = async (req, res) => {
  try {
    const {id} = req.params;
    const export_ = await getExport(id);

    res.send({
      success: true,
      export: export_,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = (app)=>{
  app.get(`/exports`, getExportsHandler);
  app.get(`/exports/:id`, getExportHandler);
};
