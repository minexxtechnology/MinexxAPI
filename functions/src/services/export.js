const Export = require("../model/export");
const {sheets, spreadsheets} = require("../utils/connect");
const {getCompany} = require("./company");
const {getFile} = require("./file");

const getExports = async (user, dashboard) => {
  const exports = [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[dashboard].export, range: `${dashboard === "3ts" ? "Export" : "Gold"}!A:ZZ`});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf(dashboard === "3ts" ? "Exportation ID" : "Transaction Unique ID")]);

  // if (dashboard === "3ts") {
  for await (const single of rows) {
    const export_ = new Export({
      id: rows.indexOf(single),
      blendingID: single[header.indexOf(`Blending ID`)],
      date: single[header.indexOf(dashboard === "3ts" ? `Date` : `Export date`)],
      mineral: single[header.indexOf(dashboard === "3ts" ? `Mineral Type` : `Type of minerals exported`)],
      grade: single[header.indexOf(dashboard === "3ts" ? `Grade ` : `Purity in %`)],
      value: single[header.indexOf(dashboard === "3ts" ? `Export value (USD)`: `Total value in USD`)],
      netWeight: single[header.indexOf(dashboard === "3ts" ? `Net Weight (kg)` : `Ouput weight (after processing/refining) in g`)],
      grossWeight: single[header.indexOf(dashboard === "3ts" ? `Gross Weight (kg)`: `Input weight (processing/refining) in g`)],
      stockBalance: single[header.indexOf(dashboard === "3ts" ? `Stock Balance` : ``)],
      exportationID: single[header.indexOf(dashboard === "3ts" ? `Exportation ID` : `Shipment number`)],
      rmbRep: single[header.indexOf(dashboard === "3ts" ? `RMB Representative` : ``)],
      exportRep: single[header.indexOf(dashboard === "3ts" ? `Exporter Representative` : `Name of processor/refiner/exporter`)],
      traceabilityAgent: single[header.indexOf(dashboard === "3ts" ? `Traceability Agent` : ``)],
      destination: single[header.indexOf(dashboard === "3ts" ? `Destination` : `Destination city and country`)],
      itinerary: single[header.indexOf(dashboard === "3ts" ? `Itinerary` : ``)],
      shipmentNumber: single[header.indexOf(dashboard === "3ts" ? `Shipment Number` : ``)],
      exportCert: single[header.indexOf(dashboard === "3ts" ? `Export Certificate Number` : ``)],
      rraCert: single[header.indexOf(dashboard === "3ts" ? `RRA certificate Number` : ``)],
      transporter: single[header.indexOf(dashboard === "3ts" ? `Transporter` : `Transporter name`)],
      driverID: single[header.indexOf(dashboard === "3ts" ? `ID Number of the driver` : ``)],
      truckFrontPlate: single[header.indexOf(dashboard === "3ts" ? `Truck Plate Number - Front` : ``)],
      truckBackPlate: single[header.indexOf(dashboard === "3ts" ? `Truck Plate Number - Back` : ``)],
      tags: single[header.indexOf(dashboard === "3ts" ? `Number of tags` : ``)],
      totalGrossWeight: single[header.indexOf(dashboard === "3ts" ? `Total Gross Weight(kg)` : ``)],
      totalNetWeight: single[header.indexOf(dashboard === "3ts" ? `Total Net Weight(kg)` : ``)],
      company: single[header.indexOf(dashboard === "3ts" ? `Company Name` : `Company name`)],
      itsciForms: single[header.indexOf(dashboard === "3ts" ? `All ITSCI forms (mine & processing, export) signed and scanned` : ``)],
      note: single[header.indexOf(dashboard === "3ts" ? `Note` : ``)],
      picture: single[header.indexOf(dashboard === "3ts" ? `Picture` : ``)],
      otherDocument: single[header.indexOf(dashboard === "3ts" ? `Other Document` : `EXPORT DOCUMENTS`)],
      transporterDocument: single[header.indexOf(dashboard === "3ts" ? `Transporter Document` : ``)],
      asiDocument: single[header.indexOf(dashboard === "3ts" ? `ASI Document` : ``)],
      rraExportDocument: single[header.indexOf(dashboard === "3ts" ? `RRA Export Document` : ``)],
      rmbExportDocument: single[header.indexOf(dashboard === "3ts" ? `RMB Export Document` : ``)],
      exporterApplicationDocument: single[header.indexOf(dashboard === "3ts" ? `Exporter Application Document` : `Export approval`)],
      scannedExportDocuments: single[header.indexOf(dashboard === "3ts" ? `Scanned Export Documents` : `Essay report`)],
      link: single[header.indexOf(dashboard === "3ts" ? `Track` : `Track`)],
    });
    try {
      export_.company = await getCompany(export_.company, dashboard);
    } catch (err) {
      throw new Error(err.message);
    }
    if (user.type !== "minexx") {
      if (user.minerals.includes(export_.mineral)) {
        exports.push(export_);
      }
    } else {
      exports.push(export_);
    }
  }
  return exports.reverse();
  // } else {
  //   return {header, rows};
  // }
};

