const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const app = express();

// import controller routers
const assessments = require("./src/controller/assessment.js");
const companies = require("./src/controller/company.js");
const exports_ = require("./src/controller/export.js");
const incidents = require("./src/controller/incident.js");
const overview = require("./src/controller/overview.js");
const mines = require("./src/controller/mine.js");

// setup express
app.use(cors({
  origin: "*",
  methods: "GET,PUT,DELETE,POST",
  optionsSuccessStatus: 200,
}));
app.use(express.json({limit: "50mb"}));
app.use(express.raw({limit: "50mb"}));


// create endpoints
assessments(app);
companies(app);
exports_(app);
incidents(app);
overview(app);
mines(app);

app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "The API is stable. All endpoints are responding normally",
    copyrights: {
      company: "Minexx",
      website: "https://minexx.co",
    },
    documentation: "https://docs.minexx.co",
  });
});

app.listen(3001, ()=>{});
exports.minexx = onRequest(app);
