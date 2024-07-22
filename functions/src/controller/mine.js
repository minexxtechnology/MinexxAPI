const {getMines, getMine, getMineImages, getMineVideos, getMiners} = require("../services/mine");
const {requireUser} = require("../middleware/requireUser");
const {get} = require("lodash");
const {getFile} = require("../services/file");

const getMinesHandler = async (req, res) => {
  try {
    // const {user} = res.locals;
    const platform = get(req, `headers.x-platform`);
    const mines = await getMines(platform || `3ts`);

    res.send({
      success: true,
      mines,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getMinersHandler = async (req, res) => {
  try {
    const {mine} = req.params;
    const {miners, header} = await getMiners(mine);

    res.send({
      success: true,
      header,
      miners,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getCompanyMinesHandler = async (req, res) => {
  try {
    const {id} = req.params;
    const platform = get(req, `headers.x-platform`);
    let mines = await getMines(platform || `3ts`);
    mines = mines.filter((mine)=>mine.company === id);

    res.send({
      success: true,
      mines,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getMineHandler = async (req, res) => {
  try {
    const {id} = req.params;
    const platform = get(req, `headers.x-platform`);
    const mine = await getMine(id, platform || `3ts`);

    res.send({
      success: true,
      mine,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getMineImagesHandler = async (req, res) => {
  try {
    const {id} = req.params;

    const platform = get(req, `headers.x-platform`);
    const images = await getMineImages(id, platform || `3ts`);

    res.send({
      success: true,
      images,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getImageHandler = async (req, res) => {
  const {file} = req.body;
  try {
    const image = await getFile(file.split(`/`)[1]);

    res.send({
      success: true,
      image,
      file,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
      file,
    });
  }
};

const getMineVideosHandler = async (req, res) => {
  try {
    const {id} = req.params;

    const platform = get(req, `headers.x-platform`);
    const videos = await getMineVideos(id, platform || `3ts`);

    res.send({
      success: true,
      videos,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = (app)=>{
  app.get(`/mines`, requireUser, getMinesHandler);
  app.get(`/miners/:mine`, requireUser, getMinersHandler);
  app.get(`/mines/:id`, requireUser, getMineHandler);
  app.get(`/mines/images/:id`, requireUser, getMineImagesHandler);
  app.get(`/mines/videos/:id`, requireUser, getMineVideosHandler);
  app.post(`/image`, requireUser, getImageHandler);
  app.get(`/mines/company/:id`, requireUser, getCompanyMinesHandler);
};