const getCompanyExports = async (id, dashboard) => {
  const exports = [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[dashboard].export, range: `${dashboard === "3ts" ? "Export" : "Gold"}!A:ZZ`});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf(dashboard === "3ts" ? "Exportation ID" : "Transaction Unique ID")] && item[header.indexOf(`${dashboard === "3ts" ? "Company Name" : "Company name"}`)] === id);

  for await (const single of rows) {
    const export_ = new Export({
      id: rows.indexOf(single),
      blendingID: single[header.indexOf(`Blending ID`)],
      date: single[header.indexOf(dashboard === "3ts" ? `Date` : `Export date`)],
      mineral: single[header.indexOf(dashboard === "3ts" ? `Mineral Type` : `Type of minerals exported`)],
      grade: single[header.indexOf(dashboard === "3ts" ? `Grade ` : `Purity in %`)],
      value: single[header.indexOf(dashboard === "3ts" ? `Export value (USD)`: `Total value in USD`)],
      netWeight: single[header.indexOf(dashboard === "3ts" ? `Net Weight (kg)` : `Ouput weight (after processing/refining) in g`)],
      grossWeight: single[header.indexOf(dashboard === "3ts" ? `Gross Weight (kg)`: `Input weight (processing/refining) in g`)],
      stockBalance: single[header.indexOf(`Stock Balance`)],
      exportationID: single[header.indexOf(dashboard === "3ts" ? `Exportation ID` : `Shipment number`)],
      rmbRep: single[header.indexOf(`RMB Representative`)],
      exportRep: single[header.indexOf(dashboard === "3ts" ? `Exporter Representative` : `Name of processor/refiner/exporter`)],
      traceabilityAgent: single[header.indexOf(`Traceability Agent`)],
      destination: single[header.indexOf(dashboard === "3ts" ? `Destination` : `Destination city and country`)],
      itinerary: single[header.indexOf(`Itinerary`)],
      shipmentNumber: single[header.indexOf(`Shipment Number`)],
      exportCert: single[header.indexOf(`Export Certificate Number`)],
      rraCert: single[header.indexOf(`RRA certificate Number`)],
      transporter: single[header.indexOf(dashboard === "3ts" ? `Transporter` : `Transporter name`)],
      driverID: single[header.indexOf(`ID Number of the driver`)],
      truckFrontPlate: single[header.indexOf(`Truck Plate Number - Front`)],
      truckBackPlate: single[header.indexOf(`Truck Plate Number - Back`)],
      tags: single[header.indexOf(`Number of tags`)],
      totalGrossWeight: single[header.indexOf(`Total Gross Weight(kg)`)],
      totalNetWeight: single[header.indexOf(`Total Net Weight(kg)`)],
      company: single[header.indexOf(`Company Name`)],
      itsciForms: single[header.indexOf(`All ITSCI forms (mine & processing, export) signed and scanned`)],
      note: single[header.indexOf(dashboard === "3ts" ? `Note` : `Non-narcotics Note`)],
      picture: single[header.indexOf(`Picture`)],
      otherDocument: single[header.indexOf(dashboard === "3ts" ? `Other Document` : `EXPORT DOCUMENTS`)],
      transporterDocument: single[header.indexOf(`Transporter Document`)],
      asiDocument: single[header.indexOf(`ASI Document`)],
      rraExportDocument: single[header.indexOf(`RRA Export Document`)],
      rmbExportDocument: single[header.indexOf(`RMB Export Document`)],
      exporterApplicationDocument: single[header.indexOf(dashboard === "3ts" ? `Exporter Application Document` : `Export approval`)],
      scannedExportDocuments: single[header.indexOf(dashboard === "3ts" ? `Scanned Export Documents` : `Essay report`)],
      link: single[header.indexOf(dashboard === "3ts" ? `Track` : `Track`)],
      provisionalInvoice: single[header.indexOf(dashboard === "3ts" ? `Provisional Invoice` : `Exporter invoice`)],
      cargoReceipt: single[header.indexOf(`Freight Forwarder’s Cargo Receipt`)],
      packingReport: single[header.indexOf(dashboard === "3ts" ? `Alex Stewart Packing report ` : `Packing list`)],
      warehouseCert: single[header.indexOf(`Original Warehouse Certificate`)],
      insuranceCert: single[header.indexOf(`Certificate of insurance`)],
      billOfLanding: single[header.indexOf(`Bill of Lading `)],
      telex: single[header.indexOf(`Telex`)],
      c2: single[header.indexOf(`C2 Form`)],
      mineSheets: single[header.indexOf(`Mine Sheets`)],
      processingSheets: single[header.indexOf(`Processing Sheets`)],
      customsDeclaration: single[header.indexOf(dashboard === "3ts" ? `RRA Customs declaration` : `Copy of Customs Declaration `)],
      tagList: single[header.indexOf(dashboard === "3ts" ? `Tag list` : ``)],
    });
    try {
      export_.company = await getCompany(export_.company, dashboard);
    } catch (err) {
      // empty body
    }
    exports.push(export_);
  }
  return exports.reverse();
};

