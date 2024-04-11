const {requireUser} = require("../middleware/requireUser");
const {getCompanies, getCompany, getCompanyShareholders, getCompanyBeneficialOwners, getCompanyDocuments} = require("../services/company");

const getCompaniesHandler = async (req, res) => {
  try {
    const {user} = res.locals;
    console.log(user);
    const companies = await getCompanies(user);

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
    const company = await getCompany(id);

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
    const beneficialOwners = await getCompanyBeneficialOwners(id);

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
    const shareholders = await getCompanyShareholders(id);

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
    const documents = await getCompanyDocuments(id);

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
  app.get(`/companies/:id`, requireUser, getCompanyHandler);
  app.get(`/owners/:id`, requireUser, getCompanyBenficialOwnersHandler);
  app.get(`/shareholders/:id`, requireUser, getCompanyShareholdersHandler);
  app.get(`/documents/:id`, requireUser, getCompanyDocumentsHandler);
};
