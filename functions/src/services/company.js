const BeneficialOwner = require("../model/beneficialOwner");
const Company = require("../model/company");
const Shareholder = require("../model/shareholder");
const {sheets, spreadsheets} = require("../utils/connect");
const {getFile} = require("./file");

/**
 *
 * @param {User} user - The user making the request for fetch companies information
 * @param {String} platform - The platform to fetch from
 */
const getCompanies = async (user, platform) => {
  let companies = [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[platform].company, range: "Company!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Unique ID")]);

  rows.map((single)=>{
    const company = new Company({
      id: single[header.indexOf("Unique ID")],
      name: single[header.indexOf("Company Name")],
      address: single[header.indexOf("Company Address")],
      number: single[header.indexOf("Company Number")],
      country: single[header.indexOf("Company Country")],
      type: single[header.indexOf("Type")],
      created: new Date(single[header.indexOf("Timestamp Signed")]),
      mining: single[header.indexOf("Mining")] === `TRUE`,
    });
    if (user.type === "buyer" || user.type === "investor") {
      if (company.mining) {
        companies.push(company);
      }
    } else {
      companies.push(company);
    }
  });

  if (user.type === `buyer` || user.type === `investor`) {
    companies = companies.filter((company)=>user.companies.includes(company.id));
  }

  return companies;
};

/**
 *
 * @param {String} id - Unique identifier for company being fetched
 * @param {String} platform - The platform to fetch from
 */
const getCompany = async (id, platform) => {
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[platform].company, range: "Company!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Unique ID")] && item[header.indexOf("Unique ID")] === id );

  if (rows.length === 0) {
    throw new Error("The company with the unique identifier was not found on our records.");
  }

  const single = rows[0];

  const company = new Company({
    id: single[header.indexOf("Unique ID")],
    name: single[header.indexOf("Company Name")],
    address: single[header.indexOf("Company Address")],
    number: single[header.indexOf("Company Number")],
    country: single[header.indexOf("Company Country")],
    type: single[header.indexOf("Type")],
    created: new Date(single[header.indexOf("Timestamp Signed")]),
    mining: single[header.indexOf("Mining")] === `TRUE`,
  });

  return company;
};

/**
 *
 * @param {String} id - Unique identifier for company beneficial owners being fetched
 * @param {String} platform - The platform to fetch from
 */
const getCompanyBeneficialOwners = async (id, platform) => {
  const owners = [];

  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[platform].owners, range: "Beneficial Owners!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Unique ID")] && item[header.indexOf("Company")] === id);

  rows.map((single)=>{
    const owner = new BeneficialOwner({
      id: single[0],
      company: single[1],
      name: single[2],
      percent: Number(single[3])*100,
      nationality: single[4],
      nationalID: single[5],
      address: single[6],
    });
    owners.push(owner);
  });

  return owners;
};

/**
 *
 * @param {String} id - Unique identifier for company shareholders being fetched
 * @param {String} platform - The platform to fetch from
 */
const getCompanyShareholders = async (id, platform) => {
  const shareholders = [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[platform].shareholders, range: "Shareholders!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Unique ID")] && item[header.indexOf("Company")] === id);

  for await (const single of rows) {
    let image = null;
    try {
      image = await getFile(single[5].split("/")[1]);
    } catch (err) {/* empty body*/}
    const shareholder = new Shareholder({
      id: single[0],
      company: single[1],
      name: single[2],
      percent: Number(single[3])*100,
      nationality: single[4],
      nationalID: image,
      address: single[6],
    });
    shareholders.push(shareholder);
  }

  return shareholders;
};

/**
 *
 * @param {String} id - Unique identifier for company shareholders being fetched
 * @param {String} platform - The platform to fetch from
 */
const getCompanyDocuments = async (id, platform) => {
  const documents = [];

  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[platform].company_documents, range: "Company Documents!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Unique ID")] && item[header.indexOf("Company")] === id);

  for await (const row of rows) {
    const file = await getFile(row[header.indexOf("Attachment")].split("/")[1]);
    const doc = {
      file,
      type: row[header.indexOf("Other Document")] ? `${row[header.indexOf("Document")]} | ${row[header.indexOf("Other Document")]}` : row[header.indexOf("Document")],
      date: new Date(row[header.indexOf("Timestamp")]),
    };
    documents.push(doc);
  }

  return documents;
};

module.exports = {
  getCompanies,
  getCompany,
  getCompanyDocuments,
  getCompanyShareholders,
  getCompanyBeneficialOwners,
};