{/**
 *
 * @param {Number} id - Index of the exportation details being fetched
 * @returns
*/}
const getExport = async (id, dashboard) => {
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets[dashboard].export, range: `${dashboard === "3ts" ? "Export" : "Gold"}!A:ZZ`});
  const header = results.data.values[0];
  const single = results.data.values.filter((item, i)=>i>0 && item[header.indexOf(dashboard === "3ts" ? "Exportation ID" : "Transaction Unique ID")])[id];

  const export_ = new Export({
    id,
    blendingID: single[header.indexOf(`Blending ID`)],
    date: single[header.indexOf(dashboard === "3ts" ? `Date` : `Export date`)],
    mineral: single[header.indexOf(dashboard === "3ts" ? `Mineral Type` : `Type of minerals exported`)],
    grade: single[header.indexOf(dashboard === "3ts" ? `Grade ` : `Purity in %`)],
    value: single[header.indexOf(dashboard === "3ts" ? `Export value (USD)`: `Total value in USD`)],
    netWeight: single[header.indexOf(dashboard === "3ts" ? `Net Weight (kg)` : `Ouput weight (after processing/refining) in g`)],
    grossWeight: single[header.indexOf(dashboard === "3ts" ? `Gross Weight (kg)`: `Input weight (processing/refining) in g`)],
    stockBalance: single[header.indexOf(`Stock Balance`)],
    exportationID: single[header.indexOf(dashboard === "3ts" ? `Exportation ID` : `Gold Export License Number`)],
    rmbRep: single[header.indexOf(`RMB Representative`)],
    exportRep: single[header.indexOf(dashboard === "3ts" ? `Exporter Representative` : `Name of processor/refiner/exporter`)],
    traceabilityAgent: single[header.indexOf(`Traceability Agent`)],
    destination: single[header.indexOf(dashboard === "3ts" ? `Destination` : `Destination city and country`)],
    itinerary: single[header.indexOf(`Itinerary`)],
    shipmentNumber: single[header.indexOf(dashboard === "3ts" ? `Shipment Number` : `Shipment number`)],
    exportCert: single[header.indexOf(dashboard === "3ts" ? `Export Certificate Number`: `Gold Export License Number`)],
    rraCert: single[header.indexOf(`RRA certificate Number`)],
    transporter: single[header.indexOf(dashboard === "3ts" ? `Transporter` : `Transporter name`)],
    driverID: single[header.indexOf(`ID Number of the driver`)],
    truckFrontPlate: single[header.indexOf(`Truck Plate Number - Front`)],
    truckBackPlate: single[header.indexOf(`Truck Plate Number - Back`)],
    tags: single[header.indexOf(`Number of tags`)],
    totalGrossWeight: single[header.indexOf(`Total Gross Weight(kg)`)],
    totalNetWeight: single[header.indexOf(`Total Net Weight(kg)`)],
    company: single[header.indexOf(`Company Name`)],
    itsciForms: single[header.indexOf(`All ITSCI forms (mine & processing, export) signed and scanned`)],
    note: single[header.indexOf(dashboard === "3ts" ? `Note` : `Non-narcotics Note`)],
    picture: single[header.indexOf(dashboard === "3ts" ? `Picture` : `Picture`)],
    otherDocument: single[header.indexOf(dashboard === "3ts" ? `Other Document` : `Proof of payment of Essay and witholding tax`)],
    transporterDocument: single[header.indexOf(`Transporter Document`)],
    asiDocument: single[header.indexOf(`ASI Document`)],
    rraExportDocument: single[header.indexOf(`RRA Export Document`)],
    rmbExportDocument: single[header.indexOf(`RMB Export Document`)],
    exporterApplicationDocument: single[header.indexOf(dashboard === "3ts" ? `Exporter Application Document` : `Export approval`)],
    scannedExportDocuments: single[header.indexOf(dashboard === "3ts" ? `Scanned Export Documents` : `Essay report`)],
    link: single[header.indexOf(dashboard === "3ts" ? `Track` : `Track`)],
    provisionalInvoice: single[header.indexOf(dashboard === "3ts" ? `Provisional Invoice` : `Exporter invoice`)],
    cargoReceipt: single[header.indexOf(`Freight Forwarder’s Cargo Receipt`)],
    packingReport: single[header.indexOf(dashboard === "3ts" ? `Alex Stewart Packing report ` : `Packing list`)],
    warehouseCert: single[header.indexOf(`Original Warehouse Certificate`)],
    insuranceCert: single[header.indexOf(`Certificate of insurance`)],
    billOfLanding: single[header.indexOf(`Bill of Lading `)],
    telex: single[header.indexOf(`Telex`)],
    c2: single[header.indexOf(`C2 Form`)],
    mineSheets: single[header.indexOf(`Mine Sheets`)],
    processingSheets: single[header.indexOf(`Processing Sheets`)],
    customsDeclaration: single[header.indexOf(dashboard === "3ts" ? `RRA Customs declaration` : `Copy of Customs Declaration `)],
    tagList: single[header.indexOf(dashboard === "3ts" ? `Tag list` : ``)],
    exportApproval: single[header.indexOf(`Export approval`)],
  });

  try {
    export_.company = await getCompany(export_.company, dashboard);
  } catch (err) {/* empty */}

  try {
    export_.exportApproval = await getFile(export_.exportApproval.split(`/`)[1]);
  } catch (err) {/* empty */}

  try {
    export_.itsciForms = await getFile(export_.itsciForms.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.picture = await getFile(export_.picture.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.note = await getFile(export_.note.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.otherDocument = await getFile(export_.otherDocument.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.transporterDocument = await getFile(export_.transporterDocument.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.asiDocument = await getFile(export_.asiDocument.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.rraExportDocument = await getFile(export_.rraExportDocument.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.rmbExportDocument = await getFile(export_.rmbExportDocument.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.exporterApplicationDocument = await getFile(export_.exporterApplicationDocument.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.scannedExportDocuments = await getFile(export_.scannedExportDocuments.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.tagList = await getFile(export_.tagList.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.provisionalInvoice = await getFile(export_.provisionalInvoice.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.cargoReceipt = await getFile(export_.cargoReceipt.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.packingReport = await getFile(export_.packingReport.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.warehouseCert = await getFile(export_.warehouseCert.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.insuranceCert = await getFile(export_.insuranceCert.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.billOfLanding = await getFile(export_.billOfLanding.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.telex = await getFile(export_.telex.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.c2 = await getFile(export_.c2.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.mineSheets = await getFile(export_.mineSheets.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.processingSheets = await getFile(export_.processingSheets.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.customsDeclaration = await getFile(export_.customsDeclaration.split(`/`)[1]);
  } catch (err) {/* empty */}

  return export_;
};

module.exports = {
  getExport,
  getExports,
  getCompanyExports,
};
