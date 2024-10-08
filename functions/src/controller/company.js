const {requireUser} = require("../middleware/requireUser");
const {getCompanies, getCompany, getCompanyShareholders, getCompanyBeneficialOwners, getCompanyDocuments, getAllCompanies} = require("../services/company");
const {get} = require("lodash");

const getCompaniesHandler = async (req, res) => {
  try {
    const {user} = res.locals;
    const platform = get(req, `headers.x-platform`);
    const companies = await getCompanies(user, platform || "3ts");
    res.send({
      success: true,
      companies,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getAllCompaniesHandler = async (req, res) => {
  try {
    const {user} = res.locals;
    const companies = await getAllCompanies(user);
    res.send({
      success: true,
      companies,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getCompanyHandler = async (req, res) => {
  try {
    const {id} = req.params;
    const platform = get(req, `headers.x-platform`);
    const company = await getCompany(id, platform || "3ts");

    res.send({
      success: true,
      company,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getCompanyBenficialOwnersHandler = async (req, res) => {
  try {
    const {id} = req.params;
    const platform = get(req, `headers.x-platform`);
    const beneficialOwners = await getCompanyBeneficialOwners(id, platform || "3ts");

    res.send({
      success: true,
      beneficial_owners: beneficialOwners,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getCompanyShareholdersHandler = async (req, res) => {
  try {
    const {id} = req.params;
    const platform = get(req, `headers.x-platform`);
    const shareholders = await getCompanyShareholders(id, platform || "3ts");

    res.send({
      success: true,
      shareholders,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getCompanyDocumentsHandler = async (req, res) => {
  try {
    const {id} = req.params;
    const platform = get(req, `headers.x-platform`);
    const documents = await getCompanyDocuments(id, platform || "3ts");

    res.send({
      success: true,
      documents,
    });
  } catch (err) {
    res.status(409).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = (app)=>{
  app.get(`/companies`, requireUser, getCompaniesHandler);
  app.get(`/companies/all`, requireUser, getAllCompaniesHandler);
  app.get(`/companies/:id`, requireUser, getCompanyHandler);
  app.get(`/owners/:id`, requireUser, getCompanyBenficialOwnersHandler);
  app.get(`/shareholders/:id`, requireUser, getCompanyShareholdersHandler);
  app.get(`/documents/:id`, requireUser, getCompanyDocumentsHandler);
};
