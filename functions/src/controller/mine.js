const {getMines, getMine, getMineImages, getMineVideos} = require("../services/mine");
const {requireUser} = require("../middleware/requireUser");

const getMinesHandler = async (req, res) => {
  try {
    const {user} = res.locals;
    const mines = await getMines(user);

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

const getCompanyMinesHandler = async (req, res) => {
  try {
    const {id} = req.params;
    let mines = await getMines();
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
    const mine = await getMine(id);

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

    const images = await getMineImages(id);

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

const getMineVideosHandler = async (req, res) => {
  try {
    const {id} = req.params;

    const videos = await getMineVideos(id);

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
  app.get(`/mines/:id`, requireUser, getMineHandler);
  app.get(`/mines/images/:id`, requireUser, getMineImagesHandler);
  app.get(`/mines/videos/:id`, requireUser, getMineVideosHandler);
  app.get(`/mines/company/:id`, requireUser, getCompanyMinesHandler);
};
